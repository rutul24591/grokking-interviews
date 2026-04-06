# File Upload Widget — Implementation Walkthrough

## Architecture Overview

This implementation follows a **store + service + component** pattern:

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   DropZone      │────▶│  Zustand Store   │────▶│   FileList        │
│   (file input)  │     │  (state+queue)   │     │   (file items)    │
└─────────────────┘     └────────┬─────────┘     └───────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           ┌────────▼────────┐      ┌────────▼────────┐
           │  Upload Service  │      │  Chunk Manager  │
           │  (HTTP comms)    │      │  (slicing+loop) │
           └────────┬─────────┘      └────────┬─────────┘
                    │                         │
           ┌────────▼─────────────────────────▼────────┐
           │          IndexedDB (resume state)          │
           └────────────────────────────────────────────┘
                    │
           ┌────────▼────────┐
           │  Pre-signed URLs│
           │  (direct to S3) │
           └─────────────────┘
```

### Design Decisions

1. **Zustand for state management** — Zero boilerplate, selector-based subscriptions prevent unnecessary re-renders. Each FileListItem only re-renders when its own file's state changes.

2. **Chunked upload with Blob.slice()** — Blob.slice() is a lazy operation (creates a view, not a copy), so chunking has O(1) time and space complexity. Only the current chunk's data is read into memory during upload.

3. **Sequential chunk upload per file** — Chunks upload one at a time per file, preserving order for server-side assembly. Parallel chunk upload is possible but adds complexity (out-of-order assembly, multiple in-flight retries).

4. **IndexedDB for resume state** — Unlike localStorage (5 MB limit), IndexedDB handles large structured data. We store uploadId, completed chunk indices, and file metadata — NOT the File object itself (re-obtained from user on resume).

5. **Pre-signed URLs for direct-to-S3 upload** — The application server only handles init (generate URLs) and complete (assemble chunks). All chunk data goes directly to S3, eliminating server bandwidth costs.

6. **XMLHttpRequest for upload progress** — Fetch API doesn't support upload progress events natively. XMLHttpRequest provides `xhr.upload.onprogress` for per-chunk byte-level progress tracking.

## File Structure

```
example-1/
├── lib/
│   ├── upload-types.ts          # TypeScript interfaces, constants, helpers
│   ├── upload-store.ts          # Zustand store with queue management + IndexedDB
│   └── indexeddb-helper.ts      # Promise-based IndexedDB wrapper
├── components/
│   ├── drop-zone.tsx            # Drag-drop zone with visual feedback + keyboard
│   ├── file-list.tsx            # File list container + resume session prompt
│   └── file-list-item.tsx       # Single file entry with preview, progress, actions
├── services/
│   ├── upload-service.ts        # HTTP communication (init, chunk PUT, complete)
│   └── chunk-manager.ts         # File slicing + sequential chunk upload execution
├── api/
│   └── upload-api.ts            # Public API facade
└── EXPLANATION.md               # This file
```

## Key Implementation Details

### Upload Types (lib/upload-types.ts)

Defines the core data structures:

- **UploadStatus**: `queued | uploading | paused | completed | failed | cancelled` — the lifecycle states of a file upload.
- **ChunkStatus**: `pending | uploading | completed | failed` — per-chunk state.
- **ChunkState**: Holds the Blob slice, byte size, status, progress (0-100), retry count, and pre-signed URL.
- **UploadFile**: Aggregates file metadata, chunks array, overall status, computed progress, uploadId, and AbortController reference.
- **UploadConfig**: Customizable parameters — chunk size (default 5 MB), concurrency limit (default 3), max retries (default 3), allowed MIME types, max file size (default 5 GB).

Helper functions:
- `formatFileSize(bytes)` — human-readable string (B, KB, MB, GB).
- `computeProgress(chunks)` — computes overall percentage from completed chunk count.

### Zustand Store (lib/upload-store.ts)

The store is the single source of truth. Key aspects:

- **State**: `Map<string, UploadFile>` for O(1) file lookup, `string[]` queue for ordering, `activeCount` for concurrency tracking, `UploadConfig` for parameters, `resumableSessions` for incomplete uploads found on mount.

- **addFiles**: Accepts FileList or File[]. Validates each file (type, size), creates UploadFile with chunk metadata via `createChunks()`, adds to queue. Immediately starts uploads for available slots.

- **startUpload**: The core lifecycle method. Removes file from queue, creates AbortController, calls `initUpload` on the server to get uploadId + pre-signed URLs, then delegates to `executeUpload` for chunk processing. On completion/failure, decrements activeCount and starts the next queued file.

- **cancelUpload**: Aborts the AbortController (kills in-flight XHR), deletes IndexedDB session, removes file from Map and queue.

- **retryFile**: Resets failed chunks to pending (keeping completed ones), re-queues the file, and starts upload if a slot is available.

- **resumeSessions / dismissResumeSession**: Loads incomplete uploads from IndexedDB on mount. User can choose to resume (re-request pre-signed URLs, continue from first pending chunk) or discard (delete from IndexedDB).

### Upload Service (services/upload-service.ts)

Handles all HTTP communication:

- **initUpload**: POST to `/api/upload/init` with file metadata + CSRF token. Server responds with `uploadId` and array of pre-signed URLs.

- **uploadChunk**: PUT to pre-signed URL with the chunk Blob. Uses XMLHttpRequest (not fetch) for `xhr.upload.onprogress` events. Accepts AbortSignal for cancellation.

- **uploadChunkWithRetry**: Wraps `uploadChunk` with exponential backoff retry. Delays: 1s, 2s, 4s, 8s (with 30% jitter). Max retries configurable (default: 3). Does NOT retry on abort or 403 (expired URL — requires URL refresh).

- **completeUpload**: POST to `/api/upload/complete` with uploadId and chunk ETags. Server assembles the final file.

### Chunk Manager (services/chunk-manager.ts)

Orchestrates the chunk upload loop:

1. Iterates through chunks sequentially (index 0 to N-1).
2. Skips already-completed chunks (supports resume).
3. Checks AbortController before each chunk.
4. Calls `uploadChunkWithRetry` with progress callbacks.
5. On chunk success: updates status, persists to IndexedDB.
6. On chunk failure: marks as failed, notifies callbacks.
7. After all chunks: calls `completeUpload`, deletes IndexedDB session.

Decoupled from the store — receives callbacks for state updates rather than directly mutating store state.

### IndexedDB Helper (lib/indexeddb-helper.ts)

Promise-based wrapper around IndexedDB:

- **openDB**: Opens/creates the database with object store `upload-sessions`.
- **saveSession**: Upserts a session record (called after each chunk completion).
- **loadSessions**: Retrieves all incomplete sessions (called on mount).
- **deleteSession**: Removes a session (called on completion or cancellation).
- **clearAllSessions**: Wipes all sessions (for testing/debugging).

Does NOT store File objects — they are too large and are re-obtained from the user on resume.

### Drop Zone (components/drop-zone.tsx)

The drag-and-drop entry point:

1. **Drag events**: `onDragOver` prevents default and sets `isDragOver` state (triggers visual highlight). `onDragLeave` resets. `onDrop` extracts files from DataTransfer.

2. **Folder detection**: Uses `webkitGetAsEntry()` to detect if dropped items are files or directories. Rejects folders with an error message.

3. **File picker fallback**: Hidden `<input type="file" multiple>` triggered by click or keyboard (Enter/Space).

4. **Keyboard accessibility**: `tabIndex={0}`, `role="button"`, handles Enter/Space keys.

5. **Visual feedback**: Border color and background change on dragover (blue highlight). CSS transitions for smooth state changes.

### File List Item (components/file-list-item.tsx)

Renders a single file entry:

1. **FilePreview**: For images, creates a thumbnail via `URL.createObjectURL()` (revoked on unmount to prevent memory leaks). For non-images, shows a 4-character type label (PDF, DOC, XLS, etc.) in a colored box.

2. **Status badge**: Colored pill showing current status (queued=gray, uploading=blue, completed=green, failed=red).

3. **Progress bar**: Overall percentage with filled-width div. Uses `role="progressbar"` with ARIA attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`).

4. **Segmented chunk progress**: Mini blocks (one per chunk, max 50 displayed) showing per-chunk status (green=complete, blue=uploading, red=failed, gray=pending).

5. **Action buttons**: Cancel (for uploading/queued files) aborts the AbortController. Retry (for failed files) resets failed chunks and re-queues.

### File List (components/file-list.tsx)

Container component that:

1. Loads resume sessions on mount via `useEffect`.
2. Displays a resume prompt for each incomplete upload with Resume/Discard buttons.
3. Shows queue info (X uploading, Y queued).
4. Renders a FileListItem for each file in the store.

## Usage

### 1. Add the widget to your page

```tsx
import { DropZone } from '@/components/drop-zone';
import { FileList } from '@/components/file-list';

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Upload Files</h1>
      <DropZone />
      <FileList />
    </div>
  );
}
```

### 2. Configure (optional)

```tsx
import { uploadApi } from '@/api/upload-api';

// Increase concurrency for high-bandwidth scenarios
uploadApi.setConfig({ concurrencyLimit: 5 });

// Restrict to specific file types
uploadApi.setConfig({
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  maxFileSize: 100 * 1024 * 1024, // 100 MB
});
```

### 3. Programmatic control

```tsx
import { uploadApi } from '@/api/upload-api';

// Cancel all uploads
uploadApi.cancelAll();

// Retry a specific file
uploadApi.retry(fileId);

// Get current progress
const progress = uploadApi.getProgress(fileId);
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Folder dropped | Detected via webkitGetAsEntry(), rejected with error message |
| 100 files dropped at once | All validated, first 3 upload, 97 queue |
| Network disconnect mid-upload | Retry with exponential backoff; after max retries, marked failed |
| Pre-signed URL expires (403) | Detected, error message suggests URL refresh (not auto-retried) |
| Page reload during upload | IndexedDB persists state, resume prompt appears on next visit |
| Browser crash | Same as page reload — IndexedDB survives crashes |
| Same file selected twice | Each gets unique fileId + uploadId, treated as separate uploads |
| Invalid MIME type | Rejected before any network request with clear error message |
| File exceeds max size | Rejected before any network request with size limit message |
| Image thumbnail memory leak | URL.createObjectURL() revoked in useEffect cleanup |
| Cancel mid-chunk | AbortController aborts XHR, no retry, IndexedDB cleaned up |
| CSRF token missing | Read from `<meta name="csrf-token">`; empty string if not found (server should reject) |

## Performance Characteristics

- **addFiles (validation + chunking)**: O(n * c) — n files, c chunks each. Blob.slice() is O(1).
- **Blob.slice()**: O(1) — lazy reference, no memory copy.
- **Upload chunk**: O(chunkSize / bandwidth) — network-bound, not CPU-bound.
- **Progress computation**: O(c) — iterates chunks, computed on demand via selector.
- **IndexedDB write**: O(1) — single record upsert per chunk completion.
- **Cancel upload**: O(1) — abort signal + Map delete.
- **Animation**: GPU-composited (width transition on progress bar div).

## Testing Strategy

1. **Unit tests**: Test chunk creation (byte boundaries), validateFile (type/size checks), computeProgress (correct percentage), backoffDelay (exponential + jitter).

2. **Integration tests**: Mock fetch/XHR, render DropZone + FileList, drop files, assert state transitions through queued → uploading → completed. Test retry flow (mock failures, verify backoff). Test cancel flow (verify AbortController.abort called, IndexedDB deleted).

3. **Resume tests**: Seed IndexedDB with incomplete session, mount widget, assert resume prompt appears. User clicks resume, assert upload continues from correct chunk.

4. **Accessibility tests**: Run axe-core on rendered components, verify aria-live regions, progressbar roles, keyboard navigation through drop zone and file list.

5. **Edge case tests**: Drop folder (reject), drop 100 files (queue), network disconnect (retry), pre-signed URL expiry (403 detection).

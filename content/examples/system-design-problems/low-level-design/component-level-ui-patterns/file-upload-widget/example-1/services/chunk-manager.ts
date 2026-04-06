import type { ChunkState, UploadFile } from '../lib/upload-types';
import { uploadChunkWithRetry, completeUpload } from '../services/upload-service';
import { saveSession, deleteSession } from '../lib/indexeddb-helper';

/**
 * Chunk Manager — handles file slicing and sequential chunk upload execution.
 *
 * Responsibilities:
 * - Split file into chunks via Blob.slice()
 * - Upload chunks sequentially per file
 * - Update chunk status and progress
 * - Persist progress to IndexedDB after each chunk
 * - Call completeUpload when all chunks succeed
 */

interface ChunkManagerCallbacks {
  onChunkComplete: (fileId: string, chunkIndex: number, etag: string) => void;
  onChunkFailed: (fileId: string, chunkIndex: number, error: string) => void;
  onChunkProgress: (fileId: string, chunkIndex: number, progress: number) => void;
  onAllComplete: (fileId: string) => void;
  onAllFailed: (fileId: string, error: string) => void;
}

export async function executeUpload(
  file: UploadFile,
  csrfToken: string,
  callbacks: ChunkManagerCallbacks
): Promise<void> {
  const { id: fileId, chunks, uploadId, file: blobFile, type: fileType } = file;

  if (!uploadId) {
    callbacks.onAllFailed(fileId, 'No uploadId — call initUpload first');
    return;
  }

  const abortController = new AbortController();
  // Note: In the store, this controller is attached to the UploadFile.
  // For this manager, we receive it as a parameter or create a new one.

  const etags: string[] = new Array(chunks.length).fill('');

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Skip already completed chunks (for resume)
    if (chunk.status === 'completed') {
      continue;
    }

    // Check if aborted
    if (abortController.signal.aborted) {
      return;
    }

    chunk.status = 'uploading';
    chunk.progress = 0;

    try {
      await uploadChunkWithRetry(
        chunk.blob,
        chunk.presignedUrl,
        fileType || 'application/octet-stream',
        abortController.signal,
        3, // maxRetries
        i,
        (loaded, total) => {
          chunk.progress = Math.round((loaded / total) * 100);
          callbacks.onChunkProgress(fileId, i, chunk.progress);
        }
      );

      chunk.status = 'completed';
      chunk.progress = 100;
      etags[i] = `etag-chunk-${i}`; // In production, extract ETag from response headers

      callbacks.onChunkComplete(fileId, i, etags[i]);

      // Persist to IndexedDB
      const completedIndices = chunks
        .filter((c) => c.status === 'completed')
        .map((c) => c.index);

      await saveSession({
        uploadId,
        fileId,
        fileName: blobFile.name,
        fileSize: blobFile.size,
        fileType: blobFile.type,
        totalChunks: chunks.length,
        completedChunks: completedIndices,
        apiEndpoint: '/api/upload',
        createdAt: Date.now(),
      });
    } catch (error) {
      chunk.status = 'failed';
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      callbacks.onChunkFailed(fileId, i, errorMessage);

      if (error instanceof DOMException && error.name === 'AbortError') {
        return; // Cancelled by user
      }

      callbacks.onAllFailed(fileId, `Chunk ${i} failed: ${errorMessage}`);
      return;
    }
  }

  // All chunks completed — notify server to assemble
  try {
    await completeUpload(uploadId, etags, '/api/upload', csrfToken, abortController.signal);
    callbacks.onAllComplete(fileId);

    // Clean up IndexedDB
    await deleteSession(uploadId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Complete upload failed';
    callbacks.onAllFailed(fileId, errorMessage);
  }
}

import type { ChunkState } from './upload-types';

/**
 * Upload service — handles HTTP communication for file uploads.
 *
 * 1. initUpload: POST to server to get uploadId + pre-signed URLs
 * 2. uploadChunk: PUT chunk to pre-signed URL
 * 3. completeUpload: POST to server to finalize assembly
 *
 * All methods accept an AbortSignal for cancellation support.
 */

interface InitUploadResponse {
  uploadId: string;
  presignedUrls: string[];
}

interface InitUploadPayload {
  fileName: string;
  fileSize: number;
  fileType: string;
  chunkCount: number;
  csrfToken: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with jitter.
 * retryCount starts at 0: delays are 1s, 2s, 4s, 8s, ...
 * Jitter adds randomness to prevent thundering herd.
 */
function backoffDelay(retryCount: number, baseMs: number = 1000): number {
  const exponential = baseMs * 2 ** retryCount;
  const jitter = Math.random() * 0.3 * exponential; // +/- 30% jitter
  return exponential + jitter;
}

export async function initUpload(
  payload: InitUploadPayload,
  apiEndpoint: string,
  signal: AbortSignal
): Promise<InitUploadResponse> {
  const response = await fetch(`${apiEndpoint}/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': payload.csrfToken,
    },
    body: JSON.stringify({
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileType: payload.fileType,
      chunkCount: payload.chunkCount,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Init upload failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function uploadChunk(
  chunk: Blob,
  presignedUrl: string,
  contentType: string,
  signal: AbortSignal,
  onProgress?: (bytesUploaded: number, totalBytes: number) => void
): Promise<void> {
  // Use XMLHttpRequest for progress events (fetch doesn't support upload progress natively)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.responseType = 'text';

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(event.loaded, event.total);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Chunk upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during chunk upload'));
    };

    xhr.onabort = () => {
      reject(new DOMException('Upload aborted', 'AbortError'));
    };

    xhr.send(chunk);

    // Wire up abort
    signal.addEventListener('abort', () => {
      xhr.abort();
    }, { once: true });
  });
}

export async function uploadChunkWithRetry(
  chunk: Blob,
  presignedUrl: string,
  contentType: string,
  signal: AbortSignal,
  maxRetries: number,
  chunkIndex: number,
  onProgress?: (bytesUploaded: number, totalBytes: number) => void
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await uploadChunk(chunk, presignedUrl, contentType, signal, onProgress);
      return; // Success
    } catch (error) {
      lastError = error as Error;

      // Don't retry on abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }

      // Don't retry on 403 (expired pre-signed URL) — caller should refresh URLs
      if (error.message.includes('403')) {
        throw new Error(`Pre-signed URL expired for chunk ${chunkIndex}. Refresh required.`);
      }

      if (attempt < maxRetries) {
        const delay = backoffDelay(attempt);
        console.warn(
          `Chunk ${chunkIndex} upload failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms:`,
          lastError.message
        );
        await sleep(delay);
      }
    }
  }

  throw new Error(
    `Chunk ${chunkIndex} failed after ${maxRetries + 1} attempts: ${lastError?.message}`
  );
}

export async function completeUpload(
  uploadId: string,
  chunkEtags: string[],
  apiEndpoint: string,
  csrfToken: string,
  signal: AbortSignal
): Promise<void> {
  const response = await fetch(`${apiEndpoint}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({
      uploadId,
      chunkEtags,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Complete upload failed: ${response.status} ${response.statusText}`);
  }
}

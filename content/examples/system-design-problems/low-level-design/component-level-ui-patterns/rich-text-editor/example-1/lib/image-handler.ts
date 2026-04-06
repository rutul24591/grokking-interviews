// ============================================================
// image-handler.ts — Drag-drop image handling, upload progress
// tracking, inline placeholder management, and retry logic.
// ============================================================

import type { ImageData } from "./editor-types";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ── Extract Images from Drag/Drop Event ─────────────────────

export function extractImagesFromDrop(
  event: DragEvent
): File[] {
  const files = Array.from(event.dataTransfer?.files ?? []);
  return files.filter(isValidImage);
}

// ── Extract Images from Paste Event ─────────────────────────

export function extractImagesFromPaste(
  event: ClipboardEvent
): File[] {
  const items = Array.from(event.clipboardData?.items ?? []);
  const files: File[] = [];

  for (const item of items) {
    if (item.kind === "file" && isValidImageType(item.type)) {
      const file = item.getAsFile();
      if (file && isValidImage(file)) {
        files.push(file);
      }
    }
  }

  return files;
}

// ── Validate Image File ─────────────────────────────────────

function isValidImage(file: File): boolean {
  if (!isValidImageType(file.type)) return false;
  if (file.size > MAX_FILE_SIZE) {
    console.warn(`Image exceeds max size: ${file.size} bytes`);
    return false;
  }
  return true;
}

function isValidImageType(mimeType: string): boolean {
  return ALLOWED_TYPES.includes(mimeType);
}

// ── Create Image Data Object ────────────────────────────────

export function createImageData(
  file: File,
  blockId: string
): ImageData {
  return {
    id: crypto.randomUUID(),
    file,
    url: null,
    status: "pending",
    progress: 0,
    blockId,
  };
}

// ── Upload Image ────────────────────────────────────────────

export interface UploadCallbacks {
  onProgress: (imageId: string, progress: number) => void;
  onComplete: (imageId: string, url: string) => void;
  onError: (imageId: string, error: string) => void;
}

/**
 * Uploads an image file to the configured endpoint using
 * XMLHttpRequest for native progress events.
 *
 * Returns an abort controller that can be used to cancel the upload.
 */
export function uploadImage(
  imageData: ImageData,
  uploadEndpoint: string,
  callbacks: UploadCallbacks
): AbortController {
  const controller = new AbortController();

  // Create a local blob URL for the placeholder
  const blobUrl = URL.createObjectURL(imageData.file!);

  callbacks.onProgress(imageData.id, 0);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", uploadEndpoint, true);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      callbacks.onProgress(imageData.id, progress);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        const url = response.url || response.data?.url || blobUrl;
        callbacks.onComplete(imageData.id, url);
      } catch {
        // Fallback to blob URL if response doesn't contain a URL
        callbacks.onComplete(imageData.id, blobUrl);
      }
    } else {
      callbacks.onError(
        imageData.id,
        `Upload failed with status ${xhr.status}`
      );
    }
  };

  xhr.onerror = () => {
    callbacks.onError(imageData.id, "Network error during upload");
  };

  xhr.onabort = () => {
    URL.revokeObjectURL(blobUrl);
  };

  // If the abort controller is signaled, abort the XHR
  controller.signal.addEventListener("abort", () => {
    xhr.abort();
  });

  // Build form data
  const formData = new FormData();
  formData.append("image", imageData.file!);

  xhr.send(formData);

  return controller;
}

/**
 * Retries a failed image upload. Creates a new upload attempt
 * with exponential backoff.
 */
export function retryImageUpload(
  imageData: ImageData,
  uploadEndpoint: string,
  callbacks: UploadCallbacks,
  attempt: number = 1
): AbortController {
  const maxAttempts = 3;
  if (attempt > maxAttempts) {
    callbacks.onError(
      imageData.id,
      `Upload failed after ${maxAttempts} attempts`
    );
    return new AbortController();
  }

  // Exponential backoff: 1s, 2s, 4s
  const delay = Math.pow(2, attempt - 1) * 1000;

  const controller = new AbortController();

  setTimeout(() => {
    if (controller.signal.aborted) return;
    uploadImage(imageData, uploadEndpoint, callbacks);
  }, delay);

  return controller;
}

// ── Image Status Helpers ────────────────────────────────────

export function updateImageProgress(
  imageData: ImageData,
  progress: number
): ImageData {
  return {
    ...imageData,
    status: "uploading",
    progress,
  };
}

export function completeImageUpload(
  imageData: ImageData,
  url: string
): ImageData {
  return {
    ...imageData,
    status: "complete",
    url,
    progress: 100,
  };
}

export function failImageUpload(
  imageData: ImageData,
  error: string
): ImageData {
  return {
    ...imageData,
    status: "failed",
    error,
    progress: 0,
  };
}

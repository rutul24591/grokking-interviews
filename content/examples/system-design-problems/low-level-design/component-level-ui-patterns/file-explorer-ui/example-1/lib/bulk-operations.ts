import type { FileItem, BulkOperationType, BulkOperationResult } from "../lib/explorer-types";

export interface BulkOperationProgress {
  current: number;
  total: number;
  percentage: number;
  currentItem?: FileItem;
}

export type ProgressCallback = (progress: BulkOperationProgress) => void;

async function processWithProgress(
  items: FileItem[],
  operation: (item: FileItem, signal: AbortSignal) => Promise<void>,
  onProgress: ProgressCallback,
  signal: AbortSignal
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    total: items.length,
    succeeded: 0,
    failed: 0,
    errors: {},
  };

  for (let i = 0; i < items.length; i++) {
    if (signal.aborted) {
      break;
    }

    const item = items[i];
    try {
      await operation(item, signal);
      result.succeeded++;
    } catch (error) {
      result.failed++;
      result.errors[item.id] =
        error instanceof Error ? error.message : "Unknown error";
    }

    onProgress({
      current: i + 1,
      total: items.length,
      percentage: Math.round(((i + 1) / items.length) * 100),
      currentItem: item,
    });
  }

  return result;
}

export async function bulkDelete(
  items: FileItem[],
  deleteFn: (item: FileItem, signal: AbortSignal) => Promise<void>,
  onProgress: ProgressCallback,
  signal: AbortSignal
): Promise<BulkOperationResult> {
  return processWithProgress(items, deleteFn, onProgress, signal);
}

export async function bulkMove(
  items: FileItem[],
  targetDirectoryId: string,
  moveFn: (item: FileItem, targetId: string, signal: AbortSignal) => Promise<void>,
  onProgress: ProgressCallback,
  signal: AbortSignal
): Promise<BulkOperationResult> {
  const operation = (item: FileItem, s: AbortSignal) =>
    moveFn(item, targetDirectoryId, s);
  return processWithProgress(items, operation, onProgress, signal);
}

export async function bulkCopy(
  items: FileItem[],
  targetDirectoryId: string,
  copyFn: (item: FileItem, targetId: string, signal: AbortSignal) => Promise<void>,
  onProgress: ProgressCallback,
  signal: AbortSignal
): Promise<BulkOperationResult> {
  const operation = (item: FileItem, s: AbortSignal) =>
    copyFn(item, targetDirectoryId, s);
  return processWithProgress(items, operation, onProgress, signal);
}

export async function downloadAsZip(
  items: FileItem[],
  fetchFn: (item: FileItem, signal: AbortSignal) => Promise<Response>,
  onProgress: ProgressCallback,
  signal: AbortSignal
): Promise<BulkOperationResult> {
  // Dynamic import to avoid bundling JSZip when not needed
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const result: BulkOperationResult = {
    total: items.length,
    succeeded: 0,
    failed: 0,
    errors: {},
  };

  // Track used names to avoid collisions in the archive
  const usedNames = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    if (signal.aborted) {
      break;
    }

    const item = items[i];
    try {
      const response = await fetchFn(item, signal);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Ensure unique name in archive
      let archiveName = item.name;
      let counter = 1;
      while (usedNames.has(archiveName)) {
        const nameParts = item.name.split(".");
        if (nameParts.length > 1) {
          const ext = nameParts.pop();
          archiveName = `${nameParts.join(".")} (${counter}).${ext}`;
        } else {
          archiveName = `${item.name} (${counter})`;
        }
        counter++;
      }
      usedNames.add(archiveName);

      zip.file(archiveName, blob);
      result.succeeded++;
    } catch (error) {
      result.failed++;
      result.errors[item.id] =
        error instanceof Error ? error.message : "Download failed";
    }

    onProgress({
      current: i + 1,
      total: items.length,
      percentage: Math.round(((i + 1) / items.length) * 100),
      currentItem: item,
    });
  }

  // Generate the zip file and trigger download
  if (result.succeeded > 0) {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "files.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return result;
}

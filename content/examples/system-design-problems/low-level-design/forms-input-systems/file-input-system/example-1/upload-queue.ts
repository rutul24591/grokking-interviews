export type UploadId = string;

export type UploadStatus =
  | "queued"
  | "uploading"
  | "success"
  | "failed"
  | "canceled";

export type UploadItem = {
  id: UploadId;
  fileName: string;
  bytes: number;
  status: UploadStatus;
  progress: number; // 0..1
  attempts: number;
  error: string | null;
};

export type UploadPolicy = {
  maxConcurrent: number;
  maxAttempts: number;
};

export type UploadTransport = (item: UploadItem, onProgress: (p: number) => void) => Promise<void>;

export function createUploadQueue(policy: UploadPolicy, transport: UploadTransport) {
  const items = new Map<UploadId, UploadItem>();
  let running = 0;

  function snapshot() {
    return [...items.values()];
  }

  async function runNext() {
    if (running >= policy.maxConcurrent) return;
    const next = [...items.values()].find((i) => i.status === "queued");
    if (!next) return;

    running += 1;
    next.status = "uploading";
    next.attempts += 1;
    next.error = null;

    try {
      await transport(next, (p) => {
        next.progress = Math.max(0, Math.min(1, p));
      });
      next.status = "success";
      next.progress = 1;
    } catch (e) {
      next.status = "failed";
      next.error = e instanceof Error ? e.message : "upload failed";
      if (next.attempts < policy.maxAttempts) next.status = "queued";
    } finally {
      running -= 1;
      void runNext();
    }
  }

  return {
    add(id: UploadId, fileName: string, bytes: number) {
      items.set(id, {
        id,
        fileName,
        bytes,
        status: "queued",
        progress: 0,
        attempts: 0,
        error: null,
      });
      void runNext();
    },
    cancel(id: UploadId) {
      const it = items.get(id);
      if (!it) return;
      // transport-level cancellation would be wired via AbortController in production.
      it.status = "canceled";
      it.error = "canceled";
    },
    list: snapshot,
  };
}


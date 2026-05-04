export type UploadStatus =
  | "queued"
  | "hashing"
  | "uploading"
  | "committing"
  | "success"
  | "failed"
  | "canceled";

export type UploadItem = {
  id: string;
  fileName: string;
  bytes: number;
  status: UploadStatus;
  progress: number; // 0..1
  attempts: number;
  error: string | null;
};

export type Transport = {
  uploadChunk: (args: { uploadId: string; chunkIndex: number; start: number; end: number }) => Promise<void>;
  commit: (uploadId: string) => Promise<void>;
};

export type Policy = { maxConcurrentFiles: number; maxAttempts: number };

export function jitterBackoffMs(attempt: number, baseMs = 250, maxMs = 10_000) {
  const exp = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.random() * exp * 0.2;
  return Math.floor(exp + jitter);
}

export function createUploadQueue(policy: Policy) {
  const items = new Map<string, UploadItem>();
  let running = 0;

  function list() {
    return [...items.values()];
  }

  async function runNext(worker: (item: UploadItem) => Promise<void>) {
    if (running >= policy.maxConcurrentFiles) return;
    const next = [...items.values()].find((i) => i.status === "queued");
    if (!next) return;
    running += 1;
    try {
      await worker(next);
    } finally {
      running -= 1;
      void runNext(worker);
    }
  }

  return {
    add(id: string, fileName: string, bytes: number) {
      items.set(id, { id, fileName, bytes, status: "queued", progress: 0, attempts: 0, error: null });
    },
    cancel(id: string) {
      const it = items.get(id);
      if (!it) return;
      it.status = "canceled";
      it.error = "canceled";
    },
    async start(worker: (item: UploadItem) => Promise<void>) {
      for (let i = 0; i < policy.maxConcurrentFiles; i += 1) void runNext(worker);
    },
    list,
  };
}


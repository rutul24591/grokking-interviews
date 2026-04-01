const uploadState = {
  uploads: [
    { id: "u-1", name: "hero-video.mp4", progress: 10, status: "uploading" as const, partCount: 6 },
    { id: "u-2", name: "thumbnail.png", progress: 100, status: "uploaded" as const, partCount: 1 },
    { id: "u-3", name: "webinar-cut.mp4", progress: 0, status: "failed" as const, partCount: 8 }
  ],
  concurrency: 2,
  resumableEnabled: true,
  lastMessage: "Upload flows should expose progress, queueing, and retry paths instead of masking ingest failures."
};

export function snapshot() {
  return structuredClone(uploadState);
}

export function mutate(type: "start" | "retry") {
  if (type === "start") {
    uploadState.uploads = uploadState.uploads.map((upload) => ({
      ...upload,
      progress: upload.status === "uploading" ? Math.min(upload.progress + 45, 100) : upload.progress,
      status: upload.status === "uploading" && upload.progress + 45 >= 100 ? "uploaded" : upload.status
    }));
    uploadState.lastMessage = "Advanced in-flight uploads under the configured concurrency limit.";
  }

  if (type === "retry") {
    uploadState.uploads = uploadState.uploads.map((upload) =>
      upload.status === "failed" ? { ...upload, status: "uploading", progress: 15 } : upload
    );
    uploadState.lastMessage = "Retried previously failed uploads with resumable ingest enabled.";
  }

  return snapshot();
}

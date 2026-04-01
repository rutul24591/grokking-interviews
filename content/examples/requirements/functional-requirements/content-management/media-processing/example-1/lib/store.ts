const processingState = {
  jobs: [
    { id: "m-1", asset: "webinar-clip.mp4", stage: "queued" as const, outputs: [] as string[], retryCount: 0 },
    { id: "m-2", asset: "architecture-diagram.mov", stage: "transcoding" as const, outputs: ["thumbnail"], retryCount: 1 }
  ],
  outputProfiles: ["1080p", "720p", "thumbnail"],
  operatorQueue: [] as string[],
  lastMessage: "Media processing should expose derivative readiness and failure state before editors depend on the asset."
};

export function snapshot() {
  return structuredClone(processingState);
}

export function mutate(type: "advance" | "fail") {
  if (type === "advance") {
    processingState.jobs = processingState.jobs.map((job) => {
      if (job.stage === "queued") return { ...job, stage: "transcoding", outputs: ["thumbnail"] };
      if (job.stage === "transcoding") return { ...job, stage: "ready", outputs: ["thumbnail", "1080p", "720p"] };
      return job;
    });
    processingState.lastMessage = "Advanced queued jobs and attached generated derivatives.";
  }

  if (type === "fail") {
    processingState.jobs[0] = { ...processingState.jobs[0], stage: "failed", retryCount: processingState.jobs[0].retryCount + 1 };
    processingState.operatorQueue = [processingState.jobs[0].asset];
    processingState.lastMessage = "A processing job failed and now requires retry or operator review.";
  }

  return snapshot();
}

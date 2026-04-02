function detectBillingServiceEdgeCases(jobs) {
  const analysis = jobs.map((job) => ({
    id: job.id,
    replayRisk: job.sameIdempotencyKeySeen,
    staleSubscription: job.subscriptionVersionLag > 0,
    retryStorm: job.retryAttemptCount > job.maxRetryAttempts,
    action:
      job.sameIdempotencyKeySeen ? "block-posting" :
      job.subscriptionVersionLag > 0 ? "refresh-read-model" :
      job.retryAttemptCount > job.maxRetryAttempts ? "pause-job" : "continue"
  }));

  return {
    analysis,
    blockPosting: analysis.some((entry) => entry.replayRisk),
    pauseQueue: analysis.some((entry) => entry.retryStorm)
  };
}

console.log(JSON.stringify(detectBillingServiceEdgeCases([
  { id: "job-1", sameIdempotencyKeySeen: true, subscriptionVersionLag: 0, retryAttemptCount: 1, maxRetryAttempts: 3 },
  { id: "job-2", sameIdempotencyKeySeen: false, subscriptionVersionLag: 2, retryAttemptCount: 2, maxRetryAttempts: 3 },
  { id: "job-3", sameIdempotencyKeySeen: false, subscriptionVersionLag: 0, retryAttemptCount: 5, maxRetryAttempts: 3 }
]), null, 2));

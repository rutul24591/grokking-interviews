function processingFailurePolicy(job) {
  return {
    escalate: job.stage === "failed" && job.retryCount >= 2,
    action: job.stage === "failed" && job.retryCount >= 2 ? "page-operator" : job.stage === "failed" ? "retry" : "continue"
  };
}

console.log(processingFailurePolicy({ stage: "failed", retryCount: 2 }));

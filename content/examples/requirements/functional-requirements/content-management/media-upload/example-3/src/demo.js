function uploadRecoveryPolicy(upload) {
  return {
    strategy: upload.fileSizeMb > 25 ? "multipart-resumable" : "single-request",
    resumeFromPart: upload.failedPart ?? null,
    retryable: upload.status === "failed"
  };
}

console.log(uploadRecoveryPolicy({ fileSizeMb: 48, status: "failed", failedPart: 3 }));

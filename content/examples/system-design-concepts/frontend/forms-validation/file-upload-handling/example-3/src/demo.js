function recoverUploadQueue(queue) {
  const failed = queue.filter((item) => item.status === "failed");
  const processing = queue.filter((item) => item.status === "processing");
  const duplicates = queue.filter((item, index) => queue.findIndex((candidate) => candidate.name === item.name) !== index).map((item) => item.name);
  if (failed.some((item) => !item.retryable)) return { decision: "block-submit", reason: "non-retryable-failure", duplicates };
  if (duplicates.length > 0) return { decision: "dedupe-before-submit", reason: "duplicate-file-detected", duplicates };
  if (failed.length > 0 && processing.length > 0) return { decision: "allow-partial-retry", reason: "mixed-processing-and-failure", duplicates };
  return { decision: "continue", reason: "queue-safe", duplicates };
}

console.log(recoverUploadQueue([
  { name: "diagram.svg", status: "complete", retryable: false },
  { name: "diagram.svg", status: "queued", retryable: false },
  { name: "export.zip", status: "failed", retryable: true },
  { name: "report.pdf", status: "processing", retryable: false }
]));

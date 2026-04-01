const attachmentState = {
  attachments: [
    { id: "a-1", name: "retention-policy.pdf", sizeMb: 2.1, status: "uploaded" as const, scanResult: "clean" as const },
    { id: "a-2", name: "cdn-rollout-checklist.csv", sizeMb: 1.3, status: "scanning" as const, scanResult: "pending" as const }
  ],
  maxSizeMb: 10,
  acceptedTypes: ["svg", "pdf", "csv"],
  lastMessage: "Attachment workflows should surface validation, malware scan, and transfer status before editors finalize content."
};

export function snapshot() {
  return structuredClone(attachmentState);
}

export function mutate(type: "queue" | "reject") {
  if (type === "queue") {
    attachmentState.attachments.unshift({ id: `a-${attachmentState.attachments.length + 1}`, name: "diagram-export.svg", sizeMb: 0.8, status: "pending", scanResult: "pending" });
    attachmentState.lastMessage = "Queued a new attachment for upload and scan.";
  }

  if (type === "reject") {
    attachmentState.attachments.unshift({ id: `a-${attachmentState.attachments.length + 1}`, name: "oversize-archive.zip", sizeMb: 22.4, status: "rejected", scanResult: "failed" });
    attachmentState.lastMessage = "Rejected an attachment for size and scan policy reasons.";
  }

  return snapshot();
}

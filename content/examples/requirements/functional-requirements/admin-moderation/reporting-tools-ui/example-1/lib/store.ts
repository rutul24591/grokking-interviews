const reportingState = {
  reviewer: "queue-manager-1",
  reports: [
    { id: "rt-9", reason: "Harassment", target: "comment-991", status: "new" as const, reportCount: 4, queueHint: "general" },
    { id: "rt-12", reason: "Spam", target: "post-202", status: "triaged" as const, reportCount: 19, queueHint: "spam" }
  ],
  lastMessage: "Reporting tools should expose reason, target, and triage state so reports can be routed before queues are overwhelmed."
};

export function snapshot() {
  return structuredClone(reportingState);
}

export function mutate(type: "rotate-reviewer" | "triage-report", id?: string) {
  if (type === "rotate-reviewer") {
    reportingState.reviewer = reportingState.reviewer === "queue-manager-1" ? "queue-manager-2" : "queue-manager-1";
    reportingState.lastMessage = `Rotated report triage ownership to ${reportingState.reviewer}.`;
    return snapshot();
  }
  if (type === "triage-report" && id) {
    reportingState.reports = reportingState.reports.map((report) => report.id === id ? { ...report, status: "triaged" as const } : report);
    reportingState.lastMessage = `Triaged ${id} into the next moderation step.`;
  }
  return snapshot();
}

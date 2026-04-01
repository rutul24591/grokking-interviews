const workflowState = {
  title: "Media upload lifecycle",
  stage: "review" as "draft" | "review" | "approved" | "published",
  approver: null as string | null,
  blockers: ["missing-seo-review", "fact-check-pending"],
  lastMessage: "Publishing workflows should encode approvals and blockers instead of letting content jump directly to live state."
};

export function snapshot() {
  return structuredClone(workflowState);
}

export function mutate(type: "advance" | "clear-blocker") {
  if (type === "clear-blocker" && workflowState.blockers.length > 0) {
    workflowState.blockers.shift();
    workflowState.lastMessage = "Cleared one publish blocker after review.";
    return snapshot();
  }

  if (type === "advance") {
    if (workflowState.blockers.length > 0) {
      workflowState.lastMessage = "Cannot advance while blockers remain unresolved.";
      return snapshot();
    }
    workflowState.stage = workflowState.stage === "review" ? "approved" : workflowState.stage === "approved" ? "published" : workflowState.stage;
    workflowState.approver = workflowState.stage === "approved" || workflowState.stage === "published" ? "Editorial Lead" : null;
    workflowState.lastMessage = `Advanced workflow to ${workflowState.stage}.`;
  }

  return snapshot();
}

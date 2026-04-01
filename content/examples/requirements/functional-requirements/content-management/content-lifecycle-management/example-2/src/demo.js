function lifecycleTransitionDecision(stage, hasApproval, hasActiveReferences) {
  const transitions = {
    draft: hasApproval ? ["review"] : ["review"],
    review: hasApproval ? ["draft", "published"] : ["draft"],
    published: hasActiveReferences ? ["archived"] : ["archived", "deleted"],
    archived: ["published"]
  };
  return { stage, allowedTransitions: transitions[stage] ?? [] };
}

console.log(lifecycleTransitionDecision("review", false, true));

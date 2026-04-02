function moderationDecision(batch) {
  return batch.map((entry) => {
    if (entry.policyHit || entry.modelScore > 0.9) return { id: entry.id, route: "block", reason: "hard-policy-or-high-confidence" };
    if (entry.modelScore > 0.6 || entry.userAppealOpen) return { id: entry.id, route: "review", reason: "ambiguous-or-open-appeal" };
    return { id: entry.id, route: "allow", reason: "low-risk" };
  });
}

console.log(
  moderationDecision([
    { id: "post-1", modelScore: 0.71, policyHit: false, userAppealOpen: false },
    { id: "post-2", modelScore: 0.42, policyHit: false, userAppealOpen: true }
  ])
);

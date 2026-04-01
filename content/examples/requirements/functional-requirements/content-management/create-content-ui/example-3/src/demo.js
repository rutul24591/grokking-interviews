function createDraftEdgeCase({ category, templateAvailable, quotaRemaining }) {
  return {
    blocked: !templateAvailable || quotaRemaining <= 0,
    reason: !templateAvailable ? `missing-template:${category}` : quotaRemaining <= 0 ? "draft-quota-exhausted" : "ready"
  };
}

console.log(createDraftEdgeCase({ category: "requirements", templateAvailable: false, quotaRemaining: 2 }));

function canPublish({ stage, blockers }) {
  return {
    publishable: stage === "approved" && blockers.length === 0,
    reason: stage !== "approved" ? "not-approved" : blockers.length > 0 ? "blockers-open" : "ready"
  };
}

console.log(canPublish({ stage: "approved", blockers: [] }));

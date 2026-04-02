function chooseServicePath(signals) {
  return signals.map((signal) => {
    if (signal.confidence < 0.7 || signal.policy === "child-safety") return { id: signal.id, route: "human-review", reason: "low-confidence-or-sensitive-policy" };
    return { id: signal.id, route: signal.backlog > 100 ? "defer-batch" : "auto-action", reason: signal.backlog > 100 ? "backlog-pressure" : "safe-to-automate" };
  });
}

console.log(
  chooseServicePath([
    { id: "s1", confidence: 0.61, policy: "spam", backlog: 32 },
    { id: "s2", confidence: 0.92, policy: "child-safety", backlog: 2 }
  ])
);

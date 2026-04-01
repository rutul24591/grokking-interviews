function detectConflict(decisions) {
  const effects = new Set(decisions.map((decision) => decision.effect));
  return {
    conflicting: effects.size > 1,
    effects: [...effects],
    requiresAudit: effects.size > 1 || decisions.length === 0,
  };
}

console.log(detectConflict([{ source: "role", effect: "allow" }, { source: "feature-flag", effect: "deny" }]));
console.log(detectConflict([]));

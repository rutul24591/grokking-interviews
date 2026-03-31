function syncControlledState({ external, internal, selectedExists }) {
  if (!selectedExists) return { inSync: false, shouldUpdateInternal: true, reason: "active child was removed from the set" };
  return { inSync: external === internal, shouldUpdateInternal: external !== internal, reason: external === internal ? "state is synchronized" : "controlled prop should win" };
}

console.log(syncControlledState({ external: "overview", internal: "overview", selectedExists: true }));
console.log(syncControlledState({ external: "examples", internal: "overview", selectedExists: true }));
console.log(syncControlledState({ external: "examples", internal: "examples", selectedExists: false }));

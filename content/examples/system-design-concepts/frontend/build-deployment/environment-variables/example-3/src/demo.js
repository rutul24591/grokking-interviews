function detectEnvReleaseRisk(state) {
  const blockers = [];

  if (state.secretLeakedToBundle) blockers.push("rotate-secret-and-rebuild");
  if (state.healthCheckPassesWithoutRequiredRuntime) blockers.push("app-can-boot-with-broken-config");
  if (state.edgeRuntimeUsesStaleValue) blockers.push("config-drift-between-runtime-lanes");
  if (state.forcePromoteEnabled && state.missingKeyCount > 0) blockers.push("operator-can-ship-invalid-config");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", secretLeakedToBundle: false, healthCheckPassesWithoutRequiredRuntime: false, edgeRuntimeUsesStaleValue: false, forcePromoteEnabled: false, missingKeyCount: 0 },
  { id: "broken", secretLeakedToBundle: true, healthCheckPassesWithoutRequiredRuntime: true, edgeRuntimeUsesStaleValue: true, forcePromoteEnabled: true, missingKeyCount: 2 }
];

console.log(states.map(detectEnvReleaseRisk));

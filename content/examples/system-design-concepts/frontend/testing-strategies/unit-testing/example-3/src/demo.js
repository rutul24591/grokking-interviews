function detectUnitTestFragility(state) {
  const blockers = [];

  if (state.reliesOnSystemTime && !state.timeFrozen) blockers.push("time-dependent-test-can-flake");
  if (state.globalSingletonTouched && !state.singletonReset) blockers.push("global-state-leaks-between-tests");
  if (state.networkAllowedInUnitScope) blockers.push("unit-test-can-call-live-network");
  if (state.randomnessUsed && !state.seedPinned) blockers.push("random-output-breaks-determinism");
  if (state.moduleCacheSharedAcrossSuites) blockers.push("module-cache-can-hide-order-dependent-failures");

  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    remediation: blockers.length === 0 ? "healthy" : "freeze-time-reset-state-and-isolate-unit-runtime"
  };
}

const states = [
  { id: "healthy", reliesOnSystemTime: false, timeFrozen: true, globalSingletonTouched: false, singletonReset: true, networkAllowedInUnitScope: false, randomnessUsed: false, seedPinned: true, moduleCacheSharedAcrossSuites: false },
  { id: "fragile", reliesOnSystemTime: true, timeFrozen: false, globalSingletonTouched: true, singletonReset: false, networkAllowedInUnitScope: true, randomnessUsed: true, seedPinned: false, moduleCacheSharedAcrossSuites: true }
];

console.log(states.map(detectUnitTestFragility));

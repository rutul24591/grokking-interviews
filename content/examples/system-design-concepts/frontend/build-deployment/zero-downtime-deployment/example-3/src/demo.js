function detectZeroDowntimeFailure(state) {
  const blockers = [];

  if (state.newPodsReadyBeforeWarmupComplete) blockers.push("traffic-can-hit-cold-instances");
  if (state.oldPodsKilledBeforeDrainComplete) blockers.push("active-sessions-can-drop");
  if (state.assetManifestChangedWithoutVersioning) blockers.push("old-pages-can-request-missing-assets");
  if (state.backendContractChangedMidRollout) blockers.push("frontend-can-be-live-but-customer-flow-still-broken");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", newPodsReadyBeforeWarmupComplete: false, oldPodsKilledBeforeDrainComplete: false, assetManifestChangedWithoutVersioning: false, backendContractChangedMidRollout: false },
  { id: "unsafe", newPodsReadyBeforeWarmupComplete: true, oldPodsKilledBeforeDrainComplete: true, assetManifestChangedWithoutVersioning: true, backendContractChangedMidRollout: true }
];

console.log(states.map(detectZeroDowntimeFailure));

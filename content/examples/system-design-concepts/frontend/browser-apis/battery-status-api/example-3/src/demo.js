function auditBatteryDegradation(state) {
  const blockers = [];
  if (state.lowBattery && !state.pollingReduced) blockers.push("low-battery-without-refresh-downshift");
  if (state.lowBattery && state.motionEnabled) blockers.push("animation-still-running-on-low-battery");
  if (!state.signalAvailable && !state.genericFallbackVisible) blockers.push("missing-signal-hidden-from-user");
  if (state.manualOverrideLost) blockers.push("user-power-preference-not-preserved");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", lowBattery: true, pollingReduced: true, motionEnabled: false, signalAvailable: true, genericFallbackVisible: true, manualOverrideLost: false },
  { id: "broken", lowBattery: true, pollingReduced: false, motionEnabled: true, signalAvailable: false, genericFallbackVisible: false, manualOverrideLost: true }
];

console.log(states.map(auditBatteryDegradation));

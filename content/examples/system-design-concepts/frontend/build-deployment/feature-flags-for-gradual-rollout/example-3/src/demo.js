function detectFlagRollbackGap(state) {
  const blockers = [];

  if (state.flagDisabled && state.backgroundWritesContinue) blockers.push("flag-disable-does-not-stop-side-effects");
  if (state.segmentLeakActive && !state.auditTrailVisible) blockers.push("audience-leak-has-no-operator-evidence");
  if (state.flagAgeDays > 90 && !state.cleanupScheduled) blockers.push("rollout-flag-became-permanent-config-drift");
  if (state.killSwitchLatencySeconds > 30) blockers.push("disable-path-is-too-slow-for-live-regression");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", flagDisabled: false, backgroundWritesContinue: false, segmentLeakActive: false, auditTrailVisible: true, flagAgeDays: 18, cleanupScheduled: true, killSwitchLatencySeconds: 5 },
  { id: "broken", flagDisabled: true, backgroundWritesContinue: true, segmentLeakActive: true, auditTrailVisible: false, flagAgeDays: 150, cleanupScheduled: false, killSwitchLatencySeconds: 90 }
];

console.log(states.map(detectFlagRollbackGap));

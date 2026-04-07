function detectClipboardExposureRisk(state) {
  const blockers = [];
  if (state.permissionDenied && !state.manualFallbackVisible) blockers.push("clipboard-denied-without-manual-fallback");
  if (state.sensitiveVisibleOutsideConfirm) blockers.push("sensitive-value-visible-without-confirmation");
  if (state.pasteSandboxMissing) blockers.push("paste-flow-not-sandboxed");
  if (!state.copyOutcomeVisible) blockers.push("copy-result-hidden-from-user");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", permissionDenied: false, manualFallbackVisible: true, sensitiveVisibleOutsideConfirm: false, pasteSandboxMissing: false, copyOutcomeVisible: true },
  { id: "broken", permissionDenied: true, manualFallbackVisible: false, sensitiveVisibleOutsideConfirm: true, pasteSandboxMissing: true, copyOutcomeVisible: false }
];

console.log(states.map(detectClipboardExposureRisk));

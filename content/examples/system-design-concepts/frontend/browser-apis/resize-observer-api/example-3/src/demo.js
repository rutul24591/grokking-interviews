function detectResizeLoopRisk(state) {
  const blockers = [];
  if (state.loopDetected) blockers.push("resize-loop-detected");
  if (state.syncWriteBack) blockers.push("sync-layout-write-inside-callback");
  if (state.expensiveRedraw && !state.throttleVisible) blockers.push("redraw-budget-not-protected");
  if (!state.breakpointFallbackVisible) blockers.push("breakpoint-fallback-missing");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", loopDetected: false, syncWriteBack: false, expensiveRedraw: false, throttleVisible: true, breakpointFallbackVisible: true },
  { id: "broken", loopDetected: true, syncWriteBack: true, expensiveRedraw: true, throttleVisible: false, breakpointFallbackVisible: false }
];

console.log(states.map(detectResizeLoopRisk));

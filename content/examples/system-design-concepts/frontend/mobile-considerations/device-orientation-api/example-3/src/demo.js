function detectOrientationRegression(state) {
  const failures = [];
  if (state.permission === "denied" && !state.fallbackReady) failures.push("missing-fallback-layout");
  if (state.permission === "granted" && state.rotationBurst && !state.debounced) failures.push("rotation-jank-risk");
  if (state.permission === "prompt" && state.autoPrompted) failures.push("prompt-without-user-intent");
  return {
    id: state.id,
    healthy: failures.length === 0,
    failures,
    repair: failures[0] ?? "healthy"
  };
}

const states = [
  { id: "stable-session", permission: "granted", fallbackReady: true, rotationBurst: false, debounced: true, autoPrompted: false },
  { id: "broken-session", permission: "denied", fallbackReady: false, rotationBurst: true, debounced: false, autoPrompted: true }
];

console.log(states.map(detectOrientationRegression));

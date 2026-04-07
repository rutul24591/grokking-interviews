function planHapticCuePolicy(flow) {
  const actions = [];
  if (!flow.supported) actions.push("visual-or-audio-fallback");
  if (flow.urgent) actions.push("allow-strong-pattern");
  if (flow.reducedMotion || flow.optedOut) actions.push("disable-haptics");
  return {
    id: flow.id,
    actions,
    cueMode: !flow.supported || flow.reducedMotion || flow.optedOut ? "fallback" : (flow.urgent ? "urgent-haptic" : "short-confirmation"),
    shipReady: !actions.includes("visual-or-audio-fallback") || flow.fallbackDocumented
  };
}

const flows = [
  { id: "confirm", supported: true, urgent: false, reducedMotion: false, optedOut: false, fallbackDocumented: true },
  { id: "urgent", supported: true, urgent: true, reducedMotion: false, optedOut: false, fallbackDocumented: true },
  { id: "blocked", supported: false, urgent: true, reducedMotion: true, optedOut: true, fallbackDocumented: false }
];

console.log(flows.map(planHapticCuePolicy));

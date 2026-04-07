function planAnimationTimeline(flow) {
  const actions = [];
  if (!flow.handlesRetained) actions.push("retain-animation-handles");
  if (flow.queueDepth > 4) actions.push("clamp-animation-queue");
  if (!flow.pauseOffscreen) actions.push("pause-hidden-timelines");
  return {
    id: flow.id,
    actions,
    runtimeMode: flow.queueDepth > 4 ? "clamped" : "normal",
    shipReady: !actions.includes("retain-animation-handles")
  };
}

const flows = [
  { id: "hero", handlesRetained: true, queueDepth: 1, pauseOffscreen: true },
  { id: "stack", handlesRetained: true, queueDepth: 6, pauseOffscreen: true },
  { id: "runaway", handlesRetained: false, queueDepth: 9, pauseOffscreen: false }
];

console.log(flows.map(planAnimationTimeline));

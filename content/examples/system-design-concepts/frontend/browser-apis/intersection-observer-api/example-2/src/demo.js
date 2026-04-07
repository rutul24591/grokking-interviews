function planIntersectionObservers(config) {
  const actions = [];
  if (config.targetCount > 80) actions.push("collapse-to-sentinels");
  if (config.needsDwell) actions.push("attach-dwell-guard");
  if (!config.anchorStable) actions.push("enable-anchor-recovery");
  return {
    id: config.id,
    actions,
    observationMode: config.targetCount > 80 ? "sentinel" : "direct",
    shipReady: !actions.includes("enable-anchor-recovery") || config.anchorRecoveryDocumented
  };
}

const configs = [
  { id: "feed", targetCount: 42, needsDwell: false, anchorStable: true, anchorRecoveryDocumented: true },
  { id: "ads", targetCount: 25, needsDwell: true, anchorStable: true, anchorRecoveryDocumented: true },
  { id: "archive", targetCount: 190, needsDwell: false, anchorStable: false, anchorRecoveryDocumented: false }
];

console.log(configs.map(planIntersectionObservers));

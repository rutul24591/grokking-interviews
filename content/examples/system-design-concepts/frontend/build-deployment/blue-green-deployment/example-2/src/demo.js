function planBlueGreenCutover(env) {
  const actions = [];

  if (!env.parity.assetManifest || !env.parity.envContract || !env.parity.edgeRouting) {
    actions.push("restore-environment-parity");
  }
  if (!env.rollback.blueReady || env.rollback.secondsToRevert > 60) {
    actions.push("re-arm-blue-rollback-lane");
  }
  if (env.metrics.conversionDropPct >= 2 || env.metrics.clientErrorRate >= 1) {
    actions.push("freeze-traffic-expansion");
  }

  const lane = actions.includes("restore-environment-parity")
    ? "hold"
    : actions.includes("freeze-traffic-expansion")
      ? "watch"
      : "promote";

  return { id: env.id, lane, actions, ready: actions.length === 0 };
}

const environments = [
  {
    id: "catalog",
    parity: { assetManifest: true, envContract: true, edgeRouting: true },
    rollback: { blueReady: true, secondsToRevert: 30 },
    metrics: { conversionDropPct: 0.4, clientErrorRate: 0.1 }
  },
  {
    id: "search",
    parity: { assetManifest: true, envContract: false, edgeRouting: true },
    rollback: { blueReady: true, secondsToRevert: 25 },
    metrics: { conversionDropPct: 0.2, clientErrorRate: 0.2 }
  },
  {
    id: "checkout",
    parity: { assetManifest: true, envContract: true, edgeRouting: true },
    rollback: { blueReady: false, secondsToRevert: 110 },
    metrics: { conversionDropPct: 3.3, clientErrorRate: 1.5 }
  }
];

console.log(environments.map(planBlueGreenCutover));

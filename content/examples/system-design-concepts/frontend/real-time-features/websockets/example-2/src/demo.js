function chooseSocketReplayPlan(session) {
  return {
    id: session.id,
    restoreSubscriptionsFirst: session.connectionState !== "open",
    flushQueueImmediately: session.connectionState === "open" && session.outboundQueue === 0,
    degradeUi: session.heartbeatLagMs > 1000,
    manualReconnectRequired: session.connectionState === "closed"
  };
}

const sessions = [
  { id: "healthy", connectionState: "open", outboundQueue: 0, heartbeatLagMs: 120 },
  { id: "reconnecting", connectionState: "reconnecting", outboundQueue: 5, heartbeatLagMs: 900 },
  { id: "degraded", connectionState: "closed", outboundQueue: 8, heartbeatLagMs: 2400 }
];

const plans = sessions.map(chooseSocketReplayPlan);
console.log(plans);
console.log({ queuedRecoveries: plans.filter((plan) => plan.restoreSubscriptionsFirst).length });

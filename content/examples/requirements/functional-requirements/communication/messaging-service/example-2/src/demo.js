function evaluateMessagingRouting(cases) {
  return cases.map((entry) => ({
    event: entry.event,
    partition: entry.replay ? "replay" : entry.priority === "high" ? "fast-lane" : "standard",
    persistBeforeFanout: !entry.fireAndForget,
    operatorReview: entry.schemaRisk || entry.partitionLag > 1000
  }));
}

console.log(JSON.stringify(evaluateMessagingRouting([
  { event: "chat-send", replay: false, priority: "normal", fireAndForget: false, schemaRisk: false, partitionLag: 10 },
  { event: "incident-update", replay: false, priority: "high", fireAndForget: false, schemaRisk: false, partitionLag: 40 },
  { event: "repair-replay", replay: true, priority: "normal", fireAndForget: false, schemaRisk: true, partitionLag: 1400 }
]), null, 2));

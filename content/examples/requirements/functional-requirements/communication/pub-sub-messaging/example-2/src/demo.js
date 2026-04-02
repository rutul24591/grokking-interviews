function evaluatePubSubRouting(cases) {
  return cases.map((entry) => ({
    subscription: entry.subscription,
    lane: entry.replay ? "replay" : entry.priorityTopic ? "priority" : "standard",
    shouldThrottle: entry.consumerLag > 10000,
    needsCatchUpWindow: entry.consumerLag > 0 && !entry.replay
  }));
}

console.log(JSON.stringify(evaluatePubSubRouting([
  { subscription: "alerts", replay: false, priorityTopic: true, consumerLag: 0 },
  { subscription: "chat-events", replay: false, priorityTopic: false, consumerLag: 800 },
  { subscription: "audit-rebuild", replay: true, priorityTopic: false, consumerLag: 15000 }
]), null, 2));

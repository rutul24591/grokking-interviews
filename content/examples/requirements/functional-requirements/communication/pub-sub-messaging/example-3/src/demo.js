function detectPubSubFailures(cases) {
  return cases.map((entry) => ({
    subscription: entry.subscription,
    suppressReplaySideEffects: entry.replay && entry.consumerIsMutating,
    resetOffset: entry.offsetCorrupted,
    splitTopicLane: entry.lagSpillsIntoLiveTraffic
  }));
}

console.log(JSON.stringify(detectPubSubFailures([
  { subscription: "alerts", replay: false, consumerIsMutating: false, offsetCorrupted: false, lagSpillsIntoLiveTraffic: false },
  { subscription: "chat-events", replay: false, consumerIsMutating: false, offsetCorrupted: true, lagSpillsIntoLiveTraffic: true },
  { subscription: "audit-rebuild", replay: true, consumerIsMutating: true, offsetCorrupted: false, lagSpillsIntoLiveTraffic: false }
]), null, 2));

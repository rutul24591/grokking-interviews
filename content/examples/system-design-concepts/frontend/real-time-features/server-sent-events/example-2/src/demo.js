function chooseSseReconnectPlan(channel) {
  return {
    id: channel.id,
    replayBeforeLive: channel.replayGap > 0,
    reconnectDelayMs: channel.streamHealth === "repair" ? channel.retryMs * 2 : channel.retryMs,
    applyBufferedBatch: channel.bufferedEvents >= 3,
    persistCursor: Boolean(channel.lastEventId)
  };
}

const channels = [
  { id: "healthy", replayGap: 0, streamHealth: "healthy", retryMs: 3000, bufferedEvents: 1, lastEventId: "m-1024" },
  { id: "lagging", replayGap: 3, streamHealth: "lagging", retryMs: 5000, bufferedEvents: 4, lastEventId: "r-220" },
  { id: "repair", replayGap: 6, streamHealth: "repair", retryMs: 8000, bufferedEvents: 7, lastEventId: "a-88" }
];

const plans = channels.map(chooseSseReconnectPlan);
console.log(plans);
console.log({ replayRequired: plans.filter((plan) => plan.replayBeforeLive).length });

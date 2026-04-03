function detectSseFailure(state) {
  const issues = [];
  if (state.streamClosed && !state.lastEventIdPersisted) issues.push("missing-last-event-id-on-reconnect");
  if (state.replayGap > 0 && !state.replayVisible) issues.push("replay-gap-hidden");
  if (state.retryBurst && !state.backoffApplied) issues.push("reconnect-storm-risk");
  if (state.bufferedEvents > 4 && !state.catchupBadgeVisible) issues.push("buffered-burst-hidden");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues.includes("buffered-burst-hidden") ? "show-catchup-badge" : issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", streamClosed: false, lastEventIdPersisted: true, replayGap: 0, replayVisible: true, retryBurst: false, backoffApplied: true, bufferedEvents: 1, catchupBadgeVisible: true },
  { id: "broken", streamClosed: true, lastEventIdPersisted: false, replayGap: 5, replayVisible: false, retryBurst: true, backoffApplied: false, bufferedEvents: 7, catchupBadgeVisible: false }
];

const audits = states.map(detectSseFailure);
console.log(audits);
console.log({ brokenStreams: audits.filter((item) => !item.healthy).map((item) => item.id) });

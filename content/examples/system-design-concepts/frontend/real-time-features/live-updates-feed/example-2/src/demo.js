function chooseFeedUpdatePlan(feed) {
  return {
    id: feed.id,
    groupIncoming: feed.pendingItems >= 4,
    freshnessState: feed.freshnessSeconds > 10 ? "delayed" : "fresh",
    preserveScrollAnchor: !feed.autoScrollDisabled,
    resumeAction: feed.backlogState === "repair" ? "replay-from-checkpoint" : feed.pendingItems >= 4 ? "show-grouped-badge" : "stream-inline"
  };
}

const feeds = [
  { id: "fresh", pendingItems: 1, freshnessSeconds: 3, backlogState: "healthy", autoScrollDisabled: false },
  { id: "delayed", pendingItems: 5, freshnessSeconds: 16, backlogState: "growing", autoScrollDisabled: true },
  { id: "repair", pendingItems: 8, freshnessSeconds: 30, backlogState: "repair", autoScrollDisabled: false }
];

const plans = feeds.map(chooseFeedUpdatePlan);
console.log(plans);
console.log({ groupedFeeds: plans.filter((plan) => plan.groupIncoming).length });

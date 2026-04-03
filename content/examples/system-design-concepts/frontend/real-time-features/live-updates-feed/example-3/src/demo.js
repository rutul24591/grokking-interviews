function detectFeedRegression(state) {
  const blockers = [];
  if (state.freshnessSeconds > 20 && !state.staleBannerVisible) blockers.push("stale-feed-hidden");
  if (state.pendingItems > 5 && !state.groupedBadgeVisible) blockers.push("burst-not-grouped");
  if (state.filterPinned && state.filterResetDuringReplay) blockers.push("filter-reset-during-replay");
  if (state.readerFocused && state.autoScrollForced) blockers.push("auto-scroll-broke-reader-focus");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers.includes("auto-scroll-broke-reader-focus") ? "stop-forcing-scroll" : blockers[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", freshnessSeconds: 5, staleBannerVisible: true, pendingItems: 2, groupedBadgeVisible: true, filterPinned: true, filterResetDuringReplay: false, readerFocused: true, autoScrollForced: false },
  { id: "broken", freshnessSeconds: 28, staleBannerVisible: false, pendingItems: 7, groupedBadgeVisible: false, filterPinned: true, filterResetDuringReplay: true, readerFocused: true, autoScrollForced: true }
];

const audits = states.map(detectFeedRegression);
console.log(audits);
console.log({ requiredRepairs: audits.flatMap((item) => item.blockers) });

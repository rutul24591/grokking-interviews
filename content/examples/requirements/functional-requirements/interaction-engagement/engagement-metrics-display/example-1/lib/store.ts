const state = {
  range: "today" as "today" | "week" | "month",
  cards: {
    today: [
      { id: "m1", label: "Likes", value: 148, trend: "up" as const, baseline: 120, approximate: false, visibility: "feed + detail" },
      { id: "m2", label: "Comments", value: 27, trend: "flat" as const, baseline: 27, approximate: false, visibility: "detail only" },
      { id: "m3", label: "Saves", value: 13, trend: "up" as const, baseline: 8, approximate: true, visibility: "profile" },
      { id: "m4", label: "Shares", value: 9, trend: "down" as const, baseline: 11, approximate: false, visibility: "feed + detail" }
    ],
    week: [
      { id: "m1", label: "Likes", value: 812, trend: "up" as const, baseline: 706, approximate: false, visibility: "feed + detail" },
      { id: "m2", label: "Comments", value: 143, trend: "up" as const, baseline: 102, approximate: false, visibility: "detail only" },
      { id: "m3", label: "Saves", value: 94, trend: "flat" as const, baseline: 92, approximate: true, visibility: "profile" },
      { id: "m4", label: "Shares", value: 61, trend: "up" as const, baseline: 48, approximate: false, visibility: "feed + detail" }
    ],
    month: [
      { id: "m1", label: "Likes", value: 3390, trend: "up" as const, baseline: 2744, approximate: false, visibility: "feed + detail" },
      { id: "m2", label: "Comments", value: 624, trend: "up" as const, baseline: 501, approximate: false, visibility: "detail only" },
      { id: "m3", label: "Saves", value: 402, trend: "up" as const, baseline: 301, approximate: true, visibility: "profile" },
      { id: "m4", label: "Shares", value: 240, trend: "flat" as const, baseline: 237, approximate: false, visibility: "feed + detail" }
    ]
  },
  summary: {
    today: { healthyCards: 3, approximateCards: 1, lastRefreshMinutes: 2 },
    week: { healthyCards: 3, approximateCards: 1, lastRefreshMinutes: 8 },
    month: { healthyCards: 4, approximateCards: 1, lastRefreshMinutes: 22 }
  },
  lastMessage: "Metrics displays should explain trajectory, freshness, and approximation so users know when counters are exact."
};

export function snapshot() {
  return structuredClone({
    range: state.range,
    cards: state.cards[state.range],
    summary: state.summary[state.range],
    lastMessage: state.lastMessage
  });
}

export function mutate(range: "today" | "week" | "month") {
  state.range = range;
  state.lastMessage = `Loaded ${range} engagement metrics with freshness and approximation context.`;
  return snapshot();
}

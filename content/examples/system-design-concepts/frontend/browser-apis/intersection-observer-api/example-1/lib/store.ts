export const scenarios = [
  {
    "id": "feed-sentinels",
    "label": "Feed sentinels",
    "surface": "Infinite reading feed",
    "status": "healthy",
    "signal": "42 nodes observed via section sentinels",
    "budget": "0.25 threshold with stable anchors",
    "fallback": "Prefetch only one viewport ahead",
    "headline": "Sentinel-based observation keeps the feed responsive without observing every single card.",
    "decision": "Batch observation and protect scroll anchors while content is appended.",
    "tasks": [
      "Use section sentinels instead of per-card observers.",
      "Keep one-viewport prefetch only.",
      "Preserve anchor positions on insert."
    ]
  },
  {
    "id": "ad-viewability",
    "label": "Ad viewability audit",
    "surface": "Revenue-critical placements",
    "status": "watch",
    "signal": "0.5 threshold and 200ms dwell requirement",
    "budget": "Analytics delayed until stable visibility",
    "fallback": "Impression held until dwell passes",
    "headline": "Visibility alone is not enough; viewability events need a dwell requirement to avoid false impressions.",
    "decision": "Delay analytics until the placement stays visible long enough to count.",
    "tasks": [
      "Attach dwell timers.",
      "Suppress false early impressions.",
      "Expose approximate counts only if recompute lags."
    ]
  },
  {
    "id": "observer-overload",
    "label": "Observer overload",
    "surface": "Card-heavy archive page",
    "status": "repair",
    "signal": "190 nodes observed directly",
    "budget": "Callbacks now compete with main-thread work",
    "fallback": "Collapse to section-level observers",
    "headline": "Per-node observation at this scale erases the performance win and risks scroll instability.",
    "decision": "Reduce target count aggressively and move to batched sentinel observation.",
    "tasks": [
      "Batch callbacks.",
      "Replace per-card observation.",
      "Keep anchor-recovery visible during rollout."
    ]
  }
] as const;

export const playbook = [
  "Prefer section sentinels over hundreds of individual observers.",
  "Guard analytics with visibility thresholds and dwell.",
  "Protect scroll anchors when new content is inserted."
] as const;

export const recovery = [
  {
    "issue": "Too many observers",
    "action": "Collapse to sentinels and batch callbacks."
  },
  {
    "issue": "False impressions",
    "action": "Require dwell time before firing analytics."
  },
  {
    "issue": "Anchor drift",
    "action": "Recover the scroll anchor after insertion."
  }
] as const;

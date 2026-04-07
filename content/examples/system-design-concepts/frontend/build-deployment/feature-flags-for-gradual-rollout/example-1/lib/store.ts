export const flags = [
  {
    id: "new-checkout-payments",
    label: "New checkout payments",
    state: "healthy",
    audience: "5% of logged-in buyers in US and UK",
    blastRadius: "Payments and confirmation experience",
    note: "Metrics, kill switch, and cohort targeting are all wired correctly",
    nextStep: [
      "Increase exposure only after payment success rate stays stable.",
      "Watch checkout abandonment and third-party gateway latency together.",
      "Expire the flag once rollout reaches 100% and the old path is deleted."
    ]
  },
  {
    id: "search-redesign",
    label: "Search redesign",
    state: "watch",
    audience: "Intended for beta users only",
    blastRadius: "Search ranking and card layout",
    note: "A precedence bug leaks the experience to non-beta users",
    nextStep: [
      "Repair rule precedence before more exposure.",
      "Audit overlapping segments and manual overrides.",
      "Keep the rollout pinned until audience leakage is gone."
    ]
  },
  {
    id: "promo-banner-engine",
    label: "Promo banner engine",
    state: "repair",
    audience: "25% of homepage traffic",
    blastRadius: "Homepage personalization and analytics",
    note: "Disabling the flag stops rendering but background writes continue",
    nextStep: [
      "Use the kill switch immediately for all cohorts.",
      "Stop related background jobs and analytics writes.",
      "Do not re-enable until rollback semantics are complete."
    ]
  }
] as const;

export const hygiene = [
  "Flags are rollout controls, not permanent product architecture.",
  "Audience targeting must be testable before traffic expansion.",
  "A kill switch must remove side effects, not just UI rendering."
] as const;

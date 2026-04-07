export const flows = [
  {
    id: "checkout-api",
    label: "Checkout + payment API",
    owner: "Checkout platform",
    releaseGate: "Required for commerce deploy signoff",
    risk: "healthy",
    boundary: "Cart, tax, payment intent, and confirmation APIs are exercised together",
    finding: "The integration suite validates the same customer path and state transitions that production uses.",
    scenarios: [
      "Tax recalculation after address change.",
      "Payment intent retry after soft gateway decline.",
      "Confirmation view after successful async reconciliation."
    ],
    actions: [
      "Keep fixtures close to production payload shape.",
      "Assert cross-service state transitions, not only final success.",
      "Reuse the same release contract in preview and CI."
    ]
  },
  {
    id: "search-session",
    label: "Search + personalization",
    owner: "Discovery experience",
    releaseGate: "Needed before ranking rollout",
    risk: "watch",
    boundary: "Search works, but personalization is stubbed too aggressively",
    finding: "The suite misses one real boundary where ranking depends on session state and recent behavior.",
    scenarios: [
      "Session restore after re-authentication.",
      "Search results with stale personalization cache.",
      "Fallback ranking when profile lookup is slow."
    ],
    actions: [
      "Replace static ranking fixtures with contract-backed responses.",
      "Cover auth/session handoff explicitly.",
      "Hold signoff until stateful integration assertions are real."
    ]
  },
  {
    id: "profile-media",
    label: "Profile + media upload",
    owner: "Identity surfaces",
    releaseGate: "Blocks profile-media release",
    risk: "repair",
    boundary: "Upload success is tested, but virus scan and processing callbacks are absent",
    finding: "The happy path is green while the real production callback chain remains untested.",
    scenarios: [
      "Upload accepted but processing delayed.",
      "Virus-scan rejection after temporary success state.",
      "Profile refresh after derivative asset generation."
    ],
    actions: [
      "Run the full upload-processing-confirmation sequence.",
      "Assert storage and processing callbacks together.",
      "Block release until asynchronous boundaries are exercised."
    ]
  }
] as const;

export const principles = [
  "Integration tests should validate real boundaries, not stitched-together mocks.",
  "A green happy path is insufficient when delayed callbacks change user-visible state.",
  "Preview and CI should exercise the same contracts that release uses."
] as const;

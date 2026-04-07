export const journeys = [
  {
    id: "checkout-journey",
    label: "Checkout purchase journey",
    owner: "Commerce QA",
    releaseGate: "Required for commerce launch",
    risk: "healthy",
    fidelity: "Preview environment mirrors payment gateway, tax, and confirmation flow",
    finding: "The E2E journey validates the same customer path and completion signals that production uses.",
    scenarios: [
      "Successful checkout with payment confirmation.",
      "Soft decline followed by retry and resume.",
      "Confirmation page after asynchronous order reconciliation."
    ],
    actions: [
      "Keep journey assertions focused on business outcomes, not brittle DOM trivia.",
      "Run the same seeded data flow in preview and CI.",
      "Capture payment and confirmation evidence with each release."
    ]
  },
  {
    id: "onboarding-journey",
    label: "New-user onboarding",
    owner: "Growth engineering",
    releaseGate: "Needed before onboarding redesign",
    risk: "watch",
    fidelity: "Happy path works, but email verification is bypassed in test mode",
    finding: "The current E2E run misses a real-world step that changes account activation timing and resume behavior.",
    scenarios: [
      "Verification email receive and click path.",
      "Abandoned onboarding resumed on another tab or device.",
      "Error recovery after a delayed activation webhook."
    ],
    actions: [
      "Exercise verification mail and delayed activation state.",
      "Assert cross-page resume and retry behavior.",
      "Stop using a bypass that production never sees."
    ]
  },
  {
    id: "subscription-renewal",
    label: "Subscription renewal",
    owner: "Billing experience",
    releaseGate: "Blocks renewal UI release",
    risk: "repair",
    fidelity: "Renewal UI is tested, but webhook confirmation and retry logic are absent",
    finding: "The supposed full journey ends before the real production outcome is known.",
    scenarios: [
      "Renewal success after delayed webhook confirmation.",
      "Retry path after transient payment failure.",
      "Customer-visible stale-state handling during pending renewal."
    ],
    actions: [
      "Extend the E2E flow to renewal completion and failure recovery.",
      "Include webhook timing and stale status handling.",
      "Block release until the customer-visible renewal path is real."
    ]
  }
] as const;

export const expectations = [
  "E2E coverage should mirror real customer steps, not internal shortcuts.",
  "A journey is incomplete if asynchronous confirmation steps are skipped.",
  "Environment fidelity matters as much as UI assertion count."
] as const;

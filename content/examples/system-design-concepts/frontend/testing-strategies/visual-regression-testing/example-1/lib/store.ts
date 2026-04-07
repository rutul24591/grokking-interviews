export const surfaces = [
  {
    id: "homepage-hero",
    label: "Homepage hero",
    owner: "Marketing surfaces",
    releaseGate: "Required before homepage refresh",
    risk: "healthy",
    baseline: "Dark/light, desktop/mobile baselines are current",
    finding: "The visual suite covers the customer-visible hero states that usually regress on release day.",
    scenarios: [
      "Desktop and mobile hero with new seasonal copy.",
      "Dark-mode spacing and typography checks.",
      "Empty-image fallback when CDN asset fails."
    ],
    actions: [
      "Keep baselines per viewport and theme.",
      "Treat typography and spacing drift as real release signals.",
      "Expire outdated baselines when design intent changes."
    ]
  },
  {
    id: "search-cards",
    label: "Search result cards",
    owner: "Discovery UI",
    releaseGate: "Needed for search layout changes",
    risk: "watch",
    baseline: "Desktop baseline exists, mobile baseline is stale",
    finding: "One responsive breakpoint can still drift without failing the suite.",
    scenarios: [
      "Two-column and one-column card layouts.",
      "Long title truncation and badge overflow.",
      "Loading and zero-result card skeletons."
    ],
    actions: [
      "Refresh mobile and narrow-width baselines.",
      "Cover empty, loading, and truncated-content states.",
      "Block design signoff until responsive evidence is current."
    ]
  },
  {
    id: "checkout-confirmation",
    label: "Checkout confirmation",
    owner: "Payments experience",
    releaseGate: "Blocks confirmation UI release",
    risk: "repair",
    baseline: "Skeleton and error states are missing from screenshot coverage",
    finding: "A visually critical production state is not protected by the current diff workflow.",
    scenarios: [
      "Confirmation success state after delayed completion.",
      "Pending payment and retry banner state.",
      "Error state with long localized copy and support CTA."
    ],
    actions: [
      "Add skeleton, timeout, and failure baselines.",
      "Separate harmless anti-aliasing noise from structural regressions.",
      "Block release until customer-facing confirmation states are covered."
    ]
  }
] as const;

export const rules = [
  "Visual testing should protect real customer states, not only default screenshots.",
  "Responsive and theme variants need separate evidence.",
  "Baseline refresh is a product decision, not a convenience button."
] as const;

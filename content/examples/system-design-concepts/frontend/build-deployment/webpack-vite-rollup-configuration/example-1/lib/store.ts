export const buildProfiles = [
  {
    id: "vite-spa",
    label: "Vite SPA pipeline",
    fit: "Fast local iteration and modern ESM plugin chain",
    state: "healthy",
    constraints: "Needs a small SSR bridge for preview parity",
    decisions: [
      "Use Vite for dev speed and lean client bundles.",
      "Pin plugin compatibility before rollout.",
      "Compare preview and production output budgets on every commit."
    ]
  },
  {
    id: "webpack-monorepo",
    label: "Webpack monorepo pipeline",
    fit: "Complex legacy plugin stack and module federation",
    state: "watch",
    constraints: "Build time is creeping up and one legacy loader blocks upgrade",
    decisions: [
      "Audit plugin ownership before major upgrades.",
      "Budget build time and bundle growth separately.",
      "Plan migration off unsupported loaders before they become release blockers."
    ]
  },
  {
    id: "rollup-library",
    label: "Rollup library pipeline",
    fit: "Component package with multiple output formats",
    state: "repair",
    constraints: "One output target is tree-shaking poorly in downstream apps",
    decisions: [
      "Fix output contract before publishing another package version.",
      "Verify sideEffects and export maps against consumer builds.",
      "Stop treating bundle config as a one-time setup task."
    ]
  }
] as const;

export const guardrails = [
  "Tooling choice must match the product topology, not current hype.",
  "Plugin compatibility and output contracts are part of deployment safety.",
  "Build speed and bundle output both matter for release quality."
] as const;

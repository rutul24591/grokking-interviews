export const pipelineRuns = [
  {
    id: "release-412",
    label: "Release 412",
    branch: "main",
    artifact: "frontend@sha256:ab31",
    state: "healthy",
    failingStage: "None",
    summary: "Build, tests, preview promotion, and production smoke all passed",
    stages: [
      "Build once and sign the artifact.",
      "Run unit, integration, and visual regression checks.",
      "Promote the same digest to preview and production."
    ]
  },
  {
    id: "release-413",
    label: "Release 413",
    branch: "main",
    artifact: "frontend@sha256:bd77",
    state: "watch",
    failingStage: "Visual regression gate is flaky",
    summary: "The artifact is stable, but one gate is no longer deterministic",
    stages: [
      "Hold promotion until the flaky gate is isolated.",
      "Do not rebuild the artifact to chase a passing run.",
      "Collect flake rate and affected tests before re-queueing."
    ]
  },
  {
    id: "release-414",
    label: "Release 414",
    branch: "main",
    artifact: "frontend@sha256:c991",
    state: "repair",
    failingStage: "Production smoke after deploy",
    summary: "The pipeline reached production, then failed verification on live health checks",
    stages: [
      "Rollback to the previous artifact digest immediately.",
      "Attach all stage evidence to the incident timeline.",
      "Freeze more promotions until the failure mode is understood."
    ]
  }
] as const;

export const policy = [
  "An artifact can be built once, then promoted many times.",
  "Retries do not convert a flaky gate into a trustworthy one.",
  "Production verification is part of the release contract, not an optional extra."
] as const;

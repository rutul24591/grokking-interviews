export type EdgeCaseInput = {
  id: string;
  kind: string;
  severity: "low" | "medium" | "high" | "critical";
  detectedAtMs: number;
  lastHealthyAtMs: number;
  affectedUsers: number;
  dataIntegrityRisk: boolean;
  userVisible: boolean;
  duplicateOrReplay: boolean;
};

export type RecoveryPlan = {
  topic: string;
  incidentId: string;
  action: "monitor" | "degrade" | "rollback" | "page";
  matchedFailureMode: string;
  runbookSteps: string[];
  evidenceToPreserve: string[];
};

const topic = "Developer Documentation System";
const slug = "developer-documentation-system";
const domain = "developer platform";
const failureModes = [
  "developer platform stale source of truth",
  "developer platform duplicate or replayed event",
  "developer platform policy or permission bypass",
  "developer platform downstream provider outage",
  "developer platform user-visible inconsistency"
];
const telemetry = [
  "buildDurationMs",
  "flakeRate",
  "docFreshnessDays",
  "apiErrorRate",
  "supplyChainRisk"
];
const actions = [
  "quarantine-flake",
  "block-unsafe-request",
  "pin-version",
  "surface-diagnostics"
];

function matchFailure(kind: string) {
  return failureModes.find((mode) => kind.toLowerCase().includes(mode.split(" ")[1] ?? "")) ?? failureModes[0];
}

export function classifyEdgeCase(input: EdgeCaseInput): RecoveryPlan {
  const ageMs = input.detectedAtMs - input.lastHealthyAtMs;
  const matchedFailureMode = matchFailure(input.kind);
  const critical = input.severity === "critical" || input.dataIntegrityRisk;
  const broad = input.affectedUsers > 10000;
  const stale = ageMs > 5 * 60 * 1000;

  if (critical) {
    return {
      topic,
      incidentId: input.id,
      action: "page",
      matchedFailureMode,
      runbookSteps: ["freeze writes", actions[0] ?? "degrade", "preserve audit trail", "assign incident commander"],
      evidenceToPreserve: telemetry,
    };
  }

  if (broad || input.duplicateOrReplay) {
    return {
      topic,
      incidentId: input.id,
      action: "rollback",
      matchedFailureMode,
      runbookSteps: [actions.at(-1) ?? "rollback", "invalidate derived state", "replay from checkpoint"],
      evidenceToPreserve: telemetry.slice(0, 4),
    };
  }

  if (input.userVisible || stale) {
    return {
      topic,
      incidentId: input.id,
      action: "degrade",
      matchedFailureMode,
      runbookSteps: [actions[1] ?? "degrade", "show explicit fallback state", "watch guardrails"],
      evidenceToPreserve: telemetry.slice(0, 3),
    };
  }

  return {
    topic,
    incidentId: input.id,
    action: "monitor",
    matchedFailureMode,
    runbookSteps: ["continue monitoring " + domain, "keep decision trace for " + slug],
    evidenceToPreserve: telemetry.slice(0, 2),
  };
}

export function buildEdgeCaseMatrix() {
  return failureModes.map((failure, index) => ({
    failure,
    syntheticInput: {
      severity: index === 0 ? "critical" : index < 3 ? "high" : "medium",
      affectedUsers: index < 2 ? 25000 : 500,
      userVisible: index !== 1,
      duplicateOrReplay: failure.includes("duplicate"),
    },
    expectedAction: index === 0 ? "page" : index < 3 ? "rollback" : "degrade",
  }));
}

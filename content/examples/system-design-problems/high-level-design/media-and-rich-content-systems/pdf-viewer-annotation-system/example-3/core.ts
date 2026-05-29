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

const topic = "PDF Viewer Annotation System";
const slug = "pdf-viewer-annotation-system";
const domain = "media content";
const failureModes = [
  "media content stale source of truth",
  "media content duplicate or replayed event",
  "media content policy or permission bypass",
  "media content downstream provider outage",
  "media content user-visible inconsistency"
];
const telemetry = [
  "transcodeLagMs",
  "bufferRatio",
  "assetSizeMb",
  "annotationConflict",
  "cdnHitRate"
];
const actions = [
  "retry-transcode",
  "serve-lower-rendition",
  "resolve-annotation-conflict",
  "verify-asset-hash"
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

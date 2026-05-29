export type nativeDragDropFileSystemSignal = {
  permissionDenied: number;
  visibilityAgeMs: number;
  workerQueueDepth: number;
  fallbackCount: number;
};

export type nativeDragDropFileSystemEvent = {
  id: string;
  topic: "native-drag-drop-file-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: nativeDragDropFileSystemSignal;
};

export type nativeDragDropFileSystemDecision = {
  accepted: boolean;
  action: "use-progressive-fallback" | "pause-background-work" | "request-permission-lazily" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Browser APIs must degrade predictably when permission, lifecycle, or support changes.";

export function evaluateNativeDragDropFileSystemEvent(event: nativeDragDropFileSystemEvent): nativeDragDropFileSystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.permissionDenied > 2_000) reasons.push("permissionDenied-outside-slo");
  if (event.signal.workerQueueDepth > 0.2) reasons.push("workerQueueDepth-requires-guardrail");

  let action: nativeDragDropFileSystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "use-progressive-fallback";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "pause-background-work";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "request-permission-lazily";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Native Drag Drop File System",
      "subcategory:web-platform-browser-apis",
      "entity:browser capability event",
      "state:capability permission state",
      "operation:progressive platform action",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runNativeDragDropFileSystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateNativeDragDropFileSystemEvent({
    id: "native-drag-drop-file-system-evt-1",
    topic: "native-drag-drop-file-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { permissionDenied: 180, visibilityAgeMs: 0, workerQueueDepth: 0.01, fallbackCount: 1 },
  });

  const guarded = evaluateNativeDragDropFileSystemEvent({
    id: "native-drag-drop-file-system-evt-late",
    topic: "native-drag-drop-file-system",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { permissionDenied: 2_700, visibilityAgeMs: 3, workerQueueDepth: 0.34, fallbackCount: 2 },
  });

  return { accepted, guarded };
}

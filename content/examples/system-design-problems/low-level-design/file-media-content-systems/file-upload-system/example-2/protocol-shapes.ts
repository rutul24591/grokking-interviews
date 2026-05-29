export type fileUploadSystemSignal = {
  uploadedBytes: number;
  checksumMismatch: number;
  transcodeLagMs: number;
  retryCount: number;
};

export type fileUploadSystemEvent = {
  id: string;
  topic: "file-upload-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: fileUploadSystemSignal;
};

export type fileUploadSystemDecision = {
  accepted: boolean;
  action: "resume-from-checkpoint" | "verify-checksum" | "serve-lower-rendition" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Large file and media operations must be resumable, verified, and safe to retry.";

export function evaluateFileUploadSystemEvent(event: fileUploadSystemEvent): fileUploadSystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.uploadedBytes > 2_000) reasons.push("uploadedBytes-outside-slo");
  if (event.signal.transcodeLagMs > 0.2) reasons.push("transcodeLagMs-requires-guardrail");

  let action: fileUploadSystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "resume-from-checkpoint";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "verify-checksum";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "serve-lower-rendition";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:File Upload System",
      "subcategory:file-media-content-systems",
      "entity:media asset",
      "state:upload or playback session",
      "operation:file pipeline transition",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runFileUploadSystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateFileUploadSystemEvent({
    id: "file-upload-system-evt-1",
    topic: "file-upload-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { uploadedBytes: 180, checksumMismatch: 0, transcodeLagMs: 0.01, retryCount: 1 },
  });

  const guarded = evaluateFileUploadSystemEvent({
    id: "file-upload-system-evt-late",
    topic: "file-upload-system",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { uploadedBytes: 2_700, checksumMismatch: 3, transcodeLagMs: 0.34, retryCount: 2 },
  });

  return { accepted, guarded };
}

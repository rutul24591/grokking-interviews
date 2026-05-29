export type richTextEditorSignal = {
  uploadedBytes: number;
  checksumMismatch: number;
  transcodeLagMs: number;
  retryCount: number;
};

export type richTextEditorEvent = {
  id: string;
  topic: "rich-text-editor";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: richTextEditorSignal;
};

export type richTextEditorDecision = {
  accepted: boolean;
  action: "resume-from-checkpoint" | "verify-checksum" | "serve-lower-rendition" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Large file and media operations must be resumable, verified, and safe to retry.";

export function evaluateRichTextEditorEvent(event: richTextEditorEvent): richTextEditorDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.uploadedBytes > 2_000) reasons.push("uploadedBytes-outside-slo");
  if (event.signal.transcodeLagMs > 0.2) reasons.push("transcodeLagMs-requires-guardrail");

  let action: richTextEditorDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "resume-from-checkpoint";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "verify-checksum";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "serve-lower-rendition";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Rich Text Editor",
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

export function runRichTextEditorContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateRichTextEditorEvent({
    id: "rich-text-editor-evt-1",
    topic: "rich-text-editor",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { uploadedBytes: 180, checksumMismatch: 0, transcodeLagMs: 0.01, retryCount: 1 },
  });

  const guarded = evaluateRichTextEditorEvent({
    id: "rich-text-editor-evt-late",
    topic: "rich-text-editor",
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

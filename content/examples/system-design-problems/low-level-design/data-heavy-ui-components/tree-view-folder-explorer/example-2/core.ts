export type treeViewFolderExplorerSignal = {
  rowCount: number;
  cursorDrift: number;
  cacheAgeMs: number;
  renderCostMs: number;
};

export type treeViewFolderExplorerEvent = {
  id: string;
  topic: "tree-view-folder-explorer";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: treeViewFolderExplorerSignal;
};

export type treeViewFolderExplorerDecision = {
  accepted: boolean;
  action: "preserve-selection" | "rebase-cursor" | "serve-window-cache" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Viewport updates must preserve stable identity, cursor order, and visible selection across refreshes.";

export function evaluateTreeViewFolderExplorerEvent(event: treeViewFolderExplorerEvent): treeViewFolderExplorerDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.rowCount > 2_000) reasons.push("rowCount-outside-slo");
  if (event.signal.cacheAgeMs > 0.2) reasons.push("cacheAgeMs-requires-guardrail");

  let action: treeViewFolderExplorerDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "preserve-selection";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "rebase-cursor";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "serve-window-cache";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Tree View Folder Explorer",
      "subcategory:data-heavy-ui-components",
      "entity:grid query",
      "state:normalized viewport cache",
      "operation:virtualized data update",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runTreeViewFolderExplorerContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateTreeViewFolderExplorerEvent({
    id: "tree-view-folder-explorer-evt-1",
    topic: "tree-view-folder-explorer",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { rowCount: 180, cursorDrift: 0, cacheAgeMs: 0.01, renderCostMs: 1 },
  });

  const guarded = evaluateTreeViewFolderExplorerEvent({
    id: "tree-view-folder-explorer-evt-late",
    topic: "tree-view-folder-explorer",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { rowCount: 2_700, cursorDrift: 3, cacheAgeMs: 0.34, renderCostMs: 2 },
  });

  return { accepted, guarded };
}

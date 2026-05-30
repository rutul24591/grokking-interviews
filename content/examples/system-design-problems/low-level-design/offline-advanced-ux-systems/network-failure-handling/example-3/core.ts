export interface NetworkFailureHandlingVersionedValue {
  resourceId: string;
  version: number;
  fields: Record<string, string>;
}

export interface NetworkFailureHandlingConflict {
  field: string;
  base?: string;
  local?: string;
  remote?: string;
  resolution: "auto-local" | "auto-remote" | "manual";
  reason: string;
}

export interface NetworkFailureHandlingResolutionPlan {
  merged: Record<string, string>;
  conflicts: NetworkFailureHandlingConflict[];
  audit: string[];
  canCommitSilently: boolean;
}

export function buildNetworkFailureHandlingResolutionPlan(
  base: NetworkFailureHandlingVersionedValue,
  local: NetworkFailureHandlingVersionedValue,
  remote: NetworkFailureHandlingVersionedValue,
): NetworkFailureHandlingResolutionPlan {
  const fields = new Set([...Object.keys(base.fields), ...Object.keys(local.fields), ...Object.keys(remote.fields)]);
  const merged: Record<string, string> = {};
  const conflicts: NetworkFailureHandlingConflict[] = [];

  for (const field of fields) {
    const baseValue = base.fields[field];
    const localValue = local.fields[field];
    const remoteValue = remote.fields[field];
    const localChanged = localValue !== baseValue;
    const remoteChanged = remoteValue !== baseValue;

    if (localChanged && remoteChanged && localValue !== remoteValue) {
      conflicts.push({ field, base: baseValue, local: localValue, remote: remoteValue, resolution: "manual", reason: "both-sides-changed" });
      merged[field] = localValue ?? remoteValue ?? "";
    } else if (localChanged) {
      merged[field] = localValue ?? "";
      conflicts.push({ field, base: baseValue, local: localValue, remote: remoteValue, resolution: "auto-local", reason: "only-local-changed" });
    } else {
      merged[field] = remoteValue ?? localValue ?? "";
      if (remoteChanged) conflicts.push({ field, base: baseValue, local: localValue, remote: remoteValue, resolution: "auto-remote", reason: "only-remote-changed" });
    }
  }

  return {
    merged,
    conflicts,
    canCommitSilently: conflicts.every((conflict) => conflict.resolution !== "manual"),
    audit: ["topic:network-failure-handling", "policy:multi-signal health classification with bounded retries and user-visible degraded mode", `base:${base.version}`, `local:${local.version}`, `remote:${remote.version}`],
  };
}

export function runNetworkFailureHandlingConflictScenario() {
  const base = { resourceId: "doc-7", version: 1, fields: { title: "Draft", owner: "A", status: "open" } };
  const local = { resourceId: "doc-7", version: 2, fields: { title: "Client Draft", owner: "A", status: "open" } };
  const remote = { resourceId: "doc-7", version: 3, fields: { title: "Server Draft", owner: "B", status: "open" } };
  return buildNetworkFailureHandlingResolutionPlan(base, local, remote);
}

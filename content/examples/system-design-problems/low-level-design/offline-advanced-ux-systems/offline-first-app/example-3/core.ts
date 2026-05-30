export interface OfflineFirstAppVersionedValue {
  resourceId: string;
  version: number;
  fields: Record<string, string>;
}

export interface OfflineFirstAppConflict {
  field: string;
  base?: string;
  local?: string;
  remote?: string;
  resolution: "auto-local" | "auto-remote" | "manual";
  reason: string;
}

export interface OfflineFirstAppResolutionPlan {
  merged: Record<string, string>;
  conflicts: OfflineFirstAppConflict[];
  audit: string[];
  canCommitSilently: boolean;
}

export function buildOfflineFirstAppResolutionPlan(
  base: OfflineFirstAppVersionedValue,
  local: OfflineFirstAppVersionedValue,
  remote: OfflineFirstAppVersionedValue,
): OfflineFirstAppResolutionPlan {
  const fields = new Set([...Object.keys(base.fields), ...Object.keys(local.fields), ...Object.keys(remote.fields)]);
  const merged: Record<string, string> = {};
  const conflicts: OfflineFirstAppConflict[] = [];

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
    audit: ["topic:offline-first-app", "policy:cache-first shell, local write path, and explicit stale/conflict semantics for server data", `base:${base.version}`, `local:${local.version}`, `remote:${remote.version}`],
  };
}

export function runOfflineFirstAppConflictScenario() {
  const base = { resourceId: "doc-7", version: 1, fields: { title: "Draft", owner: "A", status: "open" } };
  const local = { resourceId: "doc-7", version: 2, fields: { title: "Client Draft", owner: "A", status: "open" } };
  const remote = { resourceId: "doc-7", version: 3, fields: { title: "Server Draft", owner: "B", status: "open" } };
  return buildOfflineFirstAppResolutionPlan(base, local, remote);
}

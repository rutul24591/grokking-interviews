export interface ProgressiveEnhancementSystemVersionedValue {
  resourceId: string;
  version: number;
  fields: Record<string, string>;
}

export interface ProgressiveEnhancementSystemConflict {
  field: string;
  base?: string;
  local?: string;
  remote?: string;
  resolution: "auto-local" | "auto-remote" | "manual";
  reason: string;
}

export interface ProgressiveEnhancementSystemResolutionPlan {
  merged: Record<string, string>;
  conflicts: ProgressiveEnhancementSystemConflict[];
  audit: string[];
  canCommitSilently: boolean;
}

export function buildProgressiveEnhancementSystemResolutionPlan(
  base: ProgressiveEnhancementSystemVersionedValue,
  local: ProgressiveEnhancementSystemVersionedValue,
  remote: ProgressiveEnhancementSystemVersionedValue,
): ProgressiveEnhancementSystemResolutionPlan {
  const fields = new Set([...Object.keys(base.fields), ...Object.keys(local.fields), ...Object.keys(remote.fields)]);
  const merged: Record<string, string> = {};
  const conflicts: ProgressiveEnhancementSystemConflict[] = [];

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
    audit: ["topic:progressive-enhancement-system", "policy:baseline-first delivery with opportunistic enhancement and feature-scoped rollback", `base:${base.version}`, `local:${local.version}`, `remote:${remote.version}`],
  };
}

export function runProgressiveEnhancementSystemConflictScenario() {
  const base = { resourceId: "doc-7", version: 1, fields: { title: "Draft", owner: "A", status: "open" } };
  const local = { resourceId: "doc-7", version: 2, fields: { title: "Client Draft", owner: "A", status: "open" } };
  const remote = { resourceId: "doc-7", version: 3, fields: { title: "Server Draft", owner: "B", status: "open" } };
  return buildProgressiveEnhancementSystemResolutionPlan(base, local, remote);
}

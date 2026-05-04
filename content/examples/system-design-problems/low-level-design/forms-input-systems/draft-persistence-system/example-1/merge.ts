export type Values = Record<string, unknown>;

export type MergeResult = {
  merged: Values;
  conflicts: string[];
};

export function mergeByDirtyFields(args: {
  base: Values;
  local: Values;
  remote: Values;
  dirtyFields: Set<string>;
}): MergeResult {
  const { base, local, remote, dirtyFields } = args;
  const merged: Values = { ...remote };
  const conflicts: string[] = [];

  for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const localChanged = local[key] !== base[key];
    const remoteChanged = remote[key] !== base[key];

    if (dirtyFields.has(key)) {
      merged[key] = local[key]; // local wins for dirty fields
      continue;
    }

    if (localChanged && remoteChanged && local[key] !== remote[key]) {
      conflicts.push(key);
      // conservative policy: keep remote and surface conflict for UI
      continue;
    }

    if (localChanged) merged[key] = local[key];
  }

  return { merged, conflicts };
}


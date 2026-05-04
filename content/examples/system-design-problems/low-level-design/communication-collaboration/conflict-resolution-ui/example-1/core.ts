export type Values = Record<string, unknown>;

export type FieldConflict = {
  field: string;
  base: unknown;
  local: unknown;
  remote: unknown;
};

export function detectConflicts(args: { base: Values; local: Values; remote: Values }) {
  const { base, local, remote } = args;
  const conflicts: FieldConflict[] = [];
  const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
  for (const k of keys) {
    const localChanged = local[k] !== base[k];
    const remoteChanged = remote[k] !== base[k];
    if (localChanged && remoteChanged && local[k] !== remote[k]) {
      conflicts.push({ field: k, base: base[k], local: local[k], remote: remote[k] });
    }
  }
  return conflicts;
}

export function resolve(conflicts: FieldConflict[], choice: Record<string, "local" | "remote">) {
  const out: Values = {};
  for (const c of conflicts) {
    out[c.field] = choice[c.field] === "local" ? c.local : c.remote;
  }
  return out;
}

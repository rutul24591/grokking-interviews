export type Values = Record<string, unknown>;
export type Conflict = { field: string; base: unknown; local: unknown; remote: unknown };

export function detect(base: Values, local: Values, remote: Values) {
  const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
  const conflicts: Conflict[] = [];
  for (const k of keys) {
    const lc = local[k] !== base[k];
    const rc = remote[k] !== base[k];
    if (lc && rc && local[k] !== remote[k]) conflicts.push({ field: k, base: base[k], local: local[k], remote: remote[k] });
  }
  return conflicts;
}

export function mergeLastWriteWins(local: Values, remote: Values, localAt: number, remoteAt: number) {
  return localAt >= remoteAt ? local : remote;
}

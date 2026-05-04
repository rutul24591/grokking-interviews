export type Patch = Record<string, unknown>;

export function applyBulk<T extends Record<string, unknown>>(rows: T[], ids: Set<string>, patch: Patch) {
  return rows.map((r: any) => (ids.has(r.id) ? { ...r, ...patch } : r));
}

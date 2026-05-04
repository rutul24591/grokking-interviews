export type Diff = { field: string; local: unknown; remote: unknown; chosen: "local" | "remote" | "unresolved" };

export function buildDiff(fields: string[], local: Record<string, unknown>, remote: Record<string, unknown>): Diff[] {
  return fields.map((f) => ({ field: f, local: local[f], remote: remote[f], chosen: local[f] === remote[f] ? "local" : "unresolved" }));
}

export function choose(diff: Diff[], field: string, choice: "local" | "remote") {
  return diff.map((d) => (d.field === field ? { ...d, chosen: choice } : d));
}

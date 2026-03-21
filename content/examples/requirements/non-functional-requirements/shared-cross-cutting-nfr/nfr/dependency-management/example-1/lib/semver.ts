export type Semver = { major: number; minor: number; patch: number };

export function parse(v: string): Semver | null {
  const m = v.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

export function bumpType(from: string, to: string): "major" | "minor" | "patch" | "none" | "unknown" {
  const a = parse(from);
  const b = parse(to);
  if (!a || !b) return "unknown";
  if (b.major !== a.major) return "major";
  if (b.minor !== a.minor) return "minor";
  if (b.patch !== a.patch) return "patch";
  return "none";
}


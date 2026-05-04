export type Flag = { key: string; enabled: boolean; rules?: Array<{ percent?: number; userIds?: string[] }> };

export function evalFlag(flag: Flag, userId: string, rng = Math.random) {
  if (!flag.rules?.length) return flag.enabled;
  for (const r of flag.rules) {
    if (r.userIds?.includes(userId)) return true;
    if (r.percent != null && rng() * 100 < r.percent) return true;
  }
  return false;
}

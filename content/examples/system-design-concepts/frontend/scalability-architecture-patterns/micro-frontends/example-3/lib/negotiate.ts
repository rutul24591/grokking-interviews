export type NegotiationResult =
  | { mode: "ok"; version: number; note: string }
  | { mode: "fallback"; version: number; note: string }
  | { mode: "blocked"; version: null; note: string };

export function negotiate(hostSupported: number[], remoteSupported: number[]): NegotiationResult {
  const host = Array.from(new Set(hostSupported.filter((n) => n >= 1))).sort((a, b) => b - a);
  const remote = new Set(remoteSupported.filter((n) => n >= 1));

  for (const v of host) {
    if (remote.has(v)) return { mode: "ok", version: v, note: `Both sides support v${v}.` };
  }

  // Fallback: pick the highest remote version and use a “compat adapter” if the host can support it.
  const remoteMax = Math.max(...Array.from(remote.values()), -Infinity);
  if (Number.isFinite(remoteMax) && host.length > 0) {
    const hostMin = Math.min(...host);
    if (remoteMax < hostMin) {
      return { mode: "fallback", version: remoteMax, note: `Remote only supports older v${remoteMax}. Use a compat adapter in the host.` };
    }
  }

  return { mode: "blocked", version: null, note: "No compatible contract version. Disable the micro-frontend safely." };
}


import { createHash } from "crypto";

export type FaultConfig =
  | { type: "latency"; latencyMs: number }
  | { type: "error"; errorStatus: number }
  | { type: "timeout"; timeoutMs: number };

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function inBlastRadius(params: {
  experimentId: string;
  requestId: string;
  blastPct: number;
}) {
  const { experimentId, requestId, blastPct } = params;
  const pct = Math.max(0, Math.min(100, blastPct));
  if (pct === 0) return false;
  if (pct === 100) return true;

  const digest = createHash("sha256")
    .update(`${experimentId}:${requestId}`)
    .digest();
  const bucket = digest.readUInt32BE(0);
  const ratio = bucket / 0xffffffff;
  return ratio < pct / 100;
}


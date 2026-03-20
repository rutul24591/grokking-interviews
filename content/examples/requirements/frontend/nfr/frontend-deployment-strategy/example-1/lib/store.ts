import { bucket01 } from "@/lib/hash";

export type ReleaseConfig = {
  canaryPct: number;
  buildStable: string;
  buildCanary: string;
  salt: string;
};

let cfg: ReleaseConfig = {
  canaryPct: 10,
  buildStable: "2026.03.20-stable",
  buildCanary: "2026.03.20-canary",
  salt: "ring-v1",
};

export function getConfig(): ReleaseConfig {
  return cfg;
}

export function reset() {
  cfg = {
    canaryPct: 10,
    buildStable: "2026.03.20-stable",
    buildCanary: "2026.03.20-canary",
    salt: "ring-v1",
  };
}

export function update(next: Partial<ReleaseConfig>) {
  cfg = { ...cfg, ...next };
}

export function assignRing(userId: string): { ring: "stable" | "canary"; bucket: number; buildId: string } {
  const b = bucket01(`${cfg.salt}:${userId}`);
  const canary = b < cfg.canaryPct / 100;
  return { ring: canary ? "canary" : "stable", bucket: b, buildId: canary ? cfg.buildCanary : cfg.buildStable };
}


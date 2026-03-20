import { stableBucket01 } from "@/lib/hash";

export type FlagConfig = {
  rolloutPct: number; // 0..100
  killSwitch: boolean;
  salt: string;
};

let config: FlagConfig = { rolloutPct: 0, killSwitch: false, salt: "v1" };

export function getConfig(): FlagConfig {
  return config;
}

export function reset() {
  config = { rolloutPct: 0, killSwitch: false, salt: "v1" };
}

export function update(next: Partial<FlagConfig>) {
  config = { ...config, ...next };
}

export function evaluate(userId: string): { variant: "control" | "treatment"; bucket: number } {
  if (config.killSwitch) return { variant: "control", bucket: 0 };
  const bucket = stableBucket01(`${config.salt}:${userId}`);
  const enabled = bucket < config.rolloutPct / 100;
  return { variant: enabled ? "treatment" : "control", bucket };
}


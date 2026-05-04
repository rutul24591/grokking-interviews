export type PermissionState = "unknown" | "granted" | "denied" | "prompt";

export type PermissionUi = {
  state: PermissionState;
  lastAskedAt: number | null;
};

export function shouldAsk(ui: PermissionUi, cooldownMs = 24 * 60 * 60_000) {
  if (ui.state === "denied") return false;
  if (!ui.lastAskedAt) return true;
  return Date.now() - ui.lastAskedAt > cooldownMs;
}

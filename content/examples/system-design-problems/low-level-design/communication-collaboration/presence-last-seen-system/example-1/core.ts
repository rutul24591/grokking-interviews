export type Status = "online" | "idle" | "offline";

export type Presence = {
  userId: string;
  lastSeenAt: number;
  lastActiveAt: number;
  status: Status;
};

export function computeStatus(p: Presence, now = Date.now()) {
  const idleAfterMs = 60_000;
  const offlineAfterMs = 5 * 60_000;
  if (now - p.lastSeenAt > offlineAfterMs) return "offline" as const;
  if (now - p.lastActiveAt > idleAfterMs) return "idle" as const;
  return "online" as const;
}

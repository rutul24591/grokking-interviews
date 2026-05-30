export type NetworkFailureHandlingHealth = "healthy" | "degraded" | "offline" | "blocked";

export interface NetworkFailureHandlingSignal {
  onlineHint: boolean;
  apiProbeOk: boolean;
  storageWritable: boolean;
  permissionOk: boolean;
  authFresh: boolean;
  failureCount: number;
  quotaUsedRatio: number;
}

export interface NetworkFailureHandlingDecision {
  health: NetworkFailureHandlingHealth;
  userVisibleState: "current" | "queued-with-banner" | "read-only" | "requires-action";
  allowedActions: Array<"read-cache" | "write-local" | "flush" | "prompt" | "reauthenticate">;
  reasons: string[];
}

export function classifyNetworkFailureHandlingHealth(signal: NetworkFailureHandlingSignal): NetworkFailureHandlingDecision {
  const reasons: string[] = [];
  if (!signal.onlineHint) reasons.push("browser-offline");
  if (!signal.apiProbeOk) reasons.push("api-unreachable");
  if (!signal.storageWritable) reasons.push("storage-unavailable");
  if (!signal.permissionOk) reasons.push("permission-missing");
  if (!signal.authFresh) reasons.push("auth-stale");
  if (signal.failureCount >= 3) reasons.push("circuit-open");
  if (signal.quotaUsedRatio > 0.85) reasons.push("quota-pressure");

  if (!signal.authFresh) {
    return { health: "blocked", userVisibleState: "requires-action", allowedActions: ["read-cache", "reauthenticate"], reasons };
  }
  if (!signal.storageWritable || signal.quotaUsedRatio > 0.95) {
    return { health: "blocked", userVisibleState: "read-only", allowedActions: ["read-cache"], reasons };
  }
  if (!signal.onlineHint || !signal.apiProbeOk || signal.failureCount >= 3) {
    return { health: "offline", userVisibleState: "queued-with-banner", allowedActions: ["read-cache", "write-local"], reasons };
  }
  if (!signal.permissionOk || signal.quotaUsedRatio > 0.85) {
    return { health: "degraded", userVisibleState: "queued-with-banner", allowedActions: ["read-cache", "write-local", "flush", "prompt"], reasons };
  }
  return { health: "healthy", userVisibleState: "current", allowedActions: ["read-cache", "write-local", "flush"], reasons };
}

export function runNetworkFailureHandlingHealthScenario() {
  const healthy = classifyNetworkFailureHandlingHealth({
    onlineHint: true,
    apiProbeOk: true,
    storageWritable: true,
    permissionOk: true,
    authFresh: true,
    failureCount: 0,
    quotaUsedRatio: 0.2,
  });
  const blocked = classifyNetworkFailureHandlingHealth({
    onlineHint: true,
    apiProbeOk: false,
    storageWritable: true,
    permissionOk: false,
    authFresh: false,
    failureCount: 4,
    quotaUsedRatio: 0.91,
  });
  return { invariant: "The UI should degrade based on observed reachability, not a single unreliable online boolean.", healthy, blocked };
}

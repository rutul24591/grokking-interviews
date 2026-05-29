export type sessionTimeoutAutoLogoutSignal = {
  sessionAgeMs: number;
  permissionDrift: number;
  riskScore: number;
  tokenRefreshLagMs: number;
};

export type sessionTimeoutAutoLogoutEvent = {
  id: string;
  topic: "session-timeout-auto-logout";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: sessionTimeoutAutoLogoutSignal;
};

export type sessionTimeoutAutoLogoutDecision = {
  accepted: boolean;
  action: "step-up-auth" | "deny-sensitive-action" | "refresh-permissions" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Authorization must fail closed when session, role, or device trust is stale.";

export function evaluateSessionTimeoutAutoLogoutEvent(event: sessionTimeoutAutoLogoutEvent): sessionTimeoutAutoLogoutDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.sessionAgeMs > 2_000) reasons.push("sessionAgeMs-outside-slo");
  if (event.signal.riskScore > 0.2) reasons.push("riskScore-requires-guardrail");

  let action: sessionTimeoutAutoLogoutDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "step-up-auth";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "deny-sensitive-action";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "refresh-permissions";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Session Timeout Auto Logout",
      "subcategory:auth-user-systems",
      "entity:principal session",
      "state:permission snapshot",
      "operation:guarded route transition",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runSessionTimeoutAutoLogoutContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateSessionTimeoutAutoLogoutEvent({
    id: "session-timeout-auto-logout-evt-1",
    topic: "session-timeout-auto-logout",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { sessionAgeMs: 180, permissionDrift: 0, riskScore: 0.01, tokenRefreshLagMs: 1 },
  });

  const guarded = evaluateSessionTimeoutAutoLogoutEvent({
    id: "session-timeout-auto-logout-evt-late",
    topic: "session-timeout-auto-logout",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { sessionAgeMs: 2_700, permissionDrift: 3, riskScore: 0.34, tokenRefreshLagMs: 2 },
  });

  return { accepted, guarded };
}

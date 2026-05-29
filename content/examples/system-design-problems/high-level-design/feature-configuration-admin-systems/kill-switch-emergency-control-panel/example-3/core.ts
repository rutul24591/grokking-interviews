export type LocalSwitchState = {
  switchName: string;
  active: boolean;
  scopeKey: string;
  version: number;
  expiresAtMs: number;
  lastPolledAtMs: number;
};

export type RequestContext = {
  action: string;
  region: string;
  tenantId: string;
  nowMs: number;
};

export type GuardrailSnapshot = {
  errorRate: number;
  queueDepth: number;
  paymentSuccessRate: number;
  staleAckCount: number;
};

const protectedActionsBySwitch: Record<string, string[]> = {
  "disable-checkout-writes": ["create-payment-intent", "capture-payment", "submit-order"],
  "disable-recommendation-module": ["render-personalized-rail"],
};

function scopeMatches(scopeKey: string, ctx: RequestContext) {
  return scopeKey === "global:*" || scopeKey === "region:" + ctx.region || scopeKey === "tenant:" + ctx.tenantId;
}

export function enforceSwitch(state: LocalSwitchState, ctx: RequestContext) {
  const protectedActions = protectedActionsBySwitch[state.switchName] ?? [];
  const expired = ctx.nowMs >= state.expiresAtMs;
  const staleLocalState = ctx.nowMs - state.lastPolledAtMs > 10_000;

  if (expired) {
    return { decision: "allow-expired-switch", status: 200, retryAfterSeconds: 0 };
  }

  if (staleLocalState) {
    return { decision: "fail-closed-until-poll-recovers", status: 503, retryAfterSeconds: 5 };
  }

  if (state.active && scopeMatches(state.scopeKey, ctx) && protectedActions.includes(ctx.action)) {
    return { decision: "degrade-protected-action", status: 503, retryAfterSeconds: 30 };
  }

  return { decision: "allow", status: 200, retryAfterSeconds: 0 };
}

export function canRestore(state: LocalSwitchState, guardrails: GuardrailSnapshot, acknowledgedPercent: number) {
  const blockers: string[] = [];
  if (!state.active) blockers.push("switch-already-inactive");
  if (acknowledgedPercent < 99) blockers.push("not-all-services-acknowledged-active-state");
  if (guardrails.errorRate > 0.02) blockers.push("error-rate-still-elevated");
  if (guardrails.queueDepth > 1000) blockers.push("backlog-not-drained");
  if (guardrails.paymentSuccessRate < 0.98) blockers.push("payment-success-rate-not-recovered");
  if (guardrails.staleAckCount > 0) blockers.push("stale-acknowledgments-remain");

  return {
    allowed: blockers.length === 0,
    blockers,
    restoreAction: blockers.length === 0 ? "publish-inactive-version" : "keep-switch-active",
  };
}

export function buildRestoreAudit(state: LocalSwitchState, actor: string, guardrails: GuardrailSnapshot) {
  const restore = canRestore(state, guardrails, 100);
  return {
    actor,
    switchName: state.switchName,
    fromVersion: state.version,
    toVersion: state.version + 1,
    action: restore.restoreAction,
    evidence: {
      errorRate: guardrails.errorRate,
      queueDepth: guardrails.queueDepth,
      paymentSuccessRate: guardrails.paymentSuccessRate,
    },
  };
}

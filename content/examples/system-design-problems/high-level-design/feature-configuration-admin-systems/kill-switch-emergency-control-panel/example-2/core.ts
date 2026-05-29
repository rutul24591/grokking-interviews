export type SwitchDefinition = {
  name: string;
  impact: "low" | "high" | "critical";
  allowedScopes: Array<"global" | "region" | "tenant">;
  defaultTtlMinutes: number;
  maxTtlMinutes: number;
  protectedActions: string[];
};

export type ActivationRequest = {
  switchName: string;
  scope: { type: "global" | "region" | "tenant"; value: string };
  requestedTtlMinutes?: number;
  actor: string;
  mfaVerified: boolean;
  secondApprover?: string;
  incidentId: string;
  reason: string;
  nowMs: number;
};

export type SwitchState = {
  switchName: string;
  active: boolean;
  scopeKey: string;
  expiresAtMs: number;
  activatedBy: string;
  incidentId: string;
  audit: string[];
};

export type ServiceAck = {
  service: string;
  region: string;
  scopeKey: string;
  active: boolean;
  acknowledgedAtMs: number;
};

const catalog: SwitchDefinition[] = [
  {
    name: "disable-checkout-writes",
    impact: "critical",
    allowedScopes: ["global", "region", "tenant"],
    defaultTtlMinutes: 30,
    maxTtlMinutes: 240,
    protectedActions: ["create-payment-intent", "capture-payment", "submit-order"],
  },
  {
    name: "disable-recommendation-module",
    impact: "high",
    allowedScopes: ["region", "tenant"],
    defaultTtlMinutes: 60,
    maxTtlMinutes: 360,
    protectedActions: ["render-personalized-rail"],
  },
];

export function validateActivation(request: ActivationRequest) {
  const definition = catalog.find((entry) => entry.name === request.switchName);
  const errors: string[] = [];

  if (!definition) errors.push("unknown-switch");
  if (definition && !definition.allowedScopes.includes(request.scope.type)) errors.push("scope-not-allowed-for-switch");
  if (!request.mfaVerified) errors.push("mfa-required");
  if (definition?.impact === "critical" && !request.secondApprover) errors.push("critical-switch-needs-second-approver");
  if (request.secondApprover === request.actor) errors.push("second-approver-must-be-different");
  if (!request.incidentId.startsWith("INC-")) errors.push("incident-id-required");
  if (request.reason.trim().length < 15) errors.push("activation-reason-too-short");

  const ttl = request.requestedTtlMinutes ?? definition?.defaultTtlMinutes ?? 30;
  if (definition && ttl > definition.maxTtlMinutes) errors.push("ttl-exceeds-switch-maximum");

  return { ok: errors.length === 0, errors, definition, ttlMinutes: ttl };
}

export function activateSwitch(request: ActivationRequest): SwitchState {
  const validation = validateActivation(request);
  if (!validation.ok || !validation.definition) {
    throw new Error("activation-blocked:" + validation.errors.join(","));
  }

  const scopeKey = request.scope.type + ":" + request.scope.value;
  return {
    switchName: request.switchName,
    active: true,
    scopeKey,
    expiresAtMs: request.nowMs + validation.ttlMinutes * 60_000,
    activatedBy: request.actor,
    incidentId: request.incidentId,
    audit: [
      "activated-by:" + request.actor,
      "second-approver:" + (request.secondApprover ?? "not-required"),
      "incident:" + request.incidentId,
      "ttl-minutes:" + validation.ttlMinutes,
      "protected-actions:" + validation.definition.protectedActions.join("|"),
    ],
  };
}

export function propagationHealth(state: SwitchState, acknowledgments: ServiceAck[], nowMs: number) {
  const expected = acknowledgments.filter((ack) => ack.scopeKey === state.scopeKey || state.scopeKey === "global:*");
  const stale = expected.filter((ack) => !ack.active || nowMs - ack.acknowledgedAtMs > 5_000);
  return {
    switchName: state.switchName,
    scopeKey: state.scopeKey,
    acknowledgedPercent: expected.length === 0 ? 0 : Math.round(((expected.length - stale.length) / expected.length) * 100),
    staleServices: stale.map((ack) => ack.service),
    pagerDuty: stale.length > 0 || state.expiresAtMs <= nowMs,
  };
}

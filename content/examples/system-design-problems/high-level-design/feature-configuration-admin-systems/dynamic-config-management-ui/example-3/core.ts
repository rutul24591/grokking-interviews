export type ConfigSnapshot = {
  version: number;
  key: string;
  value: number | boolean | string;
  schemaType: "number" | "boolean" | "string";
  createdAtMs: number;
  source: "published" | "rollback";
  ownerTeam: string;
  riskLevel: "low" | "medium" | "critical";
  auditId: string;
};

export type RuntimeCache = {
  service: string;
  region: string;
  currentVersion: number;
  lastRefreshMs: number;
  lastKnownGood: ConfigSnapshot;
  critical: boolean;
};

export type RollbackRequest = {
  actor: string;
  incidentId: string;
  current: ConfigSnapshot;
  target: ConfigSnapshot;
  secondApprover?: string;
  nowMs: number;
};

export function canRollback(request: RollbackRequest) {
  const reasons: string[] = [];
  if (request.target.schemaType !== request.current.schemaType) reasons.push("target-version-schema-is-incompatible");
  if (request.target.source === "rollback") reasons.push("target-is-already-a-rollback-version");
  if (!request.incidentId.startsWith("INC-")) reasons.push("incident-id-required");
  if (request.target.riskLevel === "critical" && !request.secondApprover) {
    reasons.push("critical-config-rollback-needs-second-approver");
  }
  if (request.secondApprover === request.actor) reasons.push("second-approver-must-be-different");

  return {
    allowed: reasons.length === 0,
    reasons,
    publishMode: reasons.length === 0 ? "create-new-version-from-target" : "block-publish",
  };
}

export function createRollbackVersion(request: RollbackRequest): ConfigSnapshot {
  const check = canRollback(request);
  if (!check.allowed) throw new Error("rollback-blocked:" + check.reasons.join(","));

  return {
    version: request.current.version + 1,
    key: request.target.key,
    value: request.target.value,
    schemaType: request.target.schemaType,
    createdAtMs: request.nowMs,
    source: "rollback",
    ownerTeam: request.current.ownerTeam,
    riskLevel: request.current.riskLevel,
    auditId: request.incidentId + ":rollback:" + request.current.version + "-to-" + request.target.version,
  };
}

export function evaluateCacheFallback(cache: RuntimeCache, desiredVersion: number, nowMs: number) {
  const ageMs = nowMs - cache.lastRefreshMs;
  const staleByVersion = cache.currentVersion < desiredVersion;
  const staleByAge = ageMs > 120_000;

  if (!staleByVersion && !staleByAge) {
    return { mode: "serve-current", service: cache.service, value: cache.lastKnownGood.value };
  }

  if (ageMs <= 300_000) {
    return {
      mode: "serve-last-known-good-and-alert",
      service: cache.service,
      region: cache.region,
      value: cache.lastKnownGood.value,
      alert: "runtime-cache-lagging-desired-version",
    };
  }

  if (cache.critical) {
    return {
      mode: "fail-closed-for-critical-config",
      service: cache.service,
      region: cache.region,
      value: undefined,
      alert: "critical-config-cache-too-stale",
    };
  }

  return {
    mode: "serve-default-for-non-critical-config",
    service: cache.service,
    region: cache.region,
    value: cache.lastKnownGood.value,
    alert: "non-critical-config-cache-too-stale",
  };
}

export function summarizeRuntimeDrift(caches: RuntimeCache[], desiredVersion: number, nowMs: number) {
  const decisions = caches.map((cache) => evaluateCacheFallback(cache, desiredVersion, nowMs));
  return {
    desiredVersion,
    blockedRegions: decisions
      .filter((decision) => decision.mode === "fail-closed-for-critical-config")
      .map((decision) => decision.region),
    warningServices: decisions
      .filter((decision) => decision.mode !== "serve-current")
      .map((decision) => decision.service + "@" + decision.region),
    safeToPromote: decisions.every((decision) => decision.mode === "serve-current"),
    decisions,
  };
}

export function runRollbackScenario() {
  const nowMs = Date.parse("2026-05-29T12:00:00.000Z");
  const current: ConfigSnapshot = {
    version: 18,
    key: "checkout.maxCaptureAmount",
    value: 2500,
    schemaType: "number",
    createdAtMs: nowMs - 20 * 60_000,
    source: "published",
    ownerTeam: "payments-platform",
    riskLevel: "critical",
    auditId: "CFG-18",
  };
  const target: ConfigSnapshot = {
    version: 16,
    key: "checkout.maxCaptureAmount",
    value: 1000,
    schemaType: "number",
    createdAtMs: nowMs - 3 * 24 * 60 * 60_000,
    source: "published",
    ownerTeam: "payments-platform",
    riskLevel: "critical",
    auditId: "CFG-16",
  };

  const rollback = createRollbackVersion({
    actor: "sre-oncall",
    secondApprover: "payments-lead",
    incidentId: "INC-2026-0529",
    current,
    target,
    nowMs,
  });

  const drift = summarizeRuntimeDrift(
    [
      {
        service: "checkout-api",
        region: "us-east-1",
        currentVersion: 19,
        lastRefreshMs: nowMs - 30_000,
        lastKnownGood: rollback,
        critical: true,
      },
      {
        service: "checkout-worker",
        region: "eu-west-1",
        currentVersion: 18,
        lastRefreshMs: nowMs - 420_000,
        lastKnownGood: current,
        critical: true,
      },
    ],
    rollback.version,
    nowMs,
  );

  return { rollback, drift };
}

export type GeoDecision = {
  id: string;
  tenantId: string;
  owner: string;
  version: number;
  state: "draft" | "validated" | "publishing" | "active" | "blocked";
  attributes: Record<string, string | number | boolean>;
};

export type ProductionContext = {
  requestId: string;
  actor: string;
  environment: "staging" | "production";
  blastRadiusPercent: number;
  freshnessLagMs: number;
  errorRate: number;
  approvals: string[];
  metrics: Partial<Record<["tileCacheHitRate","feedAgeMs","etaErrorPct","privacyPrecisionMeters","zeroResultRate"][number], number>>;
};

export type ExecutionPlan = {
  topic: string;
  entityId: string;
  decision: "publish" | "canary" | "block";
  nextState: GeoDecision["state"];
  requiredActions: string[];
  telemetry: string[];
  auditTrail: string[];
};

const topic = "Maps Exploration UI";
const domain = "geospatial";
const protectedEntities = [
  "viewport",
  "tile",
  "poi",
  "route",
  "trafficFeed",
  "privacyCell"
];
const telemetry = [
  "tileCacheHitRate",
  "feedAgeMs",
  "etaErrorPct",
  "privacyPrecisionMeters",
  "zeroResultRate"
];
const actions = [
  "coarsen-location",
  "rollback-cell",
  "disable-feed",
  "serve-cached-tile"
];

function riskFromContext(ctx: ProductionContext) {
  const approvalRisk = ctx.environment === "production" && ctx.approvals.length < 2 ? 35 : 0;
  const blastRisk = ctx.blastRadiusPercent * 1.4;
  const freshnessRisk = ctx.freshnessLagMs / 1200;
  const errorRisk = ctx.errorRate * 250;
  return Math.round(approvalRisk + blastRisk + freshnessRisk + errorRisk);
}

export function validateGeoDecision(entity: GeoDecision, ctx: ProductionContext) {
  const errors: string[] = [];
  if (!entity.tenantId) errors.push("missing-tenant");
  if (!entity.owner) errors.push("missing-owner");
  if (entity.version <= 0) errors.push("invalid-version");
  if (ctx.environment === "production" && ctx.approvals.length < 2) errors.push("production-needs-two-approvals");
  if (ctx.blastRadiusPercent > 50 && ctx.environment === "production") errors.push("large-blast-radius-needs-canary");
  if (ctx.errorRate > 0.05) errors.push("current-error-rate-too-high");
  return { ok: errors.length === 0, errors, protectedEntities };
}

export function buildExecutionPlan(entity: GeoDecision, ctx: ProductionContext): ExecutionPlan {
  const validation = validateGeoDecision(entity, ctx);
  const riskScore = riskFromContext(ctx);
  const decision = !validation.ok || riskScore >= 80 ? "block" : riskScore >= 35 ? "canary" : "publish";
  const nextState = decision === "block" ? "blocked" : decision === "canary" ? "publishing" : "active";

  return {
    topic,
    entityId: entity.id,
    decision,
    nextState,
    requiredActions: decision === "block" ? actions : actions.slice(0, 2),
    telemetry,
    auditTrail: [
      "domain:" + domain,
      "request:" + ctx.requestId,
      "actor:" + ctx.actor,
      "entity-version:" + entity.version,
      "risk-score:" + riskScore,
      "validation:" + (validation.ok ? "passed" : validation.errors.join("|")),
    ],
  };
}

export function simulateSafeRollout(entity: GeoDecision, ctx: ProductionContext) {
  const plan = buildExecutionPlan(entity, ctx);
  const ramp = plan.decision === "publish" ? [5, 25, 50, 100] : plan.decision === "canary" ? [1, 5] : [];
  return {
    slug: "maps-exploration-ui",
    plan,
    ramp,
    stopConditions: telemetry.slice(0, 3),
    rollbackAction: actions.at(-1) ?? "rollback",
  };
}

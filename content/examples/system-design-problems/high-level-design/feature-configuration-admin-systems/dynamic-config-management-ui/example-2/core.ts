export type ConfigSchema = {
  key: string;
  type: "number" | "boolean" | "string";
  min?: number;
  max?: number;
  requiresApproval: boolean;
};

export type ConfigDraft = {
  namespace: string;
  environment: "staging" | "production";
  key: string;
  value: number | boolean | string;
  actor: string;
  approvalIds: string[];
  reason: string;
};

export type ConfigVersion = {
  version: number;
  namespace: string;
  key: string;
  value: number | boolean | string;
  checksum: string;
  audit: string[];
};

export type SubscriberAck = {
  service: string;
  region: string;
  versionSeen: number;
  acknowledgedAtMs: number;
};

const schemas: ConfigSchema[] = [
  { key: "checkout.timeoutMs", type: "number", min: 100, max: 5000, requiresApproval: true },
  { key: "search.enableVectorRanker", type: "boolean", requiresApproval: true },
  { key: "support.bannerCopy", type: "string", requiresApproval: false },
];

function checksum(input: string) {
  let hash = 0;
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash.toString(16).padStart(8, "0");
}

export function validateDraft(draft: ConfigDraft) {
  const schema = schemas.find((entry) => entry.key === draft.key);
  const errors: string[] = [];

  if (!schema) errors.push("unknown-config-key");
  if (schema && typeof draft.value !== schema.type) errors.push("schema-type-mismatch");
  if (schema?.type === "number" && typeof draft.value === "number") {
    if (schema.min !== undefined && draft.value < schema.min) errors.push("below-minimum");
    if (schema.max !== undefined && draft.value > schema.max) errors.push("above-maximum");
  }
  if (draft.environment === "production" && schema?.requiresApproval && draft.approvalIds.length < 2) {
    errors.push("production-change-requires-two-approvals");
  }
  if (draft.reason.trim().length < 12) errors.push("missing-operational-reason");

  return { ok: errors.length === 0, errors, schema };
}

export function publishConfigVersion(previous: ConfigVersion | undefined, draft: ConfigDraft): ConfigVersion {
  const validation = validateDraft(draft);
  if (!validation.ok) {
    throw new Error("cannot-publish:" + validation.errors.join(","));
  }

  const version = (previous?.version ?? 0) + 1;
  const serialized = JSON.stringify({ namespace: draft.namespace, key: draft.key, value: draft.value, version });

  return {
    version,
    namespace: draft.namespace,
    key: draft.key,
    value: draft.value,
    checksum: checksum(serialized),
    audit: [
      "drafted-by:" + draft.actor,
      "reason:" + draft.reason,
      "approvals:" + draft.approvalIds.join("|"),
      "immutable-version:" + version,
    ],
  };
}

export function evaluatePropagation(version: ConfigVersion, acks: SubscriberAck[], nowMs: number) {
  const stale = acks.filter((ack) => ack.versionSeen < version.version || nowMs - ack.acknowledgedAtMs > 30_000);
  const byRegion = new Map<string, { total: number; stale: number }>();

  for (const ack of acks) {
    const bucket = byRegion.get(ack.region) ?? { total: 0, stale: 0 };
    bucket.total += 1;
    if (stale.includes(ack)) bucket.stale += 1;
    byRegion.set(ack.region, bucket);
  }

  return {
    version: version.version,
    healthy: stale.length === 0,
    staleServices: stale.map((ack) => ack.service),
    regionHealth: [...byRegion.entries()].map(([region, value]) => ({
      region,
      acknowledgedPercent: Math.round(((value.total - value.stale) / value.total) * 100),
    })),
  };
}

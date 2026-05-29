export type CachedBundle = {
  bundleVersion: number;
  fetchedAtMs: number;
  signatureValid: boolean;
  minSupportedAppVersion: string;
  rolloutPercent: number;
  checksum: string;
  values: Record<string, string | number | boolean>;
};

export type ClientState = {
  deviceId: string;
  tenantId: string;
  appVersion: string;
  bundledDefaults: Record<string, string | number | boolean>;
  cached?: CachedBundle;
};

export type StartupDecision = {
  source:
    | "bundled-defaults"
    | "bundled-defaults-invalid-signature"
    | "bundled-defaults-incompatible-app-version"
    | "stale-cache-serve-and-refresh"
    | "fresh-cache"
    | "rollout-not-assigned";
  values: Record<string, string | number | boolean>;
  shouldRefresh: boolean;
  telemetry: {
    tenantId: string;
    deviceId: string;
    bundleVersion?: number;
    cacheAgeMs?: number;
    reason: string;
  };
};

function versionAtLeast(actual: string, required: string) {
  const a = actual.split(".").map(Number);
  const r = required.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, r.length); i++) {
    if ((a[i] ?? 0) > (r[i] ?? 0)) return true;
    if ((a[i] ?? 0) < (r[i] ?? 0)) return false;
  }
  return true;
}

function stableBucket(input: string) {
  let hash = 0;
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) % 10_000;
  return hash % 100;
}

function buildDecision(
  client: ClientState,
  source: StartupDecision["source"],
  values: Record<string, string | number | boolean>,
  shouldRefresh: boolean,
  reason: string,
  nowMs: number,
): StartupDecision {
  return {
    source,
    values,
    shouldRefresh,
    telemetry: {
      tenantId: client.tenantId,
      deviceId: client.deviceId,
      bundleVersion: client.cached?.bundleVersion,
      cacheAgeMs: client.cached ? nowMs - client.cached.fetchedAtMs : undefined,
      reason,
    },
  };
}

export function chooseConfigForStartup(client: ClientState, nowMs: number): StartupDecision {
  const cached = client.cached;
  if (!cached) {
    return buildDecision(client, "bundled-defaults", client.bundledDefaults, true, "no-cached-bundle", nowMs);
  }
  if (!cached.signatureValid) {
    return buildDecision(
      client,
      "bundled-defaults-invalid-signature",
      client.bundledDefaults,
      true,
      "signature-validation-failed",
      nowMs,
    );
  }
  if (!versionAtLeast(client.appVersion, cached.minSupportedAppVersion)) {
    return buildDecision(
      client,
      "bundled-defaults-incompatible-app-version",
      client.bundledDefaults,
      true,
      "client-below-min-supported-version",
      nowMs,
    );
  }
  if (stableBucket(client.tenantId + ":" + client.deviceId + ":" + cached.bundleVersion) >= cached.rolloutPercent) {
    return buildDecision(
      client,
      "rollout-not-assigned",
      client.bundledDefaults,
      false,
      "device-outside-progressive-rollout-bucket",
      nowMs,
    );
  }
  if (nowMs - cached.fetchedAtMs > 24 * 60 * 60 * 1000) {
    return buildDecision(
      client,
      "stale-cache-serve-and-refresh",
      cached.values,
      true,
      "cache-older-than-startup-slo",
      nowMs,
    );
  }
  return buildDecision(client, "fresh-cache", cached.values, false, "cache-valid-for-startup", nowMs);
}

export function selectRollbackBundle(history: CachedBundle[], badVersion: number, clientAppVersion: string) {
  const candidates = history
    .filter((bundle) => bundle.bundleVersion < badVersion)
    .filter((bundle) => bundle.signatureValid)
    .filter((bundle) => versionAtLeast(clientAppVersion, bundle.minSupportedAppVersion))
    .sort((a, b) => b.bundleVersion - a.bundleVersion);

  if (candidates.length === 0) {
    return { action: "use-bundled-defaults", bundle: undefined };
  }

  return { action: "publish-rollback-bundle", bundle: candidates[0] };
}

export function validateRollbackBlastRadius(
  candidate: CachedBundle | undefined,
  activeTenants: Array<{ tenantId: string; currentBundleVersion: number; errorRate: number }>,
) {
  if (!candidate) return { allowed: false, reasons: ["no-compatible-rollback-bundle"], impactedTenants: [] as string[] };

  const impactedTenants = activeTenants
    .filter((tenant) => tenant.currentBundleVersion > candidate.bundleVersion)
    .map((tenant) => tenant.tenantId);
  const unhealthyTenants = activeTenants.filter((tenant) => tenant.errorRate > 0.03).map((tenant) => tenant.tenantId);
  const reasons: string[] = [];

  if (impactedTenants.length === 0) reasons.push("rollback-would-not-change-any-active-tenant");
  if (unhealthyTenants.length > 0) reasons.push("tenants-already-unhealthy-require-incident-approval");
  if (candidate.rolloutPercent < 100) reasons.push("rollback-target-must-be-fully-eligible");

  return {
    allowed: reasons.length === 0,
    reasons,
    impactedTenants,
    publishPlan: reasons.length === 0 ? "publish-signed-rollback-with-forced-refresh" : "hold-for-review",
  };
}

export function runStartupAndRollbackScenario() {
  const nowMs = Date.parse("2026-05-29T10:00:00.000Z");
  const defaults = { searchRanking: "stable", maxResults: 20, offlineMode: true };
  const history: CachedBundle[] = [
    {
      bundleVersion: 41,
      fetchedAtMs: nowMs - 30 * 60_000,
      signatureValid: true,
      minSupportedAppVersion: "8.4.0",
      rolloutPercent: 100,
      checksum: "sha256:good-v41",
      values: { searchRanking: "stable", maxResults: 20, offlineMode: true },
    },
    {
      bundleVersion: 42,
      fetchedAtMs: nowMs - 36 * 60 * 60_000,
      signatureValid: true,
      minSupportedAppVersion: "8.5.0",
      rolloutPercent: 25,
      checksum: "sha256:bad-v42",
      values: { searchRanking: "experimental", maxResults: 50, offlineMode: false },
    },
  ];

  const startup = chooseConfigForStartup(
    {
      deviceId: "ios-device-77",
      tenantId: "enterprise-acme",
      appVersion: "8.5.1",
      bundledDefaults: defaults,
      cached: history[1],
    },
    nowMs,
  );

  const rollback = selectRollbackBundle(history, 42, "8.5.1");
  const blastRadius = validateRollbackBlastRadius(rollback.bundle, [
    { tenantId: "enterprise-acme", currentBundleVersion: 42, errorRate: 0.012 },
    { tenantId: "consumer-free", currentBundleVersion: 42, errorRate: 0.009 },
  ]);

  return { startup, rollbackAction: rollback.action, rollbackTarget: rollback.bundle?.bundleVersion, blastRadius };
}

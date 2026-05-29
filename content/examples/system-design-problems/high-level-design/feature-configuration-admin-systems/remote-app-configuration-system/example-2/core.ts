export type RemoteConfigRule = {
  key: string;
  value: string | number | boolean;
  minAppVersion: string;
  platforms: Array<"ios" | "android" | "web">;
  rolloutPercent: number;
};

export type ClientContext = {
  appVersion: string;
  platform: "ios" | "android" | "web";
  userId: string;
};

export type ConfigBundle = {
  bundleVersion: number;
  rules: RemoteConfigRule[];
  signature: string;
  cacheTtlSeconds: number;
};

function versionAtLeast(actual: string, required: string) {
  const a = actual.split(".").map(Number);
  const r = required.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, r.length); i++) {
    const left = a[i] ?? 0;
    const right = r[i] ?? 0;
    if (left > right) return true;
    if (left < right) return false;
  }
  return true;
}

function bucket(userId: string, key: string) {
  let hash = 0;
  for (const char of userId + ":" + key) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash % 100;
}

function sign(payload: string) {
  let hash = 5381;
  for (const char of payload) hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  return "sig_" + hash.toString(16);
}

export function compileBundle(rules: RemoteConfigRule[], bundleVersion: number): ConfigBundle {
  const unsafe = rules.filter((rule) => rule.rolloutPercent < 0 || rule.rolloutPercent > 100);
  if (unsafe.length > 0) throw new Error("invalid-rollout-percent:" + unsafe.map((rule) => rule.key).join(","));
  const payload = JSON.stringify({ bundleVersion, rules });
  return { bundleVersion, rules, signature: sign(payload), cacheTtlSeconds: 300 };
}

export function evaluateForClient(bundle: ConfigBundle, ctx: ClientContext) {
  const values: Record<string, string | number | boolean> = {};
  const skipped: string[] = [];

  for (const rule of bundle.rules) {
    if (!versionAtLeast(ctx.appVersion, rule.minAppVersion)) {
      skipped.push(rule.key + ":app-version-too-old");
      continue;
    }
    if (!rule.platforms.includes(ctx.platform)) {
      skipped.push(rule.key + ":platform-not-targeted");
      continue;
    }
    if (bucket(ctx.userId, rule.key) >= rule.rolloutPercent) {
      skipped.push(rule.key + ":outside-rollout");
      continue;
    }
    values[rule.key] = rule.value;
  }

  return { bundleVersion: bundle.bundleVersion, values, skipped };
}

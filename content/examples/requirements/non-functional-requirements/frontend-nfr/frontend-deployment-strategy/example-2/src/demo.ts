type Cfg = { apiBaseUrl: string; logLevel: "info" | "debug" | "warn" };

function merge(defaults: Cfg, env: Partial<Cfg>, remote: Partial<Cfg>) {
  // Precedence: defaults < env < remote (can be reversed depending on org policy)
  return { ...defaults, ...env, ...remote };
}

const defaults: Cfg = { apiBaseUrl: "https://api.example.com", logLevel: "info" };
const env = { logLevel: "debug" as const };
const remote = { apiBaseUrl: "https://api-canary.example.com" };

console.log(JSON.stringify({ merged: merge(defaults, env, remote) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));


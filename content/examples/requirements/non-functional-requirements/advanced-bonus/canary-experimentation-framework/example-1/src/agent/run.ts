import * as fs from "fs";
import * as path from "path";

type Report = {
  now: string;
  config: {
    routing: { canaryPct: number; salt: string };
    guardrails: { maxErrorRateDelta: number; maxP95DeltaMs: number };
  };
  variants: {
    baseline: { total: number; errorRate: number; latencyMs: { p95: number } };
    canary: { total: number; errorRate: number; latencyMs: { p95: number } };
  };
  comparison: {
    errorRateDelta: number;
    p95DeltaMs: number;
    guardrails: { ok: boolean; reasons: string[] };
  };
};

function arg(name: string, def?: string) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  return process.argv[idx + 1] ?? def;
}

function argNum(name: string, def: number) {
  const v = arg(name, String(def));
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function argList(name: string, def: number[]) {
  const raw = arg(name);
  if (!raw) return def;
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
}

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text) as T;
}

async function workerLoop(params: { baseUrl: string; stopAt: number; samples: { ok: boolean }[] }) {
  const { baseUrl, stopAt, samples } = params;
  let i = 0;
  while (Date.now() < stopAt) {
    const userId = `user-${(i++ % 5000) + 1}`;
    try {
      const res = await fetch(`${baseUrl}/api/serve`, { headers: { "x-user-id": userId }, cache: "no-store" });
      samples.push({ ok: res.ok });
    } catch {
      samples.push({ ok: false });
    }
  }
}

async function main() {
  const baseUrl = arg("baseUrl", "http://localhost:3000")!;
  const stageMs = argNum("stageMs", 15_000);
  const concurrency = argNum("concurrency", 40);
  const ramp = argList("ramp", [1, 5, 10, 25, 50]);
  const maxErrorRateDelta = argNum("maxErrorRateDelta", 0.01);
  const maxP95DeltaMs = argNum("maxP95DeltaMs", 80);

  const rolloutId = `rollout-${Date.now()}`;
  await json(`${baseUrl}/api/reset`, { method: "POST" });

  const reportSteps: any[] = [];
  let outcome: "promoted" | "rolled_back" = "promoted";

  for (const pct of ramp) {
    await json(`${baseUrl}/api/config`, {
      method: "POST",
      body: JSON.stringify({
        routing: { canaryPct: pct, salt: rolloutId },
        guardrails: { maxErrorRateDelta, maxP95DeltaMs },
      }),
    });

    const stopAt = Date.now() + stageMs;
    const samples: { ok: boolean }[] = [];
    const workers = Array.from({ length: Math.max(1, concurrency) }, () =>
      workerLoop({ baseUrl, stopAt, samples }),
    );
    await Promise.all(workers);

    const rep = await json<Report>(`${baseUrl}/api/report`);
    const step = {
      pct,
      stageMs,
      samples: { total: samples.length, ok: samples.filter((s) => s.ok).length },
      report: rep,
    };
    reportSteps.push(step);
    console.log(JSON.stringify(step, null, 2));

    if (!rep.comparison.guardrails.ok) {
      outcome = "rolled_back";
      await json(`${baseUrl}/api/config`, {
        method: "POST",
        body: JSON.stringify({
          routing: { canaryPct: 0, salt: rolloutId },
          guardrails: { maxErrorRateDelta, maxP95DeltaMs },
        }),
      });
      break;
    }
  }

  const final = await json<Report>(`${baseUrl}/api/report`);
  const artifact = {
    createdAt: new Date().toISOString(),
    rolloutId,
    ramp,
    stageMs,
    concurrency,
    guardrails: { maxErrorRateDelta, maxP95DeltaMs },
    outcome,
    steps: reportSteps,
    final,
  };

  const runsDir = path.join(process.cwd(), "runs");
  fs.mkdirSync(runsDir, { recursive: true });
  const outPath = path.join(runsDir, `canary-rollout-${rolloutId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(artifact, null, 2) + "\n", "utf-8");
  console.log(JSON.stringify({ outPath }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


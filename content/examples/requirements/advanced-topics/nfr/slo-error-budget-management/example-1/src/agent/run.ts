import * as fs from "fs";
import * as path from "path";

type ConfigResponse = {
  slo: {
    objective: number;
    windowDays: number;
    latencyThresholdMs: number;
    badStatusFrom: number;
  };
  behavior: {
    baseLatencyMs: number;
    jitterMs: number;
    tailPct: number;
    tailLatencyMs: number;
    errorRate: number;
    errorStatus: number;
  };
};

type ReportResponse = {
  now: string;
  rollingBudget: { remainingPct: number; consumedPct: number; total: number; bad: number };
  burn: Array<{ windowLabel: string; burnRate: number; total: number; bad: number }>;
  alerts: { fast: { firing: boolean }; slow: { firing: boolean }; releaseFreeze: boolean };
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
  while (Date.now() < stopAt) {
    try {
      const res = await fetch(`${baseUrl}/api/target`, {
        headers: { "x-request-id": crypto.randomUUID() },
        cache: "no-store",
      });
      samples.push({ ok: res.ok });
    } catch {
      samples.push({ ok: false });
    }
  }
}

async function main() {
  const baseUrl = arg("baseUrl", "http://localhost:3000")!;
  const durationMs = argNum("durationMs", 60_000);
  const concurrency = argNum("concurrency", 25);
  const baselineErrorRate = argNum("baselineErrorRate", 0.002);
  const incidentErrorRate = argNum("incidentErrorRate", 0.03);
  const incidentAtMs = argNum("incidentAtMs", 20_000);

  await json(`${baseUrl}/api/reset`, { method: "POST" });
  const cfg = await json<ConfigResponse>(`${baseUrl}/api/config`);

  await json(`${baseUrl}/api/config`, {
    method: "POST",
    body: JSON.stringify({
      ...cfg,
      behavior: { ...cfg.behavior, errorRate: baselineErrorRate },
    }),
  });

  const stopAt = Date.now() + durationMs;
  const incidentAt = Date.now() + incidentAtMs;
  const samples: { ok: boolean }[] = [];

  const workers = Array.from({ length: Math.max(1, concurrency) }, () =>
    workerLoop({ baseUrl, stopAt, samples }),
  );

  let incidentApplied = false;
  const observations: any[] = [];

  while (Date.now() < stopAt) {
    await new Promise((r) => setTimeout(r, 2000));
    if (!incidentApplied && Date.now() >= incidentAt) {
      const cur = await json<ConfigResponse>(`${baseUrl}/api/config`);
      await json(`${baseUrl}/api/config`, {
        method: "POST",
        body: JSON.stringify({
          ...cur,
          behavior: { ...cur.behavior, errorRate: incidentErrorRate },
        }),
      });
      incidentApplied = true;
    }

    const rep = await json<ReportResponse>(`${baseUrl}/api/report`);
    observations.push({
      t: rep.now,
      remainingPct: rep.rollingBudget.remainingPct,
      consumedPct: rep.rollingBudget.consumedPct,
      alerts: rep.alerts,
      burn: Object.fromEntries(rep.burn.map((b) => [b.windowLabel, b.burnRate])),
    });
    console.log(JSON.stringify(observations[observations.length - 1], null, 2));
  }

  await Promise.all(workers);
  const finalReport = await json<ReportResponse>(`${baseUrl}/api/report`);

  const runsDir = path.join(process.cwd(), "runs");
  fs.mkdirSync(runsDir, { recursive: true });
  const outPath = path.join(runsDir, `slo-report-${Date.now()}.json`);

  const summary = {
    createdAt: new Date().toISOString(),
    config: await json<ConfigResponse>(`${baseUrl}/api/config`),
    workload: { durationMs, concurrency, baselineErrorRate, incidentErrorRate, incidentAtMs },
    samples: { total: samples.length, ok: samples.filter((s) => s.ok).length },
    final: finalReport,
    observations,
  };

  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + "\n", "utf-8");
  console.log(JSON.stringify({ outPath }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


import * as fs from "fs";
import * as path from "path";

type Fault =
  | { type: "latency"; latencyMs: number }
  | { type: "error"; errorStatus: number }
  | { type: "timeout"; timeoutMs: number };

type Experiment = {
  id: string;
  name: string;
  status: "created" | "running" | "stopped" | "completed";
  durationMs: number;
  blastPct: number;
  fault: Fault;
  hypothesis: { maxErrorRate: number; maxP95Ms: number };
  createdAt: string;
};

type Metrics = {
  total: number;
  ok: number;
  errors: number;
  errorRate: number;
  latencyMs: { p50: number; p95: number; max: number };
  updatedAt: string;
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
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text) as T;
}

type Sample = { ok: boolean; latencyMs: number; status: number };

function percentile(values: number[], q: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor(q * (sorted.length - 1));
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

async function workerLoop(params: {
  baseUrl: string;
  stopAt: number;
  perRequestTimeoutMs: number;
  samples: Sample[];
}) {
  const { baseUrl, stopAt, perRequestTimeoutMs, samples } = params;

  while (Date.now() < stopAt) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), perRequestTimeoutMs);
    const started = Date.now();
    try {
      const res = await fetch(`${baseUrl}/api/target`, {
        headers: { "x-request-id": crypto.randomUUID() },
        signal: controller.signal,
        cache: "no-store",
      });
      const latencyMs = Date.now() - started;
      samples.push({ ok: res.ok, latencyMs, status: res.status });
    } catch {
      const latencyMs = Date.now() - started;
      samples.push({ ok: false, latencyMs, status: 599 });
    } finally {
      clearTimeout(t);
    }
  }
}

function computeLocalMetrics(samples: Sample[]) {
  const total = samples.length;
  const ok = samples.filter((s) => s.ok).length;
  const errors = total - ok;
  const errorRate = total === 0 ? 0 : errors / total;
  const latencies = samples.map((s) => s.latencyMs);
  return {
    total,
    ok,
    errors,
    errorRate,
    p95: percentile(latencies, 0.95),
  };
}

async function main() {
  const baseUrl = arg("baseUrl", "http://localhost:3000")!;
  const durationMs = argNum("durationMs", 30_000);
  const concurrency = argNum("concurrency", 30);
  const blastPct = argNum("blastPct", 20);
  const fault = (arg("fault", "latency") as Fault["type"]) ?? "latency";
  const latencyMs = argNum("latencyMs", 250);
  const errorStatus = argNum("errorStatus", 503);
  const timeoutMs = argNum("timeoutMs", 2_000);
  const maxErrorRate = argNum("maxErrorRate", 0.05);
  const maxP95Ms = argNum("maxP95Ms", 350);
  const perRequestTimeoutMs = argNum("perRequestTimeoutMs", 900);

  const faultConfig: Fault =
    fault === "latency"
      ? { type: "latency", latencyMs }
      : fault === "error"
        ? { type: "error", errorStatus }
        : { type: "timeout", timeoutMs };

  console.log(
    JSON.stringify(
      {
        phase: "create",
        baseUrl,
        durationMs,
        concurrency,
        blastPct,
        fault: faultConfig,
        hypothesis: { maxErrorRate, maxP95Ms },
      },
      null,
      2,
    ),
  );

  const exp = await json<Experiment>(`${baseUrl}/api/experiments`, {
    method: "POST",
    body: JSON.stringify({
      name: `agent-${fault}-${Date.now()}`,
      durationMs,
      blastPct,
      fault: faultConfig,
      hypothesis: { maxErrorRate, maxP95Ms },
      notes:
        "Agent-created experiment. In production, enforce approvals, maintenance windows, and automatic rollback hooks.",
    }),
  });

  await json(`${baseUrl}/api/experiments/${exp.id}/start`, { method: "POST" });
  console.log(JSON.stringify({ phase: "started", id: exp.id }, null, 2));

  const stopAt = Date.now() + durationMs;
  const samples: Sample[] = [];

  const loops = Array.from({ length: Math.max(1, concurrency) }, () =>
    workerLoop({ baseUrl, stopAt, perRequestTimeoutMs, samples }),
  );

  let stopReason: string | null = null;
  while (Date.now() < stopAt) {
    await new Promise((r) => setTimeout(r, 2000));
    const steady = await json<Metrics>(`${baseUrl}/api/metrics/steady-state`).catch(() => null);
    const local = computeLocalMetrics(samples);

    const p95 = Math.max(local.p95, steady?.latencyMs.p95 ?? 0);
    const errRate = Math.max(local.errorRate, steady?.errorRate ?? 0);

    console.log(
      JSON.stringify(
        {
          phase: "observe",
          local,
          steady,
          guardrails: { maxErrorRate, maxP95Ms },
        },
        null,
        2,
      ),
    );

    if (errRate > maxErrorRate) {
      stopReason = `guardrail_breach:error_rate:${errRate.toFixed(4)}>${maxErrorRate}`;
      break;
    }
    if (p95 > maxP95Ms) {
      stopReason = `guardrail_breach:p95:${p95.toFixed(0)}>${maxP95Ms}`;
      break;
    }
  }

  await Promise.all(loops);
  await json(`${baseUrl}/api/experiments/${exp.id}/stop`, { method: "POST" });

  const finalSteady = await json<Metrics>(`${baseUrl}/api/metrics/steady-state`).catch(() => null);
  const finalLocal = computeLocalMetrics(samples);

  const report = {
    id: exp.id,
    createdAt: new Date().toISOString(),
    config: {
      durationMs,
      concurrency,
      blastPct,
      fault: faultConfig,
      hypothesis: { maxErrorRate, maxP95Ms },
      perRequestTimeoutMs,
    },
    result: {
      stoppedEarly: Boolean(stopReason),
      stopReason,
    },
    observations: {
      local: finalLocal,
      steadyState: finalSteady,
      sampleCount: samples.length,
    },
  };

  const runsDir = path.join(process.cwd(), "runs");
  fs.mkdirSync(runsDir, { recursive: true });
  const outPath = path.join(runsDir, `report-${exp.id.slice(0, 8)}-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n", "utf-8");

  console.log(JSON.stringify({ phase: "done", outPath, report }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


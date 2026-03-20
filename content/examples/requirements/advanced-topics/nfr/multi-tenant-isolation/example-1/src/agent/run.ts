import * as fs from "fs";
import * as path from "path";

type Mode = "shared" | "bulkhead";

type Report = {
  now: string;
  config: { mode: Mode };
  tenants: Record<
    string,
    {
      total: number;
      errorRate: number;
      latencyMs: { p95: number };
      rejected: Record<string, number>;
      budget: { remainingUnits: number };
    }
  >;
};

function arg(name: string, def?: string) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return def;
  return process.argv[idx + 1] ?? def;
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

async function worker(params: { baseUrl: string; stopAt: number; tenantId: string; units: number }) {
  const { baseUrl, stopAt, tenantId, units } = params;
  while (Date.now() < stopAt) {
    try {
      await fetch(`${baseUrl}/api/work?units=${units}`, {
        headers: { "x-tenant-id": tenantId, "x-request-id": crypto.randomUUID() },
        cache: "no-store",
      });
    } catch {
      // ignore
    }
  }
}

async function main() {
  const baseUrl = arg("baseUrl", "http://localhost:3000")!;
  const mode = (arg("mode", "shared") as Mode) ?? "shared";

  const enterprise = "tenant-enterprise";
  const free = "tenant-free";

  await json(`${baseUrl}/api/reset`, { method: "POST" });
  await json(`${baseUrl}/api/config`, {
    method: "POST",
    body: JSON.stringify({ mode, globalMaxConcurrent: 60 }),
  });

  // Phase A: normal traffic (both tenants stable)
  const phaseAStop = Date.now() + 12_000;
  await Promise.all([
    worker({ baseUrl, stopAt: phaseAStop, tenantId: enterprise, units: 1 }),
    worker({ baseUrl, stopAt: phaseAStop, tenantId: free, units: 1 }),
  ]);
  const repA = await json<Report>(`${baseUrl}/api/report`);

  // Phase B: noisy neighbor (free tenant spikes and consumes shared capacity)
  const phaseBStop = Date.now() + 15_000;
  await Promise.all([
    ...Array.from({ length: 8 }, () =>
      worker({ baseUrl, stopAt: phaseBStop, tenantId: free, units: 2 }),
    ),
    worker({ baseUrl, stopAt: phaseBStop, tenantId: enterprise, units: 1 }),
  ]);
  const repB = await json<Report>(`${baseUrl}/api/report`);

  const artifact = {
    createdAt: new Date().toISOString(),
    mode,
    phases: {
      normal: summarize(repA),
      noisyNeighbor: summarize(repB),
    },
    interpretation:
      mode === "shared"
        ? "Shared pool: the spiky tenant can increase contention and degrade other tenants (p95 and rejects)."
        : "Bulkheads: per-tenant concurrency reserves capacity so the enterprise tenant stays more stable.",
  };

  const runsDir = path.join(process.cwd(), "runs");
  fs.mkdirSync(runsDir, { recursive: true });
  const outPath = path.join(runsDir, `tenant-lab-${mode}-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(artifact, null, 2) + "\n", "utf-8");
  console.log(JSON.stringify({ outPath, artifact }, null, 2));
}

function summarize(rep: Report) {
  const out: any = {};
  for (const [tid, r] of Object.entries(rep.tenants)) {
    out[tid] = {
      total: r.total,
      errorRate: r.errorRate,
      p95: r.latencyMs.p95,
      rejected: r.rejected,
      remainingUnits: r.budget.remainingUnits,
    };
  }
  return out;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


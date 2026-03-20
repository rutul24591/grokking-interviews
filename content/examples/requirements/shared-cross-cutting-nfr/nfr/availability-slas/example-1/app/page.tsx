"use client";

import { useEffect, useMemo, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function fmtPct(x: number) {
  return `${(x * 100).toFixed(3)}%`;
}

function fmtMin(x: number) {
  return `${x.toFixed(2)} min`;
}

export default function Page() {
  const [composition, setComposition] = useState<"serial" | "parallel">("serial");
  const [slaTarget, setSlaTarget] = useState(0.999);
  const [correlatedDownPct, setCorrelatedDownPct] = useState(0);
  const [components, setComponents] = useState([
    { name: "api", availability: 0.9995 },
    { name: "db", availability: 0.999 },
    { name: "cache", availability: 0.999 },
  ]);
  const [calc, setCalc] = useState<any>(null);
  const [sim, setSim] = useState<any>(null);
  const [error, setError] = useState("");

  async function recalc() {
    try {
      const c = await json("/api/calc", {
        method: "POST",
        body: JSON.stringify({ composition, components, slaTarget }),
      });
      setCalc(c);
      const s = await json("/api/simulate", {
        method: "POST",
        body: JSON.stringify({ composition, components, correlatedDownPct, trials: 5000 }),
      });
      setSim(s);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    recalc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meets = useMemo(() => Boolean(calc?.meetsTarget), [calc]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">SLA Lab</h1>
        <p className="mt-2 text-slate-300">
          Composite availability calculator with downtime and a toy correlation simulation.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Model</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Composition</span>
              <select
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={composition}
                onChange={(e) => setComposition(e.target.value as any)}
              >
                <option value="serial">serial (all must be up)</option>
                <option value="parallel">parallel (any one works)</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">SLA target</span>
              <input
                type="number"
                step="0.0001"
                min="0.9"
                max="0.99999"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={slaTarget}
                onChange={(e) => setSlaTarget(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Correlated down %</span>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={correlatedDownPct}
                onChange={(e) => setCorrelatedDownPct(Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              onClick={recalc}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
            >
              Recalculate
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Results</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded border border-slate-800 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-300">Effective</div>
              <div className="mt-1 text-2xl font-bold">{calc ? fmtPct(calc.effectiveAvailability) : "—"}</div>
            </div>
            <div className="rounded border border-slate-800 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-300">Expected downtime</div>
              <div className="mt-1 text-2xl font-bold">
                {calc ? fmtMin(calc.expectedDowntimeMinutes) : "—"}
              </div>
            </div>
            <div className="rounded border border-slate-800 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-300">Meets target</div>
              <div className={"mt-1 text-2xl font-bold " + (meets ? "text-emerald-400" : "text-red-400")}>
                {calc ? String(meets) : "—"}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4">
            <div className="text-sm font-semibold text-slate-200">Simulation (toy)</div>
            <div className="mt-2 grid gap-2 text-xs text-slate-300 sm:grid-cols-4">
              <div className="rounded bg-black/40 px-3 py-2">mean: <span className="font-mono text-slate-100">{sim ? fmtPct(sim.mean) : "—"}</span></div>
              <div className="rounded bg-black/40 px-3 py-2">p05: <span className="font-mono text-slate-100">{sim ? fmtPct(sim.p05) : "—"}</span></div>
              <div className="rounded bg-black/40 px-3 py-2">p50: <span className="font-mono text-slate-100">{sim ? fmtPct(sim.p50) : "—"}</span></div>
              <div className="rounded bg-black/40 px-3 py-2">p95: <span className="font-mono text-slate-100">{sim ? fmtPct(sim.p95) : "—"}</span></div>
            </div>
            <div className="mt-3 text-xs text-slate-300">
              Increasing correlatedDownPct demonstrates how shared failure modes reduce effective availability.
            </div>
          </div>

          <pre className="mt-6 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify({ calc, sim }, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}


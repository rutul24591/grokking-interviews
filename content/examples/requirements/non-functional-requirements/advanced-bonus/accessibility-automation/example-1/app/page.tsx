"use client";

import { useEffect, useMemo, useState } from "react";
import { VARIANTS, type Variant } from "@/lib/variants";

type AuditResponse = {
  variant: { id: string; name: string; description: string };
  summary: {
    auditedAt: string;
    totalViolations: number;
    byImpact: Record<string, number>;
    violations: Array<{
      id: string;
      impact: string | null;
      help: string;
      helpUrl: string;
      nodes: Array<{ target: string[]; failureSummary?: string }>;
    }>;
  };
  baseline: { capturedAt: string; summary: AuditResponse["summary"] } | null;
  delta:
    | null
    | {
        newViolations: number;
        byImpactDelta: Record<string, number>;
      };
};

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [selected, setSelected] = useState<Variant>(VARIANTS[0]);
  const [report, setReport] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const previewHtml = useMemo(() => {
    // Preview only: in production, never render untrusted HTML.
    return selected.html;
  }, [selected.html]);

  async function runAudit() {
    setLoading(true);
    try {
      const r = await json<AuditResponse>(`/api/audit?variantId=${selected.id}`);
      setReport(r);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function captureBaseline() {
    setLoading(true);
    try {
      await json("/api/baseline", {
        method: "POST",
        body: JSON.stringify({ variantId: selected.id }),
      });
      await runAudit();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }

  useEffect(() => {
    runAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">A11y Audit Console</h1>
        <p className="mt-2 text-slate-300">
          Accessibility automation demo: audit UI variants with axe, set a baseline, and enforce no regressions.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
          <div className="font-semibold">CI agent</div>
          <pre className="mt-2 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{`pnpm agent:run -- --baseUrl http://localhost:3000 --maxNewViolations 0`}</pre>
        </div>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Variant</h2>
          <p className="mt-1 text-sm text-slate-300">
            Pick a UI variant; some are intentionally broken to simulate regressions.
          </p>

          <select
            className="mt-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={selected.id}
            onChange={(e) => {
              const v = VARIANTS.find((x) => x.id === e.target.value);
              if (v) setSelected(v);
            }}
          >
            {VARIANTS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <div className="mt-4 rounded border border-slate-800 bg-black/30 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Description
            </div>
            <div className="mt-1 text-sm text-slate-100">{selected.description}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500 disabled:opacity-50"
              onClick={runAudit}
              disabled={loading}
            >
              {loading ? "Running..." : "Run audit"}
            </button>
            <button
              type="button"
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
              onClick={captureBaseline}
              disabled={loading}
            >
              Capture baseline
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-200">Preview</h3>
            <div
              className="mt-2 rounded border border-slate-800 bg-white p-4 text-slate-950"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Report</h2>
          {!report ? (
            <div className="mt-4 text-sm text-slate-300">Run an audit to see results.</div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded border border-slate-800 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-300">Violations</div>
                  <div className="mt-1 text-2xl font-bold">{report.summary.totalViolations}</div>
                </div>
                <div className="rounded border border-slate-800 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-300">Baseline</div>
                  <div className="mt-1 text-2xl font-bold">
                    {report.baseline ? report.baseline.summary.totalViolations : "—"}
                  </div>
                </div>
                <div className="rounded border border-slate-800 bg-black/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-300">New</div>
                  <div className="mt-1 text-2xl font-bold">
                    {report.delta ? report.delta.newViolations : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-5 text-sm text-slate-200">
                <div className="font-semibold">By impact</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {Object.entries(report.summary.byImpact).map(([k, v]) => (
                    <div key={k} className="flex justify-between rounded border border-slate-800 bg-black/20 px-3 py-2">
                      <span className="font-mono">{k}</span>
                      <span className="font-semibold text-slate-100">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-200">Violations</h3>
                <div className="mt-2 space-y-3">
                  {!report.summary.violations.length ? (
                    <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
                      No violations found.
                    </div>
                  ) : null}

                  {report.summary.violations.map((v) => (
                    <div key={v.id} className="rounded border border-slate-800 bg-black/30 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="font-mono text-sm text-slate-100">{v.id}</div>
                        <div className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
                          {v.impact ?? "unknown"}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-slate-200">{v.help}</div>
                      <a
                        className="mt-2 inline-block text-xs text-sky-300 underline"
                        href={v.helpUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        docs
                      </a>
                      <div className="mt-3 space-y-2 text-xs text-slate-300">
                        {v.nodes.slice(0, 3).map((n, idx) => (
                          <div key={idx} className="rounded border border-slate-800 bg-black/20 p-2">
                            <div className="font-mono">{n.target.join(", ")}</div>
                            {n.failureSummary ? (
                              <div className="mt-1 whitespace-pre-wrap">{n.failureSummary}</div>
                            ) : null}
                          </div>
                        ))}
                        {v.nodes.length > 3 ? (
                          <div>…{v.nodes.length - 3} more node(s)</div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}


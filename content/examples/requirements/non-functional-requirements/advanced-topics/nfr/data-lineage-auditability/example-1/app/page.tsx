"use client";

import { useEffect, useMemo, useState } from "react";

type LineageNode = { id: string; kind: string; name: string; version: string };
type LineageEdge = { id: string; from: string; to: string; type: string; ts: string; jobRunId: string };
type LedgerEvent = { id: string; ts: string; type: string; actor: string; jobRunId: string; payload: any; prevHash: string | null; hash: string };

type Snapshot = {
  lastRun: { jobRunId: string; jobName: string; ts: string } | null;
  lineage: { nodes: LineageNode[]; edges: LineageEdge[] };
  ledger: LedgerEvent[];
  headHash: string | null;
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
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [verify, setVerify] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [jobName, setJobName] = useState("daily-aggregate");

  async function refresh() {
    try {
      const [s, v] = await Promise.all([
        json<Snapshot>("/api/lineage"),
        json("/api/audit/verify"),
      ]);
      setSnapshot(s);
      setVerify(v);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function runJob() {
    await json("/api/job/run", { method: "POST", body: JSON.stringify({ jobName }) });
    await refresh();
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, []);

  const nodesById = useMemo(() => {
    const m = new Map<string, LineageNode>();
    for (const n of snapshot?.lineage.nodes ?? []) m.set(n.id, n);
    return m;
  }, [snapshot?.lineage.nodes]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Lineage Ledger</h1>
        <p className="mt-2 text-slate-300">
          A data lineage + auditability demo with an append-only, hash-chained ledger and an evidence export.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
          <div className="font-semibold">Agent (evidence bundle)</div>
          <pre className="mt-2 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{`pnpm agent:run -- --baseUrl http://localhost:3000 --job daily-aggregate`}</pre>
        </div>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Run pipeline</h2>
          <p className="mt-1 text-sm text-slate-300">
            Triggers a small pipeline (raw → sanitized → aggregated) and appends ledger + lineage events.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
            />
            <button
              type="button"
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
              onClick={runJob}
            >
              Run
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-slate-800 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-300">Ledger head</div>
              <div className="mt-1 break-all font-mono text-xs text-slate-100">
                {snapshot?.headHash ?? "—"}
              </div>
            </div>
            <div className="rounded border border-slate-800 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-300">Verify</div>
              <div className="mt-1 text-sm font-semibold">
                {verify?.verification?.ok ? (
                  <span className="text-emerald-400">ok</span>
                ) : (
                  <span className="text-red-400">FAILED</span>
                )}
                <span className="ml-2 text-xs text-slate-300">
                  checked {verify?.verification?.checked ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-200">Lineage edges</h3>
            <div className="mt-2 overflow-auto rounded border border-slate-800">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-black/40 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-3 py-2">From</th>
                    <th className="px-3 py-2">To</th>
                    <th className="px-3 py-2">Job run</th>
                  </tr>
                </thead>
                <tbody className="text-slate-100">
                  {(snapshot?.lineage.edges ?? []).slice().reverse().map((e) => {
                    const from = nodesById.get(e.from);
                    const to = nodesById.get(e.to);
                    return (
                      <tr key={e.id} className="border-t border-slate-800">
                        <td className="px-3 py-2 font-mono text-xs">
                          {from ? `${from.name}@${from.version}` : e.from}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {to ? `${to.name}@${to.version}` : e.to}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs">{e.jobRunId.slice(0, 16)}…</td>
                      </tr>
                    );
                  })}
                  {!snapshot?.lineage.edges?.length ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-3 text-slate-300">
                        No edges yet. Run the pipeline.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Ledger events</h2>
          <p className="mt-1 text-sm text-slate-300">
            Append-only audit log with a hash chain (tamper-evident).
          </p>
          <div className="mt-4 space-y-3">
            {(snapshot?.ledger ?? []).slice().reverse().slice(0, 20).map((e) => (
              <div key={e.id} className="rounded border border-slate-800 bg-black/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-mono text-xs text-slate-300">{e.ts}</div>
                  <div className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
                    {e.type}
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-200">
                  <span className="font-semibold">jobRunId:</span>{" "}
                  <span className="font-mono">{e.jobRunId.slice(0, 20)}…</span>
                </div>
                <pre className="mt-2 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
{JSON.stringify(e.payload, null, 2)}
                </pre>
                <div className="mt-2 text-xs text-slate-300">
                  <span className="font-semibold">hash:</span>{" "}
                  <span className="font-mono break-all">{e.hash.slice(0, 24)}…</span>
                </div>
              </div>
            ))}
            {!snapshot?.ledger?.length ? (
              <div className="rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
                No events yet. Run the pipeline.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}


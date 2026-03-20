"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [deps, setDeps] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [upgradeName, setUpgradeName] = useState("next");
  const [toVersion, setToVersion] = useState("17.0.0");

  async function refresh() {
    try {
      const [d, p] = await Promise.all([json<{ deps: any[] }>("/api/deps"), json<{ proposals: any[] }>("/api/proposals")]);
      setDeps(d.deps);
      setProposals(p.proposals);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, []);

  async function createProposal() {
    const from = deps.find((d) => d.name === upgradeName)?.version ?? "0.0.0";
    await json("/api/proposals", {
      method: "POST",
      body: JSON.stringify({ upgrades: [{ name: upgradeName, from, to: toVersion }] }),
    });
    await refresh();
  }

  async function approve(id: string) {
    await json(`/api/proposals/${id}/approve`, { method: "POST", body: "{}" });
    await refresh();
  }

  async function apply(id: string) {
    await json(`/api/proposals/${id}/apply`, { method: "POST", body: "{}" });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dependency Governance</h1>
        <p className="mt-2 text-slate-300">Policy-driven dependency upgrades with approvals and blocks.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Create proposal</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Dependency</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={upgradeName} onChange={(e) => setUpgradeName(e.target.value)}>
                {deps.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">To version</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={toVersion} onChange={(e) => setToVersion(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={createProposal}>Create</button>
              <button className="ml-auto rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>Reset proposals</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Dependencies</h2>
          <div className="mt-4 overflow-auto rounded border border-slate-800">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-black/40 text-xs uppercase tracking-wide text-slate-300">
                <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Version</th><th className="px-3 py-2">License</th><th className="px-3 py-2">Advisory</th></tr>
              </thead>
              <tbody className="text-slate-100">
                {deps.map((d) => (
                  <tr key={d.name} className="border-t border-slate-800">
                    <td className="px-3 py-2 font-mono text-xs">{d.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{d.version}</td>
                    <td className="px-3 py-2">{d.license}</td>
                    <td className="px-3 py-2">{d.advisory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-slate-200">Proposals</h3>
          <div className="mt-2 space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="rounded border border-slate-800 bg-black/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="text-sm">
                    <div className="font-mono text-xs text-slate-300">{p.id.slice(0, 10)}…</div>
                    <div className="mt-1 text-slate-100">status: <span className="font-semibold">{p.status}</span></div>
                    <div className="mt-1 text-xs text-slate-300">{p.upgrades.map((u: any) => `${u.name} ${u.from}→${u.to}`).join(", ")}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700" onClick={() => approve(p.id)}>Approve</button>
                    <button className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600" onClick={() => apply(p.id)}>Apply</button>
                  </div>
                </div>
                {p.reasons?.length ? (
                  <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    {p.reasons.join(" · ")}
                  </div>
                ) : null}
              </div>
            ))}
            {!proposals.length ? (
              <div className="rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">No proposals yet.</div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}


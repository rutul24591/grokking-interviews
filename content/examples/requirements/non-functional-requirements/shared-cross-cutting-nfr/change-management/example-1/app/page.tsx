"use client";

import { useEffect, useMemo, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text) as T;
}

type Change = any;

export default function Page() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [freeze, setFreeze] = useState<any>(null);
  const [title, setTitle] = useState("Enable new ranking model");
  const [risk, setRisk] = useState("high");
  const [emergency, setEmergency] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const [c, f] = await Promise.all([json<{ changes: Change[] }>("/api/changes"), json("/api/freeze")]);
      setChanges(c.changes);
      setFreeze(f);
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

  async function create() {
    await json("/api/changes", { method: "POST", body: JSON.stringify({ title, risk, emergency, actor: "author" }) });
    await refresh();
  }

  async function submit(id: string) {
    await json(`/api/changes/${id}/submit`, { method: "POST", body: JSON.stringify({ actor: "author" }) });
    await refresh();
  }

  async function approve(id: string, actor: string, role: string) {
    await json(`/api/changes/${id}/approve`, { method: "POST", body: JSON.stringify({ actor, role }) });
    await refresh();
  }

  async function execute(id: string) {
    await json(`/api/changes/${id}/execute`, { method: "POST", body: JSON.stringify({ actor: "deployer" }) });
    await refresh();
  }

  async function toggleFreeze() {
    await json("/api/freeze", {
      method: "POST",
      body: JSON.stringify({
        enabled: !freeze?.enabled,
        reason: "release freeze",
        until: null,
        actor: "oncall",
      }),
    });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  const executed = useMemo(() => changes.filter((c) => c.status === "executed").length, [changes]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Change Control</h1>
        <p className="mt-2 text-slate-300">Approvals + freeze windows + audit timeline.</p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">New change</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Title</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Risk</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={risk} onChange={(e) => setRisk(e.target.value)}>
                {["low", "medium", "high", "critical"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} />
              emergency
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={create}>Create</button>
              <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={toggleFreeze}>
                {freeze?.enabled ? "Disable freeze" : "Enable freeze"}
              </button>
              <button className="ml-auto rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-200">
            <div className="font-semibold">Freeze</div>
            <div className="mt-1 text-xs text-slate-300">enabled: {String(Boolean(freeze?.enabled))}</div>
            <div className="mt-1 text-xs text-slate-300">executed changes: {executed}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Changes</h2>
          <div className="mt-4 space-y-4">
            {changes.map((c) => (
              <div key={c.id} className="rounded border border-slate-800 bg-black/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-100">{c.title}</div>
                    <div className="mt-1 text-xs text-slate-300">
                      risk: {c.risk} · status: {c.status} · emergency: {String(c.emergency)} · approvals: {c.approvals.length}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700" onClick={() => submit(c.id)}>Submit</button>
                    <button className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700" onClick={() => approve(c.id, "reviewer1", "eng")}>Approve 1</button>
                    <button className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700" onClick={() => approve(c.id, "reviewer2", "eng")}>Approve 2</button>
                    <button className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-600" onClick={() => execute(c.id)}>Execute</button>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-slate-300">Audit</summary>
                  <div className="mt-2 space-y-2">
                    {c.audit.slice().reverse().map((e: any, idx: number) => (
                      <div key={idx} className="rounded border border-slate-800 bg-black/40 p-2 text-xs">
                        <span className="font-mono text-slate-300">{e.ts}</span>{" "}
                        <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 font-semibold text-slate-200">{e.type}</span>
                        <div className="mt-1 text-slate-200">{e.actor}: {e.message}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
            {!changes.length ? (
              <div className="rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">No changes yet.</div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}


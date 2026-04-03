"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState("u1");
  const [purpose, setPurpose] = useState("analytics");
  const [data, setData] = useState<any>(null);
  const [audit, setAudit] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const u = await json<{ users: any[] }>("/api/users");
      setUsers(u.users);
      const a = await json<{ audit: any[] }>("/api/audit");
      setAudit(a.audit);
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

  async function access() {
    const r = await json<any>("/api/access", { method: "POST", body: JSON.stringify({ actor: "ui", userId, purpose }) });
    setData(r.data);
    await refresh();
  }

  async function dsar() {
    await json("/api/dsar/delete", { method: "POST", body: JSON.stringify({ actor: "ui", userId }) });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setData(null);
    await refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Privacy Gateway</h1>
        <p className="mt-2 text-slate-300">Purpose-based access, redaction, audit logs, and DSAR deletion.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Request</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">User</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={userId} onChange={(e) => setUserId(e.target.value)}>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>{u.userId} ({u.displayName})</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Purpose</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                {["analytics", "support", "billing"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={access}>Access</button>
              <button className="rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600" onClick={dsar}>DSAR delete</button>
              <button className="ml-auto rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>Reset</button>
            </div>
          </div>
          <pre className="mt-6 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(data, null, 2)}</pre>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Audit log</h2>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(audit.slice(0, 50), null, 2)}</pre>
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether privacy data governance is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For privacy data governance, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For privacy data governance, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For privacy data governance, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Privacy Data Governance</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}


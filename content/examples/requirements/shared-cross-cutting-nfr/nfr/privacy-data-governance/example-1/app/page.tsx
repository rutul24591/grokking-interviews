"use client";

import { useEffect, useState } from "react";

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
    </main>
  );
}


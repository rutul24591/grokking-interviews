"use client";

import { useEffect, useState } from "react";

type AuditEvent = { id: string; actor: string; action: string; sourceIp: string; result: "success" | "failure"; timestamp: string };

export default function Page() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");

  async function refresh(nextAction = action, nextResult = result) {
    const params = new URLSearchParams();
    if (nextAction) params.set("action", nextAction);
    if (nextResult) params.set("result", nextResult);
    const response = await fetch(`/api/audit/events?${params.toString()}`);
    setEvents((await response.json()) as AuditEvent[]);
  }

  async function addFailure() {
    await fetch("/api/audit/logins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor: "owner@example.com", action: "login", result: "failure", sourceIp: "192.0.2.55" }),
    });
    await refresh();
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Authentication Audit Log Console</h1>
      <p className="mt-2 text-slate-300">Inspect login and verification activity with filters suitable for support and security review.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <select value={action} onChange={async (e) => { setAction(e.target.value); await refresh(e.target.value, result); }} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="">all actions</option>
              <option value="login">login</option>
              <option value="mfa_challenge">mfa_challenge</option>
              <option value="session_revoked">session_revoked</option>
            </select>
            <select value={result} onChange={async (e) => { setResult(e.target.value); await refresh(action, e.target.value); }} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="">all results</option>
              <option value="success">success</option>
              <option value="failure">failure</option>
            </select>
          </div>
          <button onClick={addFailure} className="mt-4 rounded bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500">Simulate failed login</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3 text-sm text-slate-300">
            {events.map((event) => (
              <li key={event.id} className="rounded border border-slate-800 bg-slate-950/70 p-3">
                <p className="font-semibold text-slate-100">{event.action} · {event.result}</p>
                <p className="mt-1">{event.actor} from {event.sourceIp}</p>
                <p className="mt-1 text-xs text-slate-400">{event.timestamp}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

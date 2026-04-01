"use client";

import { useEffect, useState } from "react";

type AuditEvent = {
  actor: string;
  action: string;
  severity: "low" | "medium" | "high";
  redacted: boolean;
};

type AuditResponse = {
  events: AuditEvent[];
  count: number;
  lastMessage?: string;
};

export default function Page() {
  const [state, setState] = useState<AuditResponse | null>(null);
  const [draft, setDraft] = useState<AuditEvent>({ actor: "avery", action: "session.revoked", severity: "medium", redacted: true });

  async function refresh() {
    const response = await fetch("/api/audit/state");
    setState((await response.json()) as AuditResponse);
  }

  async function record() {
    const response = await fetch("/api/audit/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    setState((await response.json()) as AuditResponse);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Security Audit Logging</h1>
      <p className="mt-2 text-slate-300">Record sensitive security actions, preserve investigation context, and highlight redaction posture.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <input value={draft.actor} onChange={(event) => setDraft((current) => ({ ...current, actor: event.target.value }))} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <input value={draft.action} onChange={(event) => setDraft((current) => ({ ...current, action: event.target.value }))} className="mt-3 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <select value={draft.severity} onChange={(event) => setDraft((current) => ({ ...current, severity: event.target.value as AuditEvent["severity"] }))} className="mt-3 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={draft.redacted} onChange={(event) => setDraft((current) => ({ ...current, redacted: event.target.checked }))} />
            redact sensitive details
          </label>
          <button onClick={record} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Record event</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Total events: <span className="font-semibold text-slate-100">{state?.count ?? 0}</span></p>
          <ul className="mt-4 space-y-3">
            {state?.events.slice(0, 4).map((event, index) => (
              <li key={`${event.actor}-${event.action}-${index}`} className="rounded border border-slate-800 px-3 py-2">
                <div className="font-semibold text-slate-100">{event.action}</div>
                <div>{event.actor} · {event.severity} · {event.redacted ? "redacted" : "full"}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

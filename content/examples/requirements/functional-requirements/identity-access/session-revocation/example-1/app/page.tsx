"use client";

import { useEffect, useState } from "react";

type SessionView = { sessionId: string; device: string; revoked: boolean };
type RevocationState = { activeSessions: SessionView[]; revokedCount: number; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<RevocationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/revocation/state");
    setState((await response.json()) as RevocationState);
  }

  async function revoke(sessionId?: string) {
    const response = await fetch("/api/revocation/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionId ? { sessionId } : { all: true })
    });
    setState((await response.json()) as RevocationState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Session Revocation Console</h1>
      <p className="mt-2 text-slate-300">Invalidate one session or all sessions after account compromise or policy changes.</p>
      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <button onClick={() => revoke()} className="rounded bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500">Revoke all sessions</button>
        <p className="mt-4 text-sm text-slate-300">Revoked count: <span className="font-semibold text-slate-100">{state?.revokedCount ?? 0}</span></p>
        <p className="mt-2 text-sm text-slate-300">{state?.lastMessage}</p>
        <ul className="mt-6 space-y-3 text-sm text-slate-300">
          {state?.activeSessions.map((session) => (
            <li key={session.sessionId} className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3">
              <div>
                <div className="font-semibold text-slate-100">{session.device}</div>
                <div className="font-mono text-xs text-slate-400">{session.sessionId}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wide text-slate-400">{session.revoked ? "revoked" : "active"}</span>
                <button onClick={() => revoke(session.sessionId)} className="rounded bg-sky-600 px-3 py-2 text-xs font-semibold hover:bg-sky-500">Revoke</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

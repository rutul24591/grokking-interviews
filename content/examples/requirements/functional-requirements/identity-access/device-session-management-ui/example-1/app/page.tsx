"use client";

import { useEffect, useState } from "react";

type Session = { id: string; device: string; location: string; lastSeen: string; current: boolean; active: boolean };

export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);

  async function refresh() {
    const response = await fetch('/api/devices/state');
    setSessions((await response.json()) as Session[]);
  }

  async function revoke(id: string) {
    const response = await fetch('/api/devices/revoke', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setSessions((await response.json()) as Session[]);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Device Session Management</h1>
      <p className="mt-2 text-slate-300">Review active devices and revoke sessions that should no longer stay authenticated.</p>
      <section className="mt-8 grid gap-4">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-100">{session.device}</p>
                <p className="mt-1">{session.location} · last seen {session.lastSeen}</p>
                <p className="mt-1">Status: <span className="font-semibold text-slate-100">{session.active ? 'active' : 'revoked'}</span>{session.current ? ' · current device' : ''}</p>
              </div>
              {!session.current ? <button onClick={() => revoke(session.id)} className="rounded bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500">Revoke</button> : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

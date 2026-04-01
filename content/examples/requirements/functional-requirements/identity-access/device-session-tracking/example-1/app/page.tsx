"use client";

import { useEffect, useState } from "react";

type Session = { id: string; fingerprint: string; createdAt: string; platform: string; trusted: boolean };

export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [fingerprint, setFingerprint] = useState('android-chrome');
  const [platform, setPlatform] = useState('Android');

  async function refresh() {
    const response = await fetch('/api/tracking/state');
    setSessions((await response.json()) as Session[]);
  }

  async function createSession() {
    const response = await fetch('/api/tracking/new-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint, platform, trusted: false }),
    });
    setSessions((await response.json()) as Session[]);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Device Session Tracking Ledger</h1>
      <p className="mt-2 text-slate-300">Track new session fingerprints and maintain the ledger consumed by device management features.</p>
      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={fingerprint} onChange={(e) => setFingerprint(e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <input value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </div>
        <button onClick={createSession} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Create new session</button>
      </section>
      <section className="mt-6 grid gap-4">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">{session.id} · {session.platform}</p>
            <p className="mt-1">Fingerprint: {session.fingerprint}</p>
            <p className="mt-1">Created at: {session.createdAt}</p>
            <p className="mt-1">Trusted: {session.trusted ? 'yes' : 'no'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

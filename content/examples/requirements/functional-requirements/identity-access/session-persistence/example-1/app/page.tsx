"use client";

import { useEffect, useState } from "react";

type PersistenceState = {
  sessionId: string;
  cookieMode: string;
  rememberMe: boolean;
  restoredAt: string;
  deviceBound: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PersistenceState | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [cookieMode, setCookieMode] = useState("httpOnly");
  const [deviceBound, setDeviceBound] = useState(true);

  async function refresh() {
    const response = await fetch("/api/persistence/state");
    const data = (await response.json()) as PersistenceState;
    setState(data);
    setRememberMe(data.rememberMe);
    setCookieMode(data.cookieMode);
    setDeviceBound(data.deviceBound);
  }

  async function save() {
    const response = await fetch("/api/persistence/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rememberMe, cookieMode, deviceBound })
    });
    setState((await response.json()) as PersistenceState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Session Persistence Controls</h1>
      <p className="mt-2 text-slate-300">Configure how authenticated state survives browser restarts and whether it remains device-bound.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <label className="flex items-center gap-2"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />Remember this device</label>
          <label className="mt-4 block">Cookie mode</label>
          <select value={cookieMode} onChange={(event) => setCookieMode(event.target.value)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="httpOnly">httpOnly</option>
            <option value="partitioned">partitioned</option>
            <option value="session-only">session-only</option>
          </select>
          <label className="mt-4 flex items-center gap-2"><input type="checkbox" checked={deviceBound} onChange={(event) => setDeviceBound(event.target.checked)} />Bind persistence to current device fingerprint</label>
          <button onClick={save} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Save persistence policy</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Session ID: <span className="font-mono text-slate-100">{state?.sessionId}</span></p>
          <p className="mt-2">Last restore: {state?.restoredAt}</p>
          <p className="mt-2">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}

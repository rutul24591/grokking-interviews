"use client";

import { useEffect, useState } from "react";

type LogoutState = {
  sessionActive: boolean;
  user: string;
  activeSessions: number;
  redirectedTo: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<LogoutState | null>(null);
  const [allDevices, setAllDevices] = useState(false);

  async function refresh() {
    const response = await fetch("/api/logout/state");
    setState((await response.json()) as LogoutState);
  }

  async function logout() {
    const response = await fetch("/api/logout/perform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ allDevices })
    });
    setState((await response.json()) as LogoutState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Logout Workflow</h1>
      <p className="mt-2 text-slate-300">
        Terminate the current session or all sessions, then confirm the product redirects the user back to the signed-out entry point.
      </p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>User: <span className="font-semibold text-slate-100">{state?.user}</span></p>
          <p className="mt-2">Active sessions: <span className="font-semibold text-slate-100">{state?.activeSessions ?? 0}</span></p>
          <label className="mt-4 flex items-center gap-2">
            <input type="checkbox" checked={allDevices} onChange={(event) => setAllDevices(event.target.checked)} />
            Sign out from all devices
          </label>
          <button onClick={logout} className="mt-4 rounded bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500">Logout</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Session active: <span className="font-semibold text-slate-100">{state?.sessionActive ? "yes" : "no"}</span></p>
          <p className="mt-2">Redirect target: <span className="font-mono text-slate-100">{state?.redirectedTo}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}

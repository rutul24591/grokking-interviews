"use client";

import { useOpsStore } from "../lib/store";

export function OperationsCenter() {
  const user = useOpsStore((state) => state.user);
  const theme = useOpsStore((state) => state.theme);
  const incidents = useOpsStore((state) => state.incidents);
  const toggleTheme = useOpsStore((state) => state.toggleTheme);
  const claim = useOpsStore((state) => state.claimIncident);
  const resolve = useOpsStore((state) => state.resolveIncident);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Global state management</p>
            <h1 className="mt-2 text-3xl font-semibold">Incident command center</h1>
            <p className="mt-2 text-sm text-slate-400">User identity, theme, and incidents live in one store because multiple distant panels need the same shared state.</p>
          </div>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={toggleTheme}>Theme: {theme}</button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Active operator</h2>
            <p className="mt-2 text-slate-300">{user.name}</p>
            <p className="text-sm text-slate-400">{user.role}</p>
          </aside>
          <div className="grid gap-3">
            {incidents.map((incident) => (
              <article key={incident.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium">{incident.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">Owner: {incident.owner ?? 'unassigned'} · Severity: {incident.severity}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-slate-700 px-3 py-2" onClick={() => claim(incident.id)}>{incident.owner ? 'Reassign to me' : 'Claim'}</button>
                    <button className="rounded-xl bg-emerald-400 px-3 py-2 font-medium text-slate-950" onClick={() => resolve(incident.id)}>Resolve</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

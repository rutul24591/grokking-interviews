"use client";

import { useEffect, useState } from "react";

type Listener = { event: string; active: boolean; staleClosure: boolean; duplicateRisk: boolean };
type Panel = { panelId: string; label: string; listeners: Listener[] };
type State = { activeListeners: number; added: number; removed: number; logs: string[]; panels: Panel[] };

export default function ListenerCleanupLab() {
  const [state, setState] = useState<State | null>(null);
  const [selectedPanel, setSelectedPanel] = useState("analytics");

  async function refresh() {
    const response = await fetch("http://localhost:4532/state");
    const next = (await response.json()) as State;
    setState(next);
    setSelectedPanel((current) => current || next.panels[0]?.panelId || "analytics");
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string, panelId = selectedPanel, event = "") {
    await fetch("http://localhost:4532/listener/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, panelId, event })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Listener lifecycle controls</h2>
        <select className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={selectedPanel} onChange={(event) => setSelectedPanel(event.target.value)}>
          {state?.panels.map((panel) => <option key={panel.panelId} value={panel.panelId}>{panel.label}</option>)}
        </select>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("detach-panel")}>Detach selected</button>
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => void run("attach-panel")}>Attach selected</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void run("cycle-remount")}>Simulate remount</button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">Active: {state?.activeListeners ?? 0}</div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">Added: {state?.added ?? 0}</div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">Removed: {state?.removed ?? 0}</div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((log) => <li key={log}>• {log}</li>)}</ul>
      </article>
      <article className="space-y-4">
        {state?.panels.map((panel) => (
          <div key={panel.panelId} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-950">{panel.label}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{panel.listeners.filter((listener) => listener.active).length} active</span>
            </div>
            <div className="mt-4 grid gap-3">
              {panel.listeners.map((listener) => (
                <div key={listener.event} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{listener.event}</p>
                    <div className="flex gap-2">
                      {listener.active && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">active</span>}
                      {listener.duplicateRisk && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">duplicate risk</span>}
                      {listener.staleClosure && <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800">stale closure</span>}
                    </div>
                  </div>
                  <button className="mt-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 ring-1 ring-slate-200" onClick={() => void run("toggle-stale", panel.panelId, listener.event)}>
                    {listener.staleClosure ? "Refresh handler deps" : "Simulate stale closure"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </article>
    </section>
  );
}

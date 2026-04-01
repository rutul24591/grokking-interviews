"use client";

import { useEffect, useState } from "react";

type ExploreModuleKey = "trending" | "recommended" | "recent";
type ExploreCard = { id: string; title: string; source: string; score: number };
type ModuleState = { modules: Record<ExploreModuleKey, ExploreCard[]>; enabled: Record<ExploreModuleKey, boolean>; order: ExploreModuleKey[]; region: "homepage" | "explore"; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<ModuleState | null>(null);
  const [region, setRegion] = useState<"homepage" | "explore">("homepage");

  async function refresh() {
    const response = await fetch("/api/explore/state");
    const data = (await response.json()) as ModuleState;
    setState(data);
    setRegion(data.region);
  }

  async function toggle(module: ExploreModuleKey, enabled: boolean) {
    if (!state) return;
    const response = await fetch("/api/explore/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, enabled, region, order: state.order })
    });
    setState((await response.json()) as ModuleState);
  }

  async function move(module: ExploreModuleKey, direction: -1 | 1) {
    if (!state) return;
    const index = state.order.indexOf(module);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= state.order.length) return;
    const nextOrder = [...state.order];
    [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];
    const response = await fetch("/api/explore/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, enabled: state.enabled[module], region, order: nextOrder })
    });
    setState((await response.json()) as ModuleState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Explore Page Composition</h1>
      <p className="mt-2 text-slate-300">Assemble trending, recommended, and recent modules into a single exploration surface and handle module-level degradation.</p>
      <section className="mt-8 space-y-6">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <label className="block font-semibold text-slate-100">Target surface</label>
          <select value={region} onChange={(event) => setRegion(event.target.value as "homepage" | "explore")} className="mt-2 w-full max-w-xs rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="homepage">Homepage</option>
            <option value="explore">Explore</option>
          </select>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
        {state?.order.map((module, index) => (
          <article key={module} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold capitalize text-slate-100">{module}</div>
                <div className="mt-1 text-xs text-slate-500">slot #{index + 1}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => void move(module, -1)} className="rounded border border-slate-700 px-3 py-2 text-xs">Move up</button>
                <button onClick={() => void move(module, 1)} className="rounded border border-slate-700 px-3 py-2 text-xs">Move down</button>
                <button onClick={() => void toggle(module, !state.enabled[module])} className="rounded bg-sky-600 px-3 py-2 text-xs font-semibold hover:bg-sky-500">
                  {state.enabled[module] ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {state.modules[module].map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-800 px-4 py-3">
                  <div className="font-medium text-slate-100">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.source} · score {item.score}</div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";

type Slot = "hero" | "sidebar" | "footer";
type Module = { id: string; title: string; slot: Slot; priority: number; inventory: number };
type CarouselState = { slot: Slot; modules: Module[]; renderedIds: string[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<CarouselState | null>(null);
  const [slot, setSlot] = useState<Slot>("hero");

  async function refresh() {
    const response = await fetch("/api/carousel/state");
    const data = (await response.json()) as CarouselState;
    setState(data);
    setSlot(data.slot);
  }

  async function renderSlot() {
    const response = await fetch("/api/carousel/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot })
    });
    setState((await response.json()) as CarouselState);
  }

  useEffect(() => { void refresh(); }, []);
  const rendered = useMemo(
    () => state?.renderedIds.map((id) => state.modules.find((module) => module.id === id)).filter(Boolean) as Module[] ?? [],
    [state]
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Recommendation Carousel</h1>
      <p className="mt-2 text-slate-300">Place the highest-value recommendation modules into the right UI slot.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <label className="block font-semibold text-slate-100">Target slot</label>
          <select value={slot} onChange={(event) => setSlot(event.target.value as Slot)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="hero">Hero</option>
            <option value="sidebar">Sidebar</option>
            <option value="footer">Footer</option>
          </select>
          <button onClick={renderSlot} className="mt-4 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">Render carousel</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-slate-100">Available modules</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {state?.modules.map((module) => (
                  <li key={module.id} className="rounded border border-slate-800 px-3 py-2">
                    {module.title} · {module.slot} · priority {module.priority} · inventory {module.inventory}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Rendered modules</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {rendered.map((module) => (
                  <li key={module.id} className="rounded border border-slate-800 px-3 py-2">{module.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

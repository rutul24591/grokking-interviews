"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Section = { id: string; title: string; status: string };
type RefState = { sections: Section[]; notes: string[] };

export default function RefWorkspace() {
  const [state, setState] = useState<RefState | null>(null);
  const [selected, setSelected] = useState<string>("");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  async function refresh() {
    const response = await fetch("http://localhost:4531/state");
    const result = (await response.json()) as RefState;
    setState(result);
    setSelected((current) => current || result.sections[0]?.id || "");
  }

  useEffect(() => {
    void refresh();
  }, []);

  const activeIds = useMemo(() => new Set((state?.sections ?? []).map((section) => section.id)), [state]);
  useEffect(() => {
    for (const id of Object.keys(refs.current)) {
      if (!activeIds.has(id)) delete refs.current[id];
    }
  }, [activeIds]);

  async function run(actionId: string) {
    await fetch("http://localhost:4531/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, sectionId: selected })
    });
    await refresh();
    if (actionId === "focus" && selected) refs.current[selected]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Ref actions</h2>
        <select className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={selected} onChange={(event) => setSelected(event.target.value)}>
          {(state?.sections ?? []).map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
        </select>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("focus")}>Focus section</button>
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => void run("reorder")}>Reorder sections</button>
          <button className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-800" onClick={() => void run("remove")}>Remove selected</button>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
      </article>
      <article className="space-y-4">
        {(state?.sections ?? []).map((section) => (
          <div key={section.id} ref={(node) => { refs.current[section.id] = node; }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">{section.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{section.status}</p>
          </div>
        ))}
      </article>
    </section>
  );
}

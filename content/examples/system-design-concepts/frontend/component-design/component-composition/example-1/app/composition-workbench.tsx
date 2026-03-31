"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type LayoutData = { hero: string; body: string[]; rail: string[]; notes: string[] };

function Shell({ hero, body, rail }: { hero: ReactNode; body: ReactNode; rail: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {hero}
        <div className="mt-6 space-y-4">{body}</div>
      </section>
      <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">{rail}</aside>
    </div>
  );
}

export default function CompositionWorkbench() {
  const [data, setData] = useState<LayoutData | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await fetch("http://localhost:4522/layout");
      setData((await response.json()) as LayoutData);
    })();
  }, []);

  return (
    <section className="mt-8">
      <Shell
        hero={<><p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Hero Slot</p><h2 className="mt-3 text-3xl font-semibold text-slate-950">{data?.hero}</h2></>}
        body={<>{data?.body.map((block) => <p key={block} className="text-sm leading-7 text-slate-700">{block}</p>)}</>}
        rail={<><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Rail Slot</p><ul className="mt-4 space-y-3 text-sm text-slate-700">{data?.rail.map((item) => <li key={item} className="rounded-2xl bg-white px-4 py-3">{item}</li>)}</ul><ul className="mt-4 space-y-2 text-sm text-slate-700">{data?.notes.map((note) => <li key={note}>• {note}</li>)}</ul></>}
      />
    </section>
  );
}

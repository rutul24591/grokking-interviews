"use client";
import { useEffect, useState } from "react";
export function SkeletonClient() {
  const [ready, setReady] = useState(false);
  const [layout, setLayout] = useState<"cards" | "detail">("cards");
  useEffect(() => { const t = setTimeout(() => setReady(true), 1200); return () => clearTimeout(t); }, []);
  const items = layout === "cards" ? [1,2,3] : [1];
  return <main className="mx-auto min-h-screen max-w-5xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Skeleton screens</p><h1 className="mt-2 text-3xl font-semibold">Layout-matched placeholders</h1></div><select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={layout} onChange={(event) => setLayout(event.target.value as "cards" | "detail")}><option value="cards">Card feed</option><option value="detail">Article detail</option></select></div><div className="mt-6 space-y-3">{ready?items.map((n)=><article key={n} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">Loaded {layout === "cards" ? `card ${n}` : "article detail"}</article>):items.map((n)=><div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><div className={`h-5 rounded bg-slate-700 ${layout === "cards" ? "w-1/3" : "w-2/3"}`} /><div className="mt-3 h-4 w-full rounded bg-slate-800" /><div className="mt-2 h-4 w-5/6 rounded bg-slate-800" /></div>)}</div><div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">Skeletons should preserve final geometry so the loaded content does not jump.</div></section></main>;
}

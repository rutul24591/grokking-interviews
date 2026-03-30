"use client";
import { useMemo, useState } from "react";
const items = [{ id: '1', title: 'Caching patterns', tag: 'frontend' }, { id: '2', title: 'Rate limiting', tag: 'backend' }];
export function EmptyStateClient() {
  const [tag, setTag] = useState('all');
  const [showSeeded, setShowSeeded] = useState(true);
  const visible = useMemo(() => (showSeeded ? items : []).filter((item) => tag === 'all' || item.tag === tag), [tag, showSeeded]);
  const state = !showSeeded ? 'first-use' : visible.length === 0 ? 'filtered-empty' : 'has-results';
  return <main className="mx-auto min-h-screen max-w-4xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Empty states</p><h1 className="mt-2 text-3xl font-semibold">Learning list</h1><div className="mt-6 flex gap-3"><button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={()=>setShowSeeded((v)=>!v)}>{showSeeded?'Simulate new user':'Restore data'}</button><select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={tag} onChange={(e)=>setTag(e.target.value)}><option value="all">All</option><option value="frontend">Frontend</option><option value="backend">Backend</option></select></div>{state==='has-results'?<div className="mt-6 space-y-3">{visible.map((item)=><article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">{item.title}</article>)}</div>:<div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">{state==='first-use'?'No saved articles yet. Start with recommended fundamentals.':'No articles match this filter. Broaden the tag or clear filters.'}</div>}</section></main>;
}

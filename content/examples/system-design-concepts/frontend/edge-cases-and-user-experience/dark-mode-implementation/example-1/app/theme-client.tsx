"use client";
import { useEffect, useState } from "react";
const key = 'ux-theme-preference';
export function ThemeClient() {
  const [mode, setMode] = useState<'system'|'light'|'dark'>('system');
  const [resolved, setResolved] = useState('dark');
  useEffect(() => {
    const saved = window.localStorage.getItem(key) as 'system'|'light'|'dark'|null;
    if (saved) setMode(saved);
  }, []);
  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
    setResolved(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(key, mode);
  }, [mode]);
  return <main className="mx-auto min-h-screen max-w-4xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><p className="text-sm uppercase tracking-[0.25em] text-violet-300">Dark mode</p><h1 className="mt-2 text-3xl font-semibold">Theme preference center</h1><div className="mt-6 flex gap-3">{['system','light','dark'].map((value)=><button key={value} className={`rounded-2xl px-4 py-3 ${mode===value?'bg-violet-400 text-slate-950':'border border-slate-700'}`} onClick={()=>setMode(value as 'system'|'light'|'dark')}>{value}</button>)}</div><div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Requested: {mode} · Resolved: {resolved}</div></section></main>;
}

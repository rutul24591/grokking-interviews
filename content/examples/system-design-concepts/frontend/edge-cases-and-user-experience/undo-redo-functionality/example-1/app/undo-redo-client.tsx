"use client";
import { useState } from "react";
export function UndoRedoClient() {
  const [past, setPast] = useState<string[]>([]);
  const [present, setPresent] = useState('Draft 1');
  const [future, setFuture] = useState<string[]>([]);
  function apply(next: string) { setPast((items) => [...items, present]); setPresent(next); setFuture([]); }
  function undo() { if (!past.length) return; const previous = past[past.length - 1]; setPast((items) => items.slice(0, -1)); setFuture((items) => [present, ...items]); setPresent(previous); }
  function redo() { if (!future.length) return; const next = future[0]; setFuture((items) => items.slice(1)); setPast((items) => [...items, present]); setPresent(next); }
  return <main className="mx-auto min-h-screen max-w-4xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><p className="text-sm uppercase tracking-[0.25em] text-amber-300">Undo/redo</p><h1 className="mt-2 text-3xl font-semibold">Reversible editor history</h1><div className="mt-6 flex gap-3"><button className="rounded-2xl bg-amber-400 px-4 py-3 font-medium text-slate-950" onClick={()=>apply(`Draft ${past.length + 2}`)}>Apply change</button><button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={undo}>Undo</button><button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={redo}>Redo</button></div><div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Past: {past.join(' -> ') || 'none'} · Present: {present} · Future: {future.join(' -> ') || 'none'}</div></section></main>;
}

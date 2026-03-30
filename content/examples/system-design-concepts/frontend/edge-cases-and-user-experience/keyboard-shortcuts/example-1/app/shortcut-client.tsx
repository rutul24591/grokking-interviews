"use client";
import { useEffect, useState } from "react";
export function ShortcutClient() {
  const [lastAction, setLastAction] = useState('Press / to search or g h to go home');
  const [scope, setScope] = useState<"global" | "editor">("global");
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (event.key === '/') { event.preventDefault(); setLastAction('Opened command search'); }
      if (event.key.toLowerCase() === 'h' && event.metaKey) { setLastAction('Jumped to home dashboard'); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  return <main className="mx-auto min-h-screen max-w-5xl p-8"><section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Keyboard shortcuts</p><h1 className="mt-2 text-3xl font-semibold">Command palette</h1></div><select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={scope} onChange={(event) => setScope(event.target.value as "global" | "editor")}><option value="global">Global scope</option><option value="editor">Editor scope</option></select></div><input className="mt-6 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" placeholder="Typing here should suppress global shortcuts" /><div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{lastAction}</div><aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><h2 className="text-lg font-medium">Shortcut policy</h2><ul className="mt-3 space-y-2 text-sm text-slate-300"><li>Current scope: {scope}</li><li>Suppress global bindings inside text entry.</li><li>Expose a visible cheatsheet for discoverability.</li></ul></aside></div></section></main>;
}

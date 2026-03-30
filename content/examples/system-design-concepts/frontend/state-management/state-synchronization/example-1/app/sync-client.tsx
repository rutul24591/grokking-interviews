"use client";

import { useEffect, useMemo, useState } from "react";

const storageKey = 'state-sync-theme';

export function SyncClient() {
  const [theme, setTheme] = useState('dark');
  const [events, setEvents] = useState<string[]>(['Listening for cross-tab changes']);
  const [tabId] = useState(() => `tab-${Math.random().toString(36).slice(2, 7)}`);

  useEffect(() => {
    const channel = 'BroadcastChannel' in window ? new BroadcastChannel('state-sync-demo') : null;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || !event.newValue) return;
      setTheme(event.newValue);
      setEvents((entries) => [`storage -> ${event.newValue}`, ...entries].slice(0, 6));
    };
    channel?.addEventListener('message', (event) => {
      setTheme(event.data.theme);
      setEvents((entries) => [`broadcast -> ${event.data.theme}`, ...entries].slice(0, 6));
    });
    window.addEventListener('storage', onStorage);
    return () => {
      channel?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function update(nextTheme: string) {
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('state-sync-demo');
      channel.postMessage({ theme: nextTheme });
      channel.close();
    }
    setEvents((entries) => [`local -> ${nextTheme}`, ...entries].slice(0, 6));
  }

  const summary = useMemo(() => `Current theme: ${theme}`, [theme]);

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">State synchronization</p>
        <h1 className="mt-2 text-3xl font-semibold">Multi-tab theme sync</h1>
        <p className="mt-2 text-sm text-slate-400">Open this page in two tabs. Changing the theme in one tab propagates to the other.</p>
        <div className="mt-6 flex gap-3">
          <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950" onClick={() => update('dark')}>Dark</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => update('light')}>Light</button>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">{summary} · {tabId}</div>
        <ul className="mt-4 space-y-2 text-sm text-slate-400">{events.map((entry) => <li key={entry}>{entry}</li>)}</ul>
      </section>
    </main>
  );
}

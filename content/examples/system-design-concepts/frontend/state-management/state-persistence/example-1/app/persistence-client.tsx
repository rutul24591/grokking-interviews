"use client";

import { useEffect, useMemo, useState } from "react";

const storageKey = 'state-management-preferences-v2';

type Settings = { theme: 'dark' | 'light'; density: 'comfortable' | 'compact'; pinnedTrack: string };
const initialSettings: Settings = { theme: 'dark', density: 'comfortable', pinnedTrack: 'frontend' };

function migrate(raw: string | null): Settings {
  if (!raw) return initialSettings;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version === 1) {
      return { theme: parsed.darkMode ? 'dark' : 'light', density: 'comfortable', pinnedTrack: parsed.track ?? 'frontend' };
    }
    if (parsed.version === 2) return parsed.settings as Settings;
  } catch {
    return initialSettings;
  }
  return initialSettings;
}

export function PersistenceClient() {
  const [settings, setSettings] = useState(initialSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(migrate(window.localStorage.getItem(storageKey)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ version: 2, settings }));
  }, [hydrated, settings]);

  const summary = useMemo(() => `${settings.theme} · ${settings.density} · ${settings.pinnedTrack}`, [settings]);

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">State persistence</p>
        <h1 className="mt-2 text-3xl font-semibold">Preferences workspace</h1>
        <p className="mt-2 text-sm text-slate-400">Refresh the page after changing values. Persisted state survives reloads because hydration reads storage only on the client.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={settings.theme} onChange={(e) => setSettings((state) => ({ ...state, theme: e.target.value as Settings['theme'] }))}><option value="dark">Dark</option><option value="light">Light</option></select>
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={settings.density} onChange={(e) => setSettings((state) => ({ ...state, density: e.target.value as Settings['density'] }))}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select>
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={settings.pinnedTrack} onChange={(e) => setSettings((state) => ({ ...state, pinnedTrack: e.target.value }))}><option value="frontend">Frontend</option><option value="backend">Backend</option></select>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Hydrated: {String(hydrated)} · Snapshot: {summary}</div>
      </section>
    </main>
  );
}

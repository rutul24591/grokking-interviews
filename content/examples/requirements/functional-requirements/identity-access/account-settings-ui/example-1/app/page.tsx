"use client";

import { useEffect, useMemo, useState } from "react";

type Settings = { displayName: string; timezone: string; marketingEmails: boolean; sessionAlerts: boolean; lastSavedAt: string };

export default function Page() {
  const [saved, setSaved] = useState<Settings | null>(null);
  const [form, setForm] = useState<Settings | null>(null);

  async function refresh() {
    const response = await fetch("/api/settings/state");
    const next = (await response.json()) as Settings;
    setSaved(next);
    setForm(next);
  }

  async function save() {
    const response = await fetch("/api/settings/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const next = (await response.json()) as Settings;
    setSaved(next);
    setForm(next);
  }

  useEffect(() => { refresh(); }, []);

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(form), [saved, form]);
  if (!form) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Account Settings Workspace</h1>
      <p className="mt-2 text-slate-300">Edit account profile and security preferences with explicit save behavior.</p>
      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm"><span>Display name</span><input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
          <label className="grid gap-1 text-sm"><span>Timezone</span><input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.marketingEmails} onChange={(e) => setForm({ ...form, marketingEmails: e.target.checked })} /> Marketing emails</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.sessionAlerts} onChange={(e) => setForm({ ...form, sessionAlerts: e.target.checked })} /> Session alerts</label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={save} disabled={!dirty} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500 disabled:opacity-50">Save settings</button>
          <span className="text-sm text-slate-400">Dirty state: <span className="font-semibold text-slate-100">{dirty ? "unsaved changes" : "clean"}</span></span>
        </div>
        <p className="mt-4 text-sm text-slate-400">Last saved: {saved?.lastSavedAt ?? "never"}</p>
      </section>
    </main>
  );
}

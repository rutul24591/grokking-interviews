"use client";

import { useEffect, useMemo, useState } from "react";

type ProfileState = {
  name: string;
  title: string;
  timezone: string;
  visibility: "public" | "team" | "private";
  saveVersion: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ProfileState | null>(null);
  const [draft, setDraft] = useState<ProfileState | null>(null);

  async function refresh() {
    const response = await fetch("/api/profile/state");
    const data = (await response.json()) as ProfileState;
    setState(data);
    setDraft(data);
  }

  async function save() {
    if (!draft) return;
    const response = await fetch("/api/profile/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const data = (await response.json()) as ProfileState;
    setState(data);
    setDraft(data);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const dirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(draft), [draft, state]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Profile Settings UI</h1>
      <p className="mt-2 text-slate-300">Manage user-facing profile fields, visibility controls, and persistence feedback.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm text-slate-300">Name</label>
          <input value={draft?.name ?? ""} onChange={(event) => setDraft((current) => current ? { ...current, name: event.target.value } : current)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Title</label>
          <input value={draft?.title ?? ""} onChange={(event) => setDraft((current) => current ? { ...current, title: event.target.value } : current)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Timezone</label>
          <input value={draft?.timezone ?? ""} onChange={(event) => setDraft((current) => current ? { ...current, timezone: event.target.value } : current)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <label className="mt-4 block text-sm text-slate-300">Visibility</label>
          <select value={draft?.visibility ?? "team"} onChange={(event) => setDraft((current) => current ? { ...current, visibility: event.target.value as ProfileState["visibility"] } : current)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="public">public</option>
            <option value="team">team</option>
            <option value="private">private</option>
          </select>
          <button onClick={save} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Save profile</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Dirty form: <span className="font-semibold text-slate-100">{dirty ? "yes" : "no"}</span></p>
          <p className="mt-2">Saved version: <span className="font-semibold text-slate-100">{state?.saveVersion ?? 0}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}

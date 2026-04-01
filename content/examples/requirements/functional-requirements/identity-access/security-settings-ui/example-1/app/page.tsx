"use client";

import { useEffect, useMemo, useState } from "react";

type SecuritySettings = {
  mfaRequired: boolean;
  loginAlerts: boolean;
  trustedDevicesOnly: boolean;
  sessionTimeoutMinutes: number;
  saveCount: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SecuritySettings | null>(null);
  const [draft, setDraft] = useState<SecuritySettings | null>(null);

  async function refresh() {
    const response = await fetch("/api/security/state");
    const data = (await response.json()) as SecuritySettings;
    setState(data);
    setDraft(data);
  }

  async function save() {
    if (!draft) return;
    const response = await fetch("/api/security/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mfaRequired: draft.mfaRequired,
        loginAlerts: draft.loginAlerts,
        trustedDevicesOnly: draft.trustedDevicesOnly,
        sessionTimeoutMinutes: draft.sessionTimeoutMinutes
      })
    });
    const data = (await response.json()) as SecuritySettings;
    setState(data);
    setDraft(data);
  }

  useEffect(() => { void refresh(); }, []);

  const risky = useMemo(() => !draft?.mfaRequired || (draft?.sessionTimeoutMinutes ?? 0) > 60, [draft]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Security Settings UI</h1>
      <p className="mt-2 text-slate-300">Configure account-protection controls and surface risky combinations before they ship.</p>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <label className="flex items-center gap-2"><input type="checkbox" checked={draft?.mfaRequired ?? false} onChange={(event) => setDraft((current) => current ? { ...current, mfaRequired: event.target.checked } : current)} />Require MFA</label>
          <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={draft?.loginAlerts ?? false} onChange={(event) => setDraft((current) => current ? { ...current, loginAlerts: event.target.checked } : current)} />Send login alerts</label>
          <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={draft?.trustedDevicesOnly ?? false} onChange={(event) => setDraft((current) => current ? { ...current, trustedDevicesOnly: event.target.checked } : current)} />Trust known devices only</label>
          <label className="mt-4 block">Session timeout (minutes)</label>
          <input type="number" value={draft?.sessionTimeoutMinutes ?? 30} onChange={(event) => setDraft((current) => current ? { ...current, sessionTimeoutMinutes: Number(event.target.value) } : current)} className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          <button onClick={save} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Save security settings</button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <p>Risky configuration: <span className="font-semibold text-slate-100">{risky ? "yes" : "no"}</span></p>
          <p className="mt-2">Revision: <span className="font-semibold text-slate-100">{state?.saveCount ?? 0}</span></p>
          <p className="mt-4">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}

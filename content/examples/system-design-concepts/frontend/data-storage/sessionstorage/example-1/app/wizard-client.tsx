"use client";

import { useEffect, useState } from "react";

type WizardState = {
  name: string;
  email: string;
  company: string;
};

const KEY = "sessionstorage-checkout";
const EMPTY: WizardState = { name: "", email: "", company: "" };

export function WizardClient() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(EMPTY);
  const [status, setStatus] = useState("Same-tab draft only");

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw) as WizardState);
    } catch {}
  }, []);

  function persist(next: WizardState) {
    setState(next);
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(next));
      setStatus("Draft persisted in current tab session.");
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/70">This data survives refresh in the same tab, but not a fresh browsing session.</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">step {step}</span>
        <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
        <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white" onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</button>
        <button className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 font-semibold text-white" onClick={() => { window.sessionStorage.removeItem(KEY); setState(EMPTY); setStatus("Cleared session-scoped draft."); }}>Clear</button>
      </div>
      <div className="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-white/80">{status}</div>

      <label className="block text-sm">
        <div className="mb-1 text-white/70">Name</div>
        <input className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2" value={state.name} onChange={(e) => persist({ ...state, name: e.target.value })} />
      </label>
      <label className="block text-sm">
        <div className="mb-1 text-white/70">Email</div>
        <input className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2" value={state.email} onChange={(e) => persist({ ...state, email: e.target.value })} />
      </label>
      <label className="block text-sm">
        <div className="mb-1 text-white/70">Company</div>
        <input className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2" value={state.company} onChange={(e) => persist({ ...state, company: e.target.value })} />
      </label>
    </div>
  );
}

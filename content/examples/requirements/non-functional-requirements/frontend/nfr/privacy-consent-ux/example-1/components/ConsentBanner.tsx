"use client";

import { useEffect, useState } from "react";

type Consent = { version: 1; analytics: boolean; marketing: boolean } | null;

async function getConsent(): Promise<Consent> {
  const res = await fetch("/api/consent", { cache: "no-store" });
  const body = (await res.json()) as { ok: true; consent: Consent };
  return body.consent;
}

async function setConsent(next: { analytics: boolean; marketing: boolean }) {
  const res = await fetch("/api/consent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(next)
  });
  if (!res.ok) throw new Error(`consent update failed: ${res.status}`);
  const body = (await res.json()) as { ok: true; consent: Consent };
  return body.consent;
}

export function ConsentBanner() {
  const [consent, setLocalConsent] = useState<Consent>(null);
  const [open, setOpen] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const c = await getConsent();
      if (!mounted) return;
      setLocalConsent(c);
      if (c) {
        setAnalytics(c.analytics);
        setMarketing(c.marketing);
        setOpen(false);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-slate-950/90 p-4 backdrop-blur">
      <div className="mx-auto max-w-5xl space-y-3">
        <div className="text-sm text-slate-200 font-medium">Privacy & consent</div>
        <p className="text-sm text-slate-300">
          We use optional analytics to improve the product. Your choice should be respected in UI and
          enforced in code.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked disabled />
            Necessary (always on)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            Analytics
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            Marketing
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                const c = await setConsent({ analytics, marketing });
                setLocalConsent(c);
                setOpen(false);
              } finally {
                setBusy(false);
              }
            }}
          >
            Save
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          {consent ? (
            <div className="text-xs text-slate-400 self-center">saved</div>
          ) : (
            <div className="text-xs text-slate-400 self-center">not yet saved</div>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";

export function Controls() {
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  async function post(url: string) {
    setBusy(true);
    setLast(null);
    try {
      const res = await fetch(url, { method: "POST" });
      const txt = await res.text();
      setLast(txt);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => post("/api/publish")}
          className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm text-slate-200 hover:border-slate-500 disabled:opacity-50"
        >
          Publish (origin changes)
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => post("/api/revalidate")}
          className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-slate-50 hover:border-indigo-400 disabled:opacity-50"
        >
          Revalidate tag
        </button>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        After publishing, refresh the page to see whether the cached snapshot updated.
      </div>
      {last ? (
        <pre className="mt-3 overflow-auto rounded-xl bg-slate-950/60 p-3 text-xs text-slate-100">
          {last}
        </pre>
      ) : null}
    </div>
  );
}


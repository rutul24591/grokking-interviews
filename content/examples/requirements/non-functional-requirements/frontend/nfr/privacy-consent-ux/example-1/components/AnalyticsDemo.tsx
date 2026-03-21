"use client";

import { useEffect, useState } from "react";

type Summary = { count: number; latest: unknown };

export function AnalyticsDemo() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      if (!res.ok) throw new Error(`analytics blocked (${res.status})`);
      const body = (await res.json()) as { ok: true } & Summary;
      setSummary({ count: body.count, latest: body.latest });
    } catch (e) {
      setSummary(null);
      setError(String(e));
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
      <h2 className="font-medium">Analytics endpoint (gated by consent)</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
          onClick={async () => {
            setError(null);
            try {
              const res = await fetch("/api/analytics", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: "cta_click", props: { page: "privacy-demo" } })
              });
              if (!res.ok) throw new Error(`blocked (${res.status})`);
              await refresh();
            } catch (e) {
              setError(String(e));
            }
          }}
        >
          Send event
        </button>
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={() => void refresh()}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">
        {JSON.stringify(summary, null, 2)}
      </pre>
    </section>
  );
}


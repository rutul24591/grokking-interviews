"use client";

import { useEffect, useState } from "react";

export function CsrPanel() {
  const [data, setData] = useState<{ now: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await fetch("/api/now", { cache: "no-store" });
        const body = (await res.json()) as { now: number };
        if (mounted) setData(body);
      } catch (e) {
        if (mounted) setError(String(e));
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/30 p-4 text-sm">
      <div className="font-medium">CSR panel</div>
      {error ? <div className="mt-2 text-rose-200">{error}</div> : null}
      <pre className="mt-2 rounded bg-slate-900/40 p-3 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="mt-2 text-xs text-slate-400">Client fetch happens after initial HTML is loaded.</p>
    </div>
  );
}


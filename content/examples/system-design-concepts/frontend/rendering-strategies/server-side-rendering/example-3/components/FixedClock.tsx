"use client";

import { useEffect, useState } from "react";

export function FixedClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date().toISOString());
    const id = setInterval(() => setNow(new Date().toISOString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Fixed
      </div>
      <div className="mt-2 font-mono text-sm text-slate-100" suppressHydrationWarning>
        {now ?? "—"}
      </div>
      <div className="mt-2 text-xs text-slate-500">
        Render stable HTML during SSR; update after hydration (and optionally suppress the placeholder mismatch).
      </div>
    </div>
  );
}


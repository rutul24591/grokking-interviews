"use client";

import { useEffect, useState } from "react";

type Nav = PerformanceNavigationTiming;

function readNav(): Nav | null {
  const entry = performance.getEntriesByType("navigation")[0] as Nav | undefined;
  return entry || null;
}

export function PerfPanel() {
  const [nav, setNav] = useState<Nav | null>(null);
  useEffect(() => {
    const n = readNav();
    setNav(n);
  }, []);

  if (!nav) return null;

  const ttfb = nav.responseStart;
  const dcl = nav.domContentLoadedEventEnd;
  const load = nav.loadEventEnd;

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
      <h2 className="font-medium text-slate-200">Client timing snapshot</h2>
      <div className="mt-2 grid gap-3 md:grid-cols-3">
        <Metric label="TTFB" value={`${Math.round(ttfb)}ms`} />
        <Metric label="DCL" value={`${Math.round(dcl)}ms`} />
        <Metric label="Load" value={`${Math.round(load)}ms`} />
      </div>
      <p className="mt-3 text-xs text-slate-400">
        These are browser navigation timings. Use RUM (and percentiles) to make this an NFR contract.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-950/40 p-3">
      <div className="text-slate-400">{label}</div>
      <div className="text-xl font-semibold text-slate-200">{value}</div>
    </div>
  );
}


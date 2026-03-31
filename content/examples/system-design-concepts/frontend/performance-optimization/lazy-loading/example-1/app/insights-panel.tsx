"use client";

import { useEffect, useState } from "react";

type Insight = { label: string; value: string };

export default function InsightsPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4170";
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    fetch(`${origin}/insights`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setInsights(payload as Insight[]));
  }, [origin]);

  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
      <h3 className="text-lg font-semibold">Insights chunk</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.label} className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{insight.label}</div>
            <div className="mt-3 text-2xl font-semibold">{insight.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Recommendation = {
  id: string;
  title: string;
  reason: string;
};

export default function RecommendationsPanel() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4100";

    fetch(`${origin}/recommendations`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return (await response.json()) as Recommendation[];
      })
      .then((payload) => {
        setItems(payload);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <aside className="rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_70px_rgba(93,54,12,0.08)]">
      <div className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
        Deferred Recommendations
      </div>

      {status === "loading" ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-2xl border border-slate-200 bg-white/80 p-4"
            >
              <div className="h-4 w-2/3 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
              <div className="mt-2 h-3 w-4/5 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
          Recommendations could not be loaded. The hero shell still renders without blocking.
        </div>
      ) : null}

      {status === "ready" ? (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="text-sm font-semibold text-slate-900">{item.title}</div>
              <div className="mt-1 text-xs leading-6 text-slate-600">{item.reason}</div>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: string;
  title: string;
  category: string;
  score: number;
};

const ItemRow = memo(function ItemRow({ item }: { item: Item }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{item.title}</div>
          <div className="mt-1 text-xs text-slate-500">{item.category}</div>
        </div>
        <div className="text-right text-sm text-slate-600">
          <div>Score {item.score}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Render #{renderCount.current}
          </div>
        </div>
      </div>
    </article>
  );
});

export default function FilterableBoard() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4180";
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("all");
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    fetch(`${origin}/items`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setItems(payload as Item[]));
  }, [origin]);

  const filtered = useMemo(() => {
    return items.filter((item) => category === "all" || item.category === category);
  }, [category, items]);

  const metrics = useMemo(() => {
    return {
      visibleItems: filtered.length,
      totalScore: filtered.reduce((sum, item) => sum + item.score, 0),
    };
  }, [filtered]);

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="rounded-[1.8rem] border border-white/70 bg-slate-950 p-7 text-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <h2 className="text-lg font-semibold">Memoization boundaries</h2>
        <div className="mt-5 space-y-4 text-sm">
          <button
            type="button"
            onClick={() => setRenderTick((value) => value + 1)}
            className="rounded-full bg-white px-4 py-3 text-slate-900"
          >
            Force parent-only render
          </button>
          <div className="text-slate-300">Parent render tick: {renderTick}</div>
          <div className="text-slate-300">Visible items: {metrics.visibleItems}</div>
          <div className="text-slate-300">Derived score: {metrics.totalScore}</div>
        </div>
      </aside>

      <div className="rounded-[1.8rem] border border-white/70 bg-white/80 p-7 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
        <div className="flex flex-wrap gap-3">
          {["all", "rendering", "networking", "storage"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full px-4 py-2 text-sm ${
                category === value ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-700"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

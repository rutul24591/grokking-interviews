"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const CommentsPanel = dynamic(() => import("./comments-panel"), {
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading comments chunk…</div>,
});

const InsightsPanel = dynamic(() => import("./insights-panel"), {
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading insights chunk…</div>,
});

export default function LazyWidgets() {
  const [showComments, setShowComments] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-[1.8rem] border border-white/70 bg-slate-950 p-7 text-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <h2 className="text-lg font-semibold">Why these widgets are lazy</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          <li>Comments are optional for most readers and should not delay first paint.</li>
          <li>Analytics-heavy insights are opened by a minority of users.</li>
          <li>Each widget becomes its own chunk and downloads only on demand.</li>
        </ul>
      </aside>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowComments((value) => !value)}
            className="rounded-full bg-slate-950 px-4 py-3 text-sm text-white"
          >
            {showComments ? "Hide comments" : "Open comments"}
          </button>
          <button
            type="button"
            onClick={() => setShowInsights((value) => !value)}
            className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800"
          >
            {showInsights ? "Hide insights" : "Open insights"}
          </button>
        </div>

        {showComments ? <CommentsPanel /> : null}
        {showInsights ? <InsightsPanel /> : null}
      </div>
    </section>
  );
}

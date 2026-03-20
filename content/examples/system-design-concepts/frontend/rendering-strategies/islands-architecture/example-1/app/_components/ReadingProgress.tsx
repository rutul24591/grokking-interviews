"use client";

import { useEffect, useMemo, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [atTop, setAtTop] = useState(true);

  const label = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const value = Math.min(1, Math.max(0, doc.scrollTop / max));
      setProgress(value);
      setAtTop(doc.scrollTop < 4);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
          Reading
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800/60">
          <div
            className="h-full rounded-full bg-indigo-500 transition-[width]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="text-xs font-mono text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-500">
          {atTop ? "scroll to see progress" : "island hydrated"}
        </div>
      </div>
    </div>
  );
}


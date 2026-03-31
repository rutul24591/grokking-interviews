"use client";
import { useMemo, useState } from "react";
const rowHeight = 52;
const total = 5000;
export default function VirtualList() {
  const [scrollTop, setScrollTop] = useState(0);
  const viewportHeight = 520;
  const overscan = 5;
  const rows = useMemo(() => Array.from({ length: total }, (_, index) => ({ id: index + 1, title: `Article ${index + 1}` })), []);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(rows.length, startIndex + visibleCount);
  const visibleRows = rows.slice(startIndex, endIndex);
  return (
    <section className="mt-10 rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
      <div onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)} className="h-[520px] overflow-auto rounded-2xl border border-slate-200 bg-white">
        <div style={{ height: rows.length * rowHeight, position: "relative" }}>
          {visibleRows.map((row, offset) => {
            const index = startIndex + offset;
            return (
              <div key={row.id} style={{ position: "absolute", top: index * rowHeight, left: 0, right: 0, height: rowHeight }} className="border-b border-slate-100 px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">{row.title}</div>
                <div className="text-xs text-slate-500">Row {row.id}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

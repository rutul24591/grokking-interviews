"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  count: number;
  rowHeight: number;
  height: number;
  overscan: number;
  renderRow: (idx: number) => React.ReactNode;
  onRangeChange?: (range: { start: number; end: number }) => void;
};

export function VirtualList({ count, rowHeight, height, overscan, renderRow, onRangeChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const { start, end, offset } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visible = Math.ceil(height / rowHeight) + overscan * 2;
    const end = Math.min(count, start + visible);
    const offset = start * rowHeight;
    return { start, end, offset };
  }, [scrollTop, rowHeight, height, overscan, count]);

  const items = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let i = start; i < end; i++) out.push(<div key={i}>{renderRow(i)}</div>);
    return out;
  }, [start, end, renderRow]);

  useEffect(() => {
    onRangeChange?.({ start, end });
  }, [start, end, onRangeChange]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-auto"
      style={{ height }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      <div style={{ height: count * rowHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offset}px)` }}>{items}</div>
      </div>
    </div>
  );
}

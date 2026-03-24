import { useEffect, useMemo, useRef, useState } from "react";

type Item = { id: string; label: string };

function clampIndex(next: number, len: number) {
  if (next < 0) return len - 1;
  if (next >= len) return 0;
  return next;
}

export function Toolbar({
  label,
  items,
  activeId,
  onActivate
}: {
  label: string;
  items: Item[];
  activeId: string;
  onActivate: (id: string) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const initialIndex = useMemo(() => Math.max(0, items.findIndex((i) => i.id === activeId)), [activeId, items]);
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  useEffect(() => setFocusedIndex(initialIndex), [initialIndex]);

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">{label}</h2>
      <div
        role="toolbar"
        aria-label={label}
        className="mt-4 flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/30 p-2"
      >
        {items.map((it, idx) => {
          const isActive = it.id === activeId;
          const isTabStop = idx === focusedIndex;
          return (
            <button
              key={it.id}
              ref={(el) => {
                refs.current[idx] = el;
              }}
              type="button"
              tabIndex={isTabStop ? 0 : -1}
              aria-pressed={isActive}
              onClick={() => onActivate(it.id)}
              onFocus={() => setFocusedIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  const next = clampIndex(idx + 1, items.length);
                  setFocusedIndex(next);
                  refs.current[next]?.focus();
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  const next = clampIndex(idx - 1, items.length);
                  setFocusedIndex(next);
                  refs.current[next]?.focus();
                } else if (e.key === "Home") {
                  e.preventDefault();
                  setFocusedIndex(0);
                  refs.current[0]?.focus();
                } else if (e.key === "End") {
                  e.preventDefault();
                  const last = items.length - 1;
                  setFocusedIndex(last);
                  refs.current[last]?.focus();
                } else if (e.key === "Enter" || e.key === " ") {
                  onActivate(it.id);
                }
              }}
              className={[
                "rounded-md px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-400/40",
                isActive ? "bg-indigo-500/30 text-slate-100" : "bg-white/5 text-slate-300 hover:bg-white/10"
              ].join(" ")}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-slate-300">
        Active: <span className="font-semibold text-slate-100">{activeId}</span>
      </p>
    </section>
  );
}


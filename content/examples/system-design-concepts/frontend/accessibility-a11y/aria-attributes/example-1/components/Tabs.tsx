import { useId, useMemo, useRef, useState } from "react";

type TabModel = { id: string; title: string; content: string };

function clampIndex(next: number, len: number) {
  if (next < 0) return len - 1;
  if (next >= len) return 0;
  return next;
}

export function Tabs({ label, tabs }: { label: string; tabs: TabModel[] }) {
  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const ids = useMemo(
    () =>
      tabs.map((t) => ({
        tabId: `${baseId}-tab-${t.id}`,
        panelId: `${baseId}-panel-${t.id}`
      })),
    [baseId, tabs]
  );

  return (
    <section aria-label={label} className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold">{label}</h2>

      <div
        role="tablist"
        aria-label={label}
        className="mt-4 flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/30 p-2"
      >
        {tabs.map((t, idx) => {
          const isSelected = idx === selected;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              id={ids[idx]!.tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={ids[idx]!.panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(idx)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  const next = clampIndex(selected + 1, tabs.length);
                  setSelected(next);
                  tabRefs.current[next]?.focus();
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  const next = clampIndex(selected - 1, tabs.length);
                  setSelected(next);
                  tabRefs.current[next]?.focus();
                } else if (e.key === "Home") {
                  e.preventDefault();
                  setSelected(0);
                  tabRefs.current[0]?.focus();
                } else if (e.key === "End") {
                  e.preventDefault();
                  const last = tabs.length - 1;
                  setSelected(last);
                  tabRefs.current[last]?.focus();
                }
              }}
              className={[
                "rounded-md px-3 py-2 text-sm font-semibold",
                isSelected ? "bg-indigo-500/30 text-slate-100" : "bg-white/5 text-slate-300 hover:bg-white/10"
              ].join(" ")}
            >
              {t.title}
            </button>
          );
        })}
      </div>

      {tabs.map((t, idx) => {
        const isSelected = idx === selected;
        return (
          <div
            key={t.id}
            id={ids[idx]!.panelId}
            role="tabpanel"
            aria-labelledby={ids[idx]!.tabId}
            hidden={!isSelected}
            className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4 text-slate-200"
          >
            <p>{t.content}</p>
          </div>
        );
      })}
    </section>
  );
}


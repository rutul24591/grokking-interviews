"use client";

import { useMemo, useState } from "react";
import { contrastRatio, wcag } from "@/lib/contrast";

const PALETTE = [
  { name: "Ink", hex: "#070a13" },
  { name: "Slate", hex: "#0f172a" },
  { name: "Panel", hex: "#111827" },
  { name: "White", hex: "#ffffff" },
  { name: "Soft white", hex: "#e6e9f2" },
  { name: "Muted", hex: "#a7b0c3" },
  { name: "Indigo", hex: "#a5b4fc" },
  { name: "Rose", hex: "#fda4af" }
];

export default function Page() {
  const [fg, setFg] = useState("#e6e9f2");
  const [bg, setBg] = useState("#070a13");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const normal = wcag(ratio, "normal");
  const large = wcag(ratio, "large");

  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Color contrast (WCAG)</h1>
        <p className="mt-2 text-slate-300">
          Contrast is a design-system concern. Compute it for tokens and prevent regressions.
        </p>
      </header>

      <section className="grid gap-6 rounded-xl border border-white/10 bg-[var(--panel)] p-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-xl font-semibold">Preview</h2>
          <div
            className="mt-4 rounded-xl border border-white/10 p-6"
            style={{ background: bg, color: fg }}
          >
            <p className="text-sm" style={{ opacity: 0.85 }}>
              Foreground: <code>{fg}</code> · Background: <code>{bg}</code>
            </p>
            <p className="mt-4 text-base">
              Normal text should be readable. Contrast ratio: <span className="font-semibold">{ratio.toFixed(2)}:1</span>
            </p>
            <p className="mt-2 text-xl font-semibold">Large text example</p>
            <p className="mt-4 text-sm" style={{ opacity: 0.9 }}>
              Tip: do not rely on opacity to “soften” text; it can destroy contrast unpredictably.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-base font-semibold">Result</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p>
                Ratio: <span className="font-semibold text-slate-100">{ratio.toFixed(2)}:1</span>
              </p>
              <p>
                Normal text:{" "}
                <span className={normal.pass ? "text-emerald-200" : "text-rose-300"}>
                  {normal.pass ? "PASS" : "FAIL"} (AA ≥ 4.5:1)
                </span>
              </p>
              <p>
                Large text:{" "}
                <span className={large.pass ? "text-emerald-200" : "text-rose-300"}>
                  {large.pass ? "PASS" : "FAIL"} (AA ≥ 3.0:1)
                </span>
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-base font-semibold">Pick colors</h2>
            <div className="mt-3 grid gap-3">
              <label className="text-sm text-slate-300">
                Foreground
                <select
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                >
                  {PALETTE.map((c) => (
                    <option key={c.hex} value={c.hex}>
                      {c.name} ({c.hex})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Background
                <select
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                >
                  {PALETTE.map((c) => (
                    <option key={c.hex} value={c.hex}>
                      {c.name} ({c.hex})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </aside>
      </section>

      <section className="rounded-xl border border-white/10 bg-[var(--panel)] p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Platform note</h2>
        <p className="mt-2">
          Store colors as tokens (CSS vars) and enforce contrast at the token layer. Fixing per-component is not
          scalable.
        </p>
      </section>
    </main>
  );
}


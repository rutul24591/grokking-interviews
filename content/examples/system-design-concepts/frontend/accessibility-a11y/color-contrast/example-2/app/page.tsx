"use client";

import { useMemo, useState } from "react";
import { chooseReadableText, contrastRatio } from "@/lib/contrast";

export default function Page() {
  const [bg, setBg] = useState("#a5b4fc");
  const fg = useMemo(() => chooseReadableText(bg), [bg]);
  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Auto-pick readable text color</h1>
        <p className="mt-2 text-slate-300">
          Component APIs can accept arbitrary background colors; pick black/white text to maximize readability.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <label className="text-sm font-semibold text-slate-100" htmlFor="bg">
          Background hex
        </label>
        <input
          id="bg"
          value={bg}
          onChange={(e) => setBg(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
          placeholder="#a5b4fc"
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-slate-300">Computed:</p>
            <p className="mt-2 text-sm text-slate-300">
              Foreground: <code>{fg}</code> · Ratio: <span className="font-semibold text-slate-100">{ratio.toFixed(2)}:1</span>
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-sm text-slate-300">Preview:</p>
            <button
              type="button"
              className="mt-3 rounded-md px-4 py-2 text-sm font-semibold"
              style={{ background: bg, color: fg }}
            >
              Button
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


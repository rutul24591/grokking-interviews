"use client";

import { useEffect, useState } from "react";

type BundlePreview = {
  name: string;
  sourceMapMode: string;
  originalSource: string;
  minifiedSource: string;
  originalBytes: number;
  minifiedBytes: number;
  gzipBytes: number;
};

const bundleOptions = ["app.js", "vendors.js", "styles.css"] as const;

export default function BuildLab() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4190";
  const [selected, setSelected] = useState<(typeof bundleOptions)[number]>("app.js");
  const [preview, setPreview] = useState<BundlePreview | null>(null);

  useEffect(() => {
    fetch(`${origin}/bundle-preview?name=${encodeURIComponent(selected)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setPreview(payload as BundlePreview));
  }, [origin, selected]);

  return (
    <section className="mt-10 rounded-[1.8rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
      <div className="flex flex-wrap gap-3">
        {bundleOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`rounded-full px-4 py-2 text-sm ${
              option === selected ? "bg-slate-950 text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {preview ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Original</div>
            <pre className="mt-3 overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
              <code>{preview.originalSource}</code>
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Minified</div>
              <div className="text-xs text-slate-500">{preview.sourceMapMode}</div>
            </div>
            <pre className="mt-3 overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
              <code>{preview.minifiedSource}</code>
            </pre>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Original</div>
                <div className="mt-2 font-semibold">{preview.originalBytes} bytes</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Minified</div>
                <div className="mt-2 font-semibold">{preview.minifiedBytes} bytes</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Gzip</div>
                <div className="mt-2 font-semibold">{preview.gzipBytes} bytes</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

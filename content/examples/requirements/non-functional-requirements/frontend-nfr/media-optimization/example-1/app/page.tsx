"use client";

import { useEffect, useMemo, useState } from "react";

function dpr() {
  if (typeof window === "undefined") return 1;
  return Math.min(3, Math.max(1, window.devicePixelRatio || 1));
}

export default function Page() {
  const [containerW, setContainerW] = useState(768);
  const pixelRatio = useMemo(() => dpr(), []);

  useEffect(() => {
    const onResize = () => {
      const w = Math.min(1024, Math.max(320, window.innerWidth - 72));
      setContainerW(w);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const url = `/api/media/hero?w=${containerW}&dpr=${pixelRatio}`;

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Media Optimization — variant picking + caching</h1>
        <p className="text-sm text-slate-300">
          Demonstrates three levers that matter in production:{" "}
          <strong>responsive variants</strong>, <strong>client DPR</strong>, and{" "}
          <strong>immutable caching with ETag</strong>.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="text-sm text-slate-300">
          Container width: <span className="font-mono">{containerW}px</span> • DPR:{" "}
          <span className="font-mono">{pixelRatio}x</span>
        </div>
        <img
          src={url}
          width={containerW}
          height={Math.round(containerW * 0.6)}
          loading="lazy"
          decoding="async"
          className="rounded-xl border border-slate-700 bg-slate-950/40"
          alt="Optimized hero variant"
        />
        <div className="text-xs text-slate-400 break-all">
          Served by <code className="rounded bg-slate-800 px-1">/api/media/hero</code>: {url}
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production checklist</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            Generate width buckets (320/480/768/1024/1200) and include DPR for crispness without waste.
          </li>
          <li>
            Use CDN cacheability: <code className="rounded bg-slate-800 px-1">immutable</code> + stable
            asset keys (content hash).
          </li>
          <li>
            Prefer modern formats (AVIF/WebP) and only fall back when needed; keep a strict image budget.
          </li>
        </ul>
      </section>
    </main>
  );
}


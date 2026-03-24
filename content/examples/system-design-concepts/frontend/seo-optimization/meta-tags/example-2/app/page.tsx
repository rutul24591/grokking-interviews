"use client";

import { useMemo, useState } from "react";
import { descriptionTemplate, titleTemplate } from "@/lib/seoText";

export default function Page() {
  const [brand, setBrand] = useState("Interview Prep Studio");
  const [page, setPage] = useState("Meta Tags for Staff Engineers");
  const [summary, setSummary] = useState(
    "Deep dive into title/description strategy, Open Graph, Twitter Cards, and dynamic metadata generation for modern App Router apps."
  );

  const title = useMemo(() => titleTemplate({ page, brand }), [page, brand]);
  const desc = useMemo(() => descriptionTemplate({ summary, brandHint: `Learn with ${brand}.` }), [summary, brand]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">SEO text templates</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
        <label className="text-sm block">
          <span className="opacity-80">Brand</span>
          <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label className="text-sm block">
          <span className="opacity-80">Page title seed</span>
          <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={page} onChange={(e) => setPage(e.target.value)} />
        </label>
        <label className="text-sm block">
          <span className="opacity-80">Description seed</span>
          <textarea className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2 h-28" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
        <div className="opacity-80">Computed title (≈60 chars)</div>
        <div className="mt-1 break-words"><code>{title}</code></div>
        <div className="mt-4 opacity-80">Computed description (≈160 chars)</div>
        <div className="mt-1 break-words"><code>{desc}</code></div>
      </section>
    </main>
  );
}


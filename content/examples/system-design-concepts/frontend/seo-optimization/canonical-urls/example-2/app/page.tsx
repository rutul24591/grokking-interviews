"use client";

import { useMemo, useState } from "react";
import { canonicalForFacets, robotsForFacets } from "@/lib/facets";

export default function Page() {
  const [color, setColor] = useState("red");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("relevance");

  const canonical = useMemo(() => canonicalForFacets({ color: color || undefined, size: size || undefined, sort: sort || undefined }), [
    color,
    size,
    sort
  ]);
  const robots = useMemo(() => robotsForFacets({ color: color || undefined, size: size || undefined, sort: sort || undefined }), [
    color,
    size,
    sort
  ]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Facets → canonical + robots</h1>
      <section className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
        <label className="text-sm block">
          <span className="opacity-80">Color</span>
          <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label className="text-sm block">
          <span className="opacity-80">Size (introduces permutations)</span>
          <input className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={size} onChange={(e) => setSize(e.target.value)} />
        </label>
        <label className="text-sm block">
          <span className="opacity-80">Sort</span>
          <select className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">relevance</option>
            <option value="price">price</option>
            <option value="newest">newest</option>
          </select>
        </label>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm space-y-2">
        <div>
          Canonical: <code>{canonical}</code>
        </div>
        <div>
          Robots: <code>{robots}</code>
        </div>
      </section>
    </main>
  );
}


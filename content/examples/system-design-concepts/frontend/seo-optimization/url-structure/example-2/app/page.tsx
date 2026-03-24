"use client";

import { useMemo, useState } from "react";
import { slugify, uniqueSlug } from "@/lib/slug";

export default function Page() {
  const [titles, setTitles] = useState("Edge Cache\nEdge Cache\nAPI\nAdmin\nEdge Cache");

  const slugs = useMemo(() => {
    const existing = new Set<string>();
    return titles
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => uniqueSlug(slugify(t), existing));
  }, [titles]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Slug generation</h1>
      <textarea className="w-full h-40 rounded border border-white/10 bg-black/30 p-3 text-sm" value={titles} onChange={(e) => setTitles(e.target.value)} />
      <pre className="overflow-auto rounded border border-white/10 bg-black/30 p-3 text-xs">
        <code>{JSON.stringify(slugs, null, 2)}</code>
      </pre>
    </main>
  );
}


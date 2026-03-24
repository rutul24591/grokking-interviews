"use client";

import { useCallback, useState } from "react";

type Item = { id: string; title: string };

export default function LoadMore(props: { initialPage: number; pageSize: number; totalPages: number }) {
  const [page, setPage] = useState(props.initialPage);
  const [loaded, setLoaded] = useState<Item[]>([]);

  const canLoad = page < props.totalPages;

  const load = useCallback(async () => {
    const next = page + 1;
    const res = await fetch(`/api/posts?page=${next}&pageSize=${props.pageSize}`, { cache: "no-store" });
    const j = (await res.json()) as { items: Item[] };
    setLoaded((prev) => [...prev, ...j.items]);
    setPage(next);
  }, [page, props.pageSize]);

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h2 className="text-sm font-semibold">Infinite scroll (progressive)</h2>
      <p className="mt-2 text-sm opacity-80">
        Bots and users without JS can still navigate via pagination links; JS users can load more items.
      </p>
      <button
        className="mt-3 rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black disabled:opacity-50"
        onClick={load}
        disabled={!canLoad}
      >
        Load more
      </button>
      <ul className="mt-4 space-y-2 text-sm">
        {loaded.map((it) => (
          <li key={it.id} className="rounded border border-white/10 bg-black/30 p-3">
            {it.title}
          </li>
        ))}
      </ul>
    </section>
  );
}


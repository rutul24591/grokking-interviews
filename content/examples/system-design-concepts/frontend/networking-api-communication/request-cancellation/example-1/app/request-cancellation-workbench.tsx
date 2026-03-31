"use client";

import { useEffect, useRef, useState } from "react";

type SearchResult = {
  query: string;
  tookMs: number;
  results: string[];
};

export default function CancellationWorkbench() {
  const [query, setQuery] = useState("cache");
  const [data, setData] = useState<SearchResult | null>(null);
  const [timeline, setTimeline] = useState<string[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;
    setTimeline((current) => [`start ${query}`, ...current].slice(0, 8));

    fetch(`http://localhost:4390/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as SearchResult;
        setData(payload);
        setTimeline((current) => [`apply ${payload.query}`, ...current].slice(0, 8));
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") {
          setTimeline((current) => [`abort ${query}`, ...current].slice(0, 8));
        }
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">Search topic</label>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          placeholder="Type quickly: cache, caching, cached..."
        />
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Latest applied response</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{data?.query || "Waiting..."}</p>
          <p className="mt-1 text-sm text-slate-600">{data ? `${data.tookMs} ms origin time` : "Start typing to issue requests."}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {data?.results.map((result) => <li key={result}>{result}</li>)}
          </ul>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Request timeline</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {timeline.map((item) => (
            <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

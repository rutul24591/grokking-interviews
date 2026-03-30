"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const articles = [
  { id: "a1", title: "Caching tiers", difficulty: "advanced", track: "backend" },
  { id: "a2", title: "Local storage trade-offs", difficulty: "intermediate", track: "frontend" },
  { id: "a3", title: "Idempotency keys", difficulty: "advanced", track: "backend" },
  { id: "a4", title: "Rendering waterfalls", difficulty: "beginner", track: "frontend" }
];

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const track = searchParams.get("track") ?? "all";
  const difficulty = searchParams.get("difficulty") ?? "all";

  const visible = useMemo(() => articles.filter((article) => {
    if (track !== 'all' && article.track !== track) return false;
    if (difficulty !== 'all' && article.difficulty !== difficulty) return false;
    if (query && !article.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [difficulty, query, track]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === 'all') next.delete(key); else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">URL state</p>
        <h1 className="mt-2 text-3xl font-semibold">Article explorer</h1>
        <p className="mt-2 text-sm text-slate-400">Copy the URL, open it in a new tab, and the same view reconstructs from query params.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <input className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" placeholder="Search titles" value={query} onChange={(e) => updateParam('q', e.target.value)} />
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={track} onChange={(e) => updateParam('track', e.target.value)}>
            <option value="all">All tracks</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
          </select>
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={difficulty} onChange={(e) => updateParam('difficulty', e.target.value)}>
            <option value="all">All difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="mt-6 space-y-3">
          {visible.map((article) => (
            <article key={article.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-medium">{article.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{article.track} · {article.difficulty}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setState, usePref } from "@/lib/store";

type Article = { id: string; title: string; tags: string[]; minutes: number };

type ApiResp = { ok: true; items: Article[]; tag: string | null };

async function fetchArticles(tag: string | null): Promise<ApiResp> {
  const qs = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  const res = await fetch("/api/articles" + qs, { cache: "no-store" });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return (await res.json()) as ApiResp;
}

export function Explorer() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const tag = sp.get("tag");

  const compact = usePref((s) => s.compact);
  const sidebarOpen = usePref((s) => s.sidebarOpen);

  const [items, setItems] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setError(null);
      try {
        const r = await fetchArticles(tag);
        if (mounted) setItems(r.items);
      } catch (e) {
        if (mounted) setError(String(e));
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [tag]);

  const tags = useMemo(() => ["frontend", "backend", "security", "ux", "realtime", "state", "caching"], []);

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">UI prefs (global)</div>
          <button
            className="rounded bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700"
            onClick={() => setState({ sidebarOpen: !sidebarOpen })}
          >
            {sidebarOpen ? "Close" : "Open"}
          </button>
        </div>

        {sidebarOpen ? (
          <>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={compact} onChange={(e) => setState({ compact: e.target.checked })} />
              Compact cards
            </label>
            <div className="text-xs text-slate-400">
              Persisted to <code className="rounded bg-slate-800 px-1">localStorage</code>.
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-400">Sidebar collapsed</div>
        )}
      </aside>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium">Articles (server state)</div>
          <div className="text-xs text-slate-400">Filter is URL state: shareable and back/forward friendly.</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-medium ${tag ? "bg-slate-700 hover:bg-slate-600" : "bg-indigo-600 hover:bg-indigo-500"}`}
            onClick={() => router.replace(pathname)}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${tag === t ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-700 hover:bg-slate-600"}`}
              onClick={() => router.replace(`${pathname}?tag=${encodeURIComponent(t)}`)}
            >
              {t}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div>
        ) : null}

        <ul className={compact ? "grid gap-2 md:grid-cols-2" : "space-y-2"}>
          {items.map((a) => (
            <li key={a.id} className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
              <div className="text-slate-200 font-medium">{a.title}</div>
              <div className="mt-1 text-xs text-slate-400">
                {a.tags.join(", ")} • {a.minutes} min
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


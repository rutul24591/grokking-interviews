"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { fetchJson } from "@/lib/fetchJson";
import type { ArticleListResponse, ArticleResponse, ArticleSummary } from "@/lib/types";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN?.trim() || "http://localhost:4000";

const PAGE_SIZE = 8;

function formatIsoDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

export default function Page() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<ArticleSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [feedError, setFeedError] = useState<string | null>(null);
  const [articleError, setArticleError] = useState<string | null>(null);

  const [article, setArticle] = useState<ArticleResponse | null>(null);

  const feedAbortRef = useRef<AbortController | null>(null);
  const articleAbortRef = useRef<AbortController | null>(null);

  const normalizedQuery = useMemo(() => deferredQuery.trim(), [deferredQuery]);

  function buildFeedUrl(params: { cursor: string | null }) {
    const url = new URL("/articles", API_ORIGIN);
    url.searchParams.set("limit", String(PAGE_SIZE));
    if (normalizedQuery) url.searchParams.set("q", normalizedQuery);
    if (params.cursor) url.searchParams.set("cursor", params.cursor);
    return url.toString();
  }

  async function loadFeedPage(params: { cursor: string | null; mode: "replace" | "append" }) {
    setFeedError(null);

    feedAbortRef.current?.abort();
    const abortController = new AbortController();
    feedAbortRef.current = abortController;

    const url = buildFeedUrl({ cursor: params.cursor });
    try {
      const res = await fetchJson<ArticleListResponse>(url, {
        signal: abortController.signal,
        // A small retry is often worth it for flaky mobile networks.
        retry: { maxAttempts: 2, baseDelayMs: 180 },
        cache: { ttlMs: 10_000 },
      });

      setItems((prev) =>
        params.mode === "append" ? [...prev, ...res.items] : res.items,
      );
      setNextCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
    } catch (err) {
      if (abortController.signal.aborted) return;
      setFeedError(err instanceof Error ? err.message : "Failed to load feed.");
    }
  }

  useEffect(() => {
    // When search changes, reset paging on the *deferred* value.
    setHasMore(true);
    setItems([]);
    setNextCursor(null);
    setSelectedId(null);
    setArticle(null);
    setFeedError(null);
    setArticleError(null);
    void loadFeedPage({ cursor: null, mode: "replace" }).catch((err) => {
      setFeedError(err instanceof Error ? err.message : "Failed to load feed.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery]);

  useEffect(() => {
    if (!selectedId) return;

    async function loadArticle(id: string) {
      setArticleError(null);
      setArticle(null);

      articleAbortRef.current?.abort();
      const abortController = new AbortController();
      articleAbortRef.current = abortController;

      const url = new URL(`/articles/${encodeURIComponent(id)}`, API_ORIGIN);

      try {
        const res = await fetchJson<ArticleResponse>(url.toString(), {
          signal: abortController.signal,
          retry: { maxAttempts: 2, baseDelayMs: 180 },
          cache: { ttlMs: 30_000 },
        });
        setArticle(res);
      } catch (err) {
        if (abortController.signal.aborted) return;
        setArticleError(
          err instanceof Error ? err.message : "Failed to load article."
        );
      }
    }

    void loadArticle(selectedId);
  }, [selectedId]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return items.find((it) => it.id === selectedId) ?? null;
  }, [items, selectedId]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              CSR Reader
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Next.js UI renders on the client; Node API runs separately.
            </p>
          </div>
          <div className="w-full md:w-[28rem]">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                startTransition(() => setQuery(next));
              }}
              placeholder="Try: react, caching, network..."
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-400"
            />
            <div className="mt-2 text-xs text-slate-400">
              API origin: <span className="font-mono">{API_ORIGIN}</span>{" "}
              {isPending ? "(updating...)" : null}
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-[24rem_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                Feed
              </h2>
              <button
                type="button"
                onClick={() => {
                  // paging is driven by cursor; setting it to current value triggers effect via feedUrl only.
                  // so we just no-op here; the next page loads through the "Load more" button below.
                }}
                className="text-xs text-slate-400"
              >
                {items.length} items
              </button>
            </div>

            {feedError ? (
              <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                {feedError}
                <div className="mt-2 text-xs text-red-300/80">
                  Tip: try the API knobs in the README (latency/fail).
                </div>
              </div>
            ) : null}

            <ul className="mt-4 space-y-3">
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(it.id)}
                    className={[
                      "w-full rounded-xl border p-3 text-left transition",
                      it.id === selectedId
                        ? "border-indigo-400 bg-indigo-500/10"
                        : "border-slate-800 bg-slate-950/30 hover:border-slate-600",
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold text-slate-100">
                      {it.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Updated {formatIsoDate(it.updatedAt)}
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm text-slate-300">
                      {it.excerpt}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {it.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-800/60 px-2 py-1 text-[11px] text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <button
                type="button"
                disabled={!hasMore}
                onClick={() => {
                  if (!nextCursor) return;
                  void loadFeedPage({ cursor: nextCursor, mode: "append" });
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasMore ? "Load more" : "No more results"}
              </button>
              <div className="mt-2 text-xs text-slate-500">
                Pagination uses an opaque cursor to avoid offset pitfalls.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h2 className="text-sm font-semibold tracking-wide text-slate-200">
              Article
            </h2>

            {!selected ? (
              <div className="mt-6 text-sm text-slate-400">
                Pick an article from the feed.
              </div>
            ) : null}

            {selected ? (
              <div className="mt-6">
                <div className="text-xl font-semibold text-slate-100">
                  {selected.title}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Updated {formatIsoDate(selected.updatedAt)}
                </div>
              </div>
            ) : null}

            {articleError ? (
              <div className="mt-5 rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                {articleError}
              </div>
            ) : null}

            {selected && !article && !articleError ? (
              <div className="mt-6 space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-800/60" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-800/60" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-800/60" />
                <div className="h-4 w-3/6 animate-pulse rounded bg-slate-800/60" />
              </div>
            ) : null}

            {article ? (
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-200">
                <p className="whitespace-pre-wrap">{article.body}</p>
                <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                    Notes
                  </div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200">
                    <li>
                      CSR: content appears only after the browser runs JS and
                      fetches data.
                    </li>
                    <li>
                      The API uses ETags; repeat a request and you may see `304`
                      in DevTools.
                    </li>
                    <li>
                      Requests are canceled during rapid search/navigation to
                      avoid stale UI updates.
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

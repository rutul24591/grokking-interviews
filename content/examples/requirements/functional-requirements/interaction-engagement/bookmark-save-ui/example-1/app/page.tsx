"use client";

import { useEffect, useState } from "react";

type SavedItem = {
  id: string;
  title: string;
  collection: string;
  saved: boolean;
  syncState: string;
  note: string;
};

type BookmarkState = {
  collectionView: "all" | "interview-prep" | "backend";
  collections: { id: string; label: string; pendingWrites: number; count: number }[];
  items: SavedItem[];
  savedCount: number;
  pendingSync: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<BookmarkState | null>(null);

  async function refresh() {
    const response = await fetch("/api/bookmark-save-ui/state");
    setState((await response.json()) as BookmarkState);
  }

  async function act(type: "switch-collection" | "toggle-save", value?: string) {
    const response = await fetch("/api/bookmark-save-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as BookmarkState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Bookmark Save UI</h1>
      <p className="mt-2 text-slate-300">Save articles into collections, switch saved views, and keep bookmark state visible across research workflows.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="space-y-3">
            {state?.collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => void act("switch-collection", collection.id)}
                className={`flex w-full items-center justify-between rounded border px-4 py-3 text-left text-sm font-semibold ${
                  state.collectionView === collection.id ? "border-sky-500 bg-sky-500/10 text-sky-200" : "border-slate-700"
                }`}
              >
                <span>{collection.label}</span>
                <span className="text-xs text-slate-400">{collection.count} saved · {collection.pendingWrites} queued</span>
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <div className="rounded border border-slate-800 px-3 py-2">saved articles: {state?.savedCount ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">pending sync writes: {state?.pendingSync ?? 0}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-500">collection {item.collection}</div>
                  <div className="mt-2 text-xs text-slate-400">{item.note}</div>
                </div>
                <button onClick={() => void act("toggle-save", item.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">
                  {item.saved ? "Unsave" : "Save"}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="rounded border border-slate-800 px-2 py-1">sync {item.syncState}</span>
                <span className="rounded border border-slate-800 px-2 py-1">
                  {item.saved ? "Visible in saved surfaces" : "Only available in recommendations"}
                </span>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}

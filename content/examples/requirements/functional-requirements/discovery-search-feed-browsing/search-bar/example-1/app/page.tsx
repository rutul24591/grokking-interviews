"use client";

import { useEffect, useMemo, useState } from "react";

type SearchSuggestion = {
  id: string;
  label: string;
  source: "history" | "popular" | "index";
  type: "query" | "topic" | "author";
};

type SearchBarState = {
  currentQuery: string;
  submitted: string;
  recentQueries: string[];
  suggestions: SearchSuggestion[];
  selectedSuggestionId: string | null;
  validation: "ready" | "empty" | "too-long";
  estimatedResultCount: number;
  searchMode: "suggestions" | "recent" | "results";
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SearchBarState | null>(null);
  const [query, setQuery] = useState("");
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);

  async function refresh() {
    const response = await fetch("/api/search/state");
    const data = (await response.json()) as SearchBarState;
    setState(data);
    setQuery(data.currentQuery);
    setSelectedSuggestionId(data.selectedSuggestionId);
  }

  async function submit(nextQuery: string, nextSuggestionId: string | null = selectedSuggestionId) {
    const response = await fetch("/api/search/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: nextQuery, selectedSuggestionId: nextSuggestionId })
    });
    const data = (await response.json()) as SearchBarState;
    setState(data);
    setQuery(data.currentQuery);
    setSelectedSuggestionId(data.selectedSuggestionId);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const validationTone = useMemo(() => {
    if (state?.validation === "too-long") return "text-amber-300";
    if (state?.validation === "empty") return "text-slate-400";
    return "text-emerald-300";
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Search Bar</h1>
      <p className="mt-2 text-slate-300">
        Run a realistic query-entry workflow with validation, suggestion blending, recent-search fallback, and result-volume feedback.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[360px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm font-semibold text-slate-100">Search query</label>
          <div className="mt-2 flex gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for system design topics"
              className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            />
            <button onClick={() => void submit(query)} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">
              Search
            </button>
          </div>
          <div className="mt-4 grid gap-3 rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Validation</span>
              <span className={validationTone}>{state?.validation ?? "loading"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Mode</span>
              <span className="font-semibold text-slate-100">{state?.searchMode ?? "loading"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated results</span>
              <span className="font-semibold text-slate-100">{state?.estimatedResultCount ?? 0}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <section>
              <div className="text-sm font-semibold text-slate-100">Suggestions</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {state?.suggestions.map((suggestion) => (
                  <li key={suggestion.id}>
                    <button
                      onClick={() => {
                        setSelectedSuggestionId(suggestion.id);
                        setQuery(suggestion.label);
                        void submit(suggestion.label, suggestion.id);
                      }}
                      className={`w-full rounded border px-3 py-2 text-left ${
                        selectedSuggestionId === suggestion.id ? "border-sky-500 bg-sky-500/10" : "border-slate-800"
                      }`}
                    >
                      <div className="font-medium text-slate-100">{suggestion.label}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {suggestion.source} · {suggestion.type}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <div className="text-sm font-semibold text-slate-100">Recent queries</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {state?.recentQueries.map((item) => (
                  <li key={item} className="rounded border border-slate-800 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span>{item}</span>
                      <button
                        onClick={() => {
                          setQuery(item);
                          void submit(item, null);
                        }}
                        className="text-xs font-semibold text-sky-300"
                      >
                        Re-run
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded border border-slate-800 px-3 py-3 text-sm text-slate-300">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Last submitted</div>
                <div className="mt-2 font-semibold text-slate-100">{state?.submitted ?? "—"}</div>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}

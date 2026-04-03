"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";
import { fetchFeed, type FeedFetchResult } from "@/lib/client/feedClient";

export default function Page() {
  const [last, setLast] = useState<FeedFetchResult | null>(null);
  const [networkBytes, setNetworkBytes] = useState(0);
  const [requests, setRequests] = useState(0);
  const [hits304, setHits304] = useState(0);

  const load = async () => {
    const r = await fetchFeed();
    setLast(r);
    setRequests((x) => x + 1);
    if (r.status === 304) setHits304((x) => x + 1);
    setNetworkBytes((x) => x + r.bytes);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Network efficiency — ETag + request coalescing</h1>
        <p className="text-sm text-slate-300">
          Repeated loads revalidate via <code className="rounded bg-slate-800 px-1">If-None-Match</code>{" "}
          and avoid bytes on <code className="rounded bg-slate-800 px-1">304</code>. Concurrent calls are
          coalesced so you don&apos;t stampede your own API.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            onClick={() => void load()}
          >
            Load feed
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              await fetch("/api/feed/bump", { method: "POST" });
              await load();
            }}
          >
            Bump server version + reload
          </button>
          <button
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
            onClick={async () => {
              // simulate a UI waterfall: 5 callers requesting the same thing
              await Promise.all([load(), load(), load(), load(), load()]);
            }}
          >
            Stampede (deduped)
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-lg bg-slate-950/40 p-3">
            <div className="text-slate-400">Requests</div>
            <div className="text-xl font-semibold">{requests}</div>
          </div>
          <div className="rounded-lg bg-slate-950/40 p-3">
            <div className="text-slate-400">304 hits</div>
            <div className="text-xl font-semibold">{hits304}</div>
          </div>
          <div className="rounded-lg bg-slate-950/40 p-3">
            <div className="text-slate-400">Network bytes</div>
            <div className="text-xl font-semibold">{networkBytes.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h2 className="font-medium">Latest result</h2>
        <pre className="mt-3 rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">
          {JSON.stringify(last, null, 2)}
        </pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Where this fits (real-world)</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use ETags for large, frequently revalidated payloads (feeds, configs, catalogs).</li>
          <li>Deduplicate in-flight requests to prevent UI waterfalls and backend mini-stampedes.</li>
          <li>Pair with retry budgets + timeouts so retries don&apos;t amplify outages.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether network efficiency is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For network efficiency, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For network efficiency, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For network efficiency, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Network Efficiency</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}


"use client";

import { useMemo, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function call(version: 1 | 2, method: "header" | "query" | "accept") {
  const url = method === "query" ? `/api/users?v=${version}` : "/api/users";
  const headers: Record<string, string> = {};
  if (method === "header") headers["x-api-version"] = String(version);
  if (method === "accept") headers.accept = `application/vnd.sdp.users.v${version}+json`;

  const res = await fetch(url, { headers, cache: "no-store" });
  const body = await res.json();
  return {
    status: res.status,
    headers: {
      "x-api-version": res.headers.get("x-api-version"),
      deprecation: res.headers.get("deprecation"),
      sunset: res.headers.get("sunset"),
      link: res.headers.get("link")
    },
    body
  };
}

export default function Page() {
  const [version, setVersion] = useState<1 | 2>(2);
  const [method, setMethod] = useState<"header" | "query" | "accept">("header");
  const [result, setResult] = useState<any>(null);
  const label = useMemo(() => `v${version} via ${method}`, [version, method]);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">API versioning — routing + deprecation signals</h1>
        <p className="text-sm text-slate-300">
          Demonstrates URL/query, header, and vendor media-type versioning; plus deprecation headers
          for older versions.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <div className="space-y-1">
            <div className="font-medium text-slate-200">Version</div>
            <div className="flex gap-2">
              <button
                className={`rounded-lg px-3 py-2 font-medium ${version === 1 ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}`}
                onClick={() => setVersion(1)}
              >
                v1
              </button>
              <button
                className={`rounded-lg px-3 py-2 font-medium ${version === 2 ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}`}
                onClick={() => setVersion(2)}
              >
                v2
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-medium text-slate-200">Method</div>
            <div className="flex gap-2">
              <button
                className={`rounded-lg px-3 py-2 font-medium ${method === "header" ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}`}
                onClick={() => setMethod("header")}
              >
                Header
              </button>
              <button
                className={`rounded-lg px-3 py-2 font-medium ${method === "query" ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}`}
                onClick={() => setMethod("query")}
              >
                Query
              </button>
              <button
                className={`rounded-lg px-3 py-2 font-medium ${method === "accept" ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}`}
                onClick={() => setMethod("accept")}
              >
                Accept
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
              onClick={async () => setResult(await call(version, method))}
            >
              Call {label}
            </button>
          </div>
        </div>

        <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Design notes</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Default to latest version; keep older versions compatible as long as policy requires.</li>
          <li>Emit deprecation signals (Deprecation/Sunset/Link) so clients can migrate proactively.</li>
          <li>Versioning is an org contract: docs, changelogs, and automated compatibility tests matter.</li>
        </ul>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether api versioning is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For api versioning, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For api versioning, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For api versioning, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Api Versioning</div>
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


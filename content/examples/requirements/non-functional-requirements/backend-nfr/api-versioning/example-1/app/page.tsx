"use client";

import { useMemo, useState } from "react";

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
    </main>
  );
}


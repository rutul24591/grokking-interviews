import { headers } from "next/headers";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type FeedResponse = {
  uid: string;
  bucket: "A" | "B";
  generatedAt: string;
  items: { id: string; title: string; reason: string }[];
};

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    // In production you might choose a small revalidate window for shared content.
    next: { revalidate: 10 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default async function Page() {
  const h = headers();
  const uid = h.get("x-user-id") ?? "missing";
  const bucket = (h.get("x-exp-bucket") ?? "A") as "A" | "B";

  const originApi = process.env.ORIGIN_API?.trim() || "http://localhost:4020";
  const url = new URL("/v1/feed", originApi);

  const t0 = Date.now();
  const data = (await fetchJson(url.toString())) as FeedResponse;
  const t1 = Date.now();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Edge Rendering</h1>
        <p className="mt-1 text-sm text-slate-300">
          Runtime: <span className="font-mono">edge</span> · Origin fetch:{" "}
          <span className="font-mono">{t1 - t0}ms</span>
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Identity (from middleware)
          </div>
          <div className="mt-3 grid gap-1 text-sm text-slate-100">
            <div>
              uid: <span className="font-mono">{uid}</span>
            </div>
            <div>
              bucket: <span className="font-mono">{bucket}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Edge constraint reminder: avoid Node-only APIs; prefer Web APIs.
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Feed (origin API)
          </div>
          <pre className="mt-3 overflow-auto rounded-xl bg-slate-950/60 p-3 text-xs text-slate-100">
            {JSON.stringify(data, null, 2)}
          </pre>
          <div className="mt-3 text-xs text-slate-500">
            generatedAt: <span className="font-mono">{data.generatedAt}</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          In real deployments, edge rendering + caching can reduce p95 by removing cross-region trips to the origin for
          cacheable parts of HTML/JSON.
        </div>
      </div>
    </main>
  );
}


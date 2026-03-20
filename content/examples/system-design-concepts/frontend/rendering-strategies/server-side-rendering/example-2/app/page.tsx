import { getRequestOrigin } from "@/lib/origin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ mode?: "sequential" | "parallel" }>;
};

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as any;
}

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const mode = params.mode ?? "parallel";

  const origin = getRequestOrigin();
  const trendingUrl = `${origin}/api/trending`;
  const recommendedUrl = `${origin}/api/recommended`;

  const t0 = Date.now();
  const data =
    mode === "sequential"
      ? {
          trending: await fetchJson(trendingUrl),
          recommended: await fetchJson(recommendedUrl),
        }
      : await (async () => {
          const [trending, recommended] = await Promise.all([
            fetchJson(trendingUrl),
            fetchJson(recommendedUrl),
          ]);
          return { trending, recommended };
        })();
  const t1 = Date.now();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">SSR Waterfall Demo</h1>
        <p className="mt-1 text-sm text-slate-300">
          Mode: <span className="font-mono">{mode}</span> · Server fetch time:{" "}
          <span className="font-mono">{t1 - t0}ms</span>
        </p>

        <div className="mt-6 flex gap-2 text-sm">
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/?mode=sequential"
          >
            Sequential
          </a>
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/?mode=parallel"
          >
            Parallel
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Trending
            </div>
            <pre className="mt-3 overflow-auto rounded-xl bg-slate-950/60 p-3 text-xs text-slate-100">
              {JSON.stringify(data.trending, null, 2)}
            </pre>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Recommended
            </div>
            <pre className="mt-3 overflow-auto rounded-xl bg-slate-950/60 p-3 text-xs text-slate-100">
              {JSON.stringify(data.recommended, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          This is SSR: server time includes both backend calls. Parallelizing independent calls reduces TTFB.
        </div>
      </div>
    </main>
  );
}


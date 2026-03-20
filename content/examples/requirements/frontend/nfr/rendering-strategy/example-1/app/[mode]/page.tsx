import Link from "next/link";
import { CsrPanel } from "@/components/CsrPanel";
import { origin } from "@/lib/origin";

export const revalidate = 10; // only affects ISR-like mode (see below)

async function fetchNow(baseUrl: string) {
  const res = await fetch(baseUrl + "/api/now", { cache: "no-store" });
  return (await res.json()) as { now: number };
}

async function fetchConfigCacheable(baseUrl: string, revalidateSeconds?: number) {
  const res = await fetch(baseUrl + "/api/config", revalidateSeconds ? { next: { revalidate: revalidateSeconds } } : {});
  return (await res.json()) as { version: string; flags: Record<string, boolean> };
}

export default async function ModePage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  const baseUrl = await origin();

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mode: {mode}</h1>
        <Link className="text-sm text-slate-300 underline" href="/">
          Back
        </Link>
      </div>

      {mode === "ssr" ? (
        <ServerBlock
          title="SSR"
          data={{
            serverRenderedAt: new Date().toISOString(),
            now: await fetchNow(baseUrl)
          }}
          note="Good for personalized/auth content. Not CDN-shareable (often no-store)."
        />
      ) : null}

      {mode === "static" ? (
        <ServerBlock
          title="Static-like"
          data={{
            serverRenderedAt: new Date().toISOString(),
            config: await fetchConfigCacheable(baseUrl)
          }}
          note="Cacheable config-like data. Suitable for shared content and CDN caching."
        />
      ) : null}

      {mode === "isr" ? (
        <ServerBlock
          title="ISR-like"
          data={{
            serverRenderedAt: new Date().toISOString(),
            config: await fetchConfigCacheable(baseUrl, 10)
          }}
          note="Revalidated periodically. Good balance for mostly-shared content with freshness constraints."
        />
      ) : null}

      {mode === "csr" ? <CsrPanel /> : null}

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300 space-y-2">
        <div className="font-medium text-slate-200">Try changing server config</div>
        <form action="/api/config/bump" method="post">
          <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500" type="submit">
            Bump config version
          </button>
        </form>
        <p className="text-xs text-slate-400">
          In static/ISR modes, caching may prevent immediate changes from showing up everywhere.
        </p>
      </section>
    </main>
  );
}

function ServerBlock({ title, data, note }: { title: string; data: unknown; note: string }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 space-y-2">
      <h2 className="font-medium">{title} server block</h2>
      <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      <p className="text-xs text-slate-400">{note}</p>
    </section>
  );
}


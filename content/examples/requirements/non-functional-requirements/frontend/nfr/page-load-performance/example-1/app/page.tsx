import dynamic from "next/dynamic";
import { Suspense } from "react";
import { headers } from "next/headers";
import { PerfPanel } from "@/components/PerfPanel";

const HeavyClientWidget = dynamic(
  async () => {
    const mod = await import("@/components/HeavyClientWidget");
    return mod.HeavyClientWidget;
  },
  { ssr: false, loading: () => <div className="text-sm text-slate-400">Loading widget…</div> },
);

async function Critical() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(baseUrl + "/api/critical", { cache: "no-store" });
  const data = (await res.json()) as { header: string; items: Array<{ id: string; title: string; score: number }> };
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
      <h2 className="font-medium">{data.header}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {data.items.map((it) => (
          <li key={it.id} className="flex items-center justify-between rounded-lg bg-slate-950/40 p-3">
            <span className="text-slate-200">{it.title}</span>
            <span className="font-mono text-slate-400">{it.score}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function Deferred() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(baseUrl + "/api/deferred?delayMs=1400", { cache: "no-store" });
  const data = (await res.json()) as { header: string; items: Array<{ id: string; title: string; score: number }> };
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
      <h2 className="font-medium">{data.header}</h2>
      <ul className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
        {data.items.slice(0, 8).map((it) => (
          <li key={it.id} className="rounded-lg bg-slate-950/40 p-3 text-slate-200">
            {it.title}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-400">
        Deferred work is streamed behind a Suspense boundary. The initial HTML can render the critical
        portion sooner.
      </p>
    </section>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Page-load performance — stream + split + measure</h1>
        <p className="text-sm text-slate-300">
          End-to-end demo of improving initial page load by separating{" "}
          <strong>critical</strong> vs <strong>deferred</strong> work and lazy-loading heavy client code.
        </p>
      </header>

      <PerfPanel />

      {/* Critical content should not wait on non-critical data. */}
      <Suspense fallback={<div className="text-sm text-slate-400">Loading critical…</div>}>
        {/* @ts-expect-error async Server Component */}
        <Critical />
      </Suspense>

      <Suspense
        fallback={
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
            Loading deferred recommendations…
          </div>
        }
      >
        {/* @ts-expect-error async Server Component */}
        <Deferred />
      </Suspense>

      <HeavyClientWidget />
    </main>
  );
}

import { Suspense } from "react";
import RecommendationsPanel from "@/app/_components/RecommendationsPanel";
import SidebarPanel from "@/app/_components/SidebarPanel";
import { Skeleton } from "@/app/_components/Skeleton";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    sidebarDelayMs?: string;
    recoDelayMs?: string;
  }>;
};

function clampDelay(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(8_000, Math.floor(value)));
}

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const sidebarDelayMs = clampDelay(Number(params.sidebarDelayMs), 1_800);
  const recoDelayMs = clampDelay(Number(params.recoDelayMs), 2_800);

  const originApi = process.env.ORIGIN_API?.trim() || "http://localhost:4010";
  const renderTs = new Date().toISOString();

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Streaming SSR</h1>
        <p className="mt-1 text-sm text-slate-300">
          Shell render timestamp: <span className="font-mono">{renderTs}</span>
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                Controls (fast shell)
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <a
                  className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
                  href={`/?sidebarDelayMs=400&recoDelayMs=${recoDelayMs}`}
                >
                  Sidebar fast (400ms)
                </a>
                <a
                  className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
                  href={`/?sidebarDelayMs=${sidebarDelayMs}&recoDelayMs=1200`}
                >
                  Reco medium (1200ms)
                </a>
                <a
                  className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
                  href={`/?sidebarDelayMs=2200&recoDelayMs=4200`}
                >
                  Both slow
                </a>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Each panel is a separate `Suspense` boundary, so it can stream independently.
              </div>
            </div>

            <Suspense fallback={<Skeleton label="Sidebar" />}>
              <SidebarPanel originApi={originApi} delayMs={sidebarDelayMs} />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton label="Recommendations" />}>
            <RecommendationsPanel originApi={originApi} delayMs={recoDelayMs} />
          </Suspense>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Tip: run <span className="font-mono">curl -N http://localhost:3000</span> and watch HTML flush while slow
          panels stream later.
        </div>
      </div>
    </main>
  );
}


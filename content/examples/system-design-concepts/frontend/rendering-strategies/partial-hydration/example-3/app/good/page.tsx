import LeafCounter from "@/app/_components/LeafCounter";
import { buildItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GoodPage() {
  const items = buildItems(250);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">/good — Server Shell + Leaf Island</h1>
        <p className="mt-1 text-sm text-slate-300">
          Page remains server-rendered; only the counter below is a client island.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <LeafCounter />
        </div>

        <div className="mt-6 grid gap-3">
          {items.slice(0, 30).map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-sm font-semibold text-slate-100">{item.title}</div>
              <div className="mt-1 text-xs text-slate-500">
                score: <span className="font-mono">{item.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-slate-500">
          This is the typical “partial hydration” shape: server renders most content; client islands are small and scoped.
        </div>
      </div>
    </main>
  );
}


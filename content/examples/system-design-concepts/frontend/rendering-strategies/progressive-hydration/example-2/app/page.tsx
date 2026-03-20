import { IdleGate } from "@/app/_components/IdleGate";
import { VisibleGate } from "@/app/_components/VisibleGate";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Progressive Hydration Hooks</h1>
        <p className="mt-1 text-sm text-slate-300">
          Reusable primitives for idle and visibility-based progressive mounting.
        </p>

        <div className="mt-6 grid gap-4">
          <IdleGate />
        </div>

        <article className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-100">
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i}>
              Filler content {i + 1}: Idle and visibility gates help keep the first interaction responsive by deferring
              expensive islands.
            </p>
          ))}
        </article>

        <div className="mt-6 grid gap-4">
          <VisibleGate />
        </div>
      </div>
    </main>
  );
}


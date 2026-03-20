import ProgressiveSlot from "@/app/_components/ProgressiveSlot";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Progressive Hydration</h1>
        <p className="mt-1 text-sm text-slate-300">
          Load/hydrate heavy islands progressively using idle time and visibility.
        </p>

        <div className="mt-6 grid gap-4">
          <ProgressiveSlot strategy="immediate" label="Immediate heavy widget" />
          <ProgressiveSlot strategy="idle" label="Idle heavy widget" />
        </div>

        <article className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm text-slate-100">
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i}>
              Filler content {i + 1}: Progressive hydration keeps the initial navigation responsive by deferring expensive
              islands until later.
            </p>
          ))}
        </article>

        <div className="mt-6">
          <ProgressiveSlot strategy="visible" label="Visible heavy widget" />
        </div>
      </div>
    </main>
  );
}


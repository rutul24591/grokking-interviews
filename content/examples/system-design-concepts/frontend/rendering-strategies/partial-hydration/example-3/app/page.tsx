export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Partial Hydration Pitfalls</h1>
        <p className="mt-2 text-sm text-slate-300">
          Compare <span className="font-mono">/bad</span> vs{" "}
          <span className="font-mono">/good</span>.
        </p>
        <div className="mt-6 flex gap-2 text-sm">
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/bad"
          >
            /bad
          </a>
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/good"
          >
            /good
          </a>
        </div>
      </div>
    </main>
  );
}


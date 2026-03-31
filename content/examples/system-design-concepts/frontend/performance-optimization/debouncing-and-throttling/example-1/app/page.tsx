import SearchWorkbench from "./search-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#f4ecdf_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
            Performance-Safe Input Handling
          </p>
          <h1 className="mt-4 font-serif text-5xl tracking-tight">
            Debounce search requests, throttle telemetry, keep the UI responsive.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-700">
            The input below debounces network-bound search, aborts stale requests, and separately throttles the
            analytics stream so the origin only sees the signal you actually need.
          </p>
        </header>

        <SearchWorkbench />
      </div>
    </main>
  );
}

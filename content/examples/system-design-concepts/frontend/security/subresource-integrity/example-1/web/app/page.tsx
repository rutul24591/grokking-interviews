export default function Page() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Subresource Integrity (SRI)</h1>
        <p className="text-sm text-white/70">
          Open the demo pages served by the Node server to see the browser enforce the integrity hash.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <a
            className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-400"
            href="http://localhost:4555/"
            target="_blank"
            rel="noreferrer"
          >
            Open GOOD hash
          </a>
          <a
            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-400"
            href="http://localhost:4555/?bad=1"
            target="_blank"
            rel="noreferrer"
          >
            Open BAD hash (blocked)
          </a>
        </div>
        <p className="mt-3 text-sm text-white/60">Check DevTools console for the integrity violation when using the bad hash.</p>
      </section>
    </main>
  );
}


export default function Page() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Clickjacking prevention demo</h1>
        <p className="text-sm text-white/70">
          The protected page sets <code>X-Frame-Options</code> and <code>CSP frame-ancestors</code>.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-2">
          <a
            className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-400"
            href="/protected"
            target="_blank"
            rel="noreferrer"
          >
            Open /protected
          </a>
          <a
            className="rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-400"
            href="http://localhost:4666/"
            target="_blank"
            rel="noreferrer"
          >
            Open attacker iframe page
          </a>
        </div>
        <p className="mt-3 text-sm text-white/60">The iframe should be blocked by the browser.</p>
      </section>
    </main>
  );
}


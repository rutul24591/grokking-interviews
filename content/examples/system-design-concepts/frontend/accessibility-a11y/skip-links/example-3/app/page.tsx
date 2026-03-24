export default function Page() {
  return (
    <main className="space-y-8">
      <header id="content" tabIndex={-1} className="skip-target outline-none">
        <h1 id="route-title" tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none">
          Home
        </h1>
        <p className="mt-2 text-slate-300">Route changes focus the heading; skip links focus the main content anchor.</p>
      </header>
      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
        <h2 className="text-xl font-semibold text-slate-100">Content</h2>
        <p className="mt-2">In SPAs, route transitions don’t reset focus unless you do it deliberately.</p>
      </section>
    </main>
  );
}


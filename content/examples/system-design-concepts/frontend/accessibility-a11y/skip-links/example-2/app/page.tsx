export default function Page() {
  return (
    <main className="space-y-8">
      <header id="content" tabIndex={-1} className="skip-target outline-none">
        <h1 className="text-3xl font-semibold tracking-tight">Reusable SkipLink component</h1>
        <p className="mt-2 text-slate-300">Targets use scroll-margin so they aren’t hidden behind sticky headers.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-300">
        <h2 className="text-xl font-semibold text-slate-100">Content</h2>
        <p className="mt-2">
          Press Tab at the top of the page: skip links appear. Activate one and focus moves to the target element.
        </p>
      </section>

      <section id="help" tabIndex={-1} className="skip-target rounded-xl border border-white/10 bg-white/5 p-6 outline-none">
        <h2 className="text-xl font-semibold text-slate-100">Help</h2>
        <p className="mt-2 text-slate-300">This section is also a skip target.</p>
      </section>
    </main>
  );
}


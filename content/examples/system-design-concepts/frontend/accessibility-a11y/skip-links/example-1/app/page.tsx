export default function Page() {
  return (
    <main id="main" tabIndex={-1} className="space-y-8 outline-none">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Skip links (end-to-end)</h1>
        <p className="mt-2 text-slate-300">
          Skip links let keyboard and screen reader users bypass repeated navigation to reach the main content quickly.
        </p>
      </header>

      <section id="search" tabIndex={-1} className="rounded-xl border border-white/10 bg-white/5 p-6 outline-none">
        <h2 className="text-xl font-semibold">Search</h2>
        <p className="mt-2 text-sm text-slate-300">This is a second skip target. It is focusable for reliable landing.</p>
        <input
          className="mt-4 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
          placeholder="Search docs…"
          aria-label="Search docs"
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-xl font-semibold text-slate-100">Repeated content simulation</h2>
        <p className="mt-2">
          Pretend the header/nav is very large. Skip links prevent having to Tab through all of it.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Large navigation menus</li>
          <li>Announcements bars</li>
          <li>Sticky toolbars</li>
        </ul>
      </section>

      <footer
        id="footer"
        tabIndex={-1}
        className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 outline-none"
      >
        <h2 className="text-xl font-semibold text-slate-100">Footer</h2>
        <p className="mt-2">Another skip target.</p>
      </footer>
    </main>
  );
}


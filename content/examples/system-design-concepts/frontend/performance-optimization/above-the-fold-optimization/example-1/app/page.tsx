import RecommendationsPanel from "./recommendations-panel";

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,214,153,0.28),_transparent_28%),linear-gradient(180deg,_#fff9f2_0%,_#f8f2ea_60%,_#efe7db_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
              Critical Path First
            </p>
            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight tracking-tight">
              Render the story before loading the rest of the newsroom.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              This page is intentionally optimized so the hero copy, primary image, and call to action are
              immediately renderable. Recommendations and analytics are deferred until after the visible shell
              is already on screen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                className="rounded-full bg-slate-950 px-5 py-3 text-white"
                href="#read"
              >
                Read article
              </a>
              <span className="rounded-full border border-slate-300 px-5 py-3 text-slate-700">
                LCP-safe image sizing
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 shadow-[0_30px_90px_rgba(93,54,12,0.14)] backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80"
              alt="Editor desk representing immediately visible hero media"
              width="1400"
              height="933"
              fetchPriority="high"
              className="h-auto w-full object-cover"
            />
          </div>
        </header>

        <section id="read" className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <article className="rounded-[1.75rem] border border-white/70 bg-white/70 p-7 shadow-[0_24px_70px_rgba(93,54,12,0.08)]">
            <h2 className="font-serif text-3xl tracking-tight">What ships immediately</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li>Server-rendered heading, summary, CTA, and hero markup.</li>
              <li>Reserved image dimensions so layout is stable before bytes arrive.</li>
              <li>Deferred analytics so third-party work does not block paint.</li>
              <li>Below-fold recommendations fetched after the hero shell is already present.</li>
            </ul>
          </article>

          <RecommendationsPanel />
        </section>
      </div>
    </main>
  );
}

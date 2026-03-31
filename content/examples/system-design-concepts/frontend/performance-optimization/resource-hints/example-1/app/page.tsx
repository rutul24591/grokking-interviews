type Hint = { rel: string; href: string; note: string };
async function getHints(): Promise<Hint[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4220";
  const res = await fetch(`${origin}/hints`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
export default async function Page() {
  const hints = await getHints();
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#eff6ff_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Tell the browser what matters next</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">Resource hints move critical fetches earlier, but every hint also spends network priority and connection budget.</p>
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {hints.map((hint) => <article key={`${hint.rel}-${hint.href}`} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">{hint.rel}</div><div className="mt-3 text-sm font-semibold text-slate-900">{hint.href}</div><p className="mt-4 text-sm leading-7 text-slate-600">{hint.note}</p></article>)}
        </section>
      </div>
    </main>
  );
}

type Report = { module: string; imported: string; shakenOut: string[]; note: string };
async function getReport(): Promise<Report[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4230";
  const res = await fetch(`${origin}/report`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
export default async function Page() {
  const report = await getReport();
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#ecfeff_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Keep only the exports you actually use</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">Tree shaking succeeds when modules are statically analyzable and side-effect boundaries are explicit.</p>
        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {report.map((row) => <article key={row.module} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">{row.module}</div><div className="mt-3 text-sm font-semibold text-slate-900">imported {row.imported}</div><div className="mt-3 text-xs text-slate-500">shaken out: {row.shakenOut.join(", ")}</div><p className="mt-4 text-sm leading-7 text-slate-600">{row.note}</p></article>)}
        </section>
      </div>
    </main>
  );
}

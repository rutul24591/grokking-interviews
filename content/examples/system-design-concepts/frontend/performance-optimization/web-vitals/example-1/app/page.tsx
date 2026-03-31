type Metric = { name: string; value: number; budget: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
async function getMetrics(): Promise<Metric[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4250";
  const res = await fetch(`${origin}/metrics`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
export default async function Page() {
  const metrics = await getMetrics();
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Web Vitals observability board</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">Track LCP, CLS, INP, FCP, and TTFB against budgets so user-perceived regressions surface before they become support tickets.</p>
        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <article key={metric.name} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{metric.name}</div>
              <div className="mt-4 text-3xl font-semibold">{metric.value}{metric.unit}</div>
              <div className="mt-2 text-sm text-slate-600">budget {metric.budget}{metric.unit}</div>
              <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${metric.rating === "good" ? "bg-emerald-100 text-emerald-700" : metric.rating === "needs-improvement" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                {metric.rating}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

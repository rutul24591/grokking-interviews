type Budget = { name: string; actual: number; limit: number; unit: string; status: "pass" | "fail" };
async function getBudgets(): Promise<Budget[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4200";
  const res = await fetch(`${origin}/budgets`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
export default async function Page() {
  const budgets = await getBudgets();
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#f3f4f6_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Performance budget control room</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          Track route, asset, and runtime budgets together so regressions fail early instead of surfacing after release.
        </p>
        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {budgets.map((budget) => (
            <article key={budget.name} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{budget.name}</div>
              <div className="mt-4 text-3xl font-semibold">{budget.actual}{budget.unit}</div>
              <div className="mt-2 text-sm text-slate-600">limit {budget.limit}{budget.unit}</div>
              <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${budget.status === "pass" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {budget.status}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

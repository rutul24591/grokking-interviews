"use client";

import { useMemo, useState } from "react";

type Item = { id: string; name: string; team: string; status: "healthy" | "warning" | "critical"; monthlyCost: number };
const inventory: Item[] = [
  { id: "svc-1", name: "Search API", team: "Core", status: "healthy", monthlyCost: 1800 },
  { id: "svc-2", name: "Checkout", team: "Growth", status: "critical", monthlyCost: 2400 },
  { id: "svc-3", name: "Media pipeline", team: "Platform", status: "warning", monthlyCost: 2100 },
  { id: "svc-4", name: "Recommendations", team: "Core", status: "healthy", monthlyCost: 2600 }
];

export default function Page() {
  const [team, setTeam] = useState("all");
  const [sort, setSort] = useState<"name" | "cost">("name");
  const [status, setStatus] = useState<"all" | Item["status"]>("all");

  const filtered = useMemo(() => inventory.filter((item) => (team === "all" || item.team === team) && (status === "all" || item.status === status)), [status, team]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : b.monthlyCost - a.monthlyCost), [filtered, sort]);
  const summary = useMemo(() => ({
    total: filtered.length,
    critical: filtered.filter((item) => item.status === "critical").length,
    monthlyCost: filtered.reduce((sum, item) => sum + item.monthlyCost, 0)
  }), [filtered]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Derived state</p>
        <h1 className="mt-2 text-3xl font-semibold">Service portfolio overview</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">Nothing stores filtered lists or totals directly. The UI recomputes them from the source inventory and active controls.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Visible services", String(summary.total)],
            ["Critical alerts", String(summary.critical)],
            ["Monthly cost", `$${summary.monthlyCost.toLocaleString()}`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <select className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2" value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="all">All teams</option>
            <option value="Core">Core</option>
            <option value="Growth">Growth</option>
            <option value="Platform">Platform</option>
          </select>
          <select className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="name">Sort by name</option>
            <option value="cost">Sort by cost</option>
          </select>
          <select className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">All status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="mt-6 grid gap-3">
          {sorted.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{item.team} · {item.status}</p>
                </div>
                <p className="text-lg font-semibold">${item.monthlyCost.toLocaleString()}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

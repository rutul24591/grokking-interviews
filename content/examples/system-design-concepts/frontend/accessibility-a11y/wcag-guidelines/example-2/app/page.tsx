import { INVENTORY } from "@/lib/inventory";
import { evaluate, type Report } from "@/lib/policy";

export default function Page() {
  const report: Report = evaluate(INVENTORY);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Policy as code (component inventory)</h1>
        <p className="mt-2 text-slate-300">
          Instead of scanning the DOM, evaluate design-system metadata (labels, alt text, roles) as pure data.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Report</h2>
        <p className="mt-2 text-sm text-slate-300">
          Errors: <span className="font-semibold text-slate-100">{report.summary.errors}</span> · Warnings:{" "}
          <span className="font-semibold text-slate-100">{report.summary.warnings}</span>
        </p>
        <pre className="mt-4 overflow-auto rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-200">
          {JSON.stringify(report, null, 2)}
        </pre>
      </section>
    </main>
  );
}


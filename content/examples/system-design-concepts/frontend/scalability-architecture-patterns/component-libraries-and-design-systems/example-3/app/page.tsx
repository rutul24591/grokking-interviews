"use client";

import { useEffect, useRef, useState } from "react";
import { auditSubtree, type Finding } from "@/lib/audit";

export default function Page() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);

  useEffect(() => {
    if (!rootRef.current) return;
    setFindings(auditSubtree(rootRef.current));
  }, []);

  return (
    <main className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Design system contract audit</h1>
          <p className="mt-2 text-slate-300">
            Platform teams can run audits on DS usage to catch regressions across the app fleet.
          </p>
        </header>

        <div ref={rootRef} className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Sample subtree</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button data-ds="Button" className="rounded-md bg-indigo-500/25 px-4 py-2 text-sm font-semibold">
              Primary
            </button>
            <button data-ds="Button" className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold">
              Secondary
            </button>
            <button className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold">Missing data-ds</button>
            <button data-ds="Button" className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold">
              <span aria-hidden="true">🔍</span>
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-300">
            This subtree contains intentional issues: one element missing <code>data-ds</code> and one unnamed button.
          </p>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold">Findings</h2>
          <p className="mt-2 text-sm text-slate-300">
            Count: <span className="font-semibold text-slate-100">{findings.length}</span>
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {findings.length === 0 ? <li className="text-slate-400">No issues.</li> : null}
            {findings.map((f) => (
              <li key={`${f.ruleId}-${f.selector}`}>
                <span className="font-semibold text-slate-100">{f.ruleId}</span>: {f.message}{" "}
                <span className="text-slate-400">({f.selector})</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
}


"use client";

import { useMemo, useRef, useState } from "react";
import { AuditPanel } from "@/components/AuditPanel";
import { Sample } from "@/components/Sample";

export default function Page() {
  const [bad, setBad] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const title = useMemo(() => (bad ? "Bad variant (violations)" : "Good variant"), [bad]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <main className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">WCAG guidelines as concrete checks</h1>
          <p className="mt-2 text-slate-300">
            Teams scale accessibility by turning guidelines into automated checks + manual review gates.
          </p>
        </header>

        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-slate-300">Audit runs against the subtree below (not the whole page).</p>
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={bad} onChange={(e) => setBad(e.target.checked)} />
              Bad variant
            </label>
          </div>

          <div ref={rootRef} className="mt-6 rounded-lg border border-white/10 bg-black/30 p-5">
            <Sample bad={bad} />
          </div>
        </section>
      </main>

      <aside className="space-y-4">
        <AuditPanel rootRef={rootRef} />
        <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Staff-level note</h2>
          <p className="mt-2">
            Automated checks catch the “always wrong” failures (missing labels, empty buttons). WCAG still requires
            manual validation for UX quality, content, and complex interaction patterns.
          </p>
        </section>
      </aside>
    </div>
  );
}


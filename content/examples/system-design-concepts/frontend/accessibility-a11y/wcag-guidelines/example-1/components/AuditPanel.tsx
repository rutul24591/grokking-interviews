"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { runAudit, type AuditFinding } from "@/lib/audit";

export function AuditPanel({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const [findings, setFindings] = useState<AuditFinding[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setFindings(runAudit(root));
  });

  const grouped = useMemo(() => {
    const errors = findings.filter((f) => f.severity === "error");
    const warnings = findings.filter((f) => f.severity === "warn");
    return { errors, warnings };
  }, [findings]);

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-base font-semibold">Audit</h2>
      <p className="mt-2 text-sm text-slate-300">
        Errors: <span className="font-semibold text-slate-100">{grouped.errors.length}</span> · Warnings:{" "}
        <span className="font-semibold text-slate-100">{grouped.warnings.length}</span>
      </p>

      <div className="mt-4 space-y-4">
        <FindingList title="Errors" items={grouped.errors} empty="No errors." />
        <FindingList title="Warnings" items={grouped.warnings} empty="No warnings." />
      </div>
    </section>
  );
}

function FindingList({ title, items, empty }: { title: string; items: AuditFinding[]; empty: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          {items.map((f) => (
            <li key={`${f.ruleId}-${f.message}`}>
              <span className="font-semibold text-slate-100">{f.ruleId}</span>: {f.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


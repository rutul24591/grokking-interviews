"use client";
import { useEffect, useMemo, useState } from "react";

type ValidationCheck = {
  id: string;
  rule: string;
  result: "pass" | "warning" | "fail";
  impact: "metadata" | "content" | "policy";
};
type ValidationState = {
  targetContent: string;
  checks: ValidationCheck[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ValidationState | null>(null);
  async function refresh() {
    const response = await fetch("/api/validation/state");
    setState((await response.json()) as ValidationState);
  }
  async function rerun(id: string, result: ValidationCheck["result"]) {
    const response = await fetch("/api/validation/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result })
    });
    setState((await response.json()) as ValidationState);
  }
  useEffect(() => { void refresh(); }, []);
  const failing = useMemo(() => state?.checks.filter((check) => check.result === "fail").length ?? 0, [state]);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Validation</h1>
      <p className="mt-2 text-slate-300">Run metadata, content, and policy validation before publish so content quality stays consistent.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Target content</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.targetContent}</div>
            <div className="mt-3 text-slate-400">Failing checks: {failing}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.checks.map((check) => (
            <div key={check.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{check.rule}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">impact: {check.impact}</div>
                </div>
                <select value={check.result} onChange={(event) => void rerun(check.id, event.target.value as ValidationCheck["result"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  <option value="pass">pass</option>
                  <option value="warning">warning</option>
                  <option value="fail">fail</option>
                </select>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}

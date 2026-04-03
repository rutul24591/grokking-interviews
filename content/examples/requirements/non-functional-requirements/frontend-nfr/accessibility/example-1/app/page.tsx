"use client";

import { useMemo, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

type Finding = { patternId: string; rule: string; message: string };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const patterns = useMemo(
    () => [
      { id: "bad-form", label: "Bad: unlabeled input", html: "<form><input id=\"email\" /><button>Continue</button></form>" },
      { id: "good-form", label: "Good: label + explicit type", html: "<form><label for=\"email\">Email</label><input id=\"email\" /><button type=\"submit\">Continue</button></form>" },
      { id: "bad-dialog", label: "Bad: dialog missing aria", html: "<div role=\"dialog\"><h2>Title</h2><p>Body</p></div>" },
      { id: "good-dialog", label: "Good: aria labelled", html: "<div role=\"dialog\" aria-labelledby=\"t\" aria-describedby=\"d\"><h2 id=\"t\">Title</h2><p id=\"d\">Body</p></div>" },
    ],
    [],
  );

  const [findings, setFindings] = useState<Finding[]>([]);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  async function runAudit() {
    setRunning(true);
    setError("");
    try {
      const r = await json<{ report: Finding[] }>("/api/audit", {
        method: "POST",
        body: JSON.stringify({ patterns: patterns.map((p) => ({ id: p.id, html: p.html })) }),
      });
      setFindings(r.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Accessibility Gate</h1>
        <p className="mt-2 text-slate-300">
          A tiny “a11y contract” approach: represent patterns as auditable rules and enforce them consistently.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Patterns</h2>
          <button
            type="button"
            onClick={runAudit}
            disabled={running}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50"
          >
            {running ? "Auditing..." : "Run audit"}
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {patterns.map((p) => (
            <div key={p.id} className="rounded border border-slate-800 bg-black/20 p-4">
              <div className="text-sm font-semibold">{p.label}</div>
              <pre className="mt-3 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{p.html}</pre>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Findings</h2>
        <div className="mt-4 grid gap-3">
          {findings.map((f, idx) => (
            <div key={idx} className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
              <div className="font-mono text-xs text-slate-200">
                {f.patternId} • {f.rule}
              </div>
              <div className="mt-1 text-slate-100">{f.message}</div>
            </div>
          ))}
          {!findings.length ? (
            <div className="rounded border border-slate-800 bg-black/20 p-3 text-sm text-slate-300">
              Run the audit to see rule violations.
            </div>
          ) : null}
        </div>
      </section>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether accessibility is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For accessibility, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For accessibility, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For accessibility, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Accessibility</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}


"use client";

import { useEffect, useState } from "react";

type Rules = {
  minLength: number;
  requireUpper: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
  algorithm: string;
  memoryCostKb: number;
  iterationCost: number;
};

type Check = {
  longEnough: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  reused: boolean;
  entropyStrong: boolean;
  valid: boolean;
  algorithm: string;
  derivedHashPreview: string;
};

export default function Page() {
  const [rules, setRules] = useState<Rules | null>(null);
  const [password, setPassword] = useState("StrongerPass!42");
  const [check, setCheck] = useState<Check | null>(null);

  async function loadRules() {
    const response = await fetch("/api/password/rules");
    setRules((await response.json()) as Rules);
  }

  async function validate() {
    const response = await fetch("/api/password/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    setCheck((await response.json()) as Check);
  }

  useEffect(() => {
    void loadRules();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Password Policy and Hashing Workbench</h1>
      <p className="mt-2 text-slate-300">
        Evaluate password strength, inspect hash-parameter choices, and confirm the candidate is safe to persist.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[360px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-sm text-slate-300">
            <div>Algorithm: <span className="font-semibold text-slate-100">{rules?.algorithm}</span></div>
            <div className="mt-2">Memory cost: {rules?.memoryCostKb} KB</div>
            <div className="mt-1">Iterations: {rules?.iterationCost}</div>
          </div>
          <label className="mt-5 block text-sm text-slate-300">Candidate password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          />
          <button onClick={validate} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">
            Validate and derive preview
          </button>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Minimum length", check?.longEnough],
              ["Uppercase", check?.upper],
              ["Number", check?.number],
              ["Symbol", check?.symbol],
              ["Entropy", check?.entropyStrong],
              ["Not reused", check ? !check.reused : undefined]
            ].map(([label, passed]) => (
              <div key={label} className="rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
                <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
                <div className="mt-2 text-lg font-semibold text-slate-100">{passed === undefined ? "—" : passed ? "pass" : "fail"}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
            <div>Ready to store: <span className="font-semibold text-slate-100">{check?.valid ? "yes" : "no"}</span></div>
            <div className="mt-2">Hash preview: <span className="font-mono text-slate-100">{check?.derivedHashPreview}</span></div>
          </div>
        </article>
      </section>
    </main>
  );
}

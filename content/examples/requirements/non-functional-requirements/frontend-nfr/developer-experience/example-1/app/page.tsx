"use client";

import { useEffect, useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";

const presets = {
  broken: { env: "dev", publicBaseUrl: "not-a-url", apiKey: "dev_only_change_me_12345", rumSampleRate: 1.5 },
  fixed: { env: "prod", publicBaseUrl: "https://viewer.example.com", apiKey: "prod_redacted_secret", rumSampleRate: 0.1 },
};

async function validate(config: unknown) {
  const res = await fetch("/api/validate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ config }),
  });
  const body = await res.json();
  return { status: res.status, body };
}

const reviewPrompts = [
  "Does the validator show precise, actionable errors instead of generic build failures?",
  "Are secrets redacted from logs and error output before they reach a shared channel?",
  "Can a developer compare a bad preset with a production-safe preset without leaving the page?",
];

export default function Page() {
  const [configText, setConfigText] = useState(JSON.stringify(presets.broken, null, 2));
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const latest = useMemo(() => history[0] ?? null, [history]);
  const summary = useMemo(
    () => [
      {
        label: "Latest status",
        value: latest ? String(latest.status) : "Not run",
        hint: "Developer-experience tooling should shorten diagnosis time, not add another opaque layer.",
      },
      {
        label: "Captured runs",
        value: String(history.length),
        hint: "Keeping the latest runs visible makes regressions and recovery behavior easier to compare.",
      },
      {
        label: "Selected preset",
        value: configText.includes("not-a-url") ? "Broken" : "Production-safe",
        hint: "Switching between presets should immediately demonstrate what changed and why it matters.",
      },
    ],
    [configText, history.length, latest],
  );

  async function run(label = "Manual validation") {
    setError("");
    try {
      const result = await validate(JSON.parse(configText));
      setHistory((previous) => [{ label, ...result }, ...previous].slice(0, 6));
      if (result.status !== 200) {
        setError("Validation failed. Review the redacted payload and the structured findings.");
      }
    } catch (event) {
      setError(event instanceof Error ? event.message : String(event));
    }
  }

  useEffect(() => {
    run("Initial broken preset").catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Developer Experience Config Doctor</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Validate runtime configuration the same way a staff engineer would during an incident or failed rollout: by
          comparing a broken preset with a production-safe one, checking redaction behavior, and reviewing errors in a
          format that gives a clear next action.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Runtime config under review</h2>
            <p className="mt-1 text-sm text-slate-400">
              Toggle between a broken preset and a production-safe preset, then validate after editing the payload.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setConfigText(JSON.stringify(presets.broken, null, 2))}>Broken preset</button>
            <button className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700" onClick={() => setConfigText(JSON.stringify(presets.fixed, null, 2))}>Production preset</button>
            <button className="ml-auto rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={() => run()}>Validate</button>
          </div>
          <textarea rows={16} className="w-full rounded border border-slate-700 bg-black/30 px-3 py-2 font-mono text-xs" value={configText} onChange={(event) => setConfigText(event.target.value)} />
          {error ? <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">{error}</div> : null}
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">DX review prompts</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              {reviewPrompts.map((prompt) => (
                <li key={prompt}>• {prompt}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {summary.map((item) => (
              <SignalCard key={item.label} {...item} />
            ))}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Validation history</h2>
              <p className="mt-1 text-sm text-slate-400">
                A developer-facing validator should leave behind structured evidence: what failed, what was redacted,
                and whether the fix actually cleared the issue on the next run.
              </p>
            </div>
            <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(history, null, 2)}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";

async function charge(body: { customerId: string; amountUsd: number; currency: string; idempotencyKey: string }) {
  const res = await fetch("/api/payments/charge", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": body.idempotencyKey },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

const auditQuestions = [
  "Did the duplicate request replay the original response instead of creating a second charge?",
  "Did a payload mismatch on the same key return a conflict rather than mutating the original operation?",
  "Can the operator explain which request key is safe to retry after a gateway timeout?",
];

export default function Page() {
  const [form, setForm] = useState({ customerId: "c1", amountUsd: 12.5, currency: "USD", idempotencyKey: "idem-123" });
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const latest = history[0] ?? null;
  const summary = useMemo(
    () => [
      {
        label: "Last status",
        value: latest ? String(latest.result.status) : "Not run",
        hint: "Retries should converge on one durable outcome, not branch into duplicate work.",
      },
      {
        label: "Recorded attempts",
        value: String(history.length),
        hint: "Operators need to compare the original request, replay, and conflicting retry side by side.",
      },
      {
        label: "Key under test",
        value: form.idempotencyKey,
        hint: "The key needs enough cardinality to isolate one logical business action.",
      },
    ],
    [form.idempotencyKey, history.length, latest],
  );

  async function run(label: string, overrides?: Partial<typeof form>) {
    setError("");
    try {
      const payload = { ...form, ...overrides };
      const result = await charge(payload);
      setHistory((previous) => [{ label, payload, result }, ...previous].slice(0, 8));
    } catch (event) {
      setError(event instanceof Error ? event.message : String(event));
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Idempotent Payment Replay Console</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          Exercise one payment intent through first execution, clean retry, and conflicting replay. The workflow shows
          what support and backend teams actually need during an incident: the key, the original payload, and evidence
          that the second attempt reused state instead of minting a second side effect.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Charge request</h2>
            <p className="mt-1 text-sm text-slate-400">
              Use the same key for a safe replay, then reuse the key with a mutated amount to validate conflict defense.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            {Object.entries(form).map(([key, value]) => (
              <label key={key} className="space-y-1">
                <div className="text-slate-300">{key}</div>
                <input
                  className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2"
                  value={String(value)}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      [key]: key === "amountUsd" ? Number(event.target.value) : event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={() => run("Initial charge")}>Initial charge</button>
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={() => run("Replay identical key")}>Replay same key</button>
            <button className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold hover:bg-amber-500" onClick={() => run("Replay with changed amount", { amountUsd: form.amountUsd + 5 })}>Reuse key with new amount</button>
          </div>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
          <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">What to validate</div>
            <ul className="mt-3 space-y-2 text-slate-400">
              {auditQuestions.map((question) => (
                <li key={question}>• {question}</li>
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
              <h2 className="text-lg font-semibold text-white">Replay history</h2>
              <p className="mt-1 text-sm text-slate-400">
                Review each replay in order. A correct implementation preserves the original effect and surfaces any
                conflicting retry clearly enough for an operator to explain it to finance or support.
              </p>
            </div>
            <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(history, null, 2)}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}

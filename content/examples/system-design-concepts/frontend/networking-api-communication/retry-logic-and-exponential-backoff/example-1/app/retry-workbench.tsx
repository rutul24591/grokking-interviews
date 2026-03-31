"use client";

import { useState } from "react";

type Attempt = {
  number: number;
  delayMs: number;
  status: "retrying" | "succeeded";
};

export default function RetryWorkbench() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [status, setStatus] = useState("idle");

  async function runRequest() {
    setAttempts([]);
    setStatus("running");
    const requestId = crypto.randomUUID();

    for (let attempt = 1; attempt <= 4; attempt += 1) {
      const response = await fetch(`http://localhost:4420/article?requestId=${requestId}&attempt=${attempt}`, {
        cache: "no-store"
      });
      const payload = (await response.json()) as { ok: boolean; retryable: boolean; message: string };
      const delayMs = attempt === 1 ? 0 : 200 * 2 ** (attempt - 2) + attempt * 35;
      setAttempts((current) => [
        ...current,
        { number: attempt, delayMs, status: payload.ok ? "succeeded" : "retrying" }
      ]);

      if (payload.ok || !payload.retryable || attempt === 4) {
        setStatus(payload.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Retry policy</h2>
        <p className="mt-2 text-sm text-slate-600">The browser performs the retries itself, spaces them with exponential backoff, and stops as soon as the origin succeeds.</p>
        <button onClick={() => void runRequest()} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Call flaky endpoint
        </button>
        <p className="mt-4 text-sm text-slate-700">{status}</p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Attempt timeline</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {attempts.map((attempt) => (
            <li key={attempt.number} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span>Attempt {attempt.number}</span>
              <span>{attempt.delayMs} ms · {attempt.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

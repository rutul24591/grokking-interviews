"use client";

import { useState } from "react";
import { z } from "zod";

const transferSchema = z.object({
  to: z.string().min(3).max(64),
  amount: z.number().positive().max(10_000)
});

export function TransferClient({ csrfToken }: { csrfToken: string }) {
  const [to, setTo] = useState("acct_123");
  const [amount, setAmount] = useState(10);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setResult(null);
    const parsed = transferSchema.safeParse({ to, amount });
    if (!parsed.success) {
      setError(parsed.error.message);
      return;
    }
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify(parsed.data)
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? "Request rejected");
      return;
    }
    setResult(json);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-sm font-semibold">Transfer (state-changing)</h2>
      <div className="mt-3 grid gap-2">
        <label className="text-xs text-white/60">To</label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        />
        <label className="mt-2 text-xs text-white/60">Amount</label>
        <input
          value={amount}
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={submit}
          className="mt-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Submit transfer
        </button>
      </div>

      <div className="mt-3 text-xs text-white/50">
        CSRF token (SSR embedded): <code>{csrfToken.slice(0, 8)}…</code>
      </div>

      {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}
      {result ? (
        <pre className="mt-3 overflow-auto rounded bg-black/20 p-3 text-xs">{JSON.stringify(result, null, 2)}</pre>
      ) : null}
    </div>
  );
}


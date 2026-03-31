"use client";

import { useState } from "react";

type SessionPayload = {
  sessionId: string;
  redirectUrl: string;
};

export default function PaymentWorkbench() {
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState<string[]>([]);

  async function startCheckout() {
    const session = (await fetch("http://localhost:4474/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "staff-pro" })
    }).then((response) => response.json())) as SessionPayload;

    setLogs((current) => [`redirect -> ${session.redirectUrl}`, ...current].slice(0, 8));
    await fetch(`http://localhost:4474/checkout/complete/${session.sessionId}`, { method: "POST" });

    let nextStatus = "pending";
    while (nextStatus === "pending") {
      const payment = await fetch(`http://localhost:4474/checkout/status/${session.sessionId}`, { cache: "no-store" }).then((response) => response.json()) as { status: string };
      nextStatus = payment.status;
      setStatus(nextStatus);
      setLogs((current) => [`payment status -> ${payment.status}`, ...current].slice(0, 8));
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Checkout flow</h2>
        <button onClick={() => void startCheckout()} className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Start subscription checkout</button>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Current status: {status}</div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Payment log</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {logs.map((log) => <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>)}
        </ul>
      </article>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

type CheckoutState = {
  step: "cart" | "details" | "payment" | "review";
  paymentIntent: string;
  inventoryState: string;
  orderReady: boolean;
  items: { id: string; label: string; price: string }[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<CheckoutState | null>(null);

  async function refresh() {
    const response = await fetch("/api/checkout-flow/state");
    setState((await response.json()) as CheckoutState);
  }

  async function act(type: "next-step" | "create-payment-intent" | "submit-order") {
    const response = await fetch("/api/checkout-flow/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as CheckoutState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Checkout Flow Control</h1>
      <p className="mt-2 text-slate-300">Walk the order through cart, details, payment, and review while keeping payment and inventory state explicit.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3">
            <button onClick={() => void act("next-step")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Next step</button>
            <button onClick={() => void act("create-payment-intent")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Create payment intent</button>
            <button onClick={() => void act("submit-order")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Submit order</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">step: {state?.step}</div>
            <div className="rounded border border-slate-800 px-3 py-2">payment intent: {state?.paymentIntent}</div>
            <div className="rounded border border-slate-800 px-3 py-2">inventory: {state?.inventoryState}</div>
            <div className="rounded border border-slate-800 px-3 py-2">order ready: {String(state?.orderReady)}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{item.label}</div>
              <div className="mt-1 text-xs text-slate-500">{item.price}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}

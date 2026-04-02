"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  resource: string;
  status: "available" | "held" | "confirmed" | "cancelled";
  holdExpiresIn: number;
};

type BookingState = {
  summary: { available: number; held: number };
  reservations: Reservation[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<BookingState | null>(null);

  async function refresh() {
    const response = await fetch("/api/booking-workflows/state");
    setState((await response.json()) as BookingState);
  }

  async function act(type: "place-hold" | "confirm" | "cancel", value?: string) {
    const response = await fetch("/api/booking-workflows/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as BookingState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Booking Workflow Console</h1>
      <p className="mt-2 text-slate-300">Place reservation holds, confirm bookings, and cancel stale transactions with visible inventory state.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">available slots: {state?.summary.available ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">held slots: {state?.summary.held ?? 0}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.reservations.map((reservation) => (
            <div key={reservation.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{reservation.resource}</div>
                  <div className="mt-1 text-xs text-slate-500">status {reservation.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void act("place-hold", reservation.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Hold</button>
                  <button onClick={() => void act("confirm", reservation.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Confirm</button>
                  <button onClick={() => void act("cancel", reservation.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Cancel</button>
                </div>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">hold expires in: {reservation.holdExpiresIn}m</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}

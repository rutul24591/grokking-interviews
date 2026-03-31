"use client";
import { useState } from "react";
type Payload = { state: string; result: string };
export default function BreakerPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4320";
  const [events, setEvents] = useState<string[]>([]);
  async function ping() {
    const response = await fetch(`${origin}/profile`, { cache: "no-store" });
    const payload = (await response.json()) as Payload;
    setEvents((current) => [`${payload.state}: ${payload.result}`, ...current].slice(0, 6));
  }
  return <section className="mt-10 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]"><button type="button" onClick={ping} className="rounded-full bg-slate-950 px-4 py-3 text-sm text-white">Call upstream</button><div className="mt-6 space-y-3">{events.map((event) => <div key={event} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">{event}</div>)}</div></section>;
}

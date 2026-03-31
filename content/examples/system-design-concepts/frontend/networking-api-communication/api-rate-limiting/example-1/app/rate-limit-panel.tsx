"use client";
import { useState } from "react";
type Result = { allowed: boolean; remaining: number; retryAfterMs: number };
export default function RateLimitPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4300";
  const [events, setEvents] = useState<string[]>([]);
  async function burst() {
    const next: string[] = [];
    for (let index = 0; index < 8; index += 1) {
      const response = await fetch(`${origin}/search`, { cache: "no-store" });
      const payload = (await response.json()) as Result;
      next.push(payload.allowed ? `request ${index + 1}: ok (${payload.remaining} left)` : `request ${index + 1}: 429 retry in ${payload.retryAfterMs}ms`);
    }
    setEvents(next);
  }
  return (
    <section className="mt-10 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
      <button type="button" onClick={burst} className="rounded-full bg-slate-950 px-4 py-3 text-sm text-white">Run burst</button>
      <div className="mt-6 space-y-3">{events.map((event) => <div key={event} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">{event}</div>)}</div>
    </section>
  );
}

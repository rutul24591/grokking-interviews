"use client";
import { useState } from "react";
export default function StreamPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4310";
  const [chunks, setChunks] = useState<string[]>([]);
  async function readStream() {
    setChunks([]);
    const response = await fetch(`${origin}/stream`);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;
    const next: string[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      next.push(decoder.decode(value));
      setChunks([...next]);
    }
  }
  return <section className="mt-10 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]"><button type="button" onClick={readStream} className="rounded-full bg-slate-950 px-4 py-3 text-sm text-white">Read stream</button><div className="mt-6 space-y-3">{chunks.map((chunk, index) => <div key={`${index}-${chunk}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">{chunk}</div>)}</div></section>;
}

"use client";
import { useState } from "react";
type Result = { title: string; author?: string; readingTime?: number };
export default function QueryPanel() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4340";
  const [result, setResult] = useState<Result | null>(null);
  async function run(fields: string[]) {
    const response = await fetch(`${origin}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    setResult((await response.json()) as Result);
  }
  return <section className="mt-10 rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(30,41,59,0.08)]"><div className="flex gap-3"><button type="button" onClick={() => run(["title"])} className="rounded-full bg-slate-950 px-4 py-3 text-sm text-white">Title only</button><button type="button" onClick={() => run(["title","author","readingTime"])} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">Expanded query</button></div>{result ? <pre className="mt-6 overflow-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{JSON.stringify(result, null, 2)}</pre> : null}</section>;
}

"use client";

import { useState } from "react";

type Result = { ok: true; normalized: any } | { ok?: false; error: any };

export default function Page() {
  const [email, setEmail] = useState("ada@example.com");
  const [subject, setSubject] = useState("  Payment issue  ");
  const [message, setMessage] = useState("I see a failure when I click checkout.\n\nSteps:\n1) ...\n2) ...");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const [out, setOut] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setOut(null);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message, priority })
    });
    const json = (await res.json().catch(() => ({}))) as Result;
    if (!res.ok) {
      setError("Validation failed (server-side).");
      setOut(json);
      return;
    }
    setOut(json);
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Input validation &amp; sanitization</h1>
        <p className="text-sm text-white/70">The API validates and normalizes inputs. Client validation is optional UX.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3">
          <label className="text-xs text-white/60">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <label className="text-xs text-white/60">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <label className="text-xs text-white/60">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-40 resize-none rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <label className="text-xs text-white/60">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <button
            onClick={submit}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          >
            Submit (server validates)
          </button>
        </div>

        {error ? <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">{error}</div> : null}
        {out ? <pre className="mt-3 overflow-auto rounded bg-black/20 p-3 text-xs">{JSON.stringify(out, null, 2)}</pre> : null}
      </section>
    </main>
  );
}


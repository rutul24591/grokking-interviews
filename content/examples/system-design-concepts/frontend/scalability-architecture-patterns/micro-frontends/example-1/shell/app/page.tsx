"use client";

import { useMemo, useState } from "react";
import { RemoteFrame } from "@/components/RemoteFrame";

export default function Page() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const remoteUrl = useMemo(() => "http://localhost:3001/", []);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Shell (Next.js) + Remote MFE (Node)</h1>
        <p className="mt-2 text-slate-300">
          The shell embeds the remote micro-app with a versioned postMessage contract and origin checks.
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Shell controls</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            Toggle theme (send to MFE)
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Shell theme: <span className="font-semibold text-slate-100">{theme}</span>
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Embedded micro-frontend</h2>
        <RemoteFrame src={remoteUrl} theme={theme} />
      </section>
    </main>
  );
}


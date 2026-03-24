"use client";

import { useMemo, useState } from "react";
import { negotiate, type NegotiationResult } from "@/lib/negotiate";

export default function Page() {
  const [hostSupported, setHostSupported] = useState("2,1");
  const [remoteSupported, setRemoteSupported] = useState("1");

  const result: NegotiationResult = useMemo(() => {
    const host = hostSupported.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    const remote = remoteSupported.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    return negotiate(host, remote);
  }, [hostSupported, remoteSupported]);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Version negotiation + fallback</h1>
        <p className="mt-2 text-slate-300">Independent deploys mean version skew is normal; negotiate at runtime.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            Host supported versions
            <input
              value={hostSupported}
              onChange={(e) => setHostSupported(e.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
            />
          </label>
          <label className="text-sm text-slate-300">
            Remote supported versions
            <input
              value={remoteSupported}
              onChange={(e) => setRemoteSupported(e.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
            />
          </label>
        </div>

        <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
          <p>
            Negotiated version:{" "}
            <span className="font-semibold text-slate-100">{result.version ?? "none"}</span>
          </p>
          <p className="mt-2">
            Mode: <span className="font-semibold text-slate-100">{result.mode}</span>
          </p>
          <p className="mt-2 text-slate-400">{result.note}</p>
        </div>
      </section>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";

type Stolen = Array<{ ts: number; token: string }>;

export function AttackPanel() {
  const [stolen, setStolen] = useState<Stolen>([]);

  const refresh = async () => {
    const res = await fetch("/api/exfiltrate", { cache: "no-store" });
    const body = (await res.json()) as { ok: true; stolen: Stolen };
    setStolen(body.stolen);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <section className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-3">
      <h2 className="font-medium text-rose-200">Simulated attacker script (XSS impact)</h2>
      <p className="text-sm text-rose-100/90">
        If a token is stored in <code className="rounded bg-rose-900/30 px-1">localStorage</code>, any
        injected script can read it and exfiltrate it. HttpOnly cookies are not readable by JS.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-500"
          onClick={async () => {
            const token = window.localStorage.getItem("demo.token");
            if (!token) return;
            await fetch("/api/exfiltrate", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ token })
            });
            await refresh();
          }}
        >
          Exfiltrate localStorage token
        </button>
        <button
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600"
          onClick={async () => {
            await fetch("/api/exfiltrate", { method: "DELETE" });
            await refresh();
          }}
        >
          Clear stolen log
        </button>
      </div>

      <pre className="rounded-lg bg-slate-950/40 p-3 text-xs overflow-auto">
        {JSON.stringify(stolen, null, 2)}
      </pre>
    </section>
  );
}


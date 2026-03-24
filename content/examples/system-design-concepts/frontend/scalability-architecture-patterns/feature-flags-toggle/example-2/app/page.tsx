"use client";

import { useMemo, useState } from "react";
import { bucketForUser } from "@/lib/rollout";

function makeUsers(n: number) {
  return Array.from({ length: n }, (_, i) => `user_${String(i + 1).padStart(4, "0")}`);
}

export default function Page() {
  const [percent, setPercent] = useState(25);
  const users = useMemo(() => makeUsers(80), []);

  const rows = useMemo(() => {
    const p = Math.max(0, Math.min(100, percent));
    return users.map((u) => {
      const b = bucketForUser("flag.checkout", u);
      const enabled = b < p / 100;
      return { userId: u, bucket: b, enabled };
    });
  }, [percent, users]);

  const enabledCount = rows.filter((r) => r.enabled).length;

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Deterministic percentage rollout</h1>
        <p className="mt-2 text-slate-300">
          Rollout percent: <span className="font-semibold text-slate-100">{percent}%</span> · Enabled users:{" "}
          <span className="font-semibold text-slate-100">{enabledCount}</span> / {rows.length}
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <label className="text-sm font-semibold text-slate-100">
          Percent rollout
          <input
            type="range"
            min={0}
            max={100}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            className="mt-3 w-full"
          />
        </label>

        <div className="mt-6 overflow-auto rounded-lg border border-white/10 bg-black/30">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-300">
              <tr>
                <th className="px-3 py-2">userId</th>
                <th className="px-3 py-2">bucket</th>
                <th className="px-3 py-2">enabled</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.userId} className="border-b border-white/5">
                  <td className="px-3 py-2 text-slate-200">{r.userId}</td>
                  <td className="px-3 py-2 text-slate-300">{r.bucket.toFixed(6)}</td>
                  <td className="px-3 py-2">
                    <span className={r.enabled ? "font-semibold text-emerald-200" : "text-slate-400"}>
                      {String(r.enabled)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}


"use client";

import { useState } from "react";

type Estimate = {
  quota?: number;
  usage?: number;
};

export function QuotaClient() {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [status, setStatus] = useState("Inspect browser-managed quota to plan cleanup before writes fail.");

  async function inspect() {
    if (!("storage" in navigator) || !navigator.storage.estimate) return;
    const next = await navigator.storage.estimate();
    setEstimate(next);
    if ((next.quota ?? 0) > 0 && (next.usage ?? 0) / (next.quota ?? 1) > 0.8) {
      setStatus("Approaching quota pressure. Start cleanup or downgrade cached fidelity.");
      return;
    }
    setStatus("Quota headroom looks acceptable.");
  }

  return (
    <div className="space-y-4">
      <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white" onClick={() => void inspect()}>
        Inspect storage estimate
      </button>
      {estimate ? (
        <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm">
          <div>usage: {estimate.usage ?? 0}</div>
          <div>quota: {estimate.quota ?? 0}</div>
        </div>
      ) : null}
      <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm">{status}</div>
    </div>
  );
}

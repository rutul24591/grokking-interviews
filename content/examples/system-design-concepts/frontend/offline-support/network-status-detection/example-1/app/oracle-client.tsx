"use client";

import { useMemo, useState } from "react";
import { useConnectivityOracle, type HeartbeatMode } from "../lib/oracle/useConnectivityOracle";

function badgeClass(status: string) {
  if (status === "online") return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  if (status === "degraded") return "border-amber-400/30 bg-amber-500/10 text-amber-200";
  return "border-red-400/30 bg-red-500/10 text-red-200";
}

export function OracleClient() {
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState<HeartbeatMode>("ok");

  const heartbeatUrl = useMemo(() => {
    if (mode === "ok") return "/api/health?mode=ok";
    if (mode === "slow") return "/api/health?mode=slow&delayMs=1800";
    return "/api/health?mode=fail";
  }, [mode]);

  const oracle = useConnectivityOracle({
    enabled,
    heartbeatUrl,
    intervalMs: 2_000,
    timeoutMs: 1_200,
    degradedLatencyMs: 700
  });

  const info = oracle.networkInfo;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-sm ${badgeClass(oracle.status)}`}>
          status: <span className="font-semibold">{oracle.status}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-white/80">
          navigator.onLine: <span className="font-semibold">{String(oracle.browserOnline)}</span>
        </span>
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
          onClick={() => setEnabled((v) => !v)}
        >
          {enabled ? "Stop monitoring" : "Start monitoring"}
        </button>
        <button
          type="button"
          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          disabled={!enabled}
          onClick={oracle.actions.heartbeatNow}
        >
          Heartbeat now
        </button>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-white/80">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-white/70">Heartbeat mode</span>
            <select
              className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as HeartbeatMode)}
            >
              <option value="ok">ok (fast 204)</option>
              <option value="slow">slow (delay)</option>
              <option value="fail">fail (503)</option>
            </select>
          </label>
          <span className="text-white/70">
            URL: <code>{heartbeatUrl}</code>
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            last heartbeat:{" "}
            <span className="font-semibold">
              {oracle.lastHeartbeat ? oracle.lastHeartbeat.outcome : "none"}
            </span>
          </div>
          <div>
            latency:{" "}
            <span className="font-semibold">
              {oracle.lastHeartbeat?.latencyMs !== undefined ? `${oracle.lastHeartbeat.latencyMs}ms` : "n/a"}
            </span>
          </div>
          <div>
            http status:{" "}
            <span className="font-semibold">
              {oracle.lastHeartbeat?.httpStatus !== undefined ? oracle.lastHeartbeat.httpStatus : "n/a"}
            </span>
          </div>
          <div>
            updated:{" "}
            <span className="font-semibold">
              {oracle.lastHeartbeat ? new Date(oracle.lastHeartbeat.at).toLocaleTimeString() : "n/a"}
            </span>
          </div>
        </div>

        <div className="mt-4 text-white/70">
          <div className="font-semibold text-white/80">Optional Network Information API (not supported everywhere)</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>effectiveType: <span className="font-semibold">{info?.effectiveType ?? "n/a"}</span></div>
            <div>rtt: <span className="font-semibold">{info?.rttMs ?? "n/a"}</span></div>
            <div>downlinkMbps: <span className="font-semibold">{info?.downlinkMbps ?? "n/a"}</span></div>
            <div>saveData: <span className="font-semibold">{info?.saveData ?? "n/a"}</span></div>
          </div>
        </div>
      </div>

      <section className="space-y-2 text-sm text-white/80">
        <h2 className="text-base font-semibold text-white">What this demonstrates</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><code>navigator.onLine</code> is a weak signal (it can be “online” while DNS/proxy/captive portal breaks requests).</li>
          <li>Heartbeat (HEAD/GET) verifies real reachability and can classify “slow but reachable” as <span className="font-semibold">degraded</span>.</li>
          <li>Apps should gate user actions: allow reads when degraded, queue writes when offline/degraded.</li>
        </ul>
      </section>
    </div>
  );
}


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ConnectivityStatus = "online" | "degraded" | "offline";
export type HeartbeatMode = "ok" | "slow" | "fail";

type NetworkInfo = {
  effectiveType?: string;
  rttMs?: number;
  downlinkMbps?: number;
  saveData?: boolean;
};

type HeartbeatResult =
  | { outcome: "ok"; httpStatus: number; latencyMs: number; at: number }
  | { outcome: "fail"; httpStatus?: number; latencyMs?: number; at: number; reason: string };

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { method: "HEAD", cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function readNetworkInfo(): NetworkInfo | null {
  if (typeof navigator === "undefined") return null;
  const anyNav = navigator as unknown as { connection?: unknown };
  const c = anyNav.connection as
    | { effectiveType?: string; rtt?: number; downlink?: number; saveData?: boolean }
    | undefined;
  if (!c) return null;
  return {
    effectiveType: c.effectiveType,
    rttMs: typeof c.rtt === "number" ? c.rtt : undefined,
    downlinkMbps: typeof c.downlink === "number" ? c.downlink : undefined,
    saveData: c.saveData
  };
}

export function useConnectivityOracle(params: {
  enabled: boolean;
  heartbeatUrl: string;
  intervalMs: number;
  timeoutMs: number;
  degradedLatencyMs: number;
}): {
  status: ConnectivityStatus;
  browserOnline: boolean;
  lastHeartbeat: HeartbeatResult | null;
  networkInfo: NetworkInfo | null;
  actions: { heartbeatNow: () => Promise<void> };
} {
  const [browserOnline, setBrowserOnline] = useState<boolean>(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [lastHeartbeat, setLastHeartbeat] = useState<HeartbeatResult | null>(null);
  const [status, setStatus] = useState<ConnectivityStatus>(() => (browserOnline ? "degraded" : "offline"));

  const networkInfo = useMemo(() => readNetworkInfo(), []);
  const inFlightRef = useRef(false);

  const classify = useCallback(
    (bo: boolean, hb: HeartbeatResult | null): ConnectivityStatus => {
      if (!bo) return "offline";
      if (!hb) return "degraded";
      if (hb.outcome === "fail") return "degraded";
      if (hb.latencyMs >= params.degradedLatencyMs) return "degraded";
      return "online";
    },
    [params.degradedLatencyMs],
  );

  const heartbeatNow = useCallback(async () => {
    if (!params.enabled) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const started = Date.now();
    try {
      const res = await fetchWithTimeout(params.heartbeatUrl, params.timeoutMs);
      const latencyMs = Date.now() - started;
      if (!res.ok) {
        const hb: HeartbeatResult = { outcome: "fail", httpStatus: res.status, latencyMs, at: Date.now(), reason: "http-not-ok" };
        setLastHeartbeat(hb);
        setStatus(classify(browserOnline, hb));
        return;
      }
      const hb: HeartbeatResult = { outcome: "ok", httpStatus: res.status, latencyMs, at: Date.now() };
      setLastHeartbeat(hb);
      setStatus(classify(browserOnline, hb));
    } catch (e) {
      const hb: HeartbeatResult = {
        outcome: "fail",
        at: Date.now(),
        reason: e instanceof Error ? e.name : "unknown"
      };
      setLastHeartbeat(hb);
      setStatus(classify(browserOnline, hb));
    } finally {
      inFlightRef.current = false;
    }
  }, [browserOnline, classify, params.enabled, params.heartbeatUrl, params.timeoutMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = () => setBrowserOnline(true);
    const onOffline = () => setBrowserOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    setStatus(classify(browserOnline, lastHeartbeat));
  }, [browserOnline, lastHeartbeat, classify]);

  useEffect(() => {
    if (!params.enabled) return;
    void heartbeatNow();
    const id = setInterval(() => void heartbeatNow(), params.intervalMs);
    return () => clearInterval(id);
  }, [heartbeatNow, params.enabled, params.intervalMs]);

  return { status, browserOnline, lastHeartbeat, networkInfo, actions: { heartbeatNow } };
}


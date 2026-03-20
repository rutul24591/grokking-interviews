"use client";

import type { RumEvent, RumIngestEnvelope, RumEventType } from "@/lib/rum/types";
import { fnv1a32 } from "@/lib/rum/hash";

type StartRumOpts = {
  endpoint: string;
  app: string;
  version: string;
  sampleRate: number; // 0..1
};

function now() {
  return Date.now();
}

function randomId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getOrCreateSessionId() {
  const key = "rum.sid";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const sid = "s_" + randomId().slice(0, 16);
  window.localStorage.setItem(key, sid);
  return sid;
}

function shouldSample(sessionId: string, sampleRate: number) {
  if (sampleRate >= 1) return true;
  if (sampleRate <= 0) return false;
  const h = fnv1a32(sessionId);
  const bucket = (h % 10_000) / 10_000;
  return bucket < sampleRate;
}

function scrubPage(url: string) {
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    return u.pathname;
  } catch {
    return url.split("?")[0]?.split("#")[0] || "/";
  }
}

function send(endpoint: string, envelope: RumIngestEnvelope) {
  const body = JSON.stringify(envelope);
  const ok = navigator.sendBeacon?.(endpoint, new Blob([body], { type: "application/json" }));
  if (ok) return;
  void fetch(endpoint, { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
}

export function startRum(opts: StartRumOpts) {
  const sessionId = getOrCreateSessionId();
  if (!shouldSample(sessionId, opts.sampleRate)) return () => {};

  let stopped = false;
  const queue: RumEvent[] = [];

  const flush = () => {
    if (stopped || queue.length === 0) return;
    const events = queue.splice(0, queue.length);
    send(opts.endpoint, { app: opts.app, version: opts.version, events });
  };

  const enqueue = (e: Omit<RumEvent, "id" | "ts" | "sessionId" | "page"> & { type: RumEventType }) => {
    queue.push({
      id: "e_" + randomId().slice(0, 16),
      ts: now(),
      sessionId,
      page: scrubPage(window.location.href),
      ...e,
    });
    if (queue.length >= 20) flush();
  };

  const onError = (ev: ErrorEvent) => enqueue({ type: "error", name: ev.error?.name || "error", value: 1, unit: "count", tags: { message: String(ev.message || "unknown") } });
  const onRejection = (ev: PromiseRejectionEvent) => enqueue({ type: "error", name: "unhandledrejection", value: 1, unit: "count", tags: { reason: String(ev.reason || "unknown") } });
  const onCustom = (ev: Event) => {
    const detail = (ev as CustomEvent).detail as { name?: string; value?: number } | undefined;
    enqueue({ type: "custom", name: detail?.name || "custom", value: detail?.value ?? 1, unit: "count" });
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  window.addEventListener("rum:custom", onCustom as EventListener);

  const observers: PerformanceObserver[] = [];

  const observe = (type: string, cb: (entries: PerformanceEntry[]) => void) => {
    try {
      const obs = new PerformanceObserver((list) => cb(list.getEntries()));
      obs.observe({ type, buffered: true } as never);
      observers.push(obs);
    } catch {
      // some entry types unsupported in some browsers
    }
  };

  observe("paint", (entries) => {
    for (const e of entries) {
      if (e.name === "first-contentful-paint") enqueue({ type: "web_vital", name: "fcp", value: e.startTime, unit: "ms" });
    }
  });

  observe("largest-contentful-paint", (entries) => {
    const last = entries[entries.length - 1] as PerformanceEntry | undefined;
    if (last) enqueue({ type: "web_vital", name: "lcp", value: last.startTime, unit: "ms" });
  });

  observe("layout-shift", (entries) => {
    let cls = 0;
    for (const e of entries as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
      if (!e.hadRecentInput) cls += e.value;
    }
    if (cls > 0) enqueue({ type: "web_vital", name: "cls", value: cls, unit: "score" });
  });

  const onVis = () => {
    if (document.visibilityState === "hidden") flush();
  };
  document.addEventListener("visibilitychange", onVis);

  const timer = window.setInterval(flush, 2000);

  return () => {
    stopped = true;
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    window.removeEventListener("rum:custom", onCustom as EventListener);
    for (const obs of observers) obs.disconnect();
    flush();
  };
}


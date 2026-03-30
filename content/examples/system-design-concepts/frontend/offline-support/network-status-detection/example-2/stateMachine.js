export function initialState() {
  return {
    browserOnline: true,
    status: "degraded",
    lastHeartbeat: null
  };
}

function classify(browserOnline, lastHeartbeat, degradedLatencyMs) {
  if (!browserOnline) return "offline";
  if (!lastHeartbeat) return "degraded";
  if (lastHeartbeat.outcome === "fail") return "degraded";
  if (lastHeartbeat.latencyMs >= degradedLatencyMs) return "degraded";
  return "online";
}

/**
 * Events:
 * - { type: "BROWSER_ONLINE" | "BROWSER_OFFLINE" }
 * - { type: "HEARTBEAT_OK", latencyMs: number, httpStatus?: number }
 * - { type: "HEARTBEAT_FAIL", reason: string, httpStatus?: number }
 */
export function nextState(prev, event, params = { degradedLatencyMs: 700 }) {
  const s = { ...prev };

  if (event.type === "BROWSER_ONLINE") s.browserOnline = true;
  if (event.type === "BROWSER_OFFLINE") s.browserOnline = false;
  if (event.type === "HEARTBEAT_OK") {
    s.lastHeartbeat = { outcome: "ok", latencyMs: event.latencyMs, httpStatus: event.httpStatus ?? 204 };
  }
  if (event.type === "HEARTBEAT_FAIL") {
    s.lastHeartbeat = { outcome: "fail", reason: event.reason, httpStatus: event.httpStatus };
  }

  s.status = classify(s.browserOnline, s.lastHeartbeat, params.degradedLatencyMs);
  return s;
}


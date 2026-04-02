import { randomUUID } from "node:crypto";

export type Severity = "low" | "medium" | "high" | "critical";

export type Alert = {
  id: string;
  fingerprint: string;
  severity: Severity;
  summary: string;
  source: string;
  createdAt: string;
};

export type IncidentStatus = "open" | "acked" | "resolved";

export type IncidentEvent = {
  ts: string;
  type: "created" | "alert_attached" | "acked" | "resolved" | "escalated";
  message: string;
};

export type Incident = {
  id: string;
  fingerprint: string;
  severity: Severity;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  alerts: Alert[];
  events: IncidentEvent[];
};

type Store = {
  incidents: Map<string, Incident>;
  lastByFingerprint: Map<string, { incidentId: string; lastAt: number }>;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__INC_STORE__ as Store | undefined) ?? {
    incidents: new Map(),
    lastByFingerprint: new Map(),
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__INC_STORE__ = store;

const DEDUP_WINDOW_MS = 10 * 60 * 1000;

function severityRank(s: Severity): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[s];
}

export function ingestAlert(params: {
  fingerprint: string;
  severity: Severity;
  summary: string;
  source: string;
}): { alert: Alert; incident: Incident; deduped: boolean } {
  const now = Date.now();
  const alert: Alert = {
    id: randomUUID(),
    fingerprint: params.fingerprint,
    severity: params.severity,
    summary: params.summary,
    source: params.source,
    createdAt: new Date().toISOString(),
  };

  const existing = store.lastByFingerprint.get(params.fingerprint);
  const withinWindow = existing && now - existing.lastAt <= DEDUP_WINDOW_MS;
  const incident =
    withinWindow && existing
      ? store.incidents.get(existing.incidentId)!
      : createIncident(params.fingerprint, params.severity);

  incident.alerts.push(alert);
  incident.updatedAt = new Date().toISOString();
  incident.events.push({
    ts: new Date().toISOString(),
    type: withinWindow ? "alert_attached" : "created",
    message: withinWindow ? `Alert attached (${alert.severity})` : `Incident created (${incident.severity})`,
  });

  // severity can only go up
  if (severityRank(alert.severity) > severityRank(incident.severity)) {
    incident.severity = alert.severity;
    incident.events.push({
      ts: new Date().toISOString(),
      type: "alert_attached",
      message: `Severity raised to ${incident.severity}`,
    });
  }

  store.lastByFingerprint.set(params.fingerprint, { incidentId: incident.id, lastAt: now });
  return { alert, incident, deduped: Boolean(withinWindow) };
}

function createIncident(fingerprint: string, severity: Severity): Incident {
  const inc: Incident = {
    id: randomUUID(),
    fingerprint,
    severity,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    alerts: [],
    events: [],
  };
  store.incidents.set(inc.id, inc);
  return inc;
}

export function listIncidents(): Incident[] {
  applyEscalation();
  return [...store.incidents.values()]
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function ack(id: string) {
  const inc = store.incidents.get(id);
  if (!inc) return;
  if (inc.status === "resolved") return;
  inc.status = "acked";
  inc.updatedAt = new Date().toISOString();
  inc.events.push({ ts: inc.updatedAt, type: "acked", message: "Incident acked" });
}

export function resolve(id: string) {
  const inc = store.incidents.get(id);
  if (!inc) return;
  inc.status = "resolved";
  inc.updatedAt = new Date().toISOString();
  inc.events.push({ ts: inc.updatedAt, type: "resolved", message: "Incident resolved" });
}

export function reset() {
  store.incidents.clear();
  store.lastByFingerprint.clear();
}

function applyEscalation() {
  const now = Date.now();
  for (const inc of store.incidents.values()) {
    if (inc.status === "resolved") continue;
    if (inc.severity !== "critical") continue;
    const ageMs = now - new Date(inc.createdAt).getTime();
    const already = inc.events.some((e) => e.type === "escalated");
    if (!already && inc.status !== "acked" && ageMs > 30_000) {
      inc.events.push({
        ts: new Date().toISOString(),
        type: "escalated",
        message: "Escalation triggered (not acked within 30s)",
      });
      inc.updatedAt = new Date().toISOString();
    }
  }
}


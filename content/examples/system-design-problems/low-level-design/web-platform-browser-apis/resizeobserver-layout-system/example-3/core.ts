export interface ResizeobserverLayoutSystemTelemetryEvent {
  operationId: string;
  api: "resizeobserver-layout-system";
  outcome: "accepted" | "fallback" | "error" | "cancelled";
  durationMs: number;
  reason?: string;
  sensitivePayloadCaptured: boolean;
}

export class ResizeobserverLayoutSystemTelemetry {
  private events: ResizeobserverLayoutSystemTelemetryEvent[] = [];

  record(event: ResizeobserverLayoutSystemTelemetryEvent): void {
    if (event.sensitivePayloadCaptured) {
      this.events.push({ ...event, outcome: "error", reason: "privacy-violation-blocked", sensitivePayloadCaptured: false });
      return;
    }
    this.events.push(event);
    if (this.events.length > 100) this.events.shift();
  }

  summary() {
    return this.events.reduce<Record<string, number>>((acc, event) => {
      const key = event.reason ? `${event.outcome}:${event.reason}` : event.outcome;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }

  slowOperations(thresholdMs: number): string[] {
    return this.events.filter((event) => event.durationMs > thresholdMs).map((event) => event.operationId);
  }

  fallbackRate(): number {
    if (this.events.length === 0) return 0;
    return this.events.filter((event) => event.outcome === "fallback").length / this.events.length;
  }
}

export function runResizeobserverLayoutSystemTelemetryScenario() {
  const telemetry = new ResizeobserverLayoutSystemTelemetry();
  telemetry.record({ operationId: "op-1", api: "resizeobserver-layout-system", outcome: "accepted", durationMs: 18, sensitivePayloadCaptured: false });
  telemetry.record({ operationId: "op-2", api: "resizeobserver-layout-system", outcome: "fallback", reason: "permission-denied", durationMs: 4, sensitivePayloadCaptured: false });
  telemetry.record({ operationId: "op-3", api: "resizeobserver-layout-system", outcome: "accepted", durationMs: 90, sensitivePayloadCaptured: true });
  return { summary: telemetry.summary(), slow: telemetry.slowOperations(50), fallbackRate: telemetry.fallbackRate() };
}

export function buildResizeobserverLayoutSystemIncidentReport(events: ResizeobserverLayoutSystemTelemetryEvent[]): string[] {
  return events.map((event) => {
    const safeReason = event.reason ?? "none";
    const privacy = event.sensitivePayloadCaptured ? "privacy-risk" : "privacy-safe";
    return `${event.api}:${event.operationId}:${event.outcome}:${safeReason}:${privacy}`;
  });
}

export function chooseResizeobserverLayoutSystemAlertLevel(fallbackRate: number, slowCount: number): "normal" | "watch" | "page" {
  if (fallbackRate > 0.5 || slowCount > 20) return "page";
  if (fallbackRate > 0.2 || slowCount > 5) return "watch";
  return "normal";
}

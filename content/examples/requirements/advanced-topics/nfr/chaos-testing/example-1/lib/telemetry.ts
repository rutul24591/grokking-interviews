import { RollingWindow, type TargetEvent } from "@/lib/metrics";

type TelemetryState = {
  window: RollingWindow;
};

declare global {
  // eslint-disable-next-line no-var
  var __chaosLabTelemetry: TelemetryState | undefined;
}

function createState(): TelemetryState {
  return {
    window: new RollingWindow(800),
  };
}

function getState(): TelemetryState {
  if (!globalThis.__chaosLabTelemetry) globalThis.__chaosLabTelemetry = createState();
  return globalThis.__chaosLabTelemetry;
}

export function recordTargetEvent(event: TargetEvent) {
  getState().window.push(event);
}

export function getRollingMetrics() {
  return getState().window;
}


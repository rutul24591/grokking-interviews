export type GlobalIncident = {
  id: string;
  channel: "window.onerror" | "unhandledrejection";
  message: string;
  acknowledged: boolean;
  severity: "warning" | "error" | "fatal";
  duplicateCount: number;
};
export const globalHandlerState = {
  incidents: [
    {
      id: "g1",
      channel: "window.onerror" as const,
      message: "Widget render failed",
      acknowledged: false,
      severity: "error" as const,
      duplicateCount: 1
    },
    {
      id: "g2",
      channel: "unhandledrejection" as const,
      message: "Metrics fetch rejected",
      acknowledged: true,
      severity: "warning" as const,
      duplicateCount: 2
    }
  ],
  escalationMode: "capture-and-toast",
  onCallTarget: "frontend-platform",
  lastMessage: "Global handlers catch uncaught exceptions and promise rejections that escape local boundaries."
};

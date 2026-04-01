export type ScheduledEntry = {
  id: string;
  title: string;
  scheduledFor: string;
  timezone: string;
  readiness: "ready" | "blocked" | "warning";
};
export const schedulingState = {
  releaseWindow: "weekday-morning",
  entries: [
    { id: "s1", title: "Streaming SSR", scheduledFor: "2026-04-02T09:00:00+05:30", timezone: "Asia/Kolkata", readiness: "ready" as const },
    { id: "s2", title: "B Trees", scheduledFor: "2026-04-02T18:00:00-07:00", timezone: "America/Los_Angeles", readiness: "warning" as const },
    { id: "s3", title: "OAuth Providers", scheduledFor: "2026-04-03T11:00:00+01:00", timezone: "Europe/London", readiness: "blocked" as const }
  ],
  lastMessage: "Scheduling UIs need explicit release time, timezone, and readiness visibility so authors do not publish incomplete content accidentally."
};

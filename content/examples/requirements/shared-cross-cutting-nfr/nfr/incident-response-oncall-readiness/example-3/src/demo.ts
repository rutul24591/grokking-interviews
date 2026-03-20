import { toMarkdown } from "./postmortem";

console.log(
  toMarkdown({
    id: "inc-123",
    title: "API 5xx spike",
    startedAt: "2026-03-20T10:00:00Z",
    resolvedAt: "2026-03-20T10:35:00Z",
    impact: "3% requests failed for 35m",
    timeline: [
      { ts: "10:00", note: "Alert fired" },
      { ts: "10:05", note: "On-call acked" },
      { ts: "10:12", note: "Rollback initiated" },
      { ts: "10:35", note: "Recovered" },
    ],
  }),
);


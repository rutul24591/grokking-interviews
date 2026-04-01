export type ClientError = { id: string; surface: string; severity: "warning" | "error"; fingerprint: string; count: number };
export const reportingState = {
  environment: "production",
  release: "2026.04.01",
  events: [
    { id: "e1", surface: "search-bar", severity: "error" as const, fingerprint: "search-bar-empty-state", count: 12 },
    { id: "e2", surface: "recommendations", severity: "warning" as const, fingerprint: "rail-timeout", count: 6 }
  ],
  lastMessage: "Client exceptions are grouped by fingerprint before being shipped to the reporting pipeline."
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  sourceIp: string;
  result: "success" | "failure";
  timestamp: string;
};

export const events: AuditEvent[] = [
  { id: "evt-1", actor: "owner@example.com", action: "login", sourceIp: "203.0.113.4", result: "success", timestamp: "2026-04-01T08:00:00Z" },
  { id: "evt-2", actor: "owner@example.com", action: "mfa_challenge", sourceIp: "203.0.113.4", result: "success", timestamp: "2026-04-01T08:00:12Z" },
  { id: "evt-3", actor: "owner@example.com", action: "session_revoked", sourceIp: "198.51.100.7", result: "success", timestamp: "2026-04-01T10:20:00Z" },
];

export type AuditEvent = {
  actor: string;
  action: string;
  severity: "low" | "medium" | "high";
  redacted: boolean;
};

export const auditEvents: AuditEvent[] = [
  { actor: "avery", action: "login.success", severity: "low", redacted: false },
  { actor: "security-bot", action: "mfa.challenge.failed", severity: "medium", redacted: true }
];

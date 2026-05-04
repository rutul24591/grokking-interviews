export type Session = {
  sessionId: string;
  userId: string;
  issuedAt: number;
  impersonating?: { adminId: string; targetUserId: string; reason: string };
};

export type AuditEvent = {
  id: string;
  kind: "impersonation_start" | "impersonation_end";
  at: number;
  adminId: string;
  targetUserId: string;
  reason?: string;
};

export function startImpersonation(args: {
  session: Session;
  adminId: string;
  targetUserId: string;
  reason: string;
}) {
  const next: Session = {
    ...args.session,
    impersonating: { adminId: args.adminId, targetUserId: args.targetUserId, reason: args.reason },
    userId: args.targetUserId,
  };
  const audit: AuditEvent = {
    id: `audit:${Date.now()}`,
    kind: "impersonation_start",
    at: Date.now(),
    adminId: args.adminId,
    targetUserId: args.targetUserId,
    reason: args.reason,
  };
  return { session: next, audit };
}

export function stopImpersonation(session: Session) {
  const imp = session.impersonating;
  if (!imp) return { session, audit: null as AuditEvent | null };
  const next: Session = { ...session, userId: imp.adminId, impersonating: undefined };
  const audit: AuditEvent = {
    id: `audit:${Date.now()}`,
    kind: "impersonation_end",
    at: Date.now(),
    adminId: imp.adminId,
    targetUserId: imp.targetUserId,
  };
  return { session: next, audit };
}

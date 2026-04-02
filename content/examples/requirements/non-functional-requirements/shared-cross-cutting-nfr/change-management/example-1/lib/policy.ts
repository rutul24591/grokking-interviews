export type Risk = "low" | "medium" | "high" | "critical";

export function requiredApprovals(risk: Risk): number {
  if (risk === "low") return 1;
  if (risk === "medium") return 1;
  if (risk === "high") return 2;
  return 2;
}

export function canExecute(params: {
  freezeEnabled: boolean;
  emergency: boolean;
  approvals: number;
  risk: Risk;
}) {
  if (params.freezeEnabled && !params.emergency) {
    return { ok: false, reason: "freeze_window" as const };
  }
  const req = requiredApprovals(params.risk);
  if (params.approvals < req) return { ok: false, reason: "insufficient_approvals" as const, required: req };
  return { ok: true as const };
}


export type SloReport = {
  rollingBudget: { remainingPct: number; consumedPct: number; total: number; bad: number };
  alerts: {
    fast?: { firing: boolean };
    slow?: { firing: boolean };
    releaseFreeze?: boolean;
  };
};

export type GateDecision =
  | { allowed: true; reasons: string[] }
  | { allowed: false; reasons: string[]; remediation: string[] };

export function decideRelease(params: {
  report: SloReport;
  minRemainingPct: number;
  requireTraffic: boolean;
}): GateDecision {
  const { report, minRemainingPct, requireTraffic } = params;
  const reasons: string[] = [];
  const remediation: string[] = [];

  if (requireTraffic && report.rollingBudget.total === 0) {
    reasons.push("no_traffic");
    remediation.push("Run synthetic checks / canaries to establish steady state before risky changes.");
    return { allowed: false, reasons, remediation };
  }

  if (report.alerts.fast?.firing || report.alerts.slow?.firing || report.alerts.releaseFreeze) {
    reasons.push("burn_rate_alert_firing");
    remediation.push("Stabilize service (mitigate incident, rollback, scale) before releasing.");
  }

  if (report.rollingBudget.remainingPct < minRemainingPct) {
    reasons.push("low_error_budget_remaining");
    remediation.push("Pause launches; prioritize reliability work until budget recovers.");
  }

  if (reasons.length > 0) return { allowed: false, reasons, remediation };
  return { allowed: true, reasons: ["within_budget_and_no_active_burn_alerts"] };
}


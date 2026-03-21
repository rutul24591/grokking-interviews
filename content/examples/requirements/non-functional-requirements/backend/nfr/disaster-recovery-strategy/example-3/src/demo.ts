type Tier = "backup_restore" | "warm_standby" | "active_active";

function recommendTier(rtoMinutes: number, rpoMinutes: number): { tier: Tier; rationale: string } {
  if (rtoMinutes <= 5 && rpoMinutes <= 1) {
    return { tier: "active_active", rationale: "tight RTO/RPO requires redundancy and automation" };
  }
  if (rtoMinutes <= 30 && rpoMinutes <= 15) {
    return { tier: "warm_standby", rationale: "moderate targets benefit from pre-provisioned standby capacity" };
  }
  return { tier: "backup_restore", rationale: "looser targets can rely on backups with restore runbooks" };
}

console.log(JSON.stringify({ targets: { rtoMinutes: 25, rpoMinutes: 10 }, rec: recommendTier(25, 10) }, null, 2));


type RecoveryPlan = { system: string; rtoMinutes: number; rpoMinutes: number; standby: 'none' | 'warm' | 'hot' };

function evaluateDrPlan(plan: RecoveryPlan) {
  const viable = plan.rtoMinutes <= 15 && plan.rpoMinutes <= 5 && plan.standby !== 'none';
  return {
    system: plan.system,
    viable,
    action: viable ? 'exercise-quarterly' : 'upgrade-replication-and-standby',
  };
}

const results = [
  { system: 'orders', rtoMinutes: 10, rpoMinutes: 2, standby: 'hot' },
  { system: 'analytics', rtoMinutes: 45, rpoMinutes: 30, standby: 'warm' },
].map(evaluateDrPlan);

console.table(results);
if (results[1].viable) throw new Error('Analytics plan should not meet strict DR target');

type Rollout = { cohortPct: number; errorsPerMinute: number; conversionDropPct: number };

function assessRollout(rollout: Rollout) {
  const rollback = rollout.errorsPerMinute > 20 || rollout.conversionDropPct > 5;
  return {
    cohortPct: rollout.cohortPct,
    rollback,
    action: rollback ? 'freeze-and-rollback' : 'continue-ramp',
  };
}

const results = [
  { cohortPct: 10, errorsPerMinute: 2, conversionDropPct: 0.8 },
  { cohortPct: 50, errorsPerMinute: 28, conversionDropPct: 6.4 },
].map(assessRollout);

console.table(results);
if (results[1].action !== 'freeze-and-rollback') throw new Error('Bad rollout should be rolled back');

type Change = { title: string; risk: 'low' | 'medium' | 'high'; approvals: number; freezeEnabled: boolean };

function assessChangeGate(change: Change) {
  const blocked = change.freezeEnabled || (change.risk === 'high' && change.approvals < 2);
  return {
    title: change.title,
    blocked,
    action: blocked ? 'hold-change' : 'allow-deployment',
  };
}

const results = [
  { title: 'copy update', risk: 'low', approvals: 1, freezeEnabled: false },
  { title: 'pricing engine', risk: 'high', approvals: 1, freezeEnabled: false },
].map(assessChangeGate);

console.table(results);
if (results[1].action !== 'hold-change') throw new Error('High-risk single-approval change should be held');

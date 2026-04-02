type Incident = { severity: 1 | 2 | 3; customerImpact: 'none' | 'partial' | 'broad'; runbookExists: boolean; primaryAckMinutes: number };

function assessOncallReadiness(incident: Incident) {
  const pageManager = incident.severity === 1 || incident.customerImpact === 'broad' || !incident.runbookExists;
  return {
    severity: incident.severity,
    ready: incident.primaryAckMinutes <= 5 && incident.runbookExists,
    escalation: pageManager ? 'page-incident-commander' : 'handle-with-primary',
  };
}

const scenarios = [
  { severity: 1, customerImpact: 'broad', runbookExists: true, primaryAckMinutes: 3 },
  { severity: 2, customerImpact: 'partial', runbookExists: false, primaryAckMinutes: 4 },
  { severity: 3, customerImpact: 'none', runbookExists: true, primaryAckMinutes: 8 },
].map(assessOncallReadiness);

console.table(scenarios);
if (scenarios[1].escalation !== 'page-incident-commander') throw new Error('Missing runbook should escalate');

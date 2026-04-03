type ScriptIncident = { name: string; integrityMissing: boolean; longTaskMs: number; consentGranted: boolean };

function classifyThirdPartyRisk(input: ScriptIncident) {
  const risky = input.integrityMissing || input.longTaskMs > 200 || !input.consentGranted;
  return {
    script: input.name,
    risky,
    action: risky ? 'quarantine-or-lazy-load' : 'allow-standard-load',
  };
}

const results = [
  { name: 'analytics', integrityMissing: false, longTaskMs: 90, consentGranted: true },
  { name: 'ad-network', integrityMissing: true, longTaskMs: 260, consentGranted: false },
].map(classifyThirdPartyRisk);

console.table(results);
if (results[1].action !== 'quarantine-or-lazy-load') throw new Error('Risky script should be quarantined');

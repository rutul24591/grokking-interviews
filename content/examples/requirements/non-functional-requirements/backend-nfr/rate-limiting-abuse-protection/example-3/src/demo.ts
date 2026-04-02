type Request = { actor: string; ipRotations: number; tokenRotations: number; requestsPerMinute: number };

function detectLimiterBypass(input: Request) {
  const suspicious = input.requestsPerMinute > 120 && (input.ipRotations > 3 || input.tokenRotations > 2);
  return {
    actor: input.actor,
    suspicious,
    mitigation: suspicious ? 'promote-to-device-fingerprint-limit' : 'keep-standard-limit',
  };
}

const results = [
  { actor: 'normal-user', ipRotations: 0, tokenRotations: 0, requestsPerMinute: 40 },
  { actor: 'botnet', ipRotations: 8, tokenRotations: 4, requestsPerMinute: 300 },
].map(detectLimiterBypass);

console.table(results);
if (!results[1].suspicious) throw new Error('Expected botnet traffic to be flagged');

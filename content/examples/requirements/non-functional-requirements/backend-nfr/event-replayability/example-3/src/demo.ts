type ReplayCase = { consumer: string; replayFrom: number; latestOffset: number; sideEffecting: boolean };

function assessReplayGuard(caseInfo: ReplayCase) {
  const fullReplay = caseInfo.replayFrom === 0;
  return {
    consumer: caseInfo.consumer,
    fullReplay,
    mitigation: fullReplay && caseInfo.sideEffecting ? 'disable-side-effects-and-rebuild-projection' : 'safe-to-replay',
  };
}

const results = [
  { consumer: 'analytics', replayFrom: 0, latestOffset: 1200, sideEffecting: false },
  { consumer: 'billing-webhook', replayFrom: 0, latestOffset: 1200, sideEffecting: true },
].map(assessReplayGuard);

console.table(results);
if (results[1].mitigation !== 'disable-side-effects-and-rebuild-projection') throw new Error('Billing replay should disable side effects');

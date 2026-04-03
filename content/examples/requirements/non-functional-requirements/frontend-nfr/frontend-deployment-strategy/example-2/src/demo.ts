type Deployment = { commit: string; previewHealthy: boolean; assetMismatch: boolean; rollbackReady: boolean };

function decidePromotion(input: Deployment) {
  const promotable = input.previewHealthy && !input.assetMismatch && input.rollbackReady;
  return {
    commit: input.commit,
    promotable,
    action: promotable ? 'promote-to-production' : 'hold-and-investigate',
  };
}

const results = [
  { commit: 'abc123', previewHealthy: true, assetMismatch: false, rollbackReady: true },
  { commit: 'def456', previewHealthy: true, assetMismatch: true, rollbackReady: true },
].map(decidePromotion);

console.table(results);
if (results[1].action !== 'hold-and-investigate') throw new Error('Asset mismatch should block promotion');

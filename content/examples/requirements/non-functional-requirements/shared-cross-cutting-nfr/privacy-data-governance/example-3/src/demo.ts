type Request = { type: 'delete' | 'export'; identityVerified: boolean; legalHold: boolean; datasetCount: number };

function decideRequestHandling(request: Request) {
  const blocked = !request.identityVerified || (request.type === 'delete' && request.legalHold);
  return {
    type: request.type,
    blocked,
    action: blocked ? 'hold-and-manual-review' : request.datasetCount > 20 ? 'queue-batched-fulfillment' : 'fulfill-directly',
  };
}

const results = [
  { type: 'export', identityVerified: true, legalHold: false, datasetCount: 8 },
  { type: 'delete', identityVerified: true, legalHold: true, datasetCount: 12 },
].map(decideRequestHandling);

console.table(results);
if (results[1].action !== 'hold-and-manual-review') throw new Error('Delete under legal hold should be reviewed');

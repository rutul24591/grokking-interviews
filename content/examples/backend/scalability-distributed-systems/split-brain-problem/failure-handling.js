// Reject writes from stale leader
if (token < currentToken) throw new Error('stale_leader');

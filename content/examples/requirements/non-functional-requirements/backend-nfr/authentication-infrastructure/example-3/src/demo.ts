type IntrospectionCache = { token: string; revoked: boolean; cachedAllow: boolean; ttlSec: number };

function detectStaleAuthDecision(entry: IntrospectionCache) {
  return {
    token: entry.token,
    staleAllow: entry.revoked && entry.cachedAllow && entry.ttlSec > 0,
    mitigation: entry.revoked ? 'purge-cache-and-recheck' : 'keep-cached-decision',
  };
}

const results = [
  { token: 'tok-a', revoked: false, cachedAllow: true, ttlSec: 30 },
  { token: 'tok-b', revoked: true, cachedAllow: true, ttlSec: 120 },
].map(detectStaleAuthDecision);

console.table(results);
if (!results[1].staleAllow) throw new Error('Revoked token should be treated as stale allow');

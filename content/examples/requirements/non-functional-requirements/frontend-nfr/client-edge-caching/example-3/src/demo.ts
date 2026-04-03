type CacheResponse = { etagMatches: boolean; ttlExpired: boolean; versionChanged: boolean };

function chooseRefreshStrategy(input: CacheResponse) {
  const stale = input.ttlExpired || input.versionChanged;
  return {
    stale,
    action: input.etagMatches && !stale ? 'serve-from-edge' : stale ? 'revalidate-with-origin' : 'conditional-hit',
  };
}

const results = [
  { etagMatches: true, ttlExpired: false, versionChanged: false },
  { etagMatches: true, ttlExpired: true, versionChanged: true },
].map(chooseRefreshStrategy);

console.table(results);
if (results[1].action !== 'revalidate-with-origin') throw new Error('Expired changed asset should revalidate');

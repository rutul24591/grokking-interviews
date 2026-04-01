function stalePageCache(cachedVersion, liveVersion, cacheAgeMinutes) {
  return {
    stale: cachedVersion < liveVersion || cacheAgeMinutes > 30,
    action: cachedVersion < liveVersion || cacheAgeMinutes > 30 ? "invalidate-cache" : "serve-cache"
  };
}

console.log(stalePageCache(4, 6, 45));

const unboundedKeys = Array.from({ length: 5 }, (_, index) => `user:${index}`);
console.log({ keysTracked: unboundedKeys.length, risk: 'unbounded growth without eviction' });

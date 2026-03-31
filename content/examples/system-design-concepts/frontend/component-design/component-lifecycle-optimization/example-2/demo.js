function cleanupBalance(mounts, cleanups) {
  return { balanced: mounts === cleanups, leakedSubscriptions: Math.max(0, mounts - cleanups) };
}

console.log(cleanupBalance(4, 4));
console.log(cleanupBalance(4, 2));

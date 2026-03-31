function normalizeHash(hash) {
  const safeHash = hash && hash !== "#" ? hash : "#overview";
  return {
    hash: safeHash,
    requiresScrollRestore: safeHash !== "#overview",
    analyticsKey: safeHash.replace("#", "")
  };
}

console.log(normalizeHash("#"));

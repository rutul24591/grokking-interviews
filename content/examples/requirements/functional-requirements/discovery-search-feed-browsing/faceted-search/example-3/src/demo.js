function zeroResultRecovery(results) {
  return results.length === 0 ? "suggest-clear-one-filter" : "keep-current-facets";
}

console.log(zeroResultRecovery([]));
console.log(zeroResultRecovery(["r1"]));

function evaluateUserBlockingEffects(pairs) {
  return pairs.map((entry) => ({
    pairId: entry.pairId,
    enforceBlock: entry.activeBlock && !entry.blockExpired,
    suppressMutualSurface: entry.sharedThread || entry.followRelationship,
    needsGraphRepair: entry.cachedSuggestionVisible || entry.searchLeak
  }));
}

console.log(JSON.stringify(evaluateUserBlockingEffects([
  {
    "pairId": "pair-1",
    "activeBlock": true,
    "blockExpired": false,
    "sharedThread": true,
    "followRelationship": true,
    "cachedSuggestionVisible": true,
    "searchLeak": false
  },
  {
    "pairId": "pair-2",
    "activeBlock": true,
    "blockExpired": false,
    "sharedThread": false,
    "followRelationship": false,
    "cachedSuggestionVisible": false,
    "searchLeak": true
  },
  {
    "pairId": "pair-3",
    "activeBlock": false,
    "blockExpired": true,
    "sharedThread": true,
    "followRelationship": false,
    "cachedSuggestionVisible": false,
    "searchLeak": false
  }
]), null, 2));

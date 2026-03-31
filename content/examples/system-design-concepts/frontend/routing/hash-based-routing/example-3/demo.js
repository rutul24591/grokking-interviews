function shouldTrack(previousHash, nextHash, manuallyInstrumented) {
  return {
    changed: previousHash !== nextHash,
    emitPageview: previousHash !== nextHash && manuallyInstrumented,
    analyticsGap: previousHash !== nextHash && !manuallyInstrumented
  };
}

console.log(shouldTrack("#overview", "#tradeoffs", false));
console.log(shouldTrack("#overview", "#tradeoffs", true));

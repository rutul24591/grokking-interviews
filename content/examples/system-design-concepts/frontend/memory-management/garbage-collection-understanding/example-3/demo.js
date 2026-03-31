function closureRetained({ callbackRegistered, capturesLargeState }) {
  return callbackRegistered && capturesLargeState;
}

console.log(closureRetained({ callbackRegistered: true, capturesLargeState: true }));
console.log(closureRetained({ callbackRegistered: false, capturesLargeState: true }));

function revokeList(active, target) {
  return active.map((session) => (session === target ? { session, revoked: true } : { session, revoked: false }));
}

console.log(revokeList(["a", "b", "c"], "b"));

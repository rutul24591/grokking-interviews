function resetTokenLifecycle({ issuedMinutesAgo, ttlMinutes, used }) {
  return {
    valid: issuedMinutesAgo <= ttlMinutes && !used,
    expired: issuedMinutesAgo > ttlMinutes,
    replayBlocked: used
  };
}

console.log(resetTokenLifecycle({ issuedMinutesAgo: 8, ttlMinutes: 15, used: false }));
console.log(resetTokenLifecycle({ issuedMinutesAgo: 18, ttlMinutes: 15, used: false }));

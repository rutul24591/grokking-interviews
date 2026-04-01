function validateToken({ issuedAt, ttlMs, usedAt }, now) {
  return {
    expired: now - issuedAt > ttlMs,
    replayed: usedAt !== null,
    usable: now - issuedAt <= ttlMs && usedAt === null,
  };
}

console.log(validateToken({ issuedAt: 1000, ttlMs: 60000, usedAt: null }, 50000));
console.log(validateToken({ issuedAt: 1000, ttlMs: 60000, usedAt: 20000 }, 50000));

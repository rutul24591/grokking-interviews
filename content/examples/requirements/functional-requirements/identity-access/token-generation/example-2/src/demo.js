function scopeAllowed(tokenScopes, requiredScope) {
  return tokenScopes.includes(requiredScope);
}

console.log(scopeAllowed(["profile:read", "sessions:read"], "profile:read"));
console.log(scopeAllowed(["profile:read", "sessions:read"], "users:write"));

function evaluateApiAccess(operations, grantedScopes) {
  return operations.map((operation) => {
    const missing = operation.requiredScopes.filter((scope) => !grantedScopes.includes(scope));
    return {
      id: operation.id,
      allowed: missing.length === 0,
      missing,
      fallback: missing.length === 0 ? "execute" : operation.readOnlyFallback ? "degrade-read-only" : "deny"
    };
  });
}

console.log(
  evaluateApiAccess(
    [
      { id: "suspend-account", requiredScopes: ["accounts.write", "audit.read"], readOnlyFallback: false },
      { id: "case-export", requiredScopes: ["audit.read"], readOnlyFallback: true }
    ],
    ["audit.read"]
  )
);

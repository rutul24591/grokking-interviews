This example covers a high-stakes edge case in multi-tenant systems:

**Tenant context leakage**.

It’s common to accidentally use a global “current tenant” variable, and then run async work that interleaves across requests. That can cause cross-tenant data access and incorrect authorization decisions.

The runnable demo shows:

1) A broken implementation using a global mutable variable.
2) A safer implementation using **AsyncLocalStorage** to scope tenant context to the current async call chain.
3) An even safer approach: pass `tenantId` explicitly in your service method signatures (not shown in code, but recommended).


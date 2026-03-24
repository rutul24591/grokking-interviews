## Why AsyncLocalStorage is useful

In a real BFF you may need request-scoped values:
- user id / auth context
- request id for logging
- locale/tenant

Rather than passing these through every call (which is also valid), `AsyncLocalStorage` can provide a safe request context.

Trade-offs:
- harder to reason about than explicit parameters
- must be used carefully to avoid context loss across async boundaries


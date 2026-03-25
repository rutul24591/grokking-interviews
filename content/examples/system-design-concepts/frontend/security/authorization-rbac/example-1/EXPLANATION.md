## RBAC in frontend system design

Authorization answers: “What can this authenticated user do?”

RBAC approach:
- assign roles to users
- define permissions per role
- enforce on the server for every sensitive action

Common pitfalls:
- enforcing only in UI
- role explosion (“too many roles”) → consider resource-scoped roles or ABAC hybrids
- lack of audit logging for privileged actions


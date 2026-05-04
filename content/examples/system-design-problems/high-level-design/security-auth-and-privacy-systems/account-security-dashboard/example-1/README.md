# Design an account security dashboard (sessions, devices) — Example 1

## Run (smoke)
`node --import tsx content/examples/system-design-problems/high-level-design/security-auth-and-privacy-systems/account-security-dashboard/example-1/app.ts`

## Files
- `EXPLANATION.md`
- `README.md`
- `app.ts` — runnable smoke + edge checks
- `lib/domain.ts` — entities and IDs
- `lib/api.ts` — backend contract shapes
- `lib/store.ts` — client state/caching skeleton
- `lib/policies.ts` — retries, rate limiting, pagination, idempotency hooks

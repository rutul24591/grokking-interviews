# Design Amazon / Flipkart frontend — Example 1

## Run (smoke)
`node --import tsx content/examples/system-design-problems/high-level-design/e-commerce-and-marketplace/amazon-flipkart-frontend/example-1/app.ts`

## Files
- `EXPLANATION.md`
- `README.md`
- `app.ts` — runnable smoke + edge checks
- `lib/domain.ts` — entities and IDs
- `lib/api.ts` — backend contract shapes
- `lib/store.ts` — client state/caching skeleton
- `lib/policies.ts` — retries, rate limiting, pagination, idempotency hooks

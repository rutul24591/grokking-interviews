Example 2 focuses on a common **edge routing** sub-problem:

> Route users to the best regional handler *before* the request reaches the origin.

It uses `middleware.ts` (edge runtime) to:
- read an `x-region` header (or `?region=...`)
- rewrite `/` to `/region/us` or `/region/eu`

This is a foundational pattern for:
- geo-based routing
- canary / A/B splits
- multi-region failover (“if EU unhealthy, route to US”)


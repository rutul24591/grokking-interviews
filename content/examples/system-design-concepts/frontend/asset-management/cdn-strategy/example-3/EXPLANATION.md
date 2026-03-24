# Example 3 — Multi-CDN failover + client-side circuit breaker

Advanced setups often use multiple CDNs for:

- provider outages
- regional performance
- cost and negotiation leverage

This example demonstrates:

- running two CDN servers (primary + secondary)
- a small **client-side circuit breaker** that avoids repeatedly hitting a failing primary
- fallback behavior for image fetches


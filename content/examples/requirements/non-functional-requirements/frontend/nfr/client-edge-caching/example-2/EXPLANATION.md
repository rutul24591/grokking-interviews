In the context of Client Edge Caching (client, edge, caching), this example provides a focused implementation of the concept below.

Stale-while-revalidate (SWR) improves perceived latency:
- serve cached data quickly,
- refresh in the background,
- update cache when refresh completes.

This demo is a minimal SWR cache wrapper around an async loader.


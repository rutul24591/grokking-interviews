# What this example covers

Server-side caching strategy decisions include:

- cache-aside vs write-through
- TTL selection and invalidation
- stampede protection (thundering herd)

This example implements **cache-aside** with:

- TTL entries
- an in-flight singleflight map so concurrent cache misses compute once

In production, move this state to Redis/Memcached and add observability (hit ratio, eviction reasons).


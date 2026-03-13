# Domain Name System (DNS) Example

This example simulates DNS resolution with zones, record types, and TTL-based caching. It demonstrates how resolvers walk a hierarchy and cache results.

## Files
- `records.js`: Zone data with A, CNAME, and TXT records.
- `cache.js`: TTL cache for resolved answers.
- `resolver.js`: Recursive resolver with cache lookups.
- `client.js`: Example lookups.

## Run
1. `node content/examples/backend/fundamentals-building-blocks/domain-name-system/example-1/client.js`

## What to look for
- CNAME resolution to the final A record.
- Cache hits until TTL expires.
- TXT record resolution for metadata.

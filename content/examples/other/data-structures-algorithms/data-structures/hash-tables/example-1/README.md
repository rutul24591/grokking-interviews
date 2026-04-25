# Hash Tables — Session Store with Separate Chaining

Implements a compact hash table with separate chaining and uses it as an in-memory session store.

## Files
- `hash-table.js`
- `app.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hash-tables/example-1/app.js`

## What to Verify
- lookups use the hash bucket first, then resolve collisions within the chain
- updates replace existing keys without duplicating entries
- distribution quality influences average lookup time

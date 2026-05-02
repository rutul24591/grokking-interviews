# Hash Tables — Open Addressing Follow-Up

Implements a minimal open-addressing hash table (linear probing) to contrast collision resolution with separate chaining.

## Files
- `EXPLANATION.md`
- `demo.js`
- `README.md`

## Run
`node content/examples/other/data-structures-algorithms/data-structures/hash-tables/example-4/demo.js`

## What to Verify
- collisions resolve by probing the next slot instead of building chains
- load factor influences expected probe length
- deletions require tombstones or a rehash policy in real systems

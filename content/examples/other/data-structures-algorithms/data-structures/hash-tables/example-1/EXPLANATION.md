Example 1 is a production-style implementation demo for this data structure.

Implements a compact hash table with separate chaining and uses it as an in-memory session store.

It demonstrates:
- lookups use the hash bucket first, then resolve collisions within the chain
- updates replace existing keys without duplicating entries
- distribution quality influences average lookup time

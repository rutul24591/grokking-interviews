# What this example covers

“Scale the service” is not just adding instances — you need a strategy for:

- partitioning keys (shards/partitions)
- reducing hotspots
- resizing with minimal disruption

This example demonstrates **rendezvous hashing** (highest-random-weight hashing):

- assigns each key to the shard with the highest score
- when you add a shard, only a subset of keys move (low movement vs modulo hashing)

This is a common building block behind scalable caches, KV stores, and sharded services.


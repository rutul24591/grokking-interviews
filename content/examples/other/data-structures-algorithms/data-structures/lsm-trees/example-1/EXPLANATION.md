Example 1 is a production-style implementation demo for this data structure.

Models an LSM-style store with a mutable memtable and immutable SSTable snapshots to show why writes stay fast.

It demonstrates:
- recent writes land in the memtable first
- flush turns sorted memory state into immutable segments
- reads consult recent state before colder levels

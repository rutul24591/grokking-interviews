Example 1 is a production-style implementation demo for this data structure.

Builds a Merkle tree over file chunks so integrity can be validated from a single root hash.

It demonstrates:
- leaf hashes represent chunk content
- internal hashes summarize child hashes recursively
- a root mismatch proves some chunk changed

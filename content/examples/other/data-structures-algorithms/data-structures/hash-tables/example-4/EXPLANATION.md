Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Implements a minimal open-addressing hash table (linear probing) to contrast collision resolution with separate chaining.

It demonstrates:
- collisions resolve by probing the next slot instead of building chains
- load factor influences expected probe length
- deletions require tombstones or a rehash policy in real systems

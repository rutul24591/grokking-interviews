Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers odd leaf counts and partial updates because those operational details are easy to skip but matter in practice.

It demonstrates:
- odd levels duplicate the last hash or use an equivalent policy
- changing one leaf only invalidates hashes on its path
- root stability depends on deterministic leaf ordering

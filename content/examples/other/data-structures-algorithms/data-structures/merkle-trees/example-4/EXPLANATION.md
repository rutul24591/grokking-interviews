Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Shows how Merkle trees help narrow down which chunk changed by comparing subtree hashes top-down.

It demonstrates:
- a mismatch at the root implies some leaf differs
- comparing children hashes narrows the divergent subtree
- the process is logarithmic in leaf count when trees are balanced

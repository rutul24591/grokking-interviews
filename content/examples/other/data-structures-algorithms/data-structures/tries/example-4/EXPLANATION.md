Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Implements word deletion to cover the common follow-up where nodes must be pruned without breaking shared prefixes.

It demonstrates:
- deleting one word does not remove nodes needed by other words
- unused nodes are pruned on the way back up
- the prefix subtree remains valid after deletions

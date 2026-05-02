Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Covers the fragile transitions around empty lists, single-node lists, and tail deletion where pointer bugs usually appear first.

It demonstrates:
- removing the head updates the list root correctly
- removing the last node resets both head and tail
- missing-item deletes are harmless and explicit

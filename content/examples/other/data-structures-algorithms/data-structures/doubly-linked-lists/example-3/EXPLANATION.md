Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Validates the pointer transitions that usually break first: removing the only node, removing the head, and removing the tail.

It demonstrates:
- single-node delete clears both head and tail
- head removal preserves backward links
- tail removal preserves forward links

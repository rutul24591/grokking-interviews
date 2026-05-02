Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Uses array indexing for a moving latency window and shows why arrays are strong when reads are dense and positional access matters.

It demonstrates:
- window evicts oldest values in insertion order
- running average uses deterministic index arithmetic
- dense reads remain simple compared with pointer-heavy structures

Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements Floyd’s cycle detection on a linked list — the core fast/slow pointer pattern.

It demonstrates:
- fast advances 2 steps, slow advances 1 step
- meeting implies a cycle; reaching null implies acyclic
- uses O(1) extra memory

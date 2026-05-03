Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements a simple queue abstraction and uses it to run BFS on a graph (queue is the core primitive).

It demonstrates:
- FIFO ordering is preserved
- dequeue returns null when empty
- queue supports sustained enqueue/dequeue without O(n) shift costs

Example 1 is a production-style implementation demo for this algorithm.

Implements Floyd–Warshall to compute all-pairs shortest paths on a dense graph.

It demonstrates:
- DP over intermediate nodes progressively improves distances
- supports negative edges (but not negative cycles without extra checks)
- O(V^3) complexity is explicit and appropriate for small dense graphs

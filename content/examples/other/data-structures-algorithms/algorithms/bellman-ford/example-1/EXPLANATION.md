Example 1 is a production-style implementation demo for this algorithm.

Implements Bellman–Ford and demonstrates shortest paths even with negative weights (when no negative cycle exists).

It demonstrates:
- relaxation runs V-1 times over all edges
- supports negative weights
- detects negative cycles by checking for additional relaxation

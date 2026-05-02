Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Adds a weighted-graph follow-up using Dijkstra’s algorithm, which is the natural escalation after BFS shortest paths.

It demonstrates:
- edge weights change path selection versus minimum-hop routing
- the algorithm relies on extracting the next minimum-distance node
- negative weights are invalid for vanilla Dijkstra and should be rejected by design

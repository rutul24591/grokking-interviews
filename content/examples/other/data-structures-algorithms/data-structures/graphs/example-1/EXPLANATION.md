Example 1 is a production-style implementation demo for this data structure.

Uses an adjacency-list graph to model service dependencies and shortest unweighted paths across a small platform topology.

It demonstrates:
- nodes can have multiple outgoing and incoming connections
- BFS finds the minimum-hop route in an unweighted graph
- the model supports cycles without breaking traversal

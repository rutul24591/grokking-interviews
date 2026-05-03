Example 2 focuses on a common follow-up variant that changes constraints or output requirements.

Follow-up: detect cycles in an undirected graph by unioning edges and rejecting edges that connect already-connected nodes.

It demonstrates:
- detects a cycle when an edge connects nodes in the same component
- works in streaming fashion over edges
- requires nodes to be known/registered

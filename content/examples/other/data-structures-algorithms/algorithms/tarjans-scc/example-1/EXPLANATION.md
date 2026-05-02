Example 1 is a production-style implementation demo for this algorithm.

Implements Tarjan’s algorithm to find strongly connected components in a directed graph.

It demonstrates:
- lowlink values capture back-edges
- stack membership tracks the current DFS component
- SCCs are emitted when a root is discovered

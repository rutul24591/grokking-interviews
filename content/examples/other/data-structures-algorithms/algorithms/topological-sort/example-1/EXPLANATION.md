Example 1 is a production-style implementation demo for this algorithm.

Implements Kahn’s algorithm for topological sorting of a DAG and prints a valid build/deploy order.

It demonstrates:
- nodes with indegree 0 are processed first
- each edge reduces indegree of its neighbor
- order contains all nodes when the graph is acyclic

# Graph Valid Tree (Leetcode Premium) — Example 2 (More Optimized: Union-Find)

LeetCode: https://leetcode.com/problems/graph-valid-tree/

## Approach
Use Union-Find (Disjoint Set Union):
- If an edge connects two nodes already in the same component ⇒ cycle
- After processing all edges, graph is a tree only if there is exactly 1 component

## Complexity (step-by-step)
1. Initialize DSU arrays: O(n).
2. For each edge, do `find` + `union` with path compression and union-by-rank: ~ O(α(n)) amortized.
3. Track component count as we union.

## Overall Complexity
- Time: O(n + E * α(n)) ~ O(n + E)
- Space: O(n)

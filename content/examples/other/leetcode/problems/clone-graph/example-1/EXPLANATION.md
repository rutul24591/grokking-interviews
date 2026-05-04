# Clone Graph — Example 1 (Less Optimized: Recursive DFS)

LeetCode: https://leetcode.com/problems/clone-graph/

## Approach
Use DFS to traverse the graph and create a clone node the first time we see an original node.
Store original→clone mapping in a hash map to:
- prevent infinite loops on cycles
- reuse clones for shared neighbors

## Complexity (step-by-step)
1. Visit each node once due to `seen` memo: O(V).
2. For each node, iterate its neighbor list once: total O(E).
3. Hash map lookups/inserts: average O(1) per access.

## Overall Complexity
- Time: O(V + E)
- Space: O(V) for the map + O(V) recursion stack worst-case

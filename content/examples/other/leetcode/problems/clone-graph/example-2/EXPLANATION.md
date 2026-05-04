# Clone Graph — Example 2 (More Optimized: Iterative BFS)

LeetCode: https://leetcode.com/problems/clone-graph/

## Approach
Same idea (hash map original→clone) but traverse iteratively with BFS to avoid recursion depth risk.

## Complexity (step-by-step)
1. Enqueue each node once: O(V).
2. Process each edge once while iterating neighbor lists: O(E).
3. Hash map lookups/inserts: average O(1).

## Overall Complexity
- Time: O(V + E)
- Space: O(V) for the map + O(V) queue

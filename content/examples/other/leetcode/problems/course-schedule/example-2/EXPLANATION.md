# Course Schedule — Example 2 (More Optimized: DFS Cycle Detection)

LeetCode: https://leetcode.com/problems/course-schedule/

## Approach
DFS with node states:
- `0` unvisited
- `1` visiting (in current recursion stack)
- `2` visited (fully processed)

If we ever visit a `visiting` node, we found a cycle ⇒ cannot finish.

## Complexity (step-by-step)
1. Build adjacency list: O(V + E).
2. Each node enters DFS at most once as `unvisited`: O(V).
3. Each edge explored at most once: O(E).

## Overall Complexity
- Time: O(V + E)
- Space: O(V + E) adjacency + O(V) recursion stack worst-case

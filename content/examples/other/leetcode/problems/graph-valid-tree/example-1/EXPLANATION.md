# Graph Valid Tree (Leetcode Premium) — Example 1 (Less Optimized: DFS Cycle + Connectivity Check)

LeetCode: https://leetcode.com/problems/graph-valid-tree/

## Approach
A graph is a tree iff:
1) it has no cycles
2) it is fully connected

Build an adjacency list, run DFS from node 0:
- if we see an already-visited node that isn’t our parent ⇒ cycle
- after DFS, if any node unvisited ⇒ disconnected

## Complexity (step-by-step)
1. Build adjacency list: O(n + E).
2. DFS visits each node once: O(n).
3. DFS inspects each undirected edge twice: O(E).
4. Final pass to ensure all visited: O(n).

## Overall Complexity
- Time: O(n + E)
- Space: O(n + E) adjacency + O(n) visited (+ recursion stack)

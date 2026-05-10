# Binary Tree Level Order Traversal — Example 2 (More Optimized: DFS with Depth Buckets)

LeetCode: https://leetcode.com/problems/binary-tree-level-order-traversal/

## Approach
DFS while tracking `depth`. Append values into `out[depth]`. This avoids an explicit queue but uses recursion.

## Complexity (step-by-step)
1. Visit each node once: O(n).
2. Constant-time append into the right bucket.

## Overall Complexity
- Time: O(n)
- Space: O(h) recursion stack + O(n) output

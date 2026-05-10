# Maximum Depth of Binary Tree — Example 1 (Less Optimized: Recursive DFS)

LeetCode: https://leetcode.com/problems/maximum-depth-of-binary-tree/

## Approach
Depth of a node is `1 + max(depth(left), depth(right))`. Use recursion.

## Complexity (step-by-step)
1. Visit each node once: O(n).
2. Constant-time combine per node.

## Overall Complexity
- Time: O(n)
- Space: O(h) recursion stack (worst-case O(n))

# Invert/Flip Binary Tree — Example 1 (Less Optimized: Recursive DFS)

LeetCode: https://leetcode.com/problems/invert-binary-tree/

## Approach
Recursively invert left and right subtrees, then swap them.

## Complexity (step-by-step)
1. Visit each node once: O(n).
2. Constant-time swap per node.

## Overall Complexity
- Time: O(n)
- Space: O(h) recursion stack

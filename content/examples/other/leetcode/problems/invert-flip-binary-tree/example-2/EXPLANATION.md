# Invert/Flip Binary Tree — Example 2 (More Optimized: BFS Iterative Swap)

LeetCode: https://leetcode.com/problems/invert-binary-tree/

## Approach
Iteratively traverse the tree with BFS and swap each node’s left/right pointers.
Avoids recursion depth.

## Complexity (step-by-step)
1. Each node dequeued once: O(n).
2. Constant-time swap per node.

## Overall Complexity
- Time: O(n)
- Space: O(w) max queue size

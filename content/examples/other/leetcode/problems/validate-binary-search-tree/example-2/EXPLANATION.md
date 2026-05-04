# Validate Binary Search Tree — Example 2 (More Optimized: Bounds DFS)

LeetCode: https://leetcode.com/problems/validate-binary-search-tree/

## Approach
Validate via DFS with allowable bounds:
- left subtree values must be in `(low, node.val)`
- right subtree values must be in `(node.val, high)`

This avoids storing all inorder values.

## Complexity (step-by-step)
1. Visit each node once: O(n).
2. Constant-time bound checks at each node.

## Overall Complexity
- Time: O(n)
- Space: O(h) recursion stack

# Lowest Common Ancestor of BST — Example 2 (More Optimized: Use BST Ordering)

LeetCode: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

## Approach
Use BST property:
- if both `p` and `q` values are smaller than `cur`, go left
- if both larger than `cur`, go right
- otherwise `cur` is the split point ⇒ LCA

## Complexity (step-by-step)
1. Walk down the tree once: O(h) steps.
2. Constant-time comparisons each step.

## Overall Complexity
- Time: O(h)
- Space: O(1)

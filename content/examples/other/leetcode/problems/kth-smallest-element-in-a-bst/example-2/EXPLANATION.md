# Kth Smallest Element in a BST — Example 2 (More Optimized: Iterative Inorder Early-stop)

LeetCode: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

## Approach
Iterative inorder traversal with a stack. Decrement `k` when visiting a node; stop as soon as `k == 0`.

## Complexity (step-by-step)
1. Inorder traversal visits nodes in sorted order.
2. We may stop early after visiting k nodes.

## Overall Complexity
- Time: O(h + k) (h = tree height)
- Space: O(h) stack

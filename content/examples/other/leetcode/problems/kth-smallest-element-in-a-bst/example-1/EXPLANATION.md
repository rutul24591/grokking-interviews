# Kth Smallest Element in a BST — Example 1 (Less Optimized: Inorder Collect)

LeetCode: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

## Approach
Inorder traversal of a BST yields sorted values. Collect values into an array and return the k-th (1-indexed).

## Complexity (step-by-step)
1. Inorder traversal visits each node once: O(n).
2. Append each value: O(1) per node.
3. Index into array: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(n)

# Validate Binary Search Tree — Example 1 (Less Optimized: Inorder Collect + Check)

LeetCode: https://leetcode.com/problems/validate-binary-search-tree/

## Approach
Inorder traversal of a BST yields a strictly increasing sequence.
Collect inorder values into an array, then verify it’s strictly increasing.

## Complexity (step-by-step)
1. Inorder traversal visits each node once: O(n).
2. Append each value to an array: O(1) per node.
3. Single pass to check sortedness: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(n) extra for the collected values (+ recursion stack)

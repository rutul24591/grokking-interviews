# Binary Tree Level Order Traversal — Example 1 (Less Optimized: BFS Queue)

LeetCode: https://leetcode.com/problems/binary-tree-level-order-traversal/

## Approach
Classic BFS. Process nodes level-by-level by capturing the current queue size.

## Complexity (step-by-step)
1. Each node enqueued/dequeued once: O(n).
2. Constant work per node.

## Overall Complexity
- Time: O(n)
- Space: O(w) max width of tree

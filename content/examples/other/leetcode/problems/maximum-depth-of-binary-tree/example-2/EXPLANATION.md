# Maximum Depth of Binary Tree — Example 2 (More Optimized: BFS Level Count)

LeetCode: https://leetcode.com/problems/maximum-depth-of-binary-tree/

## Approach
Level-order traversal (BFS). Number of levels processed is the depth.

## Complexity (step-by-step)
1. Each node enqueued/dequeued once: O(n).
2. Constant work per node.

## Overall Complexity
- Time: O(n)
- Space: O(w) where w = max width of tree (worst-case O(n))

# Subtree of Another Tree — Example 1 (Less Optimized: DFS + Tree Equality)

LeetCode: https://leetcode.com/problems/subtree-of-another-tree/

## Approach
Traverse every node in `root`. At each node, check if the subtree rooted there is exactly equal to `subRoot`.

## Complexity (step-by-step)
1. For each of N nodes in `root`, we might run a subtree equality check.
2. Equality check can visit up to M nodes (size of `subRoot`) in the worst case.

## Overall Complexity
- Time: O(N * M) worst-case
- Space: O(H) recursion stack

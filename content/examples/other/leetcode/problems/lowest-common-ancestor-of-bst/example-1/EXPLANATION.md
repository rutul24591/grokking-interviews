# Lowest Common Ancestor of BST — Example 1 (Less Optimized: Root-to-Node Paths)

LeetCode: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

## Approach
Ignore BST properties and treat it as a normal binary tree:
1) find path from root to `p`
2) find path from root to `q`
3) walk both paths until they diverge; last common node is LCA

## Complexity (step-by-step)
1. Each path search may visit O(n) nodes: O(n).
2. Path comparison: O(h).

## Overall Complexity
- Time: O(n)
- Space: O(h) for each path

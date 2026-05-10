# Reorder List — Example 1 (Less Optimized: Array of Nodes)

LeetCode: https://leetcode.com/problems/reorder-list/

## Approach
Collect all nodes into an array, then use two pointers `left/right` to relink:
`L0 -> Ln -> L1 -> Ln-1 -> ...`

## Complexity (step-by-step)
1. Build array of L nodes: O(L).
2. Relink nodes with two pointers: O(L).

## Overall Complexity
- Time: O(L)
- Space: O(L)

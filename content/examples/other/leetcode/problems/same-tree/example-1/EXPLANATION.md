# Same Tree — Example 1 (Less Optimized: Recursive DFS)

LeetCode: https://leetcode.com/problems/same-tree/

## Approach
Recursively compare the two trees:
- both null ⇒ equal
- one null ⇒ not equal
- values must match, and left/right subtrees must match

## Complexity (step-by-step)
1. Visit each pair of nodes at most once: O(n).
2. Constant-time checks per node pair.

## Overall Complexity
- Time: O(n)
- Space: O(h) recursion stack (h = tree height; worst-case O(n))

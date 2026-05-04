# House Robber — Example 1 (Less Optimized: Top-down DFS + Memo)

LeetCode: https://leetcode.com/problems/house-robber/

## Approach
At index `i`:
- skip house `i` ⇒ solve `i+1`
- rob house `i` ⇒ `nums[i] + solve(i+2)`

Memoize by index.

## Complexity (step-by-step)
1. There are `n` indices; memo ensures each computed once: O(n).
2. O(1) work per index.

## Overall Complexity
- Time: O(n)
- Space: O(n) memo + recursion stack

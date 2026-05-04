# House Robber — Example 2 (More Optimized: Iterative DP, O(1) Space)

LeetCode: https://leetcode.com/problems/house-robber/

## Approach
Rolling DP:
`cur = max(prev1, prev2 + nums[i])`

Where `prev1` is best up to previous house, and `prev2` is best up to the one before that.

## Complexity (step-by-step)
1. One pass: O(n).
2. Constant-time update each step.

## Overall Complexity
- Time: O(n)
- Space: O(1)

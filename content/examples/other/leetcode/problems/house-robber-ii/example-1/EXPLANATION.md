# House Robber II — Example 1 (Less Optimized: Reduce to 2 Linear Runs)

LeetCode: https://leetcode.com/problems/house-robber-ii/

## Approach
Because houses are in a circle, we cannot rob both first and last.
So compute:
- best if we rob from `[0..n-2]` (exclude last)
- best if we rob from `[1..n-1]` (exclude first)
Return the max.

Each linear run is standard House Robber DP.

## Complexity (step-by-step)
1. Run linear DP on `[0..n-2]`: O(n).
2. Run linear DP on `[1..n-1]`: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(1)

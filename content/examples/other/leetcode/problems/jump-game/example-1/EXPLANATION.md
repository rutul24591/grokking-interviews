# Jump Game — Example 1 (Less Optimized: DP From End)

LeetCode: https://leetcode.com/problems/jump-game/

## Approach
`good[i]` means index `i` can reach the end.
Compute from right to left: `good[i]` is true if any `good[j]` in reachable range `(i+1..i+nums[i])` is true.

## Complexity (step-by-step)
1. For each index i, scan up to `nums[i]` next indices in worst case.
2. Total worst-case scanning is O(n^2).

## Overall Complexity
- Time: O(n^2)
- Space: O(n)

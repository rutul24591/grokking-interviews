# Maximum Subarray — Example 1 (Less Optimized: O(n^2) Prefix Expansion)

LeetCode: https://leetcode.com/problems/maximum-subarray/

## Approach
Try all subarrays by expanding from each start.

## Complexity (step-by-step)
1. For each start i, expand end j and accumulate sum: O(n^2).
2. Track global maximum.
## Overall Complexity
- Time: O(n^2)
- Space: O(1)

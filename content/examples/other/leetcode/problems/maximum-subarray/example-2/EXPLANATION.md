# Maximum Subarray — Example 2 (Optimized: Kadane)

LeetCode: https://leetcode.com/problems/maximum-subarray/

## Approach
DP on ending position (Kadane’s algorithm).

## Complexity (step-by-step)
1. Maintain cur = max subarray sum ending at i.
2. Transition: cur = max(nums[i], cur + nums[i]): O(1) per element.
3. Track best across all i.
## Overall Complexity
- Time: O(n)
- Space: O(1)

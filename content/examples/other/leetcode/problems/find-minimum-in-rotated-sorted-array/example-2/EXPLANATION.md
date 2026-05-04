# Find Minimum in Rotated Sorted Array — Example 2 (More Optimized: Binary Search)

LeetCode: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/

## Approach
Binary search using the property that a rotated sorted array consists of two sorted segments.

If `nums[left] < nums[right]`, the current window is already sorted and `nums[left]` is the minimum.
Otherwise, use `mid` to decide which side contains the rotation point.

## Complexity (step-by-step)
1. Each loop iteration halves the search interval: O(log n) iterations.
2. Constant-time comparisons and pointer moves per iteration: O(1).

## Overall Complexity
- Time: O(log n)
- Space: O(1)

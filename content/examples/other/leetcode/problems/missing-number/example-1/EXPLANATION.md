# Missing Number — Example 1 (Less Optimized: Sort + Scan)

LeetCode: https://leetcode.com/problems/missing-number/

## Approach
Sort the array and scan for the first index `i` where `nums[i] != i`.

## Complexity (step-by-step)
1. Sort: O(n log n).
2. Single scan to find mismatch: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(1) to O(n) depending on sort implementation

# Longest Consecutive Sequence — Example 1 (Less Optimized: Sort + Scan)

LeetCode: https://leetcode.com/problems/longest-consecutive-sequence/

## Approach
Sort numbers, then scan for consecutive streaks, skipping duplicates.

## Complexity (step-by-step)
1. Sort n numbers: O(n log n).
2. Single scan: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(1) to O(n) depending on sort implementation

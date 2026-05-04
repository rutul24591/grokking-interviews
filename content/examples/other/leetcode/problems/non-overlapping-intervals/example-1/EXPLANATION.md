# Non-overlapping Intervals — Example 1 (Less Optimized: Sort by Start + Greedy Keep Smaller End)

LeetCode: https://leetcode.com/problems/non-overlapping-intervals/

## Approach
Sort by start. When we see an overlap, remove one interval. Greedy rule:
keep the interval with the smaller end time (it leaves more room for future intervals).

## Complexity (step-by-step)
1. Sort: O(n log n).
2. Single pass, constant-time decisions: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(1) extra (excluding sort overhead)

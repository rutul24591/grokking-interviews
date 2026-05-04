# Insert Interval — Example 1 (Less Optimized: Linear Scan + Merge)

LeetCode: https://leetcode.com/problems/insert-interval/

## Approach
Intervals are sorted and non-overlapping. Do three phases:
1) add intervals ending before new interval starts
2) merge all overlapping intervals into `[ns, ne]`
3) add the remaining intervals

## Complexity (step-by-step)
1. Single pass through intervals: O(n).
2. Constant-time merges per overlapping interval.

## Overall Complexity
- Time: O(n)
- Space: O(n) output

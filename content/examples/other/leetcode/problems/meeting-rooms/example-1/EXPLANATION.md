# Meeting Rooms (Leetcode Premium) — Example 1 (Less Optimized: Sort by Start)

LeetCode: https://leetcode.com/problems/meeting-rooms/

## Approach
Sort intervals by start time. If any interval starts before the previous one ends, there is overlap ⇒ cannot attend all.

## Complexity (step-by-step)
1. Sort intervals: O(n log n).
2. One pass overlap check: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(1) to O(n) depending on sort implementation

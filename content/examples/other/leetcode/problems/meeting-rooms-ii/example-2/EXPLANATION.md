# Meeting Rooms II (Leetcode Premium) — Example 2 (More Optimized: Min-Heap of End Times)

LeetCode: https://leetcode.com/problems/meeting-rooms-ii/

## Approach
Sort by start time. Maintain a min-heap of end times for allocated rooms.
Reuse a room when the earliest end time is `<= start`.

## Complexity (step-by-step)
1. Sort: O(n log n).
2. Heap push/pop per meeting: O(log n) each.

## Overall Complexity
- Time: O(n log n)
- Space: O(n)

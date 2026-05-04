# Meeting Rooms (Leetcode Premium) — Example 2 (More Optimized: Sort Starts/Ends Separately)

LeetCode: https://leetcode.com/problems/meeting-rooms/

## Approach
Sort start times and end times separately.
If the i-th start time is earlier than the (i-1)-th end time, there is an overlap.

## Complexity (step-by-step)
1. Build starts/ends arrays: O(n).
2. Sort both arrays: O(n log n).
3. Single scan compare: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(n)

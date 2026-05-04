# Meeting Rooms II (Leetcode Premium) — Example 1 (Less Optimized: Separate Starts/Ends)

LeetCode: https://leetcode.com/problems/meeting-rooms-ii/

## Approach
Sort starts and ends separately. Walk starts in order:
- If next start is before earliest end ⇒ need a new room
- Else reuse a room (advance end pointer)

## Complexity (step-by-step)
1. Build starts/ends arrays: O(n).
2. Sort both: O(n log n).
3. Single scan: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(n)

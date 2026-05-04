# Insert Interval — Example 2 (More Optimized: Single-pass State Machine)

LeetCode: https://leetcode.com/problems/insert-interval/

## Approach
Still linear optimal, but treat `newInterval` as a mutable “current interval”:
- if current interval is before ⇒ output it
- if after ⇒ output `newInterval` then treat current as the new `newInterval`
- else overlap ⇒ expand `newInterval`

## Complexity (step-by-step)
1. Single pass over intervals: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(n) output

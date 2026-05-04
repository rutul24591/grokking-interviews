# Minimum Window Substring — Example 2 (More Optimized: Sliding Window)

LeetCode: https://leetcode.com/problems/minimum-window-substring/

## Approach
Sliding window with counts:
- `need[ch]`: required count from `t`
- `window[ch]`: current count in window

Maintain `have` = number of character kinds that meet required counts.
Expand right to satisfy all needs, then shrink left to minimize while still valid.

## Complexity (step-by-step)
1. Build `need` map: O(|t|).
2. Right pointer moves from 0..n-1 once: O(n).
3. Left pointer also only moves forward up to n steps: O(n).

## Overall Complexity
- Time: O(n + |t|)
- Space: O(|alphabet|) (maps for counts)

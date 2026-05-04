# Valid Parentheses — Example 2 (More Optimized: Closing→Opening Map)

LeetCode: https://leetcode.com/problems/valid-parentheses/

## Approach
Same stack idea, but map closing brackets to the required opening bracket so the check is a single comparison.

## Complexity (step-by-step)
1. Single scan: O(n).
2. Push/pop per character: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(n)

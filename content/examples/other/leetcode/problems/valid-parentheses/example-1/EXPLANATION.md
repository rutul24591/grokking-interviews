# Valid Parentheses — Example 1 (Less Optimized: Stack)

LeetCode: https://leetcode.com/problems/valid-parentheses/

## Approach
Use a stack of opening brackets. For each closing bracket, the top of stack must be the matching opening bracket.

## Complexity (step-by-step)
1. Iterate through the string once: O(n).
2. Each character causes at most one push/pop: O(1) each.

## Overall Complexity
- Time: O(n)
- Space: O(n) stack in worst case (all opens)

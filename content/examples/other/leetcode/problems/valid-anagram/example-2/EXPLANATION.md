# Valid Anagram — Example 2 (More Optimized: 26-count Frequency)

LeetCode: https://leetcode.com/problems/valid-anagram/

## Approach
Count letter frequencies for `s` and subtract frequencies for `t`. If all counts return to 0, they are anagrams.

## Complexity (step-by-step)
1. Single pass over both strings: O(n).
2. Check 26 counts: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(1)

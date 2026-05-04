# Valid Anagram — Example 1 (Less Optimized: Sort + Compare)

LeetCode: https://leetcode.com/problems/valid-anagram/

## Approach
Two strings are anagrams if their sorted character sequences are identical.

## Complexity (step-by-step)
1. Sort both strings (length n): O(n log n).
2. Compare sorted strings: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(n) (sorting / arrays)

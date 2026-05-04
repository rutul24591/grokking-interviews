# Group Anagrams — Example 1 (Less Optimized: Sort Each String Key)

LeetCode: https://leetcode.com/problems/group-anagrams/

## Approach
Two strings are anagrams if their sorted characters are identical.
Use a map from `sorted(s)` to the list of original strings.

## Complexity (step-by-step)
1. For each string `s` (N strings), sort its characters (length K): O(K log K).
2. Hash map insert/lookup: average O(1) per string (key comparison depends on K).

## Overall Complexity
- Time: O(N * K log K)
- Space: O(N * K) for grouping + keys

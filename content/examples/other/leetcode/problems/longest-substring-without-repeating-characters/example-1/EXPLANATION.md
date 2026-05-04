# Longest Substring Without Repeating Characters — Example 1 (Less Optimized: Brute Force)

LeetCode: https://leetcode.com/problems/longest-substring-without-repeating-characters/

## Approach
For each start index `i`, extend the end index `j` until we hit a duplicate character.

## Complexity (step-by-step)
1. Outer loop chooses `i`: O(n).
2. Inner loop extends `j` potentially up to n times per i: O(n).
3. Set membership checks are O(1) average.

## Overall Complexity
- Time: O(n^2)
- Space: O(min(n, alphabet))

# Longest Palindromic Substring — Example 1 (Less Optimized: Brute Force)

LeetCode: https://leetcode.com/problems/longest-palindromic-substring/

## Approach
Enumerate all substrings and check if each is a palindrome; track the longest.

## Complexity (step-by-step)
1. Enumerate substrings: O(n^2).
2. Palindrome check can scan O(n) characters per substring.

## Overall Complexity
- Time: O(n^3) worst-case
- Space: O(1)

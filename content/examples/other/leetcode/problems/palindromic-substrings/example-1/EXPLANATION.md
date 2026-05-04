# Palindromic Substrings — Example 1 (Less Optimized: Brute Force + Check)

LeetCode: https://leetcode.com/problems/palindromic-substrings/

## Approach
Enumerate all substrings `(i..j)` and check whether each one is a palindrome with two pointers.

## Complexity (step-by-step)
1. Enumerate all substrings: O(n^2).
2. Each palindrome check can scan up to O(n) characters.

## Overall Complexity
- Time: O(n^3) worst-case
- Space: O(1)

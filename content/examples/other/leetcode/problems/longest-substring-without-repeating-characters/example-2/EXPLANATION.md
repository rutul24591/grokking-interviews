# Longest Substring Without Repeating Characters — Example 2 (More Optimized: Sliding Window)

LeetCode: https://leetcode.com/problems/longest-substring-without-repeating-characters/

## Approach
Maintain a sliding window `[left..right]` with no duplicates.
Track the last seen index of each character. When we see a duplicate, move `left` past the previous occurrence.

## Complexity (step-by-step)
1. Single pass over characters: O(n).
2. Each character updates map and left pointer at most once: O(1) average per char.

## Overall Complexity
- Time: O(n)
- Space: O(min(n, alphabet))

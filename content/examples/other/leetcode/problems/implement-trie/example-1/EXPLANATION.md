# Implement Trie (Prefix Tree) — Example 1 (Less Optimized: Set + Prefix Scan)

LeetCode: https://leetcode.com/problems/implement-trie-prefix-tree/

## Approach
Store all full words in a hash set.
- `insert`: add to set
- `search`: membership in set
- `startsWith`: scan all words and check `startsWith(prefix)`

This passes correctness but can be slow for many words.

## Complexity (step-by-step)
1. `insert`: hash insert: average O(L).
2. `search`: hash lookup: average O(L).
3. `startsWith`: scan W words and compare prefix length P: O(W * P).

## Overall Complexity
- Time: `insert/search` ~ O(L), `startsWith` O(W*P)
- Space: O(total characters stored)

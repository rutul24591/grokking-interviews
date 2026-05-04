# Add and Search Word — Example 1 (Less Optimized: Store All Words + Linear Match)

LeetCode: https://leetcode.com/problems/add-and-search-word-data-structure-design/

## Approach
Store all inserted words in a list. For search:
1) Only compare words with the same length
2) For each candidate word, compare character-by-character (`.` matches anything)

## Complexity (step-by-step)
1. `addWord`: append to list: O(1).
2. `search`: scan all words (W) and compare up to L characters each: O(W * L).

## Overall Complexity
- Time: `addWord` O(1), `search` O(W * L)
- Space: O(total characters stored)

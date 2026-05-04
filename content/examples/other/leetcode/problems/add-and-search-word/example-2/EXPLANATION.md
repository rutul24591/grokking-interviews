# Add and Search Word — Example 2 (More Optimized: Trie + DFS for Wildcards)

LeetCode: https://leetcode.com/problems/add-and-search-word-data-structure-design/

## Approach
Store words in a Trie.
- `addWord`: insert characters down the Trie
- `search`: DFS through the Trie; when encountering `.`, try all children paths

## Complexity (step-by-step)
1. `addWord`: traverse/insert L characters: O(L).
2. `search` without wildcards: follow a single path of length L: O(L).
3. `search` with wildcards: may branch; worst-case explores many trie nodes.

## Overall Complexity
- Time: `addWord` O(L); `search` worst-case exponential in number of `.` (bounded by trie size)
- Space: O(total characters stored) for Trie nodes

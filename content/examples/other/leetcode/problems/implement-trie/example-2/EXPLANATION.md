# Implement Trie (Prefix Tree) — Example 2 (More Optimized: Real Trie)

LeetCode: https://leetcode.com/problems/implement-trie-prefix-tree/

## Approach
Implement an actual Trie:
- each node maps `char -> child node`
- `isWord` marks end of a full inserted word

Operations:
- `insert`: walk/create nodes for each char
- `search`: walk nodes, must end at `isWord`
- `startsWith`: walk nodes, only needs the prefix path

## Complexity (step-by-step)
1. Each operation walks at most L characters: O(L).
2. Hash map child lookup/insert per character: average O(1).

## Overall Complexity
- Time: `insert/search/startsWith` O(L)
- Space: O(total trie nodes) = O(total characters inserted)

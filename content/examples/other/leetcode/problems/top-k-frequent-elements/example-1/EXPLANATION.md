# Top K Frequent Elements — Example 1 (Less Optimized: Count + Sort)

LeetCode: https://leetcode.com/problems/top-k-frequent-elements/

## Approach
Count frequencies in a map, then sort unique numbers by frequency descending and take first k.

## Complexity (step-by-step)
1. Build frequency map from n items: O(n).
2. Sort U unique keys by frequency: O(U log U).
3. Take first k: O(k).

## Overall Complexity
- Time: O(n + U log U)
- Space: O(U)

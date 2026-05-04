# Top K Frequent Elements — Example 2 (More Optimized: Bucket Sort)

LeetCode: https://leetcode.com/problems/top-k-frequent-elements/

## Approach
Frequencies range from 1..n, so we can bucket elements by frequency and scan from high to low.

## Complexity (step-by-step)
1. Frequency map: O(n).
2. Fill buckets for U unique elements: O(U).
3. Scan buckets from n..1: O(n + U) (each element emitted once).

## Overall Complexity
- Time: O(n)
- Space: O(n)

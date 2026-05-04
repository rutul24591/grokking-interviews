# Two Sum — Example 2 (Optimized: Hash Map)

LeetCode: https://leetcode.com/problems/two-sum/

## Approach
Single pass with hash map for complements.

## Complexity (step-by-step)
1. Maintain a map value -> index for elements already visited.
2. For each x at index i, compute need = target - x: O(1).
3. Lookup need in map: O(1) average; if present return indices.
4. Insert x -> i into map: O(1) average.
## Overall Complexity
- Time: O(n) average
- Space: O(n)

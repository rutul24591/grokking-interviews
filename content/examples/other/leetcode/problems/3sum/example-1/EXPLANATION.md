# 3Sum — Example 1 (Less Optimized: Brute Force)

LeetCode: https://leetcode.com/problems/3sum/

## Approach
Try every triple `(i, j, k)` and keep those that sum to 0. To avoid duplicates, sort each found triple and store it in a set.

## Complexity (step-by-step)
1. Triple nested loops over all `(i, j, k)` combinations: O(n^3).
2. For each matching triple, sort 3 elements: O(1).
3. Insert/look up key in a set: average O(1).

## Overall Complexity
- Time: O(n^3)
- Space: O(m) for storing unique triples (m = number of solutions)

LeetCode: https://leetcode.com/problems/3sum/

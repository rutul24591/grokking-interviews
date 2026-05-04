# Contains Duplicate — Example 1 (Less Optimized: Sort + Scan)

LeetCode: https://leetcode.com/problems/contains-duplicate/

## Approach
Sorting brings duplicates next to each other.

## Complexity (step-by-step)
1. Sort array: O(n log n).
2. Single pass to detect adjacent equal elements: O(n).
## Overall Complexity
- Time: O(n log n)
- Space: O(1) extra (JS/Py may allocate)

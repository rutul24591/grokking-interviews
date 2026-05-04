# 3Sum — Example 2 (More Optimized: Sort + Two Pointers)

LeetCode: https://leetcode.com/problems/3sum/

## Approach
Sort the array, then fix `i` and solve `nums[left] + nums[right] = -nums[i]` with two pointers.
Skip duplicates for `i`, `left`, and `right`.

## Complexity (step-by-step)
1. Sort input: O(n log n).
2. For each `i`, move `left/right` pointers across the array once: total O(n) per `i` in the worst case.
3. Overall scanning after sorting: O(n^2).

## Overall Complexity
- Time: O(n^2) (dominates O(n log n))
- Space: O(1) extra (excluding output)

LeetCode: https://leetcode.com/problems/3sum/

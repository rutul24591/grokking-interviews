# Reorder List — Example 2 (More Optimized: Middle + Reverse + Merge)

LeetCode: https://leetcode.com/problems/reorder-list/

## Approach
1) Find middle with slow/fast pointers
2) Reverse the second half
3) Merge alternating nodes from first half and reversed second half

## Complexity (step-by-step)
1. Find middle: O(L).
2. Reverse second half: O(L).
3. Merge lists: O(L).

## Overall Complexity
- Time: O(L)
- Space: O(1)

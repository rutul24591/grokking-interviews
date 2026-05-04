# Spiral Matrix — Example 2 (More Optimized: Shrinking Boundaries)

LeetCode: https://leetcode.com/problems/spiral-matrix/

## Approach
Maintain four boundaries (`top`, `bottom`, `left`, `right`). Repeatedly peel off:
1) top row
2) right column
3) bottom row
4) left column
Then shrink boundaries.

## Complexity (step-by-step)
1. Each element appended exactly once: O(RC).
2. Only O(1) boundary updates between layers.

## Overall Complexity
- Time: O(RC)
- Space: O(1) extra (excluding output)

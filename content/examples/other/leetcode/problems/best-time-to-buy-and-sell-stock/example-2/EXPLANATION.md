# Best Time to Buy and Sell Stock — Example 2 (Optimized: One Pass)

LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

## Approach
Single pass tracking running minimum.

## Complexity (step-by-step)
1. Maintain min price seen so far: O(1) update each step.
2. Compute profit if selling today: p - minSoFar.
3. Track best profit.
## Overall Complexity
- Time: O(n)
- Space: O(1)

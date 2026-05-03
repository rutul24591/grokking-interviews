Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements cyclic sort placement to find a missing number in 0..n with O(1) extra space.

It demonstrates:
- each value is swapped into its index position when possible
- final scan finds the first index mismatch
- runs in O(n) time with bounded swaps

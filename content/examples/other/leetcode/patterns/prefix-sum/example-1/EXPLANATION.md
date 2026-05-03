Example 1 is a production-style implementation demo for this Leetcode pattern.

Builds a prefix sum array to answer range sum queries in O(1) after O(n) preprocessing.

It demonstrates:
- prefix array is length n+1 with prefix[0]=0
- range sum is computed by subtraction
- multiple queries avoid repeated scanning

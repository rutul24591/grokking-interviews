Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements the k-way merge pattern using a min-heap to merge multiple sorted arrays efficiently.

It demonstrates:
- heap always exposes the smallest next candidate
- runs in O(n log k) for n total elements
- handles empty sources gracefully

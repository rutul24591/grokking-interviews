Example 2 focuses on a common follow-up variant that changes constraints or output requirements.

Follow-up: use a heap to merge k sorted sources efficiently (k-way merge pattern).

It demonstrates:
- heap stores the next candidate from each source
- each pop/push advances one source
- runs in O(n log k) where n is total elements

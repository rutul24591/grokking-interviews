Example 2 focuses on a common follow-up variant that changes constraints or output requirements.

Follow-up: delete a word and prune nodes without breaking other words sharing a prefix.

It demonstrates:
- deleting one word does not delete shared prefix nodes
- unused nodes are pruned on unwind
- missing words return false

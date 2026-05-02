Example 3 focuses on edge cases and correctness checks you should validate.

Covers duplicates in inputs and the explosion in output size.

It demonstrates:
- duplicate inputs create duplicate permutations unless deduplicated
- k=0 yields one empty combination
- bounded sizes are required in production to avoid blowups

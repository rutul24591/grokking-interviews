Example 3 focuses on edge cases and correctness checks you should validate.

Shows the critical edge case: cycles mean no topological order exists and must be reported.

It demonstrates:
- cycles prevent processing all nodes
- null output indicates cycle presence
- production code should surface the cycle (or the remaining nodes) for debugging

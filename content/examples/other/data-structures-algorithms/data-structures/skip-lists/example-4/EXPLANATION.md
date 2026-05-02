Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Adds a search routine that walks higher levels first, since interview follow-ups often probe the search path behavior.

It demonstrates:
- search starts from the highest level and drops down as needed
- the expected number of hops stays small in a well-distributed level scheme
- worst-case behavior still exists if level distribution is poor

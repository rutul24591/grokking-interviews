Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Checks the operational edges around absent keys and updates because the table must behave predictably even when reads miss.

It demonstrates:
- missing keys resolve to null explicitly
- idempotent updates keep only one logical record per key
- bucket scans remain bounded to the chosen bucket

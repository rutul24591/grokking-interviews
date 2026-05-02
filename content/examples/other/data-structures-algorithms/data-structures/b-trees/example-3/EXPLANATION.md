Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Validates edge conditions around repeated inserts and shallow trees so correctness is not assumed only for balanced happy paths.

It demonstrates:
- duplicate keys remain visible to application policy decisions
- small trees may stay leaf-only with no split
- search expectations must define duplicate handling explicitly

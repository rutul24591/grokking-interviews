Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Exercises duplicate inserts and empty-prefix behavior because these are common edge conditions in autocomplete services.

It demonstrates:
- duplicate word inserts do not corrupt the trie
- an empty prefix can enumerate the whole dictionary
- missing prefixes should terminate early with no candidates

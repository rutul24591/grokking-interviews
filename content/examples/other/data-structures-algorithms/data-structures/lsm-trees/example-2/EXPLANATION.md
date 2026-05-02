Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Adds a compaction pass because merge and cleanup behavior is the essential follow-up for LSM discussions.

It demonstrates:
- newer SSTables shadow older values for the same key
- compaction rewrites data into fewer sorted runs
- read amplification falls as levels are merged

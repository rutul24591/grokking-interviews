Example 1 is a production-style implementation demo for this data structure.

Implements a count-min sketch to approximate event frequencies in a memory-bounded streaming workload.

It demonstrates:
- each update increments one counter per row
- the minimum row estimate bounds the answer from above
- the sketch is suited to heavy hitters, not exact counts

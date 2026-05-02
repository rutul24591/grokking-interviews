Example 1 is a production-style implementation demo for this data structure.

Builds a small product catalog workbench on top of a custom dynamic array implementation and exercises append, insert, delete, update, and resize behavior.

It demonstrates:
- capacity doubles only when the array is full
- middle inserts shift existing values without losing order
- removals compact the array and keep contiguous storage

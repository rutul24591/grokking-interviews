Example 1 is a production-style implementation demo for this data structure.

Implements a circular-buffer queue to model a worker dispatcher where enqueue and dequeue happen continuously under load.

It demonstrates:
- head and tail wrap around the buffer correctly
- FIFO ordering is preserved across many operations
- capacity checks reject overflow explicitly

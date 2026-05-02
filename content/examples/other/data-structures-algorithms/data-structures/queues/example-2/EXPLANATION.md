Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Shows a multi-queue follow-up where urgent work bypasses standard work without abandoning FIFO guarantees inside each lane.

It demonstrates:
- urgent tasks drain before standard tasks
- each lane still preserves insertion order
- the pattern scales into explicit scheduler policies

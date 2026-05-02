Example 2 focuses on a follow-up scenario that’s commonly asked after the main implementation.

Uses a bounded heap for top-k ranking, which is the usual follow-up when interviewers pivot from scheduling to streaming analytics.

It demonstrates:
- the heap retains only the k largest values seen so far
- bounded memory is maintained regardless of stream length
- the root tracks the current threshold for admission

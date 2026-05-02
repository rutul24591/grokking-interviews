Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Demonstrates a simple sliding-window approach by rotating multiple sketches, matching common 'last N minutes' telemetry questions.

It demonstrates:
- older windows are expired by dropping their sketch
- queries aggregate across active window sketches
- memory usage is bounded by the number of retained windows

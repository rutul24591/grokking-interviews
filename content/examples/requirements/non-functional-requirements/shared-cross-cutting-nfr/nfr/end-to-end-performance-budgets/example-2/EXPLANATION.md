This example focuses on an interview-friendly primitive: **latency budget allocation** across a call graph.

Given an end-to-end p95 budget, you allocate:
- frontend/render budget
- backend budget
- per-dependency budgets

This demo implements a simple proportional allocator.


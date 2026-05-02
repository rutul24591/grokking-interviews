Example 3 focuses on edge cases and correctness checks you should validate.

Shows the forest behavior when the graph is disconnected so production code can detect partial coverage.

It demonstrates:
- disconnected nodes cannot be reached from the chosen start
- output covers only the reachable component
- production code should detect visited coverage

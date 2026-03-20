Example 2 focuses on a core CSR problem: **main-thread CPU pressure**.

The scenario:
- A large list (10k items) with a filter input.
- A "naive" implementation that re-renders too much work per keystroke.
- A "virtualized" implementation that only renders what’s visible.

Key takeaways:
- CSR performance is often **CPU scheduling**, not just network.
- Virtualization + `useDeferredValue` keeps typing responsive under load.


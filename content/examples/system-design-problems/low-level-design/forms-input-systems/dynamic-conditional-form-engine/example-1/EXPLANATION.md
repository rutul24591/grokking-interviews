# Dynamic Conditional Form Engine — Full Implementation

Example 1 implements a dynamic conditional form engine where fields appear/disable/require based on other answers.

Interview focus areas:
- How to model conditions as data (not hard-coded `if` trees).
- Dependency tracking and re-evaluation strategy.
- Cycle detection (“A depends on B depends on A”).
- Preventing stale values for hidden/disabled fields (clear vs keep vs submit policy).

## Approach

- A `Rule` declares a target field and a predicate over the current values.
- The engine compiles a dependency graph and evaluates only affected rules on changes.
- Cycles are detected up-front and rejected to avoid infinite loops.


# Dynamic Conditional Form Engine — Follow-up: Incremental Re-evaluation

Example 2 focuses on the follow-up: “How do you avoid re-evaluating all rules on every keystroke?”

Strategy:
- Pre-index rules by dependencies (`rulesByDependency`).
- Re-evaluate only rules affected by the changed field.
- Batch updates (microtask) to coalesce rapid typing.


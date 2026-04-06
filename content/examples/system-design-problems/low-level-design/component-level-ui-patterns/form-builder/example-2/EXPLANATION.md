# Form Builder — Example 2: Edge Cases & Advanced Scenarios

## Overview

These examples cover two complex form patterns that go far beyond basic field rendering and validation — areas where interviewers probe for production-ready thinking.

---

## 1. Conditional Fields (`conditional-fields.ts`)

### The Problem

Simple `showIf: boolean` logic breaks down with complex interdependencies:

- Field C depends on Field A **AND** Field B
- Field D depends on Field C being visible
- Changing Field A should cascade to all downstream fields
- **Circular dependencies** must be detected (Field A depends on B, B depends on C, C depends on A)

### The Solution: Dependency Graph (DAG)

Model field dependencies as a **directed acyclic graph (DAG)**:

1. Each field declares its `visibleWhen` predicate function and `dependsOn` field list
2. Build an adjacency list: if B depends on A, then A → B in the graph
3. **Cycle detection** using DFS with three-color marking (WHITE/GRAY/BLACK)
4. **Topological sort** (Kahn's algorithm) determines evaluation order
5. When a field changes, re-evaluate all dependents in topological order

### Why Topological Order Matters

If Field D depends on C which depends on B which depends on A, and the user changes A, we must evaluate in order: A → B → C → D. Evaluating D before C would use stale visibility state for C.

### Cycle Detection Algorithm

```
WHITE (0) = unvisited
GRAY (1)  = currently in the DFS recursion stack
BLACK (2) = fully processed

If we encounter a GRAY node during DFS → CYCLE DETECTED
```

When a cycle is found, the safe fallback is to show all fields — hiding fields with circular dependencies could make the form unusable.

### Cascading Reset

When a field becomes hidden due to a condition change, its value is **reset to undefined**. This prevents "ghost data" — a hidden field's stale value could still affect downstream conditions if not cleared.

### Interview Talking Points

- **Time complexity:** Graph building is O(V + E), topological sort is O(V + E), re-evaluation is O(V) where V = fields, E = dependencies.
- **Why not infer dependencies from visibleWhen body?** Parsing function bodies is fragile (minification breaks it). Explicit `dependsOn` is reliable and type-safe.
- **What about performance with 100+ fields?** The graph is memoized. Re-evaluation only runs when a dependency changes, not on every render.

---

## 2. Cross-Field Validation (`cross-field-validation.ts`)

### The Problem

Standard form validation checks each field independently. Cross-field validation requires relationships:

- **Password match:** confirmPassword must equal password
- **Date range:** endDate must be >= startDate
- **Conditional requirements:** jobTitle is required ONLY when company is filled

The tricky part: when the user edits Field B, the error might be on Field A. The UI must reflect this correctly.

### The Solution

A rule-based validation system where each `ValidationRule` declares:

1. **Primary field** (`fieldId`) — where the error is displayed
2. **Dependencies** (`dependsOn`) — other fields that affect this validation
3. **Validation function** — receives all values, returns error or null

### Key Design Decisions

**Error storage:** A `Map<string, ValidationError[]>` allows O(1) lookups and supports multiple errors per field.

**Reactive re-validation:** An effect re-runs all rules whenever values change. This automatically clears errors when conditions resolve (e.g., user fixes the password mismatch).

**Touched field tracking:** Errors only display after the user has interacted with the field. This prevents showing red borders on a fresh form.

**relatedFields tracking:** Each error knows which other fields contributed to it. This enables highlighting both the password AND confirm password fields when they mismatch.

### Interview Talking Points

- **Error ownership:** The confirmPassword field "owns" the mismatch error, even though password is involved. This avoids duplicate error messages.
- **Validation timing:** validateOnChange for immediate feedback, validateOnBlur for less aggressive validation. Production forms often use both — onChange after the first blur.
- **Async validation:** For checks like username availability, the rule would return a Promise. The hook would need to track in-flight requests and handle race conditions (AbortController).

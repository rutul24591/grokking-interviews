# Example 3: Tool Description Quality Evaluator for MCP Servers

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only the Python standard library (`typing`, `dataclasses`).

---

## What This Demonstrates

This example implements a scoring system that evaluates the quality of MCP tool descriptions along six dimensions: action description, usage guidance, argument documentation, return value documentation, examples, and overall clarity. It demonstrates why tool description quality directly impacts LLM comprehension and shows three tiers of description quality (bad, mediocre, good) with scored output and actionable recommendations.

---

## Code Walkthrough

### Key Classes & Variables

| Symbol | Type | Purpose |
|---|---|---|
| `ToolDescriptionScore` | dataclass | Holds per-tool evaluation results and computes a weighted total score. |
| `ToolDescriptionScore.tool_name` | str | Name of the evaluated tool. |
| `ToolDescriptionScore.has_action_description` | bool | Whether the description says what the tool does (first sentence > 10 chars). |
| `ToolDescriptionScore.has_usage_guidance` | bool | Whether it includes phrases like "use when", "use to", "call when", etc. |
| `ToolDescriptionScore.has_argument_docs` | bool | Whether every argument property in the schema has a `description` field. |
| `ToolDescriptionScore.has_return_docs` | bool | Whether the description mentions return values ("returns" or "return" keyword). |
| `ToolDescriptionScore.has_examples` | bool | Whether the description includes examples ("example", "e.g.", "for instance"). |
| `ToolDescriptionScore.description_length` | int | Character count of the description string. |
| `ToolDescriptionScore.clarity_score` | float | Heuristic clarity: `min(1.0, len(desc) / 200)` — 200+ chars = full clarity. |
| `ToolDescriptionScore.total_score` | float | Weighted composite score (0.0 – 1.0). |
| `evaluate_tool_description()` | function | Analyzes a tool dict and returns a `ToolDescriptionScore` instance. |

### Weights Used in `compute_total()`

| Dimension | Weight | Rationale |
|---|---|---|
| `has_action_description` | 0.25 | Most important — the LLM must understand what the tool does. |
| `has_usage_guidance` | 0.20 | Tells the LLM *when* to invoke the tool. |
| `has_argument_docs` | 0.20 | Ensures the LLM passes correct arguments. |
| `has_return_docs` | 0.15 | Helps the LLM interpret the tool's output. |
| `has_examples` | 0.10 | Concrete examples reduce hallucination. |
| `clarity_score` | 0.10 | Scales with description length (capped at 200 chars). |

### Execution Flow (Step-by-Step)

1. **`main()` starts** — defines three tool descriptions of varying quality:
   - **`bad_tool`**: description is `"Gets data."` — 10 chars, no usage guidance, no argument docs, no return docs, no examples.
   - **`mediocre_tool`**: describes what it does and what it returns, but has no argument descriptions, no usage guidance, and no examples.
   - **`good_tool`**: ~300 chars, includes action description, "use when" usage guidance, argument descriptions in the schema, return value documentation, and a concrete example call.
2. **Prints a table header** with columns: Tool, Score, Action, Usage, Args, Return, Ex, Len.
3. **For each tool**, calls `evaluate_tool_description(tool)`:
   - Extracts `description` and `inputSchema`.
   - **Action check**: splits on first period; if first sentence > 10 chars, passes. Otherwise fails.
   - **Usage check**: searches for phrases like `"use when"`, `"use to"`, `"call when"`, `"for finding"`, `"for querying"`, `"for creating"` (case-insensitive).
   - **Argument docs check**: iterates over all `properties` in the schema; passes only if every property has a `"description"` key.
   - **Return check**: looks for `"returns"` or `"return"` in the description (case-insensitive).
   - **Examples check**: looks for `"example"`, `"e.g."`, or `"for instance"` in the description.
   - **Clarity**: computed as `min(1.0, len(desc) / 200)`.
   - Returns a `ToolDescriptionScore` dataclass with all boolean flags and scores.
4. **Calls `score.compute_total()`** — applies the weighted formula and stores the result in `score.total_score`.
5. **Prints one row per tool** showing the total score and checkmarks/crosses for each dimension.
6. **Prints recommendations** — iterates tools again, evaluates, and categorizes:
   - Score < 0.5 → **POOR**: rewrite with action, usage guidance, and argument docs.
   - Score 0.5–0.8 → **FAIR**: add usage guidance ("use when...") and return value description.
   - Score >= 0.8 → **GOOD**: well-structured description.

### Expected Output

```
Tool                  Score  Action  Usage  Args  Return  Ex   Len
-----------------------------------------------------------------
bad_tool              0.000       ✗      ✗     ✗       ✗   ✗    10
mediocre_tool         0.450       ✓      ✗     ✗       ✓   ✗    82
good_tool             1.000       ✓      ✓     ✓       ✓   ✓   297

=== Recommendations ===
  bad_tool: POOR — Rewrite description with action, usage guidance, and argument docs
  mediocre_tool: FAIR — Add usage guidance ('use when...') and return value description
  good_tool: GOOD — Well-structured description
```

---

## Key Takeaways

- **Tool descriptions are the LLM's API docs** — the LLM has no source code access; it relies entirely on the `description` and `inputSchema` to decide when and how to call a tool. Poor descriptions lead to missed calls, wrong arguments, or hallucinated parameters.
- **Structured evaluation catches gaps** — the six-dimension scorer makes it easy to spot exactly what is missing. `bad_tool` fails every dimension; `mediocre_tool` passes action and return but lacks usage guidance and argument docs; `good_tool` passes everything.
- **"Use when" phrasing is critical** — the evaluator specifically checks for usage guidance phrases. This pattern ("Use when you need to...") tells the LLM the invocation context, which is the single biggest factor in correct tool selection.
- **Argument documentation prevents silent failures** — without per-property `description` fields in the JSON Schema, the LLM may pass wrong types, omit required fields, or invent parameters that don't exist. The `has_argument_docs` check ensures schema completeness.
- **Length correlates with clarity** — the heuristic `min(1.0, len(desc) / 200)` is simple but effective: descriptions under 100 chars score at most 0.5 on clarity, while 200+ char descriptions get full clarity credit. This incentivizes thorough, specific descriptions.

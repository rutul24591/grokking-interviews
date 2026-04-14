# Example 1: Skill Registry with Registration, Discovery, and Invocation

## How to Run

```bash
python demo.py
```

**Dependencies:** `pydantic` (for `BaseModel` and `ValidationError`). Install with `pip install pydantic`. No other external dependencies required.

## What This Demonstrates

This example implements a central **Skill Registry** pattern used in AI agent systems, where skills (discrete capabilities) are registered with typed input/output schemas, discovered through a catalog, and invoked with automatic validation. It shows how primitive skills (like `search_knowledge`) can be composed into composite skills (like `generate_report`) that internally call other registered skills, forming the foundation of a modular, extensible agent architecture.

## Code Walkthrough

### Key Classes and Data Structures

- **`SkillMetadata`** (dataclass): Holds metadata for a skill including name, description, version, tags, preconditions, estimated cost, and estimated latency. This metadata is used by the LLM during skill discovery to decide which skill to invoke.
- **`SkillRegistry`**: The central registry that stores all registered skills in a dictionary (`_skills`) and organizes them by category (`_categories`). It provides three core operations:
  - `register()` — adds a skill with its input schema, output schema, implementation function, and metadata.
  - `get_catalog()` — returns a list of skill descriptions with JSON schemas for the LLM to discover available skills.
  - `invoke()` — validates inputs against the Pydantic schema, executes the implementation, validates outputs, and returns structured results.
- **`SearchInput` / `SearchOutput`** (Pydantic models): Define the typed contract for the search skill.
- **`ReportInput` / `ReportOutput`** (Pydantic models): Define the typed contract for the report generation skill.

### Execution Flow (Step-by-Step)

1. **Registry initialization**: A `SkillRegistry` instance is created with empty `_skills` and `_categories` dictionaries.
2. **Register primitive skill**: `search_knowledge` is registered with `SearchInput`/`SearchOutput` schemas, a lambda implementation that returns mock results, and metadata including tags and preconditions.
3. **Register composite skill**: `generate_report` is registered with a real implementation (`generate_report_impl`) that internally calls `registry.invoke("search_knowledge", ...)` — demonstrating skill composition where one skill depends on another.
4. **Discover skills**: `get_catalog()` iterates all registered skills and returns their name, description, input/output JSON schemas, tags, and preconditions — this is what an LLM would see to decide which skill to use.
5. **Invoke skills**: `invoke("search_knowledge", query="Q3 revenue")` validates the input against `SearchInput`, executes the lambda, validates the output against `SearchOutput`, and returns `{"status": "success", "output": ...}`.
6. **Invoke composite skill**: `invoke("generate_report", topic="Q3 revenue")` triggers the composite implementation, which calls `search_knowledge` internally, then formats a report.
7. **Test input validation**: Calling `invoke("generate_report")` without the required `topic` parameter triggers Pydantic's `ValidationError`, which is caught and returned as a structured error response.

### Important Variables

- `self._skills`: Dictionary mapping skill name to its full registration (metadata, schemas, implementation, category).
- `self._categories`: Dictionary mapping category name to list of skill names for filtered discovery.
- `preconditions` in metadata: Lists requirements that must be met before a skill can be invoked (e.g., `["authenticated", "search_knowledge:available"]`).

## Key Takeaways

- **Schema-driven validation**: Using Pydantic models for input/output schemas ensures that skills receive correctly typed data and produce conformant outputs, catching errors before execution.
- **Composite skills**: Skills can call other skills internally (`generate_report` calls `search_knowledge`), enabling complex workflows built from primitive building blocks.
- **LLM discovery catalog**: The `get_catalog()` method exposes skill metadata and JSON schemas in a format an LLM can parse to decide which tool to invoke — this is the core mechanism behind function calling in modern LLM APIs.
- **Preconditions and metadata**: Skills carry cost estimates, latency estimates, and preconditions that enable intelligent routing and orchestration decisions.
- **Error handling**: Input validation errors and execution errors are caught and returned as structured responses rather than throwing exceptions, making the registry robust and predictable.

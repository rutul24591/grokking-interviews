# Example 1: Prompt Template Engine with Version Tracking

## How to Run

```bash
python demo.py
```

**Dependencies:** None beyond the Python standard library. This example uses only built-in modules (`dataclasses`, `typing`, `datetime`, `hashlib`).

---

## What This Demonstrates

This example implements a **production-grade prompt template registry** that supports versioning, parameterized rendering, and A/B testing between prompt variants. It shows how to treat prompts as first-class artifacts — with fingerprints, version history, and active-version management — rather than hardcoded strings scattered through a codebase.

---

## Code Walkthrough

### Key Classes

#### `PromptTemplate` (dataclass)

Represents a single versioned prompt template.

| Field | Type | Purpose |
|---|---|---|
| `name` | `str` | Logical identifier for the prompt (e.g. `"code_review"`) |
| `version` | `str` | Semantic version string (e.g. `"1.0"`, `"2.0"`) |
| `template` | `str` | The actual prompt text with `{placeholder}` parameters |
| `description` | `str` | Human-readable description of this version |
| `parameters` | `list[str]` | List of required parameter names that must be supplied at render time |
| `created_at` | `str` | ISO-format timestamp, auto-generated on instantiation |
| `metadata` | `Dict[str, Any]` | Arbitrary key-value data for extensibility |

**Important methods:**

- **`render(**kwargs) -> str`** — Uses Python's `str.format()` to substitute keyword arguments into the template. Validates that all declared `parameters` are present; raises `ValueError` listing any missing ones.
- **`fingerprint` (property)** — Computes a 12-character SHA-256 hash of `name:version:template`. This provides a content-addressable identifier useful for detecting when a template has changed (e.g. for cache invalidation or audit logs).

#### `PromptRegistry`

Central registry that manages the lifecycle of prompt templates.

| Internal Attribute | Type | Purpose |
|---|---|---|
| `_templates` | `Dict[str, Dict[str, PromptTemplate]]` | Nested dict: `template_name -> version -> PromptTemplate`. Allows multiple versions of the same named template to coexist. |
| `_active` | `Dict[str, str]` | Maps each template name to its currently active version string. |
| `_ab_tests` | `Dict[str, Dict[str, float]]` | Stores A/B test configurations: template name -> `{version: normalized_weight}`. |

**Important methods:**

- **`register(template, activate=True)`** — Adds a template version to the registry. If `activate` is `True` (default), this version becomes the active one for its name.
- **`get(name, version=None)`** — Retrieves a specific version, or the active version if `version` is `None`. Raises `KeyError` if the template or version does not exist.
- **`set_ab_test(name, weights)`** — Configures A/B testing by normalizing the provided weights so they sum to 1.0. (The actual sampling logic is not implemented in this demo, but the data structure is prepared.)
- **`render_active(name, **kwargs) -> tuple[str, str]`** — Convenience method that renders the active version and returns both the rendered prompt string and the version used.

### Execution Flow (`main()`)

1. **Create registry** — `registry = PromptRegistry()`
2. **Register v1.0** — A basic code review prompt with parameters `language` and `code_diff`. `activate=True` by default, so v1.0 becomes active.
3. **Register v2.0** — An enhanced version with a structured review framework (Security, Performance, Quality), an additional `related_context` parameter, and a specified JSON output schema. Because `activate=True` (default), v2.0 **replaces** v1.0 as the active version.
4. **Render active version** — Calls `registry.render_active("code_review", ...)` with three parameters. Since v2.0 is active, it renders the enhanced template.
5. **Print results** — Displays the rendered prompt, the active version number, and the total number of registered versions.

### Key Variables in `main()`

| Variable | Value |
|---|---|
| `language` | `"Python"` |
| `code_diff` | A diff showing a vulnerable change from ORM query to raw SQL (SQL injection) |
| `related_context` | `"Project uses SQLAlchemy. All queries should use the ORM, not raw SQL."` |

---

## Key Takeaways

- **Prompts are versioned artifacts**, not inline strings. Each version has a fingerprint, timestamp, and explicit parameter contract, enabling audit trails and safe rollbacks.
- **The registry pattern** decouples prompt definition from prompt usage. Callers reference prompts by name and let the registry resolve which version is active, making it trivial to swap prompts without changing calling code.
- **A/B testing infrastructure** is built in via weight-normalized version distributions, allowing data-driven prompt iteration in production systems.
- **Parameter validation at render time** prevents silent failures — missing parameters raise an explicit error listing exactly what is absent.
- **v2.0 demonstrates prompt engineering evolution**: it adds a structured review framework (Security → Performance → Quality), extra context injection, and a strict JSON output schema, illustrating how prompts mature over iterations.

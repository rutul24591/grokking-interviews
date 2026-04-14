# Example 3: Structured Output Validator with Auto-Retry

## How to Run

```bash
python demo.py
```

**Dependencies:** Requires [Pydantic](https://docs.pydantic.dev/), a data-validation library.

```bash
pip install pydantic
```

---

## What This Demonstrates

This example implements a **production-ready output validation pipeline** that enforces a JSON schema on LLM responses and automatically retries when validation fails. It uses Pydantic models to define the expected structure, catches both JSON parse errors and schema validation errors, and logs detailed per-field error messages — illustrating how to build reliability into LLM integrations where structured output is required.

---

## Code Walkthrough

### Key Classes (Pydantic Models)

#### `Finding` (BaseModel)

Represents a single code review finding.

| Field | Type | Constraints |
|---|---|---|
| `severity` | `str` | Must match pattern: `critical`, `high`, `medium`, or `low` |
| `category` | `str` | Free-text category (e.g. `security`, `performance`, `quality`) |
| `line` | `int` | Must be greater than 0 (`gt=0`) |
| `description` | `str` | Between 10 and 500 characters |
| `suggestion` | `str` | Between 10 and 500 characters |

#### `CodeReviewResponse` (BaseModel)

Represents the complete structured output from the LLM.

| Field | Type | Constraints |
|---|---|---|
| `summary` | `str` | Between 20 and 200 characters |
| `overall_risk` | `str` | Must match pattern: `low`, `medium`, `high`, or `critical` |
| `findings` | `List[Finding]` | Between 0 and 50 findings |
| `score` | `int` | Between 0 and 100 inclusive (`ge=0, le=100`) |

These models serve as the **single source of truth** for the expected output shape. If the LLM returns anything that does not conform, Pydantic raises a `ValidationError` with precise per-field error descriptions.

### Key Functions

#### `validate_and_retry(llm_response: str, max_retries: int = 3) -> Optional[CodeReviewResponse]`

The core validation loop. For each attempt (up to `max_retries`):

1. **Parse JSON** — `json.loads(llm_response)`. If the string is not valid JSON, catches `json.JSONDecodeError`.
2. **Validate against schema** — `CodeReviewResponse(**data)`. If the parsed JSON does not satisfy the Pydantic model constraints, catches `ValidationError`.
3. **On success** — Returns the validated `CodeReviewResponse` object.
4. **On failure** — Logs the error (including per-field details for `ValidationError`) and would, in production, re-prompt the LLM with the error message to request a corrected response.
5. **After all retries exhausted** — Returns `None`.

**Error types handled:**

| Exception | Example Trigger |
|---|---|
| `json.JSONDecodeError` | Malformed JSON (e.g. `[}` instead of `[]`) |
| `ValidationError` | Missing required field, invalid enum value, score out of range, line number ≤ 0, string too short/long |
| `Exception` (catch-all) | Any other unexpected error |

### Test Data

#### `BROKEN_OUTPUTS` (4 cases)

| # | Error | Why It Fails |
|---|---|---|
| 1 | Missing `line` field in a `Finding` | `Finding.line` is required; Pydantic raises `ValidationError` |
| 2 | `overall_risk: "very_high"` | Does not match the allowed pattern (`low|medium|high|critical`) |
| 3 | `score: 150` | Exceeds maximum of 100 (`le=100`) |
| 4 | `{"findings": [}` | Invalid JSON syntax — unmatched bracket |

#### `GOOD_OUTPUT`

A well-formed response with:
- A 20–200 character summary
- `overall_risk: "high"` (valid pattern match)
- Two findings, each with all required fields and valid constraint values
- `score: 35` (within 0–100)

### Execution Flow (`main()`)

```
print header

for each broken_output in BROKEN_OUTPUTS:
    result = validate_and_retry(broken_output, max_retries=3)
    print "FAILED after 3 retries"  (since none include retry logic with corrected LLM response)

result = validate_and_retry(GOOD_OUTPUT)
print summary, risk, score, findings count
for each finding:
    print severity, line, category, description preview
```

Note: The broken outputs all fail because `validate_and_retry` retries with the **same** `llm_response` string. In production, each retry would call the LLM again with an error-feedback prompt (e.g. `"Fix the JSON: <error message>"`), which is noted in the commented-out code.

### Key Variables

| Variable | Purpose |
|---|---|
| `errors_log` | Accumulates error messages across retry attempts for audit/debugging |
| `attempt` | Loop counter (0 to `max_retries - 1`) |
| `validated` | The successfully parsed `CodeReviewResponse` object |

---

## Key Takeaways

- **Never trust raw LLM output**: LLMs frequently produce malformed JSON or responses that drift from the expected schema. A validation layer with explicit retries is essential for production reliability.
- **Pydantic provides rich, per-field error messages**: Unlike basic JSON parsing, Pydantic's `ValidationError` tells you exactly which field failed and why (e.g. `"score: ensure this value is less than or equal to 100"`), enabling targeted error feedback to the LLM on retry.
- **The retry-with-feedback pattern** is the standard approach for structured LLM output: validate → if error, feed the error back to the LLM → re-validate. This demo implements the validation skeleton; the actual LLM re-call is left as a commented placeholder.
- **Schema-as-code**: Defining `Finding` and `CodeReviewResponse` as Pydantic models gives you type-safe Python objects downstream. Any code that receives the validated result can rely on correct types, valid enums, and constraint-satisfying values without additional checks.
- **Constraint design matters**: The models use a mix of `pattern` (regex enum), `gt`/`ge`/`le` (numeric bounds), and `min_length`/`max_length` (string bounds) — covering the full range of validation needs for structured LLM output. Each constraint should be chosen deliberately based on what the downstream system requires.
- **Max retries should be tuned**: Three retries is a reasonable default. Too few and you miss correctable errors; too many and you waste tokens and latency. In production, this should be configurable per-prompt and potentially backed off exponentially.

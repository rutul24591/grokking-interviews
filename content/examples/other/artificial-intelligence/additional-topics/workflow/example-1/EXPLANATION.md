# AI Workflow Pipeline with Quality Gates

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `random`).

## What This Demonstrates

This example implements a production-grade AI workflow pipeline with quality gates at each stage, retry logic on transient failures, fallback paths when the primary LLM call fails, and structured error handling that tracks exactly which stage succeeded or failed.

## Code Walkthrough

### Key Classes

- **`PipelineResult`** (dataclass): Represents the outcome of a pipeline execution with `success` boolean, `output`, `error` message, `stage` (the last stage reached), and `retries` count.
- **`QualityGate`**: A static utility class with three validation methods:
  - `validate_format()`: Checks if output contains expected keys/structure.
  - `validate_length()`: Ensures output is within min/max character bounds.
  - `validate_safety()`: Checks for blocked/inappropriate terms.
- **`AIWorkflowPipeline`**: The core pipeline class managing multi-stage execution with retries and fallbacks.

### Pipeline Stages

1. **Input Validation**: Checks that user input is not empty and has a minimum length (5 characters).
2. **Prompt Construction**: Wraps the user input in a structured prompt template.
3. **LLM Call**: Calls the LLM with a 10% simulated failure rate (TimeoutError). On failure, retries up to `max_retries` times. If all retries fail, a fallback response is used.
4. **Output Validation**: Runs length and safety checks on the LLM output.
5. **Format and Deliver**: Wraps the output in a structured response dictionary with metadata.

### Key Methods

- **`_run_stage(stage_name, func, *args, **kwargs)`**: Generic stage runner with retry logic. Attempts the function up to `max_retries + 1` times. On success, logs the event and returns. On failure after all retries, returns a failed `PipelineResult`.
- **`run(user_input)`**: The main pipeline entry point. Executes all five stages sequentially, short-circuiting on validation failures and using fallbacks for LLM failures.

### Execution Flow

1. **`main()`** creates a pipeline with `max_retries=2` and tests three inputs:
   - A valid long query (should succeed through all stages).
   - "Short" (too short, fails input validation).
   - A valid comparison query (should succeed through all stages).
2. Each test case prints whether it succeeded, which stage was reached, any errors, and the output.
3. The execution log shows the complete stage-by-stage event timeline with retry counts.

### Important Variables

- `max_retries = 2`: Maximum retry attempts per stage before failure/fallback.
- `blocked_terms = ["hack", "exploit", "bypass"]`: Safety gate blocking list.
- `random.random() < 0.1`: 10% simulated LLM failure rate for testing retry logic.
- `random.seed(42)`: Ensures reproducible test results.

## Key Takeaways

- Quality gates at each pipeline stage prevent bad inputs from reaching expensive LLM calls and bad outputs from reaching users.
- Retry logic with bounded attempts handles transient failures (timeouts, rate limits) without infinite loops.
- Fallback paths (e.g., cached/simpler responses) ensure graceful degradation when the primary LLM is unavailable.
- Structured error reporting (which stage failed, how many retries) is essential for debugging production AI incidents.
- Production pipelines add additional gates: PII detection, toxicity scoring, factual consistency checks, and output format validation against schemas.

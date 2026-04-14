# Benchmark Dataset Management for AI Evaluation

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `datetime`, `json`).

## What This Demonstrates

This example implements a benchmark dataset management system for AI evaluation, supporting dataset versioning, automated benchmark testing against generate functions, quality regression detection, per-category performance breakdown, and dataset augmentation from production edge cases.

## Code Walkthrough

### Key Classes

- **`BenchmarkExample`** (dataclass): Represents a single test case with `input_text`, `expected_output`, `category`, `difficulty` (easy/medium/hard), `added_date`, and `source` (manual/production/edge_case).
- **`BenchmarkResult`** (dataclass): Represents the result of running a benchmark test with `example`, `actual_output`, `score` (0.0-1.0), `passed` boolean, and optional `failure_reason`.
- **`BenchmarkDataset`**: The core dataset manager supporting example management, benchmark execution, reporting, and production-based augmentation.

### Key Methods

1. **`add_example(example)`**: Adds a manually curated benchmark example to the dataset.
2. **`add_from_production(input_text, correct_output, category, difficulty)`**: Augments the dataset with examples collected from production edge cases, tagged with `source="production"`.
3. **`run_benchmark(generate_fn)`**: Runs the entire dataset against a generate function (representing a prompt or model). For each example:
   - Calls the generate function with the input text.
   - Computes a word-overlap similarity score between the actual output and expected output.
   - Marks the example as passed if score >= 0.3 threshold.
   - Catches exceptions and records them as failures.
4. **`get_report()`**: Generates a comprehensive benchmark report including overall pass rate, average score, and per-category breakdown with pass rates and average scores.

### Execution Flow

1. **`main()`** creates a benchmark dataset "customer_support_eval" v1.0.0.
2. Three seed examples are added covering account (easy), billing (medium), and sales (hard) categories.
3. A simulated generate function is defined that returns pre-programmed responses based on keyword matching.
4. The benchmark is run, and the report shows overall pass rate, average score, and per-category performance.
5. The dataset is augmented with a production edge case (API rate limit exceeded), demonstrating how real-world failures are captured for future regression testing.

### Important Variables

- `score >= 0.3`: Minimum word-overlap similarity threshold for passing a benchmark example.
- `source`: Tracks where the example came from -- "manual" (curated), "production" (collected from real usage), or "edge_case".
- `by_category`: Per-category breakdown enabling identification of weak areas (e.g., the system may perform well on easy queries but poorly on hard ones).

## Key Takeaways

- Benchmark datasets provide a standardized, repeatable evaluation mechanism for detecting quality regressions when prompts or models change.
- Version-controlled datasets with per-category breakdowns enable targeted improvement -- teams can identify which categories need the most work.
- Production edge case augmentation ensures the benchmark evolves with real-world usage patterns, preventing blind spots.
- Word-overlap scoring is a simple baseline; production systems use embedding similarity, LLM-as-judge, or exact-match scoring depending on the use case.
- Benchmark datasets are a foundational component of CI/CD for AI systems -- every prompt or model change should be tested against the benchmark before deployment.

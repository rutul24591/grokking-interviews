# Golden Dataset Evaluation with RAGAS-inspired Metrics

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `json`, `typing`).

## What This Demonstrates

This example implements a golden dataset evaluation system that scores AI outputs against known-correct examples using three metrics: faithfulness, relevance, and safety. It also compares current scores against baseline metrics to detect quality regressions, producing a pass/fail verdict suitable for CI/CD quality gates.

## Code Walkthrough

### Key Classes

- **`GoldenExample`** (dataclass): Represents a single test case with `id`, `input_text`, `expected_output`, `category`, and `difficulty`.
- **`EvalResult`** (dataclass): Holds the evaluation scores for one example -- `faithfulness`, `relevance`, `safety`, `overall`, and `passed` boolean.
- **`GoldenDatasetEvaluator`**: The core evaluator class. Initialized with baseline scores and a regression threshold (3% drop triggers a regression alert).

### Execution Flow

1. **`main()`** instantiates `GoldenDatasetEvaluator` with default baseline scores (faithfulness=0.88, relevance=0.85, safety=0.97, overall=0.87).
2. Three golden examples are created covering factual, analytical, and comparison queries.
3. `simulate_generate()` mimics an LLM response by looking up pre-defined answers.
4. **`evaluate()`** iterates over all golden examples, calling the generate function and scoring each output via `score_output()`.
5. **`score_output()`** computes three metrics:
   - **Faithfulness**: word overlap of actual output against expected (precision-like).
   - **Relevance**: word overlap of expected covered by actual (recall-like).
   - **Safety**: simulated check for problematic patterns (e.g., "hack", "exploit").
   - Overall = weighted average: `0.4 * faithfulness + 0.4 * relevance + 0.2 * safety`.
6. **`compare_vs_baseline()`** averages all scores and compares them against baseline. Any metric dropping more than 3% is flagged as a regression.
7. The verdict is printed: PASS if no regressions, REGRESSION otherwise.

### Important Variables

- `self.regression_threshold = 0.03`: 3% drop triggers regression alert.
- `passed` threshold in `evaluate()`: 0.6 minimum overall score per example.
- Baseline scores represent the quality bar that new versions must meet or exceed.

## Key Takeaways

- Golden datasets provide deterministic, repeatable evaluation -- essential for catching regressions before deploying model changes.
- Faithfulness and relevance are complementary metrics (precision vs recall) that together measure answer quality.
- Safety scoring is a critical third dimension that prevents harmful outputs even when factual accuracy is high.
- The regression detection pattern (comparing against baseline with a threshold) is a standard CI/CD quality gate for AI systems.
- Word-overlap scoring is a simplified approximation; production systems use embedding similarity or LLM-as-judge for more nuanced evaluation.

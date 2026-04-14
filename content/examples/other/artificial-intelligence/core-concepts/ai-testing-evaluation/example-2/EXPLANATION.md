# LLM-as-a-Judge Evaluation System

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `List`, `Dict`, `Any`).

## What This Demonstrates

This example implements the LLM-as-a-judge pattern, where a separate evaluator LLM scores the primary model's outputs across multiple quality dimensions (correctness, completeness, clarity, helpfulness). It also demonstrates calibration against human judgments to detect and quantify evaluator bias.

## Code Walkthrough

### Key Classes

- **`EvaluationCriteria`** (dataclass): Defines a scoring dimension with `name`, `description`, `weight`, and a `prompt_template` for the judge prompt.
- **`JudgeResult`** (dataclass): Holds per-criteria scores, the weighted aggregate score, judge confidence, and reasoning text.
- **`LLMJudge`**: The core judge class. Defines four criteria with weights summing to 1.0: correctness (0.35), completeness (0.25), clarity (0.20), helpfulness (0.20).

### Execution Flow

1. **`main()`** creates an `LLMJudge` instance and three test cases spanning factual, analytical, and comparison queries.
2. For each test case, `evaluate()` calls `simulate_judge_score()` for all four criteria.
3. **`simulate_judge_score()`** models how an LLM judge would score:
   - A base score of 7.0/10 is used as a starting point.
   - Correctness gets a bonus for answers containing specific numbers/facts.
   - Completeness gets a bonus proportional to answer length (demonstrating a known LLM judge bias toward verbosity).
   - Clarity gets a bonus for answers with sentence boundaries (". ").
   - Helpfulness gets a length bonus similar to completeness.
   - Final score is normalized to 0-1 range.
4. The weighted score is computed as the dot product of criteria scores and their weights.
5. **`calibrate_against_human()`** compares judge averages against human averages per criteria to quantify bias (overestimation or underestimation).
6. The calibration report shows which criteria the judge overestimates or underestimates and by how much.

### Important Variables

- `CRITERIA`: Class-level list of four `EvaluationCriteria` objects with weights summing to 1.0.
- `self.human_calibration`: Stores human scores for bias analysis.
- `base_score = 7.0`: The simulated judge's starting point before applying bonuses.

## Key Takeaways

- LLM-as-a-judge is cost-effective for automated evaluation but has systematic biases (e.g., favoring longer, more detailed answers).
- Calibration against human judgments is essential to understand and correct for evaluator bias before trusting automated scores.
- Weighted multi-criteria scoring provides more nuanced evaluation than a single aggregate score.
- The correctness criterion should weigh most heavily (0.35 here) since factual accuracy is the primary quality dimension.
- Production systems should use actual LLM API calls rather than simulated scoring, and maintain ongoing human-judge calibration datasets.

# LLM-Assisted Labeling Pipeline

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `List`, `Dict`, `Any`).

## What This Demonstrates

This example implements a human-in-the-loop labeling pipeline where an LLM generates draft labels for a dataset, high-confidence labels are auto-accepted, and low-confidence labels are routed for human review. It also includes a calibration report that tracks LLM labeling accuracy across different confidence buckets.

## Code Walkthrough

### Key Classes

- **`LabeledExample`** (dataclass): Represents a labeled example with `id`, `input_text`, `llm_label`, `llm_confidence`, `human_label`, `needs_review` flag, and `agreed` flag (whether LLM and human labels match).
- **`LLMAssistedLabeler`**: The core labeling pipeline class managing LLM label generation, human review routing, auto-acceptance, and calibration reporting.

### Key Methods

1. **`generate_llm_label(input_text)`**: Simulates LLM label generation with confidence scores. Returns a label (positive/negative/neutral) and a confidence value (0.50-0.92). In production, this calls an actual LLM API.
2. **`label_dataset(inputs)`**: Labels all input examples with LLM-generated labels. Sets `needs_review=True` for examples below the confidence threshold.
3. **`auto_accept_high_confidence()`**: Auto-accepts labels where LLM confidence exceeds the threshold (0.85 by default). Returns count of auto-accepted examples.
4. **`human_review(example_id, human_label)`**: Applies a human label to a specific example, marks it as reviewed, and sets whether the LLM label agreed with the human label.
5. **`get_calibration_report()`**: Produces a calibration report showing overall LLM accuracy, accuracy by confidence bucket, and how many examples still need review.

### Execution Flow

1. **`main()`** creates a labeler with a confidence threshold of 0.85.
2. Eight input examples with varying sentiment cues are labeled by the LLM.
3. High-confidence labels (>= 0.85) are auto-accepted without human review.
4. Three remaining examples (with lower confidence) receive human labels.
5. A calibration report shows overall LLM accuracy and per-bucket accuracy.

### Important Variables

- `confidence_threshold = 0.85`: Labels above this are auto-accepted; below it, human review is required.
- `needs_review`: Boolean flag indicating whether an example requires human review.
- `agreed`: Boolean flag tracking whether the LLM label matched the human label.

## Key Takeaways

- LLM-assisted labeling dramatically reduces human labeling costs by auto-accepting high-confidence labels and only routing uncertain cases to humans.
- The confidence threshold is a tunable trade-off: higher thresholds mean more human review (safer but more expensive); lower thresholds mean more auto-acceptance (cheaper but riskier).
- Calibration reports are essential for tracking LLM labeling accuracy over time and identifying confidence ranges where the LLM is unreliable.
- This pattern is particularly effective for sentiment analysis, intent classification, and other categorical labeling tasks where LLMs perform well on clear cases.
- Production systems should periodically re-evaluate auto-accepted labels with human spot-checks to detect accuracy drift.

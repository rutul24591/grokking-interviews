# Human-in-the-Loop Approval Workflow

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `enum`).

## What This Demonstrates

This example implements a human-in-the-loop (HITL) approval workflow where an AI generates draft outputs, humans review and approve/edit/reject them, high-confidence outputs can be auto-approved, and quality metrics are tracked to measure AI performance and human editing effort over time.

## Code Walkthrough

### Key Classes

- **`ApprovalStatus`** (Enum): Represents the possible human decisions: PENDING, APPROVED, EDITED, REJECTED, ESCALATED.
- **`ReviewRecord`** (dataclass): Records a single review event with `item_id`, `ai_output`, `human_decision`, optional `human_edit` text, `confidence` of the AI, and `review_time_seconds`.
- **`HITLWorkflow`**: The core workflow class managing draft generation, review processing, auto-approval, and quality metrics calculation.

### Key Methods

1. **`generate_draft(input_data)`**: Simulates AI draft generation with a confidence score between 0.70 and 0.99. If confidence exceeds `auto_approve_threshold` (0.95), the draft is marked for auto-approval.
2. **`process_item(item_id, input_data, human_action, human_edit)`**: Processes a single item through the HITL workflow:
   - Generates an AI draft with confidence.
   - Auto-approves if confidence >= threshold and human hasn't acted yet.
   - Records the review decision and tracks edit distance (ratio of edit length to draft length).
   - Returns the final output (edited text if human edited, otherwise the AI draft).
3. **`get_quality_metrics()`**: Calculates aggregate metrics: approval rate, edit rate, rejection rate, average AI confidence, and average edit distance.

### Execution Flow

1. **`main()`** creates a workflow with `auto_approve_threshold=0.95`.
2. Five items are processed with different human actions:
   - **item-1**: Approved as-is (AI draft accepted).
   - **item-2**: Edited by human (AI draft revised with updated data).
   - **item-3**: Approved as-is.
   - **item-4**: Escalated (requires further review).
   - **item-5**: Rejected (AI draft unusable).
3. Each item shows its AI confidence, auto-approve status, and human decision.
4. Quality metrics summarize the overall review performance: approval rate, edit rate, rejection rate, average confidence, and average edit distance.

### Important Variables

- `auto_approve_threshold = 0.95`: AI drafts with confidence >= 95% bypass human review.
- `edit_distance`: Ratio of human edit length to draft length -- measures how much the human had to change.
- `self.reviews`: List of all review records for metric calculation.
- `self.edit_distance_log`: Tracks edit distances for items that were human-edited.

## Key Takeaways

- HITL workflows balance automation with human oversight -- high-confidence AI outputs are auto-approved to reduce human workload, while uncertain outputs get human review.
- Quality metrics (approval rate, edit rate, rejection rate) track AI performance over time and identify areas where the AI needs improvement.
- Edit distance measures the effort required from human reviewers -- high edit distances indicate poor AI draft quality.
- The auto-approve threshold is a tunable parameter: higher thresholds mean more human review (safer but slower), lower thresholds mean more automation (faster but riskier).
- Production HITL systems add continuous learning: human edits are fed back into the AI training pipeline to improve future draft quality, creating a virtuous improvement loop.

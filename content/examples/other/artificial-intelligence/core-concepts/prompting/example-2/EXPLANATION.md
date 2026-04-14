# Example 2: Chain-of-Thought vs Direct Prompting Comparison

## How to Run

```bash
python demo.py
```

**Dependencies:** None beyond the Python standard library. Only built-in modules (`time`, `typing`) are used.

---

## What This Demonstrates

This example compares **direct prompting** (ask the model for an answer immediately) against **chain-of-thought (CoT) prompting** (ask the model to reason step by step before answering). It uses simulated LLM responses across three task types — math, logic, and debugging — and evaluates each response on four quality metrics to quantify the improvement CoT provides.

---

## Code Walkthrough

### Key Functions

#### `simulate_direct_prompt(prompt: str) -> str`

Simulates what a model outputs when given a direct (non-reasoning) prompt. Returns brief, one-line answers with no explanation:

| Task | Simulated Response |
|---|---|
| `math` | `"The answer is 17."` |
| `logic` | `"Yes, the conclusion is correct."` |
| `debug` | `"The bug is in the authentication module."` |

The function detects the task type by checking if the task keyword appears in the prompt text.

#### `simulate_cot_prompt(prompt: str) -> str`

Simulates a chain-of-thought response. Each response follows a **step-by-step reasoning pattern**:

- **Math**: Identifies equation type, isolates the variable algebraically, self-corrects a miscalculation, then states the answer.
- **Logic**: Lays out premises, applies deductive reasoning step by step, verifies the conclusion follows.
- **Debug**: Traces the error through the stack, identifies the root cause (missing `algorithms` parameter in `jwt.decode()`), and explains the security implication (JWT `none` algorithm attack).

The key differentiator: CoT responses are **longer, self-correcting, and explain how the answer was reached** rather than just stating the answer.

#### `evaluate_response(response, expected_answer, criteria) -> Dict[str, float]`

Scores a response on four dimensions (each scored 0.0 to 1.0):

| Criterion | How It Is Computed |
|---|---|
| `correctness` | `1.0` if the expected answer substring appears in the response (case-insensitive), else `0.3`. |
| `reasoning_depth` | Scales with word count (`len(response.split()) / 50`), multiplied by `1.5` if step markers are present, or `0.5` otherwise. Capped at `1.0`. |
| `explainability` | `0.9` if step markers (`"step"` or `"let me"`) are present, else `0.2`. |
| `actionability` | `0.8` if the response has step markers **and** exceeds 100 characters, else `0.4`. |

#### `main()`

Runs the comparison across three test cases:

1. **Math** — Solve `3x + 5 = 56`. Expected answer: `17`.
2. **Logic** — Syllogism about engineers who write tests. Expected answer: `yes`.
3. **Debug** — JWT decoding vulnerability. Expected answer: `algorithm`.

For each test case:
1. Generate a direct response and score it.
2. Append `"Think step by step."` to the base prompt, generate a CoT response, and score it.
3. Print both responses with their token counts and individual scores.
4. Compute average quality scores and the percentage improvement CoT provides over direct prompting.

### Execution Flow

```
for each test_case in [math, logic, debug]:
    direct_response  = simulate_direct_prompt(prompt)
    direct_scores    = evaluate_response(direct_response, expected)

    cot_prompt        = prompt + "Think step by step."
    cot_response      = simulate_cot_prompt(cot_prompt)
    cot_scores        = evaluate_response(cot_response, expected)

    print both responses, scores, and improvement percentage
```

### Key Variables

| Variable | Purpose |
|---|---|
| `test_cases` | List of three dicts, each with `task`, `prompt_base`, and `expected` answer |
| `direct_scores` / `cot_scores` | Dicts mapping criterion name to a float score |
| `improvement` | Percentage change: `((avg_cot - avg_direct) / avg_direct) * 100` |

---

## Key Takeaways

- **Chain-of-thought prompting** (`"Think step by step."`) forces the model to externalize its reasoning process, which measurably improves correctness, explainability, and actionability — especially for tasks requiring multi-step deduction.
- **Self-correction is a hallmark of CoT**: the math example shows the model catching and fixing its own arithmetic error mid-reasoning, a behavior rarely seen in direct responses.
- **Evaluation metrics matter**: the four-criterion scoring system (correctness, reasoning depth, explainability, actionability) provides a structured way to compare prompting strategies beyond "does it look right."
- **The improvement is substantial**: CoT responses are typically 3–5× longer and score significantly higher across all metrics because they expose intermediate reasoning steps that can be verified or challenged.
- **CoT is not universally necessary**: for simple factual questions, direct prompting is faster and cheaper. CoT shines on reasoning-heavy tasks (math proofs, logical deduction, root-cause analysis) where the path to the answer matters as much as the answer itself.
- **In production, CoT responses consume more tokens** (higher latency and cost), so the decision to use CoT should be driven by task complexity and the value of explainability in the given context.

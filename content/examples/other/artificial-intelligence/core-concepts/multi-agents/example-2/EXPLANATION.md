# Example 2: Debate Pattern — Independent Analysis with Judge

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`dataclasses`, `random`). No external packages required.

## What This Demonstrates

This example implements the **debate pattern** where multiple AI agents independently analyze the same question, potentially using different underlying models, and a judge agent compares their answers to find consensus or select the best response. This pattern is used in production systems to improve answer quality through diverse reasoning — different models have different strengths (e.g., GPT-4 excels at reasoning, Claude at code review, Gemini at creative tasks), and combining their outputs reduces individual model blind spots and biases.

## Code Walkthrough

### Key Classes and Data Structures

- **`AgentAnswer`** (dataclass): Holds a single agent's answer including agent name, underlying model name, the answer itself, the reasoning behind it, and a confidence score (0.0 to 1.0).
- **`DebateJudge`**: A static utility class that evaluates multiple agent answers and selects the best one. The `evaluate()` method:
  - Groups answers by their answer text to find consensus.
  - Identifies the most common answer (the consensus winner).
  - Calculates average confidence among agents that gave the consensus answer.
  - Determines the verdict: `strong_consensus` (all agents agree), `majority` (more than half agree), or `no_consensus` (no clear winner).
- **`simulate_agent_analysis()`**: Simulates an agent's analysis of a question using a pre-defined lookup table. Different models have different predefined answers for different question types, capturing real model behavior differences (e.g., Gemini misses a SQL injection vulnerability that GPT-4 and Claude both catch).

### Execution Flow (Step-by-Step)

1. **Define questions**: Two questions are tested — `code_review` (detecting SQL injection) and `math` (solving a linear equation).
2. **For each question**:
   - Three agents independently analyze the question, each using a different simulated model (GPT-4, Claude-3, Gemini).
   - `simulate_agent_analysis()` returns a pre-defined `AgentAnswer` based on the model and question type.
   - Each agent's answer and confidence is printed.
3. **Judge evaluation**: `DebateJudge.evaluate()` groups the three answers by answer text:
   - For `code_review`: GPT-4 and Claude both answer "has_sql_injection" (consensus of 2/3), Gemini answers "no_issues" (disagreement). Verdict: `majority`.
   - For `math`: GPT-4 and Claude both answer "42" (consensus of 2/3), Gemini answers "44" (incorrect). Verdict: `majority`.
4. **Print verdict**: Shows the selected answer, consensus count, verdict classification, average confidence, and number of disagreeing agents.

### Important Variables

- `answer_groups` (in `evaluate()`): Dictionary mapping answer text to list of agents that gave that answer — this is the core consensus-finding mechanism.
- `consensus_count` and `disagreement`: Track how many agents agree vs. disagree, determining the verdict strength.
- Model-specific analyses in `simulate_agent_analysis()`: Demonstrates that different models produce different answers with different confidence levels for the same question.

## Key Takeaways

- **Diverse model strengths**: Different models have different capabilities — GPT-4 and Claude correctly identify the SQL injection vulnerability, while Gemini misses it. The debate pattern surfaces these differences and lets the judge select the majority answer.
- **Consensus-based quality**: When multiple independent agents arrive at the same answer, confidence in that answer increases significantly — this is the core value proposition of the debate pattern.
- **Confidence as a signal**: Each agent provides a confidence score, and the judge calculates average confidence among agreeing agents. High-confidence disagreement (e.g., Gemini's 0.6 confidence in "no_issues") flags areas needing human review.
- **Independent analysis**: Agents analyze the question independently without seeing each other's answers, preventing anchoring bias — this is critical for getting genuinely diverse perspectives.
- **Verdict classification**: The three-tier verdict (`strong_consensus`, `majority`, `no_consensus`) provides a clear signal about answer reliability — strong consensus answers can be auto-applied, while no-consensus answers should be escalated to humans.

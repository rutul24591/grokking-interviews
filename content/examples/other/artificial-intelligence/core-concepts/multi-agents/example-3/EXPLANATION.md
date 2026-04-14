# Example 3: Agent Conflict Resolution Strategies

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`dataclasses`). No external packages required.

## What This Demonstrates

This example implements multiple **conflict resolution strategies** for when agents in a multi-agent system produce conflicting opinions or recommendations. Using a realistic scenario — agents disagreeing on whether to use microservices or a monolith for a given project — it demonstrates four strategies: simple majority voting, confidence-weighted voting, evidence-based selection, and a combined approach that runs all strategies. This pattern is essential in production multi-agent systems where disagreement is expected and must be resolved systematically.

## Code Walkthrough

### Key Classes and Data Structures

- **`AgentOpinion`** (dataclass): Represents a single agent's opinion on a decision, including:
  - `agent_id` — unique identifier for the agent.
  - `position` — the agent's recommended decision (e.g., "use_microservices" or "use_monolith").
  - `confidence` — the agent's confidence in its position (0.0 to 1.0).
  - `evidence` — a list of supporting evidence items (strings) backing the position.
  - `reasoning` — a narrative explanation of the agent's rationale.
- **`ConflictResolver`**: A static utility class implementing four resolution strategies:
  - **`voting()`** — Simple majority: counts votes per position, returns the position with the most votes and whether it has a true majority (>50%).
  - **`confidence_weighted()`** — Weighted by confidence: sums confidence scores per position, returns the position with the highest total confidence score.
  - **`evidence_based()`** — Weighted by evidence: counts evidence items per position, returns the position with the most total evidence.
  - **`resolve_all()`** — Runs all three strategies and returns a combined result for comparison.

### Execution Flow (Step-by-Step)

1. **Create conflicting opinions**: Three agents provide opinions on an architecture decision:
   - **Agent 1**: Recommends microservices (confidence 0.8) with 3 evidence items (team size, independent deployments, scaling needs).
   - **Agent 2**: Recommends monolith (confidence 0.7) with 3 evidence items (small team, early stage, operational overhead).
   - **Agent 3**: Recommends monolith (confidence 0.9) with 5 evidence items (all of Agent 2's plus faster iteration and simpler debugging).
2. **Print conflict summary**: Shows the nature of the conflict, number of agents, and each agent's position with confidence and evidence count.
3. **Run all strategies**: `ConflictResolver.resolve_all()` executes voting, confidence-weighted, and evidence-based strategies:
   - **Voting**: Monolith gets 2 votes, microservices gets 1. Winner: monolith (majority: true).
   - **Confidence-weighted**: Monolith scores 0.7 + 0.9 = 1.6, microservices scores 0.8. Winner: monolith.
   - **Evidence-based**: Monolith has 3 + 5 = 8 evidence items, microservices has 3. Winner: monolith.
4. **Check agreement**: All three strategies agree on "use_monolith", so the output prints a confirmation. If strategies had disagreed, the system would recommend escalation to a human.

### Important Variables

- `votes`, `scores`, `evidence_scores` (in respective methods): Dictionaries that accumulate support per position using different weighting schemes.
- `opinions` list: The input to all strategies — a list of `AgentOpinion` objects capturing the full context of the disagreement.
- `resolutions` set: Used to check if all strategies produced the same resolution — a single unique value means unanimous agreement.

## Key Takeaways

- **Multiple resolution strategies**: No single strategy is always correct — voting favors quantity, confidence-weighted favors agent certainty, and evidence-based favors thoroughness. Running all three and comparing provides robustness.
- **Confidence matters**: The confidence-weighted strategy accounts for how sure each agent is, preventing a low-confidence majority from overriding a high-confidence minority.
- **Evidence depth as signal**: The evidence-based strategy rewards agents that provide more supporting arguments — an agent with 5 evidence points carries more weight than one with 2, even at equal confidence.
- **Disagreement detection**: When strategies produce different resolutions, the system flags this for human escalation rather than auto-selecting — this is a critical safety mechanism in production systems.
- **Structured opinions**: The `AgentOpinion` dataclass forces agents to provide not just a position but also confidence, evidence, and reasoning — this structure is essential for meaningful conflict resolution rather than simple string matching on answers.

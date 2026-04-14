# Example 1: Hierarchical Multi-Agent System with Supervisor

## How to Run

```bash
python demo.py
```

**Dependencies:** Standard library only (`dataclasses`, `datetime`, `time`). No external packages required.

## What This Demonstrates

This example implements a **hierarchical multi-agent architecture** where a supervisor agent delegates tasks to specialist agents, each with a focused role and tool set. The research agent handles information gathering, the coding agent writes and tests code, the analysis agent processes data, and the review agent performs quality checks. This pattern mirrors production multi-agent systems where a central orchestrator breaks down complex requests and distributes work to specialized agents.

## Code Walkthrough

### Key Classes and Data Structures

- **`AgentResult`** (dataclass): Encapsulates the outcome of a single agent's execution, including agent name, task description, result dictionary, success flag, latency in milliseconds, and an ISO-format timestamp.
- **`AgentObservability`** (dataclass): Tracks per-agent metrics including total requests, successful/failed counts, total latency, and last error. It provides computed properties `success_rate` and `avg_latency`. The `record()` method updates metrics after each execution.
- **`SpecialistAgent`**: Represents a focused agent with a specific role (research, coding, analysis, review) and a list of available tools. The `execute()` method simulates domain-specific work:
  - **research** → returns findings and source count.
  - **coding** → returns code and test pass status.
  - **analysis** → returns insights and confidence score.
  - **review** → returns issues list, quality score, and approval status.
  Each execution records timing and success/failure to its observability tracker.
- **`SupervisorAgent`**: The orchestrator that maintains a registry of specialist agents (keyed by role). Key methods:
  - `register()` — adds a specialist agent to the supervisor's registry.
  - `handle_request()` — processes a request by delegating to each required specialist in sequence, collecting results, and synthesizing a combined output with per-agent statistics.

### Execution Flow (Step-by-Step)

1. **Supervisor initialization**: A `SupervisorAgent` is created with an empty specialist registry.
2. **Register specialists**: Four agents are registered — researcher (research role), coder (coding role), analyst (analysis role), reviewer (review role). Each has its own tool list.
3. **Handle request**: `handle_request()` is called with the request string "Implement and review a new authentication feature" and required roles `["research", "coding", "review"]`.
4. **Delegate to research**: The supervisor finds the researcher agent and calls `execute()`. The agent simulates research work, records latency, and returns findings.
5. **Delegate to coding**: The supervisor finds the coder agent and calls `execute()`. The agent simulates coding work and returns code with test results.
6. **Delegate to review**: The supervisor finds the reviewer agent and calls `execute()`. The agent simulates code review and returns quality score with approval status.
7. **Synthesize output**: The supervisor combines all results into a single dictionary containing the original request, overall success flag, per-agent results, and per-agent observability statistics (success rate and average latency).
8. **Print output**: Results are printed showing each agent's contribution and their observability metrics.

### Important Variables

- `self.specialists` (in `SupervisorAgent`): Dictionary mapping role name to `SpecialistAgent` instance — this is the delegation routing table.
- `self.observability` (in `SpecialistAgent`): Per-agent metrics tracker that accumulates success/failure counts and latency across all executions.
- `required_roles` parameter: Determines which specialists are invoked for a given request, enabling flexible task routing.

## Key Takeaways

- **Hierarchical delegation**: The supervisor-agent pattern separates orchestration (deciding what to do and in what order) from execution (actually doing the work), enabling clean separation of concerns in multi-agent systems.
- **Role-based specialization**: Each agent has a focused role and limited tool set, which reduces hallucination (agents can't use tools outside their domain) and improves output quality through specialization.
- **Built-in observability**: Every agent tracks its own success rate and latency, providing production-ready monitoring without external instrumentation.
- **Sequential execution**: The supervisor invokes specialists in order, collecting results — this is a simple but effective pattern for workflows where later steps depend on earlier results.
- **Graceful degradation**: If a required role has no registered agent, the supervisor records an error for that role but continues processing other roles, returning partial results rather than failing entirely.

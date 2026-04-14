# Example 1: ReAct Agent Loop Implementation

## How to Run

```bash
python demo.py
```

**Dependencies:** None beyond the Python 3 standard library. The script uses only built-in modules (`typing`, `dataclasses`, `json`).

## What This Demonstrates

This example implements the **ReAct (Reasoning + Acting)** agent loop — a foundational pattern in modern AI agent design where an LLM interleaves internal reasoning ("thought") with external tool calls ("action") until a goal is satisfied. It showcases the **Thought-Action-Observation cycle**, a **tool registry** for external function invocation, and **safety guards** (iteration limits, token budgets, loop detection) that prevent runaway execution in production systems.

## Code Walkthrough

### Key Data Structures

- **`Tool` (dataclass)** — Represents a callable tool with four fields: `name` (string identifier), `description` (natural-language explanation the LLM uses to understand purpose), `parameters` (JSON Schema dict for input validation), and `fn` (the actual Python callable).
- **`AgentStep` (dataclass)** — Captures a single iteration of the agent loop, storing `iteration` number, `thought` (reasoning text), `action`/`action_input` (tool name and arguments), `observation` (tool output), and `is_done` (boolean flag).

### Core Class: `ReactAgent`

| Member | Purpose |
|---|---|
| `max_iterations` (int) | Upper bound on the agent loop — prevents infinite execution. |
| `max_tokens` (int) | Token budget for cost control. |
| `tools` (Dict[str, Tool]) | Registry mapping tool names to `Tool` objects. |
| `history` (List[AgentStep]) | Full execution trace for debugging and observability. |
| `total_tokens_used` (int) | Running token counter. |

### Execution Flow (step-by-step)

1. **`main()`** creates a `ReactAgent` with `max_iterations=10` and `max_tokens=50000`.
2. Three tools are registered via `register_tool()`:
   - `lookup_account` — returns user account status.
   - `check_tickets` — returns open support tickets.
   - `process_refund` — processes a refund for a given ticket.
3. **`agent.run(goal)`** is called with the goal `"Resolve the user's billing issue"`.
4. **Iteration 1** — `_simulate_llm_reasoning()` returns a thought ("find account status") + action `lookup_account({"user_id": "user-123"})`. The tool executes, returning `{"user_id": "user-123", "status": "active", "has_issues": True}`. Token count is updated, and an `AgentStep` is appended to `history`.
5. **Iteration 2** — Reasoning yields "check support tickets" → action `check_tickets({"user_id": "user-123"})` returns one open billing ticket.
6. **Iteration 3** — Reasoning yields "process the refund" → action `process_refund({"ticket_id": "TKT-456", "amount": 29.99})` returns processed status.
7. **Iteration 4** — `_simulate_llm_reasoning()` returns `action_name=None`, signaling task completion. The final thought ("refund has been processed") is returned as the result.
8. **Safety checks** run at the top of each loop iteration:
   - **Token budget**: If `total_tokens_used > max_tokens`, the loop aborts with an error.
   - **Loop detection**: If the last 3 actions are identical, the agent is assumed stuck and execution stops.
9. After `run()` returns, `main()` prints the final result, token usage, and a condensed execution trace via `get_trace()`.

### Important Design Notes

- `_simulate_llm_reasoning()` is a **stub** that returns hard-coded responses based on history length. In production, this would call an actual LLM API (e.g., OpenAI, Anthropic) with a prompt containing the goal, tool descriptions, and conversation history.
- `_estimate_tokens()` uses a rough word-count approximation. Production systems use the actual tokenizer for the target model.
- The `history` list provides full **observability** — every thought, action, and observation is recorded and can be exported for debugging or auditing.

## Key Takeaways

- The **ReAct pattern** (Thought → Action → Observation → repeat) is the core loop underlying most production AI agents, enabling them to solve multi-step tasks by chaining tool calls.
- **Safety guards are essential** — without iteration limits, token budgets, and loop detection, an agent can enter infinite loops or incur unbounded costs.
- The **tool registry** decouples tool definitions from execution logic, making it straightforward to add, remove, or swap tools without modifying the agent loop itself.
- **Observability through structured history** (the `AgentStep` list) is critical for debugging agent behavior — you can replay, inspect, or export the full Thought-Action-Observation trace.
- In production, `_simulate_llm_reasoning` would be replaced by actual LLM calls with a carefully crafted system prompt that includes tool schemas and the current goal.

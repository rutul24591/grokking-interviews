"""
Example 1: ReAct Agent Loop Implementation

Demonstrates:
- The ReAct (Reasoning + Acting) agent loop
- Thought-Action-Observation cycle
- Tool registry pattern
- Iteration limits and safety guards
"""

from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
import json


@dataclass
class Tool:
    """A tool the agent can call."""
    name: str
    description: str
    parameters: Dict[str, Any]  # JSON Schema
    fn: Callable


@dataclass
class AgentStep:
    """One step in the agent loop."""
    iteration: int
    thought: str
    action: Optional[str]  # tool name
    action_input: Optional[Dict[str, Any]]
    observation: Optional[str]
    is_done: bool


class ReactAgent:
    """
    ReAct agent loop implementation.
    Interleaves reasoning (thought) and acting (tool calls) until goal is achieved.
    """

    def __init__(self, max_iterations: int = 10, max_tokens: int = 50000):
        self.max_iterations = max_iterations
        self.max_tokens = max_tokens
        self.tools: Dict[str, Tool] = {}
        self.history: List[AgentStep] = []
        self.total_tokens_used = 0

    def register_tool(self, tool: Tool) -> None:
        """Register a tool the agent can call."""
        self.tools[tool.name] = tool

    def _simulate_llm_reasoning(self, goal: str, history: List[AgentStep]) -> tuple[str, Optional[str], Optional[Dict]]:
        """
        Simulate LLM reasoning.
        In production, this calls the actual LLM API.
        Returns: (thought, action_name, action_input)
        """
        if not history:
            return (
                "I need to find the user's account status. First, I'll look up their account.",
                "lookup_account",
                {"user_id": "user-123"},
            )
        elif len(history) == 1:
            return (
                "The account exists but has a pending issue. Let me check the support tickets.",
                "check_tickets",
                {"user_id": "user-123"},
            )
        elif len(history) == 2:
            return (
                "There's one open ticket about billing. I'll process the refund as requested in the ticket.",
                "process_refund",
                {"ticket_id": "TKT-456", "amount": 29.99},
            )
        else:
            return ("The refund has been processed. The task is complete.", None, None)

    def _execute_tool(self, tool_name: str, args: Dict) -> str:
        """Execute a tool and return the observation."""
        if tool_name not in self.tools:
            return f"Error: Tool '{tool_name}' not found"
        try:
            result = self.tools[tool_name].fn(**args)
            return json.dumps(result) if isinstance(result, dict) else str(result)
        except Exception as e:
            return f"Error executing {tool_name}: {str(e)}"

    def run(self, goal: str) -> str:
        """
        Run the agent loop until goal is achieved or limits are hit.
        Returns the final response.
        """
        for iteration in range(1, self.max_iterations + 1):
            # Safety check: token budget
            if self.total_tokens_used > self.max_tokens:
                return f"Error: Token budget exceeded ({self.total_tokens_used} tokens)"

            # Safety check: detect repetitive actions
            recent_actions = [s.action for s in self.history[-3:] if s.action]
            if len(recent_actions) >= 3 and len(set(recent_actions)) == 1:
                return "Error: Agent appears to be in a loop. Stopping."

            # Reasoning step
            thought, action_name, action_input = self._simulate_llm_reasoning(goal, self.history)

            if action_name is None:
                # Agent decided the task is done
                step = AgentStep(
                    iteration=iteration,
                    thought=thought,
                    action=None,
                    action_input=None,
                    observation=None,
                    is_done=True,
                )
                self.history.append(step)
                return thought

            # Action step
            observation = self._execute_tool(action_name, action_input or {})

            # Estimate token usage (rough approximation)
            self.total_tokens_used += len(thought.split()) + len(action_name or "") + len(observation.split())

            step = AgentStep(
                iteration=iteration,
                thought=thought,
                action=action_name,
                action_input=action_input,
                observation=observation,
                is_done=False,
            )
            self.history.append(step)

            # Log step for observability
            print(f"  Step {iteration}: {thought[:60]}...")
            print(f"    Action: {action_name}({action_input})")
            print(f"    Observation: {observation[:80]}...")

        return f"Error: Max iterations ({self.max_iterations}) reached without completion"

    def get_trace(self) -> List[Dict]:
        """Return the full execution trace for debugging."""
        return [
            {
                "iteration": s.iteration,
                "thought": s.thought,
                "action": s.action,
                "action_input": s.action_input,
                "observation": s.observation[:100] if s.observation else None,
                "is_done": s.is_done,
            }
            for s in self.history
        ]


def main():
    # Create agent with safety limits
    agent = ReactAgent(max_iterations=10, max_tokens=50000)

    # Register tools
    agent.register_tool(Tool(
        name="lookup_account",
        description="Look up a user's account by user_id. Returns account status.",
        parameters={"type": "object", "properties": {"user_id": {"type": "string"}}},
        fn=lambda user_id: {"user_id": user_id, "status": "active", "has_issues": True},
    ))

    agent.register_tool(Tool(
        name="check_tickets",
        description="Check open support tickets for a user.",
        parameters={"type": "object", "properties": {"user_id": {"type": "string"}}},
        fn=lambda user_id: {"tickets": [{"id": "TKT-456", "subject": "Billing issue", "type": "refund"}]},
    ))

    agent.register_tool(Tool(
        name="process_refund",
        description="Process a refund for a ticket.",
        parameters={"type": "object", "properties": {"ticket_id": {"type": "string"}, "amount": {"type": "number"}}},
        fn=lambda ticket_id, amount: {"status": "processed", "ticket_id": ticket_id, "amount": amount},
    ))

    # Run agent
    goal = "Resolve the user's billing issue"
    print(f"Goal: {goal}\n")
    result = agent.run(goal)

    print(f"\nFinal Result: {result}")
    print(f"\nTotal tokens used: {agent.total_tokens_used}")
    print(f"\nExecution Trace:")
    for step in agent.get_trace():
        print(f"  [{step['iteration']}] {step['thought'][:50]}... -> {step['action']}")


if __name__ == "__main__":
    main()

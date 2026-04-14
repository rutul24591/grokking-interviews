"""
Example 1: Hierarchical Multi-Agent System with Supervisor

Demonstrates:
- Supervisor agent that delegates to specialists
- Role-specific agents with focused tool sets
- Result collection and synthesis
- Agent-level observability
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class AgentResult:
    agent_name: str
    task: str
    result: Dict[str, Any]
    success: bool
    latency_ms: float
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())


@dataclass
class AgentObservability:
    total_requests: int = 0
    successful: int = 0
    failed: int = 0
    total_latency_ms: float = 0
    last_error: Optional[str] = None

    def record(self, success: bool, latency_ms: float, error: Optional[str] = None):
        self.total_requests += 1
        if success:
            self.successful += 1
        else:
            self.failed += 1
            self.last_error = error
        self.total_latency_ms += latency_ms

    @property
    def success_rate(self) -> float:
        return self.successful / max(self.total_requests, 1)

    @property
    def avg_latency(self) -> float:
        return self.total_latency_ms / max(self.total_requests, 1)


class SpecialistAgent:
    """A focused agent with a specific role and tool set."""

    def __init__(self, name: str, role: str, tools: List[str]):
        self.name = name
        self.role = role
        self.tools = tools
        self.observability = AgentObservability()

    def execute(self, task: str, context: Dict) -> AgentResult:
        """Execute a task within this agent's domain."""
        import time
        start = time.time()

        try:
            # Simulate domain-specific work
            if self.role == "research":
                result = {"findings": [f"Research result for: {task}"], "sources": 3}
            elif self.role == "coding":
                result = {"code": f"# Implementation for: {task}", "tests_passed": True}
            elif self.role == "analysis":
                result = {"insights": [f"Analysis insight for: {task}"], "confidence": 0.85}
            elif self.role == "review":
                result = {"issues": [], "quality_score": 0.9, "approved": True}
            else:
                result = {"result": f"Generic result for: {task}"}

            latency = (time.time() - start) * 1000
            self.observability.record(True, latency)
            return AgentResult(self.name, task, result, True, latency)

        except Exception as e:
            latency = (time.time() - start) * 1000
            self.observability.record(False, latency, str(e))
            return AgentResult(self.name, task, {"error": str(e)}, False, latency)


class SupervisorAgent:
    """Supervisor that delegates to specialist agents."""

    def __init__(self):
        self.specialists: Dict[str, SpecialistAgent] = {}

    def register(self, agent: SpecialistAgent) -> None:
        self.specialists[agent.role] = agent

    def handle_request(self, request: str, required_roles: List[str]) -> Dict[str, Any]:
        """Process a request by delegating to appropriate specialists."""
        results = []
        all_success = True

        for role in required_roles:
            if role not in self.specialists:
                results.append(AgentResult("unknown", role, {"error": f"No agent for role: {role}"}, False, 0))
                all_success = False
                continue

            agent = self.specialists[role]
            result = agent.execute(request, {"request": request})
            results.append(result)
            if not result.success:
                all_success = False

        # Synthesize final output
        return {
            "request": request,
            "all_success": all_success,
            "results": {r.agent_name: r.result for r in results},
            "agent_stats": {
                name: {
                    "success_rate": f"{agent.observability.success_rate:.1%}",
                    "avg_latency_ms": f"{agent.observability.avg_latency:.1f}",
                }
                for name, agent in self.specialists.items()
            },
        }


def main():
    supervisor = SupervisorAgent()

    # Register specialist agents
    supervisor.register(SpecialistAgent("researcher", "research", ["web_search", "retrieve_docs"]))
    supervisor.register(SpecialistAgent("coder", "coding", ["file_edit", "run_tests"]))
    supervisor.register(SpecialistAgent("analyst", "analysis", ["data_query", "generate_viz"]))
    supervisor.register(SpecialistAgent("reviewer", "review", ["code_review", "security_scan"]))

    # Handle requests
    print("=== Multi-Agent Request Processing ===\n")

    result = supervisor.handle_request(
        "Implement and review a new authentication feature",
        ["research", "coding", "review"],
    )

    print(f"Request: {result['request']}")
    print(f"All successful: {result['all_success']}")
    for agent_name, agent_result in result["results"].items():
        print(f"\n  {agent_name}:")
        for key, value in agent_result.items():
            print(f"    {key}: {value}")

    print(f"\n=== Agent Observability ===")
    for name, stats in result["agent_stats"].items():
        print(f"  {name}: {stats}")


if __name__ == "__main__":
    main()

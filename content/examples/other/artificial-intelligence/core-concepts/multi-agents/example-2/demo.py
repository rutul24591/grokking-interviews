"""
Example 2: Debate Pattern — Independent Analysis with Judge

Demonstrates:
- Multiple agents independently analyzing the same problem
- Heterogeneous models producing diverse answers
- Judge agent comparing answers and finding consensus
- Confidence-based answer selection
"""

from typing import List, Dict, Any
from dataclasses import dataclass
import random


@dataclass
class AgentAnswer:
    agent_name: str
    model: str
    answer: str
    reasoning: str
    confidence: float


class DebateJudge:
    """Evaluates multiple agent answers and selects the best one."""

    @staticmethod
    def evaluate(answers: List[AgentAnswer]) -> Dict[str, Any]:
        """Find consensus or select best answer."""
        # Group by answer
        answer_groups: Dict[str, List[AgentAnswer]] = {}
        for a in answers:
            if a.answer not in answer_groups:
                answer_groups[a.answer] = []
            answer_groups[a.answer].append(a)

        # Find consensus (most common answer)
        consensus_answer = max(answer_groups.items(), key=lambda x: len(x[1]))
        consensus_count = len(consensus_answer[1])
        total = len(answers)

        # Calculate confidence
        avg_confidence = sum(a.confidence for a in consensus_answer[1]) / consensus_count

        # Check for disagreement
        disagreement = total - consensus_count

        return {
            "selected_answer": consensus_answer[0],
            "consensus_count": consensus_count,
            "total_agents": total,
            "disagreement": disagreement,
            "avg_confidence": round(avg_confidence, 3),
            "all_answers": [
                {"agent": a.agent_name, "model": a.model, "answer": a.answer, "confidence": a.confidence}
                for a in answers
            ],
            "verdict": "strong_consensus" if consensus_count == total
                       else "majority" if consensus_count > total / 2
                       else "no_consensus",
        }


# Simulated agent responses (in production, these would be real LLM calls)
def simulate_agent_analysis(question: str, model: str, agent_name: str) -> AgentAnswer:
    """Simulate an agent's analysis (deterministic for reproducibility)."""
    # Different models have different strengths
    analyses = {
        "gpt-4": {
            "code_review": AgentAnswer(agent_name, "gpt-4", "has_sql_injection",
                "Line 15 uses string interpolation in SQL query. User input flows directly into WHERE clause without parameterization.",
                0.95),
            "math": AgentAnswer(agent_name, "gpt-4", "42",
                "Solving step by step: 3x + 6 = 132, 3x = 126, x = 42",
                0.99),
        },
        "claude-3": {
            "code_review": AgentAnswer(agent_name, "claude-3", "has_sql_injection",
                "The get_user function constructs SQL via f-string. This is a textbook SQL injection vulnerability.",
                0.92),
            "math": AgentAnswer(agent_name, "claude-3", "42",
                "Subtract 6 from both sides: 3x = 126. Divide by 3: x = 42.",
                0.97),
        },
        "gemini": {
            "code_review": AgentAnswer(agent_name, "gemini", "no_issues",
                "The code follows standard patterns. No obvious issues detected.",
                0.6),
            "math": AgentAnswer(agent_name, "gemini", "44",
                "3x + 6 = 132. 3x = 132 - 6 = 126. x = 126 / 3 = 44.",
                0.7),
        },
    }
    return analyses.get(model, {}).get(question, AgentAnswer(agent_name, model, "unknown", "Could not analyze", 0.5))


def main():
    questions = ["code_review", "math"]

    for question in questions:
        print(f"\n{'='*60}")
        print(f"Question: {question}")
        print(f"{'='*60}")

        # Each agent analyzes independently
        agents = [
            simulate_agent_analysis(question, "gpt-4", "Agent-1"),
            simulate_agent_analysis(question, "claude-3", "Agent-2"),
            simulate_agent_analysis(question, "gemini", "Agent-3"),
        ]

        print("\nIndependent Analysis:")
        for a in agents:
            print(f"  {a.agent_name} ({a.model}): {a.answer} (confidence: {a.confidence:.2f})")
            print(f"    Reasoning: {a.reasoning[:80]}...")

        # Judge evaluates
        verdict = DebateJudge.evaluate(agents)

        print(f"\nJudge's Verdict:")
        print(f"  Selected: {verdict['selected_answer']}")
        print(f"  Consensus: {verdict['consensus_count']}/{verdict['total_agents']}")
        print(f"  Verdict: {verdict['verdict']}")
        print(f"  Avg Confidence: {verdict['avg_confidence']}")
        if verdict["disagreement"] > 0:
            print(f"  Disagreement: {verdict['disagreement']} agent(s) differed")


if __name__ == "__main__":
    main()

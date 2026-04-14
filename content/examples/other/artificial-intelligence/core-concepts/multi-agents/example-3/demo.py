"""
Example 3: Agent Conflict Resolution Strategies

Demonstrates:
- Detecting conflicts between agent outputs
- Voting, confidence-based, and evidence-based resolution
- Discussion-based conflict resolution simulation
"""

from typing import List, Dict, Any
from dataclasses import dataclass


@dataclass
class AgentOpinion:
    agent_id: str
    position: str
    confidence: float
    evidence: List[str]
    reasoning: str


class ConflictResolver:
    """Implements multiple conflict resolution strategies."""

    @staticmethod
    def voting(opinions: List[AgentOpinion]) -> Dict[str, Any]:
        """Simple majority voting."""
        votes: Dict[str, int] = {}
        for op in opinions:
            votes[op.position] = votes.get(op.position, 0) + 1
        winner = max(votes.items(), key=lambda x: x[1])
        return {
            "strategy": "voting",
            "resolution": winner[0],
            "vote_count": votes,
            "majority": winner[1] > len(opinions) / 2,
        }

    @staticmethod
    def confidence_weighted(opinions: List[AgentOpinion]) -> Dict[str, Any]:
        """Weight votes by confidence."""
        scores: Dict[str, float] = {}
        for op in opinions:
            scores[op.position] = scores.get(op.position, 0) + op.confidence
        winner = max(scores.items(), key=lambda x: x[1])
        return {
            "strategy": "confidence_weighted",
            "resolution": winner[0],
            "weighted_scores": {k: round(v, 3) for k, v in scores.items()},
        }

    @staticmethod
    def evidence_based(opinions: List[AgentOpinion]) -> Dict[str, Any]:
        """Select position with strongest evidence."""
        evidence_scores: Dict[str, int] = {}
        for op in opinions:
            evidence_scores[op.position] = evidence_scores.get(op.position, 0) + len(op.evidence)
        winner = max(evidence_scores.items(), key=lambda x: x[1])
        return {
            "strategy": "evidence_based",
            "resolution": winner[0],
            "evidence_count": evidence_scores,
        }

    @staticmethod
    def resolve_all(opinions: List[AgentOpinion]) -> Dict[str, Any]:
        """Run all strategies and compare results."""
        return {
            "voting": ConflictResolver.voting(opinions),
            "confidence_weighted": ConflictResolver.confidence_weighted(opinions),
            "evidence_based": ConflictResolver.evidence_based(opinions),
        }


def main():
    # Simulated conflict: agents disagree on architecture decision
    opinions = [
        AgentOpinion(
            "agent_1", "use_microservices", 0.8,
            ["team of 20+", "independent deployments", "scaling needs"],
            "Large team benefits from service boundaries",
        ),
        AgentOpinion(
            "agent_2", "use_monolith", 0.7,
            ["team of 5", "early stage", "operational overhead"],
            "Small team should avoid distributed system complexity",
        ),
        AgentOpinion(
            "agent_3", "use_monolith", 0.9,
            ["team of 5", "early stage", "operational overhead", "faster iteration", "simpler debugging"],
            "Monolith first, extract services when pain justifies it",
        ),
    ]

    print("=== Conflict Resolution ===")
    print(f"\nConflict: {'microservices' if opinions[0].position == 'use_microservices' else 'monolith'} vs {'monolith' if opinions[1].position == 'use_monolith' else 'microservices'}")
    print(f"Agents: {len(opinions)}")
    for op in opinions:
        print(f"  {op.agent_id}: {op.position} (confidence: {op.confidence}, evidence: {len(op.evidence)} items)")

    results = ConflictResolver.resolve_all(opinions)

    print(f"\n--- Resolution Results ---")
    for strategy, result in results.items():
        print(f"\n{strategy}:")
        print(f"  Resolution: {result['resolution']}")
        if "vote_count" in result:
            print(f"  Votes: {result['vote_count']}")
        if "weighted_scores" in result:
            print(f"  Scores: {result['weighted_scores']}")
        if "evidence_count" in result:
            print(f"  Evidence: {result['evidence_count']}")

    # Check if all strategies agree
    resolutions = [r["resolution"] for r in results.values()]
    if len(set(resolutions)) == 1:
        print(f"\n✓ All strategies agree: {resolutions[0]}")
    else:
        print(f"\n✗ Strategies disagree: {set(resolutions)}")
        print("  Recommendation: escalate to human or request more analysis")


if __name__ == "__main__":
    main()

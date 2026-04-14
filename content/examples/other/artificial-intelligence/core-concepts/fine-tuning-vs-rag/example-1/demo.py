"""
Example 1: Fine-Tuning Decision Framework

Demonstrates:
- Evaluating whether to use fine-tuning or RAG for a given task
- Scoring task characteristics against decision criteria
- Recommending hybrid approach when both are needed
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class TaskProfile:
    name: str
    knowledge_freshness: int  # 1=stable, 5=changes daily
    needs_source_attribution: bool
    needs_access_control: bool
    knowledge_volume: int  # 1=small, 5=massive
    needs_behavior_adaptation: bool  # format, tone, reasoning
    per_request_volume: int  # 1=low, 5=very high
    budget_upfront: int  # 1=low, 5=high available


def evaluate_task(profile: TaskProfile) -> Dict[str, any]:
    """Evaluate whether to use fine-tuning, RAG, or hybrid."""
    rag_score = 0
    ft_score = 0

    # RAG is better for fresh knowledge
    rag_score += profile.knowledge_freshness * 4
    # RAG is better for source attribution
    if profile.needs_source_attribution:
        rag_score += 15
    # RAG is better for access control
    if profile.needs_access_control:
        rag_score += 15
    # RAG is better for large knowledge volumes
    rag_score += profile.knowledge_volume * 3

    # Fine-tuning is better for behavior adaptation
    if profile.needs_behavior_adaptation:
        ft_score += 20
    # Fine-tuning is better for high volume (lower per-request cost)
    ft_score += profile.per_request_volume * 3
    # Fine-tuning needs upfront budget
    if profile.budget_upfront >= 3:
        ft_score += 10

    # Determine recommendation
    if rag_score > ft_score + 10:
        recommendation = "RAG"
        reasoning = "Knowledge is fresh, needs attribution, or requires access control"
    elif ft_score > rag_score + 10:
        recommendation = "Fine-Tuning"
        reasoning = "Behavior adaptation needed, high volume, stable knowledge"
    else:
        recommendation = "Hybrid"
        reasoning = "Both behavior adaptation AND fresh knowledge needed"

    return {
        "task": profile.name,
        "rag_score": rag_score,
        "ft_score": ft_score,
        "recommendation": recommendation,
        "reasoning": reasoning,
    }


def main():
    tasks = [
        TaskProfile(
            "Customer support chatbot",
            knowledge_freshness=3,
            needs_source_attribution=True,
            needs_access_control=True,
            knowledge_volume=4,
            needs_behavior_adaptation=True,
            per_request_volume=5,
            budget_upfront=3,
        ),
        TaskProfile(
            "Legal document analysis",
            knowledge_freshness=2,
            needs_source_attribution=True,
            needs_access_control=True,
            knowledge_volume=5,
            needs_behavior_adaptation=False,
            per_request_volume=2,
            budget_upfront=2,
        ),
        TaskProfile(
            "Code style compliance",
            knowledge_freshness=1,
            needs_source_attribution=False,
            needs_access_control=False,
            knowledge_volume=1,
            needs_behavior_adaptation=True,
            per_request_volume=5,
            budget_upfront=4,
        ),
    ]

    print("=== Fine-Tuning vs RAG Decision Framework ===\n")

    for task in tasks:
        result = evaluate_task(task)
        print(f"Task: {result['task']}")
        print(f"  RAG score: {result['rag_score']}")
        print(f"  Fine-Tuning score: {result['ft_score']}")
        print(f"  Recommendation: {result['recommendation']}")
        print(f"  Reasoning: {result['reasoning']}")
        print()


if __name__ == "__main__":
    main()

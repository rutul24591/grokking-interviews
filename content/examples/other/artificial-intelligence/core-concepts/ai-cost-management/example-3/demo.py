"""
Example 3: Prompt Token Optimizer — Compressing Prompts Without Losing Quality

Demonstrates:
- Measuring token count before/after optimization
- Removing redundant whitespace and verbose instructions
- Replacing long examples with compact ones
- Tracking quality impact of compression
"""

from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class OptimizationResult:
    original_tokens: int
    optimized_tokens: int
    reduction_pct: float
    quality_score_original: float
    quality_score_optimized: float
    quality_delta: float


def estimate_tokens(text: str) -> int:
    """Rough token estimation (1.3 tokens per word)."""
    return int(len(text.split()) * 1.3)


def optimize_prompt(prompt: str) -> str:
    """
    Optimize a prompt by reducing token count while preserving meaning.
    """
    optimized = prompt

    # 1. Remove redundant whitespace
    while "  " in optimized:
        optimized = optimized.replace("  ", " ")
    optimized = optimized.strip()

    # 2. Replace verbose phrases with compact equivalents
    replacements = {
        "Please provide a detailed analysis of": "Analyze:",
        "I would like you to help me understand": "Explain:",
        "Can you please tell me what you think about": "Evaluate:",
        "In conclusion, based on the above analysis": "Conclusion:",
        "It is important to note that": "Note:",
        "Furthermore, it should be mentioned that": "Also:",
        "As a helpful AI assistant, I think": "",
        "Based on my understanding of the information provided": "Based on the context:",
    }
    for verbose, compact in replacements.items():
        optimized = optimized.replace(verbose, compact)

    # 3. Remove filler sentences
    fillers = [
        "I hope this helps!",
        "Let me know if you need anything else.",
        "Feel free to ask follow-up questions.",
        "I'm here to help!",
    ]
    for filler in fillers:
        optimized = optimized.replace(filler, "")

    return optimized.strip()


def simulate_quality_score(prompt: str) -> float:
    """
    Simulate quality scoring (in production, this would be actual evaluation).
    Quality depends on clarity, specificity, and completeness of instructions.
    """
    score = 0.7  # Base score

    # Clear instruction format boosts quality
    if any(prompt.startswith(p) for p in ["Analyze:", "Explain:", "Evaluate:", "Compare:"]):
        score += 0.15

    # Specific details boost quality
    if "format" in prompt.lower() or "structure" in prompt.lower():
        score += 0.1

    # Excessive verbosity can hurt clarity
    if len(prompt.split()) > 100:
        score -= 0.05

    return min(score, 1.0)


def optimize_and_evaluate(prompt: str) -> OptimizationResult:
    """Optimize prompt and evaluate quality impact."""
    original_tokens = estimate_tokens(prompt)
    optimized = optimize_prompt(prompt)
    optimized_tokens = estimate_tokens(optimized)

    quality_original = simulate_quality_score(prompt)
    quality_optimized = simulate_quality_score(optimized)

    return OptimizationResult(
        original_tokens=original_tokens,
        optimized_tokens=optimized_tokens,
        reduction_pct=round((1 - optimized_tokens / max(original_tokens, 1)) * 100, 1),
        quality_score_original=round(quality_original, 3),
        quality_score_optimized=round(quality_optimized, 3),
        quality_delta=round(quality_optimized - quality_original, 3),
    )


def main():
    prompts = [
        """Please provide a detailed analysis of the following market trends.
        I would like you to help me understand the competitive landscape.
        Furthermore, it should be mentioned that we need this in a structured format.
        It is important to note that the analysis should cover at least 5 key areas.
        I hope this helps! Let me know if you need anything else.""",

        """Analyze the following market trends. Format: structured report covering 5 key areas.""",

        """As a helpful AI assistant, I think you should explain how microservices architecture works.
        Can you please tell me what you think about the trade-offs compared to monoliths?
        Feel free to ask follow-up questions.""",
    ]

    print("=== Prompt Token Optimizer ===\n")

    for i, prompt in enumerate(prompts, 1):
        result = optimize_and_evaluate(prompt)
        print(f"Prompt {i}:")
        print(f"  Original: {result.original_tokens} tokens")
        print(f"  Optimized: {result.optimized_tokens} tokens")
        print(f"  Reduction: {result.reduction_pct}%")
        print(f"  Quality: {result.quality_score_original} → {result.quality_score_optimized} (Δ {result.quality_delta:+.3f})")
        print()


if __name__ == "__main__":
    main()

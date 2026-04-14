"""
Example 1: Model Router for Cost-Optimized LLM Calls

Demonstrates:
- Classifying request complexity
- Routing to appropriate model tier
- Escalation when smaller model lacks confidence
- Cost tracking per request
"""

from typing import Dict, Any, List
from dataclasses import dataclass
import time


@dataclass
class ModelConfig:
    name: str
    tier: str
    input_price_per_m: float
    output_price_per_m: float
    max_tokens: int


# Model tier configurations
MODELS = {
    "small": ModelConfig("llama-3-8b", "small", 0.05, 0.05, 4096),
    "medium": ModelConfig("claude-sonnet", "medium", 3.00, 15.00, 8192),
    "large": ModelConfig("gpt-4o", "large", 2.50, 10.00, 16384),
}


class ModelRouter:
    """Routes requests to the appropriate model tier based on complexity."""

    def __init__(self):
        self.total_cost = 0.0
        self.request_log: List[Dict[str, Any]] = []

    def classify_complexity(self, prompt: str) -> str:
        """Classify prompt complexity to determine model tier."""
        words = len(prompt.split())
        complex_keywords = ["analyze", "compare", "evaluate", "synthesize", "reason",
                          "architect", "design", "optimize", "debug", "refactor"]
        moderate_keywords = ["summarize", "explain", "convert", "extract", "classify"]

        complexity_score = 0
        prompt_lower = prompt.lower()

        if words > 200:
            complexity_score += 3
        elif words > 50:
            complexity_score += 2

        for kw in complex_keywords:
            if kw in prompt_lower:
                complexity_score += 2
        for kw in moderate_keywords:
            if kw in prompt_lower:
                complexity_score += 1

        if complexity_score >= 4:
            return "large"
        elif complexity_score >= 2:
            return "medium"
        return "small"

    def simulate_llm_call(self, model: ModelConfig, prompt: str) -> Dict[str, Any]:
        """Simulate an LLM call with cost tracking."""
        input_tokens = len(prompt.split())
        output_tokens = {"small": 100, "medium": 300, "large": 500}[model.tier]
        cost = (
            (input_tokens / 1_000_000) * model.input_price_per_m
            + (output_tokens / 1_000_000) * model.output_price_per_m
        )
        # Simulated confidence by tier
        confidence = {"small": 0.7, "medium": 0.85, "large": 0.95}[model.tier]
        return {
            "model": model.name,
            "tier": model.tier,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": round(cost, 6),
            "confidence": confidence,
            "response": f"[{model.name}] Response to: {prompt[:50]}...",
        }

    def route_request(self, prompt: str) -> Dict[str, Any]:
        """Route request through model tiers with escalation."""
        initial_tier = self.classify_complexity(prompt)
        tier_order = ["small", "medium", "large"]
        start_idx = tier_order.index(initial_tier)

        for tier in tier_order[start_idx:]:
            model = MODELS[tier]
            result = self.simulate_llm_call(model, prompt)
            self.total_cost += result["cost"]
            self.request_log.append(result)

            if result["confidence"] >= 0.8 or tier == "large":
                return result
            # Escalate to next tier

        return result

    def get_cost_report(self) -> Dict[str, Any]:
        return {
            "total_requests": len(self.request_log),
            "total_cost": round(self.total_cost, 6),
            "avg_cost_per_request": round(self.total_cost / max(len(self.request_log), 1), 6),
            "by_tier": {t: sum(1 for r in self.request_log if r["tier"] == t) for t in ["small", "medium", "large"]},
        }


def main():
    router = ModelRouter()

    prompts = [
        "Classify this as positive or negative: Great product",
        "Summarize the following article in 3 bullet points...",
        "Analyze the trade-offs between microservices and monolith for a startup...",
    ]

    print("=== Model Router Demo ===\n")
    for prompt in prompts:
        result = router.route_request(prompt)
        print(f"Prompt: {prompt[:60]}...")
        print(f"  Model: {result['model']} | Cost: ${result['cost']:.6f} | Confidence: {result['confidence']}")
        print()

    report = router.get_cost_report()
    print("=== Cost Report ===")
    for key, value in report.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

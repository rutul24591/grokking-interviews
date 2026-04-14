"""
Example 3: Model Router — Intelligent Model Selection Based on Task Complexity

Demonstrates:
- Routing requests between small and large models based on task complexity
- Cost optimization through model tiering
- Confidence-based escalation to more capable models
- Fallback handling when primary model fails
"""

from typing import Dict, Any, Optional, List
from enum import Enum
import json


class ModelTier(Enum):
    SMALL = "small"       # Fast, cheap, simple tasks
    MEDIUM = "medium"     # Balanced, moderate complexity
    LARGE = "large"       # High capability, expensive, complex reasoning


class ModelConfig:
    def __init__(self, name: str, tier: ModelTier, cost_per_1m_input: float, cost_per_1m_output: float):
        self.name = name
        self.tier = tier
        self.cost_per_1m_input = cost_per_1m_input
        self.cost_per_1m_output = cost_per_1m_output


# Model registry
MODEL_REGISTRY = {
    ModelTier.SMALL: ModelConfig("llama-3-8b", ModelTier.SMALL, 0.05, 0.05),
    ModelTier.MEDIUM: ModelConfig("claude-sonnet", ModelTier.MEDIUM, 3.00, 15.00),
    ModelTier.LARGE: ModelConfig("gpt-4o", ModelTier.LARGE, 2.50, 10.00),
}


class TaskClassifier:
    """
    Simple rule-based task classifier for model routing.
    In production, this could be a separate ML model or LLM call.
    """

    COMPLEXITY_KEYWORDS = {
        "high": ["analyze", "compare", "evaluate", "synthesize", "reason",
                 "debug", "architect", "design", "optimize", "refactor"],
        "medium": ["summarize", "explain", "convert", "translate", "extract",
                   "classify", "format", "rewrite", "paraphrase"],
        "low": ["count", "list", "identify", "format", "check", "validate"],
    }

    @classmethod
    def classify(cls, prompt: str) -> ModelTier:
        """Classify task complexity based on prompt content."""
        prompt_lower = prompt.lower()

        # Check for complexity indicators
        high_score = sum(1 for kw in cls.COMPLEXITY_KEYWORDS["high"] if kw in prompt_lower)
        medium_score = sum(1 for kw in cls.COMPLEXITY_KEYWORDS["medium"] if kw in prompt_lower)
        low_score = sum(1 for kw in cls.COMPLEXITY_KEYWORDS["low"] if kw in prompt_lower)

        # Length-based heuristic (longer prompts often indicate complex tasks)
        word_count = len(prompt.split())
        length_bonus = 1 if word_count > 200 else (0.5 if word_count > 50 else 0)

        high_score += length_bonus
        medium_score += 0.5 if 50 < word_count <= 200 else 0

        if high_score >= 2 or high_score > medium_score:
            return ModelTier.LARGE
        elif medium_score >= 2:
            return ModelTier.MEDIUM
        else:
            return ModelTier.SMALL


class ModelRouter:
    """
    Routes requests to the appropriate model based on task complexity.
    Implements escalation and fallback logic.
    """

    def __init__(self):
        self.total_cost = 0.0
        self.request_log: List[Dict[str, Any]] = []

    def _simulate_llm_call(self, prompt: str, model: ModelConfig) -> Dict[str, Any]:
        """Simulate an LLM API call. Replace with actual API calls."""
        input_tokens = len(prompt.split())
        output_tokens = {
            ModelTier.SMALL: 100,
            ModelTier.MEDIUM: 200,
            ModelTier.LARGE: 300,
        }[model.tier]

        cost = (
            (input_tokens / 1_000_000) * model.cost_per_1m_input
            + (output_tokens / 1_000_000) * model.cost_per_1m_output
        )

        return {
            "content": f"[{model.name}] Response to prompt",
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": round(cost, 6),
            "confidence": {
                ModelTier.SMALL: 0.7,
                ModelTier.MEDIUM: 0.85,
                ModelTier.LARGE: 0.95,
            }[model.tier],
        }

    def route_request(self, prompt: str, escalate_threshold: float = 0.6) -> Dict[str, Any]:
        """
        Route request through model tiers with escalation logic.
        If the small model's confidence is below threshold, escalate to the next tier.
        """
        # Classify task
        initial_tier = TaskClassifier.classify(prompt)
        tiers_to_try = [initial_tier]

        # Add escalation path
        tier_order = [ModelTier.SMALL, ModelTier.MEDIUM, ModelTier.LARGE]
        current_idx = tier_order.index(initial_tier)
        for tier in tier_order[current_idx + 1:]:
            tiers_to_try.append(tier)

        result = None
        for tier in tiers_to_try:
            model = MODEL_REGISTRY[tier]
            try:
                result = self._simulate_llm_call(prompt, model)
                result["model"] = model.name
                result["tier"] = tier.value

                self.total_cost += result["cost"]
                self.request_log.append({
                    "prompt_length": len(prompt),
                    "model": model.name,
                    "tier": tier.value,
                    "cost": result["cost"],
                    "confidence": result["confidence"],
                })

                # Check if we need to escalate
                if result["confidence"] < escalate_threshold and tier != ModelTier.LARGE:
                    print(f"  Low confidence ({result['confidence']:.2f}) with {model.name}, escalating...")
                    continue
                else:
                    break

            except Exception as e:
                print(f"  Error with {model.name}: {e}, trying next tier...")
                continue

        return result

    def get_cost_report(self) -> Dict[str, Any]:
        """Generate a cost summary of all routed requests."""
        if not self.request_log:
            return {"total_cost": 0, "total_requests": 0}

        tier_counts = {}
        for log in self.request_log:
            tier = log["tier"]
            tier_counts[tier] = tier_counts.get(tier, 0) + 1

        return {
            "total_cost": round(self.total_cost, 6),
            "total_requests": len(self.request_log),
            "avg_cost_per_request": round(self.total_cost / len(self.request_log), 6),
            "requests_by_tier": tier_counts,
        }


def main():
    router = ModelRouter()

    # Test prompts of varying complexity
    prompts = [
        "Count the number of words in this text: 'The quick brown fox jumps over the lazy dog'",
        "Summarize the following article in 3 bullet points: [article text...]",
        "Analyze the trade-offs between microservices and monolith architecture for a startup with 5 engineers, "
        "considering team velocity, deployment complexity, debugging difficulty, and cost implications. "
        "Provide a recommendation with specific reasoning.",
        "Extract all dates and monetary values from this contract: [contract text...]",
        "Debug this Python code that's causing a memory leak: [code...]",
    ]

    for i, prompt in enumerate(prompts, 1):
        tier = TaskClassifier.classify(prompt)
        print(f"\nPrompt {i} -> Classified as: {tier.value}")

        result = router.route_request(prompt)
        print(f"  Used model: {result['model']} (tier: {result['tier']})")
        print(f"  Cost: ${result['cost']:.6f}")
        print(f"  Confidence: {result['confidence']:.2f}")

    print(f"\n{'='*60}")
    print("Cost Report:")
    report = router.get_cost_report()
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()

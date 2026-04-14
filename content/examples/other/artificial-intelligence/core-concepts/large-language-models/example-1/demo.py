"""
Example 1: Basic LLM API Interaction with Token Tracking and Cost Estimation

Demonstrates:
- Making API calls to an LLM provider
- Tracking input/output token usage
- Estimating cost per request
- Implementing retry logic with exponential backoff
"""

import time
import random
from typing import Dict, Any

# Simulated LLM provider response
class LLMResponse:
    def __init__(self, content: str, usage: Dict[str, int], model: str):
        self.content = content
        self.usage = usage  # {"prompt_tokens": N, "completion_tokens": N, "total_tokens": N}
        self.model = model

# Pricing per 1M tokens (as of 2024, approximate)
PRICING = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "claude-sonnet-3-5": {"input": 3.00, "output": 15.00},
    "llama-3-70b": {"input": 0.90, "output": 0.90},
}


def estimate_cost(usage: Dict[str, int], model: str) -> float:
    """Calculate the cost of an API call based on token usage."""
    if model not in PRICING:
        return 0.0
    pricing = PRICING[model]
    input_cost = (usage.get("prompt_tokens", 0) / 1_000_000) * pricing["input"]
    output_cost = (usage.get("completion_tokens", 0) / 1_000_000) * pricing["output"]
    return round(input_cost + output_cost, 6)


def call_llm_with_retry(
    prompt: str,
    model: str = "gpt-4o",
    max_retries: int = 3,
    base_delay: float = 1.0,
) -> LLMResponse:
    """
    Call LLM with exponential backoff retry logic.
    In production, replace the simulation with actual API calls.
    """
    last_error = None

    for attempt in range(max_retries):
        try:
            # Simulate API call (replace with actual API call)
            # response = openai.ChatCompletion.create(...)
            # response = anthropic.Anthropic().messages.create(...)

            # Simulated successful response
            simulated_tokens = {
                "prompt_tokens": len(prompt.split()),
                "completion_tokens": random.randint(50, 300),
            }
            simulated_tokens["total_tokens"] = (
                simulated_tokens["prompt_tokens"] + simulated_tokens["completion_tokens"]
            )

            return LLMResponse(
                content=f"Response to: {prompt[:50]}...",
                usage=simulated_tokens,
                model=model,
            )

        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                # Exponential backoff with jitter
                delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay:.2f}s...")
                time.sleep(delay)
            else:
                print(f"All {max_retries} attempts failed. Last error: {e}")

    raise last_error


def main():
    # Example: Analyze a document
    document = """
    The quarterly earnings report shows revenue growth of 15% year-over-year,
    with operating margins expanding to 28%. The company announced plans to
    expand into three new markets in Southeast Asia, with expected capital
    expenditure of $500M over the next two years.
    """

    prompt = f"Summarize the key financial metrics from this report: {document}"

    # Call with retry logic
    response = call_llm_with_retry(prompt, model="gpt-4o", max_retries=3)

    # Track usage and cost
    cost = estimate_cost(response.usage, response.model)

    print(f"\n--- LLM Request Summary ---")
    print(f"Model: {response.model}")
    print(f"Prompt tokens: {response.usage['prompt_tokens']}")
    print(f"Completion tokens: {response.usage['completion_tokens']}")
    print(f"Total tokens: {response.usage['total_tokens']}")
    print(f"Estimated cost: ${cost:.6f}")
    print(f"Response: {response.content}")


if __name__ == "__main__":
    main()

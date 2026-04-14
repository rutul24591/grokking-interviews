"""
Example 2: Chain-of-Thought vs Direct Prompting Comparison

Demonstrates:
- How chain-of-thought prompting works
- Comparing CoT vs direct prompting for reasoning tasks
- Evaluating output quality across prompting strategies
- When CoT provides measurable improvement
"""

import time
from typing import Dict, List, Any


# Simulated LLM responses (in production, these would be actual API calls)
def simulate_direct_prompt(prompt: str) -> str:
    """Simulate direct (non-CoT) model response."""
    # Simulated responses showing what models typically output without CoT
    responses = {
        "math": "The answer is 17.",
        "logic": "Yes, the conclusion is correct.",
        "debug": "The bug is in the authentication module.",
    }
    for key in responses:
        if key in prompt.lower():
            return responses[key]
    return "Here is the answer based on direct analysis."


def simulate_cot_prompt(prompt: str) -> str:
    """Simulate chain-of-thought model response."""
    responses = {
        "math": (
            "Let me work through this step by step.\n\n"
            "Step 1: Identify the equation type - this is a linear equation.\n"
            "Step 2: Isolate the variable - subtract 5 from both sides: 3x = 51 - 5 = 46.\n"
            "Step 3: Solve for x - divide both sides by 3: x = 46/3 = 15.33.\n\n"
            "Wait, let me reconsider. 3x + 5 = 56.\n"
            "3x = 56 - 5 = 51.\n"
            "x = 51/3 = 17.\n\n"
            "The answer is 17."
        ),
        "logic": (
            "Let me analyze this systematically.\n\n"
            "Premise 1: All engineers who write tests catch bugs early.\n"
            "Premise 2: Alice is an engineer who writes tests.\n"
            "Step 1: From Premise 1, writing tests implies catching bugs early.\n"
            "Step 2: From Premise 2, Alice writes tests.\n"
            "Step 3: Therefore, Alice catches bugs early.\n"
            "Step 4: The conclusion follows logically from the premises.\n\n"
            "Yes, the conclusion is correct."
        ),
        "debug": (
            "Let me trace through the code systematically.\n\n"
            "Step 1: The error occurs in the login endpoint.\n"
            "Step 2: The stack trace shows the failure is in validate_token().\n"
            "Step 3: Checking validate_token(), I see it calls jwt.decode() without specifying the algorithm.\n"
            "Step 4: Without algorithm specification, JWT accepts 'none' algorithm, allowing unsigned tokens.\n"
            "Step 5: This is a critical security vulnerability — an attacker can forge any token.\n\n"
            "The bug is in the authentication module: jwt.decode() is called without "
            "specifying algorithms=['HS256'], allowing the 'none' algorithm attack."
        ),
    }
    for key in responses:
        if key in prompt.lower():
            return responses[key]
    return "Here is my step-by-step reasoning process."


def evaluate_response(response: str, expected_answer: str, criteria: List[str]) -> Dict[str, float]:
    """Score a response against evaluation criteria (simulated)."""
    scores = {}

    # Correctness: Does the response contain the expected answer?
    expected_in_response = expected_answer.lower() in response.lower()
    scores["correctness"] = 1.0 if expected_in_response else 0.3

    # Reasoning depth: Longer responses with step markers indicate deeper reasoning
    has_steps = "step" in response.lower() or "let me" in response.lower()
    response_length = len(response.split())
    scores["reasoning_depth"] = min(1.0, (response_length / 50) * (1.5 if has_steps else 0.5))

    # Explainability: Can we understand HOW the answer was reached?
    scores["explainability"] = 0.9 if has_steps else 0.2

    # Actionability: Does the response provide actionable information?
    scores["actionability"] = 0.8 if has_steps and len(response) > 100 else 0.4

    return scores


def main():
    test_cases = [
        {
            "task": "math",
            "prompt_base": "Solve: 3x + 5 = 56. What is x?",
            "expected": "17",
        },
        {
            "task": "logic",
            "prompt_base": (
                "All engineers who write tests catch bugs early. "
                "Alice is an engineer who writes tests. Does Alice catch bugs early?"
            ),
            "expected": "yes",
        },
        {
            "task": "debug",
            "prompt_base": (
                "Debug: The login endpoint returns 401 for valid users. "
                "Code: jwt.decode(token) without algorithm parameter. What's the bug?"
            ),
            "expected": "algorithm",
        },
    ]

    print("=" * 70)
    print("Chain-of-Thought vs Direct Prompting Comparison")
    print("=" * 70)

    for tc in test_cases:
        print(f"\n{'='*70}")
        print(f"Task: {tc['task'].upper()}")
        print(f"Prompt: {tc['prompt_base'][:80]}...")
        print(f"{'='*70}")

        # Direct prompting
        direct_response = simulate_direct_prompt(tc["prompt_base"])
        direct_scores = evaluate_response(direct_response, tc["expected"], [])

        # CoT prompting
        cot_prompt = tc["prompt_base"] + "\n\nThink step by step."
        cot_response = simulate_cot_prompt(cot_prompt)
        cot_scores = evaluate_response(cot_response, tc["expected"], [])

        print(f"\nDirect Response ({len(direct_response.split())} tokens):")
        print(f"  {direct_response}")
        print(f"  Scores: {direct_scores}")

        print(f"\nCoT Response ({len(cot_response.split())} tokens):")
        print(f"  {cot_response}")
        print(f"  Scores: {cot_scores}")

        # Improvement
        avg_direct = sum(direct_scores.values()) / len(direct_scores)
        avg_cot = sum(cot_scores.values()) / len(cot_scores)
        improvement = ((avg_cot - avg_direct) / avg_direct) * 100

        print(f"\nAverage Quality: Direct={avg_direct:.2f}, CoT={avg_cot:.2f}")
        print(f"Improvement with CoT: +{improvement:.0f}%")


if __name__ == "__main__":
    main()

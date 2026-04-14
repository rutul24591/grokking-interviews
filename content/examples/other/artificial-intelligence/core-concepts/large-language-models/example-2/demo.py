"""
Example 2: Temperature and Sampling Strategy Comparison

Demonstrates:
- How temperature affects token probability distribution
- Comparing greedy, top-k, top-p, and temperature sampling
- Visualizing the impact of different sampling strategies
"""

import math
from typing import List, Tuple, Dict


def softmax(logits: List[float], temperature: float = 1.0) -> List[float]:
    """Apply softmax with temperature scaling to convert logits to probabilities."""
    scaled = [logit / temperature for logit in logits]
    max_logit = max(scaled)
    exp_values = [math.exp(s - max_logit) for s in scaled]
    sum_exp = sum(exp_values)
    return [e / sum_exp for e in exp_values]


def top_k_filtering(probs: List[float], tokens: List[str], k: int) -> Tuple[List[float], List[str]]:
    """Keep only the top-k tokens and renormalize."""
    indexed = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)
    top_k = indexed[:k]
    indices = [i for i, _ in top_k]
    filtered_probs = [probs[i] for i in indices]
    filtered_tokens = [tokens[i] for i in indices]
    # Renormalize
    total = sum(filtered_probs)
    filtered_probs = [p / total for p in filtered_probs]
    return filtered_probs, filtered_tokens


def top_p_filtering(probs: List[float], tokens: List[str], p: float) -> Tuple[List[float], List[str]]:
    """Keep the smallest set of tokens whose cumulative probability >= p (nucleus sampling)."""
    indexed = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)
    cumulative = 0.0
    kept_indices = []
    for idx, prob in indexed:
        kept_indices.append(idx)
        cumulative += prob
        if cumulative >= p:
            break
    filtered_probs = [probs[i] for i in kept_indices]
    filtered_tokens = [tokens[i] for i in kept_indices]
    # Renormalize
    total = sum(filtered_probs)
    filtered_probs = [p / total for p in filtered_probs]
    return filtered_probs, filtered_tokens


def demonstrate_sampling():
    """Compare different sampling strategies on the same logits."""
    # Simulated logits for next-token prediction (higher = more likely)
    tokens = ["the", "a", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "cat"]
    logits = [4.2, 3.8, 1.5, 2.1, 0.8, 0.3, 1.2, 0.5, 0.2, 1.0]

    print("=== Original Probabilities (temperature=1.0) ===")
    probs = softmax(logits, temperature=1.0)
    for token, prob in zip(tokens, probs):
        print(f"  {token:8s}: {prob:.4f}")

    print("\n=== Effect of Temperature ===")
    for temp in [0.1, 0.3, 0.7, 1.0, 1.5, 2.0]:
        probs = softmax(logits, temperature=temp)
        # Show top 3
        indexed = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)[:3]
        top_tokens = [(tokens[i], p) for i, p in indexed]
        print(f"  T={temp:.1f}: {top_tokens[0][0]}={top_tokens[0][1]:.3f}, "
              f"{top_tokens[1][0]}={top_tokens[1][1]:.3f}, "
              f"{top_tokens[2][0]}={top_tokens[2][1]:.3f}")

    print("\n=== Top-k Filtering (k=3) ===")
    probs = softmax(logits)
    filtered_probs, filtered_tokens = top_k_filtering(probs, tokens, k=3)
    for token, prob in zip(filtered_tokens, filtered_probs):
        print(f"  {token:8s}: {prob:.4f}")

    print("\n=== Top-p Filtering (p=0.9) ===")
    probs = softmax(logits)
    filtered_probs, filtered_tokens = top_p_filtering(probs, tokens, p=0.9)
    for token, prob in zip(filtered_tokens, filtered_probs):
        print(f"  {token:8s}: {prob:.4f}")

    print("\n=== Combined: Temperature=0.7 + Top-p=0.9 ===")
    probs = softmax(logits, temperature=0.7)
    filtered_probs, filtered_tokens = top_p_filtering(probs, tokens, p=0.9)
    for token, prob in zip(filtered_tokens, filtered_probs):
        print(f"  {token:8s}: {prob:.4f}")


if __name__ == "__main__":
    demonstrate_sampling()

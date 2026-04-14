"""
Example 1: Context Window Budget Manager

Demonstrates:
- Tracking token allocation across context components
- Priority-based truncation when budget is exceeded
- Ensuring critical components (system, user) are never truncated
"""

from dataclasses import dataclass
from typing import List, Dict, Optional


@dataclass
class ContextComponent:
    name: str
    content: str
    priority: int  # Higher = more important (never truncated)
    token_count: int = 0

    def __post_init__(self):
        self.token_count = len(self.content.split()) * 1.3  # Approximate


class ContextWindowManager:
    """Manages token allocation within a context window budget."""

    def __init__(self, max_tokens: int, reserved_for_output: int = 2000):
        self.max_tokens = max_tokens
        self.reserved_for_output = reserved_for_output
        self.available = max_tokens - reserved_for_output
        self.components: List[ContextComponent] = []

    def add(self, name: str, content: str, priority: int) -> None:
        self.components.append(ContextComponent(name, content, priority))

    def optimize(self) -> Dict[str, any]:
        """Optimize context to fit within budget using priority-based truncation."""
        total = sum(c.token_count for c in self.components)
        if total <= self.available:
            return {
                "status": "within_budget",
                "used": round(total),
                "available": self.available,
                "truncations": [],
            }

        # Sort by priority (lowest first, to truncate first)
        sorted_components = sorted(self.components, key=lambda c: c.priority)
        truncations = []

        for component in sorted_components:
            if total <= self.available:
                break

            # Skip high-priority components (system prompt, user input)
            if component.priority >= 9:
                continue

            # Calculate how much to truncate
            excess = total - self.available
            truncate_amount = min(excess, component.token_count * 0.7)  # Keep at least 30%
            component.token_count -= truncate_amount
            total = sum(c.token_count for c in self.components)
            truncations.append({
                "component": component.name,
                "original_tokens": round(component.token_count + truncate_amount),
                "truncated_tokens": round(component.token_count),
                "reduction": f"{(truncate_amount / (component.token_count + truncate_amount)) * 100:.0f}%",
            })

        return {
            "status": "optimized" if truncations else "within_budget",
            "used": round(total),
            "available": self.available,
            "truncations": truncations,
        }

    def get_context(self) -> str:
        """Get the optimized context string."""
        return "\n\n".join(c.content for c in self.components)


def main():
    manager = ContextWindowManager(max_tokens=128000, reserved_for_output=4000)

    # Add components with priorities
    manager.add("system_prompt", "You are a helpful coding assistant...", priority=10)
    manager.add("conversation_turn_1", "User: How do I implement OAuth?\nAssistant: OAuth involves...", priority=5)
    manager.add("conversation_turn_2", "User: What about PKCE?\nAssistant: PKCE adds...", priority=5)
    manager.add("conversation_turn_3", "User: Show me the code.\nAssistant: Here's a Python example...", priority=7)
    manager.add("retrieved_docs", "OAuth 2.0 RFC 6749 specification text... " * 500, priority=6)
    manager.add("user_query", "How do I add token refresh to this OAuth implementation?", priority=10)

    # Check budget
    result = manager.optimize()
    print("=== Context Window Budget ===")
    print(f"Max tokens: {manager.max_tokens:,}")
    print(f"Reserved for output: {manager.reserved_for_output:,}")
    print(f"Available for context: {manager.available:,}")
    print(f"Status: {result['status']}")
    print(f"Used: {result['used']:,} tokens")

    if result["truncations"]:
        print(f"\nTruncations:")
        for t in result["truncations"]:
            print(f"  {t['component']}: {t['original_tokens']:,} → {t['truncated_tokens']:,} ({t['reduction']} reduction)")
    else:
        print("No truncations needed")


if __name__ == "__main__":
    main()

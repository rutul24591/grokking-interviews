"""
Example 2: Conversation History Summarization

Demonstrates:
- Summarizing old conversation turns to save context window
- Preserving key facts while reducing token count
- Progressive compression as conversation grows
"""

from typing import List, Dict
from dataclasses import dataclass


@dataclass
class ConversationTurn:
    role: str  # "user" or "assistant"
    content: str
    token_count: int = 0

    def __post_init__(self):
        self.token_count = len(self.content.split()) * 1.3


def summarize_turns(turns: List[ConversationTurn]) -> str:
    """
    Summarize a series of conversation turns into key facts.
    In production, this would be an LLM call.
    """
    # Simulated summarization
    facts = []
    for turn in turns:
        content_lower = turn.content.lower()
        if "oauth" in content_lower:
            facts.append("Discussed OAuth 2.0 implementation")
        if "pkce" in content_lower:
            facts.append("Covered PKCE extension for public clients")
        if "token" in content_lower and "refresh" in content_lower:
            facts.append("Explored token refresh mechanism")
        if "code" in content_lower or "example" in content_lower:
            facts.append("Provided code examples")
        if "error" in content_lower or "bug" in content_lower:
            facts.append("Addressed error handling")

    if not facts:
        facts.append("General discussion about implementation")

    summary = "Previous discussion: " + "; ".join(facts) + "."
    return summary


class ConversationManager:
    """Manages conversation history with progressive summarization."""

    def __init__(self, max_history_tokens: int = 8000, recent_turns_kept: int = 3):
        self.max_history_tokens = max_history_tokens
        self.recent_turns_kept = recent_turns_kept
        self.turns: List[ConversationTurn] = []
        self.summary: str = ""

    def add_turn(self, role: str, content: str) -> None:
        self.turns.append(ConversationTurn(role, content))
        self._compress_if_needed()

    def _compress_if_needed(self) -> None:
        """Summarize old turns if history exceeds budget."""
        total_tokens = sum(t.token_count for t in self.turns)

        if total_tokens > self.max_history_tokens and len(self.turns) > self.recent_turns_kept:
            # Identify turns to summarize (all except the most recent N)
            old_turns = self.turns[:-self.recent_turns_kept]
            recent_turns = self.turns[-self.recent_turns_kept:]

            # Summarize old turns
            if old_turns:
                new_summary = summarize_turns(old_turns)
                summary_tokens = len(new_summary.split()) * 1.3

                # If summary is still too long, combine with previous summary
                if self.summary:
                    self.summary = f"Earlier: {self.summary} More recently: {new_summary}"
                else:
                    self.summary = new_summary

                # Keep only recent turns
                self.turns = recent_turns

    def get_context(self) -> str:
        """Get the full conversation context (summary + recent turns)."""
        parts = []
        if self.summary:
            parts.append(f"[Conversation Summary] {self.summary}")
        for turn in self.turns:
            parts.append(f"{turn.role.capitalize()}: {turn.content}")
        return "\n\n".join(parts)

    def get_stats(self) -> Dict:
        total = sum(t.token_count for t in self.turns)
        summary_tokens = len(self.summary.split()) * 1.3 if self.summary else 0
        return {
            "recent_turns": len(self.turns),
            "recent_tokens": round(total),
            "summary_tokens": round(summary_tokens),
            "total_tokens": round(total + summary_tokens),
            "budget": self.max_history_tokens,
            "utilization": f"{(total + summary_tokens) / self.max_history_tokens * 100:.0f}%",
        }


def main():
    manager = ConversationManager(max_history_tokens=500, recent_turns_kept=2)

    # Simulate a long conversation
    conversation_pairs = [
        ("user", "How do I implement OAuth 2.0 with PKCE for a single-page application?"),
        ("assistant", "OAuth 2.0 with PKCE is the recommended approach for SPAs. You'll need to use the authorization code flow with a code verifier and challenge..."),
        ("user", "What's the difference between PKCE and the implicit grant type?"),
        ("assistant", "PKCE was originally designed for native apps but is now recommended for all public clients, including SPAs. The implicit grant is deprecated because it exposes tokens in the URL..."),
        ("user", "Can you show me a code example using Python and Flask?"),
        ("assistant", "Here's a Flask example implementing OAuth with PKCE. First, generate a code verifier using secrets.token_urlsafe(64), then create the code challenge by hashing with SHA256 and base64url encoding..."),
        ("user", "How do I handle token refresh when the access token expires?"),
        ("assistant", "Token refresh requires storing the refresh token securely. When the access token expires (typically 1 hour), make a POST request to the token endpoint with grant_type=refresh_token..."),
        ("user", "What about error handling for network failures during refresh?"),
        ("assistant", "Implement retry logic with exponential backoff. If refresh fails after 3 retries, redirect the user to re-authenticate. Store the refresh token securely using httpOnly cookies..."),
    ]

    print("=== Conversation History Summarization ===\n")

    for i, (role, content) in enumerate(conversation_pairs):
        manager.add_turn(role, content)
        stats = manager.get_stats()

        print(f"Turn {i+1} ({role}): {content[:50]}...")
        print(f"  Stats: {stats['total_tokens']} tokens, {stats['recent_turns']} recent turns")
        if manager.summary:
            print(f"  Summary: {manager.summary[:80]}...")
        print()

    print(f"=== Final Stats ===")
    final_stats = manager.get_stats()
    for key, value in final_stats.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

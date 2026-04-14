"""
Example 2: Router Pattern — Classification-Based Agent Selection

Demonstrates:
- Intent classification for routing
- Multi-agent selection based on query type
- Confidence-based routing decisions
- Fallback handling for unclassifiable queries
"""

from typing import Dict, List, Tuple
import re


class IntentClassifier:
    """Simple rule-based intent classifier for routing."""

    INTENT_PATTERNS = {
        "billing": ["bill", "invoice", "payment", "refund", "charge", "subscription", "pricing"],
        "technical": ["bug", "error", "crash", "not working", "broken", "issue", "fix"],
        "account": ["password", "login", "account", "profile", "settings", "security"],
        "feature": ["feature", "request", "suggestion", "improvement", "enhancement"],
        "general": ["help", "info", "information", "how to", "what is"],
    }

    @classmethod
    def classify(cls, query: str) -> Tuple[str, float]:
        """Classify query intent and return (intent, confidence)."""
        query_lower = query.lower()
        scores = {}

        for intent, patterns in cls.INTENT_PATTERNS.items():
            matches = sum(1 for p in patterns if p in query_lower)
            scores[intent] = matches / len(patterns) if patterns else 0

        best_intent = max(scores, key=scores.get)
        confidence = scores[best_intent]

        # If no patterns match well, return low confidence
        if confidence < 0.15:
            return "unknown", 0.0
        return best_intent, min(confidence * 3, 1.0)  # Scale up for readability


class AgentRouter:
    """Routes queries to the appropriate specialist agent."""

    AGENT_MAP = {
        "billing": {"name": "BillingAgent", "description": "Handles payment and subscription issues"},
        "technical": {"name": "TechnicalAgent", "description": "Handles bugs and technical issues"},
        "account": {"name": "AccountAgent", "description": "Handles account and security issues"},
        "feature": {"name": "ProductAgent", "description": "Handles feature requests and feedback"},
        "general": {"name": "GeneralAgent", "description": "Handles general inquiries"},
    }

    def __init__(self, confidence_threshold: float = 0.5):
        self.confidence_threshold = confidence_threshold
        self.router_log: List[Dict] = []

    def route(self, query: str) -> Dict:
        """Route a query to the appropriate agent."""
        intent, confidence = IntentClassifier.classify(query)

        if confidence < self.confidence_threshold:
            result = {
                "query": query,
                "intent": intent,
                "confidence": round(confidence, 3),
                "routed_to": "HumanAgent",
                "reason": f"Low confidence ({confidence:.2f} < {self.confidence_threshold})",
            }
        else:
            agent = self.AGENT_MAP.get(intent, self.AGENT_MAP["general"])
            result = {
                "query": query,
                "intent": intent,
                "confidence": round(confidence, 3),
                "routed_to": agent["name"],
                "reason": agent["description"],
            }

        self.router_log.append(result)
        return result

    def get_stats(self) -> Dict:
        """Get routing statistics."""
        total = len(self.router_log)
        human_escalations = sum(1 for r in self.router_log if r["routed_to"] == "HumanAgent")
        return {
            "total_queries": total,
            "auto_routed": total - human_escalations,
            "human_escalations": human_escalations,
            "auto_rate": f"{(total - human_escalations) / max(total, 1) * 100:.0f}%",
        }


def main():
    router = AgentRouter(confidence_threshold=0.5)

    test_queries = [
        "I was charged twice for my subscription this month",
        "The app crashes when I try to upload a file",
        "How do I reset my password?",
        "I think you should add a dark mode option",
        "What are your business hours?",
        "My cat likes to sleep on my keyboard",  # Unrelated → human
    ]

    print("=== Agent Router Demo ===\n")

    for query in test_queries:
        result = router.route(query)
        print(f"Query: '{query}'")
        print(f"  Intent: {result['intent']} (confidence: {result['confidence']})")
        print(f"  Routed to: {result['routed_to']}")
        print(f"  Reason: {result['reason']}")
        print()

    print(f"=== Routing Statistics ===")
    stats = router.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

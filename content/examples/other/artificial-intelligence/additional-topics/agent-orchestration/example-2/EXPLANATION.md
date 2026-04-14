# Router Pattern -- Classification-Based Agent Selection

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`typing`, `re`).

## What This Demonstrates

This example implements the router pattern for multi-agent systems, where incoming queries are classified by intent using a rule-based classifier and routed to the appropriate specialist agent. It includes confidence-based routing decisions (low-confidence queries escalate to a human agent) and tracks routing statistics for operational monitoring.

## Code Walkthrough

### Key Classes

- **`IntentClassifier`**: A static rule-based classifier that matches query text against predefined keyword patterns for five intent categories: billing, technical, account, feature, and general.

- **`AgentRouter`**: The core router that maps classified intents to specialist agents. Maintains an `AGENT_MAP` linking each intent to an agent name and description, and tracks all routing decisions in a log.

### Intent Classification

`IntentClassifier.INTENT_PATTERNS` maps each intent to a list of keyword patterns:
- **billing**: bill, invoice, payment, refund, charge, subscription, pricing
- **technical**: bug, error, crash, not working, broken, issue, fix
- **account**: password, login, account, profile, settings, security
- **feature**: feature, request, suggestion, improvement, enhancement
- **general**: help, info, information, how to, what is

Classification works by counting pattern matches per intent, normalizing by pattern count, and selecting the highest-scoring intent. Scores below 0.15 result in "unknown" intent.

### Key Methods

1. **`IntentClassifier.classify(query)`**: Returns `(intent, confidence)` tuple. Confidence is scaled by a factor of 3 for readability (e.g., 3/7 matches = 0.43 * 3 = 1.0 capped).
2. **`AgentRouter.route(query)`**: Classifies the query, checks confidence against the threshold (0.5), and routes to the appropriate agent. Low-confidence queries are escalated to `HumanAgent`.
3. **`AgentRouter.get_stats()`**: Returns routing statistics including total queries, auto-routed count, human escalation count, and auto-routing rate.

### Execution Flow

1. **`main()`** creates a router with a confidence threshold of 0.5.
2. Six test queries are routed, covering billing ("charged twice"), technical ("app crashes"), account ("reset password"), feature ("dark mode"), general ("business hours"), and an unrelated query ("cat likes keyboard" -> human escalation).
3. Each routing decision shows the classified intent, confidence score, target agent, and reasoning.
4. Final statistics show the overall auto-routing rate versus human escalation rate.

### Important Variables

- `confidence_threshold = 0.5`: Queries below this confidence are escalated to human agents.
- `AGENT_MAP`: The routing table mapping intents to agent names and descriptions.
- `self.router_log`: Append-only log of all routing decisions for analysis.

## Key Takeaways

- The router pattern is a simple but effective way to distribute queries across specialist agents without requiring a single agent to handle all query types.
- Confidence-based routing with human escalation ensures that uncertain queries are handled safely rather than misrouted to the wrong specialist.
- Rule-based intent classification is transparent and debuggable but requires manual maintenance of keyword patterns. Production systems often use ML-based classifiers for better accuracy.
- Routing statistics (auto-rate, escalation rate) are key operational metrics for monitoring the effectiveness of the classification system.
- The router pattern is foundational in production AI systems: it enables modular agent design where each specialist can be independently developed, tested, and improved.

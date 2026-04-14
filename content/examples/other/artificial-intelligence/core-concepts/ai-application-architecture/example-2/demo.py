"""
Example 2: Multi-Provider Fallback Chain

Demonstrates:
- Routing across multiple LLM providers
- Automatic failover when primary provider fails
- Health checking provider availability
- Cost and latency tracking per provider
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import datetime
import time
import random


@dataclass
class ProviderConfig:
    name: str
    priority: int  # Lower = higher priority
    model: str
    max_rpm: int  # Max requests per minute
    timeout_seconds: float


@dataclass
class ProviderHealth:
    is_healthy: bool = True
    last_check: str = ""
    consecutive_failures: int = 0
    avg_latency_ms: float = 0.0
    total_requests: int = 0


class MultiProviderRouter:
    """Routes requests across multiple LLM providers with failover."""

    def __init__(self):
        self.providers = {
            "openai": ProviderConfig("OpenAI", 1, "gpt-4o", 1000, 30.0),
            "anthropic": ProviderConfig("Anthropic", 2, "claude-sonnet", 500, 30.0),
            "self-hosted": ProviderConfig("Self-Hosted", 3, "llama-3-70b", 200, 60.0),
        }
        self.health: Dict[str, ProviderHealth] = {
            name: ProviderHealth() for name in self.providers
        }
        self.request_log: List[Dict[str, Any]] = []

    def check_health(self, provider_name: str) -> bool:
        """Simulate health check for a provider."""
        # In production: send test request, measure latency
        health = self.health[provider_name]
        health.last_check = datetime.now().isoformat()
        health.is_healthy = health.consecutive_failures < 3
        return health.is_healthy

    def get_healthy_providers(self) -> List[str]:
        """Get providers sorted by priority that are healthy."""
        healthy = []
        for name in sorted(self.providers, key=lambda x: self.providers[x].priority):
            if self.check_health(name):
                healthy.append(name)
        return healthy

    def simulate_provider_call(self, provider_name: str, prompt: str) -> Dict[str, Any]:
        """Simulate a provider API call (with occasional failures)."""
        start = time.time()
        provider = self.providers[provider_name]

        # Simulate occasional failures
        if random.random() < 0.1:  # 10% failure rate
            latency = (time.time() - start) * 1000
            self.health[provider_name].consecutive_failures += 1
            self.health[provider_name].total_requests += 1
            raise TimeoutError(f"{provider_name} timed out after {provider.timeout_seconds}s")

        # Successful response
        latency = (time.time() - start) * 1000 + random.uniform(500, 2000)
        health = self.health[provider_name]
        health.consecutive_failures = 0
        health.total_requests += 1
        health.avg_latency_ms = (health.avg_latency_ms * 0.9) + (latency * 0.1)

        return {
            "provider": provider_name,
            "model": provider.model,
            "latency_ms": round(latency, 1),
            "response": f"[{provider_name}/{provider.model}] Response to: {prompt[:50]}...",
        }

    def route_request(self, prompt: str) -> Dict[str, Any]:
        """Route request through providers with failover."""
        healthy_providers = self.get_healthy_providers()
        if not healthy_providers:
            return {"error": "All providers unhealthy"}

        last_error = None
        for provider_name in healthy_providers:
            try:
                result = self.simulate_provider_call(provider_name, prompt)
                self.request_log.append({**result, "status": "success", "attempts": 1})
                return result
            except Exception as e:
                last_error = str(e)
                self.request_log.append({
                    "provider": provider_name,
                    "status": "failed",
                    "error": last_error,
                })

        return {"error": f"All providers failed. Last error: {last_error}"}

    def get_provider_stats(self) -> Dict[str, Any]:
        return {
            name: {
                "healthy": self.health[name].is_healthy,
                "avg_latency_ms": round(self.health[name].avg_latency_ms, 1),
                "total_requests": self.health[name].total_requests,
                "consecutive_failures": self.health[name].consecutive_failures,
            }
            for name in self.providers
        }


def main():
    random.seed(42)
    router = MultiProviderRouter()

    print("=== Multi-Provider Fallback Demo ===\n")

    prompts = [
        "Analyze Q3 market trends",
        "Summarize this document",
        "Compare architectural approaches",
    ]

    for prompt in prompts:
        result = router.route_request(prompt)
        if "error" in result:
            print(f"FAILED: {result['error']}")
        else:
            print(f"Provider: {result['provider']} | Model: {result['model']} | Latency: {result['latency_ms']}ms")
        print()

    print("=== Provider Health ===")
    stats = router.get_provider_stats()
    for name, stat in stats.items():
        status = "✓" if stat["healthy"] else "✗"
        print(f"  {name}: {status} | Latency: {stat['avg_latency_ms']}ms | Requests: {stat['total_requests']}")


if __name__ == "__main__":
    main()

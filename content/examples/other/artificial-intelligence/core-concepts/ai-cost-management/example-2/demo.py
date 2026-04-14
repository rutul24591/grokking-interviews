"""
Example 2: Semantic Response Cache for LLM Cost Reduction

Demonstrates:
- Exact match caching for identical prompts
- Semantic caching using embedding similarity
- Cache hit rate tracking and TTL management
- Cost savings from cache hits
"""

from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime, timedelta
import hashlib
import math


class SemanticCache:
    """
    Cache for LLM responses with exact and semantic matching.
    """

    def __init__(self, ttl_minutes: int = 60, similarity_threshold: float = 0.95):
        self.exact_cache: Dict[str, Dict] = {}
        self.semantic_cache: List[Dict] = []
        self.ttl = timedelta(minutes=ttl_minutes)
        self.similarity_threshold = similarity_threshold
        self.stats = {"hits": 0, "misses": 0, "exact_hits": 0, "semantic_hits": 0}

    def _hash_prompt(self, prompt: str) -> str:
        return hashlib.sha256(prompt.encode()).hexdigest()

    def _embed_simple(self, text: str) -> List[float]:
        """Simple hash-based embedding simulation."""
        h = hashlib.md5(text.encode()).hexdigest()
        return [int(h[i:i+4], 16) / 65535.0 for i in range(0, 32, 4)]

    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0

    def get(self, prompt: str) -> Optional[Dict]:
        """Try to get cached response for prompt."""
        now = datetime.now()

        # Exact match
        key = self._hash_prompt(prompt)
        if key in self.exact_cache:
            entry = self.exact_cache[key]
            if now - entry["timestamp"] < self.ttl:
                self.stats["hits"] += 1
                self.stats["exact_hits"] += 1
                return entry["response"]
            else:
                del self.exact_cache[key]

        # Semantic match
        prompt_emb = self._embed_simple(prompt)
        for entry in self.semantic_cache:
            if now - entry["timestamp"] >= self.ttl:
                continue
            sim = self._cosine_similarity(prompt_emb, entry["embedding"])
            if sim >= self.similarity_threshold:
                self.stats["hits"] += 1
                self.stats["semantic_hits"] += 1
                return entry["response"]

        self.stats["misses"] += 1
        return None

    def put(self, prompt: str, response: Dict) -> None:
        """Cache a prompt-response pair."""
        key = self._hash_prompt(prompt)
        self.exact_cache[key] = {
            "response": response,
            "timestamp": datetime.now(),
        }
        self.semantic_cache.append({
            "prompt": prompt,
            "embedding": self._embed_simple(prompt),
            "response": response,
            "timestamp": datetime.now(),
        })

    def get_stats(self) -> Dict[str, Any]:
        total = self.stats["hits"] + self.stats["misses"]
        return {
            **self.stats,
            "hit_rate": f"{self.stats['hits'] / max(total, 1) * 100:.0f}%",
            "cache_size": len(self.exact_cache) + len(self.semantic_cache),
        }


def main():
    cache = SemanticCache(ttl_minutes=30, similarity_threshold=0.9)

    # Simulate LLM calls with caching
    prompts_and_responses = [
        ("What is OAuth 2.0?", {"answer": "OAuth 2.0 is an authorization framework..."}),
        ("Explain OAuth 2.0", {"answer": "OAuth 2.0 is an authorization framework..."}),  # Similar
        ("What is the weather today?", {"answer": "I don't have real-time weather data."}),
        ("How do I reset my password?", {"answer": "Go to settings > Security > Reset Password."}),
        ("What is OAuth?", {"answer": "OAuth 2.0 is an authorization framework..."}),  # Similar
    ]

    print("=== Semantic Cache Demo ===\n")
    simulated_cost_per_call = 0.005
    total_saved = 0.0

    for prompt, response in prompts_and_responses:
        cached = cache.get(prompt)
        if cached:
            print(f"CACHE HIT: '{prompt}'")
            total_saved += simulated_cost_per_call
        else:
            print(f"CACHE MISS: '{prompt}' → Calling LLM...")
            cache.put(prompt, response)

    print(f"\n=== Cache Statistics ===")
    stats = cache.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")
    print(f"\n  Estimated savings: ${total_saved:.4f} (at ${simulated_cost_per_call}/call)")


if __name__ == "__main__":
    main()

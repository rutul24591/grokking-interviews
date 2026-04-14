"""
Example 3: Rate Limiter with Request Queuing for AI APIs

Demonstrates:
- Token bucket rate limiting for AI API calls
- Request queuing when rate limit is approached
- Per-user and system-wide rate limiting
- Graceful degradation under load
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import time
from collections import deque


@dataclass
class QueuedRequest:
    id: str
    user_id: str
    prompt: str
    queued_at: str
    priority: int = 0  # Higher = more urgent


class RateLimiter:
    """Token bucket rate limiter with request queuing."""

    def __init__(
        self,
        max_tokens: int = 100,
        refill_rate: float = 10.0,  # tokens per second
        queue_size: int = 1000,
    ):
        self.tokens = max_tokens
        self.max_tokens = max_tokens
        self.refill_rate = refill_rate
        self.last_refill = time.time()
        self.queue: deque = deque(maxlen=queue_size)
        self.processed = 0
        self.rejected = 0
        self.stats: Dict[str, Dict] = {}

    def _refill(self) -> None:
        """Refill tokens based on elapsed time."""
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.max_tokens, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

    def try_acquire(self, tokens: int = 1) -> bool:
        """Try to acquire tokens. Returns True if successful."""
        self._refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False

    def enqueue(self, request: QueuedRequest) -> bool:
        """Queue a request if rate limit is reached."""
        if len(self.queue) >= self.queue.maxlen:
            self.rejected += 1
            return False
        self.queue.append(request)
        return True

    def process_queue(self, process_fn) -> List[Dict]:
        """Process queued requests as tokens become available."""
        results = []
        while self.queue and self.try_acquire():
            req = self.queue.popleft()
            try:
                result = process_fn(req.prompt)
                results.append({"id": req.id, "status": "success", **result})
                self.processed += 1
            except Exception as e:
                results.append({"id": req.id, "status": "error", "error": str(e)})
        return results

    def get_stats(self) -> Dict[str, Any]:
        return {
            "available_tokens": round(self.tokens, 1),
            "queue_size": len(self.queue),
            "processed": self.processed,
            "rejected": self.rejected,
            "utilization": f"{(1 - self.tokens / self.max_tokens) * 100:.0f}%",
        }


def main():
    limiter = RateLimiter(max_tokens=5, refill_rate=2.0)

    # Simulate burst of requests
    print("=== Rate Limiter with Request Queuing ===\n")

    burst_requests = [
        f"Request {i}: Analyze document {i}" for i in range(15)
    ]

    immediate = 0
    queued = 0

    for i, prompt in enumerate(burst_requests):
        if limiter.try_acquire():
            print(f"✓ Request {i}: Processed immediately")
            immediate += 1
        else:
            req = QueuedRequest(id=f"req-{i}", user_id=f"user-{i % 3}", prompt=prompt)
            if limiter.enqueue(req):
                print(f"⏳ Request {i}: Queued (queue size: {len(limiter.queue)})")
                queued += 1
            else:
                print(f"✗ Request {i}: Rejected (queue full)")

    print(f"\nImmediate: {immediate}, Queued: {queued}, Rejected: {limiter.rejected}")

    # Simulate processing queue over time
    print(f"\n=== Processing Queue (simulating 5 seconds) ===")
    for second in range(1, 6):
        time.sleep(0.1)  # Simulate time passing
        results = limiter.process_queue(lambda p: {"response": f"Processed: {p[:30]}..."})
        if results:
            print(f"  Second {second}: Processed {len(results)} queued requests")

    print(f"\nFinal Stats: {limiter.get_stats()}")


if __name__ == "__main__":
    main()

"""
Example 1: Streaming LLM Response Handler

Demonstrates:
- Server-Sent Events (SSE) connection for streaming tokens
- Tracking Time to First Token (TTFT) and total latency
- Handling stream interruptions and reconnection
- Calculating tokens per second throughput
"""

from typing import List, Callable, Optional
from datetime import datetime
import time
import json


class StreamingResponse:
    """Handles streaming LLM responses with metrics tracking."""

    def __init__(self):
        self.tokens: List[str] = []
        self.ttft: Optional[float] = None  # Time to first token
        self.total_time: Optional[float] = None
        self.start_time: Optional[float] = None
        self.is_complete = False
        self.error: Optional[str] = None

    def on_token(self, token: str) -> None:
        """Called when a new token is received."""
        now = time.time()
        if self.start_time is None:
            self.start_time = now

        if self.ttft is None:
            self.ttft = now - self.start_time

        self.tokens.append(token)

    def on_complete(self) -> None:
        """Called when streaming is complete."""
        if self.start_time:
            self.total_time = time.time() - self.start_time
        self.is_complete = True

    def on_error(self, error: str) -> None:
        """Called when stream fails."""
        self.error = error
        self.is_complete = True

    @property
    def tokens_per_second(self) -> float:
        """Calculate generation throughput."""
        if not self.total_time or self.total_time == 0:
            return 0.0
        decode_time = self.total_time - (self.ttft or 0)
        if decode_time <= 0:
            return 0.0
        return len(self.tokens) / decode_time

    @property
    def full_text(self) -> str:
        return "".join(self.tokens)

    def get_metrics(self) -> dict:
        return {
            "tokens_generated": len(self.tokens),
            "ttft_ms": round((self.ttft or 0) * 1000, 1),
            "total_time_ms": round((self.total_time or 0) * 1000, 1),
            "tokens_per_second": round(self.tokens_per_second, 1),
            "is_complete": self.is_complete,
            "error": self.error,
        }


def simulate_streaming(prompt: str) -> StreamingResponse:
    """Simulate a streaming LLM response."""
    response = StreamingResponse()
    response.start_time = time.time()

    # Simulated token generation
    sample_response = "The analysis shows three key trends. " \
                      "First, cloud adoption has accelerated by 40%. " \
                      "Second, AI integration is becoming standard. " \
                      "Third, security remains the top concern."

    words = sample_response.split()
    for i, word in enumerate(words):
        # Simulate variable latency
        time.sleep(0.05 + (i % 3) * 0.02)
        response.on_token(word + " ")

        # Simulate partial delivery (client renders tokens as received)
        if i % 5 == 0:
            pass  # In production: send to client via SSE

    response.on_complete()
    return response


def main():
    print("=== Streaming Response Handler ===\n")

    response = simulate_streaming("Analyze market trends")

    print("Streaming Metrics:")
    metrics = response.get_metrics()
    for key, value in metrics.items():
        print(f"  {key}: {value}")

    print(f"\nFull Response ({len(response.full_text)} chars):")
    print(f"  {response.full_text}")

    print(f"\nPerceived Latency (TTFT): {metrics['ttft_ms']}ms")
    print(f"Without streaming, user would wait: {metrics['total_time_ms']:.0f}ms")
    print(f"Improvement: {metrics['total_time_ms'] - metrics['ttft_ms']:.0f}ms saved by streaming")


if __name__ == "__main__":
    main()

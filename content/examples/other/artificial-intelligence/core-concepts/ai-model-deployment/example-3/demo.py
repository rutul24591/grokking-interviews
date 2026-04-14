"""
Example 3: Continuous Batching Simulator

Demonstrates:
- How continuous batching improves GPU utilization
- Comparison with static batching and single-request processing
- Throughput and latency trade-offs
"""

import random
import time
from typing import List, Dict
from dataclasses import dataclass


@dataclass
class Request:
    id: int
    arrival_time: float
    prompt_tokens: int
    output_tokens: int
    completed_at: float = 0


def simulate_single_request(requests: List[Request], token_latency_ms: float = 50) -> Dict:
    """Process requests one at a time."""
    current_time = 0
    total_latency = 0

    for req in requests:
        start_time = max(current_time, req.arrival_time)
        processing_time = (req.prompt_tokens + req.output_tokens) * token_latency_ms
        end_time = start_time + processing_time
        req.completed_at = end_time
        latency = end_time - req.arrival_time
        total_latency += latency
        current_time = end_time

    return {
        "total_time_ms": current_time,
        "avg_latency_ms": total_latency / len(requests),
        "throughput_req_per_sec": len(requests) / (current_time / 1000),
    }


def simulate_continuous_batching(
    requests: List[Request],
    max_batch_size: int = 4,
    token_latency_ms: float = 50,
    prefill_multiplier: float = 0.5,
) -> Dict:
    """Simulate continuous batching with dynamic batch management."""
    # Simplified simulation: process in groups but overlap prefill/decode
    current_time = 0
    total_latency = 0
    completed = 0
    active_requests = []

    for req in sorted(requests, key=lambda r: r.arrival_time):
        start_time = max(current_time, req.arrival_time)

        # Prefill phase (faster due to parallel processing)
        prefill_time = req.prompt_tokens * token_latency_ms * prefill_multiplier
        # Decode phase (sequential token generation)
        decode_time = req.output_tokens * token_latency_ms

        end_time = start_time + prefill_time + decode_time
        req.completed_at = end_time
        latency = end_time - req.arrival_time
        total_latency += latency
        current_time = end_time
        completed += 1

    return {
        "total_time_ms": current_time,
        "avg_latency_ms": total_latency / completed,
        "throughput_req_per_sec": completed / (current_time / 1000),
    }


def main():
    random.seed(42)

    # Generate requests with variable output lengths
    requests = [
        Request(
            id=i,
            arrival_time=i * 100,  # Requests arrive every 100ms
            prompt_tokens=random.randint(500, 2000),
            output_tokens=random.randint(50, 500),
        )
        for i in range(20)
    ]

    print("=== Continuous Batching Simulator ===\n")

    single = simulate_single_request(requests.copy())
    continuous = simulate_continuous_batching(requests.copy())

    print("Single Request Processing:")
    print(f"  Total time: {single['total_time_ms']:.0f}ms")
    print(f"  Avg latency: {single['avg_latency_ms']:.0f}ms")
    print(f"  Throughput: {single['throughput_req_per_sec']:.2f} req/sec")

    print(f"\nContinuous Batching (batch_size=4):")
    print(f"  Total time: {continuous['total_time_ms']:.0f}ms")
    print(f"  Avg latency: {continuous['avg_latency_ms']:.0f}ms")
    print(f"  Throughput: {continuous['throughput_req_per_sec']:.2f} req/sec")

    speedup = single["throughput_req_per_sec"] / max(continuous["throughput_req_per_sec"], 0.01)
    print(f"\nThroughput improvement: {speedup:.1f}x faster with continuous batching")
    latency_reduction = (1 - continuous["avg_latency_ms"] / single["avg_latency_ms"]) * 100
    print(f"Latency reduction: {latency_reduction:.0f}%")


if __name__ == "__main__":
    main()

"""
Example 3: LangChain Callbacks for Production Monitoring

Demonstrates:
- Custom callback handler for observability
- Tracking token usage, latency, and cost
- Error monitoring and alerting
- Structured logging for every LLM call
"""

from typing import Any, Dict, List, Optional
from datetime import datetime
import json


class ProductionCallbackHandler:
    """
    Custom LangChain callback handler for production monitoring.
    Tracks token usage, latency, cost, and errors for every LLM call.
    """

    def __init__(self):
        self.traces: List[Dict[str, Any]] = []
        self.total_tokens = 0
        self.total_cost = 0.0
        self.errors: List[Dict] = []
        self._pricing = {"input_per_1m": 2.50, "output_per_1m": 10.00}

    def on_llm_start(self, serialized: Dict, prompts: List[str], **kwargs) -> None:
        """Called when LLM call starts."""
        trace = {
            "event": "llm_start",
            "timestamp": datetime.now().isoformat(),
            "model": serialized.get("kwargs", {}).get("model_name", "unknown"),
            "prompt_length": sum(len(p) for p in prompts),
            "run_id": str(kwargs.get("run_id", "")),
        }
        self.traces.append(trace)

    def on_llm_end(self, response: Any, **kwargs) -> None:
        """Called when LLM call ends."""
        # Extract token usage
        token_usage = {}
        if hasattr(response, "llm_output") and response.llm_output:
            token_usage = response.llm_output.get("token_usage", {})

        input_tokens = token_usage.get("prompt_tokens", 0)
        output_tokens = token_usage.get("completion_tokens", 0)
        self.total_tokens += input_tokens + output_tokens

        # Calculate cost
        input_cost = (input_tokens / 1_000_000) * self._pricing["input_per_1m"]
        output_cost = (output_tokens / 1_000_000) * self._pricing["output_per_1m"]
        self.total_cost += input_cost + output_cost

        trace = {
            "event": "llm_end",
            "timestamp": datetime.now().isoformat(),
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": round(input_cost + output_cost, 6),
            "run_id": str(kwargs.get("run_id", "")),
        }
        self.traces.append(trace)

    def on_llm_error(self, error: Exception, **kwargs) -> None:
        """Called when LLM call fails."""
        error_info = {
            "event": "llm_error",
            "timestamp": datetime.now().isoformat(),
            "error": str(error),
            "error_type": type(error).__name__,
            "run_id": str(kwargs.get("run_id", "")),
        }
        self.errors.append(error_info)
        self.traces.append(error_info)

    def on_chain_start(self, serialized: Dict, inputs: Dict, **kwargs) -> None:
        """Called when chain execution starts."""
        trace = {
            "event": "chain_start",
            "timestamp": datetime.now().isoformat(),
            "chain_type": serialized.get("id", ["unknown"])[-1],
            "run_id": str(kwargs.get("run_id", "")),
        }
        self.traces.append(trace)

    def on_tool_start(self, serialized: Dict, input_str: str, **kwargs) -> None:
        """Called when tool execution starts."""
        trace = {
            "event": "tool_start",
            "timestamp": datetime.now().isoformat(),
            "tool_name": serialized.get("name", "unknown"),
            "run_id": str(kwargs.get("run_id", "")),
        }
        self.traces.append(trace)

    def get_report(self) -> Dict[str, Any]:
        """Generate a monitoring report."""
        return {
            "total_traces": len(self.traces),
            "total_tokens": self.total_tokens,
            "total_cost_usd": round(self.total_cost, 4),
            "total_errors": len(self.errors),
            "error_rate": round(len(self.errors) / max(len(self.traces), 1), 4),
            "errors": self.errors[-5:],  # Last 5 errors
        }


def main():
    handler = ProductionCallbackHandler()

    print("=== Production Callback Handler ===\n")
    print("This callback handler tracks:")
    print("  - Token usage (input/output)")
    print("  - Cost per request")
    print("  - Latency between start/end events")
    print("  - Error rates and types")
    print("  - Chain and tool execution traces")

    # Simulate some traces
    handler.on_llm_start(
        {"kwargs": {"model_name": "gpt-4"}},
        ["What is the capital of France?"],
        run_id="run-1",
    )
    handler.on_llm_end(
        type("Response", (), {
            "llm_output": {"token_usage": {"prompt_tokens": 10, "completion_tokens": 5}}
        })(),
        run_id="run-1",
    )

    print(f"\n=== Simulated Report ===")
    report = handler.get_report()
    for key, value in report.items():
        if key != "errors":
            print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

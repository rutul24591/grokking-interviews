"""
Example 1: LLM Trace Collection and Analysis

Demonstrates:
- Collecting complete execution traces for AI interactions
- Trace structure with spans for each pipeline stage
- Trace correlation with user sessions and feedback
- Querying traces for debugging and analysis
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import uuid


@dataclass
class Span:
    name: str
    start_time: str
    end_time: str = ""
    attributes: Dict[str, Any] = field(default_factory=dict)
    status: str = "ok"
    children: List["Span"] = field(default_factory=list)


@dataclass
class Trace:
    trace_id: str
    session_id: str
    user_id: str
    start_time: str
    end_time: str = ""
    spans: List[Span] = field(default_factory=list)
    user_feedback: Optional[Dict] = None
    total_cost: float = 0.0
    total_tokens: int = 0


class TraceCollector:
    """Collects and manages LLM execution traces."""

    def __init__(self):
        self.traces: Dict[str, Trace] = {}

    def start_trace(self, session_id: str, user_id: str) -> str:
        """Start a new trace."""
        trace_id = str(uuid.uuid4())
        self.traces[trace_id] = Trace(
            trace_id=trace_id,
            session_id=session_id,
            user_id=user_id,
            start_time=datetime.now().isoformat(),
        )
        return trace_id

    def add_span(self, trace_id: str, name: str, attributes: Dict) -> None:
        """Add a span to a trace."""
        if trace_id not in self.traces:
            return
        span = Span(
            name=name,
            start_time=datetime.now().isoformat(),
            attributes=attributes,
        )
        self.traces[trace_id].spans.append(span)

        # Update aggregated metrics
        if "input_tokens" in attributes:
            self.traces[trace_id].total_tokens += attributes["input_tokens"]
        if "output_tokens" in attributes:
            self.traces[trace_id].total_tokens += attributes["output_tokens"]
        if "cost" in attributes:
            self.traces[trace_id].total_cost += attributes["cost"]

    def complete_trace(self, trace_id: str) -> None:
        """Complete a trace."""
        if trace_id in self.traces:
            self.traces[trace_id].end_time = datetime.now().isoformat()

    def add_feedback(self, trace_id: str, feedback: Dict) -> None:
        """Attach user feedback to a trace."""
        if trace_id in self.traces:
            self.traces[trace_id].user_feedback = feedback

    def get_traces_by_user(self, user_id: str) -> List[Trace]:
        """Get all traces for a user."""
        return [t for t in self.traces.values() if t.user_id == user_id]

    def get_trace_summary(self, trace_id: str) -> Dict[str, Any]:
        """Get a human-readable summary of a trace."""
        trace = self.traces.get(trace_id)
        if not trace:
            return {}
        return {
            "trace_id": trace.trace_id[:8],
            "session": trace.session_id,
            "user": trace.user_id,
            "spans": len(trace.spans),
            "tokens": trace.total_tokens,
            "cost": f"${trace.total_cost:.6f}",
            "feedback": trace.user_feedback,
            "pipeline": [s.name for s in trace.spans],
        }


def main():
    collector = TraceCollector()

    # Simulate a complete trace
    trace_id = collector.start_trace("session-123", "user-456")
    collector.add_span(trace_id, "input_received", {"input_length": 150})
    collector.add_span(trace_id, "prompt_construction", {
        "template": "rag_qa",
        "context_tokens": 2000,
    })
    collector.add_span(trace_id, "retrieval", {
        "documents_retrieved": 5,
        "latency_ms": 120,
    })
    collector.add_span(trace_id, "llm_call", {
        "model": "gpt-4",
        "input_tokens": 2500,
        "output_tokens": 350,
        "cost": 0.00975,
        "latency_ms": 2100,
    })
    collector.add_span(trace_id, "output_validation", {
        "format_valid": True,
        "safety_passed": True,
    })
    collector.complete_trace(trace_id)
    collector.add_feedback(trace_id, {"rating": 4, "helpful": True})

    print("=== LLM Trace Collection Demo ===\n")
    summary = collector.get_trace_summary(trace_id)
    for key, value in summary.items():
        print(f"  {key}: {value}")

    # Simulate another trace with issues
    trace_id2 = collector.start_trace("session-124", "user-789")
    collector.add_span(trace_id2, "input_received", {"input_length": 50})
    collector.add_span(trace_id2, "llm_call", {
        "model": "gpt-4",
        "input_tokens": 500,
        "output_tokens": 100,
        "cost": 0.00225,
        "latency_ms": 800,
    })
    collector.add_span(trace_id2, "output_validation", {
        "format_valid": False,
        "error": "JSON parsing failed",
        "status": "error",
    })
    collector.complete_trace(trace_id2)

    print(f"\n=== Error Trace ===")
    summary2 = collector.get_trace_summary(trace_id2)
    for key, value in summary2.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()

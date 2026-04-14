"""
Example 2: Tool Registry with Dynamic Tool Loading

Demonstrates:
- Tool registry pattern with metadata
- Dynamic tool loading based on context
- Tool cost tracking and rate limiting
- Tool selection scoring for debugging
"""

from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import time


@dataclass
class ToolMetadata:
    """Metadata for tracking tool usage."""
    call_count: int = 0
    total_latency_ms: float = 0
    total_cost: float = 0
    last_called: Optional[datetime] = None
    error_count: int = 0
    rate_limit: Optional[int] = None  # max calls per minute
    calls_this_minute: List[datetime] = field(default_factory=list)


@dataclass
class Tool:
    name: str
    description: str  # Critical: this is how the LLM understands the tool
    parameters: Dict[str, Any]  # JSON Schema for validation
    fn: Callable
    cost_per_call: float = 0.0
    category: str = "general"
    metadata: ToolMetadata = field(default_factory=ToolMetadata)


class ToolRegistry:
    """
    Registry for managing agent tools with metadata, rate limiting, and dynamic loading.
    """

    def __init__(self):
        self._tools: Dict[str, Tool] = {}
        self._categories: Dict[str, List[str]] = {}
        self._active_tools: set[str] = set()

    def register(self, tool: Tool) -> None:
        """Register a tool in the registry."""
        self._tools[tool.name] = tool
        if tool.category not in self._categories:
            self._categories[tool.category] = []
        self._categories[tool.category].append(tool.name)
        self._active_tools.add(tool.name)

    def get_tool_descriptions(self, tool_names: Optional[List[str]] = None) -> str:
        """
        Generate tool descriptions for the LLM prompt.
        Only includes active tools.
        """
        names = tool_names or list(self._active_tools)
        descriptions = []
        for name in names:
            if name in self._tools and name in self._active_tools:
                tool = self._tools[name]
                descriptions.append(
                    f"- {tool.name}: {tool.description}\n"
                    f"  Parameters: {tool.parameters}\n"
                    f"  Returns: Result of the operation"
                )
        return "\n\n".join(descriptions)

    def execute(self, tool_name: str, **kwargs) -> Any:
        """Execute a tool with rate limiting and cost tracking."""
        if tool_name not in self._tools:
            raise KeyError(f"Tool '{tool_name}' not found")
        if tool_name not in self._active_tools:
            raise ValueError(f"Tool '{tool_name}' is not active")

        tool = self._tools[tool_name]
        meta = tool.metadata

        # Rate limiting
        if meta.rate_limit:
            now = datetime.now()
            # Clean old calls (older than 1 minute)
            meta.calls_this_minute = [
                t for t in meta.calls_this_minute
                if now - t < timedelta(minutes=1)
            ]
            if len(meta.calls_this_minute) >= meta.rate_limit:
                raise RuntimeError(
                    f"Tool '{tool_name}' rate limited: {meta.rate_limit} calls/minute"
                )

        # Execute with timing
        start = time.time()
        try:
            result = tool.fn(**kwargs)
            latency = (time.time() - start) * 1000

            # Update metadata
            meta.call_count += 1
            meta.total_latency_ms += latency
            meta.total_cost += tool.cost_per_call
            meta.last_called = datetime.now()
            meta.calls_this_minute.append(datetime.now())

            return result

        except Exception as e:
            meta.error_count += 1
            raise

    def activate_category(self, category: str) -> None:
        """Dynamically activate tools from a category."""
        if category in self._categories:
            for name in self._categories[category]:
                self._active_tools.add(name)

    def deactivate_tool(self, tool_name: str) -> None:
        """Deactivate a specific tool."""
        self._active_tools.discard(tool_name)

    def get_usage_report(self) -> Dict[str, Any]:
        """Generate a usage report for all tools."""
        report = {}
        for name, tool in self._tools.items():
            meta = tool.metadata
            if meta.call_count > 0:
                report[name] = {
                    "calls": meta.call_count,
                    "avg_latency_ms": round(meta.total_latency_ms / meta.call_count, 2),
                    "total_cost": round(meta.total_cost, 4),
                    "errors": meta.error_count,
                }
        return report


def main():
    registry = ToolRegistry()

    # Register tools across categories
    registry.register(Tool(
        name="search_knowledge_base",
        description="Search the company knowledge base for documents matching the query. Returns ranked list of documents.",
        parameters={"type": "object", "properties": {"query": {"type": "string"}, "max_results": {"type": "integer"}}},
        fn=lambda query, max_results=5: [{"title": f"Result for '{query}'", "relevance": 0.9}],
        cost_per_call=0.001,
        category="search",
    ))

    registry.register(Tool(
        name="query_database",
        description="Execute a read-only SQL query against the production database.",
        parameters={"type": "object", "properties": {"sql": {"type": "string"}}},
        fn=lambda sql: {"rows": 10, "data": []},
        cost_per_call=0.0,
        category="data",
    ))

    registry.register(Tool(
        name="send_email",
        description="Send an email to a user. Requires user_id and message.",
        parameters={"type": "object", "properties": {"user_id": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "string"}}},
        fn=lambda user_id, subject, body: {"sent": True},
        cost_per_call=0.005,
        category="communication",
        metadata=ToolMetadata(rate_limit=10),  # 10 emails per minute
    ))

    # Show all registered tools
    print("=== Tool Registry ===")
    print(f"Total tools: {len(registry._tools)}")
    print(f"Categories: {list(registry._categories.keys())}")
    print(f"Active tools: {len(registry._active_tools)}")

    print(f"\n=== Tool Descriptions (for LLM prompt) ===")
    print(registry.get_tool_descriptions()[:500])

    # Dynamically activate only search tools
    registry._active_tools.clear()
    registry.activate_category("search")
    registry.activate_category("data")
    print(f"\n=== After activating search + data categories ===")
    print(f"Active tools: {registry._active_tools}")

    # Execute a tool
    result = registry.execute("search_knowledge_base", query="Q3 revenue", max_results=3)
    print(f"\n=== Tool Execution ===")
    print(f"Result: {result}")

    # Usage report
    print(f"\n=== Usage Report ===")
    for name, stats in registry.get_usage_report().items():
        print(f"  {name}: {stats}")


if __name__ == "__main__":
    main()

"""
Example 3: Tool Description Quality Evaluator for MCP Servers

Demonstrates:
- Evaluating tool description quality for LLM comprehension
- Scoring tool descriptions across multiple dimensions
- Identifying weak descriptions that need improvement
- Best practices for MCP tool description authoring
"""

from typing import Dict, List, Any
from dataclasses import dataclass


@dataclass
class ToolDescriptionScore:
    """Scores for a single tool description."""
    tool_name: str
    has_action_description: bool  # Does it say what the tool does?
    has_usage_guidance: bool  # Does it say when to use it?
    has_argument_docs: bool  # Are arguments documented?
    has_return_docs: bool  # Is the return value described?
    has_examples: bool  # Are there usage examples?
    description_length: int  # Character count
    clarity_score: float  # 0-1, subjective clarity rating
    total_score: float = 0.0

    def compute_total(self) -> float:
        """Compute weighted total score."""
        weights = {
            "has_action_description": 0.25,  # Most important
            "has_usage_guidance": 0.20,
            "has_argument_docs": 0.20,
            "has_return_docs": 0.15,
            "has_examples": 0.10,
            "clarity_score": 0.10,
        }
        score = 0.0
        if self.has_action_description:
            score += weights["has_action_description"]
        if self.has_usage_guidance:
            score += weights["has_usage_guidance"]
        if self.has_argument_docs:
            score += weights["has_argument_docs"]
        if self.has_return_docs:
            score += weights["has_return_docs"]
        if self.has_examples:
            score += weights["has_examples"]
        score += self.clarity_score * weights["clarity_score"]
        self.total_score = round(score, 3)
        return self.total_score


def evaluate_tool_description(tool: Dict[str, Any]) -> ToolDescriptionScore:
    """Evaluate a tool description for LLM-friendliness."""
    desc = tool.get("description", "")
    schema = tool.get("inputSchema", {})
    properties = schema.get("properties", {})

    # Check for action description (first sentence should say what it does)
    has_action = len(desc.split(".")[0].strip()) > 10 if "." in desc else len(desc) > 10

    # Check for usage guidance ("use when", "call when", "for")
    usage_phrases = ["use when", "use to", "call when", "for finding", "for querying", "for creating"]
    has_usage = any(phrase in desc.lower() for phrase in usage_phrases)

    # Check for argument documentation
    has_arg_docs = all(
        "description" in prop or "Description" in prop
        for prop in properties.values()
    ) if properties else False

    # Check for return value documentation
    has_return = "returns" in desc.lower() or "return" in desc.lower()

    # Check for examples
    has_examples = "example" in desc.lower() or "e.g." in desc.lower() or "for instance" in desc.lower()

    # Clarity score (heuristic: longer, more specific descriptions are clearer)
    clarity = min(1.0, len(desc) / 200)  # 200+ chars = full clarity

    return ToolDescriptionScore(
        tool_name=tool.get("name", "unknown"),
        has_action_description=has_action,
        has_usage_guidance=has_usage,
        has_argument_docs=has_arg_docs,
        has_return_docs=has_return,
        has_examples=has_examples,
        description_length=len(desc),
        clarity_score=round(clarity, 2),
    )


def main():
    # Example tool descriptions of varying quality
    tools = [
        {
            "name": "bad_tool",
            "description": "Gets data.",
            "inputSchema": {"type": "object", "properties": {"x": {"type": "string"}}},
        },
        {
            "name": "mediocre_tool",
            "description": "Searches the knowledge base for documents. Returns a list of matching documents.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "limit": {"type": "integer"},
                },
            },
        },
        {
            "name": "good_tool",
            "description": (
                "Searches the company knowledge base for documents matching the query using semantic search. "
                "Use when you need to find internal documentation, meeting notes, or policy documents. "
                "Arguments: query (string, the search query), limit (integer, max results, default 5). "
                "Returns: list of documents with title, summary, url, and relevance_score (0-1). "
                "Example: search_knowledge_base(query='Q3 revenue', limit=3)"
            ),
            "inputSchema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query"},
                    "limit": {"type": "integer", "description": "Max results (default 5)"},
                },
            },
        },
    ]

    print("=== Tool Description Quality Evaluation ===\n")
    print(f"{'Tool':<20} {'Score':>6} {'Action':>7} {'Usage':>6} {'Args':>5} {'Return':>7} {'Ex':>3} {'Len':>4}")
    print("-" * 65)

    for tool in tools:
        score = evaluate_tool_description(tool)
        score.compute_total()
        print(
            f"{score.tool_name:<20} {score.total_score:>6.3f} "
            f"{'✓' if score.has_action_description else '✗':>7} "
            f"{'✓' if score.has_usage_guidance else '✗':>6} "
            f"{'✓' if score.has_argument_docs else '✗':>5} "
            f"{'✓' if score.has_return_docs else '✗':>7} "
            f"{'✓' if score.has_examples else '✗':>3} "
            f"{score.description_length:>4}"
        )

    print("\n=== Recommendations ===")
    for tool in tools:
        score = evaluate_tool_description(tool)
        score.compute_total()
        if score.total_score < 0.5:
            print(f"  {score.tool_name}: POOR — Rewrite description with action, usage guidance, and argument docs")
        elif score.total_score < 0.8:
            print(f"  {score.tool_name}: FAIR — Add usage guidance ('use when...') and return value description")
        else:
            print(f"  {score.tool_name}: GOOD — Well-structured description")


if __name__ == "__main__":
    main()

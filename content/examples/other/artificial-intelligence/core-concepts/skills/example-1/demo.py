"""
Example 1: Skill Registry with Registration, Discovery, and Invocation

Demonstrates:
- Skill registration with metadata and schemas
- Capability discovery through skill catalog
- Skill invocation with input/output validation
- Dynamic skill registration based on context
"""

from typing import Dict, Any, Optional, List, Callable
from dataclasses import dataclass, field
from pydantic import BaseModel, ValidationError
import json


@dataclass
class SkillMetadata:
    name: str
    description: str
    version: str
    tags: List[str]
    preconditions: List[str]
    estimated_cost: float  # dollars
    estimated_latency_ms: float
    author: str = "system"


class SkillRegistry:
    """Central registry for skill management."""

    def __init__(self):
        self._skills: Dict[str, Dict[str, Any]] = {}
        self._categories: Dict[str, List[str]] = {}

    def register(
        self,
        name: str,
        description: str,
        input_schema: type[BaseModel],
        output_schema: type[BaseModel],
        implementation: Callable,
        metadata: SkillMetadata,
        category: str = "general",
    ) -> None:
        """Register a skill in the registry."""
        self._skills[name] = {
            "metadata": metadata,
            "input_schema": input_schema,
            "output_schema": output_schema,
            "implementation": implementation,
            "category": category,
        }
        if category not in self._categories:
            self._categories[category] = []
        self._categories[category].append(name)

    def get_catalog(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get the skill catalog for LLM discovery."""
        catalog = []
        for name, skill in self._skills.items():
            if category and skill["category"] != category:
                continue
            meta = skill["metadata"]
            catalog.append({
                "name": name,
                "description": meta.description,
                "input_schema": skill["input_schema"].model_json_schema(),
                "output_schema": skill["output_schema"].model_json_schema(),
                "tags": meta.tags,
                "preconditions": meta.preconditions,
            })
        return catalog

    def invoke(self, name: str, **kwargs) -> Dict[str, Any]:
        """Invoke a skill with validated inputs."""
        if name not in self._skills:
            return {"error": f"Skill '{name}' not found"}

        skill = self._skills[name]

        # Validate inputs
        try:
            validated_input = skill["input_schema"](**kwargs)
        except ValidationError as e:
            return {"error": f"Input validation failed: {e.error_count()} errors", "details": e.errors()}

        # Execute
        try:
            result = skill["implementation"](**validated_input.model_dump())
            # Validate output
            validated_output = skill["output_schema"](**result) if isinstance(result, dict) else result
            return {"status": "success", "output": validated_output}
        except Exception as e:
            return {"error": f"Execution failed: {str(e)}"}


# Define schemas for demonstration
class SearchInput(BaseModel):
    query: str
    max_results: int = 5

class SearchOutput(BaseModel):
    results: List[Dict[str, Any]]
    count: int

class ReportInput(BaseModel):
    topic: str
    format: str = "markdown"

class ReportOutput(BaseModel):
    content: str
    format: str
    word_count: int


def main():
    registry = SkillRegistry()

    # Register primitive skills
    registry.register(
        name="search_knowledge",
        description="Search the knowledge base for documents matching the query.",
        input_schema=SearchInput,
        output_schema=SearchOutput,
        implementation=lambda query, max_results=5: {"results": [{"title": f"Result for '{query}'"}], "count": 1},
        metadata=SkillMetadata(
            name="search_knowledge",
            description="Search knowledge base",
            version="1.0.0",
            tags=["search", "knowledge"],
            preconditions=["authenticated"],
            estimated_cost=0.001,
            estimated_latency_ms=500,
        ),
        category="search",
    )

    # Register composite skill
    def generate_report_impl(topic: str, format: str = "markdown") -> Dict:
        # Internally uses search_knowledge
        search_result = registry.invoke("search_knowledge", query=topic)
        if "error" in search_result:
            return {"content": f"Could not find data on {topic}", "format": format, "word_count": 10}
        content = f"# Report on {topic}\n\nFound {search_result['output']['count']} results."
        return {"content": content, "format": format, "word_count": len(content.split())}

    registry.register(
        name="generate_report",
        description="Generate a report on a given topic by searching the knowledge base and formatting results.",
        input_schema=ReportInput,
        output_schema=ReportOutput,
        implementation=generate_report_impl,
        metadata=SkillMetadata(
            name="generate_report",
            description="Generate report from knowledge base",
            version="1.0.0",
            tags=["report", "search", "composite"],
            preconditions=["authenticated", "search_knowledge:available"],
            estimated_cost=0.005,
            estimated_latency_ms=2000,
        ),
        category="reports",
    )

    # Discover skills
    print("=== Skill Catalog ===")
    for skill in registry.get_catalog():
        print(f"  {skill['name']}: {skill['description'][:60]}...")
        print(f"    Tags: {skill['tags']}, Preconditions: {skill['preconditions']}")

    # Invoke skills
    print(f"\n=== Skill Invocation ===")
    result = registry.invoke("search_knowledge", query="Q3 revenue", max_results=3)
    print(f"  search_knowledge: {result}")

    result = registry.invoke("generate_report", topic="Q3 revenue", format="markdown")
    print(f"  generate_report: {result}")

    # Test input validation
    print(f"\n=== Input Validation ===")
    result = registry.invoke("generate_report")  # Missing required 'topic'
    print(f"  Missing topic: {result['error']}")


if __name__ == "__main__":
    main()

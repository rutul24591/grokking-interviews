"""
Example 3: Skill Composition Engine — Building Composite Skills

Demonstrates:
- Composing primitive skills into composite skills
- Dependency graph management
- Data flow between sub-skills
- Error propagation through skill chains
"""

from typing import Dict, Any, List, Callable, Optional
from dataclasses import dataclass
from pydantic import BaseModel


@dataclass
class SkillStep:
    skill_name: str
    input_mapping: Dict[str, str]  # step_output_key -> next_step_input_key
    output_key: str  # key to store result under


class CompositionEngine:
    """Builds and executes composite skills from primitive skill chains."""

    def __init__(self, primitive_skills: Dict[str, Callable]):
        self.primitive_skills = primitive_skills
        self.execution_log: List[Dict] = []

    def compose(
        self,
        name: str,
        description: str,
        steps: List[SkillStep],
        output_transform: Callable[[Dict[str, Any]], Dict[str, Any]],
    ) -> Callable:
        """
        Create a composite skill from a chain of primitive skills.
        Returns a callable that executes the full workflow.
        """
        def composite_impl(**kwargs) -> Dict[str, Any]:
            context = dict(kwargs)  # Shared context between steps

            for i, step in enumerate(steps):
                skill_name = step.skill_name
                if skill_name not in self.primitive_skills:
                    return {"error": f"Unknown skill: {skill_name}"}

                # Build input from context
                step_input = {}
                for ctx_key, input_key in step.input_mapping.items():
                    if ctx_key in context:
                        step_input[input_key] = context[ctx_key]

                # Execute
                try:
                    result = self.primitive_skills[skill_name](**step_input)
                    context[step.output_key] = result
                    self.execution_log.append({"step": i, "skill": skill_name, "status": "success"})
                except Exception as e:
                    self.execution_log.append({"step": i, "skill": skill_name, "status": "error", "error": str(e)})
                    return {"error": f"Step {i} ({skill_name}) failed: {str(e)}", "partial_context": context}

            # Transform final output
            return output_transform(context)

        return composite_impl


def main():
    # Primitive skills
    def query_db(table: str, filters: Dict) -> Dict:
        return {"rows": [{"id": 1, "name": "Alice", "orders": 5}], "count": 1}

    def analyze_trends(data: Dict) -> Dict:
        count = data.get("count", 0)
        return {"trend": "increasing" if count > 3 else "stable", "summary": f"Total: {count} records"}

    def format_report(trend: str, summary: str, format: str) -> Dict:
        content = f"## Trend Analysis\n\n**Trend:** {trend}\n\n{summary}"
        return {"content": content, "format": format}

    def send_email(content: str, recipient: str) -> Dict:
        return {"sent": True, "recipient": recipient, "length": len(content)}

    # Create engine with primitive skills
    engine = CompositionEngine({
        "query_db": query_db,
        "analyze_trends": analyze_trends,
        "format_report": format_report,
        "send_email": send_email,
    })

    # Compose: monthly_report skill
    monthly_report = engine.compose(
        name="monthly_report",
        description="Generate and email a monthly trend report",
        steps=[
            SkillStep("query_db", {"_start": "table", "_start": "filters"}, "db_result"),
            SkillStep("analyze_trends", {"db_result": "data"}, "analysis"),
            SkillStep("format_report", {"analysis.trend": "trend", "analysis.summary": "summary", "_start": "format"}, "report"),
            SkillStep("send_email", {"report.content": "content", "_start": "recipient"}, "email_result"),
        ],
        output_transform=lambda ctx: {
            "report": ctx.get("report", {}).get("content", ""),
            "email_sent": ctx.get("email_result", {}).get("sent", False),
        },
    )

    # Execute composite skill
    result = monthly_report(
        table="orders",
        filters={"month": "2024-03"},
        format="markdown",
        recipient="manager@company.com",
    )

    print("=== Composite Skill Execution ===")
    print(f"Result: {result}")
    print(f"\nExecution Log:")
    for entry in engine.execution_log:
        print(f"  Step {entry['step']}: {entry['skill']} → {entry['status']}")


if __name__ == "__main__":
    main()

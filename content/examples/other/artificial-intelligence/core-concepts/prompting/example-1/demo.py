"""
Example 1: Prompt Template Engine with Version Tracking

Demonstrates:
- Parameterized prompt templates
- Version control for prompt templates
- A/B testing between prompt variants
- Prompt registry pattern
"""

from dataclasses import dataclass, field
from typing import Dict, Any, Optional
from datetime import datetime
import hashlib


@dataclass
class PromptTemplate:
    """A versioned prompt template."""
    name: str
    version: str
    template: str
    description: str
    parameters: list[str]
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    metadata: Dict[str, Any] = field(default_factory=dict)

    def render(self, **kwargs) -> str:
        """Render the template with provided parameters."""
        missing = [p for p in self.parameters if p not in kwargs]
        if missing:
            raise ValueError(f"Missing parameters: {missing}")
        return self.template.format(**kwargs)

    @property
    def fingerprint(self) -> str:
        """Unique hash of template content for change detection."""
        return hashlib.sha256(f"{self.name}:{self.version}:{self.template}".encode()).hexdigest()[:12]


class PromptRegistry:
    """Registry for managing and versioning prompt templates."""

    def __init__(self):
        self._templates: Dict[str, Dict[str, PromptTemplate]] = {}
        self._active: Dict[str, str] = {}  # template_name -> active_version
        self._ab_tests: Dict[str, Dict[str, float]] = {}  # name -> {version: weight}

    def register(self, template: PromptTemplate, activate: bool = True) -> None:
        """Register a new prompt template version."""
        if template.name not in self._templates:
            self._templates[template.name] = {}
        self._templates[template.name][template.version] = template
        if activate:
            self._active[template.name] = template.version

    def get(self, name: str, version: Optional[str] = None) -> PromptTemplate:
        """Get a specific version or the active version."""
        if name not in self._templates:
            raise KeyError(f"Template '{name}' not found")
        v = version or self._active.get(name)
        if v not in self._templates[name]:
            raise KeyError(f"Version '{v}' not found for template '{name}'")
        return self._templates[name][v]

    def set_ab_test(self, name: str, weights: Dict[str, float]) -> None:
        """Set up A/B testing for a template."""
        total = sum(weights.values())
        self._ab_tests[name] = {v: w / total for v, w in weights.items()}

    def render_active(self, name: str, **kwargs) -> tuple[str, str]:
        """Render using active version. Returns (rendered_prompt, version)."""
        template = self.get(name)
        return template.render(**kwargs), template.version


def main():
    registry = PromptRegistry()

    # Register code review prompt versions
    registry.register(PromptTemplate(
        name="code_review",
        version="1.0",
        template=(
            "You are a senior {language} developer reviewing a pull request.\n"
            "Analyze the following code diff for security vulnerabilities, "
            "performance issues, and code quality concerns.\n\n"
            "Code diff:\n{code_diff}\n\n"
            "Respond in JSON format with findings categorized by severity."
        ),
        description="Basic code review prompt",
        parameters=["language", "code_diff"],
    ))

    registry.register(PromptTemplate(
        name="code_review",
        version="2.0",
        template=(
            "You are a principal {language} engineer with expertise in security "
            "and performance optimization. Review the following pull request diff "
            "using this framework:\n\n"
            "1. Security: Check for injection, XSS, auth bypass, data exposure\n"
            "2. Performance: Check for N+1 queries, memory leaks, inefficient loops\n"
            "3. Quality: Check for readability, SOLID principles, test coverage\n\n"
            "Code diff:\n{code_diff}\n\n"
            "Context from related files:\n{related_context}\n\n"
            "Respond as JSON: {{findings: [{{severity: 'high|medium|low', category: '...', line: N, description: '...', suggestion: '...'}}]}}"
        ),
        description="Enhanced code review with structured framework and context",
        parameters=["language", "code_diff", "related_context"],
    ))

    # Render with v2.0 (active version)
    prompt, version = registry.render_active(
        "code_review",
        language="Python",
        code_diff="@@ -15,7 +15,7 @@\n def get_user(user_id):\n-    return db.query(user_id)\n+    return db.query(f\"SELECT * FROM users WHERE id = {user_id}\")",
        related_context="Project uses SQLAlchemy. All queries should use the ORM, not raw SQL.",
    )

    print(f"=== Code Review Prompt (v{version}) ===")
    print(prompt)
    print(f"\n--- Template Stats ---")
    print(f"Total versions: {len(registry._templates['code_review'])}")
    print(f"Active version: {registry._active['code_review']}")


if __name__ == "__main__":
    main()

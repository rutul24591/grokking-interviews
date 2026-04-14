"""
Example 2: Context-Aware Dynamic Skill Registration

Demonstrates:
- Skills registered at runtime based on environment context
- Project-specific skill discovery
- Skill lifecycle management (register/unregister)
- Context-driven skill activation
"""

from typing import Dict, Any, List, Optional, Callable
from dataclasses import dataclass
from pydantic import BaseModel


class SkillRegistry:
    def __init__(self):
        self._skills: Dict[str, Dict] = {}
        self._registration_log: List[str] = []

    def register(self, name: str, desc: str, category: str, fn: Callable) -> None:
        self._skills[name] = {"description": desc, "category": category, "fn": fn}
        self._registration_log.append(f"Registered: {name}")

    def unregister(self, name: str) -> None:
        if name in self._skills:
            del self._skills[name]
            self._registration_log.append(f"Unregistered: {name}")

    def get_catalog(self) -> List[Dict]:
        return [{"name": n, "description": s["description"], "category": s["category"]}
                for n, s in self._skills.items()]


class ProjectContextDetector:
    """Detects project type and returns appropriate skill configurations."""

    @staticmethod
    def detect_project_type(config_files: Dict[str, Any]) -> str:
        if "pyproject.toml" in config_files or "requirements.txt" in config_files:
            return "python"
        elif "package.json" in config_files:
            return "nodejs"
        elif "Cargo.toml" in config_files:
            return "rust"
        elif "go.mod" in config_files:
            return "go"
        return "unknown"

    @staticmethod
    def get_skills_for_project_type(project_type: str) -> List[Dict[str, Any]]:
        skill_configs = {
            "python": [
                {"name": "run_pytest", "desc": "Run pytest test suite and return results", "category": "testing"},
                {"name": "format_black", "desc": "Format Python code with Black formatter", "category": "formatting"},
                {"name": "check_mypy", "desc": "Run mypy type checking on Python code", "category": "type-checking"},
                {"name": "build_wheel", "desc": "Build Python wheel package", "category": "build"},
            ],
            "nodejs": [
                {"name": "run_jest", "desc": "Run Jest test suite and return results", "category": "testing"},
                {"name": "format_prettier", "desc": "Format code with Prettier", "category": "formatting"},
                {"name": "check_tsc", "desc": "Run TypeScript compiler check", "category": "type-checking"},
                {"name": "build_npm", "desc": "Build NPM package", "category": "build"},
            ],
            "rust": [
                {"name": "run_cargo_test", "desc": "Run cargo test suite", "category": "testing"},
                {"name": "format_rustfmt", "desc": "Format Rust code with rustfmt", "category": "formatting"},
                {"name": "check_clippy", "desc": "Run Clippy linter", "category": "linting"},
                {"name": "build_cargo", "desc": "Build Rust crate", "category": "build"},
            ],
        }
        return skill_configs.get(project_type, [])


def main():
    registry = SkillRegistry()

    # Core skills always available
    for name, desc in [("read_file", "Read file contents"), ("write_file", "Write file contents"), ("search_files", "Search files by pattern")]:
        registry.register(name, desc, "filesystem", lambda: {})

    print("=== Initial Skills ===")
    print(f"  Count: {len(registry._skills)}")
    print(f"  Skills: {[s['name'] for s in registry.get_catalog()]}")

    # Simulate opening different projects
    projects = [
        {"name": "web-app", "files": {"package.json": {}, "tsconfig.json": {}}},
        {"name": "ml-pipeline", "files": {"pyproject.toml": {}, "requirements.txt": {}}},
    ]

    for project in projects:
        print(f"\n=== Opening project: {project['name']} ===")
        project_type = ProjectContextDetector.detect_project_type(project["files"])
        print(f"  Detected: {project_type}")

        skill_configs = ProjectContextDetector.get_skills_for_project_type(project_type)
        for config in skill_configs:
            registry.register(config["name"], config["desc"], config["category"], lambda: {})

        print(f"  Skills now: {len(registry._skills)}")
        for skill in registry.get_catalog():
            print(f"    [{skill['category']}] {skill['name']}: {skill['description']}")

    print(f"\n=== Registration Log ===")
    for entry in registry._registration_log:
        print(f"  {entry}")


if __name__ == "__main__":
    main()

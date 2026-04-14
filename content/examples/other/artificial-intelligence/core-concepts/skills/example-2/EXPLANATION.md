# Example 2: Context-Aware Dynamic Skill Registration

## How to Run

```bash
python demo.py
```

**Dependencies:** `pydantic` (imported but not actively used in this simplified version). Install with `pip install pydantic`. No other external dependencies required.

## What This Demonstrates

This example demonstrates how an AI agent system **dynamically registers and unregisters skills at runtime** based on the detected project context. When a user opens a Python project, Python-specific skills (pytest, mypy, black) are loaded; when they switch to a Node.js project, those are replaced with Node.js skills (Jest, Prettier, TSC). This pattern keeps the skill catalog small, relevant, and fast to search, avoiding the overhead of loading thousands of irrelevant skills.

## Code Walkthrough

### Key Classes

- **`SkillRegistry`**: A simplified registry that stores skills as dictionaries with description, category, and callable function. Key methods:
  - `register()` — adds a skill and logs the registration.
  - `unregister()` — removes a skill and logs the removal.
  - `get_catalog()` — returns all currently registered skills as a list of dictionaries.
- **`ProjectContextDetector`**: A static utility class that determines project type by inspecting configuration files present in the project root. It maps file signatures to project types:
  - `pyproject.toml` or `requirements.txt` → Python
  - `package.json` → Node.js
  - `Cargo.toml` → Rust
  - `go.mod` → Go

### Execution Flow (Step-by-Step)

1. **Registry initialization**: A fresh `SkillRegistry` is created.
2. **Register core skills**: Three filesystem skills (`read_file`, `write_file`, `search_files`) are registered — these are always available regardless of project type.
3. **Print initial state**: Shows 3 core skills registered.
4. **Open first project (web-app)**: The detector finds `package.json` and classifies it as `nodejs`. Four Node.js skills (`run_jest`, `format_prettier`, `check_tsc`, `build_npm`) are registered. Total skills: 7.
5. **Open second project (ml-pipeline)**: The detector finds `pyproject.toml` and classifies it as `python`. Four Python skills (`run_pytest`, `format_black`, `check_mypy`, `build_wheel`) are registered. Total skills: 11.
6. **Print registration log**: Shows the chronological history of all skill registrations, demonstrating the audit trail of dynamic skill lifecycle management.

### Important Variables

- `self._skills`: Dictionary mapping skill name to its registration data (description, category, function).
- `self._registration_log`: List of strings recording every register/unregister event for observability and debugging.
- `skill_configs` in `get_skills_for_project_type()`: A mapping from project type to list of skill configurations, defining which skills belong to which ecosystem.

## Key Takeaways

- **Context-driven loading**: Skills are loaded based on detected project context rather than all-at-once, reducing the catalog size and improving LLM decision-making by removing irrelevant options.
- **Core vs. contextual skills**: Core skills (filesystem operations) are always registered, while domain-specific skills are loaded dynamically — this separation is critical for building efficient agent systems.
- **Skill lifecycle management**: The registry supports both `register()` and `unregister()`, enabling skills to be added and removed as the user's context changes (e.g., switching between projects).
- **Project type detection**: Simple file-signature detection (checking for `package.json`, `pyproject.toml`, etc.) is a lightweight and effective way to determine project context without heavy analysis.
- **Registration audit trail**: The `_registration_log` provides visibility into when and why skills were registered, which is valuable for debugging agent behavior and understanding skill availability over time.

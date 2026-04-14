# Example 3: Skill Composition Engine — Building Composite Skills

## How to Run

```bash
python demo.py
```

**Dependencies:** `pydantic` (imported but not actively used in this simplified version). Install with `pip install pydantic`. No other external dependencies required.

## What This Demonstrates

This example implements a **composition engine** that chains primitive skills together into composite workflows with defined data flow between steps. It demonstrates how complex multi-step operations (like "query database, analyze trends, format report, send email") can be declared as a pipeline of skill steps, where the output of one step is automatically mapped to the input of the next. This is the architectural pattern behind AI agent tool-use chains and workflow orchestration.

## Code Walkthrough

### Key Classes and Data Structures

- **`SkillStep`** (dataclass): Represents a single step in a composite workflow. It has three fields:
  - `skill_name` — the name of the primitive skill to execute.
  - `input_mapping` — a dictionary that maps keys from the shared context to the input parameter names expected by the skill.
  - `output_key` — the key under which the step's result will be stored in the shared context.
- **`CompositionEngine`**: The core engine that builds and executes composite skills. It holds a dictionary of primitive skills (name to callable) and an execution log. Key methods:
  - `compose()` — takes a list of `SkillStep` definitions and an output transformation function, and returns a callable that executes the full workflow.

### Execution Flow (Step-by-Step)

1. **Define primitive skills**: Four standalone functions are created — `query_db`, `analyze_trends`, `format_report`, and `send_email`. Each takes specific inputs and returns a dictionary result.
2. **Create engine**: `CompositionEngine` is initialized with all four primitive skills in its `primitive_skills` dictionary.
3. **Compose composite skill**: `engine.compose()` is called with a chain of four `SkillStep` objects:
   - **Step 0**: Execute `query_db` with initial inputs (`table`, `filters`), store result as `db_result`.
   - **Step 1**: Execute `analyze_trends` with `db_result` mapped to its `data` parameter, store result as `analysis`.
   - **Step 2**: Execute `format_report` with `analysis.trend`, `analysis.summary`, and initial `format` parameter, store result as `report`.
   - **Step 3**: Execute `send_email` with `report.content` and initial `recipient` parameter, store result as `email_result`.
4. **Execute composite skill**: The returned `monthly_report` callable is invoked with initial parameters (`table`, `filters`, `format`, `recipient`). The engine creates a shared `context` dictionary and iterates through steps:
   - For each step, it builds the skill's input by looking up values from the context using the `input_mapping`.
   - It executes the skill, stores the result in the context under `output_key`, and logs the execution.
   - If any step fails, execution stops immediately and returns an error with the partial context.
5. **Transform output**: After all steps succeed, the `output_transform` lambda extracts the final report content and email status from the context.
6. **Print results**: The final result shows the composed report and whether the email was sent, along with a step-by-step execution log.

### Important Variables

- `context` (in `composite_impl`): A shared dictionary that accumulates results from each step, serving as the data pipeline between skills.
- `input_mapping`: The critical mechanism for data flow — it declares how outputs from previous steps (or initial parameters prefixed with `_start`) feed into subsequent skill inputs.
- `execution_log`: Records each step's skill name and status, providing observability into the composite workflow execution.

## Key Takeaways

- **Declarative workflow composition**: Complex multi-step operations are defined as data (a list of `SkillStep` objects) rather than hardcoded logic, making workflows configurable and inspectable.
- **Shared context pattern**: All steps read from and write to a single shared context dictionary, enabling flexible data flow between any steps without tight coupling.
- **Error propagation**: If any step fails, the entire chain aborts immediately and returns the error along with the partial context — this is critical for debugging failed workflows.
- **Input mapping flexibility**: The `input_mapping` dictionary allows results from any previous step (or initial parameters) to be routed to any input of the current step, enabling non-linear data dependencies.
- **Output transformation**: The final `output_transform` function gives full control over what the composite skill returns, abstracting away the internal pipeline structure from the caller.

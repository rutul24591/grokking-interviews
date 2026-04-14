# Supervisor Pattern -- Task Decomposition and Delegation

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `enum`).

## What This Demonstrates

This example implements the supervisor pattern for multi-agent orchestration, where a supervisor agent decomposes a high-level goal into sub-tasks, delegates each task to a specialist agent (researcher, analyst, writer, reviewer), and executes them in a DAG-respecting order with parallel stage planning before synthesizing the results into a final output.

## Code Walkthrough

### Key Classes

- **`TaskStatus`** (Enum): Represents the lifecycle state of a task: PENDING, IN_PROGRESS, COMPLETED, FAILED.
- **`Task`** (dataclass): Represents a single task with `id`, `description`, `assigned_agent`, `status`, `result`, and `dependencies` (list of task IDs that must complete before this task can start).
- **`SupervisorOrchestrator`**: The core orchestrator that decomposes goals, plans execution stages, runs tasks, and synthesizes results.

### Key Methods

1. **`decompose_goal(goal)`**: Simulates goal decomposition into four sequential tasks: researcher (research), analyst (analysis, depends on research), writer (report, depends on analysis), reviewer (validation, depends on report). Returns the task list and stores them in the orchestrator.
2. **`get_execution_order()`**: Performs topological sort with parallel grouping. Identifies stages of tasks that can run in parallel (tasks whose dependencies are all completed). Detects circular dependencies and raises an error if found.
3. **`execute_task(task_id)`**: Simulates task execution by updating status to IN_PROGRESS, computing a result string, and setting status to COMPLETED. Logs start and completion events.
4. **`synthesize()`**: Combines all task results into a final output by concatenating individual results with separators.
5. **`run(goal)`**: The main orchestration entry point that calls decompose, get_execution_order, execute all stages, and synthesize.

### Execution Flow

1. **`main()`** creates a `SupervisorOrchestrator` and runs it with the goal "Q3 market analysis for cloud services".
2. The goal is decomposed into four tasks assigned to researcher, analyst, writer, and reviewer.
3. The execution order is computed as four sequential stages (each task depends on the previous).
4. Tasks are executed stage by stage, with results printed at each step.
5. Results are synthesized into a final concatenated output.
6. The execution log shows the complete event timeline.

### Important Variables

- `self.tasks`: Dictionary mapping task IDs to Task objects.
- `self.execution_log`: Append-only log of all orchestration events.
- Task dependencies: Define the execution DAG -- tasks can only start when all their dependencies are COMPLETED.

## Key Takeaways

- The supervisor pattern separates goal decomposition (what needs to be done) from execution (how it gets done), enabling flexible task allocation across specialist agents.
- DAG-based execution planning with topological sort enables both sequential and parallel task execution, optimizing for dependencies.
- The synthesizer phase is critical -- individual task results must be combined coherently into a final output that addresses the original goal.
- Circular dependency detection prevents infinite execution loops and ensures the task graph is a valid DAG.
- Production supervisor systems add error handling (task retry, fallback agents), dynamic task creation (supervisor can add/remove tasks mid-execution), and quality gates between stages.

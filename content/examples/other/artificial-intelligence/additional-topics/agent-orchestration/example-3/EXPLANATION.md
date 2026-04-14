# DAG-Based Task Scheduler for Multi-Agent Execution

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `collections`, `time`).

## What This Demonstrates

This example implements a DAG-based task scheduler for multi-agent orchestration that builds execution graphs from task dependencies, identifies parallel execution stages, validates the DAG for circular dependencies, and handles partial failures with retry strategies.

## Code Walkthrough

### Key Classes

- **`TaskNode`** (dataclass): Represents a task with `id`, `description`, `agent` (which specialist agent executes it), `dependencies` (list of prerequisite task IDs), `result`, `status`, `retries`, and `max_retries` (default 2).
- **`DAGScheduler`**: The core scheduler managing task registration, DAG validation, parallel stage computation, task execution with retries, and full orchestration.

### Key Methods

1. **`add_task(task)`**: Registers a task node in the scheduler's task dictionary.
2. **`validate_dag()`**: Performs depth-first search with a recursion stack to detect circular dependencies. Returns `False` if a cycle is found (meaning the graph is not a valid DAG).
3. **`get_parallel_stages()`**: Computes the parallel execution plan using topological sort with in-degree counting. Tasks with zero in-degree (no dependencies) form the first stage. After each stage, dependent tasks have their in-degree reduced, and tasks reaching zero in-degree form the next stage.
4. **`execute_task(task_id)`**: Executes a single task with retry logic. On failure, retries up to `max_retries` before marking the task as failed.
5. **`run()`**: Orchestrates the full execution: validates the DAG, computes parallel stages, executes each stage (checking that all dependencies completed), and returns a summary with completion count and failed tasks.

### Task Graph

The example builds a 7-task DAG for a market analysis report:
- **Stage 1**: t1 (gather data) and t2 (analyze competitors) -- run in parallel, no dependencies.
- **Stage 2**: t3 (calculate market share) -- depends on t1 and t2.
- **Stage 3**: t4 (draft summary) and t5 (create visualizations) -- both depend on t3, run in parallel.
- **Stage 4**: t6 (write full report) -- depends on t4 and t5.
- **Stage 5**: t7 (review and approve) -- depends on t6.

### Execution Flow

1. **`main()`** creates a scheduler and registers seven tasks with their dependencies.
2. Validates the DAG structure (no circular dependencies).
3. Computes and prints the parallel execution plan (5 stages).
4. Executes all tasks stage by stage, respecting dependencies.
5. Reports completion statistics: tasks completed, stages executed, and any failures.

### Important Variables

- `in_degree`: Dictionary counting how many dependencies each task has. Tasks with in-degree 0 can execute immediately.
- `rec_stack`: Set used in cycle detection to track the current DFS recursion path.
- `max_retries = 2`: Number of retry attempts before a task is marked as permanently failed.

## Key Takeaways

- DAG-based scheduling enables maximum parallelism while respecting task dependencies -- independent tasks run concurrently, dependent tasks wait.
- Cycle detection is a critical validation step: circular dependencies make execution impossible and must be caught before running.
- The in-degree-based topological sort is an efficient O(V+E) algorithm for computing parallel execution stages.
- Partial failure handling with retries ensures resilience: a single transient failure doesn't abort the entire workflow.
- Production DAG schedulers add distributed execution (tasks run on different machines), dynamic task creation, conditional branching, and checkpointing for long-running workflows.

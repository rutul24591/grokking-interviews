"""
Example 3: DAG-Based Task Scheduler for Multi-Agent Execution

Demonstrates:
- Building execution DAGs from task dependencies
- Parallel stage identification
- Dependency validation and cycle detection
- Partial failure handling with retry strategies
"""

from typing import Dict, List, Set, Any, Optional
from dataclasses import dataclass, field
from collections import defaultdict
import time


@dataclass
class TaskNode:
    id: str
    description: str
    agent: str
    dependencies: List[str] = field(default_factory=list)
    result: Any = None
    status: str = "pending"
    retries: int = 0
    max_retries: int = 2


class DAGScheduler:
    """
    DAG-based task scheduler for multi-agent orchestration.
    Supports parallel execution stages, dependency validation,
    and partial failure handling.
    """

    def __init__(self):
        self.tasks: Dict[str, TaskNode] = {}
        self.execution_log: List[Dict] = []

    def add_task(self, task: TaskNode) -> None:
        self.tasks[task.id] = task

    def validate_dag(self) -> bool:
        """Check for circular dependencies using DFS."""
        visited = set()
        rec_stack = set()

        def has_cycle(task_id: str) -> bool:
            visited.add(task_id)
            rec_stack.add(task_id)

            for dep in self.tasks[task_id].dependencies:
                if dep not in visited:
                    if has_cycle(dep):
                        return True
                elif dep in rec_stack:
                    return True

            rec_stack.discard(task_id)
            return False

        for task_id in self.tasks:
            if task_id not in visited:
                if has_cycle(task_id):
                    return False
        return True

    def get_parallel_stages(self) -> List[List[str]]:
        """Compute parallel execution stages (topological sort)."""
        in_degree = defaultdict(int)
        for task in self.tasks.values():
            for dep in task.dependencies:
                in_degree[task.id] += 1

        # Start with tasks that have no dependencies
        queue = [tid for tid in self.tasks if in_degree[tid] == 0]
        stages = []

        while queue:
            stages.append(list(queue))  # This stage can run in parallel
            next_queue = []
            for task_id in queue:
                # Reduce in-degree for dependent tasks
                for tid, task in self.tasks.items():
                    if task_id in task.dependencies:
                        in_degree[tid] -= 1
                        if in_degree[tid] == 0:
                            next_queue.append(tid)
            queue = next_queue

        return stages

    def execute_task(self, task_id: str) -> bool:
        """Execute a single task with retry logic."""
        task = self.tasks[task_id]
        task.status = "in_progress"
        self.execution_log.append({"event": "start", "task": task_id, "agent": task.agent})

        # Simulate execution (with potential failure)
        success = True  # In production, this would be the actual agent call
        if success:
            task.result = f"Output from {task.agent} for task '{task.description}'"
            task.status = "completed"
            self.execution_log.append({"event": "complete", "task": task_id})
            return True
        else:
            task.retries += 1
            if task.retries < task.max_retries:
                self.execution_log.append({"event": "retry", "task": task_id, "attempt": task.retries})
                return self.execute_task(task_id)  # Retry
            else:
                task.status = "failed"
                self.execution_log.append({"event": "failed", "task": task_id})
                return False

    def run(self) -> Dict[str, Any]:
        """Execute all tasks respecting dependencies and parallelism."""
        if not self.validate_dag():
            return {"error": "Circular dependency detected"}

        stages = self.get_parallel_stages()
        failed_tasks = []

        for i, stage in enumerate(stages):
            print(f"\nStage {i+1} (parallel): {stage}")
            for task_id in stage:
                # Check if all dependencies completed
                deps = self.tasks[task_id].dependencies
                if any(self.tasks[d].status != "completed" for d in deps if d in self.tasks):
                    self.tasks[task_id].status = "blocked"
                    failed_tasks.append(task_id)
                    continue

                success = self.execute_task(task_id)
                if not success:
                    failed_tasks.append(task_id)

        completed = sum(1 for t in self.tasks.values() if t.status == "completed")
        return {
            "completed": completed,
            "total": len(self.tasks),
            "failed": failed_tasks,
            "stages": len(stages),
        }


def main():
    scheduler = DAGScheduler()

    # Build a task DAG
    scheduler.add_task(TaskNode("t1", "Gather market data", "researcher"))
    scheduler.add_task(TaskNode("t2", "Analyze competitors", "analyst"))
    scheduler.add_task(TaskNode("t3", "Calculate market share", "analyst", dependencies=["t1", "t2"]))
    scheduler.add_task(TaskNode("t4", "Draft executive summary", "writer", dependencies=["t3"]))
    scheduler.add_task(TaskNode("t5", "Create visualizations", "designer", dependencies=["t3"]))
    scheduler.add_task(TaskNode("t6", "Write full report", "writer", dependencies=["t4", "t5"]))
    scheduler.add_task(TaskNode("t7", "Review and approve", "reviewer", dependencies=["t6"]))

    print("=== DAG-Based Task Scheduler ===")
    print(f"Tasks: {len(scheduler.tasks)}")
    print(f"Valid DAG: {scheduler.validate_dag()}")

    stages = scheduler.get_parallel_stages()
    print(f"\nParallel Execution Plan:")
    for i, stage in enumerate(stages):
        print(f"  Stage {i+1}: {stage}")

    print(f"\n=== Execution ===")
    result = scheduler.run()
    print(f"\n=== Results ===")
    print(f"  Completed: {result['completed']}/{result['total']}")
    print(f"  Stages executed: {result['stages']}")
    print(f"  Failed tasks: {result['failed']}")


if __name__ == "__main__":
    main()

"""
Example 1: Supervisor Pattern — Task Decomposition and Delegation

Demonstrates:
- Supervisor agent that decomposes goals into sub-tasks
- Delegating to specialist agents
- Collecting and synthesizing results
- DAG-based execution planning
"""

from typing import Dict, List, Any
from dataclasses import dataclass
from enum import Enum


class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Task:
    id: str
    description: str
    assigned_agent: str
    status: TaskStatus = TaskStatus.PENDING
    result: Any = None
    dependencies: List[str] = None

    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []


class SupervisorOrchestrator:
    """
    Supervisor pattern orchestrator that decomposes goals,
    delegates to specialists, and synthesizes results.
    """

    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.execution_log: List[Dict] = []

    def decompose_goal(self, goal: str) -> List[Task]:
        """Decompose a goal into sub-tasks (simulated decomposition)."""
        tasks = [
            Task(id="t1", description=f"Research: {goal}", assigned_agent="researcher"),
            Task(id="t2", description=f"Analyze findings", assigned_agent="analyst", dependencies=["t1"]),
            Task(id="t3", description=f"Write report", assigned_agent="writer", dependencies=["t2"]),
            Task(id="t4", description=f"Review and validate", assigned_agent="reviewer", dependencies=["t3"]),
        ]
        self.tasks = {t.id: t for t in tasks}
        self.execution_log.append({"event": "goal_decomposed", "goal": goal, "task_count": len(tasks)})
        return tasks

    def get_execution_order(self) -> List[List[str]]:
        """Get parallel execution plan (topological sort with parallel groups)."""
        completed = set()
        remaining = set(self.tasks.keys())
        stages = []

        while remaining:
            # Find tasks whose dependencies are all completed
            ready = [
                tid for tid in remaining
                if all(dep in completed for dep in self.tasks[tid].dependencies)
            ]
            if not ready:
                raise ValueError("Circular dependency detected")
            stages.append(ready)
            completed.update(ready)
            remaining -= set(ready)

        return stages

    def execute_task(self, task_id: str) -> Any:
        """Simulate task execution."""
        task = self.tasks[task_id]
        task.status = TaskStatus.IN_PROGRESS
        self.execution_log.append({"event": "task_started", "task_id": task_id})

        # Simulated execution
        task.result = f"Result from {task.assigned_agent} for: {task.description}"
        task.status = TaskStatus.COMPLETED
        self.execution_log.append({"event": "task_completed", "task_id": task_id})
        return task.result

    def synthesize(self) -> Dict[str, Any]:
        """Combine all task results into final output."""
        results = {tid: t.result for tid, t in self.tasks.items()}
        final_output = " | ".join(str(r) for r in results.values())
        self.execution_log.append({"event": "synthesized", "output_length": len(final_output)})
        return {"final_output": final_output, "task_results": results}

    def run(self, goal: str) -> Dict[str, Any]:
        """Execute the full orchestration pipeline."""
        # Decompose
        tasks = self.decompose_goal(goal)
        print(f"Goal: {goal}")
        print(f"Decomposed into {len(tasks)} tasks")

        # Execute in stages
        stages = self.get_execution_order()
        for i, stage in enumerate(stages):
            print(f"\nStage {i+1}: {stage}")
            for task_id in stage:
                result = self.execute_task(task_id)
                print(f"  {task_id}: {result[:50]}...")

        # Synthesize
        return self.synthesize()


def main():
    orchestrator = SupervisorOrchestrator()
    result = orchestrator.run("Q3 market analysis for cloud services")

    print(f"\n{'='*60}")
    print(f"Final Output: {result['final_output'][:100]}...")
    print(f"\nExecution Log:")
    for entry in orchestrator.execution_log:
        print(f"  {entry['event']}: {entry.get('goal', entry.get('task_id', ''))}")


if __name__ == "__main__":
    main()

# Multi-Agent Orchestration

This repository now has a file-based orchestration layer for parallel Claude, Codex, and Qwen workflows.

## Principles

- The controller owns state.
- Agents are stateless workers.
- Shared memory is serialized into artifacts, not chat history.
- Parallel work is allowed only when write intents do not conflict.
- Final repo writes happen through accepted artifact merges.

## Layout

- `orchestration/agents/`: capability profiles per agent
- `orchestration/prompts/`: shared prompt modules
- `orchestration/schemas/`: artifact and task contracts
- `orchestration/pipelines/`: declarative workflow definitions
- `orchestration/controller/`: planner, dispatcher, evaluator, merge, and recovery logic
- `.agent-state/`: runtime state, leases, context packs, prompts, artifacts, and evaluations

## Commands

```bash
pnpm orchestrator:plan -- --mode generate-article --domain "System Design Concepts" --category "Frontend-concepts" --subcategory "Rendering Strategies" --topic "Client-Side Rendering (CSR)"
pnpm orchestrator:plan -- --mode generate-article --domain "System Design Concepts" --category "Frontend-concepts" --subcategory "Rendering Strategies" --topic "Client-Side Rendering (CSR)" --agent-overrides outline-draft=qwen,article-draft=qwen
pnpm orchestrator:plan -- --mode generate-article --domain "System Design Concepts" --category "Frontend-concepts" --subcategory "Rendering Strategies" --topic "Client-Side Rendering (CSR)" --disable-primary-agents claude
pnpm orchestrator:status -- --run-id <run-id>
pnpm orchestrator:ready -- --run-id <run-id> --agent claude
pnpm orchestrator:claim -- --run-id <run-id> --agent claude
pnpm orchestrator:complete -- --run-id <run-id> --task-id <task-id> --artifact ./candidate.json --artifact-type article-outline
pnpm orchestrator:evaluate -- --run-id <run-id> --task-id <task-id>
pnpm orchestrator:merge-plan -- --run-id <run-id>
pnpm orchestrator:merge -- --run-id <run-id>
```

## Recommended flow

1. Create a run with `orchestrator:plan`.
2. Claim ready tasks per agent with `orchestrator:claim`.
3. Send the generated prompt packet to the target agent.
4. Save the agent output locally.
5. Ingest the output with `orchestrator:complete`.
6. Evaluate the task output with `orchestrator:evaluate`.
7. Repeat until the run reaches `ready_to_merge`.
8. Review `orchestrator:merge-plan` and then `orchestrator:merge`.

## Routing overrides

- Use `--agent-overrides task-type=agent-id,task-type=agent-id` to force specific tasks to a different agent for one run.
- Use `--disable-primary-agents claude` to activate fallback routing for Claude-primary tasks.
- Routing policy lives in `orchestration/routing/agent-routing.json`.

## Artifact-first execution

Every important output should become a tracked artifact under `.agent-state/runs/<run-id>/artifacts/`.

Examples:
- `article-outline`
- `article-content`
- `tsx-candidate`
- `svg-plan`
- `svg-file`
- `audit-report`
- `evaluation`

Agents should never assume previous conversational context exists unless it is present in those artifacts.

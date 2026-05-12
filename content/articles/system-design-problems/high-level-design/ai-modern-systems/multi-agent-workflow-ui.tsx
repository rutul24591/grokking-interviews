"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-agent-workflow-ui",
  title: "Design a Multi-Agent Workflow UI",
  description:
    "Architecture for a multi-agent workflow UI: agent graph builder, orchestrator/sub-agent pattern, live run monitoring with SSE, human-in-the-loop gates, parallel agent waterfall view, and run observability.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "multi-agent-workflow-ui",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-10",
  tags: ["hld", "ai", "multi-agent", "orchestration", "hitl", "sse", "llm", "workflow"],
  relatedTopics: ["ai-chatbot-frontend", "copilot-style-ai-assistant"],
};

export default function MultiAgentWorkflowUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A multi-agent workflow executes a complex task by distributing subtasks across specialized agents that run concurrently or sequentially, coordinated by an orchestrator. The UI challenge is fundamentally different from a single-agent chatbot: there are multiple streams of reasoning and tool calls happening simultaneously (or in sequence), each with their own state transitions, and the user needs to understand what is happening across all of them, intervene when needed, and review the final synthesized output. A chatbot UI designed for one conversation thread does not scale to this: you cannot render 4 parallel agents' streaming thought logs in a single chat bubble list without catastrophic information overload.</p>
        <p>The workflow UI must solve three distinct problems: workflow design (the user defines the agent graph—which agents exist, what tools each has, how they connect), workflow execution monitoring (the user observes the run in progress, sees each agent's state, can pause or interrupt), and human-in-the-loop (HITL) gating (certain steps require explicit user approval before the agent proceeds—this is the safety mechanism for high-consequence actions). The UI must present these three modes cleanly, transitioning between them as the workflow moves from design to execution to review.</p>
        <p><strong>Explicit assumptions:</strong> The orchestrator is an LLM that plans and delegates tasks to sub-agents. Each sub-agent is a separately configured LLM with a specific system prompt and tool set. Agents communicate through a shared run context (not via direct API calls to each other). The backend streams per-agent events (state changes, thought tokens, tool calls, HITL gates) via SSE. Workflows are defined as directed acyclic graphs (DAGs)—no cycles. HITL gates pause a specific agent's execution until the user approves or modifies the proposed action.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Workflow builder:</strong> A drag-and-drop graph editor where users create agent nodes, configure each agent (model, tools, system prompt, temperature), and connect them with directed edges representing task dependencies and data flow.</li>
          <li><strong>DAG validation:</strong> The builder validates the graph before execution: detecting cycles, verifying tool permissions per agent, and estimating the token budget for the planned run.</li>
          <li><strong>Live agent monitoring:</strong> During execution, each agent node in the graph shows its current state (idle, planning, running, waiting on HITL, done, error) with a live status indicator. Clicking an agent node opens its streaming thought log (reasoning tokens streamed via SSE).</li>
          <li><strong>Tool call trace:</strong> Each agent's tool calls are logged inline in the thought log: tool name, input parameters, and the returned result, shown as collapsible cards.</li>
          <li><strong>Human-in-the-loop gates:</strong> Specific agent nodes (or specific tool calls within an agent) can be marked as requiring user approval. When reached, the agent pauses, a review card appears in the UI showing the proposed action, and the user can approve, modify, or reject. Modification pre-fills the agent's context with the user's edited version.</li>
          <li><strong>Parallel waterfall view:</strong> A Gantt-style timeline showing each agent's execution span, tool call events, HITL pauses, and the final output, enabling the user to understand the run's parallelism and bottlenecks.</li>
          <li><strong>Output artifacts panel:</strong> After the run, each agent's outputs (retrieved sources, data tables, draft text, review scores) are collected and displayed in a structured artifacts panel, alongside the orchestrator's final synthesized output.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>SSE delivery latency:</strong> Agent state changes and thought tokens must appear in the UI within 100ms of emission by the backend (excluding LLM generation time).</li>
          <li><strong>Concurrent agent streams:</strong> The UI must handle up to 10 concurrent agent thought streams without frame drops (each stream is a separate SSE subscription or multiplexed on a single SSE connection with event tagging by agentId).</li>
          <li><strong>Run history:</strong> Completed run logs (all agent events, tool calls, and outputs) are persisted and loadable for replay and debugging. Loading a completed run's history renders the waterfall view without an active SSE connection.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system has three layers. The workflow builder (browser, pre-run): a graph editor for defining the agent network. Built with a canvas renderer (D3.js or React Flow) where nodes are draggable agent boxes and edges are labeled directed connections. The run monitor (browser, during-run): switches the graph canvas from edit mode to monitor mode when a run starts—nodes display live status indicators, and the panel beside the canvas shows SSE-streamed agent logs. The results viewer (browser, post-run): the canvas shows final run states, and the artifacts panel shows all agent outputs. On the backend, a workflow runner service receives the graph definition and user inputs, instantiates agents in dependency order, manages parallelism, emits SSE events to the browser, and persists the run log.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/multi-agent-workflow-ui-architecture.svg"
          alt="Multi-agent workflow UI architecture showing orchestration graph at top (orchestrator agent delegating to Researcher, Analyst, Writer, Critic sub-agents with delegation arrows down and result arrows back up dashed), UI layer below with three panels: Workflow Builder (drag-and-drop agent graph, agent config panel, execution triggers, DAG validation for cycles and tool permissions), Run Monitor (live agent status idle/running/waiting/done/error, streaming thought log, human-in-the-loop gate, interrupt/resume/retry, tool call trace), and Results and Observability (run metrics wall time token cost error count, output artifacts per agent, SSE event types)."
          caption="Multi-agent architecture: orchestrator delegates to parallel sub-agents → UI shows live status per node, streaming thought logs, HITL gates, and post-run artifacts"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Workflow Builder and Graph Editor</h3>
        <p>The graph editor renders the agent network as a canvas with draggable nodes (agents) and directed edges (dependencies). Each agent node has a configuration panel (opened by clicking the node) with: display name, model selection (from a list of available models), system prompt (textarea), tool selections (checkboxes from the available tool registry), temperature and max token settings, and a HITL gate toggle (marks this agent's tool calls as requiring approval). Edges are drawn by dragging from one node's output port to another's input port. Edge labels describe what data flows between the agents ("research findings," "analysis results," "draft text").</p>
        <p>DAG validation runs on every graph edit. Cycle detection uses a depth-first search (DFS) from each node, marking a cycle if a back edge is found. If a cycle is detected, the offending edge is highlighted in red and a tooltip explains the error. Token budget estimation computes the maximum context window consumption for each agent (system prompt tokens + expected context from predecessor agents), flagging agents where the estimated context exceeds the model's context window. This prevents runtime failures caused by context overflow.</p>
        <p>Tool permission validation checks that each agent's assigned tools are permitted by the current user's role. An analyst agent assigned a database-write tool but operated by a read-only user fails this validation, and the tool is flagged in the configuration panel with an error icon. Workflows cannot be launched with tool permission errors unresolved.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Run Execution and SSE Event Multiplexing</h3>
        <p>When the user launches a run, the browser opens a single SSE connection to the run endpoint (GET /runs/&#123;runId&#125;/stream). All agent events for the run are multiplexed on this single connection, tagged by agentId in the event payload. The frontend demultiplexes events by agentId into per-agent state stores. This is more efficient than opening one SSE connection per agent (which would consume browser connection slots) and simpler than WebSocket (no connection upgrade required, works through HTTP/2).</p>
        <p>SSE event types: agent_status (&#123;agentId, state&#125;, emitted on every state transition), thought_token (&#123;agentId, token&#125;, emitted for each reasoning token the agent generates), tool_call (&#123;agentId, tool, input, output&#125;, emitted when a tool call completes), hitl_gate (&#123;agentId, proposedAction, options&#125;, emitted when an agent reaches a HITL checkpoint), and run_complete (&#123;artifacts, metrics&#125;, emitted when the orchestrator finishes aggregating results). The frontend handles each event type with a corresponding reducer: agent_status updates the node's status indicator in the graph, thought_token appends to the agent's log buffer (flushed to React state via rAF), tool_call appends a tool call card to the log, hitl_gate raises the approval overlay, and run_complete transitions the UI to the results view.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Human-in-the-Loop Gate</h3>
        <p>When an agent reaches a HITL checkpoint (either because the node is marked as HITL-gated, or because a specific tool is marked as requiring approval), the backend pauses the agent's execution, emits a hitl_gate event, and waits for a resume signal. The HITL gate can wait indefinitely—the backend persists the paused agent's state to durable storage (Redis or a job queue) so it survives server restarts. The UI renders an approval overlay: a card showing the proposed action (e.g., "The Researcher agent wants to search for: [query text]"), the agent's reasoning that led to this action (from the thought log), and three buttons: Approve (resumes with the proposed action), Modify (pre-fills an edit field with the proposed action text, allowing the user to change the query before approving), and Reject (sends a rejection signal to the agent, which then generates an alternative approach or terminates).</p>
        <p>HITL gate timing: the time the user spends reviewing and approving is tracked separately from the agent's execution time in the run metrics. The waterfall view shows HITL pauses as orange segments on the agent's timeline bar, distinct from active execution (colored) and waiting for predecessor completion (gray). This distinguishes human latency from agent latency when analyzing run performance.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Streaming Thought Logs</h3>
        <p>Each agent has a thought log panel that shows its streaming reasoning. The thought log is structured into three sections: Planning (the agent's initial breakdown of its task into steps), Execution (the agent's step-by-step reasoning and tool calls), and Result (the agent's final output passed to the orchestrator). Within the Execution section, tool call cards appear inline: a collapsed card showing "Called: web_search(query)" expands to show the full input parameters and the returned result. This gives the user visibility into the agent's tool use without overwhelming the log with raw API responses.</p>
        <p>The thought log scrolls automatically to the latest token during active streaming (auto-scroll-to-bottom). If the user scrolls up to review earlier content, auto-scroll is suspended. A "scroll to latest" button appears in the bottom-right of the log panel when the user is not at the bottom; clicking it re-enables auto-scroll. This is the same scroll behavior used in chat UIs but applied per-agent panel.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Parallel Waterfall View</h3>
        <p>The waterfall view is a Gantt chart showing all agents as horizontal bars on a shared time axis. The x-axis is wall-clock time from run start. Each agent's bar is divided into segments: gray (waiting for predecessor), colored (actively running or streaming), orange (HITL pause), red (error/retry), green (done). Tool call events appear as vertical markers on the agent's bar. The orchestrator's bar spans the full run duration, showing planning and aggregation phases. Hovering a bar segment shows the tooltip with the time range and segment description. Hovering a tool call marker shows the tool name and input.</p>
        <p>The waterfall view is rendered from the run log (either live-updated during execution or loaded from history for completed runs). The time axis auto-scales to fit the longest agent's duration, with zoom controls for runs that span many minutes. Long HITL pauses compress the time axis to keep the overall run visible—a 10-minute user review pause is shown as an annotated break in the timeline rather than wasted whitespace.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Interrupt, Retry, and Rollback</h3>
        <p>The run monitor provides three intervention actions. Interrupt stops a specific agent immediately; its output so far is preserved in the run log. The orchestrator receives an "agent interrupted" signal and either routes the task to a different agent or terminates the run. Retry re-queues a failed agent from the beginning of its task (not from the point of failure). Retries use exponential backoff: the first retry is immediate, the second waits 2s, the third waits 8s. After 3 retries, the agent enters a permanent error state and the orchestrator is notified. Cancel run terminates the entire run, emitting cancellation signals to all running agents and closing the SSE connection. The run is marked as "cancelled" in run history, with partial logs preserved for debugging.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/multi-agent-workflow-ui-run-lifecycle.svg"
          alt="Multi-agent run lifecycle showing agent state machine (idle → planning → running → done; or running → waiting on HITL → running on approval; or running → error → retry with exponential backoff), SSE event types (agent_status, thought_token, tool_call, hitl_gate, run_complete with payload schemas), and parallel waterfall Gantt chart showing Orchestrator bar spanning full 40s, Researcher and Analyst bars running in parallel 0-20s, HITL pause marker at 20s, Writer bar starting at 20s, Critic bar starting at 30s, final output at 40s; run summary metrics showing wall time 38s, total token cost $0.047, HITL pause 12s user review."
          caption="Agent state machine (idle/planning/running/waiting/done/error), SSE event types, and parallel waterfall view showing concurrent agent execution, HITL gate pause, and run summary metrics"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>DAG versus arbitrary graph: restricting the workflow to a DAG (no cycles) simplifies execution scheduling (topological sort), prevents infinite loops, and makes the waterfall view coherent (time progresses left-to-right). However, some AI workflows naturally involve iteration: a writer agent produces a draft, the critic scores it below a threshold, and the writer iterates. Supporting this requires either allowing cycles in the graph (with a maximum iteration count to prevent infinite loops) or modeling the iteration as a special "retry edge" pattern that the execution engine handles distinctly from dependency edges. Starting with a strict DAG and adding controlled iteration as a named pattern is the safer incremental path.</p>
        <p>HITL gate granularity: marking an entire agent as HITL-gated (every action requires approval) is safe but creates high user burden for agents with many tool calls. Marking specific tool calls as HITL-gated (e.g., only the "send email" tool requires approval, but "web search" does not) is more precise but requires the tool registry to express this policy. The right granularity depends on the sensitivity of the action and the user's trust in the agent: a research agent's searches rarely need approval; an email agent's sends always do. The UI should allow HITL configuration at both the agent level (all actions) and the tool level (specific tools), with tool-level configuration taking precedence.</p>
        <p>Token cost accumulation: multi-agent workflows multiply LLM costs—5 agents each spending 10K tokens is 50K tokens per run. Without budget controls, production workflows can generate unexpectedly large bills. The UI should show a cost estimate before launching (based on system prompt sizes and expected task sizes), a live cost meter during execution, and a configurable budget cap that stops the run and notifies the user if total token cost exceeds the configured limit. The budget cap is enforced server-side (not just in the UI) so it cannot be bypassed.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A multi-agent workflow UI has three modes: builder (graph editor for defining agents and dependencies, with DAG validation and budget estimation before launch), monitor (live run view with per-agent status indicators, streaming thought logs, tool call traces, and HITL approval overlays, all delivered via a multiplexed SSE connection tagged by agentId), and results viewer (Gantt waterfall showing parallelism and HITL pauses, structured artifact panels per agent, and run summary metrics). The SSE event model emits agent_status, thought_token, tool_call, hitl_gate, and run_complete events; the frontend demultiplexes by agentId into per-agent state stores, using rAF batching for thought token rendering (same pattern as single-agent streaming). HITL gates persist paused agent state server-side (Redis) while awaiting user approval, which can be indefinite. Interrupt, retry (with exponential backoff), and cancel provide intervention controls. The defining design challenge is presenting multiple concurrent streams of AI reasoning to a human user without overwhelming them—solved by organizing information per-agent node, making thought logs drill-down rather than top-level, and using the waterfall view for temporal orientation across the full run.</p>
      </section>
    </ArticleLayout>
  );
}

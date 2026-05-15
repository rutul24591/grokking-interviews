"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-multi-agents",
  title: "Multi-Agent Systems — Coordinated AI Agent Architectures",
  description:
    "Comprehensive guide to multi-agent systems covering agent orchestration patterns, coordination strategies, debate and consensus mechanisms, role specialization, conflict resolution, and production-scale multi-agent architectures.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "multi-agents",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: ["ai", "multi-agent", "orchestration", "coordination", "debate"],
  relatedTopics: ["agents", "agent-orchestration", "skills", "mcp"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: define the constraint/goal and name the 2–3 variables that actually drive design decisions in production.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A <strong>multi-agent system</strong> is an architecture where two or
          more AI agents collaborate to accomplish tasks that a single agent
          cannot handle effectively alone. Each agent in the system has its own
          agent loop, tool set, and potentially its own model, and they
          coordinate through a communication protocol to divide work, share
          findings, resolve disagreements, and combine results into a final
          output.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The motivation for multi-agent systems stems from the fundamental
          limitations of single-agent architectures. A single agent with many
          tools struggles to select the right tool (attention dilution), cannot
          parallelize independent tasks (sequential execution), lacks
          specialization depth (generalist vs. specialist trade-off), and has no
          built-in mechanism for quality checking its own outputs (no
          self-review). Multi-agent systems address each of these: by
          distributing tools across specialized agents, each agent has a smaller,
          more focused tool set; independent sub-tasks can be executed in
          parallel; specialist agents develop deeper expertise in their domain;
          and reviewer/validator agents can check the work of other agents,
          catching errors before they reach the user.
        </HighlightBlock>
        <p>
          Multi-agent systems are inspired by human organizational structures.
          Just as a company divides work across departments (engineering,
          marketing, sales), each with its own expertise and internal processes,
          a multi-agent system divides cognitive work across specialized agents,
          each with its own tool set and reasoning approach. The coordination
          challenge is similar too — departments need a management layer to
          resolve conflicts, allocate resources, and ensure alignment with
          overall goals, just as multi-agent systems need a supervisor or router
          to coordinate agent activities.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: show you understand the primitives and which ones matter at scale (latency, correctness, UX, cost).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The foundation of any multi-agent system is the{" "}
          <strong>agent topology</strong> — the structure of how agents relate
          to each other and communicate. The most common topologies are{" "}
          <strong>hierarchical</strong> (a supervisor agent delegates to
          subordinate agents), <strong>peer-to-peer</strong> (agents communicate
          directly with each other as equals), <strong>sequential</strong>{" "}
          (agents form a pipeline where each agent&apos;s output feeds into the
          next), and <strong>debate</strong> (multiple agents independently
          analyze the same problem and their outputs are compared or combined).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Role specialization</strong> is the primary benefit of
          multi-agent architectures. Each agent is given a specific role with a
          focused tool set and domain expertise. A research agent has web search
          and document analysis tools, a coding agent has file system and code
          execution tools, a review agent has code analysis and testing tools.
          By narrowing each agent&apos;s scope, the LLM within each agent can
          make better tool selection decisions (fewer options to choose from)
          and produce higher-quality outputs (more focused context).
        </HighlightBlock>
        <p>
          <strong>Coordination protocols</strong> define how agents communicate
          and collaborate. The simplest protocol is the{" "}
          <strong>handoff protocol</strong> — one agent completes its work and
          passes the result to the next agent in the chain. The{" "}
          <strong>request-response protocol</strong> allows any agent to request
          information or action from any other agent at any time. The{" "}
          <strong>publish-subscribe protocol</strong> allows agents to broadcast
          findings that other agents can consume when relevant. The choice of
          protocol affects the system&apos;s flexibility, complexity, and
          potential for deadlock.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/multi-agent-topologies.svg"
          alt="Multi-Agent Topologies"
          caption="Agent topologies — hierarchical (supervisor delegates), sequential (pipeline), peer-to-peer (direct communication), and debate (independent analysis)"
        />

        <p>
          <strong>Debate and consensus</strong> is a powerful pattern for
          improving output quality. Multiple agents independently analyze the
          same problem and produce their own answers. A judge agent then
          compares the answers, identifies points of agreement (consensus) and
          disagreement, and either selects the most compelling answer,
          synthesizes a combined answer, or requests the disagreeing agents to
          discuss and resolve their differences. This pattern catches errors
          that a single agent would miss — if two of three agents arrive at the
          same answer, it&apos;s more likely to be correct than if all three
          agree (which could indicate a systematic bias).
        </p>
        <p>
          <strong>Conflict resolution</strong> is necessary when agents
          disagree on facts, approaches, or conclusions. Conflicts arise because
          agents may have access to different information, use different
          reasoning approaches, or interpret ambiguous inputs differently.
          Resolution strategies include: voting (majority wins), confidence-based
          selection (the agent with highest confidence wins), evidence-based
          resolution (agents present their evidence, and a judge evaluates which
          evidence is stronger), and discussion-based resolution (agents discuss
          their reasoning and attempt to reach consensus).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the end-to-end flow, where state lives, and where you add backpressure, caching, and observability.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A production multi-agent architecture consists of a{" "}
          <strong>supervisor/router agent</strong> that receives the initial
          request, classifies it, and delegates it to the appropriate specialist
          agent(s). The supervisor maintains the overall context and goal, tracks
          the progress of each subordinate agent, resolves conflicts, and
          combines results into a final output. The supervisor is the only agent
          that communicates directly with the user — specialist agents communicate
          with the supervisor, not with the user.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Specialist agents</strong> each have their own system prompt,
          tool set, and domain expertise. A coding agent has file system access,
          code execution, and testing tools. A research agent has web search,
          document retrieval, and summarization tools. A review agent has code
          analysis, security scanning, and quality assessment tools. Each agent
          operates its own agent loop independently, and the supervisor can
          query their status at any time.
        </HighlightBlock>
        <p>
          The <strong>communication layer</strong> is the protocol that agents
          use to exchange information. In a simple implementation, this is a
          shared message queue where agents post messages and other agents
          consume them. In a more sophisticated implementation, agents have
          dedicated channels for different types of communication — a
          request-response channel for specific queries, a broadcast channel for
          status updates, and a discussion channel for debate and consensus
          building.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/multi-agent-coordination.svg"
          alt="Multi-Agent Coordination Flow"
          caption="Coordination flow — supervisor receives request → delegates to specialists → collects results → resolves conflicts → produces final output"
        />

        <p>
          <strong>State management</strong> in multi-agent systems is more
          complex than in single-agent systems. The supervisor must track the
          state of each subordinate agent (what it&apos;s working on, what it
          has completed, whether it&apos;s stuck), manage the shared context
          (information that all agents need access to), and handle agent failures
          (what happens when an agent doesn&apos;t respond or produces an error).
          The state management approach affects the system&apos;s ability to
          recover from failures, handle concurrent requests, and provide
          progress updates to the user.
        </p>
        <p>
          <strong>Cost and latency</strong> are the primary trade-offs of
          multi-agent systems. A multi-agent system with 3 specialist agents and
          1 supervisor makes at least 4x more LLM calls than a single-agent
          system for the same task, resulting in 4x the cost and significantly
          higher latency (agents execute sequentially unless their tasks are
          independent). This cost must be justified by a proportional improvement
          in output quality. Multi-agent systems are justified when the task
          requires genuine specialization (a coding task and a research task are
          fundamentally different), parallel execution (multiple independent
          sub-tasks), or quality assurance (the review agent catches errors that
          would be costly to ship).
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <HighlightBlock as="p" tier="crucial">
          Decision rule: choose the approach that makes failure modes explicit and keeps the common path fast, while keeping correctness boundaries clear.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Single-agent vs. multi-agent</strong> is the fundamental
          decision. Single-agent systems are simpler, cheaper, faster, and
          easier to debug. Multi-agent systems are more complex, expensive,
          slower, but produce higher-quality output for tasks that benefit from
          specialization, parallelism, or quality assurance. The decision matrix
          is: use single-agent for tasks that fit within one agent&apos;s tool
          set and reasoning capability; use multi-agent for tasks that span
          multiple domains, require independent parallel work, or need a review
          layer before output.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Homogeneous vs. heterogeneous agents</strong> refers to
          whether agents use the same model or different models. Homogeneous
          agents (all using the same model) are simpler to deploy and debug, but
          lack the diversity that comes from different models having different
          strengths and failure modes. Heterogeneous agents (using different
          models) can leverage each model&apos;s strengths — one model may
          excel at coding, another at reasoning, another at creative writing —
          but add deployment complexity, cost variation, and debugging
          difficulty. The debate pattern specifically benefits from
          heterogeneity because diverse models are more likely to produce
          diverse answers.
        </HighlightBlock>
        <p>
          <strong>Tight vs. loose coupling</strong> determines how dependent
          agents are on each other. Tightly coupled agents form a pipeline where
          each agent&apos;s output is required for the next agent to proceed —
          this is efficient but fragile (one agent failure breaks the chain).
          Loosely coupled agents work independently and their results are
          combined at the end — this is resilient (one agent failure reduces
          quality but doesn&apos;t break the system) but may produce less
          coherent results because agents lack context from each other&apos;s
          work. The pragmatic approach is tight coupling for critical path
          dependencies and loose coupling for optional enhancements.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/multi-agent-debate-consensus.svg"
          alt="Debate and Consensus Pattern"
          caption="Debate pattern — agents independently analyze → produce answers → judge compares → resolves disagreements → produces final answer"
        />

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/multi-agent-coordination-patterns.svg"
          alt="Multi-Agent Coordination Patterns"
          caption="Coordination patterns — supervisor (centralized control), consensus (majority vote across parallel agents), and debate (proposer vs critic with iterative refinement)"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: list the 3–5 non-negotiables you would enforce with tests, budgets, and monitoring.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Start with a <strong>single agent and split only when necessary</strong>.
          Begin with a single agent that has all the tools needed for the task.
          If the agent consistently makes errors in tool selection (choosing the
          wrong tool from a large set), struggles with context window (too much
          information from different domains), or would benefit from parallel
          execution, then split into multiple agents. Each split should be
          motivated by a specific, measurable problem.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Minimize inter-agent communication</strong>. Each message
          between agents costs tokens, adds latency, and introduces potential
          for miscommunication. Design agents to be as self-sufficient as
          possible, communicating only when necessary. When communication is
          needed, make messages structured and information-dense — a single
          comprehensive message is better than multiple back-and-forth exchanges.
        </HighlightBlock>
        <p>
          Implement <strong>agent-level observability</strong> — track each
          agent&apos;s inputs, outputs, tool calls, errors, and latency. In a
          multi-agent system, debugging is significantly harder because a
          failure could originate in any agent or in the coordination layer.
          Per-agent observability lets you identify which agent is underperforming
          and optimize it independently.
        </p>
        <p>
          <strong>Design clear agent boundaries</strong>. Each agent should
          have a non-overlapping tool set and a clearly defined responsibility.
          If two agents have overlapping capabilities (both can search the
          database, both can send emails), the supervisor may delegate to the
          wrong one. Clear boundaries also simplify debugging — if database
          queries are failing, you know to look at the data agent, not the
          communication agent.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: call out the top failure modes teams hit in production and how you prevent/mitigate them.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The most common pitfall is <strong>over-engineering with too many
          agents</strong>. A system with 5+ agents for a task that a single
          agent could handle with better prompting is wasteful — it costs 5x
          more, takes 5x longer, and introduces 5x the debugging complexity.
          The multi-agent pattern should be used only when there is a clear,
          measurable benefit that cannot be achieved through prompt engineering,
          skill organization, or tool optimization within a single agent.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Coordination overhead</strong> can negate the benefits of
          specialization. If agents spend more time communicating and
          coordinating than doing actual work, the system is inefficient. The
          ratio of coordination time to productive work time should be kept
          below 20% — if agents are exchanging more messages than making
          progress on the task, the topology or communication protocol needs
          redesign.
        </HighlightBlock>
        <p>
          <strong>Error propagation</strong> is more damaging in multi-agent
          systems. When one agent produces incorrect output, it corrupts the
          input to all downstream agents. Without validation at agent boundaries
          (checking each agent&apos;s output before passing it to the next
          agent), a single error can cascade through the entire system,
          producing a final output that is wrong in ways that are hard to trace
          back to the original source. Always validate agent outputs against
          expected schemas and content constraints before forwarding them.
        </p>
        <p>
          <strong>State inconsistency</strong> occurs when agents operate on
          stale or conflicting information. If Agent A updates a shared resource
          and Agent B reads it before the update propagates, Agent B will make
          decisions based on outdated information. This is particularly
          problematic in parallel execution where agents work simultaneously on
          related sub-tasks. Solutions include explicit state synchronization
          points (agents wait for each other at defined checkpoints) and
          optimistic concurrency control (agents detect conflicts and resolve
          them).
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: connect the design to measurable outcomes (CWV, conversion, error rates) and operational practices.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Software development teams</strong> — a multi-agent system
          with a planner agent (decomposes feature requirements into tasks), a
          coding agent (implements the code), a testing agent (writes and runs
          tests), a review agent (reviews code for quality and security), and a
          deployment agent (deploys to staging and production). This pattern is
          used by Devin, OpenDevin, and SWE-agent, where each agent specializes
          in one aspect of the software development lifecycle.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Research and analysis</strong> — a research system with a
          search agent (finds relevant papers and data), an analysis agent
          (extracts key findings and compares approaches), a synthesis agent
          (combines findings into a coherent narrative), and a review agent
          (fact-checks and validates citations). The debate pattern is
          particularly useful here — multiple analysis agents independently
          evaluate the same paper, and their agreement/disagreement provides
          confidence in the analysis quality.
        </HighlightBlock>
        <p>
          <strong>Customer operations at scale</strong> — a customer support
          system with a triage agent (classifies the request and gathers
          context), a resolution agent (handles standard queries like refunds,
          status checks, and policy questions), an escalation agent (handles
          complex issues that require human judgment), and a follow-up agent
          (ensures the issue is resolved and the customer is satisfied). Each
          agent specializes in a different level of the support hierarchy.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and how you’d validate/operate the system.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: When should you use a multi-agent system instead of a single
            agent with more tools?
          </h3>
          <HighlightBlock as="p" tier="important">
            Use a multi-agent system when: the task spans multiple distinct
            domains that require different tool sets (coding vs. research vs.
            communication), the LLM struggles with tool selection because there
            are too many options (20+ tools), the task has independent
            sub-tasks that can be parallelized for speedup, or you need a
            quality assurance layer where one agent reviews another&apos;s work.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            Stick with a single agent when: the task fits within one
            domain&apos;s tool set, the tool count is manageable (under 15), the
            task requires sequential execution (each step depends on the
            previous), or cost and latency are primary concerns.
          </HighlightBlock>
          <p>
            The key test is: would splitting into multiple agents measurably
            improve output quality? If the answer is &quot;it would be more
            organized&quot; but not &quot;it would be more accurate,&quot; stick
            with a single agent and improve the tool organization or prompting.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: How does the debate pattern improve output quality and when is
            it most effective?
          </h3>
          <p>
            The debate pattern improves quality through independent verification.
            When multiple agents independently analyze the same problem, they
            each bring different reasoning paths, different interpretations of
            the input, and potentially different strengths (if using
            heterogeneous models). The judge agent then compares their answers,
            identifies points of agreement (which are likely correct because
            independent agents reached the same conclusion) and disagreement
            (which indicates ambiguity or complexity that needs deeper analysis).
          </p>
          <p>
            The debate pattern is most effective when: the task has a
            verifiable answer (math, code correctness, factual questions) where
            agreement between agents is meaningful, the agents use different
            models or prompting strategies to maximize diversity of thought, the
            judge agent has access to the full reasoning (not just the answers)
            so it can evaluate the quality of each agent&apos;s logic, and the
            cost of being wrong is high enough to justify the 2-3x cost overhead
            of running multiple agents.
          </p>
          <p>
            It is least effective for creative or subjective tasks where there
            is no &quot;correct&quot; answer to agree on, or when all agents use
            the same model with the same prompt (they will likely produce
            similar answers, giving a false sense of confidence).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you handle agent failures in a multi-agent system?
          </h3>
          <p>
            Agent failure handling requires a layered approach. At the{" "}
            <strong>individual agent level</strong>, each agent should have
            retry logic, timeout limits, and structured error reporting. If an
            agent fails, it reports a structured error (what failed, why, what
            it was working on) to the supervisor.
          </p>
          <p>
            At the <strong>supervisor level</strong>, the supervisor decides
            how to respond based on the failed agent&apos;s role in the overall
            workflow. If the agent is on the critical path (no other agent can
            proceed without its output), the supervisor can: retry the agent
            with different inputs, delegate the task to an alternative agent
            with overlapping capabilities, decompose the task differently to
            bypass the failed agent, or escalate to a human with a description
            of the failure. If the agent is not on the critical path (its output
            enhances but isn&apos;t required for the final result), the
            supervisor can proceed without it and note the missing enhancement
            in the final output.
          </p>
          <p>
            At the <strong>system level</strong>, the multi-agent system should
            track failure rates per agent, detect patterns (is a particular
            agent consistently failing on a particular type of task?), and
            trigger alerts when failure rates exceed thresholds. Long-term, this
            data drives agent optimization — agents with high failure rates need
            debugging attention, and tasks that frequently cause failures may
            need to be redesigned or handled by humans.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you design agent boundaries to minimize overlap and
            maximize specialization?
          </h3>
          <p>
            Agent boundaries should be designed around <strong>domain
            separation</strong> — each agent owns a distinct domain of
            expertise with its own tool set, knowledge base, and reasoning
            patterns. The boundaries should be mutually exclusive (no two agents
            own the same domain) and collectively exhaustive (all required
            domains are covered by some agent).
          </p>
          <p>
            The design process is: identify the distinct domains the system
            needs to handle (coding, research, communication, analysis, etc.),
            for each domain, list the tools, knowledge, and reasoning patterns
            it requires, group tools and knowledge into non-overlapping sets,
            and assign each set to an agent. If a tool or knowledge area could
            belong to multiple domains, assign it to the domain where it is most
            frequently used.
          </p>
          <p>
            Additionally, design each agent&apos;s system prompt to clearly
            state its role, its boundaries (what it should and should not do),
            and when it should escalate to the supervisor. An agent that knows
            its boundaries is less likely to overstep and produce outputs in
            domains where it lacks expertise.
          </p>
        </div>
      </section>

      <section>
        <h2>Production Scaling &amp; Framework Comparison</h2>
        <div className="space-y-4">
          <p>
            The gap between a working multi-agent prototype and a production
            system is wide. Three problem areas dominate: state management at
            scale, cost control, and framework selection.
          </p>

          <h3 className="text-lg font-semibold mt-4">Production Scaling: Concurrent Orchestrations</h3>
          <p>
            A single supervisor coordinating 5 sub-agents is straightforward.
            A platform running 1,000 concurrent orchestrations across 50,000
            sub-agent steps per hour requires a fundamentally different
            architecture. Key production concerns:
          </p>
          <p>
            <strong>Distributed state storage:</strong> Agent memory and
            intermediate results cannot live in-process. Use Redis for hot
            working memory (current step state, tool call results), PostgreSQL
            for durable task records, and an object store (S3) for large
            artifacts (generated code, documents). Each orchestration is
            identified by a UUID and all state is addressed by
            &#123;orchestration_id, agent_id, step&#125;.
          </p>
          <p>
            <strong>Worker pool architecture:</strong> Decouple the orchestration
            engine from the LLM inference calls. The orchestrator submits agent
            step requests to a job queue (SQS, Celery, Temporal workflows).
            Workers pull jobs, make LLM API calls, store results, and emit events
            that trigger the next step. This makes the system horizontally
            scalable (add workers) and resilient (failed workers restart without
            losing orchestration state).
          </p>
          <p>
            <strong>Temporal / workflow engines:</strong> Temporal (open-source)
            is the production standard for durable multi-agent workflows. It
            provides: automatic retries with configurable backoff, exactly-once
            semantics for tool calls, full execution history for debugging, and
            deterministic replay for debugging failed runs. The tradeoff is
            operational complexity — Temporal requires its own cluster. For
            simpler cases, AWS Step Functions or Inngest provide similar
            guarantees with less infrastructure overhead.
          </p>

          <h3 className="text-lg font-semibold mt-4">Dynamic Agent Spawning</h3>
          <p>
            Static agent teams (fixed roles, fixed count) fail for tasks of
            unknown complexity. A research task might need 3 agents or 30
            depending on the scope of the question. Dynamic spawning lets the
            orchestrator create new agents on demand:
          </p>
          <p>
            The supervisor maintains an agent pool with a maximum concurrency
            cap (e.g., 20 sub-agents per orchestration). When a subtask is
            identified, the supervisor checks if capacity is available; if so,
            it spawns a new agent instance with a scoped system prompt and tool
            set. When the subtask completes, the agent is terminated and its
            resources released. The supervisor collects results via an async
            event channel.
          </p>
          <p>
            The critical guard is the <strong>recursion depth limit</strong> — a
            sub-agent must not be able to spawn further sub-agents without the
            supervisor&apos;s knowledge, or the system can produce exponential
            agent growth. Enforce this by only granting the
            &quot;spawn_agent&quot; tool to the supervisor role; sub-agents have
            no access to it.
          </p>

          <h3 className="text-lg font-semibold mt-4">Token Amplification &amp; Cost Modeling</h3>
          <p>
            Multi-agent systems have a severe cost multiplier effect. A single
            user query that would cost $0.01 in direct generation can cost
            $0.50-$2.00 in a multi-agent system due to:
          </p>
          <p>
            (1) <strong>Message passing overhead:</strong> every inter-agent
            message includes the full conversation history. An orchestration with
            5 agents and 10 rounds of communication multiplies token consumption
            by ~50× vs. a single call.
          </p>
          <p>
            (2) <strong>Redundant context:</strong> each agent re-reads the task
            description and prior results from scratch on every step because LLMs
            are stateless.
          </p>
          <p>
            Cost mitigation strategies: (a) <strong>Aggressive summarization</strong>
            — the supervisor summarizes completed sub-task results before passing
            them to the next sub-agent, rather than passing the full conversation
            history; (b) <strong>Model tiering</strong> — use expensive frontier
            models only for planning (supervisor) and specialized judgment
            (critic); use cheaper models (GPT-4o mini, Claude Haiku) for
            routine sub-tasks like data formatting, classification, and
            extraction; (c) <strong>Prefix caching</strong> — keep the system
            prompt and task description identical across sub-agents to maximize
            KV cache hit rate on the inference server; (d) <strong>Budget caps</strong>
            — set hard token budgets per orchestration; the supervisor agent
            receives its remaining token budget as context and must plan within
            it.
          </p>
          <p>
            A realistic cost model for a software development agent team
            (planner + 4 coders + reviewer) producing 200-line code: ~150K
            tokens per orchestration at $0.50 on GPT-4o, or ~$0.05 on Claude
            Haiku for the sub-agents with GPT-4o only for planning. Model tiering
            is typically the highest-leverage cost reduction.
          </p>

          <h3 className="text-lg font-semibold mt-4">Framework Comparison: LangGraph vs. CrewAI vs. AutoGen</h3>
          <p>
            Three frameworks dominate production multi-agent development in 2025:
          </p>
          <p>
            <strong>LangGraph</strong> (LangChain) models agent workflows as a
            directed graph where nodes are LLM calls or tool executions and edges
            encode control flow (conditional transitions, loops). The programming
            model is explicit — you write the graph structure, which makes
            complex control flows (parallel branches, cycles, checkpointing)
            transparent and debuggable. Drawback: verbose for simple workflows;
            you write a lot of graph definition code. Best for: production systems
            where control flow correctness is critical; systems that need
            LangSmith observability integration.
          </p>
          <p>
            <strong>CrewAI</strong> uses a role-based agent abstraction — you
            define agents as team members with roles, goals, and backstories.
            The orchestration is handled by a built-in crew manager. The
            programming model is higher-level and faster to prototype. Drawback:
            less control over execution flow; the built-in orchestration can
            produce unexpected agent interactions. Best for: rapid prototyping;
            business-workflow automations where the role metaphor maps cleanly
            to the domain.
          </p>
          <p>
            <strong>AutoGen</strong> (Microsoft) implements the
            ConversableAgent pattern: agents are participants in a conversation,
            and complex behaviors emerge from message exchange patterns. The
            GroupChat abstraction lets you define multi-agent conversations with
            configurable turn-taking rules. Best for: research settings, debate
            patterns (multiple agents critiquing each other), and scenarios where
            emergent conversation structure is acceptable. Less suited to
            production systems with strict control flow requirements.
          </p>
          <p>
            <strong>Decision rule:</strong> For production systems with defined
            workflows, use LangGraph. For business process automation prototypes,
            use CrewAI. For research and experimental agent patterns, use AutoGen.
            All three support the same underlying models (OpenAI, Anthropic,
            local via Ollama).
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: Design a production multi-agent system for complex software
            development automation: given a GitHub issue, the system should plan
            the implementation, write code across multiple files, run tests,
            fix failures, and open a pull request. Design for correctness,
            cost efficiency, and observability.
          </h3>
          <p>
            This is a principal-level question testing the ability to design a
            multi-agent system with real production constraints.
          </p>
          <p className="mt-2">
            <strong>Agent architecture (5 agents):</strong>
          </p>
          <p>
            <em>Planner agent</em> (GPT-4o): reads the GitHub issue and codebase
            context (retrieved via RAG over the repo), produces a structured
            implementation plan: &#123;files_to_modify: [], new_files: [], test_strategy: &quot;...&quot;,
            estimated_complexity: &quot;S/M/L&quot;&#125;. Aborts if complexity is XL
            (escalates to human).
          </p>
          <p>
            <em>Coder agents</em> (Claude Haiku, spawned dynamically): one per
            file to modify. Each receives the implementation plan, the specific
            file to edit, and the relevant context (adjacent files, type
            definitions). Produces a unified diff. Operates in parallel across
            files.
          </p>
          <p>
            <em>Integrator agent</em> (GPT-4o mini): applies all diffs to a
            git branch in a sandboxed container, resolves merge conflicts, runs
            the test suite, and collects test output.
          </p>
          <p>
            <em>Debugger agent</em> (Claude Haiku, up to 3 iterations): receives
            failing test output and the relevant code, produces targeted fixes.
            Exits when all tests pass or after 3 failed attempts (escalates to
            human).
          </p>
          <p>
            <em>Reviewer agent</em> (GPT-4o): performs final code review against
            a style guide checklist, generates the PR description with change
            summary, test evidence, and open questions.
          </p>
          <p className="mt-2">
            <strong>Cost control:</strong> Planner and Reviewer use expensive
            models; Coders and Debugger use cheap models. The Planner summarizes
            the implementation plan before handing off (not the full issue
            thread). Prefix caching on the repository context prompt shared by
            all Coders reduces input token cost by ~40%.
          </p>
          <p className="mt-2">
            <strong>Orchestration:</strong> Temporal workflow. Each agent step
            is a Temporal activity with a 2-minute timeout and 3 retries. The
            full orchestration has a 30-minute wall-clock cap. All intermediate
            state (plans, diffs, test results) is stored in S3 keyed by
            &#123;issue_id, run_id&#125;.
          </p>
          <p className="mt-2">
            <strong>Observability:</strong> Every agent call is traced with
            LangSmith (span per agent, input/output tokens, latency, cost).
            A dashboard tracks: success rate (PR opened), debugger loop
            iterations (leading indicator of task difficulty), total cost per
            issue, and escalation rate. Alerts fire when cost per issue exceeds
            $2 or success rate drops below 70%.
          </p>
          <p className="mt-2">
            <strong>Safety:</strong> The sandboxed container has no credentials
            (read-only repo clone). The Integrator writes to an isolated git
            branch. Human review is required before merge — the agent opens a
            PR, never merges.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Du, Y. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2305.14325"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Improving Factuality and Reasoning in Language Models through Multiagent Debate&quot;
            </a>{" "}
            — arXiv:2305.14325
          </li>
          <li>
            Hong, S. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2308.00352"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework&quot;
            </a>{" "}
            — arXiv:2308.00352
          </li>
          <li>
            Chen, W. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2304.05565"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;ChatEval: Towards Better LLM-based Evaluators through Multi-Agent Debate&quot;
            </a>{" "}
            — arXiv:2304.05565
          </li>
          <li>
            Li, G. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2308.03688"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;ChatDev: Communicative Agents for Software Development&quot;
            </a>{" "}
            — arXiv:2308.03688
          </li>
          <li>
            Wooldridge, M. &amp; Jennings, N.R. (1995).{" "}
            <a
              href="https://dl.acm.org/doi/10.1016/0952-1976(95)00025-J"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Intelligent agents: Theory and practice&quot;
            </a>{" "}
            — Knowledge Engineering Review
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-skills",
  title: "Skills — LLM Capability Discovery and Composition",
  description:
    "Comprehensive guide to skill systems for LLM agents covering skill registration, capability discovery, composition, routing, and skill-based agent architecture.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "skills",
  wordCount: 5300,
  readingTime: 21,
  lastUpdated: "2026-04-11",
  tags: ["ai", "skills", "agents", "capability-discovery", "composition"],
  relatedTopics: ["agents", "mcp", "plug-ins", "multi-agents"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          In the context of LLM agents, a <strong>skill</strong> is a
          self-contained, discoverable capability that an agent can invoke to
          accomplish a specific task. Skills are the atomic units of agent
          capability — each skill has a name, a description, input/output
          contracts, preconditions, and an implementation. Unlike tools in the
          MCP sense (which are primarily API-like operations), skills are
          higher-level abstractions that may combine multiple tool calls,
          reasoning steps, and external resources into a single invocable unit.
        </p>
        <p>
          The concept of skills addresses a fundamental scaling problem in agent
          design: as an agent&apos;s capabilities grow, the number of available
          tools becomes too large for the LLM to effectively choose from. A
          single agent with 50+ tools performs worse than the same agent with
          10 well-chosen tools, because the LLM&apos;s attention is diluted
          across too many options. Skills solve this by grouping related tools
          into higher-level capabilities that the agent can reason about at a
          more abstract level. Instead of choosing between
          &quot;query_database&quot;, &quot;format_results&quot;,
          &quot;generate_chart&quot;, and &quot;send_email&quot;, the agent
          chooses a single &quot;generate_report&quot; skill that internally
          orchestrates those steps.
        </p>
        <p>
          For staff-level engineers, skill systems represent an architectural
          pattern for building composable, maintainable agent applications.
          Skills enable capability discovery (agents can find and learn about
          skills at runtime), composition (skills can call other skills), and
          routing (a supervisor can delegate tasks to the most appropriate
          skilled agent). This pattern is central to multi-agent architectures,
          plugin ecosystems, and any system where agent capabilities need to
          scale beyond a handful of tools.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          A skill is defined by several key attributes. The <strong>skill
          signature</strong> includes the name, a natural language description,
          input schema (JSON Schema or Pydantic model), output schema, and a
          list of preconditions that must be satisfied before the skill can be
          invoked. The <strong>skill implementation</strong> is the actual code
          or agent workflow that executes when the skill is invoked — this may
          be a single function call, a multi-step agent workflow, or a composed
          sequence of tool calls with intermediate reasoning steps. The{" "}
          <strong>skill metadata</strong> includes tags, confidence scores,
          cost estimates, latency expectations, and version information that
          help the agent decide whether and how to use the skill.
        </p>
        <p>
          <strong>Skill registration</strong> is the process by which skills
          are added to the agent&apos;s skill registry. Skills can be
          registered statically (at application startup, from a configuration
          file) or dynamically (at runtime, based on the context, user
          preferences, or available resources). Dynamic registration is
          particularly powerful — it allows an agent to discover new skills as
          the environment changes. For example, an agent working on a codebase
          might discover skills specific to the project&apos;s tech stack,
          registered by a project-level configuration file that the agent reads
          at startup.
        </p>
        <p>
          <strong>Capability discovery</strong> is how the LLM learns what
          skills are available and when to use them. The skill registry
          generates a catalog of available skills — typically their names,
          descriptions, input schemas, and usage guidance — and presents this
          catalog to the LLM as part of the system prompt. The quality of the
          skill descriptions is critical: just like with MCP tools, the
          LLM&apos;s understanding of a skill comes entirely from its
          description. A well-described skill includes: what it does, when to
          use it (and when not to), what inputs it expects, what outputs it
          produces, and common usage patterns or pitfalls.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/skill-registration-discovery.svg"
          alt="Skill Registration and Discovery"
          caption="Skill lifecycle — registration → capability catalog → LLM discovery → invocation → result"
        />

        <p>
          <strong>Skill composition</strong> is the ability to build complex
          skills from simpler ones. A &quot;deploy_application&quot; skill
          might compose &quot;run_tests&quot;, &quot;build_artifact&quot;,
          &quot;deploy_to_staging&quot;, &quot;run_smoke_tests&quot;, and
          &quot;deploy_to_production&quot; into a single invocable skill with
          its own input schema (target environment, version) and output schema
          (deployment status, URL). Composition enables building a hierarchy
          of skills: primitive skills (single tool calls) at the bottom,
          composite skills (orchestrating primitives) in the middle, and
          domain-level skills (end-to-end workflows) at the top. The agent
          can operate at whatever level of abstraction is appropriate for the
          task — using domain-level skills for high-level planning and falling
          back to primitive skills when fine-grained control is needed.
        </p>
        <p>
          <strong>Skill routing</strong> determines which skill (or agent with
          a particular skill set) should handle a given request. In a
          single-agent system, the LLM selects the appropriate skill based on
          the user&apos;s request and the available skill catalog. In a
          multi-agent system, a router agent examines the request and delegates
          it to the agent whose skill set best matches the task. Effective
          routing requires that skills have clear, distinctive descriptions
          that minimize ambiguity — if two skills have overlapping
          descriptions, the LLM may choose incorrectly.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/skill-versioning-dependencies.svg"
          alt="Skill Versioning and Dependency Management"
          caption="Skill versioning — semantic versioning timeline (v1.0 → v3.0), dependency graph showing transitive dependencies, and conflict resolution strategies when multiple skills require incompatible versions"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The skill system architecture consists of a <strong>skill registry</strong>
          that maintains the catalog of available skills, a <strong>skill
          executor</strong> that runs skill implementations, a{" "}
          <strong>skill composer</strong> that builds composite skills from
          simpler ones, and a <strong>skill router</strong> that selects the
          appropriate skill for a given request. The registry is the central
          coordination point — it tracks which skills are available, their
          metadata, their dependencies, and their current status (healthy,
          degraded, unavailable).
        </p>
        <p>
          When a request arrives, the flow is: the router selects the
          appropriate skill based on the request and the skill catalog, the
          executor validates the inputs against the skill&apos;s input schema,
          checks that preconditions are met, runs the skill implementation
          (which may invoke sub-skills or tools), validates the output against
          the output schema, and returns the result. If the skill fails
          (precondition not met, execution error, output validation failure),
          the executor returns a structured error that the LLM can use to
          decide whether to retry with different inputs, try an alternative
          skill, or escalate to a human.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/skill-composition-hierarchy.svg"
          alt="Skill Composition Hierarchy"
          caption="Skill hierarchy — primitive skills (tool calls) → composite skills (orchestrated workflows) → domain skills (end-to-end capabilities)"
        />

        <p>
          <strong>Skill versioning</strong> is essential for maintaining
          compatibility as skills evolve. Each skill has a version number, and
          the registry tracks which version of each skill is currently active.
          When a skill&apos;s input/output contract changes (new required
          parameter, changed output format, removed capability), the version
          increments and dependent composite skills must be updated. The
          registry can support multiple versions of a skill simultaneously,
          allowing gradual migration from old to new versions without breaking
          existing composite skills.
        </p>
        <p>
          <strong>Skill dependencies</strong> are the relationships between
          skills — a composite skill depends on its sub-skills, and those
          sub-skills may depend on other skills. The registry maintains a
          dependency graph and validates it at registration time to detect
          circular dependencies, missing dependencies, and version conflicts.
          When a skill is updated, the registry can identify all affected
          composite skills and trigger re-validation or re-registration of
          those skills.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          <strong>Skills vs. tools</strong> is the primary architectural
          decision. Tools are low-level operations — single API calls, database
          queries, or function invocations. Skills are higher-level capabilities
          that may compose multiple tools with intermediate reasoning. The
          trade-off is abstraction vs. control: skills provide a cleaner, more
          discoverable interface for the LLM (fewer options, each more
          semantically meaningful) but hide the internal steps, making it
          harder for the LLM to debug or customize the skill&apos;s behavior.
          Tools give the LLM fine-grained control but overwhelm it with options
          as the system scales. The recommended approach is to provide both:
          skills for common workflows (the 80% case) and tools for the
          remaining 20% where the LLM needs flexibility.
        </p>
        <p>
          <strong>Static vs. dynamic skill registration</strong> presents
          another trade-off. Static registration (all skills known at startup)
          is simple, predictable, and easy to test, but cannot adapt to
          changing contexts or user-specific needs. Dynamic registration
          (skills discovered at runtime) enables context-aware capability
          discovery — an agent working on a Python project discovers Python
          skills, one working on a database discovers data skills — but adds
          complexity in skill lifecycle management (when to register, when to
          unregister, how to handle skill failures during discovery). The
          pragmatic approach is hybrid: a core set of static skills always
          available, with dynamic skills registered based on context.
        </p>
        <p>
          <strong>Single-agent skills vs. multi-agent skill distribution</strong>{" "}
          determines how skills are allocated across agents. In a single-agent
          system, all skills are available to one agent, which must choose
          among them. In a multi-agent system, skills are distributed across
          specialized agents, each with its own skill set, and a router
          delegates requests to the appropriate agent. Multi-agent distribution
          reduces per-agent complexity (each agent has fewer skills to choose
          from) and enables parallel execution of independent skills, but adds
          communication overhead and coordination complexity.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/skill-routing-strategies.svg"
          alt="Skill Routing Strategies"
          caption="Routing strategies — single-agent selection, multi-agent delegation, and hierarchical routing with supervisor"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Design skills at the <strong>right level of abstraction</strong>. A
          skill should represent a meaningful capability from the user&apos;s
          perspective, not an implementation detail. &quot;Send a follow-up
          email to the customer about their order status&quot; is a good skill
          — it maps to a user intent. &quot;Query the orders table and format
          the result as JSON&quot; is a tool, not a skill. The test is: can a
          non-technical user describe what they want using the skill&apos;s
          name and description? If yes, the abstraction level is right.
        </p>
        <p>
          Implement <strong>skill-level observability</strong> — every skill
          invocation should be logged with the skill name, version, inputs,
          outputs, latency, cost, and success/failure status. This enables
          tracking which skills are used most frequently, which are failing,
          which are expensive, and which are slow. This data is essential for
          skill optimization: frequently used skills should be optimized for
          speed and cost, rarely used skills may be candidates for removal or
          consolidation, and frequently failing skills need debugging attention.
        </p>
        <p>
          <strong>Validate skill inputs and outputs</strong> at the executor
          level, not just in the skill implementation. Input validation
          prevents the skill from executing with invalid data (failing fast
          rather than mid-execution), and output validation ensures the skill
          produces results conforming to its declared contract. This is
          particularly important for composite skills, where an invalid output
          from a sub-skill can cascade through the entire workflow.
        </p>
        <p>
          <strong>Keep the active skill catalog small</strong> — ideally under
          15 skills per agent. Beyond this, LLM skill selection degrades as
          the model struggles to differentiate between similar skills. If you
          have more than 15 skills, consider organizing them into categories
          and using a two-stage selection process: first, the LLM selects a
          category, then selects a skill within that category. Alternatively,
          distribute skills across multiple agents and use a router to select
          the appropriate agent.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is <strong>skill description ambiguity</strong>.
          When two skills have overlapping descriptions (&quot;search for
          information&quot; vs. &quot;find relevant data&quot;), the LLM
          cannot reliably choose between them. Each skill must have a clear,
          distinctive description that communicates its unique purpose. Use
          specific language: &quot;search the company knowledge base for
          documents&quot; vs. &quot;query the production database for records&quot;
          is better than &quot;search for information&quot; vs.
          &quot;find data.&quot;
        </p>
        <p>
          <strong>Skill coupling</strong> — composite skills that are tightly
          coupled to their sub-skills become fragile. If the
          &quot;deploy_application&quot; skill hard-codes the specific
          sub-skills it calls (&quot;run_tests&quot;, &quot;build_artifact&quot;,
          etc.), it cannot adapt when those sub-skills change or when
          alternative sub-skills are available. Instead, composite skills should
          accept sub-skills as parameters or discover them dynamically from the
          registry, enabling flexible composition.
        </p>
        <p>
          <strong>Ignoring skill preconditions</strong> leads to runtime
          failures. Skills often have requirements that must be met before
          they can execute (authentication credentials, available resources,
          specific environment state). If these preconditions are not checked
          before invocation, the skill will fail mid-execution, wasting time
          and tokens. The executor should validate preconditions before
          running the skill, and if they&apos;re not met, return a structured
          error that tells the LLM what&apos;s missing so it can take
          corrective action.
        </p>
        <p>
          <strong>Skill versioning neglect</strong> causes silent breaking
          changes. When a skill&apos;s behavior changes without a version
          increment, composite skills that depend on it may fail or produce
          incorrect results. Always version skills when their input/output
          contracts, preconditions, or semantics change. The registry should
          enforce version bumping for skill updates and warn when a skill
          change would affect dependent skills.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Developer assistant skills</strong> — a coding agent with
          skills like &quot;explain_code&quot;, &quot;refactor_function&quot;,
          &quot;write_unit_tests&quot;, &quot;find_bugs&quot;,
          &quot;optimize_performance&quot;, and &quot;generate_documentation&quot;.
          Each skill composes lower-level tools (file access, code parsing,
          test execution, LLM analysis) into a coherent capability. The user
          selects the appropriate skill for their need, and the agent executes
          it with minimal additional prompting.
        </p>
        <p>
          <strong>Customer operations skills</strong> — a support agent with
          skills like &quot;check_order_status&quot;, &quot;process_refund&quot;,
          &quot;escalate_to_human&quot;, &quot;update_shipping_address&quot;,
          and &quot;generate_return_label&quot;. Each skill encapsulates the
          full workflow for its task — checking order status involves querying
          the database, checking logistics APIs, formatting the response, and
          determining if additional action is needed. The agent routes customer
          requests to the appropriate skill based on intent classification.
        </p>
        <p>
          <strong>Research assistant skills</strong> — a research agent with
          skills like &quot;literature_search&quot;, &quot;summarize_paper&quot;,
          &quot;compare_approaches&quot;, &quot;extract_key_findings&quot;,
          and &quot;generate_bibliography&quot;. These skills compose web
          search, paper retrieval, content summarization, and analysis tools
          into domain-specific research capabilities that a researcher can
          invoke at a high level.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: What is the difference between a skill and a tool in an AI agent
            system, and when should you use each?
          </h3>
          <p>
            A tool is a low-level operation — a single API call, database query,
            or function invocation. It has a name, description, input schema,
            and implementation. A skill is a higher-level capability that may
            compose multiple tools with intermediate reasoning steps into a
            single invocable unit. A &quot;query_database&quot; tool runs a SQL
            query. A &quot;generate_monthly_report&quot; skill queries the
            database, analyzes trends, generates visualizations, writes a
            summary, and emails it to stakeholders.
          </p>
          <p>
            Use tools when the LLM needs fine-grained control over individual
            operations — debugging, exploration, or tasks where the sequence of
            steps is not predetermined. Use skills when there are common
            workflows that users invoke repeatedly — skills reduce cognitive
            load on the LLM (fewer options to choose from), provide consistent
            execution of established patterns, and make the agent&apos;s
            capabilities more discoverable to users.
          </p>
          <p>
            The recommended architecture provides both: a set of tools for
            flexible, ad-hoc operations, and a set of skills for common,
            well-defined workflows. The LLM can use skills for the 80% case
            (routine tasks) and fall back to tools for the 20% case
            (novel situations, custom workflows).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: How do you design a skill system that scales to hundreds of
            capabilities?
          </h3>
          <p>
            Scaling a skill system requires hierarchical organization. First,{" "}
            <strong>categorize skills</strong> into domains (development, data,
            communication, analysis) so the LLM can narrow its search space
            before selecting a specific skill. Second, implement{" "}
            <strong>context-aware skill activation</strong> — only present
            skills relevant to the current context (the user&apos;s role, the
            current task, the available resources). Third, use{" "}
            <strong>skill routing</strong> — a supervisor agent classifies the
            request and delegates to a specialized agent with a smaller,
            domain-specific skill set, rather than presenting all skills to a
            single agent.
          </p>
          <p>
            Additionally, implement <strong>skill search</strong> — instead of
            presenting the full catalog in the prompt, allow the LLM to search
            the skill registry by keyword or semantic similarity, retrieving
            only the most relevant skills for the current request. This
            approach scales to hundreds of skills because the LLM only sees the
            5-10 most relevant ones at any given time.
          </p>
          <p>
            Finally, use <strong>skill composition</strong> to reduce the
            effective number of skills the LLM must choose from. Instead of 100
            individual skills, organize them into 10-15 composite skills that
            the LLM selects from, with the composite skills internally routing
            to the appropriate primitive skills. This maintains discoverability
            while preserving the full range of capabilities.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you handle skill failures and what recovery strategies
            are available?
          </h3>
          <p>
            Skill failure can occur at multiple levels: precondition failure
            (requirements not met), input validation failure (invalid arguments),
            execution failure (runtime error in the skill implementation), and
            output validation failure (output doesn&apos;t match the declared
            schema). Each failure type requires a different recovery strategy.
          </p>
          <p>
            For precondition failures, the executor returns a structured error
            listing the missing preconditions, and the LLM can take corrective
            action (obtain credentials, change environment state, etc.). For
            input validation failures, the error includes the specific
            validation errors, and the LLM can retry with corrected inputs. For
            execution failures, the error includes the failure context, and the
            LLM can decide whether to retry, try an alternative skill, or
            escalate. For output validation failures, the error includes the
            validation errors and the actual output, and the LLM can either
            request a re-execution or process the partial output if acceptable.
          </p>
          <p>
            The overarching pattern is <strong>graceful degradation</strong> —
            when a skill fails, the system should not crash but should provide
            the LLM with enough information to make an informed decision about
            the next step. This requires structured error reporting at every
            level of the skill system, from preconditions through execution to
            output validation.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you test a skill-based agent system?
          </h3>
          <p>
            Testing a skill-based system requires testing at multiple levels.
            At the <strong>skill unit level</strong>, each skill is tested in
            isolation with valid inputs, invalid inputs, edge cases, and
            precondition failures. This ensures each skill works correctly
            independently. At the <strong>skill composition level</strong>,
            composite skills are tested to verify they correctly invoke their
            sub-skills in the right order, pass data between them correctly,
            and handle sub-skill failures gracefully.
          </p>
          <p>
            At the <strong>skill selection level</strong>, the system is tested
            with a set of representative requests to verify that the LLM selects
            the correct skill for each request. This is the hardest level to
            test because it depends on LLM behavior, which can change with model
            updates. The approach is to maintain a benchmark dataset of
            (request, expected_skill) pairs and evaluate the system against this
            dataset after any change to skill descriptions, the skill catalog,
            or the model.
          </p>
          <p>
            At the <strong>end-to-end level</strong>, the system is tested with
            realistic user scenarios that exercise complete workflows through
            skill invocation. This catches integration issues that unit and
            composition tests miss — skills that work individually but interact
            poorly, skills that share state incorrectly, or skills whose outputs
            don&apos;t compose as expected.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Anthropic.{" "}
            <a
              href="https://www.anthropic.com/research/building-effective-agents"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Building Effective Agents&quot;
            </a>{" "}
            — Anthropic Research
          </li>
          <li>
            Patil, S. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2305.15334"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Gorilla: Large Language Model Connected with Massive APIs&quot;
            </a>{" "}
            — arXiv:2305.15334
          </li>
          <li>
            Wang, X. et al. (2024).{" "}
            <a
              href="https://arxiv.org/abs/2401.11146"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Skill-Based Agent Systems: A Survey&quot;
            </a>{" "}
            — arXiv:2401.11146
          </li>
          <li>
            Model Context Protocol.{" "}
            <a
              href="https://modelcontextprotocol.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MCP Specification — Skills and Tools
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

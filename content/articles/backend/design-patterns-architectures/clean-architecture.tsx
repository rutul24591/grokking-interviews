"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-clean-architecture-extensive",
  title: "Clean Architecture",
  description:
    "Organize code so business rules stay independent of frameworks and delivery mechanisms, enabling safer change, testing, and long-term evolution.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "clean-architecture",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "clean"],
  relatedTopics: ["hexagonal-architecture", "layered-architecture", "domain-driven-design", "anti-corruption-layer"],
};

export default function CleanArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Protect the Core From the Outside World</h2>
        <p>
          <strong>Clean Architecture</strong> is an application architecture style that keeps business rules independent
          from frameworks, databases, user interfaces, and external services. The goal is not to worship layers; the goal
          is to make the most important logic in your system (the rules that define the business) resilient to technology
          churn and easy to test.
        </p>
        <p>
          Clean Architecture popularized a simple dependency rule: <strong>dependencies point inward</strong>. Outer
          layers (web frameworks, persistence, messaging) depend on inner layers (use cases, domain rules), not the other
          way around. This inversion lets you change how the system is delivered without rewriting what the system means.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/clean-architecture-diagram-1.svg"
          alt="Clean Architecture concentric layers showing entities and use cases inside, frameworks outside"
          caption="The dependency rule is the point: the core is stable, and integration details are adapters around it."
        />
      </section>

      <section>
        <h2>Core Building Blocks</h2>
        <p>
          Different teams name the layers differently, but the recurring roles are consistent: domain rules, application
          use cases, interface adapters, and infrastructure. Clean Architecture becomes concrete when you define what each
          role is allowed to do.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Entities (domain rules):</strong> stable rules and invariants. These are the hardest things to change
            safely, so you keep them isolated from integration details.
          </li>
          <li>
            <strong>Use cases (application rules):</strong> workflow orchestration that coordinates domain rules and
            external interactions (for example, &quot;place order&quot;). Use cases define what the system does.
          </li>
          <li>
            <strong>Interface adapters:</strong> translate between the outside world and the core (HTTP requests,
            database records, message payloads). Adapters protect the core from external formats and semantics.
          </li>
          <li>
            <strong>Frameworks and drivers:</strong> the outermost layer (web servers, ORMs, queues). This layer is
            replaceable by design.
          </li>
        </ul>
        <p className="mt-4">
          The most important skill is not drawing the circles; it is deciding where a piece of logic belongs and what it
          is allowed to depend on.
        </p>
      </section>

      <section>
        <h2>Boundary Hygiene: Models In and Out</h2>
        <p>
          Most boundary erosion happens through data shapes. If the domain layer accepts request payloads directly, or if
          use cases return ORM entities, framework concerns leak inward and become hard to unwind later. Clean Architecture
          stays effective when you treat translation as a first-class responsibility.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Input models:</strong> adapters validate and normalize external inputs, then pass a domain-aligned
            request to the use case.
          </li>
          <li>
            <strong>Output models:</strong> use cases return domain results; adapters format them for HTTP, events, or UI
            clients.
          </li>
          <li>
            <strong>Persistence mapping:</strong> repositories map between domain concepts and storage records so query
            shapes do not dictate business meaning.
          </li>
          <li>
            <strong>Validation clarity:</strong> separate syntactic validation (missing fields, parsing) from domain
            invariants (rules that define correctness).
          </li>
        </ul>
        <p className="mt-4">
          This adds some boilerplate, but it buys long-term change safety: replacing a framework becomes an adapter
          rewrite, not a rewrite of the rules.
        </p>
      </section>

      <section>
        <h2>Why It Helps: Change, Testing, and Integration Risk</h2>
        <p>
          Clean Architecture pays off when you expect change in delivery mechanisms: switching databases, changing APIs,
          adding new transports (HTTP plus async), or integrating with new external systems. By localizing those changes
          in adapters, you avoid cascading edits across the core logic.
        </p>
        <p>
          It also improves testability. If your use cases depend on abstract ports rather than concrete clients, you can
          test business workflows without a running database or a network. That is not about unit tests for their own
          sake; it is about fast, reliable feedback when you change critical logic.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/clean-architecture-diagram-2.svg"
          alt="Use case ports connecting to adapters such as HTTP controllers and database gateways"
          caption="Ports define what the core needs; adapters satisfy those needs without pulling framework concerns inward."
        />
      </section>

      <section>
        <h2>Where Teams Get It Wrong</h2>
        <p>
          Clean Architecture fails when it is adopted as ceremony rather than as a dependency discipline. The main failure
          is building many layers that do not actually isolate change or reduce risk.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Common Pitfalls</h3>
          <ul className="space-y-2">
            <li>
              <strong>Over-abstraction:</strong> interfaces everywhere, little value. The result is slower development and
              harder navigation.
            </li>
            <li>
              <strong>Anemic core:</strong> domain rules end up in controllers/services because the &quot;domain layer&quot;
              contains only data structures.
            </li>
            <li>
              <strong>Leaky boundaries:</strong> database concepts (tables, query builders) bleed into use cases and shape
              the business model.
            </li>
            <li>
              <strong>Misplaced validation:</strong> mixing input validation, authorization, and business invariants in one
              place creates confusion and inconsistent behavior.
            </li>
          </ul>
        </div>
        <p>
          The cure is to be explicit: define what &quot;core&quot; means, define what you consider stable, and treat the
          boundaries as a tool for managing risk rather than as a checklist.
        </p>
      </section>

      <section>
        <h2>Operational Implications</h2>
        <p>
          Clean Architecture is primarily a code organization strategy, but it has operational consequences. Clear
          boundaries make it easier to reason about failure modes: network failures belong in adapters, idempotency
          decisions belong in use cases, and domain invariants belong in the core.
        </p>
        <p>
          It also improves incident response when logs and metrics are aligned to use cases. If your system can answer
          &quot;which use case is failing and why&quot; (authorization failures, dependency timeouts, domain invariant
          violations), diagnosis becomes more direct than when everything is a generic controller error.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/clean-architecture-diagram-3.svg"
          alt="Failure modes of Clean Architecture: too many layers, leaky abstractions, and duplicated rules"
          caption="The failure mode is not performance; it is complexity without isolation. Keep the architecture honest."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Boundary drift:</strong> integrations pull inward over time. Mitigation: review dependency direction
            and keep adapters thin.
          </li>
          <li>
            <strong>Duplicate business rules:</strong> the same invariant enforced in multiple layers. Mitigation: define
            invariants once in the core and reuse.
          </li>
          <li>
            <strong>Slow delivery:</strong> too much abstraction for a small system. Mitigation: apply only where change
            risk is high; keep simple flows simple.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Adding an Async Workflow</h2>
        <p>
          A service begins as a synchronous HTTP API. Over time, you add async processing: the system consumes events and
          triggers the same workflows as the HTTP endpoints. In a tangled architecture, this often duplicates logic
          (controllers vs consumers) and creates inconsistent behavior.
        </p>
        <p>
          In Clean Architecture, the use case is the workflow. Both the HTTP controller and the event consumer become
          adapters that call the same use case. The core logic stays consistent, and you can evolve the transports
          independently without splitting the business meaning across multiple code paths.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Define the dependency rule and enforce it: frameworks depend on use cases, not the other way around.</li>
          <li>Keep the core focused on business invariants and workflows, not on persistence or transport formats.</li>
          <li>Use adapters to translate formats and isolate network and database failure semantics.</li>
          <li>Apply abstraction where change risk is real; avoid ceremony for small, stable flows.</li>
          <li>Align telemetry to use cases so incidents can be diagnosed in business terms, not only in HTTP terms.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the dependency rule in Clean Architecture and why does it matter?</p>
            <p className="mt-2 text-sm">
              A: Dependencies point inward so business rules are not coupled to frameworks. This makes core logic stable,
              testable, and resilient to technology changes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What belongs in a use case versus in an adapter?</p>
            <p className="mt-2 text-sm">
              A: Use cases orchestrate workflows and apply business rules; adapters translate formats and handle
              integration details (HTTP, database, messaging).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the most common way Clean Architecture fails in practice?</p>
            <p className="mt-2 text-sm">
              A: Over-abstraction and leaky boundaries: too many layers that do not isolate change, or persistence and
              framework concepts leaking into core logic.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you apply Clean Architecture incrementally to a legacy codebase?</p>
            <p className="mt-2 text-sm">
              A: Introduce a use-case layer around the highest-risk workflows, build adapters around external systems,
              and gradually pull business rules inward while keeping new integrations outside the core.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

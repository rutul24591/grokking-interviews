"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-hexagonal-architecture-extensive",
  title: "Hexagonal Architecture",
  description:
    "Use ports and adapters to isolate business logic from transport and infrastructure, enabling multiple interfaces and safer long-term evolution.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "hexagonal-architecture",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "hexagonal", "ports-adapters"],
  relatedTopics: ["clean-architecture", "layered-architecture", "adapter-pattern", "anti-corruption-layer"],
};

export default function HexagonalArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Ports and Adapters Around a Stable Core</h2>
        <p>
          <strong>Hexagonal architecture</strong> (also called <strong>ports and adapters</strong>) organizes an
          application around a stable core of business logic and a set of adapters that connect that core to the outside
          world. The &quot;hexagon&quot; is a metaphor: the system has multiple sides, meaning multiple ways to interact
          with it (HTTP, messaging, CLI) and multiple dependencies it interacts with (databases, external APIs).
        </p>
        <p>
          The design goal is dependency control. The core should not depend on a specific database driver, web framework,
          or message broker. Instead, the core defines <strong>ports</strong> (interfaces that represent what it needs or
          offers), and adapters implement those ports. This keeps the core portable and testable and reduces the cost of
          integration change.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/hexagonal-architecture-diagram-1.svg"
          alt="Hexagonal architecture diagram showing a domain core with inbound and outbound adapters"
          caption="Ports define contracts; adapters connect the contracts to specific technologies and protocols."
        />
      </section>

      <section>
        <h2>Inbound vs Outbound Adapters</h2>
        <p>
          Hexagonal architecture is easiest to reason about when you separate &quot;driving&quot; interactions from
          &quot;driven&quot; dependencies.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Inbound (driving) adapters:</strong> ways the world invokes your system (HTTP controllers, message
            consumers, scheduled jobs, CLI).
          </li>
          <li>
            <strong>Outbound (driven) adapters:</strong> dependencies your system calls (databases, caches, external
            services, queues).
          </li>
          <li>
            <strong>Ports:</strong> contracts at the boundary of the core: input ports for use-case invocation, output
            ports for external interactions.
          </li>
        </ul>
        <p className="mt-4">
          This split matters operationally. Inbound adapters define concurrency and input validation behavior. Outbound
          adapters define timeouts, retries, and data consistency boundaries. When an incident happens, being able to say
          &quot;the output port to dependency X is failing&quot; is more actionable than &quot;the controller is failing.&quot;
        </p>
      </section>

      <section>
        <h2>Why It Helps: Multiple Interfaces Without Duplicating the Core</h2>
        <p>
          Many systems evolve to support new interfaces: a REST API becomes an event-driven consumer, an internal CLI for
          operations, or a batch job for backfills. Without a ports/adapters discipline, each interface tends to re-embed
          core logic, and the system splits into inconsistent behaviors.
        </p>
        <p>
          Hexagonal architecture encourages a single core workflow with multiple adapters. Each adapter handles the
          mechanics of its interface, but the business meaning is centralized. This reduces duplication and makes
          correctness easier to maintain over time.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/hexagonal-architecture-diagram-2.svg"
          alt="Multiple inbound adapters (HTTP, events, CLI) calling the same core use cases through ports"
          caption="Multiple interfaces can share a single workflow by calling the same input ports."
        />
      </section>

      <section>
        <h2>Testing and Change Isolation</h2>
        <p>
          The practical benefit of ports is substitution. You can test a workflow by providing a fake implementation of
          an output port (for example, a fake persistence adapter). You can also change a dependency (swap a database, add
          a new provider) by changing only the adapter, as long as the port contract remains stable.
        </p>
        <p>
          This does not eliminate integration testing. It changes how you do it: integration tests validate adapter
          correctness, while workflow tests validate business rules. Keeping these concerns separate reduces test flakiness
          and improves debuggability when failures occur.
        </p>
      </section>

      <section>
        <h2>Design Choices That Matter</h2>
        <p>
          Hexagonal architecture can degrade into &quot;interfaces everywhere&quot; if applied mechanically. The key is
          to create ports where they buy you long-term flexibility: around unstable dependencies and around high-value
          workflows.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Port granularity:</strong> ports that are too generic become leaky; ports that are too specific create
            boilerplate and reduce reuse.
          </li>
          <li>
            <strong>Data contracts:</strong> ports should use domain language, not infrastructure language. If a port
            speaks in table rows and query builders, the boundary is already broken.
          </li>
          <li>
            <strong>Error semantics:</strong> define how adapters surface failures. A port that returns raw provider
            error codes forces core logic to understand external systems.
          </li>
          <li>
            <strong>Ownership:</strong> decide who owns ports vs adapters. Often, product teams own core and ports; a
            platform or integration team owns some adapters.
          </li>
        </ul>
      </section>

      <section>
        <h2>Port Contracts: Data Shapes, Errors, and Policies</h2>
        <p>
          The quality of a ports-and-adapters design is determined by the port contracts. A port should express intent
          in domain terms and hide external quirks. If a port is a thin pass-through to a provider API, the core still
          depends on that provider, just indirectly.
        </p>
        <p>
          Good contracts also define <strong>error semantics</strong>. Outbound adapters should not leak raw provider
          error codes or transport-specific exceptions into the core. Instead, ports return a small set of meaningful
          outcomes (for example, transient failure vs permanent rejection) so workflows can decide whether to retry,
          compensate, or surface an error.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Domain-first types:</strong> keep domain objects inside the core and translate at adapters; avoid
            passing database rows or HTTP payloads across the boundary.
          </li>
          <li>
            <strong>Policy placement:</strong> timeouts, retries, and backoff live close to the outbound adapter, but the
            core defines budgets (how long a use case is willing to wait) so behavior is consistent.
          </li>
          <li>
            <strong>Idempotency boundaries:</strong> inbound adapters often enforce idempotency keys and deduplication
            for transports that can retry or redeliver.
          </li>
        </ul>
        <p className="mt-4">
          A simple review question: if you replaced one dependency (database, broker, or payment provider), would the
          domain code change? If yes, the boundary is leaking.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/hexagonal-architecture-diagram-3.svg"
          alt="Hexagonal architecture failure modes: leaky ports, adapter sprawl, and duplicated business rules"
          caption="Hexagonal architecture fails when ports leak infrastructure details or when adapters and boundaries are not maintained."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Leaky ports:</strong> core depends on infrastructure concepts. Mitigation: review port contracts and
            keep them in domain language.
          </li>
          <li>
            <strong>Adapter sprawl:</strong> too many adapters with inconsistent behavior. Mitigation: standardize
            policies (timeouts, retries) and define shared primitives.
          </li>
          <li>
            <strong>Duplicate rules:</strong> business rules creep into adapters. Mitigation: enforce a rule that adapters
            translate and integrate, but invariants live in the core.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Adding a Second Transport</h2>
        <p>
          A service starts as an HTTP API that performs a critical workflow. Later, you add async processing: the same
          workflow must run from events to handle backfills and retries. Without ports/adapters, the event consumer often
          re-implements the workflow and drifts in subtle ways.
        </p>
        <p>
          With hexagonal architecture, both the HTTP controller and the event consumer are inbound adapters that call the
          same input port. The workflow remains consistent, and differences between transports are isolated to adapter
          concerns (validation, idempotency, ack semantics).
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use ports to isolate the core from unstable dependencies and from transport churn.</li>
          <li>Separate inbound adapters (how the world calls you) from outbound adapters (what you call).</li>
          <li>Keep port contracts in domain language; avoid leaking database or provider semantics inward.</li>
          <li>Define adapter error semantics and policies (timeouts/retries) so core logic stays clean.</li>
          <li>Apply ports selectively; avoid creating interfaces that do not buy flexibility.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a port in ports-and-adapters architecture?</p>
            <p className="mt-2 text-sm">
              A: A contract at the boundary of the core describing either an input (a use case) or an output (a dependency
              interaction). Adapters implement ports to connect to specific technologies.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the main benefit of hexagonal architecture in practice?</p>
            <p className="mt-2 text-sm">
              A: Change isolation and testability: core workflows are stable and can be executed via multiple interfaces
              and backed by different dependencies without rewriting business rules.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the most common failure mode?</p>
            <p className="mt-2 text-sm">
              A: Ports leaking infrastructure concepts or adapters accumulating business logic, turning boundaries into
              paperwork rather than isolation.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose port granularity?</p>
            <p className="mt-2 text-sm">
              A: Create ports where dependency change or multi-interface reuse is likely. Keep contracts expressive and
              domain-aligned; avoid generic &quot;do everything&quot; ports.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

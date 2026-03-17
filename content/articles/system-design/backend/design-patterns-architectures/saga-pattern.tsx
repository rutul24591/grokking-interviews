"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-saga-pattern-extensive",
  title: "Saga Pattern",
  description:
    "Coordinate multi-service workflows with local transactions and compensations, making consistency explicit and operable without cross-service ACID transactions.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "saga-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "consistency", "workflows"],
  relatedTopics: [
    "microservices-architecture",
    "event-driven-architecture",
    "retry-pattern",
    "timeout-pattern",
    "cqrs-pattern",
  ],
};

export default function SagaPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: Distributed Transactions Without a Global Transaction</h2>
        <p>
          The <strong>Saga pattern</strong> coordinates a multi-step workflow across services using a sequence of local
          transactions. Each step updates one service&apos;s state. If a later step fails, the saga runs compensating
          actions to undo or mitigate earlier steps. The system achieves <em>business consistency</em> without requiring a
          single ACID transaction across multiple databases.
        </p>
        <p>
          Sagas are a realism pattern: in distributed systems, global transactions are expensive and often infeasible.
          Sagas replace &quot;atomicity&quot; with explicit workflow semantics: what is allowed to be temporary, what must
          be eventually consistent, and what can be compensated.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/saga-pattern-diagram-1.svg"
          alt="Saga workflow diagram showing multiple services executing steps and compensations"
          caption="A saga is a state machine: local steps succeed or fail, and compensations restore business invariants when needed."
        />
      </section>

      <section>
        <h2>Two Styles: Orchestration vs Choreography</h2>
        <p>
          Sagas can be implemented with an explicit orchestrator or through event choreography.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Orchestrated saga:</strong> a coordinator service drives the workflow, calling steps and tracking
            progress. This centralizes control and observability.
          </li>
          <li>
            <strong>Choreographed saga:</strong> services react to events and emit new events, forming a distributed
            workflow without a central coordinator. This reduces central coupling but can be harder to reason about.
          </li>
        </ul>
        <p className="mt-4">
          The right choice depends on your needs for control and debugging. Orchestration is often easier to operate.
          Choreography can work well when workflows are simple and event contracts are mature.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/saga-pattern-diagram-2.svg"
          alt="Decision map for saga design including orchestration, choreography, compensation semantics, and timeouts"
          caption="Saga design is about operability: make progress tracking, timeouts, and compensation behavior explicit."
        />
      </section>

      <section>
        <h2>Compensations: Undo Is Not Always Possible</h2>
        <p>
          Compensations are not the same as rollbacks. In many domains, you cannot truly undo an action. You can only
          mitigate or correct it. For example, you cannot &quot;un-send&quot; an email, but you can send a correction. You
          cannot uncharge a card instantly, but you can issue a refund. Saga design must reflect the real business
          semantics of reversal.
        </p>
        <p>
          This is why sagas are domain-specific. A generic compensation framework is not enough. You need clear definitions
          of acceptable intermediate states and explicit user-visible semantics when compensation occurs.
        </p>
      </section>

      <section>
        <h2>Correctness Under Failure: Idempotency, Timeouts, and Retries</h2>
        <p>
          A saga step can be executed more than once due to retries, coordinator failures, and message replays. That means
          steps and compensations must be idempotent. Each step should have an idempotency key so repeated execution
          produces the same outcome, not duplicate effects.
        </p>
        <p>
          Timeouts are also part of correctness. If a step is slow, does the saga wait, fail, or proceed with a degraded
          outcome? These decisions must be explicit because they define user experience and system load during incidents.
        </p>
      </section>

      <section>
        <h2>Observability and Operations: Sagas Are Long-Lived Work</h2>
        <p>
          Sagas introduce workflow state that exists over time. You need visibility into that state: which sagas are in
          progress, which are stuck, which failed, and which compensated. This is not optional. Without it, sagas become
          a correctness risk that only appears as customer reports.
        </p>
        <p>
          A strong operational model treats sagas like a queue: measure throughput, age, error rates, and time spent in
          each state. Provide tools to inspect an individual saga and to retry or repair it safely.
        </p>
      </section>

      <section>
        <h2>State Persistence and Delivery Guarantees</h2>
        <p>
          A saga is a durable state machine. If the coordinator crashes, the saga must resume without losing which steps
          ran and which compensations are required. That implies you need durable saga state (for orchestration) or durable
          event history (for choreography). Keeping this state only in memory turns routine restarts into correctness bugs.
        </p>
        <p>
          Delivery guarantees matter because many systems are at-least-once. Steps may run twice, events may be delivered
          twice, and out-of-order delivery can happen during retries. Common mitigations include an{" "}
          <strong>outbox</strong> for publishing events atomically with local state, an <strong>inbox</strong> or dedupe
          store for consumers, and idempotent handlers keyed by workflow IDs.
        </p>
        <ul className="mt-4 space-y-2">
          <li><strong>Persist step outcomes:</strong> record “done” vs “pending” so retries are safe.</li>
          <li><strong>Make effects idempotent:</strong> dedupe at the boundary where money moves or inventory changes.</li>
          <li><strong>Version event schemas:</strong> producers and consumers rarely deploy simultaneously.</li>
        </ul>
      </section>

      <section>
        <h2>Operational Runbook: Stuck or Failed Sagas</h2>
        <p>
          Most production pain comes from workflows that are neither completed nor cleanly compensated. The runbook should
          separate <em>progress</em> problems (a step never finishes) from <em>correctness</em> problems (a step finished but
          produced the wrong side effect).
        </p>
        <ol className="mt-4 space-y-2">
          <li>Identify the saga ID and current state; confirm time-in-state is abnormal.</li>
          <li>Determine if the step is retryable; cap retries to avoid load amplification.</li>
          <li>If compensation is required, validate it is safe (idempotent and consistent with current business state).</li>
          <li>Run reconciliation checks to detect drift between services and the saga state.</li>
          <li>Close the loop: add alerts on the specific stuck state and update the workflow contract if needed.</li>
        </ol>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/saga-pattern-diagram-3.svg"
          alt="Saga failure modes: stuck workflows, duplicate steps, compensation bugs, and inconsistent intermediate states"
          caption="Saga failures are workflow failures. Make progress observable and recovery procedures routine."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Stuck sagas:</strong> a step never completes. Mitigation: timeouts, escalation paths, and repair tools.
          </li>
          <li>
            <strong>Duplicate step effects:</strong> retries double-apply actions. Mitigation: idempotency keys and
            deduplication at the effect boundary.
          </li>
          <li>
            <strong>Compensation bugs:</strong> compensations do not restore invariants. Mitigation: test compensations,
            reconcile with audits, and provide manual repair workflows.
          </li>
          <li>
            <strong>Choreography spaghetti:</strong> unclear event flows and ownership. Mitigation: explicit documentation,
            event governance, or introduce an orchestrator.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Order Placement</h2>
        <p>
          A user places an order. The workflow touches inventory, payment, and shipping. The saga reserves inventory,
          charges payment, then creates a shipment. If payment fails after reservation, the compensation releases
          inventory. If shipment creation fails after payment succeeds, the compensation might refund payment or create a
          support task depending on business rules.
        </p>
        <p>
          The key is that intermediate states are acceptable and observable. The system does not pretend the workflow is
          atomic. It provides a predictable recovery story with idempotent steps and explicit compensations.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Use sagas for multi-service workflows where global transactions are infeasible.</li>
          <li>Choose orchestration for clearer control and debugging; choose choreography only with disciplined event contracts.</li>
          <li>Design compensations that match real business semantics; undo is often a correction, not a rollback.</li>
          <li>Make steps and compensations idempotent; assume retries and replays will happen.</li>
          <li>Instrument saga state: in-progress, stuck, failed, compensated, and time-in-state metrics.</li>
          <li>Provide repair workflows and reconciliation checks to detect and fix drift.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problem does the Saga pattern solve?</p>
            <p className="mt-2 text-sm">
              A: It provides a way to achieve business consistency across services using local transactions and
              compensations instead of distributed ACID transactions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Orchestration vs choreography: what are the trade-offs?</p>
            <p className="mt-2 text-sm">
              A: Orchestration centralizes control and observability. Choreography reduces a central coordinator but can
              become harder to reason about and debug as workflows grow.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is idempotency critical for sagas?</p>
            <p className="mt-2 text-sm">
              A: Steps may be retried after coordinator failures or message replays. Without idempotency, retries create
              duplicate effects and violate invariants.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you operate sagas in production?</p>
            <p className="mt-2 text-sm">
              A: Track saga state and time-in-state, detect stuck workflows, provide repair tools, and run reconciliation
              checks to catch silent drift.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

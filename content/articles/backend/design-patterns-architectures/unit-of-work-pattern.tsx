"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-unit-of-work-pattern-extensive",
  title: "Unit of Work Pattern",
  description:
    "Track a set of changes and commit them as one atomic unit so business workflows stay consistent and transactional boundaries remain explicit.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "unit-of-work-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "transactions", "ddd"],
  relatedTopics: ["repository-pattern", "cqrs-pattern", "saga-pattern", "event-driven-architecture"],
};

export default function UnitOfWorkPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Unit of Work Means</h2>
        <p>
          A <strong>Unit of Work</strong> groups a set of changes into one consistent commit. Instead of scattering
          inserts, updates, and deletes across a request handler, the unit of work tracks what has changed and then
          persists those changes atomically (or as close to atomically as the system allows).
        </p>
        <p>
          In practice, Unit of Work is a way of making transaction scope explicit. It helps you express workflows like
          &quot;create an order, reserve inventory, and update a customer balance&quot; as one coherent operation with a
          single commit/rollback decision rather than as a series of partially committed steps.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/unit-of-work-pattern-diagram-1.svg"
          alt="Unit of work pattern: application tracks changes and commits them as one transaction to the database"
          caption="Unit of Work makes transactional boundaries explicit and reduces partial updates in complex workflows."
        />
      </section>

      <section>
        <h2>Why It Exists: Correctness Under Change</h2>
        <p>
          Systems evolve. A workflow that originally updated one table grows to update several tables and emit events.
          Without a unit of work, each new step increases the chance of partial failure: one update succeeds, the next
          fails, and the system is left in an inconsistent state that requires manual repair.
        </p>
        <p>
          Unit of Work reduces that risk by centralizing commit behavior. It also provides a single place to apply cross-cutting
          persistence concerns: optimistic concurrency checks, audit fields, outbox writes, and invariant validation that must happen at commit time.
        </p>
      </section>

      <section>
        <h2>How It Interacts With Repositories</h2>
        <p>
          Repositories and unit of work are often paired. Repositories expose domain-friendly persistence operations. The
          unit of work coordinates them so that multiple repository calls participate in the same commit decision.
        </p>
        <p>
          The repository decides <em>what</em> is being loaded and persisted. The unit of work decides <em>when</em> changes
          become durable and how failures are handled. Keeping those responsibilities separate makes it easier to reason about
          transactional behavior and prevents every repository from inventing its own transaction management rules.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/unit-of-work-pattern-diagram-2.svg"
          alt="Decision map for unit of work: transaction scope, commit triggers, concurrency control, and outbox integration"
          caption="Unit of Work is mostly about boundaries: what counts as a single transaction and what happens at commit time."
        />
      </section>

      <section>
        <h2>Transaction Scope: The Most Important Choice</h2>
        <p>
          The central design question is: what is one unit of work? In many web applications, the simplest answer is
          &quot;one request&quot;. That is often correct for CRUD flows, but it can break down for long-running workflows,
          streaming operations, or systems with significant external dependencies.
        </p>
        <p>
          Transaction scope has direct operational consequences. Larger scope means stronger consistency but higher lock
          contention, more deadlocks, and longer recovery time after failures. Smaller scope improves throughput and
          availability but increases the need for compensation and reconciliation.
        </p>
      </section>

      <section>
        <h2>Distributed Reality: One Database Transaction Is Not a Distributed Transaction</h2>
        <p>
          Unit of work often maps cleanly to a single database transaction. But many business workflows span multiple
          services and stores. In those cases, &quot;commit everything&quot; is no longer possible in the same way.
        </p>
        <p>
          Mature designs acknowledge this: they keep the unit of work strong within a single consistency boundary (a
          service and its database) and use patterns like sagas, outbox, and idempotent handlers to coordinate across
          boundaries. This keeps the local system correct and makes cross-service coordination explicit rather than implicit.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/unit-of-work-pattern-diagram-3.svg"
          alt="Unit of work failure modes: long transactions, lock contention, deadlocks, and inconsistent scope"
          caption="Unit of Work failures are usually operational: long transactions and unclear scope create contention and correctness drift."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Long transactions</h3>
            <p className="mt-2 text-sm text-muted">
              Units of work that include slow calls or long processing time hold locks longer and amplify contention.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> keep transactions short and move external calls outside the transaction where possible.
              </li>
              <li>
                <strong>Signal:</strong> rising lock wait times, deadlocks, and a strong correlation between latency and contention.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Inconsistent transaction usage</h3>
            <p className="mt-2 text-sm text-muted">
              Some workflows use a unit of work and others bypass it, leading to inconsistent invariants and surprising partial commits.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> enforce transaction boundaries in application service templates and code reviews.
              </li>
              <li>
                <strong>Signal:</strong> correctness bugs that appear only under concurrency and are hard to reproduce locally.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Memory and change tracking blow-ups</h3>
            <p className="mt-2 text-sm text-muted">
              Large units of work track too many objects or changes, increasing memory usage and commit time.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> keep units small, batch large operations, and avoid loading whole aggregates when only a small part is needed.
              </li>
              <li>
                <strong>Signal:</strong> high memory usage and commit-time spikes during batch workflows.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Commit-time surprises</h3>
            <p className="mt-2 text-sm text-muted">
              Constraint violations or optimistic concurrency failures occur at commit time, and callers do not handle retries or user messaging properly.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> define retry rules, provide user-friendly conflict handling, and make conflicts observable.
              </li>
              <li>
                <strong>Signal:</strong> spikes in serialization or conflict errors during peak updates.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Order Creation With Audit and Event Publication</h2>
        <p>
          Consider creating an order that must write the order record, write line items, update a customer summary, and
          publish an &quot;OrderCreated&quot; event. If these steps happen independently, failures can create partial orders
          or missing events that break downstream systems.
        </p>
        <p>
          A unit of work provides a single commit point: either all database writes succeed together (and the outbox
          record is persisted for event publication), or none do. This reduces correctness risk and makes recovery
          procedures simpler because there is a clear durable boundary for what &quot;created&quot; means.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Measure transaction duration:</strong> long-running units of work are a leading indicator of contention and deadlocks.
          </li>
          <li>
            <strong>Make conflicts visible:</strong> optimistic concurrency failures should be counted and traced, not treated as rare anomalies.
          </li>
          <li>
            <strong>Keep scope consistent:</strong> enforce a standard transaction template for request handlers so bypassing requires an explicit decision.
          </li>
          <li>
            <strong>Plan for batch workflows:</strong> batch processing should use bounded units of work and avoid unbounded change tracking.
          </li>
          <li>
            <strong>Align with messaging:</strong> if publishing events matters, use outbox-style durability so commits and publication are coordinated.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            What is the unit of work boundary (per request, per command, per job), and is it justified by the workflow?
          </li>
          <li>
            Are transactions kept short and free of slow external calls?
          </li>
          <li>
            Are commit-time conflicts and constraint violations handled with clear retries or user-visible errors?
          </li>
          <li>
            Do write workflows coordinate event publication safely (for example via an outbox record)?
          </li>
          <li>
            Are transaction duration, lock waits, and deadlocks observable and alerting?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What problem does Unit of Work solve that repositories do not?</p>
            <p className="mt-2 text-sm">
              Repositories describe persistence operations. Unit of work coordinates them into one commit decision so multi-step workflows do not partially apply.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why are long transactions dangerous?</p>
            <p className="mt-2 text-sm">
              They increase lock contention, deadlocks, and recovery time. Under load, long transactions can collapse throughput and create cascading timeouts.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How does Unit of Work change in a distributed system?</p>
            <p className="mt-2 text-sm">
              It remains strong within a single service boundary, while cross-service workflows require coordination patterns like sagas and durable outbox messaging rather than one global transaction.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

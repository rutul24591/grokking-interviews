"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-conflict-free-replicated-data-types-extensive",
  title: "Conflict-Free Replicated Data Types",
  description:
    "Design convergent replicated state without coordination: CRDT types, merge semantics, causal context, and operational trade-offs for offline and multi-region systems.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "conflict-free-replicated-data-types",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "distributed-systems", "consistency"],
  relatedTopics: ["operational-transformation", "global-distribution", "conflict-resolution"],
};

export default function ConflictFreeReplicatedDataTypesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What CRDTs Are</h2>
        <p>
          <strong>Conflict-Free Replicated Data Types (CRDTs)</strong> are data structures that can be replicated across
          nodes and updated concurrently while still converging to the same state without requiring coordination for each
          update. They are designed so that merges are well-defined and associative, commutative, and idempotent under
          realistic delivery patterns.
        </p>
        <p>
          CRDTs are a fit when you care about availability during partitions and you can tolerate convergence over time.
          They are commonly used in offline-first apps, collaborative experiences, multi-region writes, and systems that
          must accept concurrent updates without central locking.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/conflict-free-replicated-data-types-diagram-1.svg"
          alt="CRDT replication diagram showing concurrent updates and merge convergence"
          caption="CRDTs guarantee convergence by construction: replicas can apply updates independently and still merge to a consistent state."
        />
      </section>

      <section>
        <h2>State-Based vs Operation-Based CRDTs</h2>
        <p>
          CRDTs are often grouped into two families:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>State-based (CvRDT):</strong> replicas periodically exchange full state (or compact state) and merge it with a deterministic function.
          </li>
          <li>
            <strong>Operation-based (CmRDT):</strong> replicas exchange operations and apply them in a way that guarantees convergence, often requiring causal delivery or additional metadata.
          </li>
        </ul>
        <p className="mt-4">
          State-based designs are simpler conceptually but can be heavier on bandwidth. Operation-based designs can be
          more efficient but require stronger assumptions about operation delivery and ordering.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/conflict-free-replicated-data-types-diagram-2.svg"
          alt="CRDT design trade-offs: state-based vs operation-based, metadata size, and merge frequency"
          caption="CRDT engineering is trade-offs: state vs ops, metadata overhead, merge cadence, and how the system handles causal relationships and deletions."
        />
      </section>

      <section>
        <h2>Common CRDT Types and Their Semantics</h2>
        <p>
          CRDTs are not one thing; they encode specific conflict resolution semantics. Picking the wrong semantics can
          produce surprising outcomes even if the system converges correctly.
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Counters</h3>
            <p className="mt-2 text-sm text-muted">
              Grow-only and increment/decrement variants. Great for metrics and quotas, but semantics must match your invariants.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Registers</h3>
            <p className="mt-2 text-sm text-muted">
              Last-write-wins and multi-value variants. Simple but can lose updates depending on conflict resolution rules.
            </p>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Sets</h3>
            <p className="mt-2 text-sm text-muted">
              Add-wins, remove-wins, or observed-remove sets. Deletions typically introduce metadata and garbage collection concerns.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Sequences</h3>
            <p className="mt-2 text-sm text-muted">
              Ordered collections for collaborative editing. Powerful but complex, and can grow metadata quickly.
            </p>
          </div>
        </div>
        <p>
          The key engineering question is: what are the business semantics under conflict? CRDTs guarantee convergence,
          not that the converged result matches your product expectations without careful choice of type and rules.
        </p>
      </section>

      <section>
        <h2>Causality and Metadata Overhead</h2>
        <p>
          Many CRDTs require metadata to preserve causality: version vectors, dot stores, or tombstones. This metadata
          can grow with the number of replicas and operations. Operationally, this is the main cost of CRDT adoption.
        </p>
        <p>
          Systems need a strategy for garbage collecting metadata safely. If tombstones accumulate indefinitely, memory
          grows without bound. Garbage collection can require coordination or additional assumptions, which partially
          reintroduces the coordination CRDTs were meant to avoid.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          CRDTs can converge and still cause product problems if the semantics are wrong, metadata grows unbounded, or
          merge frequency is too low and users observe stale state for too long.
        </p>
        <ArticleImage
          src="/diagrams/backend/advanced-topics/conflict-free-replicated-data-types-diagram-3.svg"
          alt="CRDT failure modes: metadata growth, semantic mismatch, and delayed convergence"
          caption="CRDT risks are semantic and operational: unbounded metadata, surprising conflict outcomes, and convergence delay. Guardrails and observability make CRDT behavior predictable."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Semantic mismatch</h3>
            <p className="mt-2 text-sm text-muted">
              The converged result does not match product expectations, even though the CRDT is behaving as designed.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> pick CRDT types based on business invariants, document conflict outcomes, and validate with concurrency tests.
              </li>
              <li>
                <strong>Signal:</strong> user reports of &quot;lost updates&quot; that are actually conflict resolution outcomes.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Unbounded metadata</h3>
            <p className="mt-2 text-sm text-muted">
              Tombstones and causal context grow over time, increasing memory and bandwidth costs.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> garbage collection strategy, bounded replica sets, and compact representations with periodic compaction.
              </li>
              <li>
                <strong>Signal:</strong> metadata size grows faster than user-visible state and causes latency or memory pressure.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Delayed convergence</h3>
            <p className="mt-2 text-sm text-muted">
              Replicas merge infrequently and users observe inconsistent state across devices for longer than acceptable.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> tune merge cadence, use delta-state techniques, and define acceptable staleness budgets per feature.
              </li>
              <li>
                <strong>Signal:</strong> high divergence duration and frequent user-visible conflicts across devices.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Incorrect assumptions about delivery</h3>
            <p className="mt-2 text-sm text-muted">
              Operation-based designs rely on causal delivery or ordering that the underlying system does not provide.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> choose state-based where delivery assumptions are weak, or explicitly implement required ordering guarantees.
              </li>
              <li>
                <strong>Signal:</strong> replicas diverge unexpectedly or require manual repair despite CRDT usage.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Offline-First Notes App</h2>
        <p>
          A notes app must work offline and sync across devices. Users can edit the same note concurrently. CRDTs allow
          each device to apply local edits and later merge without central locking. The product chooses semantics: last
          writer wins for some fields, observed-remove sets for tags, and sequence CRDTs for the note body.
        </p>
        <p>
          The operational work is controlling metadata growth and defining convergence expectations. Without explicit
          budgets and compaction, long-lived notes can accumulate large causal metadata.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            CRDT type and conflict semantics match business invariants, not only &quot;eventual consistency&quot; goals.
          </li>
          <li>
            Metadata growth is monitored and bounded with a clear garbage collection and compaction strategy.
          </li>
          <li>
            Merge cadence and divergence budgets are defined and measured so user-visible inconsistency is controlled.
          </li>
          <li>
            Delivery assumptions are explicit: state-based vs operation-based choice matches system guarantees.
          </li>
          <li>
            Concurrency tests validate that merges converge and produce expected outcomes under realistic reorderings and duplication.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What problem do CRDTs solve?</p>
            <p className="mt-2 text-sm text-muted">
              A: They enable concurrent updates across replicas with guaranteed convergence without coordinating every update, which improves availability and offline support.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the biggest practical cost of CRDTs?</p>
            <p className="mt-2 text-sm text-muted">
              A: Metadata overhead for causality and deletions. Tombstones and version context can grow without bound unless you design for compaction and garbage collection.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do CRDTs compare to consensus?</p>
            <p className="mt-2 text-sm text-muted">
              A: Consensus provides strong consistency and a single order of operations but reduces availability under partitions. CRDTs accept concurrent operations and converge without requiring a single total order.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}


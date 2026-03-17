"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-state-machine",
  title: "State Machine Implementation",
  description: "Guide to implementing state machines covering state definition, transitions, and persistence.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "state-machine-implementation",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "transactions", "state-machine", "backend", "design-patterns"],
  relatedTopics: ["order-management", "workflow", "transactions"],
};

export default function StateMachineImplementationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>State Machine</strong> manages entity lifecycle through defined 
          states and transitions, ensuring valid state changes and triggering 
          appropriate actions.
        </p>
      </section>

      <section>
        <h2>State Definition</h2>
        <ul className="space-y-3">
          <li><strong>States:</strong> Enumerate all valid states.</li>
          <li><strong>Transitions:</strong> Define valid state changes.</li>
          <li><strong>Guards:</strong> Conditions for transition.</li>
          <li><strong>Actions:</strong> Side effects on transition.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Library:</strong> XState, StateMachine, or custom.</li>
          <li><strong>Persistence:</strong> Store current state with version.</li>
          <li><strong>History:</strong> Log all transitions for audit.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent state changes?</p>
            <p className="mt-2 text-sm">A: Optimistic locking, reject if state changed, retry with latest state, queue changes.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you migrate state machines?</p>
            <p className="mt-2 text-sm">A: Backward compatible transitions, migration job for existing entities, version state machine definition.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

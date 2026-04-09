"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-optimistic-updates",
  title: "Design Optimimistic Updates with Rollback",
  description:
    "Production-grade optimistic update pattern — instant UI feedback, server reconciliation, automatic rollback on failure, dependency handling, and conflict resolution.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "optimistic-updates-rollback",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: [
    "lld",
    "optimistic-updates",
    "rollback",
    "server-reconciliation",
    "ux",
    "conflict-resolution",
    "state-management",
  ],
  relatedTopics: [
    "client-cache-invalidation",
    "state-persistence-rehydration",
    "undo-redo-ui-editing",
  ],
};

export default function OptimisticUpdatesRollbackArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design an optimistic update system for a React application
          where user actions (liking a post, updating a profile, adding a comment)
          should appear instant in the UI without waiting for the server response.
          If the server request fails, the UI must automatically rollback to the
          pre-update state. The system must handle dependent updates (updating
          multiple related entities), concurrent updates (user acts while previous
          update is pending), and provide user feedback when rollback occurs.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>React 19+ SPA with Zustand for state management.</li>
          <li>Network latency varies (50ms-2000ms), occasional failures (5-10%).</li>
          <li>Users may perform multiple actions in rapid succession while previous actions are still pending.</li>
          <li>Some updates affect multiple entities (e.g., liking a post increments the post&apos;s like count and adds to user&apos;s liked-posts list).</li>
          <li>Rollback must be transparent to the user — UI reverts smoothly with an optional toast notification.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Instant UI Feedback:</strong> User action immediately updates the UI with the expected result, without waiting for the server.</li>
          <li><strong>Server Reconciliation:</strong> Server response confirms or correct the optimistic state. On success, optimistic state is replaced with server data. On failure, state rolls back.</li>
          <li><strong>Automatic Rollback:</strong> Failed updates automatically revert to the pre-update state. The rollback is atomic — all entities involved in the update revert together.</li>
          <li><strong>Pending State Tracking:</strong> The system tracks which updates are pending, their rollback data, and their order. This enables proper handling of concurrent actions.</li>
          <li><strong>Dependent Updates:</strong> An action that affects multiple entities updates all of them optimistically and rolls back all of them on failure.</li>
          <li><strong>User Notification:</strong> On rollback failure, the user sees a toast explaining what happened and offering a retry option.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Optimistic update is synchronous (instant UI). Server request is async and does not block the UI.</li>
          <li><strong>Reliability:</strong> Rollback always succeeds — the pre-update state is captured before the optimistic update and stored safely.</li>
          <li><strong>Type Safety:</strong> Full TypeScript for update payloads, rollback data, and server responses.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User performs Action B while Action A is pending — if Action A fails and rolls back, Action B&apos;s state may depend on Action A&apos;s result.</li>
          <li>Server returns different data than the optimistic update (e.g., server assigns a different ID or timestamp).</li>
          <li>Network request times out after 30 seconds — rollback triggers, but the server may still process the request eventually.</li>
          <li>User navigates away while an optimistic update is pending — rollback must still occur if the update fails.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The optimistic update pattern follows a three-phase flow: <strong>(1)
          Optimistic Phase</strong> — capture the current state as rollback data,
          apply the expected result to the store immediately. <strong>(2) Server
          Phase</strong> — send the request to the server asynchronously. <strong>
          (3) Reconciliation Phase</strong> — on success, replace optimistic state
          with server response (confirming the update). On failure, restore the
          rollback data. A pending update queue tracks all in-flight updates with
          their rollback data, enabling proper handling of concurrent and dependent
          updates.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Pessimistic updates (wait for server):</strong> Show loading spinner, wait for server, then update UI. Pros: no rollback complexity, always correct. Cons: poor UX — user waits 200ms-2s for feedback, feels sluggish. Acceptable for critical actions (payments, deletions) but not for frequent interactions (likes, edits).</li>
          <li><strong>Optimistic without rollback:</strong> Apply update optimistically, ignore server failures. Pros: simple. Cons: UI becomes inconsistent with server data, user sees changes that didn&apos;t persist. Unacceptable for data integrity.</li>
        </ul>
        <p>
          <strong>Why three-phase optimistic with rollback is optimal:</strong>
          It provides instant feedback (good UX) while maintaining eventual
          consistency with the server (correctness). The rollback data capture
          ensures failure recovery. The pending queue handles concurrency. This
          is the pattern used by Twitter (likes), Gmail (archive), and Figma
          (edits).
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>Seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Optimistic Update Queue (<code>lib/optimistic-queue.ts</code>)</h4>
          <p>FIFO queue tracking pending updates with their rollback data, timestamps, and status (pending, confirmed, rolled-back). Prevents race conditions between concurrent updates.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Rollback Snapshot (<code>lib/rollback-snapshot.ts</code>)</h4>
          <p>Captures pre-update state for all affected entities. Stores enough data to fully restore the pre-update state. Supports multi-entity snapshots for dependent updates.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Optimistic Update Hook (<code>hooks/useOptimisticUpdate.ts</code>)</h4>
          <p>Main hook: accepts store, mutation function, and optimistic data. Executes the three-phase flow. Returns pending status, error state, and retry function for component use.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Server Reconciler (<code>lib/server-reconciler.ts</code>)</h4>
          <p>Compares server response with optimistic state. If they match, confirms the update. If they differ, merges server data (server wins for conflicts). On error, triggers rollback.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Dependency Tracker (<code>lib/dependency-tracker.ts</code>)</h4>
          <p>Tracks dependencies between pending updates. If update B depends on update A&apos;s result, and A rolls back, B is also rolled back (or re-evaluated with the corrected state).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Failure Notification (<code>lib/failure-notifier.ts</code>)</h4>
          <p>Shows toast on rollback with context (&quot;Your comment wasn&apos;t saved&quot;) and retry button. Retries the original mutation with the same optimistic data.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Timeout Handler (<code>lib/timeout-handler.ts</code>)</h4>
          <p>Aborts server requests after 30 seconds, triggers rollback. Handles the edge case where the server eventually processes the request after client timeout — the reconciler detects the server-side change on next data fetch and reconciles.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/optimistic-updates-rollback-architecture.svg"
          alt="Optimistic update three-phase flow: optimistic phase, server phase, reconciliation phase with rollback path"
          caption="Optimistic Update Three-Phase Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User clicks &quot;Like&quot; on a post.</li>
          <li>useOptimisticUpdate hook captures rollback snapshot (post&apos;s current like count and user&apos;s liked status).</li>
          <li>Hook applies optimistic update: post.likeCount++, user.hasLiked = true. UI updates instantly.</li>
          <li>Hook sends POST /api/posts/:id/like to server asynchronously.</li>
          <li>On success: server returns updated post. Reconciler confirms optimistic state matches server data. Update marked confirmed.</li>
          <li>On failure: hook restores rollback snapshot. Post&apos;s like count and user&apos;s liked status revert. Toast notifies user with retry option.</li>
          <li>If user clicks &quot;Unlike&quot; while the &quot;Like&quot; request is pending, the dependency tracker notes that &quot;Unlike&quot; depends on &quot;Like&quot; completing. If &quot;Like&quot; fails and rolls back, &quot;Unlike&quot; is cancelled (no-op).</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Optimistic phase is synchronous and instant. Server phase is async and
          non-blocking. Reconciliation phase is async — on success, server data
          replaces optimistic state; on failure, rollback snapshot restores
          pre-update state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Concurrent dependent updates:</strong> User likes (Action A) then comments (Action B, which shows the post as liked). If A fails, B&apos;s context is invalid. The dependency tracker rolls back B as well, showing the comment form in its pre-like state. User sees a toast: &quot;Your like wasn&apos;t saved — your comment was also not posted. Retry both?&quot;</li>
          <li><strong>Server-optim mismatch:</strong> Optimistic update sets likeCount to 10, server returns 11 (another user liked simultaneously). The reconciler accepts the server value (11) — the user sees the count adjust by 1, which is natural and expected. No rollback needed — the optimistic direction was correct, just off by concurrent activity.</li>
          <li><strong>Timeout with eventual server success:</strong> Client times out at 30s, rolls back. Server processes the like at 35s. Next data fetch (or WebSocket update) brings the server state (liked = true). The reconciler detects the current store state matches the server state and marks the update as confirmed — no user-facing inconsistency.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>Full implementation is in the <strong>Example tab</strong>. Key modules:</p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete implementation: useOptimisticUpdate hook, rollback snapshot
            capture, server reconciler, dependency tracker for concurrent updates,
            timeout handler with AbortController, and failure notification with retry.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1-3: Queue, Snapshot, Hook</h3>
        <p>
          The optimistic queue stores pending updates as objects with ID, rollback snapshot, optimistic data, mutation function, status, and timestamp. The rollback snapshot captures deep copies of affected entities. The hook orchestrates: snapshot, optimistic apply, async mutation, reconcile or rollback. The hook exposes isPending for loading UI, error for toast, and retry function.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4-5: Reconciler, Dependency Tracker</h3>
        <p>
          The reconciler compares server response fields with optimistic state
          fields. Matching fields confirm the update. Differing fields take the
          server value. Missing fields (server returned less data) keep optimistic
          values. The dependency tracker builds a DAG of update dependencies —
          each update declares which entities it affects, and subsequent updates
          that read those entities become dependents. On rollback, all dependents
          are recursively rolled back.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6-7: Notification, Timeout</h3>
        <p>
          The failure notifier displays a toast with the entity type (&quot;comment&quot;,
          &quot;like&quot;), the action that failed (&quot;wasn&apos;t saved&quot;),
          and a retry button. Retry re-runs the original mutation. The timeout
          handler uses AbortController to cancel the fetch request at 30s. If
          the server eventually processes the request, the next data sync
          reconciles the state.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Rollback snapshot capture</td><td className="p-2">O(e) — e entities affected</td><td className="p-2">O(e × s) — s = entity size</td></tr>
              <tr><td className="p-2">Optimistic apply</td><td className="p-2">O(1) — store mutation</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Server reconciliation</td><td className="p-2">O(f) — f fields compared</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Rollback restore</td><td className="p-2">O(e) — restore e entities</td><td className="p-2">O(1) — uses snapshot</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks &amp; Optimizations</h3>
        <ul className="space-y-2">
          <li><strong>Snapshot size for large entities:</strong> Deep-cloning a large entity (post with 500 comments) for rollback is expensive. Mitigation: snapshot only the affected fields (likeCount, hasLiked), not the entire entity tree.</li>
          <li><strong>Dependency graph complexity:</strong> With 50+ concurrent pending updates, the dependency graph grows large. Mitigation: limit pending queue to 10 updates — queue additional actions and execute them sequentially after earlier ones confirm.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation &amp; Abuse Prevention</h3>
        <p>
          Optimistic data is validated before applying — the hook verifies the
          optimistic payload matches the expected schema (e.g., likeCount must be
          a number). This prevents buggy optimistic data from corrupting the store.
          The rollback snapshot is stored in memory only — never persisted to
          localStorage — to avoid sensitive data leakage. Failed update retries
          are rate-limited to 3 attempts to prevent infinite retry loops on
          persistent server errors.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit &amp; Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Happy path:</strong> Optimistic apply → server success → state confirmed with server data.</li>
          <li><strong>Failure path:</strong> Optimistic apply → server error → rollback snapshot restored → toast shown.</li>
          <li><strong>Concurrent updates:</strong> Two updates to the same entity, first fails — verify both roll back correctly.</li>
          <li><strong>Timeout:</strong> Mock 31s response time — verify rollback at 30s and eventual reconciliation on next data fetch.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>No rollback snapshot:</strong> Candidates apply optimistic updates but cannot rollback on failure. Interviewers expect capturing the pre-update state before applying the optimistic change.</li>
          <li><strong>Ignoring concurrent updates:</strong> Candidates don&apos;t handle the case where the user triggers a second action while the first is pending. The dependency tracker or sequential queue is expected.</li>
          <li><strong>Server-optim mismatch panic:</strong> Candidates rollback when server data differs slightly from optimistic (e.g., server-assigned timestamp differs). The correct answer: reconcile — accept server values for fields the server owns, keep optimistic values for user-owned fields.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle optimistic updates for a create operation (new entity with no ID yet)?</p>
            <p className="mt-2 text-sm">
              A: Generate a temporary client-side ID using a timestamp and random suffix. Apply the optimistic update with the temp ID. When the server responds with the real ID, the reconciler replaces the temp ID with the real ID in the store and updates all references to the temp ID. Components subscribed to the entity see a seamless transition.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle optimistic updates in a multi-user collaborative environment?</p>
            <p className="mt-2 text-sm">
              A: Combine optimistic updates with Operational Transformation (OT)
              or CRDTs. The optimistic update applies locally. When the server
              acknowledges, it transforms the operation against any concurrent
              operations from other users. If conflicts exist, the reconciler
              applies the transformed result. For simple cases (likes, votes),
              last-write-wins with server timestamps is sufficient.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://tanstack.com/query/latest/docs/react/guides/optimistic-updates" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">TanStack Query — Optimistic Updates</a></li>
          <li><a href="https://redux-toolkit.js.org/rtk-query/usage/optimistic-updates" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">RTK Query — Optimistic Updates</a></li>
          <li><a href="https://www.patterns.dev/react/optimistic-ui-pattern/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Patterns.dev — Optimistic UI Pattern</a></li>
          <li><a href="https://en.wikipedia.org/wiki/Operational_transformation" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Wikipedia — Operational Transformation</a></li>
          <li><a href="https://crdt.tech/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">CRDT.tech — Conflict-Free Repated Data Types</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

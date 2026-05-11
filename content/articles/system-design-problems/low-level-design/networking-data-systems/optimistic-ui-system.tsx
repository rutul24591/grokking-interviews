"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-optimistic-ui-system",
  title: "Design an Optimistic UI System",
  description:
    "Production-grade optimistic updates that immediately reflect mutations locally while network request completes, with rollback on failure and conflict resolution.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "optimistic-ui-system",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "optimistic-updates",
    "ui-state",
    "mutations",
    "rollback",
    "conflict-resolution",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "race-condition-handling-system",
    "cache-invalidation-strategy",
  ],
};

export default function OptimisticUISystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          User creates a new post, clicks "Submit". Pessimistic approach: freeze UI, wait for server confirmation (500ms-2s), show post. User perceives lag. Optimistic approach: immediately add post to list (UI updates instantly), send request to server in parallel. Server confirms success, nothing changes. If server rejects, rollback (remove post, show error). User perceives instant response.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Optimistic updates dramatically improve UX. Gmail shows sent email instantly (optimistic), Google Docs shows edits instantly. Without this, apps feel slow. Challenge: UI can temporarily diverge from server state. If optimistic update wrong (user guesses wrong value), UI shows incorrect data briefly. Must handle rollback reliably, show loading indicator, handle concurrent mutations, manage request deduplication.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key risk: data consistency. If optimistic update assumes post will have ID 123, but server assigns ID 456, client data out of sync. Solution: server returns full response with actual assigned IDs. Client updates UI with real data.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Explicit assumptions:</strong> Mutations may fail (validation, conflicts). Concurrent mutations possible (multiple users editing same resource). Network latency 100-500ms. Rollback must restore previous state. Server is source of truth. Request IDs available for deduplication.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Immediate UI Update:</strong> Update UI instantly when user
            initiates mutation.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Rollback on Failure:</strong> If mutation fails, revert UI
            to previous state.
          </HighlightBlock>
          <li>
            <strong>Undo Stack:</strong> Store previous state so rollback can
            restore it exactly.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Conflict Resolution:</strong> Handle conflicts when
            concurrent mutations affect same data.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Manual Retry:</strong> Expose retry button so users can
            retry failed mutations.
          </HighlightBlock>
          <li>
            <strong>Pending State Indicator:</strong> Show loading/pending state
            while mutation in-flight.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Non-Functional Requirements
        </h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Instant Feedback:</strong> UI updates synchronously, no
            latency.
          </HighlightBlock>
          <li>
            <strong>Memory Efficient:</strong> Undo stack bounded (e.g., last 10
            mutations).
          </li>
          <li>
            <strong>Concurrency Safe:</strong> Multiple simultaneous mutations
            handled correctly.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Mutation succeeds on server but fails client-side validation → sync
            to server state.
          </li>
          <li>
            Two mutations to same resource conflict → resolve via
            server-provided conflict info.
          </li>
          <HighlightBlock as="li" tier="important">
            Network request times out → keep UI in pending state, expose retry.
          </HighlightBlock>
          <li>
            Rollback during refetch → clean up timers and abort in-flight
            requests.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">If server responds with error, rollback to previous state from undo stack. If</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">conflict detected, apply server state and notify user. Implement a mutation queue to serialize mutations to same resource, preventing concurrent conflicts.</HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Optimistic Update Flow
        </h3>
        <p>
          The mutation lifecycle consists of: optimistic update, server request,
          and confirmation/rollback.
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User initiates mutation (e.g., edit post title).</li>
          <li>Immediately update local state with new value (optimistic).</li>
          <li>Store previous state in undo stack.</li>
          <li>Initiate async request to server.</li>
          <li>
            On server success: confirm optimistic update, mark mutation
            complete.
          </li>
          <HighlightBlock as="li" tier="important">
            On server error: rollback from undo stack, display error message,
            expose retry.
          </HighlightBlock>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Undo Stack</h3>
        <p>
          A stack stores previous states for rollback. Each mutation pushes the
          previous state onto the stack. On rollback, pop from stack.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Stack Entry:</strong>{" "}
            {`{mutationId, previousState, timestamp, status}`}.
          </li>
          <li>
            <strong>Bounded Size:</strong> Cap stack size (e.g., 20 mutations)
            to avoid unbounded memory.
          </li>
          <li>
            <strong>Cleanup:</strong> When stack exceeds max size, remove oldest
            entries.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Mutation Queue</h3>
        <p>
          To prevent concurrent mutations to the same resource from conflicting,
          queue mutations serially. Each mutation waits for the previous to
          complete.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Queue by Resource:</strong> Maintain separate queues for
            each resource (post ID, comment ID).
          </li>
          <li>
            <strong>Serial Execution:</strong> Process mutations one-at-a-time
            from queue.
          </li>
          <li>
            <strong>Conflict Detection:</strong> If queued mutation conflicts
            with completed mutation, apply conflict resolution.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Conflict Resolution</h3>
        <p>
          When mutations conflict, several strategies are possible depending on
          use case.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Server Wins:</strong> Discard local mutation, use server
            state. Simple but loses user changes.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Client Wins:</strong> Apply local mutation after server
            mutation. Risks data inconsistency if server validation failed.
          </HighlightBlock>
          <li>
            <strong>Three-Way Merge:</strong> Merge base state, server mutation,
            and client mutation. Complex but preserves both changes.
          </li>
          <li>
            <strong>Manual Resolution:</strong> Present conflict to user, let
            them choose.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Pending State</h3>
        <p>
          While mutation is in-flight, display a pending state to indicate the
          operation is processing.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>UI Indicator:</strong> Show spinner, loader, or disable
            input.
          </li>
          <li>
            <strong>Revert Option:</strong> Allow user to cancel/revert the
            optimistic update while pending.
          </li>
          <li>
            <strong>Progress:</strong> For long mutations, show progress bar or
            estimated time.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Retry Mechanism</h3>
        <HighlightBlock as="p" tier="important">
          If mutation fails, expose a retry button so user can re-attempt the
          mutation.
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Retry State:</strong> Track retry count and reason for
            failure.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Exponential Backoff:</strong> Retry with increasing delays.
          </HighlightBlock>
          <li>
            <strong>Max Retries:</strong> Cap at 3-5 retries. Beyond that,
            require manual intervention.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Optimism Level Configuration
        </h3>
        <p>
          Some mutations are always safe (increment counter), others are risky
          (edit shared resource). Allow configuring optimism level per mutation.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Always Optimistic:</strong> Safe mutations always update UI
            immediately.
          </li>
          <li>
            <strong>Conditional Optimistic:</strong> Update UI only if last
            mutation succeeded recently.
          </li>
          <li>
            <strong>Never Optimistic:</strong> Wait for server confirmation
            before updating UI.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Type Safety</h3>
        <HighlightBlock as="p" tier="crucial">
          Use TypeScript generics to enforce type consistency between optimistic
          state and server response.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Undo/Redo</h3>
        <HighlightBlock as="p" tier="important">
          Extend optimistic updates to support undo/redo. Store mutations in a
          history list for users to revert or redo changes.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Persistence</h3>
        <HighlightBlock as="p" tier="important">
          For offline scenarios, persist pending mutations to localStorage. On
          reconnection, replay mutations.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Analytics</h3>
        <HighlightBlock as="p" tier="important">
          Track mutation failures and rollback rates. High rollback rate
          indicates bad optimism strategy.
        </HighlightBlock>
      </section>

      <section>
        <h2>Optimistic Update Lifecycle & State Transitions</h2>

        <HighlightBlock as="p" tier="crucial">
          An optimistic mutation follows a well-defined lifecycle with clear state transitions. Initial state: idle (no mutation in-flight). User initiates mutation → state becomes optimistic-pending (UI updated, server request sent). Three possible outcomes from optimistic-pending: success (server confirms), error (server rejects), or timeout (no response). On success → state becomes confirmed (optimistic update confirmed by server). On error → state becomes rolled-back (UI reverted to previous state, error shown). On timeout → state remains pending with retry option.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/optimistic-updates-lifecycle.svg"
          alt="Optimistic update lifecycle and state transitions diagram"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Undo Stack Implementation Details</h3>
        <HighlightBlock as="p" tier="important">
          The undo stack is a LIFO data structure storing (mutationId, previousState, timestamp, metadata). When mutation initiated, current state snapshot pushed. On rollback, pop stack and restore state. Size bounded: maximum 20-50 entries. When full, oldest entries discarded. Each stack entry includes: mutation type (create, update, delete), affected resource ID, old value, new value (optimistic), confirmation status. This metadata helps debug rollback issues and replay mutations.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Concurrent Mutation Ordering & Causality</h3>
        <HighlightBlock as="p" tier="important">
          When two mutations happen simultaneously on same resource, ordering matters. Use vector clocks or timestamps to establish causality. Example: User A edits title, user B edits description simultaneously. Server must decide: apply A then B, or B then A? With timestamps: whoever's timestamp earlier, apply first. Vector clocks handle distributed ordering without central clock. Client-side queue prevents client's own mutations from conflicting (serial execution per resource). But server-side still needs ordering for inter-client mutations.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Rollback Cascading & Side Effects</h3>
        <HighlightBlock as="p" tier="important">
          Mutation M1 succeeds optimistically. User does M2 based on M1 (e.g., created post, then likes it). If M1 rolls back, M2 invalid (can't like post that doesn't exist). Rollback must cascade: rollback M1 → cascade rollback M2. Collect mutations dependent on failed mutation, roll them back automatically. Show user "M1 failed, M2 rolled back as consequence". This requires dependency tracking: which mutations depend on which.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimism Confidence Scoring</h3>
        <p>
          Not all mutations equally likely to succeed. Assign confidence score (0-100%) per mutation type. Increment counter: +1 → update post (90% likely), +0.5 → delete comment (50% likely), +1 → add to favorites (99% likely). Higher confidence → more aggressive optimism (don't show pending, assume success). Lower confidence → show pending, wait longer before rollback. This adaptive approach balances speed and correctness.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Network Failure Handling & Offline Queue</h3>
        <HighlightBlock as="p" tier="important">
          If network unavailable during mutation, queue optimistically. On reconnection, replay queue in order. Each queued mutation has timestamp. On server, apply mutations older to newer (causality). Deduplication via mutation ID: server sees same ID twice, returns cached result. Essential for offline-first apps. Persist queue to IndexedDB, survive page reload.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Complexity vs Responsiveness
        </h3>
        <HighlightBlock as="p" tier="crucial">
          Optimistic updates add complexity but dramatically improve perceived
          performance. Trade-off is worth it for most user-facing mutations.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Correctness vs Speed
        </h3>
        <HighlightBlock as="p" tier="important">
          Serving stale data immediately (optimistic) risks incorrectness if
          mutation fails. Balance via appropriate optimism level per mutation
          type.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Memory Usage</h3>
        <HighlightBlock as="p" tier="important">
          Storing undo stack increases memory. Bound stack size to prevent
          unbounded growth.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Observability & Conflict Metrics
        </h3>
        <HighlightBlock as="p" tier="crucial">
          Emit metrics on optimistic success rate, rollback frequency, conflict
          rate. If rollback &gt; 5%, indicates bad optimism strategy or backend
          issues. Trace mutations through system. Monitor latency from
          rollback/retry cycle. At 1M concurrent users, conflicts common—track
          resolution strategy used.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Three-Way Merge vs Last-Write-Wins
        </h3>
        <p>
          For collaborative/document editing: three-way merge preserves both
          edits if non-overlapping. For counters/simple fields: last-write-wins
          simpler. Declare strategy per resource type. Real-world: document apps
          need merge; social feeds okay with last-write.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Offline-First Mutation Queuing
        </h3>
        <p>
          Queue mutations offline, replay on reconnect with conflict resolution.
          Persist queue to IndexedDB. Handle cascading conflicts (A conflicts
          with B, B conflicts with C). Deterministic conflict resolution ensures
          same result across clients.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Idempotency Keys & Deduplication
        </h3>
        <HighlightBlock as="p" tier="important">
          Assign unique ID per mutation. Server deduplicates via ID: same ID
          resubmitted returns cached result. Prevents duplicate effects on
          retry. Essential safety mechanism at scale. Pair with client-side
          request deduplication.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Partial Failures & Cascading Rollbacks
        </h3>
        <HighlightBlock as="p" tier="important">
          Mutation succeeds partially (some resources updated, others fail).
          Fully rollback to maintain consistency. Show user exactly what failed.
          Allow selective retry. Handle cascading: if A fails, do B and C
          rollback?
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Undo/Redo & History Management
        </h3>
        <p>
          Extend optimistic updates with undo/redo. Undo reverts locally,
          confirms via server delete. Redo replays mutation. Coordinate with
          offline queue and mutation queue. Bounded history (last 100 actions)
          to limit memory.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Testing Concurrent Mutations
        </h3>
        <p>
          Use property-based testing (fast-check) to generate concurrent
          mutation sequences. Verify final state deterministic regardless of
          timing. Mock server responses with delays/errors. Test all rollback
          scenarios. Verify undo/redo correctness under concurrent mutations.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Race Conditions & Mutation Ordering
        </h3>
        <p>
          Concurrent mutations A and B to same resource. A succeeds server-side,
          B conflicts. Rollback B. But UI showed both succeeding. Separate
          optimistic state from server truth. Use version/timestamp for
          ordering. Coordinate with conflict resolution carefully.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: optimistic succeeds locally but fails server-side. UI shows
          success, user believes saved—silent failure worst case. Always show
          pending state and surface errors. Another: aggressive conflict
          resolution (always last-write) loses user work. Test extensively.
          Third: unbounded undo stack leaks memory. Bound carefully.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Integration with Cache Invalidation
        </h3>
        <HighlightBlock as="p" tier="important">
          Mutation updates local state optimistically and invalidates related
          cache entries. Fetch hook refetches. Coordinate timing: does
          optimistic update happen before or after cache invalidation? Ensure
          consistency.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Real-world systems face cascading rollbacks, partial failures, race conditions, and must maintain consistency across clients. Observability on</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">rollback/conflict rates is essential for diagnosing issues. Understanding these patterns is crucial for building reliable, user-friendly applications at scale where network latency and failures are inevitable. Implement carefully—silent failures and data loss worse than showing errors.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

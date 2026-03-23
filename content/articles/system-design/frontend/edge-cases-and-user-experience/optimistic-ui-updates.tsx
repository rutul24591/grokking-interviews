"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-optimistic-ui-updates-extensive",
  title: "Optimistic UI Updates",
  description:
    "Staff-level deep dive into optimistic update patterns, rollback strategies, conflict resolution, consistency guarantees, and systematic approaches to building instant-feeling interfaces while maintaining data integrity.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "optimistic-ui-updates",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "optimistic updates",
    "state management",
    "consistency",
    "latency hiding",
    "rollback",
  ],
  relatedTopics: [
    "loading-states",
    "error-states",
    "state-management",
    "undo-redo-functionality",
  ],
};

export default function OptimisticUiUpdatesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Optimistic UI updates</strong> are a frontend pattern where the user interface immediately reflects the expected result of an operation before the server confirms it, making interactions feel instantaneous by hiding network latency. When a user clicks a &ldquo;Like&rdquo; button, the heart icon fills and the count increments immediately — not after a 200-millisecond round trip to the server. When a user sends a message, it appears in the chat thread instantly, not after the POST request completes. This pattern fundamentally changes the perceived responsiveness of web applications, making them feel as fast as native applications despite the inherent latency of client-server communication.
        </p>
        <p>
          The technique works because most user operations succeed — network requests complete successfully in the vast majority of cases, typically 99% or higher for well-architected services. By assuming success and updating the UI immediately, the application provides instant feedback for the common case while handling the rare failure case through rollback or reconciliation. The key insight is that waiting for server confirmation penalizes every user for every interaction to protect against a failure rate that is typically under one percent. Optimistic updates invert this tradeoff — the common case is instant and the rare case requires additional handling.
        </p>
        <p>
          At the staff and principal engineer level, optimistic updates introduce significant complexity in state management, error handling, and data consistency. The frontend must maintain both the optimistic state (what the user sees) and the authoritative state (what the server has confirmed), reconcile them when the server response arrives, and roll back the optimistic state if the operation fails. This dual-state management becomes especially complex when multiple optimistic updates are in flight simultaneously, when operations depend on each other, or when multiple users modify the same data concurrently. The architectural challenge is building a system that feels instant to users while maintaining the correctness guarantees that the application requires.
        </p>
        <p>
          Modern data fetching libraries have significantly simplified optimistic update implementation. React Query, SWR, and Apollo Client all provide built-in mechanisms for optimistic mutations — accepting an optimistic response that immediately updates the cache, applying the server response when it arrives, and rolling back to the previous state on failure. However, these library-level primitives are only the beginning. A staff-level optimistic update strategy must also address which operations are safe for optimistic treatment, how to communicate pending versus confirmed states visually, how to handle rollback UX without confusing users, and how to prevent optimistic updates from masking real data integrity issues.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Optimistic Response:</strong> A locally generated prediction of what the server&apos;s response will be, applied to the UI cache immediately upon initiating a mutation. For a &ldquo;like&rdquo; action, the optimistic response predicts that the like count will increment by one and the current user will be added to the list of likers. The optimistic response must match the shape and schema of the real server response to integrate seamlessly with the existing rendering logic.
          </li>
          <li>
            <strong>Rollback:</strong> The process of reverting the UI to its pre-optimistic state when a server request fails. Rollback must be immediate, complete, and visually clear — the like count goes back down, the sent message shows a failure indicator, the deleted item reappears. Effective rollback requires snapshotting the pre-mutation state before applying the optimistic update so it can be restored. Libraries like React Query handle this through their onMutate callback, which returns a context object containing the previous state for rollback in onError.
          </li>
          <li>
            <strong>Reconciliation:</strong> The process of merging the server&apos;s authoritative response with the current optimistic state when the server confirms the operation. In simple cases, the server response directly replaces the optimistic data. In complex cases — when additional optimistic updates have been applied on top of the first one, or when the server response includes data the client could not predict (generated IDs, timestamps, computed fields) — reconciliation must carefully merge the authoritative data without disrupting subsequent optimistic updates.
          </li>
          <li>
            <strong>Pending State Indicator:</strong> A subtle visual cue that communicates to users that an operation has been applied optimistically but not yet confirmed by the server. Examples include a slightly reduced opacity on an unconfirmed message, a small spinner next to an unconfirmed action, or a &ldquo;Saving...&rdquo; indicator in the toolbar. Pending indicators should be subtle enough not to draw attention during the common case (where confirmation arrives quickly) but visible enough for users to understand the system&apos;s state during slow or failed operations.
          </li>
          <li>
            <strong>Idempotency:</strong> A property of operations where applying them multiple times produces the same result as applying them once. Idempotent operations are safer for optimistic updates because retrying a failed request does not cause duplicate side effects. A PUT request that sets a value to X is idempotent — applying it twice still results in X. A POST request that increments a counter is not idempotent — applying it twice results in an incorrect double increment. Non-idempotent operations require idempotency keys or deduplication logic to prevent duplicate side effects on retry.
          </li>
          <li>
            <strong>Conflict Resolution:</strong> The strategy for handling situations where the optimistic update conflicts with changes made by other users or systems. If User A optimistically likes a post while User B simultaneously deletes it, the reconciliation must handle the resulting conflict gracefully. Common strategies include last-write-wins (simple but potentially lossy), merge (complex but preserves both changes), and prompt (ask the user to resolve the conflict manually).
          </li>
          <li>
            <strong>Mutation Queue:</strong> An ordered list of pending optimistic mutations that tracks their state (pending, confirmed, failed) and manages dependencies between them. When multiple mutations affect the same entity, the queue ensures they are reconciled in order and that a rollback of an earlier mutation correctly handles subsequent mutations that built on its optimistic state. Without a mutation queue, concurrent optimistic updates can produce inconsistent states.
          </li>
          <li>
            <strong>Optimistic Eligibility:</strong> The criteria that determine whether an operation is suitable for optimistic treatment. Not all operations should be optimistic — operations with unpredictable outcomes (search queries, recommendation fetches), destructive operations with serious consequences (account deletion, fund transfers), and operations that create server-generated data the client cannot predict (file processing, AI-generated content) are poor candidates for optimistic updates. The eligibility assessment considers predictability, reversibility, consequence severity, and client-side predictability.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The first diagram illustrates the optimistic update lifecycle for a typical mutation. The user initiates an action, and the mutation handler simultaneously sends the request to the server and applies the optimistic response to the local cache. The UI immediately reflects the optimistic state. When the server responds successfully, the optimistic data is replaced with the authoritative server response through reconciliation. If the server returns an error, the rollback mechanism restores the pre-mutation state and displays an appropriate error message. Throughout this lifecycle, the pending state indicator reflects whether the operation is optimistic (unconfirmed), confirmed, or failed. The diagram highlights the temporal overlap — the user sees the result immediately while the server processes the request in parallel.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/optimistic-ui-updates-diagram-1.svg"
          alt="Optimistic update lifecycle showing parallel UI update and server request with reconciliation and rollback paths"
          width={900}
          height={500}
        />
        <p>
          The second diagram shows the complexity that arises with concurrent optimistic mutations on the same entity. User A applies optimistic update M1 (like a post), then immediately applies M2 (comment on the same post) before M1 is confirmed. The local state now reflects both M1 and M2 optimistically. If M1 fails and rolls back, the system must determine whether M2 is still valid — in this case it is, because commenting does not depend on liking. But if M1 were &ldquo;create a list&rdquo; and M2 were &ldquo;add item to that list,&rdquo; M2&apos;s rollback would also be necessary. The diagram shows the mutation queue tracking the state and dependencies of each mutation, enabling correct sequential rollback when earlier mutations fail.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/optimistic-ui-updates-diagram-2.svg"
          alt="Concurrent optimistic mutation handling showing mutation queue, dependency tracking, and cascading rollback scenarios"
          width={900}
          height={500}
        />
        <p>
          The third diagram depicts the decision framework for determining optimistic eligibility. Operations are evaluated along three axes: predictability (can the client accurately predict the outcome?), reversibility (can the operation be rolled back without user-visible damage?), and consequence severity (what happens if the optimistic state is shown but the operation fails?). High predictability, high reversibility, and low consequence operations (toggling likes, sending chat messages, reordering items) are ideal candidates. Low predictability operations (search, recommendation generation), irreversible operations (permanent deletion, financial transactions), or high-consequence operations (publishing content, sending emails) should not use optimistic updates. The middle zone includes operations that benefit from optimistic updates with additional safeguards like confirmation dialogs or undo windows.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/optimistic-ui-updates-diagram-3.svg"
          alt="Optimistic eligibility decision framework evaluating predictability, reversibility, and consequence severity for different operation types"
          width={900}
          height={500}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-2 text-left">Aspect</th>
              <th className="px-4 py-2 text-left">Advantages</th>
              <th className="px-4 py-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Optimistic Updates</td>
              <td className="px-4 py-2">Instant perceived responsiveness, eliminates loading states for mutations, feels native-app fast, reduces user anxiety about whether actions registered, excellent for high-frequency interactions</td>
              <td className="px-4 py-2">Complex state management with rollback logic, can confuse users if rollback occurs, requires careful handling of concurrent mutations, may show incorrect state temporarily, difficult to debug</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Pessimistic Updates (Wait for Server)</td>
              <td className="px-4 py-2">Always shows confirmed state, no rollback complexity, simple state management, no risk of showing incorrect data, straightforward error handling</td>
              <td className="px-4 py-2">Every interaction has visible latency, requires loading indicators for all mutations, feels slow especially on high-latency connections, may cause double-click issues while waiting</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Optimistic with Undo</td>
              <td className="px-4 py-2">Instant UI response, provides a safety net for mistakes, reduces anxiety about destructive actions, aligns with user mental model of reversible actions</td>
              <td className="px-4 py-2">Requires deferred server execution (action waits until undo window closes), more complex server orchestration, undo window timeout needs careful tuning, may delay actual processing</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Background Sync</td>
              <td className="px-4 py-2">Works offline, batches mutations efficiently, decouples UI from network availability, resilient to intermittent connectivity</td>
              <td className="px-4 py-2">Complex conflict resolution when syncing, users may forget about pending operations, stale data can compound, requires service worker infrastructure</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Apply optimistic updates only to predictable, low-consequence operations.</strong> Toggle actions (like/unlike, follow/unfollow, archive/unarchive), simple CRUD on user-owned data (creating a note, editing a comment, reordering a list), and status changes (marking as read, completing a task) are ideal candidates. Avoid optimistic updates for operations with unpredictable outcomes, significant financial consequences, or irreversible side effects. Establish clear eligibility criteria that the entire team follows rather than leaving the decision to individual developers.
          </li>
          <li>
            <strong>Always snapshot the pre-mutation state for rollback.</strong> Before applying an optimistic update, capture a deep copy of the affected data in its current state. This snapshot is the rollback target if the server request fails. Shallow copies are insufficient if the data contains nested objects that may be modified. Libraries like React Query provide this through the onMutate callback&apos;s context return value, but the principle applies regardless of the specific tool — you must be able to restore the exact previous state, not an approximation of it.
          </li>
          <li>
            <strong>Show subtle pending state indicators for slow confirmations.</strong> While most optimistic updates are confirmed within milliseconds, some may take longer due to network latency or server processing. After a configurable threshold (typically one to two seconds), show a subtle indicator that the operation is still pending. This prevents the user from thinking a slow operation has been confirmed when it is still in flight. The indicator should be unobtrusive enough not to be noticed when confirmations are fast but visible enough to inform during slow operations.
          </li>
          <li>
            <strong>Handle rollback with clear user communication.</strong> When an optimistic update must be rolled back, do not silently revert the UI — this confuses users who saw their action take effect and then unexpectedly saw it reversed. Show an explicit error message explaining that the action could not be completed and what the user can do about it. For actions like message sending, mark the failed message with a retry affordance rather than removing it entirely, so the user does not lose the content they typed.
          </li>
          <li>
            <strong>Use idempotency keys for non-idempotent operations.</strong> When an optimistic mutation fails and is retried, the retry must not create duplicate side effects. Include a unique idempotency key (typically a UUID generated on the client) with each mutation request so the server can deduplicate retries. This is especially critical for operations that create resources, increment counters, or trigger notifications — without idempotency keys, network retry logic can produce duplicate records or multiple notifications.
          </li>
          <li>
            <strong>Reconcile server responses rather than just replacing optimistic data.</strong> When the server confirms an operation, the response may include fields the client could not predict — server-generated IDs, computed timestamps, aggregated counts that reflect other users&apos; actions. Simply replacing the optimistic data with the server response works for simple cases, but when additional optimistic updates have been applied on top, naive replacement can overwrite those subsequent updates. Implement merge logic that applies server-confirmed fields while preserving fields from subsequent optimistic mutations.
          </li>
          <li>
            <strong>Test rollback scenarios as rigorously as success scenarios.</strong> Most testing focuses on the happy path — action succeeds, UI updates. But the complexity and risk of optimistic updates is concentrated in failure paths — rollback after confirmation delay, cascading rollback of dependent mutations, rollback with concurrent user input, rollback during component unmounting. Build testing infrastructure that simulates network failures at various points in the optimistic lifecycle and verifies that the UI returns to a consistent, correct state.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Applying optimistic updates to operations with unpredictable outcomes.</strong> Attempting to optimistically show the result of a search query, a recommendation fetch, or an AI content generation is fundamentally misguided because the client cannot predict what the server will return. Optimistic updates work by predicting the outcome — when the outcome is inherently unpredictable, the optimistic state will be wrong and the replacement with real data will feel like a jarring correction rather than a smooth confirmation.
          </li>
          <li>
            <strong>Silent rollback without user notification.</strong> When an optimistic update fails and the UI silently reverts, users notice something changed but do not understand why. The like count that incremented now shows the old number. The message that appeared in the chat is gone. This silent reversal is more confusing than if the operation had shown a loading state and then an error. Always pair rollback with an explicit, contextual notification explaining what happened and what the user can do.
          </li>
          <li>
            <strong>Not handling stale optimistic state on component remount.</strong> If a user triggers an optimistic mutation, navigates away, and returns before the server responds, the component may remount with stale optimistic data from the cache but without the pending mutation context needed for rollback or reconciliation. Ensure that mutation state is managed at a level that survives component unmounting — in the data layer or a global store, not in local component state.
          </li>
          <li>
            <strong>Cascading optimistic updates without dependency tracking.</strong> When one optimistic mutation depends on another (create a folder, then move a file into that folder), rolling back the first must also roll back the second. Without explicit dependency tracking between mutations, the rollback of the folder creation leaves the file in a &ldquo;moved to non-existent folder&rdquo; state. Track dependencies in the mutation queue and implement cascading rollback that reverses all dependent mutations when a parent mutation fails.
          </li>
          <li>
            <strong>Over-applying optimistic updates to every mutation.</strong> Not every operation benefits from optimistic treatment. Low-frequency, high-stakes operations (account settings changes, permission modifications, content publishing) are better served by explicit loading states that communicate the operation&apos;s importance. Applying optimistic updates universally dilutes the pattern&apos;s value and introduces rollback complexity for operations where a brief loading state is perfectly acceptable.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Facebook/Meta</strong> pioneered many optimistic update patterns at scale. Likes, reactions, comments, and shares are all applied optimistically, with the UI showing the result immediately and reconciling with server state asynchronously. Facebook&apos;s implementation is particularly notable for handling high-contention operations — when thousands of users like a post simultaneously, the optimistic local count may diverge significantly from the server count. Facebook resolves this by treating the server response as authoritative for aggregate counts while preserving the user&apos;s individual action state (whether they liked it), creating a seamless experience despite the behind-the-scenes complexity.
        </p>
        <p>
          <strong>Slack</strong> uses optimistic updates for message sending, creating the perception that messages are sent instantly even when network latency is high. When a user sends a message, it appears immediately in the chat with a subtle pending indicator (a faint clock icon). If the send fails, the message is marked with a red error indicator and a retry button, preserving the message content so the user does not need to retype. Slack also handles the complex scenario of message ordering — if a user sends messages A and B optimistically but B&apos;s server confirmation arrives before A&apos;s, the messages are reordered to match server-determined timestamps, with a smooth animation to avoid jarring jumps.
        </p>
        <p>
          <strong>Todoist</strong> demonstrates optimistic updates for task management where the operations are highly predictable and user-data-centric. Creating tasks, completing tasks, reordering tasks, and moving tasks between projects are all applied optimistically. Todoist&apos;s implementation is notable for its offline support — optimistic updates continue to work without network connectivity, queuing mutations in local storage and syncing when the connection is restored. Their sync engine handles conflict resolution using a last-write-wins strategy with server-side timestamps, resolving conflicts that arise when a user makes offline changes to data that was modified by another device.
        </p>
        <p>
          <strong>Linear</strong> applies optimistic updates throughout its project management interface. Issue status changes, priority updates, assignee changes, and label modifications are all instant. Linear&apos;s approach is sophisticated in handling multi-user collaboration — when two team members modify the same issue simultaneously, the optimistic updates reflect each user&apos;s changes independently, and the server reconciles them using a field-level merge strategy. If User A changes the status while User B changes the priority, both changes are preserved. If both users change the same field, the server&apos;s conflict resolution determines the final value and the &ldquo;losing&rdquo; user&apos;s optimistic state is reconciled to match.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: When should you use optimistic updates versus waiting for server
            confirmation?
          </p>
          <p className="mt-2">
            A: Use optimistic updates when the operation meets three criteria: the outcome is predictable (the client can accurately anticipate the server&apos;s response), the operation is reversible (rollback is possible without permanent consequences), and the failure rate is low (the operation succeeds in the vast majority of cases). Toggle actions like likes and follows, CRUD on user-owned data like notes and comments, and status changes like task completion are ideal candidates. Wait for server confirmation when the outcome is unpredictable (search, recommendations, computations), the operation is irreversible or high-stakes (financial transactions, permanent deletions, email sends), or the failure rate is significant (operations on shared resources with contention). Also wait for confirmation when showing incorrect state, even briefly, could cause real-world harm — displaying an incorrect account balance, confirming an unprocessed order, or showing a successfully sent message that actually failed silently.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you handle rollback when multiple optimistic updates are
            in flight?
          </p>
          <p className="mt-2">
            A: I would maintain a mutation queue that tracks each optimistic mutation in order, with its pre-mutation snapshot, dependencies on other mutations, and current status. When a mutation fails, the rollback process evaluates each subsequent mutation in the queue: if a later mutation depends on the failed one, it is also rolled back; if it is independent, it is preserved. The rollback is applied in reverse order — last mutation first — to correctly restore the state. For implementation, the pre-mutation snapshot of each mutation includes the state as it was after all preceding mutations were applied, so rolling back mutation N restores the state to what it was after mutation N-1 but before mutation N. React Query simplifies this by invalidating and refetching affected queries on mutation failure, effectively resynchronizing with the server rather than attempting precise client-side rollback. The choice between precise rollback and refetch-based reconciliation depends on whether the refetch latency is acceptable and whether the operation can produce side effects that must be tracked.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do optimistic updates interact with real-time collaboration
            where multiple users modify the same data?
          </p>
          <p className="mt-2">
            A: In collaborative environments, optimistic updates create a window where the local state diverges from the server state that other users see. The key challenge is reconciliation — when the server confirms the optimistic update, the response may include changes from other users that occurred concurrently. I would implement field-level reconciliation: when the server response arrives, compare each field against both the optimistic state and the pre-mutation state. Fields that were not part of the optimistic update should be updated from the server response to reflect other users&apos; changes. Fields that were part of the optimistic update should adopt the server&apos;s value (which may differ from the optimistic prediction if another user&apos;s change took precedence). For true real-time collaboration, I would layer optimistic updates on top of a WebSocket-based sync system — optimistic updates provide instant local feedback while the sync system ensures eventual consistency. Conflict resolution policies (last-write-wins, merge, or user-prompted) should be defined per-field based on the semantic meaning of the data.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you design the visual UX for optimistic updates,
            including pending and failed states?
          </p>
          <p className="mt-2">
            A: The visual design should communicate three states: confirmed (the default, normal appearance), pending (subtly different to indicate server processing), and failed (clearly different with recovery options). For the pending state, I would use a subtle visual distinction that is noticeable on close inspection but not attention-grabbing — slightly reduced opacity, a small spinner or clock icon, or a thin progress bar. The pending indicator should only appear after a threshold delay (one to two seconds) to avoid flashing during fast confirmations. For the failed state, I would use a clear error indicator (red border, error icon, strikethrough) with an inline retry button and the preserved content. The failed state must not remove the user&apos;s content — a failed message send should show the message with a retry option, not delete it. I would also define transition animations: instant apply for the optimistic state (to feel fast), smooth crossfade for the confirmation transition (to avoid visual pops), and a deliberate error animation for failures (to ensure the user notices the rollback).
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-medium">
            Q: How do you ensure that optimistic updates do not mask data
            integrity issues?
          </p>
          <p className="mt-2">
            A: The risk of masking data integrity issues is real — if the optimistic UI consistently shows success while the server is silently failing, users and developers may not notice the problem until data loss has accumulated. I would address this through several layers. First, establish a reconciliation verification step that compares the server response against the optimistic prediction and logs discrepancies. High discrepancy rates indicate either a faulty optimistic prediction logic or a server-side issue. Second, implement a background consistency check that periodically refetches authoritative data and compares it against the cached optimistic state, flagging divergences. Third, monitor mutation failure rates and alert when they exceed a threshold — a spike in optimistic rollbacks indicates a systemic issue. Fourth, use feature flags to disable optimistic updates for specific operations if data integrity concerns arise, falling back to pessimistic loading states while the issue is investigated. The principle is that optimistic updates are a UX optimization, not a replacement for correctness — the system must always converge to the server&apos;s authoritative state.
          </p>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://tanstack.com/query/latest/docs/react/guides/optimistic-updates" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              TanStack Query — Optimistic Updates Guide
            </a>
          </li>
          <li>
            <a href="https://www.apollographql.com/docs/react/performance/optimistic-ui/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Apollo Client — Optimistic Mutation Results
            </a>
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Response Times: The 3 Important Limits
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/offline-cookbook" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              web.dev — The Offline Cookbook
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/eaaDev/EventSourcing.html" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Event Sourcing
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

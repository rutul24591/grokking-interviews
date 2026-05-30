"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-network-status-detection",
  title: "Design Network Failure Handling",
  description: "Implementation-heavy low-level design guide for design network failure handling, with offline state models, queues, conflict handling, fallback behavior, and production trade-offs.",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "network-status-detection",
  wordCount: 4700,
  readingTime: 28,
  lastUpdated: "2026-05-29",
  tags: ["lld", "offline", "advanced-ux", "resilience", "principal-engineer"],
  relatedTopics: ["network-failure-handling", "state-management", "progressive-enhancement"],
};

export default function NetworkStatusDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design Network Failure Handling</h1>
        <h2>Definition &amp; Context</h2>
        <p>
          Design Network Failure Handling is a low-level design problem about building a connectivity and request health coordinator that keeps a user journey coherent when the network, browser capability, storage, or server version cannot be trusted. A principal-ready answer should not stop at saying &quot;cache it&quot; or &quot;retry later&quot;. It should define the public API, local durability model, conflict semantics, privacy boundaries, and the exact user-visible states when the system cannot safely continue.
        </p>
        <p>
          The implementation contract starts with observeSignal(signal), classifyFailure(error), gateRequest(request), recoverWhenHealthy(). The runtime should make these states explicit: healthy, degraded, offline, captive, recovering, blocked. The central invariant is: The UI should degrade based on observed reachability, not a single unreliable online boolean. The hard case to defend in an interview is when navigator.onLine says online while the API is unreachable behind a captive portal or regional outage. That case forces the design to explain durability, ordering, rollback, and how much ambiguity the UI is allowed to hide.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/network-status-detection-runtime.svg"
          alt="Design Network Failure Handling runtime architecture"
          caption="Runtime architecture: user intent is captured locally first, classified by capability and connectivity, then replayed or resolved through guarded sync."
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The first concept is local intent capture. Offline systems should record what the user meant to do, not only the final rendered value. A durable intent contains an operation id, actor id, target resource, base version, payload, timestamp, dependency list, and idempotency key. Capturing intent gives the implementation enough information to replay, rebase, reject, or ask for human resolution after reconnect.
        </p>
        <p>
          The second concept is capability-aware degradation. Browser online status, service worker availability, storage access, push permission, background sync support, and server reachability are separate signals. A robust runtime combines them into a health state instead of making one boolean decide the user experience. This is especially important on mobile browsers, private browsing modes, captive portals, enterprise proxies, and low-memory devices.
        </p>
        <p>
          The third concept is convergence with evidence. The system should know which local operations are pending, which server acknowledgements have been received, which conflicts were auto-merged, and which conflicts were shown to the user. The durable structures are active probe result, browser signal, request failure window, circuit state, user banner model, retry budget. These structures are the difference between a demo and a production design that can survive reloads, retries, and support investigations.
        </p>
        <h3>Implementation contract</h3>
        <p>
          The runtime should define which calls are synchronous, which are asynchronous, which require storage, and which can be safely retried. Public methods should return typed outcomes such as accepted, queued, blocked, conflicted, degraded, or rejected. They should not expose raw browser exceptions to product components because those components cannot make consistent decisions across browsers and network states.
        </p>
        <p>
          Local state must be scoped by user, tenant, device, app version, and feature flag where applicable. Without that scope, an offline cache can leak data after account switch, replay old writes under a new identity, or resurrect a feature that has been remotely disabled. A principal-level answer should call this out because offline UX and privacy are tightly coupled.
        </p>
        <h3>Operation classes</h3>
        <p>
          Not every operation deserves the same offline behavior. Draft edits, UI preferences, and local annotations can usually be accepted locally and reconciled later. Inventory reservations, payments, permission changes, and destructive admin actions should either require server confirmation or use a narrow pending state that cannot be mistaken for completion. Classifying operations early keeps the design from promising offline availability where the business invariant requires server authority.
        </p>
        <p>
          Each operation class should define durability, replay, merge, rollback, and privacy rules. A draft update may store the full payload locally, while a sensitive workflow may store only a redacted intent and require reauthentication before replay. A push notification preference may require consent state and device token freshness. A progressive enhancement may require a baseline fallback rather than persistence. These distinctions make the design defendable under interviewer pressure.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has six layers. The interaction layer captures the user action and assigns an operation identity. The local durability layer writes intent to IndexedDB, Cache Storage, or a scoped in-memory fallback before showing success-like UI. The health coordinator classifies network and capability state. The sync engine drains eligible operations using idempotency keys and retry budgets. The conflict engine compares base, local, and remote versions. The presentation layer shows current, stale, queued, conflicted, or blocked state with accessible controls.
        </p>
        <p>
          The normal flow starts with the user action entering the facade. The facade validates scope, writes an intent record, updates the local projection, and emits a snapshot. If the system is healthy, the sync engine sends the operation immediately. If the system is offline or degraded, the operation remains queued and visible. When connectivity returns, the engine drains operations in dependency order, applies server acknowledgements, compacts acknowledged records, and moves conflicts to a review state instead of silently overwriting data.
        </p>
        <p>
          The design should treat reconnect as a reconciliation phase, not just a retry trigger. Reconnect can reveal schema changes, expired auth, revoked permissions, server-side validation changes, or remote edits. The runtime must revalidate credentials, refresh configuration, migrate local data, and compare versions before replaying writes. That extra work is what prevents offline UX from becoming a data integrity risk.
        </p>
        <h3>Data model and invariants</h3>
        <p>
          A practical data model contains a local entity table, an operation log, a server acknowledgement ledger, a sync cursor, and a projection table optimized for rendering. The entity table answers current reads. The operation log preserves intent. The acknowledgement ledger prevents duplicate replay after reload. The sync cursor supports incremental server pulls. The projection table lets the UI show local and remote facts together without recomputing the whole world on every render.
        </p>
        <p>
          Invariants should be asserted at every boundary. An operation cannot be compacted until its acknowledgement is durable. A conflict cannot be marked resolved until the chosen resolution passes validation against the latest server version. A notification cannot be routed until permission and preference state agree. An enhanced experience cannot replace the baseline path unless the core task still completes when the enhancement fails.
        </p>
        <h3>Failure matrix</h3>
        <p>
          The implementation should maintain a failure matrix that maps cause to action. Storage quota failure moves the feature to read-only or in-memory pending state. Expired auth blocks replay and asks for reauthentication. Version mismatch enters conflict review or rebase. API timeout keeps the operation queued with backoff. Unsupported capability falls back to the baseline experience. Permission denial changes the prompt strategy and prevents repeated prompting. Each branch should be observable and user-visible enough to avoid silent data loss.
        </p>
        <p>
          Reconciliation should be transactional from the client&apos;s point of view. Pull the latest remote metadata, validate local schema, check auth and tenant scope, choose eligible operations, send them with idempotency keys, persist acknowledgements, update local projections, and only then compact. If the browser closes in the middle, the next boot should resume from durable evidence rather than guessing which work completed.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/network-status-detection-reconciliation.svg"
          alt="Design Network Failure Handling reconciliation and failure model"
          caption="Reconciliation model: local intent, remote version, permissions, and capability signals converge through explicit guardrails rather than hidden retries."
        />
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          A network-first design is simpler and easier to reason about because the server remains the immediate source of truth. It breaks down when users expect creation, editing, reading, or notification management to keep working during poor connectivity. An offline-first design improves perceived reliability, but it moves consistency, privacy, storage limits, and conflict resolution into the client. The right choice depends on whether the task is critical enough to justify that client complexity.
        </p>
        <p>
          The key consistency trade-off is multi-signal health classification with bounded retries and user-visible degraded mode. Strong consistency would block more actions until the server confirms them, reducing merge complexity but hurting availability. Eventual consistency keeps the user moving, but it requires durable intent, visible pending state, replay safety, and conflict handling. For principal interviews, the strongest answer is to pick consistency per operation: low-risk drafts can be queued, destructive operations may require confirmation, and security-sensitive changes should fail closed.
        </p>
        <p>
          There is also a cost trade-off. More local durability increases storage use, migration burden, and privacy review surface. More aggressive retries improve time-to-sync but risk retry storms and battery drain. More detailed conflict visualization improves trust but slows the user down. These are not abstract trade-offs; they should map to metrics such as queue age, conflict rate, replay success rate, storage quota errors, retry count, stale view duration, and user abandonment during conflict resolution.
        </p>
        <p>
          A principal-level answer should also compare optimistic completion with explicit pending completion. Optimistic completion feels fast, but it can mislead the user when the server later rejects the operation. Explicit pending completion is more honest, but it can make the product feel slower. The compromise is to make low-risk operations appear locally complete while preserving a visible sync status and to keep high-risk operations in a pending or blocked state until the authoritative system confirms them.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Persist intent before optimistic UI when the operation matters. If the UI updates first and the tab closes before durability, the user will believe work was saved when it was not. For lower-risk interactions, an in-memory pending state may be acceptable, but the UI should not imply durable completion until the write has crossed the chosen durability boundary.
        </p>
        <p>
          Use idempotency keys and monotonic local sequence numbers for replay. Assume the client may send the same operation more than once after reload, timeout, service worker restart, or ambiguous server response. Server APIs should accept the idempotency key and return the prior result when replay is duplicated. Client code should still keep an acknowledgement ledger so it can compact safely.
        </p>
        <p>
          Design user-visible states deliberately. A subtle banner, disabled action, merge review sheet, retry affordance, or stale data indicator should correspond to a real runtime state. Avoid generic &quot;something went wrong&quot; messaging for offline flows because the corrective action differs: wait, retry, reconnect, reauthenticate, resolve conflict, or discard local changes.
        </p>
        <p>
          Build observability into the client. Track queue depth, oldest pending operation age, storage quota failures, conflict types, retry budget exhaustion, permission prompt outcomes, and degraded-mode duration. These metrics tell whether the offline design is protecting the journey or creating hidden support debt.
        </p>
        <p>
          Test with deterministic adapters. Replace timers, network probes, storage, service worker messages, permission prompts, and clocks with test doubles so edge cases can be reproduced. Important tests include reload after enqueue, duplicate acknowledgement, storage write failure, conflict after reconnect, account switch with pending operations, schema migration during offline edit, and retry exhaustion while the UI remains mounted.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is using a single online boolean as the system truth. Browser connectivity APIs are hints, not guarantees. A device can be online but unable to reach your API, authenticated but forbidden to replay an old mutation, or capable of service workers but blocked from persistent storage. The runtime needs active probes and failure classification.
        </p>
        <p>
          Another pitfall is silently resolving conflicts with last-write-wins. That policy is acceptable for low-value telemetry or ephemeral preferences, but it is dangerous for collaborative documents, settings, payments, and enterprise workflows. If user intent is ambiguous, surface the conflict with enough context to choose, preview, and audit the resolution.
        </p>
        <p>
          Teams also underinvest in migration and cleanup. Offline stores live longer than a page session. Schema changes, feature removal, auth changes, and tenant switching all need migration or quarantine paths. Without cleanup, local data becomes a privacy risk and sync performance degrades as obsolete operations accumulate.
        </p>
        <p>
          Another common mistake is hiding stale state behind normal UI. If the user cannot tell whether they are seeing fresh server data, local pending data, or a conflicted projection, they cannot make a safe decision. The UI does not need to be noisy, but it must show the right affordance at the right time: sync pending, retry, conflict review, read-only, permission required, or stale data.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Offline and advanced UX patterns appear in field-service apps, document editors, dashboards, e-commerce carts, travel products, creator tools, messaging interfaces, and enterprise admin consoles. The common thread is that a user journey crosses unreliable boundaries: network, storage, permissions, browser capability, or multi-device state.
        </p>
        <p>
          In a staff or principal role, this design is often a platform concern. Product teams provide domain operations and conflict policy, while the platform runtime owns durable queues, capability detection, replay, conflict surfaces, privacy scoping, and instrumentation. That split prevents each feature from inventing its own fragile offline behavior.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3>How would you design this system end to end?</h3>
        <p>
          I would start with the user journey and classify which operations must work offline, which can be read-only, and which must fail closed. Then I would define the facade API, durable intent model, health coordinator, sync engine, conflict engine, and presentation states. The implementation would persist operation records with idempotency keys, update a local projection, drain the queue when healthy, reconcile against remote versions, and surface conflicts when the merge policy cannot preserve intent safely.
        </p>
        <h3>Why this architecture over a simple retry wrapper?</h3>
        <p>
          A retry wrapper handles transient failures for one request. It does not preserve user intent across reloads, classify capability failures, prevent duplicate replay, compare base and remote versions, or show conflict states. This architecture is heavier, but it solves the full lifecycle: capture, durability, replay, reconciliation, compaction, and user-visible recovery.
        </p>
        <h3>What breaks at scale?</h3>
        <p>
          Queue depth, storage quota, schema migration, conflict volume, battery usage, retry storms, and support visibility become the pressure points. The design needs compaction, retry budgets, backoff with jitter, storage quotas, migration versioning, per-operation metrics, and admin tools or logs that explain why a local operation was blocked or conflicted.
        </p>
        <h3>What consistency model applies?</h3>
        <p>
          Most offline UX uses eventual consistency for user intent and stronger consistency for safety-sensitive operations. The client can be locally authoritative for drafts, pending edits, and cached reads, but the server remains authoritative for permissions, payment state, inventory, and shared records. The runtime should encode that difference per operation instead of pretending one consistency model fits every action.
        </p>
        <h3>How do you handle failure, rollback, abuse, privacy, cost, and observability?</h3>
        <p>
          Failure is handled with typed states and replay policies. Rollback uses inverse patches or conflict review when an optimistic projection cannot be committed. Abuse is controlled with idempotency, rate limits, permission checks before replay, and feature flags that can disable unsafe queues. Privacy is handled through user and tenant scoping, encryption where appropriate, cache cleanup, and avoiding sensitive payloads in telemetry. Cost is controlled through compaction, bounded retries, and selective caching. Observability tracks queue age, replay outcomes, conflicts, storage errors, and degraded-mode duration.
        </p>
        <h3>How would you defend the trade-offs under pressure?</h3>
        <p>
          I would state that the design optimizes for task continuity without hiding correctness risk. If the interviewer pushes on complexity, I would narrow offline support to critical operations and keep risky operations server-confirmed. If they push on consistency, I would separate local availability from server authority. If they push on privacy, I would explain scoped storage, cleanup, and fail-closed replay checks. Then I would walk through the hard edge case: navigator.onLine says online while the API is unreachable behind a captive portal or regional outage.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" target="_blank" rel="noreferrer">MDN Service Worker API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" target="_blank" rel="noreferrer">MDN IndexedDB API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API" target="_blank" rel="noreferrer">MDN Background Synchronization API</a></li>
          <li><a href="https://web.dev/learn/pwa/" target="_blank" rel="noreferrer">web.dev Progressive Web Apps guidance</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" target="_blank" rel="noreferrer">MDN Notifications API</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

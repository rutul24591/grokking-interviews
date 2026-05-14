"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-retry-failure-recovery-ux",
  title: "Design a Retry & Failure Recovery UX",
  description:
    "Architecture for a production retry and failure recovery system: exponential backoff with full jitter, idempotency keys per mutation, client-side circuit breaker (closed / open / half-open), IndexedDB offline queue with Service Worker replay, optimistic UI rollback, countdown retry UI, degraded-mode banners, and automatic session restoration on reconnect.",
  category: "high-level-design",
  subcategory: "error-handling-reliability-systems",
  slug: "retry-failure-recovery-ux",
  wordCount: 4900,
  readingTime: 28,
  lastUpdated: "2026-05-14",
  tags: ["hld", "retry", "circuit-breaker", "offline-queue", "idempotency", "reliability", "ux"],
  relatedTopics: ["global-error-handling-fallback-ui", "incident-debugging-dashboard"],
};

export default function RetryFailureRecoveryUxArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Modern web applications make dozens of API calls per user session. When
          those calls fail—due to transient network blips, backend deployments,
          rate limiting, or partial outages—the application must decide how to
          respond. The naive answer (show an error message and give up) is almost
          always wrong: most failures are temporary, and users who see a clear
          retry path are far more likely to complete their intended action than
          users who see a dead end.
        </HighlightBlock>
        <p>
          The challenge is building retry and recovery logic that is:
        </p>
        <ul>
          <li>
            <strong>Safe:</strong> Mutations must not be applied twice. An order
            submitted during a retry must not result in two orders being placed.
          </li>
          <li>
            <strong>Transparent:</strong> Users must understand what is happening:
            is the system retrying automatically? Is their data saved? When will it
            recover?
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Self-limiting:</strong> Aggressive retry loops can amplify a
            degraded service into a full outage by overwhelming it with repeated
            requests from thousands of clients simultaneously.
          </HighlightBlock>
          <li>
            <strong>Persistent:</strong> For users on flaky connections, a mutation
            (a posted comment, a form submission) must survive a complete browser
            close and reconnect.
          </li>
        </ul>
        <p>Clarify scope:</p>
        <ul>
          <HighlightBlock as="li" tier="important">
            Which request types are retried? Read-only GET requests are always safe
            to retry; mutations require idempotency keys.
          </HighlightBlock>
          <li>
            What is the max retry budget? 3 auto-retries is the standard ceiling;
            unlimited manual retries by user action.
          </li>
          <li>
            Should the offline queue survive page refresh? (IndexedDB yes;
            sessionStorage no.)
          </li>
          <li>
            How is the circuit breaker state shared across browser tabs? (BroadcastChannel
            or SharedWorker.)
          </li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3>Functional</h3>
        <ul>
          <li>
            Failed retryable requests are automatically retried up to 3 times using
            exponential backoff with full jitter.
          </li>
          <li>
            Mutations carry a client-generated idempotency key; the server uses this
            key to deduplicate retried requests.
          </li>
          <HighlightBlock as="li" tier="important">
            A client-side circuit breaker tracks failure rate per API endpoint;
            after the threshold is exceeded, requests are blocked and queued rather
            than sent, protecting a degraded server.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            Mutations that fail after all retries (or while the circuit is open) are
            persisted to an IndexedDB offline queue. A Service Worker replays the
            queue when connectivity is restored.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            The UI shows real-time recovery state: retry countdown, degraded-mode
            banner, queue depth, and confirmation when sync completes.
          </HighlightBlock>
          <li>
            Optimistic UI updates are rolled back if all retries fail and the
            mutation is queued for offline replay.
          </li>
        </ul>
        <h3>Non-functional</h3>
        <ul>
          <li>
            <strong>Retry spread:</strong> Full jitter prevents thundering-herd
            stampedes when many clients fail simultaneously.
          </li>
          <li>
            <strong>Queue durability:</strong> IndexedDB persists across page
            reloads and browser restarts.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Circuit isolation:</strong> Circuit breaker state is per-origin
            (or per-API-prefix), not global, so a slow payment endpoint does not
            block a fast profile endpoint.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Privacy:</strong> The offline queue must encrypt sensitive
            payloads (e.g., financial data) using the Web Crypto API before writing
            to IndexedDB.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/error-handling-reliability-systems/retry-failure-recovery-ux.svg"
          alt="Retry and Failure Recovery UX sequence diagram"
          caption="Request failure → exponential backoff retry → circuit breaker check → offline queue → Service Worker replay on reconnect"
        />
        <p>The system has four stages:</p>
        <ol>
          <HighlightBlock as="li" tier="important">
            <strong>Failure detection:</strong> The fetch interceptor catches
            failures and routes them to the Retry Manager with metadata about the
            request (endpoint, method, idempotency key, retry budget).
          </HighlightBlock>
          <li>
            <strong>Retry with backoff:</strong> The Retry Manager consults the
            circuit breaker, then schedules retries using exponential backoff with
            jitter. The UI shows a countdown per attempt.
          </li>
          <li>
            <strong>Offline queue:</strong> If retries are exhausted or the circuit
            is open, the mutation is persisted to IndexedDB. The optimistic UI
            update is reverted to a pending state.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Recovery:</strong> A Service Worker detects reconnection and
            replays queued mutations in FIFO order. On success, the circuit breaker
            transitions to closed and the UI confirms sync.
          </HighlightBlock>
        </ol>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3>Fetch Interceptor Layer</h3>
        <p>
          All API calls flow through a central fetch wrapper (or an Axios
          interceptor) rather than calling <code>fetch</code> directly. The wrapper:
        </p>
        <ul>
          <li>
            Generates a UUID idempotency key for every non-GET request and attaches
            it as an <code>Idempotency-Key</code> header.
          </li>
          <li>
            Tags the request with metadata: endpoint prefix (for circuit breaker
            scoping), retry budget, timeout, and whether the request is retryable
            (non-idempotent unsafe operations without explicit opt-in are not
            retried).
          </li>
          <li>
            Implements a timeout via <code>AbortController</code> (default: 10
            seconds). A timed-out request is treated the same as a network error.
          </li>
          <li>
            Consults the circuit breaker before issuing the request. If the circuit
            is OPEN, the request is immediately enqueued to the offline queue
            without hitting the network.
          </li>
        </ul>

        <h3>Idempotency Key Strategy</h3>
        <p>
          The idempotency key is the cornerstone of safe retry. Design constraints:
        </p>
        <ul>
          <li>
            <strong>Per-intent, not per-request:</strong> The same key must be used
            across all retry attempts for the same user action. The key is generated
            once when the user triggers the action, not once per HTTP call.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Stable across page refresh:</strong> For mutations that enter
            the offline queue (and may be replayed after a reload), the key is
            stored alongside the payload in IndexedDB.
          </HighlightBlock>
          <li>
            <strong>Server enforcement:</strong> The server stores completed
            idempotency keys in a Redis set with a 24-hour TTL. On receiving a
            duplicate key, it returns the original response body with HTTP 200
            rather than re-executing the operation.
          </li>
        </ul>
        <p>
          Key format: <code>&#123;userId&#125;:&#123;resource&#125;:&#123;uuid-v4&#125;</code> — scoping the
          key to the user prevents cross-user collisions in multi-tenant APIs.
        </p>

        <h3>Exponential Backoff with Full Jitter</h3>
        <p>
          The retry schedule uses truncated exponential backoff with full jitter:
        </p>
        <ul>
          <li>
            <code>delay = random(0, min(cap, base × 2^attempt))</code>
          </li>
          <li>
            Default values: <code>base = 1000 ms</code>, <code>cap = 8000 ms</code>,
            max 3 attempts.
          </li>
          <li>
            Attempt 1: <code>random(0, 1000) ms</code> (~0–1 s)
          </li>
          <li>
            Attempt 2: <code>random(0, 2000) ms</code> (~0–2 s)
          </li>
          <li>
            Attempt 3: <code>random(0, 4000) ms</code> (~0–4 s)
          </li>
        </ul>
        <p>
          Full jitter (uniform random within the window) is strictly better than
          equal jitter or decorrelated jitter for preventing synchronised retry
          waves. When 10,000 clients all encounter the same 503 at the same time
          and retry with identical backoff, they create secondary waves of load.
          Full jitter distributes those retries uniformly across the window,
          smoothing the load curve.
        </p>
        <p>
          Between attempts the UI shows a progress bar countdown:{" "}
          <code>&quot;Retrying in 1.8s (attempt 2 of 3) — Cancel&quot;</code>. The cancel
          button stops the retry loop and routes the user to the manual fallback
          UI, respecting their agency.
        </p>

        <h3>Client-Side Circuit Breaker</h3>
        <HighlightBlock as="p" tier="important">
          The circuit breaker prevents the client from continuously hammering a
          degraded endpoint. It is implemented as a state machine per API endpoint
          prefix (e.g., <code>/api/payments/*</code>):
        </HighlightBlock>
        <ul>
          <li>
            <strong>CLOSED (healthy):</strong> All requests pass through. Failure
            counter is incremented on each error; reset to 0 on success. Transitions
            to OPEN when: 5 failures in a 30-second sliding window.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>OPEN (tripping):</strong> All requests are immediately rejected
            (no network call). Requests are optionally enqueued for offline replay.
            The UI shows a degraded-mode banner. Transitions to HALF-OPEN after a
            60-second cooldown.
          </HighlightBlock>
          <li>
            <strong>HALF-OPEN (probing):</strong> One probe request is allowed
            through. If it succeeds, transition to CLOSED and flush the offline
            queue. If it fails, reset the 60-second cooldown and return to OPEN.
          </li>
        </ul>
        <p>
          The circuit breaker state is held in memory for the current tab and
          synchronised across tabs via <code>BroadcastChannel</code>. This prevents
          one tab from repeatedly opening a circuit that another tab already tripped.
        </p>
        <p>
          Circuit breaker parameters are configurable per endpoint prefix:{" "}
          <code>&#123; threshold: 5, window: 30000, cooldown: 60000 &#125;</code>. A slow
          third-party analytics endpoint may have a higher threshold and shorter
          cooldown than the core payments endpoint.
        </p>

        <h3>Offline Queue with IndexedDB</h3>
        <HighlightBlock as="p" tier="important">
          When a mutation fails all retries or is blocked by the circuit breaker,
          it is persisted to an IndexedDB store named <code>offline-queue</code>
          with the schema:
        </HighlightBlock>
        <ul>
          <li>
            <code>id</code> — auto-increment (determines replay order).
          </li>
          <li>
            <code>idempotencyKey</code> — the stable key for deduplication.
          </li>
          <li>
            <code>endpoint</code>, <code>method</code>, <code>headers</code> —
            enough to reconstruct the request.
          </li>
          <li>
            <code>encryptedPayload</code> — the request body encrypted with a
            session-derived AES-GCM key (Web Crypto API). Protects sensitive data
            at rest in IndexedDB.
          </li>
          <li>
            <code>enqueuedAt</code> — timestamp for TTL enforcement (entries &gt;72
            hours old are discarded without replay on reconnect).
          </li>
          <li>
            <code>retryCount</code> — replay attempts; gives up after 3 failed
            replays.
          </li>
        </ul>
        <p>
          The queue is processed in strict FIFO order to maintain causal
          consistency: a comment reply must not be sent before the comment it
          replies to.
        </p>

        <h3>Service Worker Replay</h3>
        <HighlightBlock as="p" tier="important">
          A Service Worker listens for the <code>sync</code> event (Background
          Sync API) with the tag <code>offline-queue-replay</code>. On connectivity
          restoration:
        </HighlightBlock>
        <ol>
          <li>
            The SW reads all entries from IndexedDB in ascending ID order.
          </li>
          <li>
            For each entry: decrypt the payload, reconstruct the request, and send
            it with the stored idempotency key.
          </li>
          <li>
            On 200/201: delete the entry from IndexedDB.
          </li>
          <li>
            On 4xx (permanent failure): delete the entry, log to error reporter.
          </li>
          <li>
            On 5xx / timeout: increment <code>retryCount</code>; if &lt;3, defer to
            the next sync event; if &ge;3, move to a dead-letter store for manual
            review.
          </li>
        </ol>
        <p>
          Background Sync has a browser-enforced retry mechanism that persists even
          if the user closes the tab or navigates away. On browsers that do not
          support Background Sync (Firefox stable as of 2024), the SW falls back to
          polling <code>navigator.onLine</code> every 5 seconds.
        </p>

        <h3>Optimistic UI Rollback</h3>
        <p>
          Mutations apply optimistic updates immediately on user action: the UI
          renders the expected post-success state before the server confirms. This
          creates a responsive feel. The state manager (Redux, Zustand, or React
          Query) keeps a rollback snapshot:
        </p>
        <ol>
          <li>
            Before mutation: capture current state snapshot keyed by the
            idempotency key.
          </li>
          <li>
            On success: discard the snapshot.
          </li>
          <HighlightBlock as="li" tier="important">
            On final failure (all retries exhausted, queued offline): apply the
            rollback snapshot to restore pre-mutation state. Show a{" "}
            &ldquo;Saved offline — will sync when reconnected&rdquo; message so the user
            understands their change is not lost, merely deferred.
          </HighlightBlock>
        </ol>
        <p>
          The distinction between rollback (mutation failed permanently) and pending
          (mutation queued for offline replay) is surfaced differently in the UI:
          rollback shows a visible undo; pending shows a sync indicator on the
          affected item.
        </p>

        <h3>Degraded-Mode UI Patterns</h3>
        <HighlightBlock as="p" tier="important">
          When the circuit is OPEN or the offline queue depth exceeds 5 items, the
          UI switches to degraded-mode presentation:
        </HighlightBlock>
        <ul>
          <li>
            A persistent banner at the top:{" "}
            <em>&ldquo;Service disrupted — your changes are being saved locally and
            will sync automatically.&rdquo;</em> With a queue depth indicator:{" "}
            <em>&ldquo;3 changes pending sync.&rdquo;</em>
          </li>
          <li>
            Interactive elements that would trigger queued mutations show a
            loading/pending icon rather than being disabled. Users can still
            interact; the queue depth increases.
          </li>
          <li>
            Read-only operations continue normally (served from local cache or CDN).
          </li>
          <li>
            On circuit recovery, the banner transitions:{" "}
            <em>&ldquo;Connection restored — syncing 3 changes…&rdquo;</em> then{" "}
            <em>&ldquo;All changes synced.&rdquo;</em> (auto-dismisses after 3 seconds).
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs and Alternatives</h2>
        <h3>Client-Side vs. Server-Side Circuit Breaker</h3>
        <HighlightBlock as="p" tier="crucial">
          Server-side circuit breakers (Hystrix, Resilience4j) protect downstream
          services from each other. Client-side circuit breakers protect the server
          from client retry storms and protect the user from wasting time on a
          degraded endpoint. Both are necessary in a resilient system. The
          client-side breaker is particularly important in browser apps because
          there may be millions of concurrent clients—each one retrying at its own
          interval creates a distributed load amplification that server-side
          breakers cannot see.
        </HighlightBlock>

        <h3>IndexedDB vs. localStorage for Queue Persistence</h3>
        <HighlightBlock as="p" tier="important">
          localStorage is synchronous and limited to ~5 MB with string-only values.
          Storing queued mutations in localStorage risks blocking the main thread on
          large payloads and hitting the size limit with many queued items.
          IndexedDB is async, supports binary data, has no practical size limit, and
          works with the Background Sync API. The only advantage of localStorage is
          that it is universally supported and simpler to implement—acceptable for
          queues of small payloads with low expected depth.
        </HighlightBlock>

        <h3>Background Sync vs. Manual Reconnect Polling</h3>
        <HighlightBlock as="p" tier="crucial">
          Background Sync (via Service Worker) is the gold standard: it persists
          across tab close and is managed by the browser&rsquo;s connection scheduler.
          The limitation is browser support (Chrome/Edge full; Firefox partial;
          Safari none as of mid-2024). For Safari users, the fallback is a{" "}
          <code>window.addEventListener(&apos;online&apos;, replay)</code> event listener plus
          a 5-second polling interval while the tab is open. The queue contents
          survive between tab sessions (IndexedDB persists) but replay only happens
          while a tab is open in Safari.
        </HighlightBlock>

        <h3>Per-Request vs. Per-Session Idempotency Keys</h3>
        <HighlightBlock as="p" tier="important">
          Per-request keys (UUID generated on first attempt, reused across retries)
          are the standard approach. Per-session keys (based on user intent, e.g.,
          the content of a form) are more semantically meaningful but harder to
          derive uniquely. The risk of per-session keys is accidental key reuse if
          the user submits the same content twice intentionally. Per-request UUID
          keys are the safer default; per-session keys are appropriate for specific
          idempotency-by-content use cases (e.g., deduplicating payment
          submissions).
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          A production retry and failure recovery system is built on four pillars:
          safe retries (idempotency keys prevent double-mutation), intelligent
          backoff (full jitter prevents thundering herd), circuit breaking (prevents
          overloading degraded services), and durable offline queuing (preserves
          user intent across reconnects). The UX layer is equally important: users
          must understand what is happening (countdown, pending indicators, degraded
          banners) and must be able to cancel or inspect queued operations. At staff
          level, the critical insight is that retry is not a simple &ldquo;try again&rdquo;
          loop—it is a distributed system concern that, if implemented carelessly,
          can turn a partial outage into a total one.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

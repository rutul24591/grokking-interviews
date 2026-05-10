"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-cross-tab-state-sync",
  title: "Cross-Tab State Sync System",
  description:
    "Synchronizing application state across multiple browser tabs/windows with conflict resolution and real-time updates.",
  category: "low-level-design",
  subcategory: "state-interaction-modeling",
  slug: "cross-tab-state-sync",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "cross-tab", "state-sync", "broadcast-channel", "local-storage"],
  relatedTopics: ["global-event-bus", "state-hydration-rehydration"],
};

export default function CrossTabStateSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Modern users routinely open web applications in multiple tabs simultaneously. When a user logs in on Tab A, Tab B still shows the login page. When they add an item to a cart on Tab A, Tab B's cart badge remains stale. When a session expires, only the tab where the expiry was detected redirects to login — the rest silently operate on an invalid session until the next request fails with a 401.
        </p>
        <p>
          Cross-tab state synchronization solves this by establishing a messaging channel between same-origin browsing contexts. The challenge is doing it efficiently: not every state change warrants broadcasting (typing in a search box doesn't need to appear in other tabs), conflicts must be detected when two tabs independently modify the same data, and the solution must degrade gracefully in environments where modern APIs are unavailable.
        </p>
        <p>
          The problem extends beyond simple "notify other tabs" — a tab that was minimized for 30 minutes may have missed many updates and needs to reconcile its local state on re-focus. A tab may broadcast an update while another tab is in the middle of a form submission. The channel itself is synchronous from a messaging perspective but tabs process messages asynchronously, introducing subtle ordering issues.
        </p>
        <p>
          <strong>Explicit assumptions:</strong> All tabs share the same origin (cross-origin is not addressable with BroadcastChannel). State changes are discrete, identifiable events — not continuous streams. Conflicts are infrequent in most applications (auth and notifications are the primary sync targets). The server remains the authoritative source of truth for persistent state; cross-tab sync is a UX optimization, not a consistency guarantee.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Broadcast:</strong> When Tab A mutates shared state (auth, cart, notifications), immediately publish the delta to all other open tabs on the same origin.
          </li>
          <li>
            <strong>Receive and Apply:</strong> Receiving tabs apply the delta to their local store without triggering a server roundtrip.
          </li>
          <li>
            <strong>Conflict Detection:</strong> If two tabs independently mutate the same state slice within a short window, detect the conflict using version vectors or timestamps.
          </li>
          <li>
            <strong>Conflict Resolution:</strong> Resolve conflicts automatically (last-write-wins, server-wins) or surface a prompt when user intent cannot be inferred.
          </li>
          <li>
            <strong>Selective Sync:</strong> Only synchronize explicitly whitelisted state slices — UI-local state (modal open, scroll position) must never broadcast.
          </li>
          <li>
            <strong>Catch-up on Focus:</strong> A tab returning from background/minimized state should request a full state snapshot from the leading tab.
          </li>
          <li>
            <strong>Leader Election:</strong> One tab acts as the primary communicator with the server; other tabs sync through it to avoid duplicate polling/WebSocket connections.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Latency:</strong> A state change in Tab A must appear in Tab B within 50–100ms (BroadcastChannel delivers near-synchronously; the overhead is message serialization and React re-render).
          </li>
          <li>
            <strong>Throughput:</strong> Must handle bursts of 100+ state changes per second without message loss (e.g., rapid-fire notifications arriving over WebSocket).
          </li>
          <li>
            <strong>Reliability:</strong> No silent message drops. If a tab closes mid-broadcast, other tabs continue operating correctly.
          </li>
          <li>
            <strong>Memory overhead:</strong> The message queue and version history must not grow unboundedly — prune after acknowledgment or TTL.
          </li>
          <li>
            <strong>Browser compatibility:</strong> BroadcastChannel is supported in all modern browsers (Chrome 54+, Firefox 38+, Safari 15.4+). Must fall back to Storage events for older targets.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Tab closed while another tab is waiting for a SYNC_RESPONSE — must timeout and fall back to fetching from server.</li>
          <li>Two tabs simultaneously broadcast conflicting auth state (e.g., one logs out, one refreshes token).</li>
          <li>Tab opens after the others have accumulated significant state history — needs full snapshot, not just deltas.</li>
          <li>Private/incognito tabs — localStorage may be isolated; BroadcastChannel still works within the same incognito window group.</li>
          <li>Multiple origins or iframes — BroadcastChannel is strictly same-origin; embedded third-party iframes cannot participate.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The primary mechanism is BroadcastChannel, a native browser API that creates a named message bus among all browsing contexts on the same origin. Every tab opens the same named channel on initialization. State management middleware intercepts mutations, serializes a delta message (type, payload, version, senderId), and posts it to the channel. Other tabs receive it via their onmessage handler, validate the version, and apply the delta to their local store.
        </p>
        <p>
          For environments where BroadcastChannel is unavailable (Safari pre-15.4, legacy Electron shells), localStorage events serve as a fallback. Writing a serialized event to a well-known localStorage key triggers a storage event in all other tabs. This approach is inherently lossy for rapid updates (writes overwrite before read) so a queue key with a counter suffix is used when backpressure is needed.
        </p>
        <p>
          Leader election using SharedWorker or a lightweight localStorage-based heartbeat allows one tab to own server communication (polling, WebSocket connection) and relay server-push events to other tabs, preventing N×connections for N open tabs.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-interaction-modeling/cross-tab-state-sync.svg"
          alt="Cross-tab state sync showing BroadcastChannel API, localStorage storage event fallback, SharedWorker, critical sync scenarios, and conflict handling"
          caption="Cross-tab state sync showing BroadcastChannel API, localStorage storage event fallback, SharedWorker, critical sync scenarios, and conflict handling"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">BroadcastChannel API Deep Dive</h3>
        <p>
          BroadcastChannel is a publish-subscribe mechanism within the browser process. All tabs on the same origin that construct a BroadcastChannel with the same name automatically join the same logical channel. Messages are delivered to all contexts except the sender — no echo back to the originating tab.
        </p>
        <p>
          Message delivery is synchronous in the sense that posted messages are queued and delivered in FIFO order for each recipient tab. However, processing is asynchronous relative to the sender — the sender does not block. The structured clone algorithm is used for serialization, meaning you can pass complex objects (including ArrayBuffers) without manual JSON serialization, though for interop and debugging, explicit JSON is often preferred.
        </p>
        <p>
          Each message should carry: a type discriminant (AUTH_STATE_CHANGED, CART_UPDATED, NOTIFICATION_ARRIVED), the payload delta, a senderTabId (a UUID generated once per tab lifecycle stored in sessionStorage), a version or sequence number, and a timestamp. The senderTabId allows receiving tabs to track causality and avoid processing their own reflected messages in fallback scenarios.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Management Middleware Integration</h3>
        <p>
          The sync layer integrates as middleware in the state management stack (Redux middleware, Zustand subscribe, Jotai atom effect). Rather than requiring every action to manually trigger broadcasts, the middleware layer observes all state mutations and decides whether to broadcast based on a whitelist configuration.
        </p>
        <p>
          The configuration specifies which state slices participate in cross-tab sync, the debounce interval for each slice, and the conflict resolution strategy. For auth state (changes are critical and infrequent), debounce is zero. For cart state (may change on item quantity adjustments), a 200ms debounce prevents flooding.
        </p>
        <p>
          When the middleware broadcasts, it sends a delta rather than the full state: only the changed keys within the slice, along with the new values. This minimizes message size and reduces the risk of inadvertently overwriting changes the receiving tab made between the time the sender read its own state and the time the message arrives.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version Vectors and Conflict Detection</h3>
        <p>
          A simple lamport clock (monotonically incrementing integer per tab) is sufficient for detecting ordering issues. Each tab maintains its own counter, increments on every mutation, and attaches the vector to outgoing messages. The receiving tab compares the incoming version against its own current version for that slice.
        </p>
        <p>
          If the incoming version is greater, the receiving tab applies the update and advances its own version to match. If the incoming version is equal or lower (can happen if two tabs mutate independently before either's broadcast arrives), a conflict is detected. The resolution strategy then kicks in: for auth state, the most recent logout always wins. For cart state, the server's reconciled state is fetched. For notification read state, merge (union of all read IDs wins — a read is never un-read by another tab's state).
        </p>
        <p>
          Full vector clocks (one entry per tab) provide stronger causality guarantees but are overkill for most front-end scenarios. They are worth considering in long-lived, heavy-editing sessions like collaborative document editors.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Catch-up on Tab Focus (Visibility API)</h3>
        <p>
          When a tab regains visibility (visibilityState changes from 'hidden' to 'visible'), it should assume its state may be stale. The protocol: the awakening tab broadcasts a SYNC_REQUEST message including its current version vector. Any responding tab that has a higher version for any slice responds with a SYNC_RESPONSE containing the authoritative snapshot of the relevant slices.
        </p>
        <p>
          If no response arrives within a timeout (500ms is reasonable), the tab falls back to fetching fresh state from the server. This handles the case where all other tabs were also background or closed.
        </p>
        <p>
          A complementary strategy is to track the "last confirmed server sync" timestamp. If the tab has been hidden for more than a threshold (e.g., 5 minutes), it skips the inter-tab catch-up entirely and directly refetches from the server, as other tabs' cached state may also be stale.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Leader Election for Server Communication</h3>
        <p>
          Opening a WebSocket connection or initiating a long-poll in every tab multiplies server load by the number of open tabs. Leader election designates one tab as the "leader" that holds the server connection; other tabs receive server push events relayed through BroadcastChannel.
        </p>
        <p>
          A simple localStorage-based election: the leader writes its tabId and a heartbeat timestamp every 5 seconds to a well-known key. Other tabs monitor this key. If the heartbeat is absent for 10 seconds, any tab can claim leadership by writing its own tabId. When the tab visibility API fires a beforeunload event, the leader voluntarily yields, triggering a new election.
        </p>
        <p>
          SharedWorker provides a more robust alternative: a worker instance shared across all tabs on the same origin. The worker holds a single WebSocket connection and routes incoming server events to all connected tabs. SharedWorker survives individual tab closes and requires only one WebSocket handshake. The limitation is SharedWorker is not available in Safari until version 16.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Storage Events Fallback</h3>
        <p>
          When BroadcastChannel is unavailable, writing to localStorage triggers a storage event in all same-origin browsing contexts except the writer (identical semantics to BroadcastChannel's no-echo behavior). To avoid overwrites, write each message to a unique key by appending a randomly generated identifier. A cleanup listener removes processed keys after a short TTL. This approach introduces more DOM overhead than BroadcastChannel and can be slower under rapid message bursts.
        </p>
        <p>
          An important caveat: localStorage storage events are not fired within the same tab that wrote the value, which means the fallback has the same "no self-delivery" behavior as BroadcastChannel. However, some implementations use a wrapper that does echo to self, useful for intra-tab testing without opening multiple windows.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Critical Sync Scenarios</h3>
        <p>
          <strong>Authentication synchronization</strong> is the most important scenario. On logout, Tab A must immediately invalidate all other tabs. On token refresh, the new token must be distributed to other tabs so they can continue making authenticated API calls without each tab independently triggering its own refresh (which would invalidate the others' tokens in a rotating-token scheme). The token refresh sync must be atomic: Tab A acquires a "refresh in progress" flag, completes the refresh, broadcasts the new token, then releases the flag.
        </p>
        <p>
          <strong>Shopping cart synchronization</strong> requires last-write-wins with optimistic merging. If Tab A adds item X and Tab B adds item Y independently (offline-style local mutations), both deltas should merge rather than overwrite. The merge strategy for shopping carts is typically additive: union of items. Conflicting quantities for the same item default to the higher value or prompt the user.
        </p>
        <p>
          <strong>Session timeout</strong> is handled by one tab detecting idle timeout and broadcasting a SESSION_EXPIRED event. All tabs simultaneously show the re-auth dialog or redirect to login, preventing the jarring experience of some tabs silently returning 401 errors on subsequent requests.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debouncing and Batching</h3>
        <p>
          High-frequency state changes (typing, dragging) must be debounced before broadcasting. Each syncable slice should have a configurable debounce interval. The debounce timer resets on each state change within the slice; after the interval passes without further changes, the accumulated delta is broadcast as a single message.
        </p>
        <p>
          For cases where multiple independent slices change simultaneously (a server response updates both user profile and notification count), they can be batched into a single BroadcastChannel message using a microtask queue. After the current synchronous execution completes, all queued slice updates are coalesced and sent as one structured message, reducing deserializing overhead on receiving tabs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Observability</h3>
        <p>
          Instrument the sync layer with metrics: message count per type per minute (identify unexpectedly high broadcast frequency), inter-tab latency measured by echoing a timestamp in the message and recording delta on receipt, conflict rate per slice (high conflict rate indicates UX problem — users are actively editing the same state from multiple tabs), and catch-up frequency (how often tabs need to sync on focus — high rates indicate tabs are frequently stale).
        </p>
        <p>
          Development tooling: a browser devtools panel showing the BroadcastChannel message stream is invaluable. Libraries like Zustand's devtools integration or a custom Redux middleware can log all cross-tab messages to the Redux DevTools extension, making it easy to replay multi-tab scenarios.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Immediacy vs Bandwidth</h3>
        <p>
          Broadcasting every state mutation provides the best UX consistency but generates high message volume for active applications. Debouncing reduces bandwidth at the cost of brief windows of inconsistency. The right balance is context-dependent: auth/session changes warrant zero debounce; typing indicators in a form warrant 500ms or more.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Selective vs Full Sync</h3>
        <p>
          A whitelist approach (explicitly opt state slices into sync) is safer than a blacklist (opt out). New state slices are not synced by default, preventing accidental leakage of ephemeral UI state (e.g., open modals, tooltip hover state) to other tabs where it would be meaningless or confusing.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server as Authority</h3>
        <p>
          Cross-tab sync is a performance and UX optimization, not a consistency guarantee. Any state that matters long-term (cart contents, user settings) must be persisted to the server. Cross-tab sync merely avoids requiring every tab to independently poll the server — it propagates already-committed server state or optimistic local mutations pending server confirmation. When a conflict cannot be resolved client-side, the server state wins.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security Boundaries</h3>
        <p>
          BroadcastChannel is same-origin-restricted, which provides a natural security boundary. However, any code running in the same origin (including third-party scripts loaded via script tags) can open the same channel and listen. Sensitive data in sync messages (token values, PII) should be minimized — broadcast the fact of a change rather than the sensitive value itself when possible. Tabs that need the actual value can fetch it from a secure httpOnly cookie or server endpoint.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Cross-tab state synchronization is a critical UX feature for any application users open in multiple windows simultaneously. The design centers on BroadcastChannel for direct low-latency inter-tab messaging, with localStorage Storage events as a fallback. State management middleware provides transparent sync with a whitelist configuration, debouncing, and version-based conflict detection. Leader election via SharedWorker or localStorage heartbeat prevents N×server connections. The Visibility API drives catch-up synchronization for backgrounded tabs. Critical scenarios — auth, session timeout, token rotation — require zero-debounce immediate broadcast. For staff-level engineers, the key insights are: treat cross-tab sync as an eventually consistent optimization over server truth, not a distributed system consistency guarantee; use version vectors for causality tracking; invest in merge strategies per state slice rather than one-size-fits-all last-write-wins; and instrument the sync layer for conflict rate and catch-up frequency metrics that reveal real UX problems.
        </p>
      </section>
    </ArticleLayout>
  );
}

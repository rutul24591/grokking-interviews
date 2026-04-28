"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-state-synchronization-concise",
  title: "State Synchronization Across Tabs",
  description: "Deep dive into cross-tab state synchronization covering BroadcastChannel, localStorage events, SharedWorker, and patterns for maintaining consistency across browser tabs.",
  category: "frontend",
  subcategory: "state-management",
  slug: "state-synchronization",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "state management", "BroadcastChannel", "SharedWorker", "cross-tab", "synchronization"],
  relatedTopics: ["state-persistence", "global-state-management", "optimistic-updates"],
};

export default function StateSynchronizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="important">
          <strong>State Synchronization Across Tabs</strong> refers to the set of browser APIs, patterns, and
          architectural strategies that keep application state consistent when users have multiple tabs or windows
          open to the same origin. In a world where users routinely operate dozens of tabs, an application that
          cannot propagate critical state changes -- authentication, theme preferences, shopping cart contents,
          or notification counts -- across all open instances creates a fragmented, unreliable experience.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Consider the consequences of ignoring cross-tab consistency. A user logs out in one tab but remains
          authenticated in another, potentially exposing sensitive data on a shared workstation. A customer adds
          items to a cart in one tab and sees a stale, empty cart in another, leading to duplicate purchases or
          abandoned sessions. A support agent working across multiple case tabs sees conflicting ticket statuses,
          eroding trust in the tool. These are not edge cases -- they represent the default behavior of any
          single-page application that treats each tab as an isolated runtime.
        </HighlightBlock>
        <p>
          The challenge is fundamentally one of distributed state management within a single browser. Each tab
          runs its own JavaScript execution context with its own memory heap. There is no shared memory model
          (outside of SharedArrayBuffer, which is designed for different use cases). Instead, developers must rely
          on message-passing primitives provided by the browser platform. The evolution of these primitives --
          from the original localStorage storage event to the modern BroadcastChannel API, SharedWorkers, and
          the Web Locks API -- reflects the growing importance of multi-tab consistency in production applications.
        </p>
        <HighlightBlock as="p" tier="important">
          At the staff and principal engineer level, the ability to reason about cross-tab synchronization is
          a proxy for deeper competence: understanding browser security boundaries, concurrency without threads,
          leader election in an ephemeral environment, and the trade-offs between eventual consistency and strict
          ordering in a client-side distributed system.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="important">
          There are seven primary mechanisms for cross-tab communication. Each has distinct semantics, browser
          support characteristics, and suitability for different synchronization patterns.
        </HighlightBlock>
        <ul>
          <HighlightBlock as="li" tier="crucial">
            <strong>BroadcastChannel API:</strong> The modern, purpose-built primitive for same-origin tab
            communication. Creating a BroadcastChannel with a shared name connects all tabs that open the same
            channel. Messages are structured-cloneable (objects, arrays, Blobs, ArrayBuffers), fire-and-forget,
            and delivered asynchronously. The sender does not receive its own message. Available in all modern
            browsers including Safari 15.4+. This is the recommended default for most use cases.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>localStorage Storage Event:</strong> The original cross-tab communication mechanism. When one
            tab writes to localStorage, all other same-origin tabs receive a "storage" event with the key, old
            value, and new value. The sending tab does not receive the event. Limitations include string-only
            payloads (requiring JSON serialization), synchronous writes that block the main thread, a ~5MB storage
            cap, and no support in Web Workers. Despite these constraints, it remains the most universally
            supported mechanism and serves as a reliable fallback.
          </HighlightBlock>
          <li>
            <strong>SharedWorker:</strong> A Web Worker that maintains a single execution context shared across
            all tabs from the same origin. Tabs connect via MessagePort and the worker acts as a centralized hub,
            receiving messages from any tab and broadcasting to all connected ports. SharedWorkers can maintain
            authoritative state, coordinate access to resources, and survive individual tab closures. However,
            browser support is limited -- Safari does not support SharedWorkers, and debugging them requires
            navigating to chrome://inspect.
          </li>
          <li>
            <strong>Service Worker postMessage:</strong> Service Workers, primarily used for offline caching and
            push notifications, can also relay messages between tabs via the Clients API. A Service Worker can
            enumerate all controlled windows using self.clients.matchAll() and post messages to each. This
            piggybacks on infrastructure many PWAs already have, but Service Worker startup latency can introduce
            delays.
          </li>
          <li>
            <strong>Window.postMessage (Cross-Origin):</strong> The only mechanism that works across different
            origins. Requires a reference to the target window (via window.open or iframe). Messages must be
            explicitly targeted with an origin parameter, and the receiver must validate the origin. Primarily
            useful for cross-origin iframe communication rather than same-origin tab sync.
          </li>
          <li>
            <strong>IndexedDB with Polling:</strong> IndexedDB is a transactional object store available in all
            contexts (windows, workers, service workers). While it has no built-in change notification, tabs can
            poll for changes at intervals. This is a brute-force approach with inherent latency but works
            universally and can handle large payloads. Some libraries layer change detection on top of IndexedDB
            transactions.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Web Locks API:</strong> Not a communication channel itself, but a coordination primitive. The
            Web Locks API allows tabs to request named locks with exclusive or shared modes. This enables leader
            election (only one tab acquires the exclusive lock), resource gating, and ordered access to shared
            state. When combined with BroadcastChannel, Web Locks provide the foundation for sophisticated
            coordination patterns.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="important">
          The architecture of cross-tab synchronization depends on the chosen mechanism, but two fundamental
          patterns emerge: <strong>peer-to-peer broadcast</strong> and <strong>leader-follower coordination</strong>.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Peer-to-Peer Broadcast (BroadcastChannel / localStorage)</h3>
          <ol className="space-y-3">
            <li><strong>1. State Change:</strong> Tab A performs an action that modifies state (e.g., user clicks "Log Out")</li>
            <li><strong>2. Local Update:</strong> Tab A updates its own in-memory state and persists to storage if needed</li>
            <li><strong>3. Broadcast:</strong> Tab A posts a message to the BroadcastChannel (or writes to localStorage)</li>
            <li><strong>4. Receive:</strong> All other open tabs (B, C, D...) receive the message via the onmessage handler (or storage event)</li>
            <li><strong>5. Reconcile:</strong> Each receiving tab validates the message, updates its local state, and re-renders affected components</li>
            <li><strong>6. Side Effects:</strong> Tabs may trigger additional side effects (redirect to login, clear sensitive data from DOM)</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/cross-tab-sync.svg"
          alt="Cross-Tab State Synchronization via BroadcastChannel"
          caption="BroadcastChannel propagation: Tab 1 broadcasts a logout event, Tabs 2 and 3 receive it, update auth state, and redirect to login"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="important">
          The peer-to-peer model is simple and sufficient for idempotent state updates (auth changes, theme
          toggles, preference writes). However, it struggles when operations require coordination -- for example,
          ensuring only one tab maintains a WebSocket connection to avoid redundant server load, or preventing
          multiple tabs from simultaneously refreshing an OAuth token.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Leader-Follower Pattern (Web Locks + BroadcastChannel)</h3>
          <ol className="space-y-3">
            <li><strong>1. Lock Request:</strong> Each tab requests an exclusive Web Lock named "app-leader" upon initialization</li>
            <li><strong>2. Election:</strong> The first tab to acquire the lock becomes the leader; others queue and wait</li>
            <li><strong>3. Leader Duties:</strong> The leader tab opens the WebSocket connection, runs polling intervals, and handles token refresh</li>
            <li><strong>4. Broadcast Results:</strong> The leader posts received data and state updates to BroadcastChannel</li>
            <li><strong>5. Follower Consumption:</strong> Follower tabs receive broadcasts and update their local state without duplicating expensive operations</li>
            <li><strong>6. Failover:</strong> When the leader tab closes, the lock is released and the next queued tab automatically acquires it, becoming the new leader</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/state-management/leader-election.svg"
          alt="Leader Election Pattern for Cross-Tab Coordination"
          caption="Leader election via Web Locks: one tab manages expensive operations and broadcasts results; failover is automatic when the leader closes"
          captionTier="important"
        />

        <HighlightBlock as="p" tier="crucial">
          The leader-follower pattern is critical for applications with expensive shared resources. Without it,
          opening ten tabs to a real-time dashboard could mean ten WebSocket connections, ten polling loops, and
          ten token refresh cycles -- all performing identical work. With leader election, one tab does the work
          and the rest benefit from the results.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <HighlightBlock as="p" tier="important">
          Choosing the right synchronization mechanism depends on payload requirements, browser support constraints,
          and architectural complexity budget.
        </HighlightBlock>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">BroadcastChannel</th>
              <th className="p-3 text-left">localStorage Event</th>
              <th className="p-3 text-left">SharedWorker</th>
              <th className="p-3 text-left">Service Worker</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <HighlightBlock as="tr" tier="important">
              <td className="p-3"><strong>Browser Support</strong></td>
              <td className="p-3">Modern browsers, Safari 15.4+</td>
              <td className="p-3">Universal (IE8+)</td>
              <td className="p-3">Chrome, Firefox, Edge (no Safari)</td>
              <td className="p-3">All modern browsers</td>
            </HighlightBlock>
            <tr>
              <td className="p-3"><strong>Payload Size</strong></td>
              <td className="p-3">Limited by structured clone (~256MB)</td>
              <td className="p-3">~5MB total storage cap, string only</td>
              <td className="p-3">Transferable objects, large payloads</td>
              <td className="p-3">Structured clone, moderate payloads</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Latency</strong></td>
              <td className="p-3">Sub-millisecond</td>
              <td className="p-3">Low (~1-5ms), synchronous write</td>
              <td className="p-3">Low, but port setup overhead</td>
              <td className="p-3">Variable (SW startup delay)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Complexity</strong></td>
              <td className="p-3">Minimal -- simple pub/sub API</td>
              <td className="p-3">Minimal, but requires JSON parse</td>
              <td className="p-3">High -- port management, lifecycle</td>
              <td className="p-3">Medium -- requires SW registration</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Cross-Origin</strong></td>
              <td className="p-3">Same-origin only</td>
              <td className="p-3">Same-origin only</td>
              <td className="p-3">Same-origin only</td>
              <td className="p-3">Same-origin (scope-bound)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Structured Data</strong></td>
              <td className="p-3">Native (objects, arrays, blobs)</td>
              <td className="p-3">Strings only (JSON.stringify)</td>
              <td className="p-3">Native + transferables</td>
              <td className="p-3">Native structured clone</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Worker Context</strong></td>
              <td className="p-3">Available in workers</td>
              <td className="p-3">Not available in workers</td>
              <td className="p-3">Is a worker</td>
              <td className="p-3">Is a worker</td>
            </tr>
          </tbody>
        </table>

        <HighlightBlock as="p" tier="crucial" className="mt-4">
          For most applications, <strong>BroadcastChannel with a localStorage fallback</strong> provides the best
          balance of simplicity, performance, and compatibility. Reserve SharedWorkers for cases where you need a
          centralized state authority, and Service Worker relaying for PWAs that already have a Service Worker
          lifecycle in place.
        </HighlightBlock>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="important">
          Follow these guidelines when implementing cross-tab synchronization:
        </HighlightBlock>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Use Message Schemas with Versioning:</strong> Define typed message schemas with a type
            discriminator and a version field. This prevents breaking changes when updating the sync protocol
            and allows tabs running different code versions (during rolling deployments) to coexist gracefully.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Implement Idempotent Handlers:</strong> Message delivery is at-most-once for BroadcastChannel
            and at-least-once for some edge cases with localStorage. Design receivers so that processing the same
            message twice produces no harmful side effects. Use message IDs or state timestamps to deduplicate.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Gate Sensitive Syncs with Origin Validation:</strong> While same-origin APIs inherently
            restrict to your origin, always validate message structure and type before acting on it. Malicious
            browser extensions can inject messages into BroadcastChannels.
          </HighlightBlock>
          <li>
            <strong>Debounce High-Frequency State Changes:</strong> Syncing every keystroke or scroll position
            across tabs creates unnecessary overhead. Batch and debounce updates with a 100-300ms window for
            non-critical state, while keeping auth and security state synchronous.
          </li>
          <li>
            <strong>Clean Up Channels on Tab Close:</strong> Always close BroadcastChannel instances and
            disconnect SharedWorker ports in cleanup functions (useEffect return, beforeunload). Orphaned
            channels can cause memory leaks and unexpected message delivery.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Provide Fallback Mechanisms:</strong> Feature-detect BroadcastChannel and fall back to
            localStorage events. Feature-detect Web Locks and fall back to a BroadcastChannel-based election.
            Never assume a single API will be available in all deployment targets.
          </HighlightBlock>
          <li>
            <strong>Separate Sync Concerns from UI State:</strong> Create a dedicated synchronization layer that
            sits between your state management library (Zustand, Redux, Jotai) and the browser APIs. This keeps
            the sync logic testable, replaceable, and independent of your rendering framework.
          </li>
          <li>
            <strong>Log and Monitor Sync Events in Production:</strong> Instrument your sync layer with telemetry
            for message send/receive counts, leader elections, and fallback activations. Cross-tab issues are
            notoriously difficult to reproduce in development.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="important">
          Avoid these mistakes that frequently arise in cross-tab synchronization implementations:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Infinite Sync Loops:</strong> Tab A broadcasts a change, Tab B receives and updates its state,
            which triggers its own sync broadcast, which Tab A receives, ad infinitum. The fix is straightforward:
            mark state updates originating from sync messages with a flag (e.g., isRemoteUpdate) and skip
            broadcasting when that flag is set.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Race Conditions on Simultaneous Writes:</strong> Two tabs modify the same state at the exact
            same time. Without a conflict resolution strategy, the last write wins arbitrarily. For critical
            state, use the Web Locks API to serialize writes, or implement vector clocks / logical timestamps
            to detect and resolve conflicts deterministically.
          </HighlightBlock>
          <li>
            <strong>Stale Tab Detection Failure:</strong> A tab left open for hours or days may have stale state,
            expired tokens, or outdated code. When it suddenly broadcasts a message, other tabs may process
            invalid data. Include timestamps in messages and reject messages older than a threshold.
          </li>
          <li>
            <strong>Ignoring Tab Visibility State:</strong> Broadcasting expensive re-renders to background tabs
            wastes resources and can cause performance degradation when the user switches back. Use the Page
            Visibility API (document.visibilityState) to defer non-critical updates in hidden tabs and batch
            them for when the tab becomes visible.
          </li>
          <li>
            <strong>Serialization Overhead with localStorage:</strong> Storing large objects in localStorage for
            cross-tab sync requires JSON.stringify on write and JSON.parse on read, both of which are synchronous
            and block the main thread. For payloads larger than a few kilobytes, BroadcastChannel with structured
            clone is significantly more efficient.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Assuming Message Ordering:</strong> BroadcastChannel does not guarantee message ordering
            across multiple channels or during high-frequency posting. If ordering matters, include a monotonic
            sequence number in each message and buffer out-of-order messages on the receiving side.
          </HighlightBlock>
          <li>
            <strong>Not Handling the "First Tab" Edge Case:</strong> When the very first tab opens, there are no
            peers to sync with. The initialization path must handle this gracefully -- typically by reading from
            persisted storage (localStorage, IndexedDB) rather than expecting a sync message.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="important">
          Cross-tab synchronization is critical in these production scenarios:
        </HighlightBlock>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Authentication & Session Management:</strong> When a user logs out in one tab, all tabs must
            immediately clear tokens, sensitive data, and redirect to the login page. This is a security
            requirement, not a UX nicety. Financial applications, healthcare portals, and enterprise tools
            commonly require this. The BroadcastChannel pattern with an "auth-invalidated" message type is the
            standard approach.
          </HighlightBlock>
          <li>
            <strong>Theme and Preference Synchronization:</strong> Toggling dark mode in one tab should update all
            tabs instantly. This is typically handled via localStorage sync since theme state is small (a single
            string) and the storage event fires reliably. Zustand's persist middleware with cross-tab listeners
            handles this pattern well.
          </li>
          <li>
            <strong>Shopping Cart Consistency:</strong> E-commerce platforms must keep cart state consistent
            across tabs. Adding an item in one tab, viewing the cart in another, and checking out in a third
            should all reflect the same state. This often combines BroadcastChannel for real-time sync with
            server-side cart state as the source of truth.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Collaborative Editing:</strong> Applications like Google Docs, Notion, or Figma use a leader
            tab to manage the WebSocket connection to the collaboration server. Follower tabs receive operational
            transforms or CRDTs via BroadcastChannel from the leader, reducing server connection overhead by
            N-1 where N is the number of open tabs.
          </HighlightBlock>
          <li>
            <strong>Notification Deduplication:</strong> A notification system must ensure a push notification
            alert appears in only one tab (typically the focused one), not all of them. The leader election
            pattern determines which tab owns notification display.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Synchronize Across Tabs</h3>
          <HighlightBlock as="p" tier="crucial">
            Avoid cross-tab sync for:
          </HighlightBlock>
          <ul className="mt-2 space-y-2">
            <li>• <strong>Form input state:</strong> Users may intentionally have different form states in different tabs (e.g., composing two different emails)</li>
            <li>• <strong>Scroll position and UI viewport:</strong> These are inherently per-tab and syncing them creates a confusing experience</li>
            <li>• <strong>Transient loading/error states:</strong> These are local to the request lifecycle of each tab and have no meaning in other contexts</li>
            <li>• <strong>Undo/redo history:</strong> Action history is tied to the specific tab's interaction sequence and should not be shared</li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you ensure a user is logged out of all open tabs when they click "Log Out" in one tab?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: Use BroadcastChannel as the primary mechanism. When the logout action fires in one tab, post a
              message like {`{ type: "AUTH_LOGOUT", timestamp: Date.now() }`} to a dedicated auth channel. Every
              tab listens on this channel and, upon receiving the message, clears in-memory tokens, removes
              persisted session data from localStorage/cookies, and redirects to the login page. For browsers
              without BroadcastChannel support, fall back to writing a sentinel value to localStorage (e.g.,
              "auth_logout_at" with a timestamp) and listening for the storage event. The receiving tabs check
              the timestamp to avoid processing stale events. Critical detail: clear sensitive DOM content
              (account details, financial data) before the redirect completes, as the redirect is asynchronous.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent duplicate WebSocket connections when a user has multiple tabs open?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Implement the leader election pattern using the Web Locks API. Each tab attempts to acquire an
              exclusive lock named "ws-leader" using navigator.locks.request(). Only one tab succeeds and becomes
              the leader, establishing the WebSocket connection. The leader forwards all received messages to
              other tabs via BroadcastChannel. When the leader tab closes, the lock is automatically released
              and the next tab in the queue acquires it, re-establishing the WebSocket connection. The failover
              is seamless because the lock queue is managed by the browser. Follower tabs can still send messages
              to the server by posting to BroadcastChannel, where the leader picks them up and sends them through
              the WebSocket. For browsers without Web Locks, implement election via BroadcastChannel heartbeats:
              the leader sends periodic pings, and if followers miss three consecutive heartbeats, one promotes
              itself using a deterministic tiebreaker (e.g., lowest tab ID).
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the trade-offs between BroadcastChannel and SharedWorker for cross-tab state management?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: BroadcastChannel is a stateless pub/sub pipe -- it delivers messages but maintains no state. It
              is simple to use, well-supported (including Safari 15.4+), and ideal for broadcasting state changes
              where each tab maintains its own copy of state. SharedWorker, by contrast, provides a centralized
              execution context that persists across tabs. It can hold authoritative state, enforce invariants,
              and coordinate complex logic. However, SharedWorker has no Safari support, requires managing
              MessagePort connections, and is harder to debug. The decision comes down to whether you need a
              centralized authority. For simple sync (auth, theme, preferences), BroadcastChannel is sufficient.
              For complex scenarios requiring a single source of truth with transactional guarantees (collaborative
              editing, ordered event processing), SharedWorker is the better architectural choice -- with a
              BroadcastChannel fallback for Safari.
            </HighlightBlock>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - BroadcastChannel API
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - Web Locks API
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - SharedWorker
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/broadcastchannel" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - BroadcastChannel API Guide
            </a>
          </li>
          <li>
            <a href="https://github.com/nicknisi/zustand-cross-tab" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Zustand Cross-Tab State Synchronization Patterns
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

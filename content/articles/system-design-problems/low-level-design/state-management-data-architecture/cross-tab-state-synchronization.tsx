"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-cross-tab-sync",
  title: "Cross-Tab State Synchronization",
  description:
    "Production-grade cross-tab state sync — BroadcastChannel API, localStorage events, leader election, conflict resolution, and consistent state across browser tabs.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "cross-tab-state-synchronization",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "cross-tab", "broadcastchannel", "localstorage", "leader-election", "conflict-resolution"],
  relatedTopics: ["global-event-bus-react", "state-persistence-rehydration"],
};

export default function CrossTabStateSynchronizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Users open the application in multiple browser tabs. State changes in
          one tab (login/logout, theme change, notification read, cart update)
          should propagate to all other tabs. Without synchronization, tabs
          become inconsistent — user logs out in Tab A but Tab B still shows
          authenticated UI. We need a cross-tab state synchronization system
          that broadcasts state changes to all tabs, handles conflicts when
          multiple tabs modify the same state simultaneously, and works reliably
          even when tabs are opened/closed dynamically.
        </p>
        <p><strong>Assumptions:</strong> React 19+, same-origin tabs, modern browsers (BroadcastChannel support).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Broadcast State Changes:</strong> When state changes in Tab A, all other tabs receive the update within 100ms.</li>
          <li><strong>Leader Election:</strong> One tab elected as leader for coordination tasks (periodic sync, cleanup). Leader re-elected if tab closes.</li>
          <li><strong>Conflict Resolution:</strong> Two tabs modify the same state simultaneously — deterministic resolution (last-write-wins with vector clocks, or server-as-source-of-truth).</li>
          <li><strong>Tab Lifecycle:</strong> Detect tab open/close. New tabs receive current state on mount. Closed tabs removed from subscriber list.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Sync Latency:</strong> State change propagates to all tabs within 100ms.</li>
          <li><strong>Bandwidth:</strong> Only changed state fields transmitted — not full state tree.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Two implementations: BroadcastChannel API (primary, low latency) and
          localStorage events (fallback, broader compatibility). When state
          changes, the tab broadcasts a message with the changed field path,
          new value, timestamp, and tab ID. Other tabs receive the message,
          apply the change to their local store, and notify subscribers. Leader
          election uses a shared localStorage key — the first tab to claim it
          becomes leader, others monitor for leader death (heartbeat timeout)
          and re-elect.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. BroadcastChannel Bridge (<code>lib/broadcast-bridge.ts</code>)</h4>
          <p>BroadcastChannel-based message passing. Post state change messages, receive messages from other tabs. Low latency (~10ms).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. LocalStorage Fallback (<code>lib/localstorage-fallback.ts</code>)</h4>
          <p>localStorage event-based fallback for browsers without BroadcastChannel. Writes to a shared key, other tabs listen for storage events.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Leader Election (<code>lib/leader-election.ts</code>)</h4>
          <p>Claims leadership via localStorage key with heartbeat. If leader&apos;s heartbeat stops (5s timeout), next tab claims leadership.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Conflict Resolver (<code>lib/cross-tab-conflict-resolver.ts</code>)</h4>
          <p>Resolves concurrent modifications. Last-write-wins with Lamport timestamps. For critical state (cart, form drafts), fetch from server to resolve.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Tab Registry (<code>lib/tab-registry.ts</code>)</h4>
          <p>Tracks active tabs. Tab registers on mount, deregisters on unmount/beforeunload. Leader uses registry for cleanup tasks.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration Hook (<code>hooks/useCrossTabSync.ts</code>)</h4>
          <p>Subscribes to cross-tab state updates. When message received, applies to local store. Returns leadership status and tab count for UI.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/cross-tab-state-synchronization-architecture.svg"
          alt="Cross-tab synchronization showing BroadcastChannel, leader election, and conflict resolution"
          caption="Cross-Tab State Synchronization Architecture"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>Tab A changes state → broadcast via BroadcastChannel → Tabs B, C, D receive → apply to local store → notify subscribers. Leader tab runs periodic sync with server. Conflict: Tabs A and B change same field simultaneously → Lamport timestamp comparison → higher timestamp wins.</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Tab closes while broadcasting:</strong> Message may be partially sent. Other tabs detect incomplete message (missing checksum) and discard. Leader election triggers new leader.</li>
          <li><strong>BroadcastChannel not supported:</strong> Fallback to localStorage events. Slightly higher latency (~50ms) but functionally equivalent.</li>
          <li><strong>Conflict on critical state:</strong> Two tabs edit the same form draft. Last-write-wins may lose user&apos;s work. Fix: fetch from server before applying remote change, merge field-level, notify user of conflict.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: BroadcastChannel bridge, localStorage fallback, leader election, conflict resolver, tab registry, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Broadcast to N tabs</td><td className="p-2">O(1) — browser handles fan-out</td></tr>
              <tr><td className="p-2">Apply remote change</td><td className="p-2">O(1) — single field update</td></tr>
              <tr><td className="p-2">Leader heartbeat</td><td className="p-2">O(1) per 2s interval</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>BroadcastChannel is same-origin only — no cross-origin data leakage. Messages validated against schema before applying. Test: broadcast reaches all tabs, leader election works with concurrent claims, conflict resolver picks correct winner, fallback works when BroadcastChannel unavailable.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Broadcasting full state:</strong> Sending entire state tree on every change wastes bandwidth. Fix: broadcast only changed fields (path + value).</li>
          <li><strong>No conflict resolution:</strong> Assuming tabs never conflict. In practice, users often have 3-5 tabs open — conflicts are common. Fix: Lamport timestamps or server-as-source-of-truth.</li>
          <li><strong>No leader death detection:</strong> Leader tab closes, no re-election. Periodic tasks stop. Fix: heartbeat with timeout, re-elect on leader silence.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you sync state across devices (not just tabs)?</p>
            <p className="mt-2 text-sm">
              A: Browser APIs can&apos;t cross devices. Use a server-side WebSocket
              connection — each device connects to a user-specific channel. State
              changes broadcast via server to all connected devices. Add offline
              support: queue changes locally, sync when reconnected, resolve
              conflicts via server-side merge logic.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN — BroadcastChannel API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN — Storage Event</a></li>
          <li><a href="https://en.wikipedia.org/wiki/Lamport_timestamp" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Wikipedia — Lamport Timestamps</a></li>
          <li><a href="https://www.w3.org/TR/webstorage/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">W3C — Web Storage API</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

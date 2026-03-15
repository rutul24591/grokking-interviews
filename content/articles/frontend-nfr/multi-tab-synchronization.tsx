"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-multi-tab-synchronization",
  title: "Multi-Tab Synchronization",
  description: "Comprehensive guide to synchronizing state across browser tabs: BroadcastChannel, localStorage events, SharedWorker, and cross-tab communication patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "multi-tab-synchronization",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "multi-tab", "synchronization", "broadcastchannel", "cross-tab"],
  relatedTopics: ["client-persistence", "state-management", "offline-support"],
};

export default function MultiTabSynchronizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Multi-Tab Synchronization</strong> ensures consistent state across multiple
          browser tabs or windows from the same origin. Users often open multiple tabs — viewing
          the same dashboard, editing related documents, or comparing products. Without synchronization,
          tabs show stale data, actions in one tab aren&apos;t reflected in others, and users experience
          confusion or data loss.
        </p>
        <p>
          For staff engineers, multi-tab sync is a UX and data consistency challenge. Users expect
          tabs to &quot;know&quot; about each other — logging out in one tab should log out all tabs,
          cart updates should appear everywhere, and concurrent edits need conflict resolution.
        </p>
        <p>
          <strong>Multi-tab sync use cases:</strong>
        </p>
        <ul>
          <li><strong>Authentication:</strong> Logout in one tab → logout all tabs</li>
          <li><strong>Shopping cart:</strong> Add item in one tab → update cart count everywhere</li>
          <li><strong>Collaborative editing:</strong> Changes in one tab → visible in others</li>
          <li><strong>Notifications:</strong> Unread count updates across tabs</li>
          <li><strong>Settings:</strong> Preference changes apply to all tabs</li>
          <li><strong>Session expiry:</strong> Session timeout in one tab → notify all tabs</li>
        </ul>
      </section>

      <section>
        <h2>Cross-Tab Communication Mechanisms</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">BroadcastChannel API</h3>
        <p>
          Modern API for cross-tab messaging. Simple, purpose-built for this use case.
        </p>
        <ul className="space-y-2">
          <li><strong>API:</strong> <code>BroadcastChannel(channelName)</code></li>
          <li><strong>Methods:</strong> <code>postMessage()</code>, <code>onmessage</code></li>
          <li><strong>Scope:</strong> Same origin only</li>
          <li><strong>Data:</strong> Structured clone (objects, arrays, primitives)</li>
          <li><strong>Browser support:</strong> 90%+ (not IE)</li>
          <li><strong>Best for:</strong> Most cross-tab sync needs</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">localStorage Events</h3>
        <p>
          Listen for storage events to detect cross-tab changes.
        </p>
        <ul className="space-y-2">
          <li><strong>API:</strong> <code>window.addEventListener(&apos;storage&apos;, handler)</code></li>
          <li><strong>Trigger:</strong> Fires when localStorage changes in another tab</li>
          <li><strong>Scope:</strong> Same origin</li>
          <li><strong>Data:</strong> Only key, oldValue, newValue (strings)</li>
          <li><strong>Browser support:</strong> Universal</li>
          <li><strong>Best for:</strong> Simple sync, fallback for older browsers</li>
          <li><strong>Limitation:</strong> Doesn&apos;t fire in tab that made the change</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SharedWorker</h3>
        <p>
          Web Worker shared across tabs from same origin.
        </p>
        <ul className="space-y-2">
          <li><strong>API:</strong> <code>SharedWorker(script)</code></li>
          <li><strong>Scope:</strong> Same origin</li>
          <li><strong>Features:</strong> Shared state, complex logic, background processing</li>
          <li><strong>Browser support:</strong> Good (not IE, limited mobile)</li>
          <li><strong>Best for:</strong> Complex shared state, coordination logic</li>
          <li><strong>Overhead:</strong> More complex than BroadcastChannel</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Service Worker</h3>
        <p>
          Can coordinate tabs but primarily for network caching.
        </p>
        <ul className="space-y-2">
          <li><strong>API:</strong> <code>clients.matchAll()</code>, <code>postMessage()</code></li>
          <li><strong>Scope:</strong> Same origin</li>
          <li><strong>Best for:</strong> Network-level coordination, push notifications</li>
          <li><strong>Overhead:</strong> Complex for simple tab sync</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/cross-tab-communication.svg"
          alt="Cross-Tab Communication Mechanisms"
          caption="Cross-tab communication options — BroadcastChannel, localStorage events, SharedWorker, and Service Worker"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Mechanism Comparison</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Mechanism</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Browser Support</th>
              <th className="p-3 text-left">Best Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">BroadcastChannel</td>
              <td className="p-3">Low</td>
              <td className="p-3">90%+</td>
              <td className="p-3">Most cross-tab sync</td>
            </tr>
            <tr>
              <td className="p-3">localStorage events</td>
              <td className="p-3">Low</td>
              <td className="p-3">Universal</td>
              <td className="p-3">Simple sync, fallback</td>
            </tr>
            <tr>
              <td className="p-3">SharedWorker</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Good</td>
              <td className="p-3">Complex shared state</td>
            </tr>
            <tr>
              <td className="p-3">Service Worker</td>
              <td className="p-3">High</td>
              <td className="p-3">Good</td>
              <td className="p-3">Network coordination</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">BroadcastChannel Pattern</h3>
        <ul className="space-y-2">
          <li>Create channel with app-specific name</li>
          <li>Post messages on state changes</li>
          <li>Listen for messages and update local state</li>
          <li>Handle tab close (cleanup)</li>
          <li>Include message type for routing</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Message Protocol</h3>
        <ul className="space-y-2">
          <li>Define message types (AUTH_CHANGE, CART_UPDATE, SETTINGS_CHANGE)</li>
          <li>Include timestamp for ordering</li>
          <li>Include source tab ID (for debugging)</li>
          <li>Include payload data</li>
          <li>Handle unknown message types gracefully</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">State Reconciliation</h3>
        <ul className="space-y-2">
          <li>On message received, merge with local state</li>
          <li>Handle concurrent updates (last-write-wins or merge)</li>
          <li>Detect and handle conflicts</li>
          <li>Avoid infinite loops (don&apos;t rebroadcast received messages)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tab Leadership</h3>
        <ul className="space-y-2">
          <li>Elect one tab as &quot;leader&quot; for coordination</li>
          <li>Leader handles expensive operations (API calls, cleanup)</li>
          <li>Use BroadcastChannel for leader election</li>
          <li>Handle leader tab close (elect new leader)</li>
          <li>Libraries: leader-elect, broadcast-channel with leader pattern</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/tab-leadership-pattern.svg"
          alt="Tab Leadership Pattern"
          caption="Tab leadership — electing a leader tab for coordination, handling leader departure, and distributing work"
        />
      </section>

      <section>
        <h2>Common Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authentication Sync</h3>
        <ul className="space-y-2">
          <li>Broadcast logout event to all tabs</li>
          <li>Clear auth state and redirect to login</li>
          <li>Handle session expiry (401 in one tab → notify all)</li>
          <li>Sync token refresh (new token → broadcast to all)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shopping Cart Sync</h3>
        <ul className="space-y-2">
          <li>Broadcast cart changes (add, remove, update quantity)</li>
          <li>Update cart count in header across all tabs</li>
          <li>Handle concurrent modifications (merge or last-write-wins)</li>
          <li>Sync checkout state (prevent double-purchase)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Notification Sync</h3>
        <ul className="space-y-2">
          <li>Mark as read in one tab → update count everywhere</li>
          <li>Broadcast new notification events</li>
          <li>Sync notification preferences</li>
          <li>Handle notification dismissal across tabs</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Settings Sync</h3>
        <ul className="space-y-2">
          <li>Broadcast preference changes</li>
          <li>Apply changes immediately in all tabs</li>
          <li>Handle conflicting changes (last-write-wins usually fine)</li>
          <li>Persist to server for cross-device sync</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Collaborative Editing</h3>
        <ul className="space-y-2">
          <li>Broadcast document changes</li>
          <li>Handle concurrent edits (CRDTs or operational transform)</li>
          <li>Show other users&apos; cursors/selections</li>
          <li>Resolve conflicts gracefully</li>
        </ul>
      </section>

      <section>
        <h2>Edge Cases and Considerations</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tab Close Detection</h3>
        <ul className="space-y-2">
          <li>Use <code>beforeunload</code> event</li>
          <li>Broadcast tab closing message</li>
          <li>Clean up shared resources</li>
          <li>Handle leader tab closing (elect new leader)</li>
          <li>Don&apos;t rely on <code>unload</code> (unreliable)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Message Ordering</h3>
        <ul className="space-y-2">
          <li>Include timestamps in messages</li>
          <li>Process messages in order</li>
          <li>Handle out-of-order delivery</li>
          <li>Use sequence numbers for critical operations</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance</h3>
        <ul className="space-y-2">
          <li>Debounce frequent updates (typing, scrolling)</li>
          <li>Batch multiple changes into single message</li>
          <li>Limit message payload size</li>
          <li>Avoid broadcasting large state objects</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security</h3>
        <ul className="space-y-2">
          <li>Same-origin only (built-in protection)</li>
          <li>Validate message structure</li>
          <li>Don&apos;t trust messages blindly</li>
          <li>Include message authentication for sensitive operations</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Fallback Strategy</h3>
        <ul className="space-y-2">
          <li>Try BroadcastChannel first</li>
          <li>Fall back to localStorage events if unsupported</li>
          <li>Graceful degradation (sync may be delayed)</li>
          <li>Test fallback path</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you synchronize state across browser tabs?</p>
            <p className="mt-2 text-sm">
              A: Use BroadcastChannel API for modern browsers — simple postMessage between tabs.
              Listen for messages and update local state. For older browsers, fall back to
              localStorage events (fires when localStorage changes in another tab). For complex
              shared state, use SharedWorker. Include message types, timestamps, and handle tab
              close gracefully.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout across multiple tabs?</p>
            <p className="mt-2 text-sm">
              A: When user logs out in one tab, broadcast AUTH_LOGOUT message via BroadcastChannel.
              All tabs receive message, clear auth state, and redirect to login. Also handle session
              expiry — if one tab gets 401, broadcast to all tabs. Clear tokens from all storage
              (localStorage, cookies) in all tabs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is tab leadership and when would you use it?</p>
            <p className="mt-2 text-sm">
              A: Tab leadership elects one tab as &quot;leader&quot; for coordination. Leader handles
              expensive operations (API calls, cleanup, background sync). Other tabs are followers.
              Use when you want to avoid duplicate work (all tabs calling same API) or need
              centralized coordination. Handle leader tab closing by electing new leader.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent updates across tabs?</p>
            <p className="mt-2 text-sm">
              A: Include timestamps in messages for ordering. Use last-write-wins for simple cases.
              For complex data, use merge strategies or CRDTs. Avoid infinite loops — don&apos;t
              rebroadcast received messages. For collaborative editing, use operational transform
              or CRDT libraries. Test concurrent update scenarios thoroughly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between BroadcastChannel and localStorage events?</p>
            <p className="mt-2 text-sm">
              A: BroadcastChannel is purpose-built for cross-tab messaging — postMessage directly,
              receive in onmessage handler. localStorage events fire when localStorage changes in
              another tab — indirect, only string data, doesn&apos;t fire in tab that made change.
              BroadcastChannel is simpler and more flexible. localStorage events work in older
              browsers as fallback.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — BroadcastChannel API
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Storage Event
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — SharedWorker
            </a>
          </li>
          <li>
            <a href="https://github.com/pubkey/broadcast-channel" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              broadcast-channel — Leader Election Library
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

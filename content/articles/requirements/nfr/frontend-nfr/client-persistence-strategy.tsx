"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-client-persistence-strategy",
  title: "Client Persistence Strategy",
  description: "Comprehensive guide to client-side data persistence: localStorage, IndexedDB, cookies, hydration, offline storage, and data synchronization patterns.",
  category: "frontend",
  subcategory: "nfr",
  slug: "client-persistence-strategy",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "persistence", "storage", "indexeddb", "hydration", "offline"],
  relatedTopics: ["secure-client-storage", "offline-support", "state-management"],
};

export default function ClientPersistenceStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Client Persistence Strategy</strong> encompasses how applications store data
          locally to survive page refreshes, enable offline usage, and improve performance through
          caching. This includes choosing storage mechanisms, data serialization, hydration on app
          load, and synchronization with server state.
        </p>
        <p>
          For staff engineers, persistence decisions affect UX (fast loads, offline support),
          security (sensitive data handling), and architecture (sync patterns, conflict resolution).
          The right strategy depends on data characteristics: size, structure, sensitivity, and
          access patterns.
        </p>
        <p>
          <strong>Persistence use cases:</strong>
        </p>
        <ul>
          <li><strong>User preferences:</strong> Theme, language, layout settings</li>
          <li><strong>Drafts:</strong> Unsaved form data, document drafts</li>
          <li><strong>Offline data:</strong> Cached API responses, queued actions</li>
          <li><strong>Session state:</strong> Shopping cart, multi-step form progress</li>
          <li><strong>Performance cache:</strong> Previously fetched data, computed results</li>
        </ul>
      </section>

      <section>
        <h2>Storage Mechanisms Comparison</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">localStorage</h3>
        <ul className="space-y-2">
          <li><strong>Capacity:</strong> 5-10MB per origin</li>
          <li><strong>API:</strong> Simple key-value (setItem, getItem, removeItem)</li>
          <li><strong>Persistence:</strong> Until explicitly cleared</li>
          <li><strong>Sync/Async:</strong> Synchronous (blocks main thread)</li>
          <li><strong>Data type:</strong> Strings only (JSON.stringify for objects)</li>
          <li><strong>Best for:</strong> Small settings, preferences, feature flags</li>
          <li><strong>Avoid for:</strong> Large data, complex queries, sensitive information</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">sessionStorage</h3>
        <ul className="space-y-2">
          <li><strong>Capacity:</strong> 5-10MB per origin</li>
          <li><strong>API:</strong> Same as localStorage</li>
          <li><strong>Persistence:</strong> Until tab/window closes</li>
          <li><strong>Scope:</strong> Per-tab (not shared across tabs)</li>
          <li><strong>Best for:</strong> Single-session data, temporary form state</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">IndexedDB</h3>
        <ul className="space-y-2">
          <li><strong>Capacity:</strong> 50MB+ (varies by browser, can request more)</li>
          <li><strong>API:</strong> Complex, transactional, async</li>
          <li><strong>Persistence:</strong> Until explicitly deleted</li>
          <li><strong>Sync/Async:</strong> Asynchronous (non-blocking)</li>
          <li><strong>Data type:</strong> Structured data (objects, arrays, blobs)</li>
          <li><strong>Features:</strong> Indexes, cursors, versioning, transactions</li>
          <li><strong>Best for:</strong> Large datasets, offline apps, complex queries</li>
          <li><strong>Libraries:</strong> idb, Dexie.js (simplify API)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache API</h3>
        <ul className="space-y-2">
          <li><strong>Capacity:</strong> Varies by browser (generous)</li>
          <li><strong>API:</strong> Request/Response caching</li>
          <li><strong>Persistence:</strong> Until storage pressure or explicit deletion</li>
          <li><strong>Best for:</strong> HTTP response caching (Service Workers)</li>
          <li><strong>Use with:</strong> Service Workers for offline support</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookies</h3>
        <ul className="space-y-2">
          <li><strong>Capacity:</strong> 4KB per cookie, ~20 cookies per domain</li>
          <li><strong>API:</strong> document.cookie or libraries</li>
          <li><strong>Persistence:</strong> Session or with expiration</li>
          <li><strong>Sync/Async:</strong> Synchronous access</li>
          <li><strong>Best for:</strong> Small data that needs server access (session IDs)</li>
          <li><strong>Avoid for:</strong> Large data (sent with every request)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/storage-mechanisms-comparison.svg"
          alt="Storage Mechanisms Comparison"
          caption="Client storage comparison — localStorage, IndexedDB, Cache API, and cookies with capacity, API complexity, and use cases"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Selection Matrix</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Use Case</th>
              <th className="p-3 text-left">Recommended Storage</th>
              <th className="p-3 text-left">Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">User preferences</td>
              <td className="p-3">localStorage</td>
              <td className="p-3">Small, simple, persistent</td>
            </tr>
            <tr>
              <td className="p-3">Form drafts</td>
              <td className="p-3">localStorage</td>
              <td className="p-3">Easy access, survives refresh</td>
            </tr>
            <tr>
              <td className="p-3">Offline data cache</td>
              <td className="p-3">IndexedDB + Cache API</td>
              <td className="p-3">Large capacity, async, structured</td>
            </tr>
            <tr>
              <td className="p-3">Session tokens</td>
              <td className="p-3">HttpOnly cookies</td>
              <td className="p-3">Secure, server-accessible</td>
            </tr>
            <tr>
              <td className="p-3">Single-session state</td>
              <td className="p-3">sessionStorage</td>
              <td className="p-3">Auto-cleared on tab close</td>
            </tr>
            <tr>
              <td className="p-3">API response cache</td>
              <td className="p-3">Cache API</td>
              <td className="p-3">Request/Response matching</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Hydration Patterns</h2>
        <p>
          Hydration is restoring application state from persisted storage on app load.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Initial Load Hydration</h3>
        <ul className="space-y-2">
          <li>Read from storage during app initialization</li>
          <li>Merge with default state</li>
          <li>Handle missing/corrupted data gracefully</li>
          <li>Validate data schema before use</li>
          <li>Consider async loading (show loading state)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Lazy Hydration</h3>
        <ul className="space-y-2">
          <li>Load persisted data on-demand, not at startup</li>
          <li>Better initial load performance</li>
          <li>Use for non-critical data</li>
          <li>Example: Load saved filters when user opens filter panel</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">State Reconciliation</h3>
        <ul className="space-y-2">
          <li>Merge persisted state with fresh server data</li>
          <li>Handle schema migrations (old persisted data vs new app version)</li>
          <li>Version your persisted data structure</li>
          <li>Provide migration functions for schema changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation Example</h3>
        <ul className="space-y-2">
          <li>Define default state structure</li>
          <li>On load: read from storage, validate, merge with defaults</li>
          <li>On change: debounce writes, batch updates</li>
          <li>On logout: clear sensitive persisted data</li>
          <li>Handle storage quota errors gracefully</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/hydration-pattern.svg"
          alt="Hydration Pattern"
          caption="State hydration flow — reading from storage, validating, merging with defaults, and handling migrations"
        />
      </section>

      <section>
        <h2>Data Synchronization</h2>
        <p>
          Keeping client data in sync with server state.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sync Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Pull sync:</strong> Periodically fetch latest from server
          </li>
          <li>
            <strong>Push sync:</strong> Send local changes to server when online
          </li>
          <li>
            <strong>Bi-directional:</strong> Both pull and push with conflict resolution
          </li>
          <li>
            <strong>Real-time:</strong> WebSocket for live sync (when connectivity allows)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Optimistic Updates</h3>
        <ul className="space-y-2">
          <li>Update local state immediately</li>
          <li>Queue action for server sync</li>
          <li>Rollback on server rejection</li>
          <li>Show pending state to user</li>
          <li>Use React Query mutations for automatic handling</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conflict Detection</h3>
        <ul className="space-y-2">
          <li>Version vectors (track changes per node)</li>
          <li>Timestamps (last-write-wins)</li>
          <li>Field-level tracking (which fields changed)</li>
          <li>Operational transforms (for collaborative editing)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conflict Resolution</h3>
        <ul className="space-y-2">
          <li><strong>Last-write-wins:</strong> Simple but can lose data</li>
          <li><strong>Field-level merge:</strong> Merge changes per field</li>
          <li><strong>Manual resolution:</strong> Show conflicts to user</li>
          <li><strong>CRDTs:</strong> Automatic convergence for specific data types</li>
        </ul>
      </section>

      <section>
        <h2>Offline-First Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Local-First Architecture</h3>
        <ul className="space-y-2">
          <li>Local database is source of truth</li>
          <li>UI always reads from local storage</li>
          <li>Sync to server in background</li>
          <li>Handle conflicts when sync completes</li>
          <li>Libraries: PouchDB, RxDB, PowerSync</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Action Queue</h3>
        <ul className="space-y-2">
          <li>Queue mutations when offline</li>
          <li>Process queue when connectivity returns</li>
          <li>Show pending actions to user</li>
          <li>Handle failures with retry logic</li>
          <li>Idempotent operations for safe retry</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Prefetching</h3>
        <ul className="space-y-2">
          <li>Predict what data user will need</li>
          <li>Fetch and cache proactively</li>
          <li>Respect storage quotas</li>
          <li>Invalidate stale cached data</li>
          <li>Use React Query background refetch</li>
        </ul>
      </section>

      <section>
        <h2>Storage Quotas and Eviction</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Quota Management</h3>
        <ul className="space-y-2">
          <li>Check available space with StorageManager API</li>
          <li>Request persistent storage for critical data</li>
          <li>Handle quota exceeded errors</li>
          <li>Implement LRU eviction for cache data</li>
          <li>Monitor storage usage over time</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Eviction Policies</h3>
        <ul className="space-y-2">
          <li><strong>LRU:</strong> Evict least recently used first</li>
          <li><strong>TTL:</strong> Evict data older than threshold</li>
          <li><strong>Priority-based:</strong> Keep high-priority data longer</li>
          <li><strong>Size-based:</strong> Evict largest items first</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices</h3>
        <ul className="space-y-2">
          <li>Don&apos;t store sensitive data without encryption</li>
          <li>Version your data schema for migrations</li>
          <li>Implement cleanup on logout</li>
          <li>Handle storage permission denial gracefully</li>
          <li>Test with storage pressure (DevTools)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/storage-quota-management.svg"
          alt="Storage Quota Management"
          caption="Storage quota handling — checking available space, requesting persistence, and implementing eviction policies"
        />
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use IndexedDB vs localStorage?</p>
            <p className="mt-2 text-sm">
              A: localStorage for small data (&lt;5MB), simple key-value, synchronous access OK.
              IndexedDB for large data (50MB+), complex queries, async needed, structured data.
              localStorage for preferences and settings. IndexedDB for offline apps, large caches,
              or when you need indexes and cursors.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data persistence across page refreshes?</p>
            <p className="mt-2 text-sm">
              A: On app load, read from storage (localStorage for small data, IndexedDB for large).
              Validate data schema, merge with defaults, handle missing/corrupted data. On state
              changes, debounce writes to storage. Version your data structure for migrations. Clear
              sensitive data on logout.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync offline changes with the server?</p>
            <p className="mt-2 text-sm">
              A: Queue mutations locally when offline. When connectivity returns, process queue
              with retry logic. Use optimistic updates for better UX — update UI immediately,
              rollback on server rejection. Handle conflicts with version vectors or timestamps.
              For complex sync, use libraries like PouchDB or implement CRDTs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle storage quota limits?</p>
            <p className="mt-2 text-sm">
              A: Check available space with StorageManager API. Request persistent storage for
              critical data. Implement eviction policies (LRU, TTL) for cache data. Handle quota
              exceeded errors gracefully — inform user, offer to clear cache. Monitor usage over
              time and proactively clean up old data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is hydration and why is it important?</p>
            <p className="mt-2 text-sm">
              A: Hydration is restoring application state from persisted storage on app load.
              Without hydration, users lose their data on refresh. Read from storage during
              initialization, validate schema, merge with defaults. Handle migrations for schema
              changes. Consider lazy hydration for non-critical data to improve initial load time.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — IndexedDB API
            </a>
          </li>
          <li>
            <a href="https://dexie.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Dexie.js — IndexedDB Wrapper
            </a>
          </li>
          <li>
            <a href="https://web.dev/storage-for-the-web/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Storage for the Web
            </a>
          </li>
          <li>
            <a href="https://offlinefirst.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Offline First Manifesto
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-indexeddb-caching-concise",
  title: "IndexedDB for Large Data Caching",
  description: "Comprehensive guide to IndexedDB for frontend caching covering structured storage, Dexie.js, offline data synchronization, and large dataset management.",
  category: "frontend",
  subcategory: "caching-strategies",
  slug: "indexeddb-caching",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-13",
  tags: ["frontend", "caching", "IndexedDB", "Dexie.js", "offline", "structured data"],
  relatedTopics: ["service-worker-caching", "application-cache", "memory-caching"],
};

export default function IndexedDBCachingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>IndexedDB</strong> is a low-level, transactional, client-side storage API built into every modern browser
          that allows web applications to store and retrieve significant amounts of structured data, including files and
          blobs. Unlike localStorage (which is synchronous, string-only, and capped at ~5MB), IndexedDB provides an
          asynchronous, indexed object store capable of holding hundreds of megabytes to gigabytes of data per origin.
        </p>
        <p>
          The W3C published the IndexedDB 1.0 specification in January 2015, with IndexedDB 2.0 following in 2018.
          It replaced the deprecated Web SQL Database specification, which was based on SQLite and never achieved
          cross-browser standardization. IndexedDB was designed to solve a fundamentally different problem: rather than
          providing a relational SQL interface, it offers a key-value object store with secondary indexes, making it
          more aligned with how JavaScript applications naturally structure data.
        </p>
        <p>
          Storage limits are origin-based and vary by browser. Chrome and Firefox allocate up to 80% of available disk
          space per origin (with a global limit of 60% of total disk). Safari is more conservative, granting roughly
          1GB by default and prompting users for more. In all browsers, IndexedDB storage is considered "best-effort" --
          the browser may evict data under storage pressure unless the application requests persistent storage via
          the StorageManager API (<code>navigator.storage.persist()</code>).
        </p>
        <p>
          For staff and principal engineers, IndexedDB is a critical tool for building offline-first architectures,
          reducing API load through client-side caching layers, and enabling experiences that work seamlessly across
          intermittent connectivity. Understanding its transactional model, indexing capabilities, and failure modes
          is essential for designing robust frontend data layers.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>IndexedDB is built on several foundational primitives that distinguish it from simpler storage mechanisms:</p>
        <ul className="space-y-3">
          <li>
            <strong>Databases and Versioning:</strong> An IndexedDB database is opened by name and version number.
            When you open a database with a higher version than what exists, the <code>onupgradeneeded</code> event
            fires, giving you a transaction to create or modify object stores and indexes. This is the only context
            in which schema changes are allowed. Version numbers must be integers and can only increase.
          </li>
          <li>
            <strong>Object Stores:</strong> The equivalent of tables in relational databases. Each object store holds
            JavaScript objects and is associated with a key path (an in-line key like <code>id</code>) or uses
            out-of-line keys via a key generator. Object stores are created during <code>onupgradeneeded</code> and
            persist across sessions.
          </li>
          <li>
            <strong>Indexes:</strong> Secondary access paths on object stores. An index on <code>email</code> in a
            "users" store lets you look up users by email without scanning every record. Indexes can be unique (enforcing
            no duplicates) or multi-entry (indexing each element in an array-valued field). Under the hood, indexes are
            maintained as B-tree structures.
          </li>
          <li>
            <strong>Transactions:</strong> All read/write operations occur within transactions. Three modes exist:
            <code>readonly</code> (concurrent reads), <code>readwrite</code> (exclusive lock on specified stores), and
            <code>versionchange</code> (exclusive lock on entire database during upgrades). Transactions auto-commit
            when all requests complete and no new requests are made in the same event loop tick. If any request fails,
            the entire transaction rolls back.
          </li>
          <li>
            <strong>Key Ranges:</strong> The <code>IDBKeyRange</code> API allows you to query ranges of keys:
            <code>IDBKeyRange.bound(lower, upper)</code>, <code>IDBKeyRange.only(value)</code>,
            <code>IDBKeyRange.lowerBound(value)</code>, and <code>IDBKeyRange.upperBound(value)</code>. These
            are used with cursors and index queries to efficiently retrieve subsets of data.
          </li>
          <li>
            <strong>Cursors:</strong> For iterating over large result sets without loading everything into memory.
            Cursors can move forward or backward through records and support key ranges for filtered iteration.
            They are essential for pagination patterns over large datasets.
          </li>
          <li>
            <strong>Structured Cloning:</strong> IndexedDB stores values using the structured clone algorithm, which
            handles most JavaScript types (objects, arrays, dates, blobs, ArrayBuffers, Maps, Sets) but cannot clone
            functions, DOM nodes, or Error objects. This means you can store complex nested objects directly without
            serialization.
          </li>
          <li>
            <strong>Wrapper Libraries:</strong> The raw IndexedDB API is notoriously verbose and callback-based.
            <strong>Dexie.js</strong> is the most popular wrapper, providing a Promise-based, chainable query API
            with built-in support for live queries, transactions, and migrations. The <strong>idb</strong> library by
            Jake Archibald offers a thinner Promise wrapper that stays closer to the native API. For most production
            applications, using Dexie.js is strongly recommended over the raw API.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          IndexedDB operates as an embedded database within the browser process, following the same-origin policy.
          Each origin (protocol + host + port) gets its own isolated set of databases. The storage engine varies
          by browser: Chrome uses LevelDB, Firefox uses SQLite as a backend, and Safari uses its own implementation.
          Regardless of backend, the API semantics remain consistent.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/indexeddb-architecture.svg"
          alt="IndexedDB Architecture - Database, Object Stores, Records, and Indexes"
          caption="IndexedDB architecture: A database contains object stores (analogous to tables), each holding records accessible via primary keys and secondary indexes"
        />

        <p>
          The internal flow for a typical write operation is: (1) Application opens a readwrite transaction on one or
          more object stores, (2) the browser acquires an exclusive lock on those stores, (3) the application issues
          put/add/delete requests within the transaction, (4) each request is processed asynchronously and fires
          success/error events, (5) when all requests complete and no more are pending in the current microtask,
          the transaction auto-commits, (6) the data is durably written to disk (with fsync semantics in most browsers).
        </p>
        <p>
          For offline-first applications, IndexedDB typically serves as the local source of truth. The application
          reads from and writes to IndexedDB first, then synchronizes with the server in the background. This
          pattern requires a sync queue, conflict resolution strategy, and network status awareness.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/caching-strategies/offline-sync-flow.svg"
          alt="Offline Sync Flow - IndexedDB as local source of truth with background synchronization"
          caption="Offline sync architecture: IndexedDB serves as the local data layer, with a sync queue that drains when connectivity is restored"
        />

        <p>
          Key architectural considerations include: transaction scope (wider scopes block more stores), connection
          management (holding open connections can block version upgrades from other tabs), and storage pressure
          handling (listening for <code>storage</code> events and implementing graceful degradation when quota is
          exceeded).
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>Understanding when to use IndexedDB requires comparing it against other client-side storage mechanisms:</p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">IndexedDB</th>
              <th className="p-3 text-left">localStorage</th>
              <th className="p-3 text-left">sessionStorage</th>
              <th className="p-3 text-left">Cache API</th>
              <th className="p-3 text-left">Cookies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Capacity</strong></td>
              <td className="p-3">Hundreds of MB to GB</td>
              <td className="p-3">~5-10MB</td>
              <td className="p-3">~5-10MB</td>
              <td className="p-3">Origin quota (GB+)</td>
              <td className="p-3">~4KB per cookie</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Data Structure</strong></td>
              <td className="p-3">Structured objects, blobs, ArrayBuffers</td>
              <td className="p-3">Strings only (JSON.stringify needed)</td>
              <td className="p-3">Strings only</td>
              <td className="p-3">Request/Response pairs</td>
              <td className="p-3">Strings only</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Async</strong></td>
              <td className="p-3">Yes (event-based / Promise wrappers)</td>
              <td className="p-3">No (synchronous, blocks main thread)</td>
              <td className="p-3">No (synchronous)</td>
              <td className="p-3">Yes (Promise-based)</td>
              <td className="p-3">No (synchronous via document.cookie)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Indexes</strong></td>
              <td className="p-3">B-tree indexes on any property</td>
              <td className="p-3">None (key lookup only)</td>
              <td className="p-3">None</td>
              <td className="p-3">URL-based matching</td>
              <td className="p-3">None</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Transactions</strong></td>
              <td className="p-3">Full ACID transactions with rollback</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best Use Case</strong></td>
              <td className="p-3">Large structured datasets, offline apps, client-side search</td>
              <td className="p-3">Small preferences, tokens, flags</td>
              <td className="p-3">Ephemeral per-tab state</td>
              <td className="p-3">HTTP response caching, assets, API responses</td>
              <td className="p-3">Server-readable state, auth tokens</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">IndexedDB vs Cache API: A Common Point of Confusion</h3>
          <p>
            Both IndexedDB and the Cache API can store large amounts of data, but they serve different purposes.
            The Cache API is designed for caching HTTP request/response pairs and is tightly integrated with Service
            Workers for network interception. IndexedDB is for structured application data. In practice, a well-designed
            offline app uses <em>both</em>: Cache API for static assets and API response caching, IndexedDB for
            application state, user-generated data, and data that needs querying or indexing.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>Building reliable IndexedDB-backed caching requires careful attention to several areas:</p>
        <ol className="space-y-3">
          <li>
            <strong>Use Dexie.js (or idb) Instead of Raw API:</strong> The native IndexedDB API is callback-based,
            verbose, and error-prone. Dexie.js provides Promise-based queries, automatic transaction management,
            built-in migration support, and live queries for reactive UI updates. The productivity gain is substantial,
            and it handles many edge cases around transaction lifecycle that are easy to get wrong manually.
          </li>
          <li>
            <strong>Design Indexes Deliberately:</strong> Create indexes only on properties you actually query by.
            Each index adds write overhead (the B-tree must be updated on every insert/update) and consumes storage
            space. Profile your query patterns first, then add indexes. Use compound indexes for multi-field queries
            rather than multiple single-field indexes.
          </li>
          <li>
            <strong>Batch Writes in Single Transactions:</strong> Opening a transaction has overhead. When writing
            many records, batch them into a single readwrite transaction. Dexie.js provides <code>bulkPut()</code>
            and <code>bulkAdd()</code> methods that are significantly faster than individual puts. For 10,000
            records, batching can be 10-50x faster than individual writes.
          </li>
          <li>
            <strong>Handle Version Migrations Carefully:</strong> Schema changes require incrementing the database
            version, which triggers <code>onupgradeneeded</code>. This event fires with an exclusive lock on the
            database, blocking all other connections. Plan migrations to be fast and non-destructive. Never delete
            data during a migration without having a fallback path.
          </li>
          <li>
            <strong>Implement Storage Quota Monitoring:</strong> Use the StorageManager API to check available quota
            before large writes: <code>navigator.storage.estimate()</code>. Request persistent storage with
            <code>navigator.storage.persist()</code> for data the user expects to survive. Implement graceful
            degradation when storage is exhausted -- evict least-recently-used cache entries.
          </li>
          <li>
            <strong>Close Connections When Done:</strong> An open IndexedDB connection prevents version upgrade
            transactions from other tabs (or from your own code after a deployment). Listen for the
            <code>versionchange</code> event on the database and close the connection, then reload or re-open
            at the new version. Dexie.js handles this automatically with its <code>on("versionchange")</code> hook.
          </li>
          <li>
            <strong>Use Cursors for Large Result Sets:</strong> When querying large datasets (10,000+ records),
            avoid <code>getAll()</code> which loads everything into memory. Use cursors with key ranges to paginate
            results. This keeps memory usage predictable and avoids blocking the main thread for long periods.
          </li>
          <li>
            <strong>Add TTL (Time-to-Live) Metadata:</strong> IndexedDB does not have built-in expiration. Store
            a <code>cachedAt</code> timestamp with each record and implement a cleanup routine that removes stale
            entries on application start or periodically. This prevents unbounded storage growth from cached data
            that is no longer relevant.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>These are the most frequent issues encountered when using IndexedDB in production:</p>
        <ul className="space-y-3">
          <li>
            <strong>Transaction Auto-Commit Surprises:</strong> Transactions auto-commit when all pending requests
            are complete and no new requests are issued in the same microtask. If you <code>await</code> a non-IDB
            Promise (like a fetch) inside a transaction, the transaction will commit (or abort) before the await
            resolves. All IDB operations must be synchronously queued within the transaction scope. This is the
            single most common source of IndexedDB bugs.
          </li>
          <li>
            <strong>Blocking Version Upgrades:</strong> If tab A has an open connection to database version 1 and
            tab B tries to open version 2, tab B's open request blocks until tab A closes its connection. Without
            handling the <code>versionchange</code> event, users with multiple tabs will experience a hung upgrade.
            Always listen for <code>versionchange</code> and either close the connection or prompt the user to
            reload.
          </li>
          <li>
            <strong>Safari Quirks and Limitations:</strong> Safari has historically been the most problematic browser
            for IndexedDB. Issues include: data eviction after 7 days of inactivity in iOS Safari (relaxed in
            recent versions with StorageManager.persist()), blob storage limitations in older versions, and slower
            performance compared to Chrome and Firefox. Always test IndexedDB-heavy features in Safari, particularly
            in private browsing mode where storage may be further restricted.
          </li>
          <li>
            <strong>Ignoring Storage Quota Errors:</strong> When IndexedDB runs out of space, write operations fail
            with a <code>QuotaExceededError</code>. If you do not catch and handle this error, writes silently fail
            and data is lost. Implement quota monitoring, graceful degradation, and user-visible warnings when
            storage is running low.
          </li>
          <li>
            <strong>Storing Non-Cloneable Data:</strong> Attempting to store functions, DOM nodes, Error objects, or
            objects with circular references will throw a <code>DataCloneError</code>. Sanitize data before storing
            it. Be especially careful with class instances that have methods -- only plain data properties survive
            structured cloning.
          </li>
          <li>
            <strong>Not Handling Blocked Events:</strong> The <code>blocked</code> event fires on an open request
            when a version upgrade cannot proceed because other connections are still open. Ignoring this event
            leaves the user in a broken state. Always handle blocked events with user-facing feedback (e.g., "Please
            close other tabs and refresh").
          </li>
          <li>
            <strong>Over-Indexing:</strong> Creating indexes on every property of every object store degrades write
            performance significantly. Each index is a separate B-tree that must be updated on every write. Measure
            your read-vs-write ratio and only index properties that are used in queries. A store with 5+ indexes
            will see noticeably slower writes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>IndexedDB is the right choice when your application needs to manage large, structured, queryable data on the client:</p>
        <ul className="space-y-3">
          <li>
            <strong>Offline-First Applications:</strong> Apps like Google Docs, Notion, and Linear use IndexedDB to
            store documents, pages, and issues locally. Users can create, edit, and delete content while offline, and
            changes sync when connectivity returns. The local IndexedDB copy serves as the primary data source, with
            the server acting as the persistence and sync layer.
          </li>
          <li>
            <strong>Large Dataset Caching:</strong> Applications that display catalogs, directories, or reference
            data (think a parts database for an engineering tool with 500,000 items) cache the dataset in IndexedDB
            and perform client-side filtering and search. This eliminates network round-trips for every search query
            and provides sub-millisecond response times.
          </li>
          <li>
            <strong>Email and Messaging Clients:</strong> Web-based email clients (Outlook Web, Gmail) cache
            thousands of messages in IndexedDB with indexes on date, sender, subject, and labels. This enables
            instant search, offline reading, and fast navigation without fetching from the server on every interaction.
          </li>
          <li>
            <strong>Map Tile and Geospatial Caching:</strong> Mapping applications store rendered map tiles in
            IndexedDB for offline access. A single city's tiles at multiple zoom levels can easily reach 100MB+.
            IndexedDB's blob storage capability makes it ideal for this binary-heavy use case.
          </li>
          <li>
            <strong>Media Asset Management:</strong> Applications that work with images, audio clips, or video
            thumbnails can cache these binary assets in IndexedDB alongside their metadata. This is common in
            content management systems, photo editors, and podcast apps.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use IndexedDB</h3>
          <p>IndexedDB is not the right tool for every client-side storage need:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • <strong>Small key-value pairs:</strong> For storing a theme preference, auth token, or feature flag,
              localStorage is simpler and sufficient. Do not use IndexedDB for {'&lt;'}100KB of simple data.
            </li>
            <li>
              • <strong>HTTP response caching:</strong> Use the Cache API (paired with a Service Worker) for caching
              fetch responses. It is purpose-built for this and integrates with the browser's network stack.
            </li>
            <li>
              • <strong>Ephemeral session data:</strong> For data that should not survive a tab close, use
              sessionStorage or in-memory state (React state, Zustand, etc.).
            </li>
            <li>
              • <strong>Data requiring server-side access:</strong> If you need the server to read the stored data on
              every request (e.g., session identifiers), use cookies. IndexedDB is client-only.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does IndexedDB differ from localStorage, and when would you choose one over the other?</p>
            <p className="mt-2 text-sm">
              A: IndexedDB is asynchronous, stores structured data (objects, blobs, ArrayBuffers) natively, supports
              indexes for efficient querying, provides ACID transactions, and can hold hundreds of megabytes. localStorage
              is synchronous (blocks the main thread), stores only strings, has no indexing or transaction support, and
              is limited to ~5-10MB. Choose localStorage for tiny config values (theme, locale, feature flags). Choose
              IndexedDB when you need to cache structured datasets, support offline workflows, or store {'&gt;'} 5MB. The
              critical architectural distinction is that localStorage's synchronous nature makes it unsuitable for any
              operation involving more than a handful of keys, as it can cause visible UI jank.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you design an offline-first sync system using IndexedDB?</p>
            <p className="mt-2 text-sm">
              A: The architecture has four components: (1) A local IndexedDB database that mirrors the server schema and
              serves as the application's primary data source. (2) A sync queue object store that records every
              mutation (create/update/delete) with timestamps and operation metadata. (3) A sync engine that monitors
              network status (navigator.onLine + fetch-based heartbeat) and processes the queue in FIFO order when
              online, using idempotent server endpoints. (4) A conflict resolution strategy -- typically
              last-writer-wins with server timestamps, but CRDTs or operational transforms for collaborative
              scenarios. On reconnection, the sync engine drains the queue, handles conflicts (merging server state
              with local changes), and updates local IndexedDB to reflect the canonical server state. Dexie.js Cloud
              and libraries like RxDB provide production-ready implementations of this pattern.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What happens when IndexedDB runs out of storage quota, and how do you handle it in production?</p>
            <p className="mt-2 text-sm">
              A: When quota is exceeded, write operations reject with a <code>QuotaExceededError</code>. In production,
              you handle this with a multi-layered strategy: (1) Proactively monitor quota using
              <code>navigator.storage.estimate()</code> and warn users when usage exceeds 80% of quota. (2) Implement
              an LRU eviction policy with TTL metadata on cached records -- on quota pressure, delete the oldest or
              least-recently-accessed entries first. (3) Request persistent storage via
              <code>navigator.storage.persist()</code> for critical user data so the browser won't evict it
              automatically. (4) Catch <code>QuotaExceededError</code> on all write paths and fall back gracefully --
              either by evicting stale data and retrying, or by degrading to network-only mode with a user notification.
              (5) Implement a storage budget system that tracks usage by data category and enforces per-category limits.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: References & Further Reading */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN Web Docs - IndexedDB API
            </a>
          </li>
          <li>
            <a href="https://dexie.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Dexie.js - A Minimalistic Wrapper for IndexedDB
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/indexeddb" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Working with IndexedDB
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/IndexedDB-3/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C - Indexed Database API 3.0 Specification
            </a>
          </li>
          <li>
            <a href="https://github.com/nicolo-ribaudo/idb" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              idb - A tiny Promise-based IndexedDB wrapper by Jake Archibald
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

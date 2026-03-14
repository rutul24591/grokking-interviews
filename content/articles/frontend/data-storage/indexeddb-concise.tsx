"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-indexeddb-concise",
  title: "IndexedDB",
  description: "Comprehensive guide to IndexedDB covering transactional object store, indexes, cursors, versioning, Dexie.js, and patterns for structured client-side storage.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "indexeddb",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "storage", "IndexedDB", "Dexie.js", "transactions", "structured data"],
  relatedTopics: ["localstorage", "cache-api", "storage-quotas-and-eviction"],
};

export default function IndexedDBConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>IndexedDB</strong> is a low-level, asynchronous, transactional database system built into every
          modern browser. Defined by the W3C (with the latest Indexed Database API 3.0 specification), it provides
          a structured, key-value object store with secondary indexes, enabling web applications to persist and
          query significant volumes of data entirely on the client. IndexedDB replaced the deprecated Web SQL
          Database specification, which was based on SQLite and never achieved cross-browser standardization because
          it tied the web platform to a single implementation. The W3C deliberately chose an API model that allows
          browser vendors to use any storage backend -- Chrome uses LevelDB, Firefox uses SQLite internally, and
          Safari uses a custom implementation -- while exposing consistent semantics to developers.
        </p>
        <p>
          Under the hood, IndexedDB organizes data using B-tree indexed structures. Each object store maintains a
          primary key B-tree, and each secondary index is a separate B-tree that maps index keys to primary keys.
          This gives IndexedDB O(log n) lookup time on any indexed property, making it suitable for datasets
          ranging from hundreds to hundreds of thousands of records. Storage limits are origin-based: Chrome and
          Firefox allocate up to 80% of available disk space per origin, while Safari is more conservative at
          roughly 1GB by default (expandable with user permission). All browsers treat IndexedDB as "best-effort"
          storage subject to eviction under storage pressure unless the application explicitly requests persistent
          storage via <code>navigator.storage.persist()</code>.
        </p>
        <p>
          For staff and principal engineers, IndexedDB is foundational to offline-first architectures, client-side
          search indexes, progressive web apps, and any system that needs to decouple the frontend data layer from
          network availability. The API is notoriously verbose, which has led to the widespread adoption of wrapper
          libraries like Dexie.js and idb. Understanding the raw transaction model, versioning semantics, and
          concurrency behavior is essential for debugging production issues and making informed architectural
          decisions about where to place the data boundary in a distributed system.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          IndexedDB is built on a set of primitives that together form a complete embedded database system within
          the browser. Understanding these primitives and their interactions is critical for correct usage.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Databases and Versioning:</strong> A database is opened by name and integer version number via
            <code>indexedDB.open(name, version)</code>. If the specified version is higher than what exists (or the
            database does not exist), the <code>onupgradeneeded</code> event fires within a special
            <code>versionchange</code> transaction. This is the <em>only</em> context in which you can create or
            delete object stores and indexes. Version numbers must be positive integers and can only increase.
            Downgrades are not supported -- attempting to open a lower version than what exists throws an error.
            This versioning model enforces forward-only schema migrations, similar to Flyway or Alembic in
            server-side databases.
          </li>
          <li>
            <strong>Object Stores:</strong> The equivalent of tables. Each object store holds JavaScript objects
            and is associated with either an in-line key path (e.g., <code>keyPath: "id"</code>, where the key is
            extracted from the stored object) or out-of-line keys (where you provide the key separately, optionally
            using <code>autoIncrement: true</code>). Object stores are created during <code>onupgradeneeded</code>
            and persist across sessions. You can have multiple object stores per database, each serving a different
            entity type.
          </li>
          <li>
            <strong>Indexes:</strong> Secondary access paths on object stores. Creating an index on a property
            (e.g., <code>store.createIndex("email", "email", {"{"} unique: true {"}"})</code>) builds a B-tree
            that maps that property's values to primary keys. Indexes enable efficient lookups without full-store
            scans. They can be <code>unique</code> (enforcing no duplicate values) or <code>multiEntry</code>
            (indexing each element of an array-valued field individually). Each index adds write overhead since its
            B-tree must be updated on every insert, update, or delete.
          </li>
          <li>
            <strong>Transactions:</strong> All data access in IndexedDB occurs within transactions. Three modes
            exist: <code>readonly</code> (shared lock, multiple concurrent readers allowed),
            <code>readwrite</code> (exclusive lock on the specified stores, blocks other readwrite transactions on
            the same stores), and <code>versionchange</code> (exclusive lock on the entire database during schema
            upgrades). Transactions auto-commit when all pending IDBRequest operations complete and no new requests
            are issued in the same microtask. If any request within a transaction fails and the error is not
            handled, the entire transaction aborts and all changes roll back -- providing atomicity guarantees.
          </li>
          <li>
            <strong>IDBRequest and Event-Based API:</strong> Every operation (get, put, delete, openCursor) returns
            an <code>IDBRequest</code> object. Results arrive asynchronously via <code>onsuccess</code> and
            <code>onerror</code> event handlers. This event-driven model predates Promises in the web platform,
            which is why the raw API feels cumbersome compared to modern async/await patterns. The
            <code>IDBRequest.result</code> property holds the return value on success; <code>IDBRequest.error</code>
            holds the DOMException on failure.
          </li>
          <li>
            <strong>Structured Clone Algorithm:</strong> Values stored in IndexedDB are serialized using the
            browser's structured clone algorithm, not JSON. This means you can store objects, arrays, Dates, Blobs,
            ArrayBuffers, Maps, Sets, and RegExps natively. However, functions, DOM nodes, Error objects, and
            symbols cannot be cloned and will throw a <code>DataCloneError</code>. Class instances lose their
            prototype chain -- only own enumerable properties survive.
          </li>
          <li>
            <strong>Version Upgrades and Migrations:</strong> When multiple tabs are open and one tab triggers a
            version upgrade, all other tabs receive a <code>versionchange</code> event on their open database
            connection. They must close their connection (or the user must close those tabs) before the upgrade can
            proceed. If connections are not closed, the upgrading tab receives a <code>blocked</code> event. This
            is a critical coordination problem in multi-tab applications.
          </li>
          <li>
            <strong>Dexie.js and idb Wrappers:</strong> <strong>Dexie.js</strong> is the most widely used wrapper,
            providing a fluent, Promise-based API with built-in support for live queries (reactive data binding),
            declarative schema versioning with automatic migrations, compound indexes, and bulk operations.
            <strong>idb</strong> (by Jake Archibald) is a thinner wrapper that simply promisifies the native API
            without adding abstractions. For production applications, Dexie.js is strongly recommended for its
            developer ergonomics and handling of edge cases around transaction lifecycles.
          </li>
          <li>
            <strong>Key Ranges (IDBKeyRange):</strong> The <code>IDBKeyRange</code> API enables range-based queries
            on keys and indexes: <code>IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen)</code> for ranges,
            <code>IDBKeyRange.only(value)</code> for exact matches, <code>IDBKeyRange.lowerBound(value)</code> for
            "greater than or equal," and <code>IDBKeyRange.upperBound(value)</code> for "less than or equal." Key
            ranges work with both cursors and <code>getAll()</code> to efficiently retrieve subsets of data
            leveraging the B-tree index structure.
          </li>
          <li>
            <strong>Cursors:</strong> For iterating over large result sets without loading everything into memory.
            <code>store.openCursor(keyRange, direction)</code> returns an <code>IDBCursorWithValue</code> that
            you advance with <code>cursor.continue()</code>. Direction can be <code>"next"</code>,
            <code>"prev"</code>, <code>"nextunique"</code>, or <code>"prevunique"</code>. Cursors are essential
            for pagination patterns and for processing datasets that exceed available memory.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          IndexedDB operates as an embedded database within the browser's rendering process, scoped to the origin
          (protocol + host + port). Each origin receives an isolated set of databases invisible to other origins.
          The database engine runs on a dedicated I/O thread (separate from the main thread), so read and write
          operations do not block JavaScript execution -- results are delivered via the event loop.
        </p>

        <ArticleImage
          src="/diagrams/frontend/data-storage/indexeddb-structure.svg"
          alt="IndexedDB hierarchical structure showing Origin containing Databases, which contain Object Stores with Records and Indexes"
          caption="IndexedDB structural hierarchy: an origin contains databases, each with versioned object stores holding records accessible via primary keys and secondary B-tree indexes"
        />

        <p>
          The internal architecture follows a clear hierarchy: an <strong>origin</strong> contains zero or more
          <strong>databases</strong>, each identified by a name and version. A database contains zero or more
          <strong>object stores</strong>, each with a defined key path or key generator. An object store holds
          <strong>records</strong> (JavaScript objects) and maintains zero or more <strong>indexes</strong> as
          secondary B-tree access paths. This hierarchy is immutable outside of <code>versionchange</code>
          transactions -- you cannot add or remove stores or indexes during normal operation.
        </p>

        <ArticleImage
          src="/diagrams/frontend/data-storage/indexeddb-transaction-flow.svg"
          alt="IndexedDB transaction lifecycle showing open, lock acquisition, operation queueing, execution, and auto-commit or abort paths with concurrency model"
          caption="Transaction lifecycle and concurrency: readonly transactions share locks and run concurrently, while readwrite transactions acquire exclusive locks on their target stores"
        />

        <p>
          The transaction flow follows a strict sequence: (1) the application opens a transaction specifying target
          stores and mode, (2) the browser acquires the appropriate lock (shared for readonly, exclusive for
          readwrite), (3) the application queues operations (put, get, delete, openCursor) within the transaction
          scope, (4) each operation executes asynchronously on the I/O thread and fires success/error events,
          (5) when all requests complete and no new requests are pending in the current microtask, the transaction
          auto-commits, (6) data is durably written to the storage backend.
        </p>
        <p>
          A critical subtlety: if you <code>await</code> a non-IndexedDB Promise (such as <code>fetch()</code>)
          inside a transaction callback, the transaction will auto-commit or abort before the await resolves,
          because the browser sees no pending IDB requests in the current microtask. All IDB operations within a
          transaction must be synchronously queued. This is the most common source of IndexedDB bugs in production.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Implementation Examples
          ============================================================ */}
      <section>
        <h2>Implementation Examples</h2>
        <p>Below are practical implementations demonstrating IndexedDB usage patterns:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">Raw IndexedDB API - Database Setup, Schema Migration, and CRUD</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Dexie.js - Declarative Schema and Fluent Queries</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Cursor-Based Pagination and Key Range Queries</h3>
            <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Trade-offs & Comparisons
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>Choosing the right client-side storage mechanism requires understanding the tradeoffs across capacity, API ergonomics, data model, and browser support:</p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">IndexedDB</th>
              <th className="p-3 text-left">localStorage</th>
              <th className="p-3 text-left">Cache API</th>
              <th className="p-3 text-left">Web SQL (deprecated)</th>
              <th className="p-3 text-left">SQLite WASM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Capacity</strong></td>
              <td className="p-3">Hundreds of MB to GB</td>
              <td className="p-3">~5-10MB</td>
              <td className="p-3">Origin quota (GB+)</td>
              <td className="p-3">~50MB (browser-specific)</td>
              <td className="p-3">Origin quota (via OPFS)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Data Model</strong></td>
              <td className="p-3">Key-value object stores with B-tree indexes</td>
              <td className="p-3">String key-value pairs</td>
              <td className="p-3">Request/Response pairs</td>
              <td className="p-3">Relational (SQL)</td>
              <td className="p-3">Relational (full SQL)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>API Style</strong></td>
              <td className="p-3">Event-based (Promise wrappers available)</td>
              <td className="p-3">Synchronous, blocks main thread</td>
              <td className="p-3">Promise-based</td>
              <td className="p-3">Callback-based SQL</td>
              <td className="p-3">Synchronous SQL (in worker)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Transactions</strong></td>
              <td className="p-3">ACID with auto-commit, rollback on error</td>
              <td className="p-3">None</td>
              <td className="p-3">None</td>
              <td className="p-3">SQL transactions</td>
              <td className="p-3">Full SQL transactions</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Querying</strong></td>
              <td className="p-3">Index lookups, key ranges, cursors</td>
              <td className="p-3">Key lookup only</td>
              <td className="p-3">URL matching</td>
              <td className="p-3">Full SQL (joins, aggregates)</td>
              <td className="p-3">Full SQL (joins, aggregates)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Worker Support</strong></td>
              <td className="p-3">Available in Web Workers and Service Workers</td>
              <td className="p-3">Main thread only</td>
              <td className="p-3">Workers and Service Workers</td>
              <td className="p-3">Not standardized</td>
              <td className="p-3">Designed for workers (OPFS)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Status</strong></td>
              <td className="p-3">W3C standard, universal support</td>
              <td className="p-3">W3C standard, universal</td>
              <td className="p-3">W3C standard, universal</td>
              <td className="p-3">Deprecated, removed from spec</td>
              <td className="p-3">Emerging (wa-sqlite, sql.js)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Best For</strong></td>
              <td className="p-3">Structured app data, offline-first, client-side search</td>
              <td className="p-3">Tiny preferences, tokens, flags</td>
              <td className="p-3">HTTP response caching, static assets</td>
              <td className="p-3">Legacy apps (do not use for new work)</td>
              <td className="p-3">Complex queries, relational data in workers</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">IndexedDB vs SQLite WASM: The Emerging Frontier</h3>
          <p>
            SQLite compiled to WebAssembly (via projects like wa-sqlite and the official SQLite WASM build) is gaining
            traction as an alternative to IndexedDB for applications that need complex relational queries, JOINs, and
            aggregations. SQLite WASM typically uses the Origin Private File System (OPFS) for persistence, which
            provides synchronous file access in workers. The tradeoff is bundle size (~400KB+ for the WASM module),
            the requirement to run in a Web Worker, and less mature tooling. IndexedDB remains the better choice for
            applications that primarily need key-value access patterns with simple index lookups, and for code that
            must run on the main thread or in Service Workers.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>Building reliable IndexedDB-backed storage requires deliberate attention to transaction management, schema design, and cross-browser behavior:</p>
        <ol className="space-y-3">
          <li>
            <strong>Use Dexie.js for Production Applications:</strong> The raw IndexedDB API is verbose, error-prone,
            and requires careful manual transaction management. Dexie.js provides Promise-based queries, declarative
            versioned schemas with automatic migrations, live queries for reactive UI integration, and bulk operations.
            It handles the microtask-level transaction lifecycle correctly, eliminating the most common class of
            IndexedDB bugs. Reserve raw API usage for libraries and performance-critical paths.
          </li>
          <li>
            <strong>Keep Transactions Short and Focused:</strong> Transactions hold locks. A long-running readwrite
            transaction blocks other readwrite transactions on the same stores. Never perform network requests, heavy
            computation, or non-IDB async work inside a transaction. Gather your data first, then open a transaction,
            perform all IDB operations synchronously within it, and let it auto-commit.
          </li>
          <li>
            <strong>Design Indexes Based on Query Patterns:</strong> Create indexes only on properties you actually
            query by. Each index is a separate B-tree that must be updated on every write, adding overhead. Use
            compound indexes (<code>createIndex("name_date", ["name", "date"])</code>) for multi-field queries
            rather than relying on multiple single-field indexes. Profile read-vs-write ratios before adding indexes
            to write-heavy stores.
          </li>
          <li>
            <strong>Handle versionchange Events Across Tabs:</strong> Listen for the <code>versionchange</code> event
            on every open database connection. When received, close the connection and either reload the page or
            re-open at the new version. Without this handler, users with multiple tabs will experience a hung database
            upgrade. Dexie.js handles this automatically with its <code>on("versionchange")</code> hook.
          </li>
          <li>
            <strong>Batch Writes for Performance:</strong> Opening a transaction has overhead. When inserting or
            updating many records, batch them into a single readwrite transaction. Dexie.js provides
            <code>bulkPut()</code> and <code>bulkAdd()</code> methods that are 10-50x faster than individual puts
            for large datasets. For the raw API, queue all put requests within a single transaction scope.
          </li>
          <li>
            <strong>Monitor and Request Storage Quota:</strong> Use <code>navigator.storage.estimate()</code> to
            check available quota before large writes. Request persistent storage with
            <code>navigator.storage.persist()</code> for user-generated data that should survive browser storage
            pressure. Implement graceful degradation with LRU eviction when quota is exhausted.
          </li>
          <li>
            <strong>Use Cursors for Large Result Sets:</strong> Avoid <code>getAll()</code> on stores with tens of
            thousands of records. Use cursors with key ranges to paginate and keep memory usage predictable. This
            is especially important on mobile devices with limited memory.
          </li>
          <li>
            <strong>Move Heavy Operations to Web Workers:</strong> IndexedDB is available in Web Workers and Service
            Workers. For bulk imports, data migrations, or complex cursor-based processing, offload to a worker to
            keep the main thread responsive. The IDB API works identically in workers.
          </li>
        </ol>
      </section>

      {/* ============================================================
          SECTION 7: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>These are the most frequent production issues encountered with IndexedDB:</p>
        <ul className="space-y-3">
          <li>
            <strong>Forgetting onupgradeneeded:</strong> Opening a database without an <code>onupgradeneeded</code>
            handler means no object stores or indexes will be created if the database does not yet exist. The
            <code>onsuccess</code> handler will fire, but the database will be empty. Always provide an
            <code>onupgradeneeded</code> handler that creates the full schema for fresh installations and handles
            incremental migrations for version upgrades.
          </li>
          <li>
            <strong>Awaiting Non-IDB Promises in Transactions:</strong> If you <code>await fetch()</code> or any
            non-IndexedDB Promise inside a transaction callback, the transaction will auto-commit or abort before
            the await resolves. The browser detects that no IDB requests are pending and closes the transaction.
            All IDB operations must be synchronously queued within the transaction's microtask. Fetch data before
            opening the transaction, or restructure your code to separate network and storage concerns.
          </li>
          <li>
            <strong>Blocking Version Changes Across Tabs:</strong> When tab A has an open connection and tab B tries
            to open a higher version, tab B blocks until tab A closes its connection. Without handling the
            <code>versionchange</code> event on tab A's connection, users experience a hung upgrade with no
            feedback. Always listen for <code>versionchange</code> and close the connection promptly.
          </li>
          <li>
            <strong>Safari Storage Eviction in Private Browsing:</strong> In Safari's private browsing mode,
            IndexedDB storage is ephemeral -- data is cleared when the browsing session ends. Older versions of
            iOS Safari also evicted IndexedDB data after 7 days of inactivity (this has been relaxed with
            StorageManager.persist() in recent versions). Always test IndexedDB-dependent features in Safari private
            mode and implement fallback behavior.
          </li>
          <li>
            <strong>Storing Non-Cloneable Data:</strong> Attempting to store functions, DOM nodes, Error objects,
            Symbols, or objects with circular references throws a <code>DataCloneError</code>. Class instances lose
            their prototype chain -- only plain data survives. Sanitize data before storage, especially when storing
            objects from third-party libraries.
          </li>
          <li>
            <strong>Ignoring Quota Exceeded Errors:</strong> When storage is full, write operations fail with
            <code>QuotaExceededError</code>. If not caught, data is silently lost. Wrap all write operations in
            error handlers and implement an eviction strategy for when quota is exhausted.
          </li>
          <li>
            <strong>Over-Indexing Write-Heavy Stores:</strong> Each index is a B-tree updated on every write. A store
            with 5+ indexes will see measurably degraded write throughput. Audit your indexes periodically and remove
            any that are not used in queries. Measure the actual read-vs-write ratio before adding indexes.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 8: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <p>IndexedDB is the right tool when your application needs to manage large, structured, queryable data on the client:</p>
        <ul className="space-y-3">
          <li>
            <strong>Offline-First Applications:</strong> Apps like Notion, Linear, and Figma use IndexedDB to store
            documents, issues, and design data locally. Users create, edit, and delete content while offline, and
            changes sync when connectivity returns. IndexedDB serves as the local source of truth, with the server
            acting as the persistence and sync coordination layer.
          </li>
          <li>
            <strong>Email and Messaging Clients:</strong> Web-based email clients (Outlook Web, Gmail) cache
            thousands of messages in IndexedDB with indexes on date, sender, and labels. This enables instant search,
            offline reading, and fast list navigation without a server round-trip for every interaction.
          </li>
          <li>
            <strong>Map Tile and Geospatial Caching:</strong> Mapping applications store rendered map tiles in
            IndexedDB for offline navigation. A single city at multiple zoom levels can easily reach 100MB+.
            IndexedDB's native Blob storage makes it ideal for this binary-heavy, spatially-keyed use case.
          </li>
          <li>
            <strong>Client-Side Search Indexes:</strong> Applications with large catalogs (parts databases,
            documentation sites, product directories) build inverted indexes in IndexedDB for sub-millisecond
            client-side full-text search, eliminating server round-trips for every keystroke.
          </li>
          <li>
            <strong>Form Data and Draft Persistence:</strong> Long-form editors and multi-step wizards save
            in-progress work to IndexedDB, protecting against accidental navigation, crashes, and browser restarts.
            Unlike localStorage, IndexedDB can store the rich data structures (including embedded images as Blobs)
            that complex forms produce.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use IndexedDB</h3>
          <p>IndexedDB is not the right tool for every client-side storage need:</p>
          <ul className="mt-2 space-y-2">
            <li>
              • <strong>Small key-value config:</strong> For a theme preference, locale setting, or feature flag,
              localStorage is simpler and sufficient. Do not use IndexedDB for {'<'}100KB of flat string data.
            </li>
            <li>
              • <strong>HTTP response caching:</strong> Use the Cache API (with a Service Worker) for caching
              fetch responses. It is purpose-built for Request/Response pairs and integrates with the network stack.
            </li>
            <li>
              • <strong>Complex relational queries:</strong> If your data model requires JOINs, GROUP BY, or complex
              aggregations, consider SQLite WASM (wa-sqlite) running in a Web Worker with OPFS persistence. IndexedDB
              has no join or aggregation primitives.
            </li>
            <li>
              • <strong>Server-readable state:</strong> If the server needs to read the stored value on every request
              (session IDs, CSRF tokens), use cookies. IndexedDB is client-only and inaccessible to the server.
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/TR/IndexedDB-3/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              W3C - Indexed Database API 3.0 Specification
            </a>
          </li>
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
            <a href="https://web.dev/articles/indexeddb-best-practices" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - IndexedDB Best Practices
            </a>
          </li>
          <li>
            <a href="https://github.com/nicolo-ribaudo/idb" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              idb - A Tiny Promise-Based IndexedDB Wrapper
            </a>
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 10: Interview Questions
          ============================================================ */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Explain the IndexedDB transaction model. Why do transactions auto-commit, and what are the implications for async code?</p>
            <p className="mt-2 text-sm">
              A: IndexedDB transactions auto-commit when all pending IDBRequest operations have completed and no new
              requests are queued within the same microtask. This design ensures that transactions are as short-lived
              as possible, minimizing lock contention. The critical implication is that you cannot perform non-IDB
              async work (like <code>fetch()</code> or <code>setTimeout</code>) inside a transaction -- the browser
              will see no pending IDB requests, assume the transaction is done, and commit or abort it before your
              async callback runs. This means all data must be prepared before opening the transaction, and all IDB
              operations must be synchronously queued within the transaction scope. In practice, this is the most
              common source of IndexedDB bugs: developers write <code>await fetch()</code> inside a transaction
              expecting it to work like a SQL transaction block, but the transaction closes during the network
              request. Dexie.js mitigates this by maintaining an internal zone-tracking mechanism that keeps
              transactions alive across its own async boundaries, but not across arbitrary async operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle schema migrations in a production IndexedDB application with millions of users?</p>
            <p className="mt-2 text-sm">
              A: Schema migrations happen inside the <code>onupgradeneeded</code> handler, which receives the old
              version number and a <code>versionchange</code> transaction. The key pattern is a version switch:
              check the old version and apply incremental changes (e.g., if upgrading from v1 to v3, apply v1-to-v2
              changes then v2-to-v3 changes sequentially). Critical rules: (1) Never delete data without a migration
              path -- if renaming a store, create the new store, copy data via cursors, then delete the old one.
              (2) Keep migrations fast -- the <code>versionchange</code> transaction holds an exclusive lock on the
              entire database, blocking all other connections including other tabs. For large data migrations, create
              the new schema structure in <code>onupgradeneeded</code> but defer data migration to a background
              task after the database opens normally. (3) Handle the <code>blocked</code> event -- if other tabs
              have open connections, display a user-facing message asking them to close other tabs and refresh.
              (4) With Dexie.js, use its declarative <code>version(n).stores({"{}"})</code> API which automatically
              generates the migration logic for adding/removing stores and indexes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: You are designing a PWA that must work offline with 500,000 product records. How would you architect the IndexedDB layer?</p>
            <p className="mt-2 text-sm">
              A: The architecture has several layers: (1) <strong>Schema design:</strong> A "products" object store
              with <code>keyPath: "id"</code>, indexes only on fields used for filtering (category, price range,
              name prefix for search), and a "syncMeta" store to track last sync timestamp and delta tokens.
              (2) <strong>Initial load:</strong> Fetch the full dataset as a compressed NDJSON stream, parse
              incrementally, and use <code>bulkPut()</code> in batches of 5,000-10,000 records per transaction to
              avoid memory spikes. Show progress to the user. (3) <strong>Delta sync:</strong> On subsequent loads,
              fetch only changes since the last sync token. Apply inserts/updates/deletes in a single transaction.
              (4) <strong>Search:</strong> Build a client-side inverted index in a separate object store for
              full-text search, or use a cursor-based scan with a key range on a name index for prefix matching.
              (5) <strong>Memory management:</strong> Use cursors instead of <code>getAll()</code> for any
              UI-facing queries. Virtualize list rendering. (6) <strong>Quota:</strong> Check
              <code>navigator.storage.estimate()</code> before initial load, request persistent storage, and
              implement fallback to server-side search if storage is insufficient. (7) <strong>Multi-tab:</strong>
              Use BroadcastChannel to notify other tabs when sync completes so they can refresh their data views.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-sql-concise",
  title: "Web SQL (Deprecated)",
  description: "Guide to the deprecated Web SQL Database API covering its history, SQL-based transactions, why it was abandoned, and migration to IndexedDB.",
  category: "frontend",
  subcategory: "data-storage",
  slug: "web-sql",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "storage", "Web SQL", "deprecated", "SQLite", "IndexedDB migration"],
  relatedTopics: ["indexeddb", "localstorage", "storage-quotas-and-eviction"],
};

export default function WebSQLConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Web SQL Database</strong> was a W3C specification introduced in 2009 that exposed a SQL-based
          relational database to JavaScript running in the browser. The API allowed developers to create local
          databases, define table schemas, and execute full SQL queries (SELECT, INSERT, UPDATE, DELETE) entirely
          on the client side. Under the hood, every browser that implemented Web SQL used the same embedded
          database engine: <strong>SQLite</strong>. This was both its strength and its fatal flaw.
        </p>
        <p>
          The specification emerged during a period when web applications were rapidly increasing in complexity.
          Gmail, Google Docs, and other rich web apps needed structured client-side storage that went far beyond
          what cookies or the nascent localStorage API could provide. Web SQL filled this gap by giving frontend
          developers a familiar relational model with transactional guarantees. For teams already comfortable
          with SQL, it was an immediately productive API.
        </p>
        <p>
          However, in <strong>November 2010</strong>, the W3C officially abandoned the Web SQL specification.
          The reason was procedural but deeply important: the W3C requires that any specification advancing to
          Recommendation status must have at least two independent, interoperable implementations. Because every
          browser that shipped Web SQL relied on the exact same SQLite library, there was effectively only one
          implementation. The specification was not a formal standard that could be independently implemented; it
          was a description of SQLite&apos;s behavior. Mozilla explicitly refused to implement Web SQL for this
          reason, and without Firefox, the spec could never meet the two-implementation requirement.
        </p>
        <p>
          Understanding Web SQL remains relevant in system design interviews for several reasons. First, it
          illustrates a critical lesson about web standards governance: a technically sound API can fail for
          non-technical reasons. Second, many legacy applications still contain Web SQL code that needs migration.
          Third, comparing Web SQL with its successor IndexedDB reveals fundamental tradeoffs in API design,
          storage architecture, and the tension between developer ergonomics and standardization requirements.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The Web SQL API consisted of three primary methods that together provided a complete database interaction
          model. Understanding these is essential both for working with legacy code and for appreciating how
          IndexedDB diverged in its design philosophy.
        </p>
        <h3>openDatabase()</h3>
        <p>
          The entry point to Web SQL was <strong>openDatabase(name, version, displayName, estimatedSize)</strong>.
          This method either opened an existing database or created a new one. The version parameter was a string
          (e.g., &quot;1.0&quot;) used for schema migration. If the requested version did not match the existing
          database version, a <strong>changeVersion()</strong> method allowed migration logic to run. The
          estimatedSize parameter (in bytes) was advisory; browsers used it to decide whether to prompt the user
          for permission. The default storage quota was typically <strong>5 MB per origin</strong>. If an
          application needed more, the browser would show a permission dialog to the user, which was a significant
          UX concern for applications requiring large local datasets.
        </p>
        <h3>transaction() and readTransaction()</h3>
        <p>
          All database operations were wrapped in transactions. The <strong>transaction()</strong> method provided
          read-write access, while <strong>readTransaction()</strong> provided read-only access with potential
          performance benefits since the engine could allow concurrent readers. Transactions were atomic: if any
          SQL statement within a transaction failed, the entire transaction was rolled back. This provided the same
          ACID guarantees that backend developers expected from server-side databases.
        </p>
        <h3>executeSql()</h3>
        <p>
          Within a transaction callback, <strong>executeSql(sqlStatement, arguments, successCallback,
          errorCallback)</strong> executed individual SQL statements. The arguments array provided parameterized
          queries, which were critical for preventing SQL injection. Results were returned asynchronously via
          callbacks, with the result set providing <strong>rows.length</strong> and <strong>rows.item(index)</strong>
          for iteration. The async callback pattern was standard for its era but led to deeply nested code structures
          that modern Promise-based APIs have largely replaced.
        </p>
        <h3>SQL Syntax in the Browser</h3>
        <p>
          Because the underlying engine was SQLite, the SQL dialect supported was SQLite&apos;s variant of SQL.
          This included CREATE TABLE, ALTER TABLE, DROP TABLE, standard DML operations, JOINs, subqueries,
          aggregate functions, and even some SQLite-specific features like <strong>AUTOINCREMENT</strong> and
          <strong>PRAGMA</strong> statements. This was remarkably powerful for a browser API, but it also meant
          the &quot;specification&quot; was implicitly defined by SQLite&apos;s source code rather than by a
          formal grammar. Any ambiguity in SQL behavior was resolved by &quot;whatever SQLite does,&quot; which
          is not how web standards are supposed to work.
        </p>
        <h3>Version Management</h3>
        <p>
          Web SQL provided a basic schema migration mechanism through database versioning. When opening a database,
          if the version string did not match, developers could use <strong>changeVersion(oldVersion, newVersion,
          callback)</strong> to run migration SQL. This was simple but limited: there was no built-in migration
          chain, no rollback mechanism, and version strings were arbitrary. In practice, many applications ignored
          versioning entirely or implemented ad-hoc migration logic, which made upgrades fragile. IndexedDB later
          improved on this with its integer-based version system and structured <strong>onupgradeneeded</strong>
          event.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The Web SQL architecture was deceptively simple on the surface but had deep implications for browser
          engineering and web standards.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/websql-architecture.svg"
          alt="Web SQL architecture showing JavaScript to Web SQL API to embedded SQLite engine to on-disk database, highlighting the single-implementation problem"
          caption="Web SQL architecture: every browser embedded the same SQLite engine, making independent implementation impossible."
        />
        <p>
          When a JavaScript application called <strong>openDatabase()</strong>, the browser created (or opened)
          a SQLite database file scoped to the current origin. Each origin received its own isolated database
          namespace, following the same-origin policy. The browser&apos;s rendering process communicated with an
          embedded SQLite instance that performed all SQL parsing, query planning, and disk I/O. From the
          JavaScript perspective, this was asynchronous: the main thread was not blocked during database operations.
          Internally, however, the browser had to manage thread coordination between the JavaScript execution
          context and the SQLite engine, which typically ran on a separate I/O thread.
        </p>
        <p>
          The critical architectural detail was the SQLite dependency. Chrome, Safari, and Opera all compiled
          SQLite directly into their browser binaries. When a new SQLite version was released with bug fixes or
          behavior changes, each browser independently chose when to update. This created a fragmentation problem:
          the &quot;same&quot; Web SQL API could behave differently across browsers not because of implementation
          differences in the API layer, but because of SQLite version differences. A query that worked on
          Chrome 25 (with SQLite 3.7.x) might produce subtly different results on Safari 6 (with SQLite 3.7.y)
          if there were edge-case behavior differences between those SQLite point releases.
        </p>
        <p>
          The storage layer was straightforward: SQLite stored data in a single file on disk per database, using
          its well-known B-tree page format. The browser enforced quota limits at the origin level. When the
          5 MB default was reached, the browser could prompt the user for permission to allocate more storage,
          typically in increments (10 MB, 25 MB, 50 MB). This user-facing permission prompt was another reason
          Web SQL fell out of favor: it interrupted the user experience in a way that modern storage APIs, with
          their more generous and transparent quota management, avoid.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Implementation Examples
          ============================================================ */}
      <section>
        <h2>Implementation Examples</h2>
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">Example code moved to the Example tab.</div>
      </section>

      {/* ============================================================
          SECTION 5: Trade-offs Table
          ============================================================ */}
      <section>
        <h2>Storage API Comparison</h2>
        <p>
          Understanding why IndexedDB replaced Web SQL requires a direct comparison of the three primary
          client-side storage mechanisms. Each made fundamentally different tradeoffs around query power,
          standardization, and developer experience.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-storage/websql-vs-indexeddb.svg"
          alt="Side-by-side comparison of Web SQL (deprecated) and IndexedDB (standard) showing features, browser support, and W3C timeline"
          caption="Web SQL vs IndexedDB: the standardization timeline and feature comparison that determined the winner."
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="py-2 pr-4">Dimension</th>
                <th className="py-2 pr-4">Web SQL</th>
                <th className="py-2 pr-4">IndexedDB</th>
                <th className="py-2">localStorage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Data Model</td>
                <td className="py-2 pr-4">Relational tables with SQL</td>
                <td className="py-2 pr-4">Key-value with indexes</td>
                <td className="py-2">Key-value strings only</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Query Language</td>
                <td className="py-2 pr-4">Full SQL (SQLite dialect)</td>
                <td className="py-2 pr-4">Cursor-based API, key ranges</td>
                <td className="py-2">getItem/setItem only</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Transactions</td>
                <td className="py-2 pr-4">Full ACID, read/write separation</td>
                <td className="py-2 pr-4">ACID with versionchange, readonly, readwrite</td>
                <td className="py-2">None (synchronous)</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Async Model</td>
                <td className="py-2 pr-4">Nested callbacks</td>
                <td className="py-2 pr-4">Event-based (IDBRequest)</td>
                <td className="py-2">Synchronous (blocks main thread)</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Storage Limit</td>
                <td className="py-2 pr-4">5 MB default, user prompt for more</td>
                <td className="py-2 pr-4">~50% of disk (browser-dependent)</td>
                <td className="py-2">5-10 MB per origin</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Data Types</td>
                <td className="py-2 pr-4">SQL types (TEXT, INTEGER, REAL, BLOB)</td>
                <td className="py-2 pr-4">Structured clone (objects, arrays, blobs, files)</td>
                <td className="py-2">Strings only (must JSON.stringify)</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Standardization</td>
                <td className="py-2 pr-4 text-orange-600 dark:text-orange-400">Abandoned (2010)</td>
                <td className="py-2 pr-4 text-green-600 dark:text-green-400">W3C Recommendation</td>
                <td className="py-2 text-green-600 dark:text-green-400">W3C Recommendation</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Browser Support</td>
                <td className="py-2 pr-4">Chrome (removed 2024), Safari only</td>
                <td className="py-2 pr-4">All modern browsers</td>
                <td className="py-2">All browsers</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Developer Ergonomics</td>
                <td className="py-2 pr-4">High (SQL is widely known)</td>
                <td className="py-2 pr-4">Low (verbose API, use Dexie.js)</td>
                <td className="py-2">Very high (simple key-value)</td>
              </tr>
              <tr className="border-b border-theme/40">
                <td className="py-2 pr-4 font-medium">Use in Workers</td>
                <td className="py-2 pr-4">Yes (Web Workers)</td>
                <td className="py-2 pr-4">Yes (Web Workers, Service Workers)</td>
                <td className="py-2">No</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The table reveals the central irony of Web SQL&apos;s deprecation: it was arguably the most
          developer-friendly storage API the browser ever offered. SQL is a universal skill among backend
          engineers, and having it available client-side dramatically lowered the barrier to building offline-capable
          applications. IndexedDB won not because it was a better developer experience (it is widely regarded as
          having one of the worst APIs in the web platform), but because it could be independently implemented
          by different browser engines. The standardization process prioritized implementation diversity over
          developer ergonomics, which is a tradeoff worth understanding at the staff/principal level.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices: Migration & Detection</h2>
        <p>
          For any team maintaining code that uses Web SQL, migration is not optional but urgent. Chrome removed
          Web SQL in version 119 (late 2024), and Safari is the only remaining browser with support. The
          migration path is well-established.
        </p>
        <h3>Feature Detection</h3>
        <p>
          Before attempting any Web SQL operation, always check for the API&apos;s existence:
          <strong> typeof window.openDatabase === &apos;function&apos;</strong>. Never assume Web SQL is available.
          Combine this with an IndexedDB check to determine the appropriate storage backend. This detection
          should happen once at application startup and the result should be cached to avoid repeated checks.
        </p>
        <h3>Migration to IndexedDB via Dexie.js</h3>
        <p>
          Direct IndexedDB usage is verbose and error-prone. For migration, adopt a wrapper library like
          <strong> Dexie.js</strong>, which provides a Promise-based API that is far more ergonomic than raw
          IndexedDB. Dexie supports schema versioning with automatic migration, compound indexes, and a
          query syntax that feels closer to the SQL-like experience developers had with Web SQL. The migration
          process involves: (1) reading all data from Web SQL tables, (2) transforming relational rows into
          the key-value/object model IndexedDB expects, (3) writing data to IndexedDB object stores, and
          (4) verifying the migration before deleting the Web SQL database.
        </p>
        <h3>Progressive Fallback Strategy</h3>
        <p>
          During a migration period, implement a storage abstraction layer that tries IndexedDB first and falls
          back to Web SQL if IndexedDB is unavailable (extremely rare in modern browsers, but possible in some
          WebView environments). The abstraction should expose a unified interface so application code does not
          need to know which backend is in use. After the migration period ends, remove the Web SQL fallback
          entirely to reduce code complexity and eliminate the dependency on a deprecated API.
        </p>
        <h3>Data Integrity During Migration</h3>
        <p>
          Run Web SQL reads and IndexedDB writes within a migration transaction that verifies row counts and
          checksums. Log migration progress to detect partial failures. If the application is a Progressive Web
          App with Service Worker caching, ensure the migration logic runs in the main thread (not the Service
          Worker) since Web SQL access from Service Workers was never widely supported.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Common Pitfalls — Why Web SQL Was Deprecated
          ============================================================ */}
      <section>
        <h2>Common Pitfalls: Why Web SQL Was Deprecated</h2>
        <p>
          The deprecation of Web SQL is one of the most instructive case studies in web platform history. It was
          not deprecated because it was a bad API; it was deprecated because of fundamental problems with how
          it was specified and what that meant for the open web.
        </p>
        <h3>The Single-Implementation Dependency</h3>
        <p>
          The most critical issue was that the Web SQL specification did not describe an abstract database
          interface that multiple engines could implement. It described SQLite&apos;s behavior. Section 4.1 of
          the spec literally stated that the SQL dialect was &quot;the dialect of SQL supported by SQLite.&quot;
          This meant any browser wanting to implement Web SQL had two choices: embed SQLite (creating a
          monoculture) or build a SQLite-compatible SQL engine from scratch (an enormous engineering effort with
          no guarantee of behavioral compatibility). No browser chose the second option. The W3C&apos;s charter
          requires specifications to be implementable by multiple independent parties; Web SQL fundamentally
          could not meet this requirement.
        </p>
        <h3>Security Concerns with Browser-Side SQL</h3>
        <p>
          Exposing a SQL parser to untrusted web content created a large attack surface. SQL injection, which
          is already a top security vulnerability in server-side applications, became a client-side concern.
          While parameterized queries mitigated direct injection, the presence of a full SQL engine in the
          browser meant that any SQLite vulnerability (buffer overflows, type confusion bugs) was directly
          exploitable from web content. The <strong>Magellan</strong> vulnerability (CVE-2018-20346 and related)
          demonstrated this risk: a SQLite memory corruption bug that was exploitable through Web SQL in Chrome,
          allowing remote code execution from a malicious webpage. This was not a theoretical concern but an
          actual security incident that reinforced the decision to deprecate.
        </p>
        <h3>The Standardization Paradox</h3>
        <p>
          Web SQL illustrated a broader tension in web standards: sometimes the most developer-friendly solution
          is not the most standardizable one. SQL is powerful precisely because it is a complex, nuanced language
          with decades of implementation-specific behavior. Standardizing a subset of SQL that was both useful and
          independently implementable proved impossible within the W3C process. IndexedDB took the opposite
          approach: a lower-level, less ergonomic API that any browser could implement from scratch without
          depending on a third-party database engine.
        </p>
        <h3>Fragmentation Risk</h3>
        <p>
          Even among browsers that shipped Web SQL, the behavior was not identical because they embedded different
          SQLite versions. SQLite releases occasionally change edge-case behaviors (NULL handling in certain
          aggregate functions, collation sequences, integer overflow behavior). These differences were subtle but
          could cause data corruption or logic errors in applications that relied on specific SQLite behaviors.
          This is the kind of cross-browser inconsistency that web standards exist to prevent, and Web SQL&apos;s
          architecture made it unavoidable.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <h3>Legacy Applications</h3>
        <p>
          Many enterprise applications built between 2010 and 2015 used Web SQL for offline data storage,
          particularly in mobile web apps targeting iOS Safari and Android&apos;s default browser. These
          applications often stored form data, transaction records, or cached API responses in Web SQL tables.
          Some of these applications are still in production, especially in industries like healthcare and field
          services where tablet-based tools have long deployment cycles. Teams maintaining these applications
          face a hard deadline for migration now that Chrome has removed support.
        </p>
        <h3>PhoneGap/Cordova Applications</h3>
        <p>
          The Cordova (formerly PhoneGap) ecosystem heavily relied on Web SQL through plugins like
          <strong> cordova-plugin-websql</strong>. Many hybrid mobile apps used Web SQL as their primary
          local database. The migration path for these applications typically involves switching to
          <strong> cordova-plugin-sqlite-storage</strong> (which uses native SQLite directly, bypassing the
          browser&apos;s Web SQL API) or migrating to IndexedDB with a wrapper library.
        </p>
        <h3>Why It Is Still Interview-Relevant</h3>
        <p>
          In system design interviews, Web SQL serves as a case study for several important topics: the
          relationship between API design and standardization, the risks of single-vendor dependencies in web
          platform features, the tradeoffs between developer experience and implementation diversity, and the
          general principle that deprecated does not mean disappeared (legacy systems persist for years or
          decades). When discussing client-side storage architecture, demonstrating awareness of Web SQL&apos;s
          history shows depth of understanding beyond just knowing the current API surface.
        </p>
        <h3>When NOT to Use Web SQL</h3>
        <p>
          The answer is unambiguous: <strong>never use Web SQL in any new project</strong>. It is removed from
          Chrome, never supported in Firefox, and its specification is officially abandoned. Safari is the only
          remaining browser with support, and there is no guarantee it will continue. Any new client-side storage
          requirement should use IndexedDB (directly or through Dexie.js) for structured data, localStorage for
          small key-value pairs, the Cache API for HTTP response caching, or the Origin Private File System (OPFS)
          for high-performance file-like storage. The web platform has moved decisively past Web SQL, and there
          is no scenario where choosing it for new development is defensible.
        </p>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <strong>W3C Web SQL Database Specification (Discontinued)</strong> — The original specification
            document, now marked as no longer maintained. Essential reading for understanding exactly what
            was specified and where the specification explicitly deferred to SQLite behavior.
          </li>
          <li>
            <strong>Chrome Platform Status: Web SQL Removal</strong> — Chrome&apos;s deprecation and removal
            timeline, including the rationale for removing the API in Chrome 119 and the intent-to-remove
            discussion from the Blink development mailing list.
          </li>
          <li>
            <strong>MDN Web Docs: Web SQL Database</strong> — Mozilla&apos;s documentation explicitly noting
            the deprecated status and recommending IndexedDB as the replacement, with links to migration
            guides and compatibility data.
          </li>
          <li>
            <strong>Dexie.js Documentation</strong> — The most widely used IndexedDB wrapper library.
            Its migration guides and API reference are essential resources for teams moving from Web SQL
            to IndexedDB.
          </li>
          <li>
            <strong>SQLite in Browsers: Security Implications (Magellan Vulnerabilities)</strong> —
            Tencent Blade Team&apos;s disclosure of SQLite vulnerabilities exploitable through Web SQL,
            demonstrating the security risks of embedding a SQL engine in the browser.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 10: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <h3>Q1: Why was Web SQL deprecated despite being a useful API?</h3>
        <p>
          Web SQL was deprecated because it failed the W3C&apos;s fundamental requirement for standardization:
          multiple independent implementations. Every browser that shipped Web SQL embedded the same SQLite
          library, meaning the specification was effectively &quot;do what SQLite does&quot; rather than a
          formal, independently implementable standard. Mozilla refused to implement it for this reason,
          making it impossible for the spec to advance. Additionally, embedding a full SQL engine in the browser
          created a significant security attack surface, as demonstrated by the Magellan vulnerabilities that
          allowed remote code execution through SQLite bugs exploitable via Web SQL. The deprecation was not
          about the API being poorly designed; it was about the web platform needing standards that any browser
          engine can implement independently, which a SQLite-dependent specification could never be. This is a
          key distinction: technical quality and standardizability are different axes, and Web SQL scored well
          on the first but failed on the second.
        </p>

        <h3>Q2: How does IndexedDB differ from Web SQL architecturally, and why did it succeed as a standard?</h3>
        <p>
          IndexedDB and Web SQL took fundamentally different approaches to the same problem. Web SQL exposed a
          high-level relational model with full SQL query capabilities, but this required embedding a specific
          SQL engine (SQLite) in every browser. IndexedDB instead exposed a lower-level key-value store with
          indexes, cursors, and key ranges. This lower-level API could be implemented by any browser using
          whatever underlying storage engine it preferred: Chrome uses a LevelDB-based backend, Firefox uses a
          custom B-tree implementation, and Safari ironically uses SQLite internally for its IndexedDB
          implementation. The key difference is that IndexedDB&apos;s specification describes abstract behaviors
          (how keys are compared, how indexes are maintained, how transactions isolate) rather than deferring to
          a specific engine&apos;s behavior. This allowed each browser to build its own implementation,
          satisfying the W3C requirement. The tradeoff was developer experience: IndexedDB&apos;s API is
          notoriously verbose and unintuitive compared to SQL, which is why wrapper libraries like Dexie.js
          became essential. At the architectural level, IndexedDB also supports storing structured data (via
          the structured clone algorithm) including Blobs and Files, while Web SQL was limited to SQL data types.
        </p>

        <h3>Q3: How would you approach migrating a legacy application from Web SQL to IndexedDB?</h3>
        <p>
          Migration from Web SQL to IndexedDB requires a phased approach. First, audit the existing Web SQL
          usage: catalog all databases, tables, schemas, and query patterns. Map the relational schema to an
          IndexedDB object store design, which often means denormalizing data since IndexedDB does not support
          JOINs. Second, implement the IndexedDB layer using Dexie.js rather than raw IndexedDB to maintain
          developer productivity. Define Dexie schemas that mirror the essential data structures, using compound
          indexes to support the query patterns that SQL JOINs previously handled. Third, write a one-time
          migration script that reads all data from Web SQL using executeSql, transforms it into the new object
          store format, and writes it to IndexedDB in batched transactions. Include checksums and row count
          verification to detect partial migrations. Fourth, implement a storage abstraction layer in the
          application so that business logic does not directly reference either storage API. This layer should
          detect which storage backend has data and route accordingly during the transition period. Fifth, after
          confirming all users have migrated (via telemetry on the storage backend in use), remove the Web SQL
          code path entirely. Throughout this process, pay special attention to transaction semantics: Web SQL
          supported multi-statement transactions with automatic rollback, while IndexedDB transactions auto-commit
          when the event loop is reached, which can cause subtle bugs if the migration does not account for this
          behavioral difference.
        </p>
      </section>
    </ArticleLayout>
  );
}

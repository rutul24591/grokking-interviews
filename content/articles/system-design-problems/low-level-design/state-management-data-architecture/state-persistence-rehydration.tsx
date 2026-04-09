"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-state-persistence",
  title: "State Persistence & Rehydration Strategies",
  description:
    "Production-grade state persistence — localStorage vs IndexedDB, versioned storage, selective persistence, encryption for sensitive data, and cross-device sync.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "state-persistence-rehydration",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "persistence", "rehydration", "indexeddb", "localStorage", "encryption", "versioning"],
  relatedTopics: ["transient-vs-persistent-ui-state", "cross-tab-state-synchronization"],
};

export default function StatePersistenceRehydrationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          User state (preferences, form drafts, theme, layout) should persist
          across page reloads and browser sessions. Naive persistence (store
          everything to localStorage) wastes storage, exposes sensitive data,
          and creates stale state bugs. We need selective persistence (persist
          only what matters), versioned storage (schema migration on load),
          appropriate storage backends (localStorage for small data, IndexedDB
          for large), encryption for sensitive data, and a rehydration pipeline
          that validates and migrates stored data before applying it.
        </p>
        <p><strong>Assumptions:</strong> React 19+, modern browsers, some sensitive data (tokens, PII).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Selective Persistence:</strong> Only persist marked state fields. Transient fields excluded. Configurable per state slice.</li>
          <li><strong>Storage Backend Selection:</strong> Small data (&lt;5MB) → localStorage. Large data (drafts, offline cache) → IndexedDB.</li>
          <li><strong>Versioned Storage:</strong> Stored data includes schema version. On load, migration functions transform old schema to current.</li>
          <li><strong>Encryption:</strong> Sensitive data encrypted before storage. Decrypted on load. Keys derived from user-specific secret.</li>
          <li><strong>Rehydration Pipeline:</strong> On app init, load stored data → validate → migrate → merge with defaults → populate store.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Stored data corrupted (partial write, user tampering) — validation fails, discard and use defaults.</li>
          <li>Storage quota exceeded — evict oldest non-critical data, notify user.</li>
          <li>Schema migration fails (no migration path from v1 to v3) — discard, use defaults, log error.</li>
          <li>User clears storage — graceful fallback to defaults, no crash.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Store config declares which fields persist, their storage backend, and
          sensitivity level. On state change, persistence middleware serializes
          marked fields, encrypts sensitive ones, and writes to appropriate backend
          (debounced). On app init, rehydration pipeline reads from storage,
          validates against current schema, runs migrations, merges with defaults,
          and populates the store. Failed validation/migration results in defaults
          with logged warnings.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Persistence Config (<code>lib/persistence-config.ts</code>)</h4>
          <p>Declares which state fields persist, storage backend, sensitivity, and priority. Used by both save and load pipelines.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Storage Adapter (<code>lib/storage-adapter.ts</code>)</h4>
          <p>Unified API over localStorage and IndexedDB. selectBackend(sensitivity, size) returns appropriate storage. Handles quota errors.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Encryption Module (<code>lib/encryption.ts</code>)</h4>
          <p>AES-GCM encryption for sensitive fields. Key derived from user ID + salt via PBKDF2. Encrypt before save, decrypt on load.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Migration Pipeline (<code>lib/migration-pipeline.ts</code>)</h4>
          <p>Chain of migration functions: v1→v2, v2→v3. On load, detects stored version, runs migrations sequentially to current version.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Rehydration Engine (<code>lib/rehydration-engine.ts</code>)</h4>
          <p>Loads stored data → decrypts → validates (Zod) → migrates → merges with defaults → returns hydrated state. Handles failures gracefully.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration (<code>hooks/usePersistedStore.ts</code>)</h4>
          <p>Hook that creates store with persistence. Rehydrates on mount, auto-saves on changes (debounced). Returns store + persistence status.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/state-persistence-rehydration-architecture.svg"
          alt="State persistence pipeline showing selective persistence, encryption, storage backends, and rehydration flow"
          caption="State Persistence & Rehydration Pipeline"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>Save: state change → select persistent fields → encrypt sensitive → debounce write → storage. Load: read from storage → decrypt → validate → migrate → merge with defaults → populate store.</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Corrupted storage:</strong> Partial JSON in localStorage. Zod validation fails → discard stored data, use defaults, log warning with stored value for debugging.</li>
          <li><strong>Missing migration path:</strong> Stored data is v1, current is v4, migrations only cover v2→v3→v4. Cannot migrate v1. Discard stored data, use defaults, notify user that previous data was lost.</li>
          <li><strong>Encryption key lost:</strong> User clears browser data including encryption key. Cannot decrypt stored sensitive fields. Treat as missing data — prompt user to re-enter (e.g., re-login).</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: persistence config, storage adapter, encryption, migration pipeline, rehydration engine, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">localStorage write</td><td className="p-2">O(1) — ~1-5ms sync</td></tr>
              <tr><td className="p-2">IndexedDB write</td><td className="p-2">O(1) — ~5-20ms async</td></tr>
              <tr><td className="p-2">Encryption/decryption</td><td className="p-2">O(d) — d data size</td></tr>
              <tr><td className="p-2">Migration (v1→vN)</td><td className="p-2">O(N × f) — N steps, f fields each</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Never persist tokens in localStorage — use httpOnly cookies. Sensitive fields encrypted with AES-GCM. Test: persistence save/load cycle, encryption/decryption correctness, migration chain correctness, corrupted data handling, quota eviction, rehydration with partial data.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Persisting everything:</strong> Stores full state tree — wastes storage, persists transient data. Fix: selective persistence config.</li>
          <li><strong>No version migration:</strong> Schema changes break stored data. Fix: version number + migration functions for each schema change.</li>
          <li><strong>Storing sensitive data unencrypted:</strong> Tokens, PII in localStorage readable by any script. Fix: encrypt or don&apos;t store client-side.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you sync persisted state across devices?</p>
            <p className="mt-2 text-sm">
              A: Client-side storage can&apos;t cross devices. Use a server-side sync
              service: client uploads persisted state to /api/sync (encrypted),
              other devices download on connect. Resolve conflicts via last-write-wins
              with timestamps, or field-level merge for complex state. Use CRDTs
              for conflict-free multi-device edits.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN — IndexedDB API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN — Web Crypto API</a></li>
          <li><a href="https://localforage.github.io/localForage/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">localForage — Offline Storage</a></li>
          <li><a href="https://redux.js.org/usage/structuring-reducers/setting-up-state-shape" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Redux — Persisting State</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-transient-persistent-state",
  title: "Transient vs Persistent UI State",
  description:
    "Decision framework for transient UI state vs persistent user state — session-only data, auto-save drafts, localStorage vs IndexedDB, and state lifecycle management.",
  category: "low-level-design",
  subcategory: "state-management-data-architecture",
  slug: "transient-vs-persistent-ui-state",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-04-08",
  tags: ["lld", "transient-state", "persistent-state", "auto-save", "localStorage", "indexeddb", "state-lifecycle"],
  relatedTopics: ["state-persistence-rehydration", "local-vs-global-state-strategy"],
};

export default function TransientVsPersistentUIStateArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          UI state falls into two categories: transient (session-only, lost on
          refresh — loading states, modal open/close, scroll position) and
          persistent (survives refresh — user preferences, form drafts, theme).
          Mixing them causes problems: persisting transient state wastes storage
          and creates stale data; not persisting important state loses user work.
          We need a clear classification system and persistence strategies for
          each state type.
        </p>
        <p><strong>Assumptions:</strong> React 19+, localStorage/IndexedDB available, offline support needed.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Classification & Persistence Strategy</h3>
        <ul className="space-y-2">
          <li><strong>Transient State:</strong> Component-scoped, short-lived. No persistence. Cleared on unmount/navigate.</li>
          <li><strong>Session State:</strong> Tab-scoped, survives navigation within tab. sessionStorage or memory cache. Cleared on tab close.</li>
          <li><strong>Persistent State:</strong> User-scoped, survives refresh/close. localStorage/IndexedDB with versioning and migration.</li>
          <li><strong>Auto-Save Drafts:</strong> User edits saved incrementally (every 2s). Conflict resolution when multiple tabs edit same draft.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User switches from persistent to transient mid-session (e.g., clears preferences) — migration path needed.</li>
          <li>Storage quota exceeded — graceful degradation, clear oldest non-critical data.</li>
          <li>Conflicting drafts from two tabs — merge or notify user.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          State classified at definition time: transient (useState, no persistence),
          session (sessionStorage, tab-scoped), persistent (localStorage/IndexedDB
          with version). Auto-save drafts use debounced writes to localStorage with
          conflict detection (timestamp comparison). A persistence manager handles
          serialization, version migration, quota management, and cleanup.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules</h3>
        <p>Six modules:</p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. State Classifier (<code>lib/state-classifier.ts</code>)</h4>
          <p>Classifies state as transient, session, or persistent based on lifecycle, scope, and importance. Provides classification guidelines for engineers.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Persistence Manager (<code>lib/persistence-manager.ts</code>)</h4>
          <p>Handles save/load for persistent state. Supports localStorage (small data) and IndexedDB (large data). Version migration, quota management.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Auto-Save Engine (<code>lib/auto-save-engine.ts</code>)</h4>
          <p>Debounced writes (2s interval). Conflict detection via timestamps. Merge strategy for concurrent edits. Queue for offline writes.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Version Migrator (<code>lib/version-migrator.ts</code>)</h4>
          <p>Migrates persisted state between schema versions. Runs migration functions on load. Handles breaking changes gracefully.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Quota Manager (<code>lib/quota-manager.ts</code>)</h4>
          <p>Monitors storage usage. Evicts oldest non-critical data when quota nears limit. Warns user before data loss.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. React Integration (<code>hooks/usePersistentState.ts</code>)</h4>
          <p>Hook that combines useState with persistence. Auto-saves on change, loads on mount, handles migration. Returns state value, setter function, and persistence status.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/transient-vs-persistent-ui-state-architecture.svg"
          alt="State classification showing transient, session, and persistent state with persistence strategies"
          caption="State Classification & Persistence Architecture"
        />
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>State defined → classified → persistence strategy applied. Transient: memory only. Session: sessionStorage. Persistent: localStorage/IndexedDB with auto-save. On load: read from storage, migrate if needed, populate state.</p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-3">
          <li><strong>Quota exceeded:</strong> Persistence manager catches QuotaExceededError, evicts oldest non-critical data (marked with priority), retries. If still fails, notifies user.</li>
          <li><strong>Schema migration failure:</strong> Persisted state can&apos;t be migrated to new schema. Fall back to defaults, log error, offer user to restore old data.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>Complete implementation: state classifier, persistence manager, auto-save engine, version migrator, quota manager, and React hook.</p>
        </div>
      </section>

      <section>
        <h2>Performance</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">localStorage write</td><td className="p-2">O(1) — synchronous, ~1-5ms</td></tr>
              <tr><td className="p-2">IndexedDB write</td><td className="p-2">O(1) — async, ~5-20ms</td></tr>
              <tr><td className="p-2">Version migration</td><td className="p-2">O(v) — v migration steps</td></tr>
              <tr><td className="p-2">Quota check</td><td className="p-2">O(1) — estimateUsage()</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security & Testing</h2>
        <p>Never persist tokens, PII, or sensitive data. Persisted data validated on load — malformed data discarded. Test: persistence save/load cycle, version migration correctness, quota eviction, auto-save debounce timing, concurrent tab conflict resolution.</p>
      </section>

      <section>
        <h2>Interview Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Persisting everything:</strong> Engineers persist all state &quot;just in case&quot; — wastes storage, creates stale data. Fix: classify at definition time, persist only what user would miss.</li>
          <li><strong>No version migration:</strong> Schema changes break persisted data. Fix: version number + migration functions.</li>
          <li><strong>Sync writes for large data:</strong> Using localStorage for large datasets (10MB+) — blocks main thread. Fix: IndexedDB for large data, async operations.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle auto-save conflicts when two tabs edit the same draft?</p>
            <p className="mt-2 text-sm">
              A: Each save includes a timestamp and the full draft. On load,
              compare timestamps — latest wins. If timestamps are within 5 seconds
              (concurrent edits), do a field-level merge: for each field, take the
              version with the later timestamp. If the same field was edited in
              both tabs (true conflict), notify the user and show a diff view to
              manually resolve.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you persist state across devices (not just tabs)?</p>
            <p className="mt-2 text-sm">
              A: Use a server-side sync service: client uploads persisted state to
              an API endpoint (encrypted), other devices download on connect.
              Resolve conflicts via last-write-wins with timestamps, or field-level
              merge for complex state. For real-time sync, use WebSockets to push
              state changes to all connected devices. CRDTs can handle conflict-free
              multi-device edits.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide between localStorage and IndexedDB?</p>
            <p className="mt-2 text-sm">
              A: localStorage for small data (&lt;5MB), synchronous access, simple
              key-value pairs (theme, locale, preferences). IndexedDB for large data
              (&gt;5MB), async access, complex queries, structured data (form drafts
              with attachments, offline caches). The threshold: if the data can
              exceed 5MB or needs async operations, use IndexedDB. For most UI state,
              localStorage is sufficient.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle schema migration when the persisted state structure changes?</p>
            <p className="mt-2 text-sm">
              A: Include a version number in the persisted data. On load, compare
              stored version with current version. If different, run migration
              functions sequentially (v1→v2→v3). Each migration function transforms
              the data structure. If no migration path exists (e.g., v1 to v4 with
              only v2→v3→v4 migrations), discard stored data, use defaults, and
              log a warning. Test migrations with unit tests using sample data from
              each version.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent persisting sensitive data accidentally?</p>
            <p className="mt-2 text-sm">
              A: Use an explicit opt-in model for persistence — fields are NOT
              persisted unless explicitly marked with a persistence config. Never
              persist by default. Additionally, run a lint rule in CI that flags
              any attempt to persist fields matching sensitive patterns (token,
              password, secret, SSN). For extra safety, encrypt all persisted data
              with AES-GCM, so even if sensitive data slips through, it&apos;s
              encrypted at rest.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN — IndexedDB API</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN — Web Storage API</a></li>
          <li><a href="https://web.dev/localstorage/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Web.dev — localStorage Best Practices</a></li>
          <li><a href="https://dexie.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Dexie.js — IndexedDB Wrapper</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

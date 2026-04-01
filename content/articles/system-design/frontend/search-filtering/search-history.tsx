"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-search-history",
  title: "Search History",
  description:
    "Comprehensive guide to Search History covering storage strategies, privacy considerations, history ranking, and production implementation patterns.",
  category: "frontend",
  subcategory: "search-filtering",
  slug: "search-history",
  wordCount: 5100,
  readingTime: 20,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "search history",
    "recent searches",
    "localStorage",
    "privacy",
    "personalization",
  ],
  relatedTopics: [
    "search-suggestions-autocomplete",
    "client-side-search-implementation",
    "form-state-management",
  ],
};

export default function SearchHistoryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search history</strong> (also called recent searches or search
          history) stores a user&apos;s past search queries to enable quick
          re-search and provide context for autocomplete suggestions. When users
          return to the search interface, they see their recent searches and can
          click to re-execute them without retyping. This is especially valuable
          for complex queries users run frequently (e.g., &quot;react hooks
          tutorial&quot;, &quot;price:50-100 brand:nike&quot;).
        </p>
        <p>
          Search history serves multiple purposes. <strong>Convenience</strong>{" "}
          — users can quickly re-run common searches. <strong>Context</strong>{" "}
          — history informs autocomplete suggestions (personalize based on what
          user has searched before). <strong>Analytics</strong> — aggregated
          history reveals user behavior patterns. <strong>Session
          continuity</strong> — users can resume searches across sessions or
          devices (if synced).
        </p>
        <p>
          Implementation involves several considerations. <strong>Storage</strong>{" "}
          — where to store history (localStorage, IndexedDB, server).{" "}
          <strong>Privacy</strong> — how to handle sensitive searches, provide
          opt-out, comply with regulations (GDPR, CCPA). <strong>Ranking</strong>{" "}
          — which history items to show (recency, frequency, engagement).{" "}
          <strong>Lifecycle</strong> — when to expire old history, how to handle
          history limits.
        </p>
        <p>
          For staff-level engineers, search history architecture involves
          decisions about data ownership (user controls their history),
          synchronization (history across devices), and integration with other
          features (autocomplete, recommendations). The implementation must
          balance utility (helpful history) with privacy (user control, data
          minimization).
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Storage Location:</strong> Where history is stored.{" "}
            <strong>localStorage</strong> — simple, synchronous, 5-10MB limit,
            per-origin. <strong>IndexedDB</strong> — async, larger storage,
            complex queries. <strong>Server</strong> — synced across devices,
            requires authentication, privacy considerations. Many implementations
            use hybrid — localStorage for recent history, server for full
            history.
          </li>
          <li>
            <strong>History Entry:</strong> What to store for each search.
            Minimum: query string, timestamp. Recommended: query, timestamp,
            result count (did search return results?), engagement (did user click
            results?), context (which page/section was searched). Avoid storing
            sensitive data (PII, payment info).
          </li>
          <li>
            <strong>History Limit:</strong> Maximum number of history entries to
            retain. Typical: 10-50 recent searches. Too few loses useful history,
            too many becomes cluttered. Implement as LRU (least recently used)
            cache — when limit reached, remove oldest entry.
          </li>
          <li>
            <strong>Deduplication:</strong> When user re-runs same search, update
            timestamp instead of adding duplicate entry. Keeps history clean and
            ensures most recent timestamp for ranking. Some implementations
            track frequency (how many times searched) for ranking.
          </li>
          <li>
            <strong>Expiration:</strong> When to remove old history. Time-based
            (remove entries older than 30 days). Count-based (keep only last 50
            searches). Engagement-based (remove searches with zero clicks).
            GDPR requires ability to delete all history on request.
          </li>
          <li>
            <strong>Privacy Controls:</strong> Users must control their history.
            Provide: view history, delete individual entries, clear all history,
            pause history (temporarily stop recording), opt-out (permanently
            disable). For logged-in users, sync these preferences across devices.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/search-history/history-storage-architecture.svg"
          alt="Search History Storage Architecture showing localStorage, IndexedDB, and server sync options"
          caption="History storage architecture — localStorage for recent history (fast, offline), server for full history (synced across devices), with privacy controls and expiration policies"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Search history architecture consists of a history manager that handles
          storage operations, a ranking engine that orders history entries, and
          a UI component that displays history with management controls. The
          architecture must handle concurrent access (multiple tabs), privacy
          controls, and synchronization.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/search-history/history-lifecycle.svg"
          alt="Search History Lifecycle showing add, deduplicate, rank, expire, and delete operations"
          caption="History lifecycle — when user searches, add to history (or update timestamp if duplicate), rank by recency/frequency, expire old entries, provide delete controls"
          width={900}
          height={500}
        />

        <h3>History Ranking</h3>
        <p>
          When displaying history, order entries by predicted usefulness. Simple:
          sort by timestamp (most recent first). Better: combine recency with
          frequency (searches run multiple times rank higher). Best: add
          engagement signal (searches where user clicked results rank higher than
          zero-result searches).
        </p>
        <p>
          Ranking formula example: <code>score = (recency_weight × days_ago) +
          (frequency_weight × search_count) + (engagement_weight × click_rate)</code>.
          Tune weights based on analytics — what predicts re-search behavior for
          your users?
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Search history implementation involves trade-offs between convenience,
          privacy, and complexity.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/search-history/history-ranking-factors.svg"
          alt="History Ranking Factors showing recency, frequency, and engagement signals"
          caption="Ranking factors — recency (newer searches rank higher), frequency (searched multiple times ranks higher), engagement (searches with clicks rank higher)"
          width={900}
          height={500}
        />

        <p className="mt-4">
          The ranking factors diagram shows how history entries are scored.
          Recency is typically weighted highest (50%) since recent searches are
          most likely to be re-run. Frequency (30%) boosts searches run multiple
          times. Engagement (20%) boosts searches where users clicked results.
          Tune these weights based on your users&apos; behavior patterns.
        </p>

        <h3>Client-Side vs Server-Side History</h3>
        <p>
          <strong>Client-side (localStorage)</strong> stores history in browser.
          Advantages: instant access, works offline, no server cost, privacy
          (data stays on device). Limitations: not synced across devices, lost
          if user clears browser data, limited storage.
        </p>
        <p>
          <strong>Server-side</strong> stores history in database. Advantages:
          synced across devices, survives browser clear, can analyze aggregated
          data. Limitations: requires authentication, network latency, privacy
          concerns, server cost.
        </p>
        <p>
          <strong>Hybrid approach</strong> combines both — localStorage for
          recent history (fast, offline), server for full history (synced). Most
          production systems use hybrid.
        </p>

        <h3>History Visibility</h3>
        <p>
          <strong>Show on focus:</strong> Display history when user focuses
          search input. Most common pattern — immediately visible, no extra
          action needed.
        </p>
        <p>
          <strong>Show on empty query:</strong> Display history when search is
          empty (0 characters typed). Similar to show on focus, but explicit
          about requiring empty query.
        </p>
        <p>
          <strong>Separate history page:</strong> Full history on dedicated page
          (/search-history). For users who want to browse or manage full history.
          Often combined with inline recent searches.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Limit to 10-20 Recent Searches:</strong> Show only most
            relevant history inline. Too many entries overwhelm users. Provide
            &quot;View all history&quot; link for full history page.
          </li>
          <li>
            <strong>Deduplicate on Re-search:</strong> When user re-runs same
            search, update timestamp instead of adding duplicate. Keeps history
            clean and ensures accurate recency ranking.
          </li>
          <li>
            <strong>Provide Clear Delete Controls:</strong> Each history entry
            should have delete button (× icon). Include &quot;Clear all&quot;
            button. Confirm before clearing all (accidental delete is
            frustrating).
          </li>
          <li>
            <strong>Respect Privacy Settings:</strong> If user opts out of
            history, don&apos;t store anything. If user pauses history, don&apos;t
            store during pause period. Honor &quot;Do Not Track&quot; browser
            setting.
          </li>
          <li>
            <strong>Expire Old History:</strong> Automatically remove entries
            older than 30-90 days. Prevents history from growing indefinitely.
            Inform users about expiration policy.
          </li>
          <li>
            <strong>Sync Across Devices:</strong> For logged-in users, sync
            history across devices. Use server storage with conflict resolution
            (merge histories, deduplicate).
          </li>
          <li>
            <strong>Highlight Matching History:</strong> When user types,
            highlight matching history entries. Shows &quot;you&apos;ve searched
            this before&quot; — reinforces value of history.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Storing Sensitive Data:</strong> Don&apos;t store searches
            containing PII, payment info, or passwords. Filter or hash sensitive
            queries before storing. Better: don&apos;t store history for
            sensitive sections (account settings, checkout).
          </li>
          <li>
            <strong>No Delete Option:</strong> Users must be able to delete
            history. Not providing this violates privacy expectations and may
            violate regulations (GDPR right to erasure).
          </li>
          <li>
            <strong>Unlimited History Growth:</strong> Without limits, history
            grows indefinitely. This wastes storage and makes history less
            useful (hard to find relevant entries). Implement count and time
            limits.
          </li>
          <li>
            <strong>Not Handling Private Browsing:</strong> In private/incognito
            mode, localStorage may not persist or may be restricted. Handle
            gracefully — either don&apos;t store history or store only for
            session.
          </li>
          <li>
            <strong>Sync Conflicts:</strong> When syncing history across devices,
            conflicts occur (same query searched on different devices). Use
            timestamp-based merge — keep entry with most recent timestamp.
          </li>
          <li>
            <strong>Showing History at Wrong Time:</strong> Don&apos;t show
            history when user has typed a query — show suggestions instead.
            History is for empty or near-empty queries.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Recent Searches</h3>
        <p>
          Amazon, eBay show recent searches when user focuses search bar.
          History includes product searches, category browses, and filtered
          searches. Clicking history item re-runs search with all filters.
          History synced across devices for logged-in users.
        </p>

        <h3>Documentation Search History</h3>
        <p>
          Documentation sites (React, MDN) store recent page searches. Helps
          developers return to previously viewed docs. History often includes
            section context (&quot;Hooks → useEffect&quot;). Stored in
          localStorage, expires after 30 days.
        </p>

        <h3>Job Search History</h3>
        <p>
          Job boards (LinkedIn, Indeed) store search history with filters
          (location, role, experience level). Users can save searches for alerts,
          but history provides quick re-search. History includes engagement
          signals (did user apply to jobs from this search?).
        </p>

        <h3>Video Platform History</h3>
        <p>
          YouTube, Netflix store search history for videos/shows. History
          influences recommendations (searched for &quot;sci-fi movies&quot; →
          recommend sci-fi). Users can pause or clear history. History synced
          across devices (phone, TV, computer).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement search history with localStorage?
            </p>
            <p className="mt-2 text-sm">
              A: Store history as JSON array in localStorage. On search: parse
              existing history, check if query already exists (deduplicate),
              update timestamp or add new entry, limit to max entries (remove
              oldest), stringify and save. On load: parse from localStorage,
              sort by timestamp, return recent entries. Handle errors
              (localStorage may be unavailable in private browsing).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle search history privacy and GDPR compliance?
            </p>
            <p className="mt-2 text-sm">
              A: GDPR requires: (1) Inform users about history storage (privacy
              policy). (2) Provide opt-out (don&apos;t store history). (3)
              Provide access (view all history). (4) Provide deletion (clear all
              history). (5) Honor &quot;right to erasure&quot; (delete on
              request). Implement: privacy settings page with history controls,
              export history function, delete all function, and backend deletion
              for server-stored history.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you rank search history entries?
            </p>
            <p className="mt-2 text-sm">
              A: Simple: sort by timestamp descending (most recent first).
              Better: combine recency with frequency — searches run multiple
              times rank higher. Best: add engagement signal — searches where
              user clicked results rank higher than zero-result searches.
              Formula: score = (recency × 0.5) + (frequency × 0.3) + (engagement
              × 0.2). Tune weights based on analytics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you sync search history across devices?
            </p>
            <p className="mt-2 text-sm">
              A: Store history on server associated with user account. On each
              device: upload local history to server, download server history,
              merge (deduplicate by query, keep most recent timestamp), resolve
              conflicts (server timestamp wins). Use optimistic updates — show
              history immediately, sync in background. Handle offline — queue
              uploads for when online.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle search history for sensitive queries?
            </p>
            <p className="mt-2 text-sm">
              A: Several approaches: (1) Don&apos;t store history for sensitive
              sections (account settings, checkout, health info). (2) Filter
              queries before storing — detect PII patterns (email, phone, SSN)
              and skip. (3) Hash sensitive queries — store hash for
              deduplication but not actual query. (4) Provide &quot;private
              search&quot; mode — temporarily disable history. Best: combine
              approaches and be transparent with users about what is/isn&apos;t
              stored.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you measure search history effectiveness?
            </p>
            <p className="mt-2 text-sm">
              A: Key metrics: (1) History click-through rate — what percentage
              of history impressions result in a click? (2) Re-search rate — how
              often do users re-run previous searches? (3) Time saved — estimate
              time saved by not retyping (avg query length × typing speed ×
              history usage). (4) User satisfaction — survey users about history
              usefulness. (5) Privacy opt-out rate — if many users disable
              history, investigate why.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/search-history/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nielsen Norman Group - Search History Usability
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN - localStorage API
            </a>
          </li>
          <li>
            <a
              href="https://gdpr.eu/what-is-gdpr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GDPR.eu - GDPR Overview
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/09/search-history-privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine - Search History and Privacy
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/search-history-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Baymard Institute - Search History UX Research
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

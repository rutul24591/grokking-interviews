"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-rate-limited-autocomplete",
  title: "Design a Rate-Limited Autocomplete System",
  description:
    "Production-grade autocomplete with debouncing, request deduplication, rate limiting, cancellation, and result caching for responsive search UX.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "rate-limited-autocomplete",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "autocomplete",
    "debounce",
    "rate-limiting",
    "request-deduplication",
    "caching",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "frontend-caching-layer",
    "request-deduplication-system",
  ],
};

export default function RateLimitedAutocompleteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          User types search query: "jav...a" (4 keystrokes). Naive implementation: 4 requests sent (one per key). Keystroke 1 "j" → request. Keystroke 2 "ja" → request (first still in-flight). Result: wasted requests (too many, overlapping). Better: debounce (wait 300ms after last keystroke before requesting). After "java" + 300ms silence → single request. User still sees instant suggestions (UI shows as they type, request deferred). Result: 1 request instead of 4.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Additional challenges: (1) User types fast, requests arrive out of order (request for "java" completes before "jav" starts). Must discard stale results (don't show "java" results after user edited to "javan"). (2) Rate limiting (server allows 100 requests/minute). If all users debounce-request simultaneously, load spike. Solution: throttle client-side (space out requests). (3) Caching ("java" and "javan" may have same results—cache by prefix to avoid duplicate requests). (4) Cancellation (user continues typing, previous request becomes irrelevant—cancel it).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Real-world impact: Google Search autocomplete handles 1B+ searches/day. Debouncing + caching + deduplication critical. Without them, server overwhelmed.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Explicit assumptions:</strong> User types incrementally. Keystroke rate variable (200-500ms between keys). Server has rate limits. Concurrent users. Requests may arrive out of order. Response latency 100-500ms.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Debouncing:</strong> Wait 300ms after user stops typing before
            fetching.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Rate Limiting:</strong> Space requests (e.g., min 1s between
            requests).
          </HighlightBlock>
          <li>
            <strong>Request Deduplication:</strong> If user quickly types
            &quot;ja&quot; then &quot;java&quot;, cancel &quot;ja&quot; request.
          </li>
          <li>
            <strong>Caching:</strong> Cache results for query. Reuse if typed again.
          </li>
          <li>
            <strong>Cancellation:</strong> Cancel in-flight request if user clears
            input.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Arrow keys navigate results, Enter
            selects.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Accessibility:</strong> ARIA labels, screen reader support.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Perceived Latency:</strong> Results appear quickly. Cache ensures
            instant results for repeat queries.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Server Load:</strong> Debounce, rate limit, deduplication minimize
            requests.
          </HighlightBlock>
          <li>
            <strong>Memory:</strong> Cache bounded. LRU eviction when full.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            User types rapidly (e.g., &quot;java&quot; in 200ms) → debounce waits,
            then fetches once.
          </HighlightBlock>
          <li>
            Two requests in flight simultaneously → cancel older, keep newer.
          </li>
          <li>
            Request times out → show error, allow manual retry.
          </li>
          <li>
            User selects result → close dropdown, clear input.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">On input change, debounce (wait 300ms). Check cache for results. If cached,
          show immediately. Otherwise, respect rate limit (wait if last request recent),
          then fetch. Cancel previous in-flight request.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Show loading indicator while
          fetching. On results arrive, cache and display. Handle errors and timeouts
          gracefully. Keyboard navigation and selection handled by component.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debouncing</h3>
        <p>
          Delay query fetch until user stops typing for N milliseconds.
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Debounce Delay:</strong> Typical 300-500ms. Balance between
            responsiveness and load.
          </HighlightBlock>
          <li>
            <strong>Implementation:</strong> Timer restarted on each keystroke.
            Cleared on unmount.
          </li>
          <li>
            <strong>UI Feedback:</strong> Show spinner while debounce timer pending
            (optional).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Rate Limiting</h3>
        <p>
          Enforce minimum time between requests to a single backend endpoint.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Min Interval:</strong> Typical 1 second. Requests faster than this
            are throttled.
          </li>
          <li>
            <strong>Token Bucket:</strong> Allow N requests per time window. Refill
            periodically.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Queuing:</strong> If rate limit reached, queue request. Execute
            when rate limit allows.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Deduplication</h3>
        <p>
          Cancel in-flight request if newer request made.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Tracking:</strong> Store AbortController for current in-flight
            request.
          </li>
          <li>
            <strong>On New Request:</strong> Abort previous via AbortController.
          </li>
          <li>
            <strong>Edge Case:</strong> Response may arrive after abort. Ignore via
            AbortSignal.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Caching</h3>
        <p>
          Cache results by query string. Reuse on repeat query.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Cache Key:</strong> Query string (e.g., &quot;java&quot;).
          </li>
          <li>
            <strong>TTL:</strong> Cache results for 5 minutes. Reuse if query typed
            again within 5 min.
          </li>
          <li>
            <strong>Max Size:</strong> Cache up to 50 queries. LRU evict oldest.
          </li>
          <li>
            <strong>Instant Feedback:</strong> Show cached results immediately while
            background refetch.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cancellation</h3>
        <p>
          User can clear input or close dropdown, canceling in-flight request.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Clear Input:</strong> Empty input field → abort fetch, hide
            results.
          </li>
          <li>
            <strong>Unmount:</strong> Component unmounts → abort fetch, cleanup
            timers.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error Handling</h3>
        <p>
          Handle fetch errors gracefully.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Network Error:</strong> Show &quot;Network error&quot; message.
            Expose retry button.
          </li>
          <li>
            <strong>Timeout:</strong> After 5s, timeout and show error.
          </li>
          <li>
            <strong>Empty Results:</strong> &quot;No results found&quot; message.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Keyboard Navigation</h3>
        <HighlightBlock as="p" tier="important">
          Support keyboard navigation in results dropdown.
        </HighlightBlock>
        <ul className="space-y-2">
          <li>
            <strong>Arrow Up/Down:</strong> Navigate between results. Highlight
            current.
          </li>
          <li>
            <strong>Enter:</strong> Select highlighted result.
          </li>
          <li>
            <strong>Escape:</strong> Close dropdown, clear highlight.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Result Highlighting</h3>
        <p>
          Highlight matching portions of result text for clarity.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Matching Portion:</strong> Bold or highlight the portion matching
            query.
          </li>
          <li>
            <strong>Example:</strong> Query: &quot;java&quot;, Result: &quot;JavaScript&quot;
            → &quot;<strong>Java</strong>Script&quot;.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Support screen readers and keyboard-only navigation.
        </HighlightBlock>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>ARIA Labels:</strong> Input labeled &quot;Search suggestions&quot;.
            Results list has role=&quot;listbox&quot;.
          </HighlightBlock>
          <li>
            <strong>Live Region:</strong> Announce result count and current highlight
            to screen readers.
          </li>
          <li>
            <strong>Keyboard Only:</strong> Tab to navigate, arrow keys in results,
            Enter to select.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debounce vs Throttle</h3>
        <HighlightBlock as="p" tier="important">
          Debounce (wait for silence) vs Throttle (space out requests). Debounce
          better for autocomplete (fewer requests). Throttle better for scroll
          events.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Search Strategies</h3>
        <HighlightBlock as="p" tier="important">
          Local search (filter cached results) vs remote search (query backend).
          Hybrid: show local results instantly, fetch remote in background.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mobile Considerations</h3>
        <HighlightBlock as="p" tier="crucial">
          Mobile may have higher latency/lower bandwidth. Adjust debounce delay and
          rate limit accordingly.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Prefetching</h3>
        <HighlightBlock as="p" tier="important">
          Prefetch suggestions for common queries on page load (e.g., trending
          searches).
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Client-Side vs Server-Side Rate Limiting</h3>
        <p>
          Client-side limits protect your backend but users can bypass. Server-side
          limits enforce hard limits per user/IP. Implement both: client prevents
          accidental spam, server enforces true limits. At 1M concurrent users,
          server limits critical.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Debounce Based on Network</h3>
        <HighlightBlock as="p" tier="important">
          Detect network latency: slow network → longer debounce (wait for user to
          finish typing). Fast network → shorter debounce. Profile user typing
          speed: power-users type fast, casual users slower. Adjust debounce
          adaptively. Complex but better UX.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Local Search First Pattern</h3>
        <HighlightBlock as="p" tier="important">
          Show local results instantly (from cache), fetch remote in background.
          User types "j", show recent searches starting with "j" immediately.
          Meanwhile, fetch fresh suggestions server-side. When arrive, update.
          Dramatically improves perceived latency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Autocomplete Edge Cases</h3>
        <HighlightBlock as="p" tier="important">
          Test rapid input changes, clear input, unmount mid-fetch. Test cache hits
          vs misses. Test rate limiting (exceed limits, verify graceful degradation).
          Use fake timers for debounce timing. Property-based: generate random input
          sequences, verify behavior consistent.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Optimization</h3>
        <p>
          Cache results aggressively (5 min TTL). Prefetch trending queries on page
          load. Rank results by usage (popular searches first). Monitor: cache hit
          rate, avg response time, retry rate. If hit rate low, increase TTL.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mobile Considerations</h3>
        <HighlightBlock as="p" tier="crucial">
          Mobile has higher latency, variable bandwidth. Increase debounce delay
          (500-800ms). Reduce result count (show 5 instead of 20). Local search
          more valuable on mobile (instant results). Test on real devices.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accessibility at Scale</h3>
        <HighlightBlock as="p" tier="important">
          Screen reader announces result count. Keyboard: arrow keys navigate,
          Enter selects, Escape closes. ARIA live region updates on results.
          Test with real screen readers. Accessibility shouldn't be afterthought.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Integration with Backend Search</h3>
        <p>
          Frontend autocomplete is just UI. Backend search service does heavy
          lifting. Coordinate: frontend requests full-text search, backend returns
          ranked results. Ensure backend search indices up-to-date (eventual
          consistency acceptable for autocomplete).
        </p>
      </section>

      <section>
        <h2>Rate-Limiting Pipeline</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/rate-limited-autocomplete.svg"
          alt="Rate-limited autocomplete request pipeline and techniques diagram"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: autocomplete is a load-shedding pipeline (debounce/throttle + cancellation + caching) that must preserve perceived responsiveness while protecting downstream search services.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat cancellation as correctness, not optimization: abort in-flight fetches on new keystrokes so stale suggestions don&rsquo;t win the race.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Combine client-side smoothing with hard server-side rate limits (token bucket/leaky bucket) and observability (429 rate, p95 latency, cache hit rate) to tune safely.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Responsiveness vs Load</h3>
        <HighlightBlock as="p" tier="important">
          Shorter debounce = more responsive but higher load. Longer debounce =
          lower load but less responsive.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Staleness</h3>
        <HighlightBlock as="p" tier="important">
          Caching results risks showing stale suggestions. Balance freshness with
          performance via TTL.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server Side</h3>
        <HighlightBlock as="p" tier="crucial">
          Rate limiting and caching reduce backend load significantly. Implement
          server-side caching and rate limiting for extra protection.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Real-world systems use machine learning to rank results based on user behavior. Testing must cover rapid typing, network interruptions, cache behavior, and</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">accessibility (screen readers, keyboard navigation). Production monitoring tracks cache hit rate, response time percentiles (P95, P99), and retry rates to detect degradation. Understanding the interaction between debouncing, rate limiting, caching, and deduplication is essential for efficient client-server communication at scale.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

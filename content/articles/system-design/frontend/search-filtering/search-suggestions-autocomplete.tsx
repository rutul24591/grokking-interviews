"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-search-suggestions",
  title: "Search Suggestions & Autocomplete",
  description:
    "Deep dive into Search Suggestions & Autocomplete covering suggestion algorithms, ranking strategies, keyboard navigation, and production implementation patterns.",
  category: "frontend",
  subcategory: "search-filtering",
  slug: "search-suggestions-autocomplete",
  wordCount: 5400,
  readingTime: 21,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "autocomplete",
    "search suggestions",
    "typeahead",
    "keyboard navigation",
    "search UX",
  ],
  relatedTopics: [
    "search-debouncing",
    "client-side-search-implementation",
    "search-history",
  ],
};

export default function SearchSuggestionsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search suggestions</strong> (also called autocomplete or
          typeahead) display predicted queries as users type, helping them find
          what they&apos;re looking for faster. Instead of typing the full query
          and submitting, users see suggestions after a few characters and can
          select from the list. This reduces typing effort, prevents spelling
          errors, and guides users toward popular or relevant queries.
        </p>
        <p>
          Autocomplete has become a standard expectation — Google pioneered it,
          and now users expect it on every search interface. E-commerce sites
          use it to suggest products, documentation sites suggest pages, and
          command palettes (VS Code, Spotlight) use it for navigation. The key
          challenge is balancing speed (showing suggestions quickly) with
          relevance (showing useful suggestions).
        </p>
        <p>
          Search suggestions involve several technical components.{" "}
          <strong>Suggestion sources</strong> can be popular queries (what other
          users searched), personal history (what this user searched before),
          catalog items (products, pages, documents), or query completions
          (common continuations of partial queries). <strong>Ranking</strong>{" "}
          determines which suggestions to show — typically a combination of
          popularity, relevance to partial query, recency, and personalization.{" "}
          <strong>Display</strong> must handle keyboard navigation (arrow keys,
          Enter), mouse interaction, mobile touch, and accessibility (screen
          reader announcements).
        </p>
        <p>
          For staff-level engineers, autocomplete architecture involves
          decisions about where suggestions come from (client-side cache,
          server-side API, or hybrid), how to handle rapid typing (debouncing,
          request cancellation), and how to measure success (click-through rate,
          query refinement rate, time-to-search). The optimal approach depends
          on dataset size, latency requirements, and personalization needs.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Suggestion Sources:</strong> Where suggestions come from.
            <strong>Popular queries</strong> — aggregated from all users,
            weighted by frequency and recency. <strong>Personal history</strong>{" "}
            — user&apos;s past searches, weighted by recency and engagement
            (did they click results?). <strong>Catalog items</strong> — products,
            pages, or documents that match the partial query.{" "}
            <strong>Query completions</strong> — common continuations derived
            from query logs (users who typed &quot;react&quot; also searched
            &quot;react hooks&quot;).
          </li>
          <li>
            <strong>Trigger Threshold:</strong> Minimum characters before
            showing suggestions. Typically 2-3 characters — fewer produces too
            many irrelevant suggestions, more delays helpful feedback. Some
            interfaces show &quot;trending&quot; suggestions even at 0
            characters (empty state).
          </li>
          <li>
            <strong>Debouncing:</strong> Delay before fetching suggestions as
            user types. Typical: 150-250ms. Shorter feels more responsive but
            causes more API calls. Longer reduces load but feels sluggish.
            Critical for server-side suggestions.
          </li>
          <li>
            <strong>Suggestion Ranking:</strong> Ordering suggestions by
            predicted usefulness. Factors: match quality (does suggestion start
            with or contain the query?), popularity (how often is this
            searched?), recency (is this trending?), personalization (has this
            user searched it before?), and business rules (promote certain
            queries).
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Users navigate suggestions
            with arrow keys (up/down), select with Enter, dismiss with Escape.
            Implementation requires tracking active index, scrolling active item
            into view, and handling edge cases (what happens at top/bottom of
            list?).
          </li>
          <li>
            <strong>Highlighting:</strong> Show which part of the suggestion
            matches the query. &quot;<strong>react</strong> hooks&quot; shows
            &quot;react&quot; in bold when user types &quot;rea&quot;. Helps
            users understand why the suggestion was shown.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/search-suggestions/autocomplete-architecture.svg"
          alt="Autocomplete Architecture showing suggestion sources, ranking, and display flow"
          caption="Autocomplete architecture — user input triggers suggestion fetch from multiple sources (popular, history, catalog), results are ranked and deduplicated, then displayed with keyboard navigation support"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Autocomplete architecture consists of an input handler that captures
          user input with debouncing, a suggestion fetcher that retrieves
          suggestions from sources, a ranker that orders and deduplicates
          suggestions, and a UI component that displays suggestions with
          navigation support.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/search-suggestions/suggestion-flow.svg"
          alt="Suggestion Flow showing input through debouncing, fetching, ranking, and display"
          caption="Suggestion flow — user types, debounce waits for pause, fetch retrieves suggestions from sources, ranker orders by relevance, UI displays with highlighting and navigation"
          width={900}
          height={500}
        />

        <h3>Suggestion Sources Architecture</h3>
        <p>
          Different sources serve different purposes. <strong>Popular
          queries</strong> help users discover what others search — good for
          exploration. <strong>Personal history</strong> helps users return to
          previous searches — good for returning users. <strong>Catalog
          items</strong> help users find specific items — good for known-item
          search. <strong>Query completions</strong> help users formulate
          queries — good for complex domains.
        </p>
        <p>
          Sources can be fetched in parallel (fastest, most network requests) or
          sequentially with priority (popular first, then personal, then
          catalog). Hybrid approach: client-side cache for personal history
          (instant), server API for popular and catalog (fresh).
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Autocomplete implementation involves trade-offs between speed,
          relevance, and complexity.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/search-suggestions/suggestion-sources.svg"
          alt="Suggestion Sources showing popular queries, personal history, catalog items, and query completions"
          caption="Suggestion sources — popular queries (aggregated from all users), personal history (user&apos;s past searches), catalog items (products/pages), query completions (common continuations)"
          width={900}
          height={500}
        />

        <p className="mt-4">
          The suggestion sources diagram shows where autocomplete suggestions
          come from. Popular queries help with discovery, personal history helps
          returning users, catalog items help find specific content, and query
          completions help formulate searches. Each source has different
          freshness requirements and personalization levels.
        </p>

        <h3>Client-Side vs Server-Side Suggestions</h3>
        <p>
          <strong>Client-side suggestions</strong> use pre-loaded data or
          client-side search. Advantages: instant response, works offline, no
          server load. Limitations: limited to pre-loaded data, can&apos;t
          personalize based on real-time behavior, stale data.
        </p>
        <p>
          <strong>Server-side suggestions</strong> fetch from API on each query.
          Advantages: fresh data, personalization, can use full search index.
          Limitations: network latency, server load, doesn&apos;t work offline.
        </p>
        <p>
          <strong>Hybrid approach</strong> combines both — client-side cache for
          personal history (instant), server API for popular queries and catalog
          (fresh). Most production systems use hybrid.
        </p>

        <h3>Suggestion Count</h3>
        <p>
          <strong>Few suggestions (3-5):</strong> Faster to scan, less
          overwhelming, but may not include what user wants. Good for mobile
          where screen space is limited.
        </p>
        <p>
          <strong>Many suggestions (8-10):</strong> More likely to include
          relevant option, but takes longer to scan. Good for desktop where
          users can quickly scan.
        </p>
        <p>
          <strong>Scrollable list:</strong> Show 5-7 with scroll for more.
          Balances scan speed with completeness. Most common pattern.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Debounce at 150-250ms:</strong> This balances responsiveness
            with efficiency. Shorter causes excessive API calls, longer feels
            sluggish. Adjust based on API latency — if API is slow (200ms+), use
            shorter debounce to compensate.
          </li>
          <li>
            <strong>Cancel Pending Requests:</strong> When user types faster
            than API responds, cancel superseded requests. Use AbortController
            for fetch requests. Prevents race conditions where old suggestions
            overwrite newer ones.
          </li>
          <li>
            <strong>Cache Aggressively:</strong> Cache suggestions by query
            prefix. If user types &quot;react&quot; then backspaces to
            &quot;rea&quot; then types &quot;react&quot; again, serve from
            cache. Use LRU cache with size limit (100-500 entries).
          </li>
          <li>
            <strong>Highlight Matches:</strong> Bold the matching portion of
            suggestions. Helps users understand why the suggestion was shown.
            Use case-insensitive matching for highlighting.
          </li>
          <li>
            <strong>Support Full Keyboard Navigation:</strong> Arrow up/down to
            navigate, Enter to select, Escape to dismiss, Tab to accept and
            move to next field. Critical for accessibility and power users.
          </li>
          <li>
            <strong>Handle Empty States:</strong> When no suggestions match,
            show &quot;No suggestions&quot; or show popular queries anyway.
            Never show an empty dropdown — it looks broken.
          </li>
          <li>
            <strong>Mobile Considerations:</strong> On mobile, suggestions
            should be large enough to tap (44×44px minimum). Consider showing
            fewer suggestions. Dismiss keyboard when suggestion is selected.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Debouncing:</strong> Fetching on every keystroke causes
            excessive API calls and can overwhelm the server. A 10-character
            query triggers 10 API calls. Always debounce.
          </li>
          <li>
            <strong>Not Handling Race Conditions:</strong> If API responses
            arrive out of order, old suggestions can overwrite new ones. Always
            track the query that triggered each response and ignore stale
            responses.
          </li>
          <li>
            <strong>Poor Keyboard Support:</strong> Users expect arrow keys to
            navigate suggestions. Not supporting this frustrates keyboard users
            and fails accessibility requirements.
          </li>
          <li>
            <strong>Showing Irrelevant Suggestions:</strong> Suggestions that
            don&apos;t match the query confuse users. Ensure all suggestions
            have some relevance to the partial query (prefix match, contains, or
            strong personalization signal).
          </li>
          <li>
            <strong>Not Caching:</strong> Fetching the same suggestions
            repeatedly wastes bandwidth and increases latency. Cache by query
            prefix with appropriate TTL.
          </li>
          <li>
            <strong>Ignoring Accessibility:</strong> Suggestions must be
            announced to screen readers. Use aria-live regions or manage focus
            appropriately. Ensure sufficient color contrast for highlighted
            text.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Google Search Autocomplete</h3>
        <p>
          Google&apos;s autocomplete shows popular queries, personal history,
          and trending searches. Suggestions update as user types, with
          bold highlighting for matching portions. Keyboard navigation fully
          supported. Backend uses massive query log analysis to predict
          completions.
        </p>

        <h3>E-Commerce Product Search</h3>
        <p>
          Amazon, eBay show product suggestions with thumbnails and prices as
          users type. Combines catalog items (products matching query) with
          popular searches. Clicking a suggestion goes directly to product page,
          skipping search results page.
        </p>

        <h3>Documentation Search</h3>
        <p>
          Documentation sites (React, MDN) suggest page titles and section
          headings. Often client-side using pre-built index (Lunr.js). Fast
          because index is small. Suggestions include section context
          (&quot;Hooks → useEffect&quot;).
        </p>

        <h3>Command Palette</h3>
        <p>
          VS Code, Spotlight, and Raycast use autocomplete for command
          navigation. Suggestions include commands, files, and recent items.
          Heavily personalized based on user behavior. Keyboard-first
          interaction (Tab to select, Enter to execute).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement autocomplete with debouncing and request
              cancellation?
            </p>
            <p className="mt-2 text-sm">
              A: Use a debounced function that waits 150-250ms after typing
              stops before fetching. Store an AbortController for each request.
              When a new request is triggered, abort the previous controller. In
              the fetch, pass the signal option. Catch AbortError and ignore it
              (it means the request was cancelled). Track the query that
              triggered each response and ignore responses for stale queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you rank autocomplete suggestions?
            </p>
            <p className="mt-2 text-sm">
              A: Ranking combines multiple signals: (1) Match quality — does
              suggestion start with query (prefix) or just contain it? Prefix
              matches rank higher. (2) Popularity — how often is this searched?
              Use query frequency from logs. (3) Recency — is this trending?
              Weight recent searches higher. (4) Personalization — has this user
              searched it before? (5) Business rules — promote certain queries.
              Combine signals with weighted sum or learning-to-rank model.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle keyboard navigation in autocomplete?
            </p>
            <p className="mt-2 text-sm">
              A: Track activeIndex state (which suggestion is highlighted). On
              ArrowDown: increment index (wrap to 0 at end). On ArrowUp:
              decrement index (wrap to length-1 at start). On Enter: select
              active suggestion. On Escape: close dropdown. On Tab: select
              active and move focus to next field. Scroll active item into view
              when index changes. Use aria-activedescendant to communicate
              active item to screen readers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you cache autocomplete suggestions?
            </p>
            <p className="mt-2 text-sm">
              A: Cache by query prefix. Use a Map or object with query as key
              and suggestions array as value. Implement LRU eviction — when
              cache exceeds size limit (100-500 entries), remove least recently
      used. Add TTL — invalidate cache entries older than 5-10 minutes.
              For personal history, cache indefinitely (user&apos;s history
              doesn&apos;t change often). For popular queries, use shorter TTL
              (trending changes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you measure autocomplete success?
            </p>
            <p className="mt-2 text-sm">
              A: Key metrics: (1) Click-through rate — what percentage of
              autocomplete impressions result in a click? (2) Query refinement
              rate — do users who use autocomplete refine their query less? (3)
              Time-to-search — does autocomplete reduce time from first keystroke
              to search execution? (4) Zero-result rate — do autocomplete users
              get zero results less often? (5) Engagement — do autocomplete
              users have higher engagement (more searches, longer sessions)?
              A/B test changes against these metrics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle autocomplete for mobile?
            </p>
            <p className="mt-2 text-sm">
              A: Mobile considerations: (1) Touch targets must be 44×44px
              minimum. (2) Show fewer suggestions (5-7 vs 8-10 on desktop). (3)
              Dismiss keyboard when suggestion is selected. (4) Consider
              voice input as alternative. (5) Optimize for thumb reach — put
              suggestions where thumb naturally rests. (6) Handle virtual
              keyboard appearing/disappearing — adjust dropdown position. (7)
              Consider swipe gestures for navigation (swipe up/down to navigate
              suggestions).
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
              href="https://www.nngroup.com/articles/autocomplete-how-many/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nielsen Norman Group - Autocomplete: How Many Suggestions
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/08/patterns-autocomplete/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Smashing Magazine - Autocomplete Patterns
            </a>
          </li>
          <li>
            <a
              href="https://algolia.com/doc/guides/building-search-ui/widgets/autocomplete/react/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Algolia - Autocomplete Implementation Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN - ARIA Live Regions for Accessibility
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/autocomplete-findability"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Baymard Institute - Autocomplete Findability Research
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

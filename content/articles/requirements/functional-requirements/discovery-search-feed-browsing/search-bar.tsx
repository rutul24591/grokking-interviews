"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-search-bar",
  title: "Search Bar",
  description:
    "Comprehensive guide to search bar implementation covering autocomplete, debouncing, recent searches, trending queries, accessibility, and performance optimization.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "search-bar",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "search",
    "frontend",
    "autocomplete",
    "ux",
  ],
  relatedTopics: ["search-results", "autocomplete", "discovery", "query-processing"],
};

export default function SearchBarArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Bar</strong> is the primary entry point for users to find content
          through active search. It is often the most visible and frequently used feature
          on content platforms, e-commerce sites, and documentation portals. A well-designed
          search bar reduces user friction, accelerates discovery, and directly impacts
          conversion rates and user satisfaction.
        </p>
        <p>
          Modern search bars are sophisticated components that go far beyond a simple text
          input. They provide real-time autocomplete suggestions, display recent searches,
          surface trending queries, handle voice input, and support keyboard navigation.
          Performance is critical—users expect suggestions to appear within 100-200ms of
          typing, and any lag directly impacts search engagement.
        </p>
        <p>
          For staff-level engineers, search bar implementation involves balancing multiple
          concerns: latency vs. accuracy (how fast to show suggestions), client-side vs.
          server-side processing (trie-based prefix matching vs. API calls), personalization
          vs. privacy (using search history without being creepy), and accessibility
          (screen reader support, keyboard navigation).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Autocomplete/Suggestions</h3>
        <p>
          Autocomplete predicts what the user is typing and shows suggestions before they
          finish. This accelerates search and helps users formulate better queries.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Query Autocomplete:</strong> Complete the query itself ("mac" → "machine learning", "macos", "macbook").
          </li>
          <li>
            <strong>Result Autocomplete:</strong> Show actual results (documents, products, users) matching the prefix.
          </li>
          <li>
            <strong>Hybrid:</strong> Mix of query suggestions and direct results. Most production systems use this.
          </li>
        </ul>

        <h3 className="mt-6">Debouncing and Throttling</h3>
        <p>
          Every keystroke shouldn't trigger an API call. Debouncing and throttling reduce
          server load while maintaining responsiveness.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Debouncing:</strong> Wait for user to stop typing (e.g., 200-300ms pause) before sending request. Prevents requests for intermediate queries.
          </li>
          <li>
            <strong>Throttling:</strong> Limit requests to once per N milliseconds regardless of typing speed. Guarantees maximum request rate.
          </li>
          <li>
            <strong>Production Approach:</strong> Debounce with minimum delay (200ms) and maximum delay (500ms). Ensures suggestions appear even if user keeps typing.
          </li>
        </ul>

        <h3 className="mt-6">Recent Searches</h3>
        <p>
          Recent searches help users quickly return to previous queries. Typically stored
          client-side for privacy and performance.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Storage:</strong> localStorage (persists across sessions) or sessionStorage (current session only).
          </li>
          <li>
            <strong>Limit:</strong> Store 5-10 most recent searches. Remove duplicates, promote recent to top.
          </li>
          <li>
            <strong>Privacy:</strong> Provide clear "Clear recent searches" option. Respect incognito/private browsing (use sessionStorage).
          </li>
        </ul>

        <h3 className="mt-6">Trending Queries</h3>
        <p>
          Trending queries show what's popular platform-wide, helping users discover
          relevant content they might not have thought to search for.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Computation:</strong> Count query frequency over time window (1h, 24h, 7d). Apply time decay for recency.
          </li>
          <li>
            <strong>Personalization:</strong> Show global trends by default, optionally personalize based on user interests.
          </li>
          <li>
            <strong>Freshness:</strong> Update every 5-15 minutes for trending, hourly for stable popular queries.
          </li>
        </ul>

        <h3 className="mt-6">Voice Search</h3>
        <p>
          Voice search enables hands-free query input using speech-to-text APIs.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Web Speech API:</strong> Browser-native speech recognition. Works in Chrome, Edge, Safari (limited).
          </li>
          <li>
            <strong>Mobile:</strong> Use native voice input (iOS Siri, Android Google Assistant).
          </li>
          <li>
            <strong>Fallback:</strong> Always provide text input alternative. Voice recognition isn't 100% accurate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production search bar involves multiple components working together to deliver
          fast, relevant suggestions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-bar/autocomplete-architecture.svg"
          alt="Autocomplete Architecture"
          caption="Figure 1: Autocomplete Architecture — Client-side trie for prefix matching, server-side API for personalized suggestions, caching layer for common queries"
          width={1000}
          height={500}
        />

        <h3>Component Breakdown</h3>
        <ul className="space-y-3">
          <li>
            <strong>Input Handler:</strong> Captures user input, manages focus state, handles keyboard events (arrow keys, Enter, Escape).
          </li>
          <li>
            <strong>Debounce Logic:</strong> Delays API calls until user pauses typing. Cancels pending requests on new input.
          </li>
          <li>
            <strong>Suggestion Cache:</strong> Client-side cache (Map/WeakMap) stores recent autocomplete results. Key: query prefix, Value: suggestions array.
          </li>
          <li>
            <strong>API Client:</strong> Fetches suggestions from backend. Includes query, user context (location, history), device info.
          </li>
          <li>
            <strong>Results Renderer:</strong> Displays suggestions in dropdown. Handles highlighting, truncation, keyboard navigation.
          </li>
          <li>
            <strong>Analytics Tracker:</strong> Logs search events (query typed, suggestion clicked, search submitted) for improvement.
          </li>
        </ul>

        <h3 className="mt-6">Data Flow: Typing to Suggestions</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>User types:</strong> Input event captured, value updated in state.
          </li>
          <li>
            <strong>Debounce timer starts:</strong> Reset on each keystroke. Fires after 200-300ms pause.
          </li>
          <li>
            <strong>Check cache:</strong> If suggestions cached for this prefix, display immediately.
          </li>
          <li>
            <strong>API request:</strong> If not cached, send request to autocomplete API. Include: query, user_id, context.
          </li>
          <li>
            <strong>Cancel stale requests:</strong> If newer request sent, abort previous (using AbortController).
          </li>
          <li>
            <strong>Display results:</strong> Render suggestions, highlight matching text, show "X results" count.
          </li>
          <li>
            <strong>Cache response:</strong> Store for future requests with same prefix.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-bar/search-bar-states.svg"
          alt="Search Bar States"
          caption="Figure 2: Search Bar States — Empty state with trending, typing state with suggestions, recent searches state, and no results state"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Backend Autocomplete API</h3>
        <p>
          The backend service powering autocomplete must be fast (&lt;50ms p99) and relevant.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Component</th>
                <th className="text-left p-2 font-semibold">Purpose</th>
                <th className="text-left p-2 font-semibold">Technology</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Prefix Index</td>
                <td className="p-2">Fast prefix matching (edge n-grams)</td>
                <td className="p-2">Elasticsearch, Algolia</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Trie Service</td>
                <td className="p-2">Client-side prefix lookup</td>
                <td className="p-2">Custom trie, radix tree</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Query Log</td>
                <td className="p-2">Popular queries, personalization</td>
                <td className="p-2">Redis, ClickHouse</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Cache Layer</td>
                <td className="p-2">Cache common queries</td>
                <td className="p-2">Redis, CDN edge</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Accessibility Considerations</h3>
        <p>
          Search bars must be accessible to all users, including those using screen readers
          or keyboard-only navigation.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>ARIA Attributes:</strong> Use <code className="text-sm bg-muted px-1.5 py-0.5 rounded">role="combobox"</code>, <code className="text-sm bg-muted px-1.5 py-0.5 rounded">aria-expanded</code>, <code className="text-sm bg-muted px-1.5 py-0.5 rounded">aria-activedescendant</code> for screen reader support.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Arrow Up/Down to navigate suggestions, Enter to select, Escape to close, Tab to move to next element.
          </li>
          <li>
            <strong>Focus Management:</strong> Focus returns to input after selection. Clear button is focusable.
          </li>
          <li>
            <strong>Announcements:</strong> Use <code className="text-sm bg-muted px-1.5 py-0.5 rounded">aria-live</code> region to announce number of suggestions.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Search bar implementation involves balancing speed, accuracy, privacy, and
          resource usage.
        </p>

        <h3>Client-Side vs Server-Side Autocomplete</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Latency</th>
                <th className="text-left p-2 font-semibold">Personalization</th>
                <th className="text-left p-2 font-semibold">Data Size</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Client-Side Trie</td>
                <td className="p-2">Very Low (&lt;10ms)</td>
                <td className="p-2">None</td>
                <td className="p-2">Limited (&lt;100K terms)</td>
                <td className="p-2">Small catalogs, offline support</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Server-Side API</td>
                <td className="p-2">Low (50-100ms)</td>
                <td className="p-2">Full</td>
                <td className="p-2">Unlimited</td>
                <td className="p-2">Large catalogs, personalization</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hybrid</td>
                <td className="p-2">Low (cached) + API</td>
                <td className="p-2">Partial</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Production systems</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-bar/debounce-throttle-comparison.svg"
          alt="Debounce vs Throttle Comparison"
          caption="Figure 3: Debounce vs Throttle — Timing diagrams showing how debouncing waits for pause while throttling limits request rate"
          width={1000}
          height={400}
        />

        <h3 className="mt-6">Debounce Delay Trade-offs</h3>
        <p>
          <strong>Short Delay (100-150ms):</strong> Suggestions appear quickly, feels
          responsive. Higher server load (more requests), more likely to show intermediate
          results user didn't intend.
        </p>
        <p>
          <strong>Medium Delay (200-300ms):</strong> Balanced approach. Most production
          systems use this range. Good responsiveness with reasonable server load.
        </p>
        <p>
          <strong>Long Delay (400-500ms):</strong> Minimal server load, but suggestions
          feel sluggish. Users may finish typing before suggestions appear.
        </p>

        <h3 className="mt-6">Privacy vs Personalization</h3>
        <p>
          <strong>High Personalization:</strong> Use full search history, location,
          preferences. More relevant suggestions but raises privacy concerns. Requires
          user consent, data retention policies.
        </p>
        <p>
          <strong>Low Personalization:</strong> Use only current session data, anonymized
          trends. Less relevant but more privacy-friendly. Better for privacy-focused
          products.
        </p>
        <p>
          <strong>Production Approach:</strong> Opt-in personalization with clear controls.
          Default to session-only for new users, offer "personalized suggestions" toggle.
          Respect Do Not Track signals.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Debounce at 200-300ms:</strong> Balance responsiveness with server load.
            Use leading edge (immediate first request) for empty → non-empty transitions.
          </li>
          <li>
            <strong>Cache Aggressively:</strong> Client-side cache for common queries.
            Cache popular queries at CDN edge. Use stale-while-revalidate for cached responses.
          </li>
          <li>
            <strong>Limit Suggestions:</strong> Show 5-10 suggestions maximum. Too many
            overwhelms users. Group by type if needed (queries, results, categories).
          </li>
          <li>
            <strong>Highlight Matches:</strong> Bold or highlight matching text in suggestions.
            Helps users quickly identify relevance.
          </li>
          <li>
            <strong>Handle Empty States:</strong> Show trending queries or recent searches
            when input is empty. Never show blank dropdown.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Full keyboard support (arrow keys, Enter,
            Escape). Visible focus indicator on selected suggestion.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Full-width input, large touch targets
            (44px minimum), native keyboard type (search keyboard), consider voice input.
          </li>
          <li>
            <strong>Analytics Integration:</strong> Track: queries typed, suggestions shown,
            suggestions clicked, searches with no results. Use for continuous improvement.
          </li>
          <li>
            <strong>Error Handling:</strong> Graceful fallback if autocomplete API fails.
            Show recent searches or trending. Don't block search submission.
          </li>
          <li>
            <strong>Accessibility:</strong> ARIA attributes, keyboard navigation, screen
            reader announcements, sufficient color contrast, focus management.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Debouncing:</strong> API call on every keystroke overwhelms server.
            Solution: Implement 200-300ms debounce with request cancellation.
          </li>
          <li>
            <strong>Stale Results:</strong> Old request completes after new request,
            showing wrong suggestions. Solution: Use AbortController to cancel stale requests.
          </li>
          <li>
            <strong>Ignoring Accessibility:</strong> Keyboard-only users can't navigate,
            screen readers can't announce suggestions. Solution: Implement ARIA attributes,
            keyboard handlers, focus management.
          </li>
          <li>
            <strong>Too Many Suggestions:</strong> Showing 20+ suggestions overwhelms users.
            Solution: Limit to 5-10, group by category if needed.
          </li>
          <li>
            <strong>No Caching:</strong> Same queries hit server repeatedly. Solution:
            Implement client-side cache with TTL, cache popular queries at edge.
          </li>
          <li>
            <strong>Poor Mobile Experience:</strong> Small touch targets, wrong keyboard
            type, no voice input. Solution: Mobile-first design, native input type,
            consider Web Speech API.
          </li>
          <li>
            <strong>Ignoring Privacy:</strong> Storing search history without consent.
            Solution: Clear privacy policy, opt-in personalization, easy clear history option.
          </li>
          <li>
            <strong>No Analytics:</strong> Can't improve without data. Solution: Track
            queries, clicks, zero-result searches. Analyze regularly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Google Search</h3>
        <p>
          Google's autocomplete shows query suggestions based on popular searches, user
          history (if signed in), and trending topics. Updates in real-time as user types.
          Includes "People also ask" and related searches.
        </p>
        <p>
          <strong>Key Innovation:</strong> Personalization based on search history,
          location, and language. Privacy controls to disable search history.
        </p>

        <h3 className="mt-6">Amazon Product Search</h3>
        <p>
          Amazon shows product suggestions, category shortcuts, and department filters
          in autocomplete. Prioritizes products based on browsing/purchase history.
          Includes images and prices in suggestions.
        </p>
        <p>
          <strong>Key Innovation:</strong> Rich suggestions with product images, prices,
          and Prime eligibility. Category-specific autocomplete (books vs electronics).
        </p>

        <h3 className="mt-6">GitHub Search</h3>
        <p>
          GitHub autocomplete shows repositories, users, and code results. Supports
          special syntax (user:, repo:, language:). Keyboard navigation for quick
          repository access.
        </p>
        <p>
          <strong>Key Innovation:</strong> Command-like autocomplete with special
          operators. Jump-to feature (press 't' for file search, 'g f' for go to file).
        </p>

        <h3 className="mt-6">Spotify Search</h3>
        <p>
          Spotify shows artists, songs, albums, and playlists in autocomplete.
          Organized by type with clear visual hierarchy. Recent searches prominently
          displayed.
        </p>
        <p>
          <strong>Key Innovation:</strong> Rich media suggestions with album artwork.
          Context-aware (shows podcasts when searching for podcast titles).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize autocomplete performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement client-side debouncing (200-300ms) to reduce
              API calls. Use client-side cache (Map/WeakMap) for common queries. For
              client-side prefix matching, build a trie from popular queries. Cancel
              stale requests using AbortController. Limit suggestions to 5-10 items.
              Pre-fetch trending queries on page load. Use CDN edge caching for popular
              queries. Target &lt;100ms end-to-end latency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle search personalization?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use search history to boost relevant suggestions (user
              searched "React" before → boost React-related queries). Incorporate location
              for local results. Use collaborative filtering (users like you searched for
              X). Balance personalization with diversity—don't create filter bubbles.
              Provide clear opt-out and history controls. Respect privacy settings and
              incognito mode.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement keyboard navigation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track selected index in state. Arrow Down: increment
              index (wrap around). Arrow Up: decrement index (wrap around). Enter: select
              current suggestion, navigate to results. Escape: close dropdown, clear
              selection. Tab: close dropdown, move to next element. Use aria-activedescendant
              to communicate selection to screen readers. Visible highlight on selected
              suggestion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle stale API responses?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use AbortController to cancel pending requests when new
              input arrives. Check if response is for current query before updating state
              (store current query ref, compare on response). Use request ID pattern
              (increment counter per request, only apply response if ID matches current).
              Race condition protection is critical for correct UX.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design for accessibility?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use role="combobox", aria-expanded, aria-haspopup="listbox"
              on input. Suggestions list has role="listbox", each suggestion has role="option".
              Use aria-activedescendant to point to selected option. Implement full keyboard
              navigation. Use aria-live region to announce suggestion count. Ensure sufficient
              color contrast (4.5:1 minimum). Test with screen readers (NVDA, VoiceOver).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle zero-result searches?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Show "No results for X" message with helpful suggestions.
              Display similar queries (spell correction, related terms). Show trending or
              popular searches as fallback. Log zero-result queries for content gap analysis.
              Consider "Did you mean?" suggestions using edit distance or phonetic matching.
              Never show empty state—always provide next action.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ARIA — Combobox Pattern
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/updates/2019/04/nic78#speechrecognition"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Developers — Web Speech API
            </a>
          </li>
          <li>
            <a
              href="https://algolia.com/blog/ui/autocomplete-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Algolia — Autocomplete Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/autocomplete-display/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Autocomplete Display Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://github.blog/2021-05-13-search-at-github-improving-how-we-find-code/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Blog — Search at GitHub
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

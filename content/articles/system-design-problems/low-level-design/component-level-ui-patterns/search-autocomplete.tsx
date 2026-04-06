"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-search-autocomplete",
  title: "Design a Search Autocomplete Component",
  description:
    "Production-grade search autocomplete with debounce, keyboard navigation, highlighted suggestions, result caching, async data fetching, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "search-autocomplete",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "autocomplete",
    "search",
    "debounce",
    "keyboard-navigation",
    "caching",
    "accessibility",
    "async",
  ],
  relatedTopics: [
    "data-table",
    "combobox",
    "typeahead",
    "virtualized-list",
  ],
};

export default function SearchAutocompleteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a search autocomplete component that provides real-time
          suggestions as the user types into a search input. The component should
          debounce API calls to avoid excessive network requests, cache previously
          fetched results to prevent redundant calls, support keyboard navigation
          through suggestions, highlight the matching portion of each suggestion,
          and be fully accessible to screen reader and keyboard-only users.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>The search backend is an external API that returns suggestions based on a query string. Response time is ~100-300ms.</li>
          <li>Suggestions include a title, optional subtitle, and an identifier.</li>
          <li>Maximum visible suggestions at once: 8-10. Excess results are scrollable.</li>
          <li>Debounce delay: 300ms (configurable).</li>
          <li>Cache is session-scoped — cleared on page refresh.</li>
          <li>The component is used in a React 19+ SPA.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Debounced Search:</strong> API calls are delayed by 300ms after the last keystroke to prevent excessive requests.</li>
          <li><strong>Result Caching:</strong> Previously fetched results for a query are served from cache without network requests.</li>
          <li><strong>Keyboard Navigation:</strong> Arrow Up/Down moves the selection highlight through suggestions. Enter selects the highlighted suggestion. Escape closes the dropdown.</li>
          <li><strong>Mouse Interaction:</strong> Clicking a suggestion selects it. Hovering updates the highlight.</li>
          <li><strong>Highlighting:</strong> The matching portion of each suggestion title is visually highlighted (e.g., bold or colored).</li>
          <li><strong>Dropdown Visibility:</strong> Opens on focus/input (if results exist), closes on blur, selection, or Escape.</li>
          <li><strong>Loading State:</strong> Shows a loading indicator while awaiting API response.</li>
          <li><strong>Empty State:</strong> Shows &quot;No results found&quot; when API returns empty results.</li>
          <li><strong>Selection Callback:</strong> Fires an onSelect callback with the selected suggestion&apos;s data.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Debounce prevents API spam. Cache eliminates redundant requests. Rendering is limited to visible suggestions (max 10).</li>
          <li><strong>Accessibility:</strong> Follows WAI-ARIA Combobox pattern with role=&quot;combobox&quot;, role=&quot;listbox&quot;, aria-activedescendant, and aria-expanded.</li>
          <li><strong>Responsiveness:</strong> Dropdown positions correctly relative to input, respects viewport boundaries.</li>
          <li><strong>Type Safety:</strong> Full TypeScript generics for suggestion shape.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User types &quot;react&quot; then backspaces to &quot;rea&quot; — the in-flight request for &quot;react&quot; must be cancelled (AbortController).</li>
          <li>API returns results out of order — result for &quot;rea&quot; arrives after &quot;react&quot;. Must discard stale responses.</li>
          <li>User focuses input, dropdown opens, then clicks outside — dropdown closes without selecting anything.</li>
          <li>Rapid typing creates a queue of debounced calls — only the last one should fire.</li>
          <li>Cache grows unbounded — need eviction strategy (LRU or max-size).</li>
          <li>Suggestion text contains special characters (HTML entities, XSS payloads) — must be escaped before rendering.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to compose three independent concerns: a <strong>debounced
          input</strong> that throttles user keystrokes, a <strong>cached fetch
          layer</strong> that manages API calls with abort semantics, and a
          <strong>dropdown list</strong> that renders suggestions with keyboard/mouse
          interaction. These concerns are unified in a single component using a
          <code>useReducer</code> to manage the state machine (idle, loading, success,
          error) and a custom hook (<code>useAutocomplete</code>) to encapsulate the
          debouncing, caching, and abort logic.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Client-side filtering of pre-loaded data:</strong> If the full dataset is small (&lt;1000 items), load everything upfront and filter locally. Eliminates network latency entirely. Not viable for large datasets.</li>
          <li><strong>WebSocket-based streaming:</strong> For real-time search (e.g., stock tickers), stream results as they become available. Overkill for typical autocomplete use cases.</li>
          <li><strong>External library (downshift, react-select):</strong> Battle-tested ARIA compliance but adds bundle size and limits customization. Good for teams that need reliability fast.</li>
        </ul>
        <p>
          <strong>Why custom hook + useReducer is optimal:</strong> Gives full control over debouncing strategy, cache eviction, abort semantics, and ARIA compliance without external dependencies. The state machine pattern ensures all transitions (typing, loading, error, selection) are explicit and testable.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of five modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces (<code>autocomplete-types.ts</code>)</h4>
          <p>Defines the generic <code>Suggestion</code> interface, the component props interface, cache entry shape, and the reducer state/action types.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. useAutocomplete Hook (<code>use-autocomplete.ts</code>)</h4>
          <p>Encapsulates debouncing, caching, abort logic, and result fetching. Uses <code>useReducer</code> to manage the state machine. Returns state, handlers, and refs needed by the UI.</p>
          <p className="mt-3"><strong>State machine:</strong></p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li><code>idle</code> — no query, no results</li>
            <li><code>loading</code> — API request in flight</li>
            <li><code>success</code> — results available</li>
            <li><code>error</code> — fetch failed</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Debounce Utility (<code>debounce.ts</code>)</h4>
          <p>Custom debounce implementation using <code>setTimeout</code>. Returns a debounced function and a <code>cancel()</code> method. Supports leading edge and trailing edge execution.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Autocomplete Component (<code>autocomplete.tsx</code>)</h4>
          <p>The UI layer — renders the input, dropdown, loading state, empty state. Consumes the hook&apos;s return values. Handles keyboard events and mouse interactions.</p>
          <p className="mt-3"><strong>Component tree:</strong></p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><code>Autocomplete</code> — root, renders input + dropdown wrapper</li>
            <li><code>AutocompleteInput</code> — the text input with onChange/onFocus/onBlur</li>
            <li><code>AutocompleteDropdown</code> — the suggestion list (positioned below input)</li>
            <li><code>AutocompleteOption</code> — individual suggestion with highlight</li>
            <li><code>AutocompleteHighlight</code> — highlights matching text within suggestion</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Highlight Utility (<code>highlight.ts</code>)</h4>
          <p>Takes a suggestion title and query, returns an array of text segments with <code>isMatch: boolean</code> flags for rendering highlighted vs normal text.</p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The <code>useReducer</code> manages the autocomplete state machine. Actions:
          <code>SET_QUERY</code>, <code>FETCH_START</code>, <code>FETCH_SUCCESS</code>,
          <code>FETCH_ERROR</code>, <code>SET_HIGHLIGHT</code>, <code>SELECT</code>,
          <code>RESET</code>, <code>CLOSE_DROPDOWN</code>.
        </p>
        <p>
          Debouncing is handled by a <code>useRef</code>-based timer. Each keystroke
          clears the previous timer and schedules a new one. When the timer fires, the
          hook checks the cache first. If cached, dispatches <code>FETCH_SUCCESS</code>
          immediately. Otherwise, creates an <code>AbortController</code>, fetches, and
          stores results in the cache.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abort &amp; Stale Response Handling</h3>
        <p>
          Each fetch creates a new <code>AbortController</code>. When the user types a
          new character before the previous fetch completes, the controller aborts the
          in-flight request. Additionally, a <code>requestId</code> counter is incremented
          on each new fetch. The success handler checks if the response&apos;s
          <code>requestId</code> matches the current counter — if not, the response is
          stale and discarded.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/search-autocomplete-architecture.svg"
          alt="Search Autocomplete Architecture"
          caption="Architecture of the search autocomplete system showing debounced input, cached fetch layer, and dropdown rendering"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User types &quot;reac&quot; in the input.</li>
          <li><code>onChange</code> fires: dispatches <code>SET_QUERY</code>, clears previous debounce timer, schedules new 300ms timer.</li>
          <li>300ms passes with no further input: debounce timer fires.</li>
          <li>Hook checks cache — no entry for &quot;reac&quot;.</li>
          <li>Creates AbortController, dispatches <code>FETCH_START</code>, calls API.</li>
          <li>API returns array of results with title and id properties.</li>
          <li>Hook stores in cache, dispatches <code>FETCH_SUCCESS</code>, dropdown opens.</li>
          <li>User presses Arrow Down — highlight moves to first suggestion.</li>
          <li>User presses Enter — <code>onSelect</code> fires with selected suggestion.</li>
          <li>Dropdown closes, input updates with selected title.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow is unidirectional: user input → debounced query → cache check →
          API fetch → state update → re-render → dropdown display. Keyboard events modify
          the highlighted index within the reducer without triggering new API calls.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Out-of-order responses:</strong> The <code>requestId</code> counter ensures stale responses are discarded. If &quot;react&quot; (reqId=2) returns before &quot;rea&quot; (reqId=1), the &quot;rea&quot; response is ignored.</li>
          <li><strong>Cache eviction:</strong> Default cache uses a <code>Map</code> with max size of 100 entries. When full, the oldest entry (first key in Map) is deleted before inserting a new one (FIFO eviction).</li>
          <li><strong>XSS prevention:</strong> Suggestion titles are rendered as text content, not innerHTML. The highlight function splits text into segments rendered as separate <code>&lt;span&gt;</code> elements — no <code>dangerouslySetInnerHTML</code>.</li>
          <li><strong>Blur with delay:</strong> When input loses focus, the dropdown closes after 150ms delay. This allows the user to click a suggestion (which triggers blur first) before the dropdown disappears.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">📦 Switch to the Example Tab</h3>
          <p>
            Complete production-ready implementation includes:
            <code>useAutocomplete</code> hook with debounce/cache/abort, state machine
            reducer, Autocomplete component with ARIA combobox pattern, highlight utility
            for matching text, and keyboard/mouse interaction handlers.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Types &amp; Interfaces</h3>
        <p>
          Generic <code>Suggestion&lt;T&gt;</code> interface with <code>id</code>,
          <code>title</code>, optional <code>subtitle</code>, and custom payload
          <code>T</code>. Component props accept a <code>fetchSuggestions</code> function,
          <code>onSelect</code> callback, debounce delay, max visible count, and cache
          size limit.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: useAutocomplete Hook</h3>
        <p>
          Core logic lives here. Uses <code>useReducer</code> with 8 action types for the
          state machine. Debounce via <code>useRef</code>-based timer with
          <code>clearTimeout</code> on each keystroke. Cache is a <code>Map</code> with
          FIFO eviction. Each fetch creates a new <code>AbortController</code> with
          <code>requestId</code> for stale response detection.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Debounce Utility</h3>
        <p>
          Returns a debounced function wrapper and a <code>cancel()</code> method. Uses
          trailing-edge execution (fires after delay with last arguments). Cancel is
          critical — called on unmount to prevent state updates on unmounted components.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Autocomplete Component</h3>
        <p>
          Renders <code>role=&quot;combobox&quot;</code> on the input wrapper,
          <code>role=&quot;listbox&quot;</code> on the dropdown, <code>role=&quot;option&quot;</code>
          on each suggestion with <code>aria-selected</code>. Uses
          <code>aria-activedescendant</code> linked to the highlighted option&apos;s ID
          for screen reader announcements. Keyboard handlers for ArrowUp/Down, Enter,
          Escape. Blur handler with 150ms delay to allow suggestion click.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Highlight Utility</h3>
        <p>
          Performs case-insensitive substring matching. Splits the suggestion title into
          segments — matched segments get <code>isMatch: true</code> for styling (bold
          or colored). Non-matching segments get <code>isMatch: false</code>. Escapes
          special regex characters in the query before matching.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Debounce scheduling</td>
                <td className="p-2">O(1)</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Cache lookup</td>
                <td className="p-2">O(1) — Map.get()</td>
                <td className="p-2">O(c) — c cached entries</td>
              </tr>
              <tr>
                <td className="p-2">Highlight matching</td>
                <td className="p-2">O(n) — n = title length</td>
                <td className="p-2">O(n) — split segments</td>
              </tr>
              <tr>
                <td className="p-2">Render suggestions</td>
                <td className="p-2">O(k) — k visible items</td>
                <td className="p-2">O(k)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Highlight computation on every render:</strong> Running regex matching on every suggestion re-render is wasteful if the query hasn&apos;t changed. Mitigation: memoize highlight with <code>useMemo</code> keyed on <code>[title, query]</code>.</li>
          <li><strong>Map-based cache grows unbounded:</strong> Without eviction, cache memory increases linearly with unique queries. Mitigation: FIFO eviction at max size (100 entries).</li>
          <li><strong>Dropdown re-render on every keystroke:</strong> Even with debounce, the input re-renders on each onChange. Mitigation: split input state (local <code>useState</code>) from suggestions state (reducer) so input updates don&apos;t re-render the dropdown until debounce fires.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>AbortController:</strong> Cancels in-flight requests, saving bandwidth and preventing stale state.</li>
          <li><strong>Cache with FIFO eviction:</strong> Eliminates redundant API calls for repeated queries.</li>
          <li><strong>Memoized highlight:</strong> <code>useMemo</code> per suggestion prevents recomputing match segments on unrelated state changes.</li>
          <li><strong>State splitting:</strong> Input value in local state, suggestions in reducer. Input typing doesn&apos;t trigger dropdown re-render until debounce fires.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          The query string is sent directly to the API. Before sending, trim whitespace
          and enforce a minimum length (e.g., 2 characters) to prevent unnecessary API
          calls for single-character queries. Sanitize the query to prevent injection
          attacks if the backend is vulnerable.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">XSS Prevention</h3>
        <p>
          Suggestion titles from the API may contain malicious HTML. Never render with
          <code>dangerouslySetInnerHTML</code>. Render as plain text in
          <code>&lt;span&gt;</code> elements. The highlight function splits text into
          segments — each segment is a React text node, automatically escaped.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">WAI-ARIA Combobox Pattern</h4>
          <ul className="space-y-2">
            <li><code>role=&quot;combobox&quot;</code> on the input wrapper with <code>aria-expanded=&quot;true|false&quot;</code>.</li>
            <li><code>role=&quot;listbox&quot;</code> on the dropdown container.</li>
            <li><code>role=&quot;option&quot;</code> on each suggestion with <code>id</code> matching <code>aria-activedescendant</code>.</li>
            <li><code>aria-autocomplete=&quot;list&quot;</code> on the input.</li>
            <li>Screen reader announces &quot;X results available&quot; on fetch success via <code>aria-live=&quot;polite&quot;</code> region.</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li><kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowDown</kbd> — move highlight down (wraps to bottom at end).</li>
            <li><kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowUp</kbd> — move highlight up (wraps to top at start).</li>
            <li><kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> — select highlighted suggestion.</li>
            <li><kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd> — close dropdown, clear input.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Debounce:</strong> Verify function is not called before delay, is called after delay, and <code>cancel()</code> prevents invocation.</li>
          <li><strong>Cache:</strong> Test cache hit returns cached data, cache miss triggers fetch, eviction removes oldest entry at max size.</li>
          <li><strong>Highlight:</strong> Test case-insensitive matching, no match returns full text as non-match, special regex characters in query are escaped.</li>
          <li><strong>Reducer:</strong> Test each action transitions state correctly (idle → loading → success, error recovery, reset).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Typing flow:</strong> Type &quot;reac&quot;, wait 300ms, assert API called, assert dropdown renders suggestions, assert loading spinner disappears.</li>
          <li><strong>Keyboard navigation:</strong> Type query, press ArrowDown 3 times, assert 4th suggestion is highlighted (aria-selected=&quot;true&quot;), press Enter, assert onSelect fires with correct data.</li>
          <li><strong>Abort flow:</strong> Type &quot;rea&quot; then immediately type &quot;react&quot;. Assert only one API call completes (for &quot;react&quot;), the &quot;rea&quot; call was aborted.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>Run axe-core on rendered combobox — no violations.</li>
          <li>Test with VoiceOver/JAWS — suggestions are announced, result count is spoken.</li>
          <li>Test keyboard-only navigation — no mouse required for full interaction.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>No debouncing:</strong> Making an API call on every keystroke. This is the most common mistake. Interviewers expect debouncing as a baseline.</li>
          <li><strong>No abort logic:</strong> When the user types quickly, multiple requests are in flight. If responses arrive out of order, stale results overwrite fresh ones. Candidates must mention AbortController or requestId tracking.</li>
          <li><strong>Using index as key for suggestions:</strong> When the result list changes, React reuses DOM nodes incorrectly, causing stale highlight state. Must use suggestion.id as key.</li>
          <li><strong>Ignoring accessibility:</strong> Rendering a div-based dropdown without ARIA roles. Screen readers announce nothing. Interviewers expect WAI-ARIA Combobox pattern compliance.</li>
          <li><strong>Highlighting with dangerouslySetInnerHTML:</strong> Wrapping matched text in <code>&lt;strong&gt;</code> tags via string replacement. This is an XSS vector if the suggestion title contains user-generated content.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Debounce Delay: 300ms vs 150ms vs 500ms</h4>
          <p>
            Shorter delay (150ms) feels snappier but makes more API calls. Longer delay
            (500ms) feels sluggish but saves bandwidth. 300ms is the sweet spot — matches
            average typing speed. For slow networks, increase to 500ms. For local search,
            reduce to 100ms.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Cache Strategy: FIFO vs LRU</h4>
          <p>
            FIFO (first-in-first-out) is simpler — delete the oldest entry when full.
            LRU (least-recently-used) is smarter but requires tracking access timestamps.
            For autocomplete, FIFO is usually sufficient because users type progressively
            (&quot;a&quot; → &quot;ab&quot; → &quot;abc&quot;), so old prefixes become
            irrelevant. LRU matters more for search with non-sequential queries.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle 10,000 suggestions in the dropdown?</p>
            <p className="mt-2 text-sm">
              A: Virtualize the list using <code>react-window</code> or custom intersection
              observer. Only render visible items (8-10) plus a small buffer. Each item has
              a fixed height, total scroll height = items × itemHeight. Update the visible
              window on scroll.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you add recent searches to the dropdown?</p>
            <p className="mt-2 text-sm">
              A: Store selected suggestions in localStorage (max 10). On focus (before typing),
              show recent searches as a separate section in the dropdown. On typing, merge
              recent matches with API results. Add a &quot;clear history&quot; button. Recent
              searches should have a different visual style (e.g., clock icon).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What if the API is slow (1-2 seconds)? How do you improve UX?</p>
            <p className="mt-2 text-sm">
              A: (1) Show a skeleton loader instead of a spinner — it feels faster.
              (2) Prefetch on focus — start an empty query request to warm the connection.
              (3) Use stale-while-revalidate — show cached results immediately, update
              when fresh data arrives. (4) Add optimistic suggestions based on common
              prefixes while waiting for the API.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you support multi-language input (e.g., CJK characters)?</p>
            <p className="mt-2 text-sm">
              A: Use the <code>compositionend</code> event. CJK input methods fire
              multiple <code>compositionupdate</code> events before the final character
              is committed. Only trigger debounced search on <code>compositionend</code>,
              not on every <code>input</code> event. React&apos;s <code>onChange</code>
              fires on compositionend for CJK, but verify with the target browser.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent the dropdown from being clipped by overflow:hidden parents?</p>
            <p className="mt-2 text-sm">
              A: Render the dropdown in a Portal to escape parent CSS constraints.
              Use <code>createPortal(dropdown, document.body)</code> and position it
              absolutely relative to the input using <code>getBoundingClientRect()</code>.
              Update position on scroll and resize via <code>useLayoutEffect</code>.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Combobox Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a href="https://github.com/downshift-js/downshift" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Downshift — Headless Autocomplete/Combobox Library
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — AbortController API
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2022/03/debouncing-throttling-explained-examples-javascript/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Debouncing &amp; Throttling Explained
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/useSyncExternalStore" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Docs — useSyncExternalStore
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

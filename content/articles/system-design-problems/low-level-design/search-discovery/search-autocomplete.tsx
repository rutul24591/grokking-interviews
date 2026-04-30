"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-search-autocomplete",
  title: "Design a Search Autocomplete",
  description:
    "LLD for a search autocomplete: debounced fetching, abortable requests, keyboard navigation, highlighted suggestions, result caching, and accessibility.",
  category: "low-level-design",
  subcategory: "search-discovery",
  slug: "search-autocomplete",
  wordCount: 7000,
  readingTime: 37,
  lastUpdated: "2026-04-30",
  tags: ["lld", "autocomplete", "search", "debounce", "react", "accessibility"],
  relatedTopics: [
    "full-text-search-ui",
    "rag-based-search-ui",
    "search-page-filters-facets-url-sync",
  ],
};

export default function SearchAutocompleteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a search autocomplete — the
          input that suggests results as the user types,
          letting them pick a suggestion or submit a
          full search. Autocomplete is one of the most
          interaction-dense UI patterns: it dispatches
          requests on nearly every keystroke, races
          responses, surfaces ranked results in a
          dropdown, supports keyboard navigation, and
          must remain fast and accessible. Done well it
          feels invisible (results appear as fast as
          you type); done poorly it&rsquo;s a flickering,
          stale-result mess.
        </p>
        <p>
          The hard problems are: debouncing input so we
          don&rsquo;t fire a request per keystroke;
          abortable requests so a slower earlier
          response can&rsquo;t overwrite a fresher one;
          caching so repeated queries are instant;
          keyboard navigation through suggestions;
          highlighting the matched substring in
          suggestions; integration with both server-side
          and client-side data sources; and ARIA
          combobox semantics so screen readers
          understand what&rsquo;s happening.
        </p>

        <h3>User Context</h3>
        <p>
          End users type queries to find content,
          users, products, or commands. They expect
          suggestions to appear instantly as they
          type and to navigate them with arrow keys.
          Internal users (engineering teams) integrate
          autocomplete via a hook-based API: provide a
          fetch function (or a static dataset), a
          render function for suggestions, an
          onSelect handler. The runtime handles
          everything else.
        </p>

        <h3>Assumptions</h3>
        <p>
          The data source is either a server endpoint
          (returning ranked suggestions per query) or
          a client-side dataset (small enough to
          search locally). For server-side, latency
          is typically 50–300 ms. Modern browsers; we
          use AbortController for request
          cancellation, IntersectionObserver where
          applicable for lazy result loading, and the
          ARIA combobox pattern.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the search backend
          (consumer provides). We do not implement
          full search-results pages (separate Search
          Page). We do not implement RAG or
          semantic search (related but different
          patterns).
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Input field with text entry. Suggestions
          dropdown opens as the user types (after a
          minimum query length, typically 1–2
          characters). Debounced fetching (typically
          150–250 ms after the last keystroke) so we
          don&rsquo;t spam the server. Abortable
          requests: a new query aborts the in-flight
          previous one. Per-query caching: typing
          &ldquo;app&rdquo;, &ldquo;appl&rdquo;,
          &ldquo;apple&rdquo;, then deleting back to
          &ldquo;app&rdquo; instantly shows
          &ldquo;app&rdquo; results. Keyboard
          navigation: down/up arrows move focus through
          suggestions, Enter selects, Escape closes.
          Highlighted match in suggestions
          (substring match emphasis). Loading state
          while fetching. Empty state when no results.
          Recent searches when input is empty.
          Selection commits a value (or fires
          onSelect callback for the consumer to
          decide).
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Grouped suggestions (categorized by type,
          e.g. People, Documents, Files). Rich
          previews on hover or on focus. Voice input.
          Local-first (search the cache while
          server-side query is in flight, merge results
          on response). Recent searches persisted per
          user. Trending searches when the input is
          empty. Server-side personalization (results
          ranked per user). Multi-source results
          (federated search across multiple backends).
        </p>

        <h3>Out of Scope</h3>
        <p>
          The search backend, full results page,
          analytics dashboards.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Suggestions appear within 300 ms of typing
          stop (debounce + network). For cached
          queries, instant. Keyboard navigation through
          suggestions has zero perceptible lag. The
          dropdown renders quickly even with many
          suggestions (virtualize beyond ~50).
        </p>

        <h3>Reliability</h3>
        <p>
          Stale responses never overwrite fresh ones —
          token-based race protection. Network
          failures don&rsquo;t corrupt the dropdown;
          we surface an inline error and keep the
          last-good results. Cache eviction prevents
          unbounded memory growth.
        </p>

        <h3>Security</h3>
        <p>
          Suggestion content rendered as text; HTML
          opt-in via sanitizer. Server enforces
          authorization (a user can only autocomplete
          across resources they have access to).
          Input rate-limited to prevent abuse.
        </p>

        <h3>Accessibility</h3>
        <p>
          Full ARIA combobox pattern:
          <code> role=&quot;combobox&quot;</code>,
          <code> aria-expanded</code>,
          <code> aria-controls</code>,
          <code> aria-activedescendant</code>.
          Suggestions are
          <code> role=&quot;option&quot;</code> in a
          <code> role=&quot;listbox&quot;</code>.
          Screen readers announce result count and
          active suggestion.
        </p>

        <h3>Maintainability</h3>
        <p>
          The runtime is generic over data source
          and suggestion shape. Adapters for server
          and client sources. Renderers
          consumer-supplied.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/search-autocomplete-architecture.svg"
        alt="Search Autocomplete Architecture"
        caption="Input → Debounce → Cache lookup → Fetch (with AbortController + token) → Suggestions list (ARIA listbox) with keyboard navigation. Stale responses discarded; cached queries return instantly; recent searches surface when input is empty."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The component is built around four
          interlocking parts: <strong>debounced fetch
          orchestration</strong>, <strong>abortable
          requests with token-based race
          resolution</strong>, <strong>per-query
          cache</strong>, and <strong>ARIA combobox
          UI</strong>. Each is well-understood
          individually; their interplay is what makes
          the autocomplete feel solid.
        </p>
        <p>
          On <strong>typing</strong>, the runtime updates
          the input value immediately (uncontrolled
          from a fetching perspective; the value
          tracks DOM state). After a debounce window
          (typically 200 ms), we initiate a fetch.
          The debounce timer resets on each keystroke,
          so fast typing doesn&rsquo;t spam the
          server — the fetch fires once typing pauses.
        </p>
        <p>
          On <strong>cache lookup</strong> (before
          fetching), check if we have results for the
          current query. The cache key is the query
          string (normalized: lowercase, trimmed).
          Cache hits return instantly without a
          network round-trip; this is what makes
          backspacing through previously-typed queries
          feel instant. Cache uses LRU eviction with
          a configurable size (default 50 entries).
          Entries expire after a TTL (default 5
          minutes) to avoid serving stale results.
        </p>
        <p>
          On <strong>fetch</strong>, the runtime issues
          a request with an AbortController. Before
          issuing, it aborts any in-flight previous
          request — only one query can be active at
          a time per autocomplete instance. We also
          attach a monotonic token; on response, we
          check if the token matches the current
          query before applying results. Token
          mismatch = stale response, discard
          silently. The combination of abort +
          token is belt-and-suspenders: abort
          prevents most stale responses; tokens
          handle the corner case where the abort
          didn&rsquo;t cancel before the response
          arrived.
        </p>
        <p>
          On <strong>response</strong>, results commit
          to the cache (under the query string) and
          render in the dropdown. Highlighted match
          (typically the matched substring of the
          query within each suggestion&rsquo;s
          display text) is computed at render time.
          The dropdown opens if it isn&rsquo;t already
          open. Loading state clears.
        </p>
        <p>
          On <strong>keyboard navigation</strong>:
          ArrowDown moves focus to the next
          suggestion (wrapping to first after last);
          ArrowUp moves to the previous (wrapping to
          last before first). Home and End jump to
          first/last. The focused suggestion has
          <code> aria-selected=&quot;true&quot;</code>
          and <code>aria-activedescendant</code> on
          the input points to it. Enter activates
          the focused suggestion (or, if none focused
          and the input has a value, submits the
          query as a search). Escape closes the
          dropdown without committing.
        </p>
        <p>
          On <strong>focus and blur</strong>: focus on
          the input opens the dropdown if there&rsquo;s
          a query (showing cached or fetching new).
          If empty, show recent searches. Blur closes
          the dropdown — but with care:
          <code> mousedown</code> on a suggestion
          fires before the input&rsquo;s blur, so we
          listen for mousedown on suggestions and
          prevent default to keep focus on the input
          while still triggering selection on click.
        </p>
        <p>
          On <strong>selection</strong>: clicking a
          suggestion (or pressing Enter on the
          focused one) fires onSelect with the
          suggestion. The consumer decides what
          happens — commit a value, navigate, etc.
          The dropdown typically closes on selection;
          configurable per use case.
        </p>
        <p>
          <strong>Recent searches</strong>: stored in
          localStorage per user. When the input
          focuses with empty value, surface the
          recent searches as suggestions (typically
          5–10 items). Selecting one fills the
          input or fires onSelect with the
          recent.
        </p>
        <p>
          <strong>Match highlighting</strong>: given
          the query and a suggestion&rsquo;s display
          text, find the matched substring (case-
          insensitive) and wrap it in a highlight
          span at render time. For fuzzy matches,
          we may highlight non-contiguous characters;
          for prefix matches, just the prefix
          portion. The highlight algorithm is
          consumer-replaceable (some products want
          fancier highlighting than substring
          match).
        </p>
        <p>
          <strong>Virtualization</strong>: when there
          are many suggestions (rare but possible
          with broad queries), we virtualize the
          dropdown via a 1D virtualizer. For typical
          autocomplete with under 20 suggestions,
          virtualization isn&rsquo;t needed.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>Autocomplete</strong> is the top-level
          component. <strong>Input</strong> is the
          text field with ARIA combobox attributes.
          <strong> Dropdown</strong> renders the
          listbox of suggestions.
          <strong> SuggestionItem</strong> renders one
          suggestion with highlight.
          <strong> FetchOrchestrator</strong> handles
          debounce, cache, AbortController, tokens.
          <strong> SuggestionCache</strong> implements
          LRU. <strong>RecentSearches</strong>{" "}
          manages persisted recents.
          <strong> KeyboardController</strong>{" "}
          handles arrow/enter/escape navigation.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Local state holds: input value, dropdown
          open state, focused suggestion index,
          loading state, results, error. Cache is a
          ref-backed map (no React re-render on
          cache writes). Recent searches in
          localStorage with React state for current
          render.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>fetcher</code> (query → Promise of
          suggestions),
          <code> renderSuggestion</code>,
          <code> onSelect</code>, optional
          <code> debounceMs</code>,
          <code> minQueryLength</code>,
          <code> placeholder</code>. Suggestion
          shape:{" "}
          <code>{` { id, label, value, ...customFields } `}</code>{" "}
          with stable id.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Debounce prevents excessive fetches. Cache
          serves backspaced queries instantly.
          AbortController and tokens prevent stale
          rendering. Virtualization for large result
          sets (rare). Match highlighting computed at
          render time but cheap (substring search).
          Memoized SuggestionItem so unchanged
          suggestions don&rsquo;t re-render on
          arrow-key navigation (only the focused
          one re-renders for highlight change).
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Dropdown opens beneath the input; floating
          UI library handles positioning so it
          doesn&rsquo;t go off-screen. Loading state
          is a subtle spinner inside the input or a
          skeleton row in the dropdown. Empty state
          (&ldquo;No results for [query]&rdquo;) with
          optional remediation. Recent searches when
          empty give users a quick path to repeat.
          Highlighted matches make scanning fast.
          Hover affordances are subtle.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          ARIA combobox pattern fully:
          <code> role=&quot;combobox&quot;</code> on
          input,
          <code> aria-expanded</code>,
          <code> aria-controls</code> pointing to the
          listbox,
          <code> aria-activedescendant</code> pointing
          to the focused option. Listbox is
          <code> role=&quot;listbox&quot;</code> with
          <code> role=&quot;option&quot;</code>{" "}
          children. Result count announces via
          live region (&ldquo;5 results&rdquo;).
          Focused suggestion announces. Keyboard
          parity for all interactions.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Suggestion content rendered as text by
          default; HTML opt-in via consumer-supplied
          sanitizer. Server enforces authorization.
          Input rate-limited at the network layer.
          Highlight rendering is text-only (no DOM
          injection).
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for debounce timing, cache
          hit/miss, abort behavior, token race
          resolution. Integration tests: type, see
          loading, see results; navigate with
          arrows; select with Enter; close with
          Escape. Accessibility tests for ARIA
          attributes and live region announcements.
          Stress test with rapid typing to verify
          no stale results render.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          User types fast and pauses for less than
          debounce window: only one fetch fires.
          User types past debounce, fetch goes out,
          user keeps typing: prior fetch aborts; new
          fetch fires after the next debounce. Slow
          server returns a result that&rsquo;s no
          longer current: token mismatch discards.
          Backspace to a previously cached query:
          instant from cache. Network failure: error
          state in the dropdown with retry; previous
          results retained until next successful
          fetch. Empty input focus: show recent
          searches. Suggestion clicked while input is
          blurring (mousedown vs blur race): we
          listen for mousedown first to commit
          before blur fires. Very long suggestions:
          truncate with ellipsis; tooltip on hover.
          Right-to-left input: ARIA still works;
          arrow keys still navigate.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over fetcher and suggestion shape.
          Custom renderers per product. Cache and
          recent searches pluggable. Works for
          search bars, mention pickers (with @ as
          trigger), command palettes, tag inputs.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Placeholder, loading, empty, error strings
          via i18n. RTL flips dropdown alignment
          via CSS logical properties. Match
          highlighting works on Unicode (combining
          characters preserved).
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Debounce vs throttle</h3>
        <p>
          Debounce waits for typing to pause —
          right for autocomplete because we don&rsquo;t
          want intermediate fetches. Throttle would
          fire periodically during typing — wrong for
          this use case.
        </p>

        <h3>Abort + token vs abort only</h3>
        <p>
          Abort handles most cases; tokens handle the
          corner where the response arrived before
          the abort took effect. Belt and suspenders;
          marginal cost.
        </p>

        <h3>LRU cache vs no cache</h3>
        <p>
          LRU cache makes backspaced queries
          instant — significant UX win at modest
          memory cost. We always cache.
        </p>

        <h3>Server search vs client search</h3>
        <p>
          Server scales for large datasets; client is
          instant for small ones. The fetcher
          adapter abstracts the difference.
        </p>

        <h3>Local merge of cache + server response</h3>
        <p>
          Showing cached results immediately while
          server query is in flight gives the
          best perceived latency for repeat users
          (the cache shows; the server response
          updates if different). Single-source
          (server only or cache only) is simpler
          but slower. We support local-first as
          opt-in.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Voice input. Personalized suggestions based
          on observed usage. Offline-first via
          service worker cache. Multi-source
          federated search. AI-augmented suggestions
          (semantic understanding, not just
          substring match). Predictive prefetch
          (start fetching before debounce completes
          based on prefix patterns).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why debounce typing?</strong> To
          avoid firing a request on every keystroke,
          which would waste bandwidth, server
          resources, and user perception (results
          flickering as intermediate queries
          resolve). Debounce waits for typing to
          pause.
        </p>

        <p>
          <strong>2. How do you prevent stale results
          from rendering?</strong> AbortController
          aborts in-flight previous requests. Tokens
          on each request handle the corner case
          where the response arrives before the
          abort takes effect. Token mismatch =
          discard.
        </p>

        <p>
          <strong>3. How does caching work?</strong>{" "}
          LRU cache keyed by normalized query
          string. Cache hits return instantly. TTL
          prevents stale results. Backspacing
          through previously typed queries is
          instant.
        </p>

        <p>
          <strong>4. How is keyboard navigation
          implemented?</strong> ArrowDown/Up move
          focus through suggestions with wrap.
          Enter activates the focused suggestion.
          Escape closes. Home/End jump to
          first/last.
          <code> aria-activedescendant</code> on the
          input points to the focused option.
        </p>

        <p>
          <strong>5. How is the ARIA combobox pattern
          implemented?</strong>{" "}
          <code>role=&quot;combobox&quot;</code> on
          input, <code>aria-expanded</code>,
          <code> aria-controls</code> pointing to
          listbox,
          <code> aria-activedescendant</code> pointing
          to focused option. Listbox is
          <code> role=&quot;listbox&quot;</code> with
          <code> role=&quot;option&quot;</code>{" "}
          children.
        </p>

        <p>
          <strong>6. How do you handle the
          mousedown-vs-blur race?</strong> Listen for
          mousedown on suggestions and prevent
          default; this triggers selection before
          the input&rsquo;s blur fires, keeping
          focus on the input.
        </p>

        <p>
          <strong>7. How are matches
          highlighted?</strong> At render time, find
          the matched substring (case-insensitive)
          in the suggestion&rsquo;s display text
          and wrap it in a highlight span. For
          fuzzy matching, highlight non-contiguous
          characters per the matcher.
        </p>

        <p>
          <strong>8. How do you handle network
          errors?</strong> Surface an inline error
          in the dropdown with a Retry action.
          Retain previously-shown results until a
          successful fetch replaces them — don&rsquo;t
          clear context on failure.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A search autocomplete is{" "}
          <strong>debounced fetch + abortable + token-
          checked + cached</strong> with ARIA combobox
          UI. The four mechanisms keep the experience
          fast, race-resilient, and accessible. The
          fetcher adapter pattern lets the same
          component drive server-side search,
          client-side search, mention pickers,
          command palettes, and tag inputs — anywhere
          a typed query needs ranked suggestions.
        </p>
      </section>
    </ArticleLayout>
  );
}

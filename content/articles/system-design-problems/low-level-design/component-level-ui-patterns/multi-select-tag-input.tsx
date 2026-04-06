"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-multi-select-tag-input",
  title: "Design a Multi-select / Tag Input Component",
  description:
    "Complete LLD solution for a production-grade multi-select/tag input component with async suggestions, debounced search, result caching, tag creation, grouped options, keyboard navigation, max-selection limits, and full accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "multi-select-tag-input",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "multi-select",
    "tag-input",
    "async-search",
    "debounce",
    "caching",
    "accessibility",
    "keyboard-navigation",
  ],
  relatedTopics: [
    "combobox-pattern",
    "autocomplete-input",
    "form-validation",
    "virtualized-lists",
  ],
};

export default function MultiSelectTagInputArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable multi-select / tag input component for a large-scale
          React application. The component allows users to type a search query, see filtered
          suggestions fetched asynchronously from an API, select multiple items, and display
          chosen items as removable tag pills. The component must support creating custom
          tags not present in the suggestion list, enforce a configurable maximum selection
          limit, group suggestions into categories (e.g., &ldquo;Recent&rdquo;,
          &ldquo;Suggestions&rdquo;), prevent duplicate selections, and provide full keyboard
          navigation and screen-reader accessibility.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Suggestions are fetched from a remote API endpoint that returns paginated or
            filtered results based on the query string.
          </li>
          <li>
            Tags may represent different entities: users, labels, categories, or skills.
            Some tags carry an avatar (e.g., user profile pictures).
          </li>
          <li>
            The component must work in both controlled and uncontrolled modes.
          </li>
          <li>
            Maximum selections is configurable (default: unlimited, but commonly 3-10 in
            practice).
          </li>
          <li>
            The application runs in both light and dark mode.
          </li>
          <li>
            The component may appear inside forms, modals, or data-table filters.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Tag Creation:</strong> Users can add selected items as removable tag
            pills displayed inline above the input field.
          </li>
          <li>
            <strong>Async Suggestions:</strong> As the user types, the component fetches
            suggestions from a remote API. Results are filtered server-side and returned
            to the component.
          </li>
          <li>
            <strong>Debounced Search:</strong> API calls are debounced (default: 300ms)
            to avoid excessive network requests during fast typing.
          </li>
          <li>
            <strong>Result Caching:</strong> Previously fetched results are cached locally
            by query string. If the user types a previously-searched query, cached results
            are returned instantly without a network call.
          </li>
          <li>
            <strong>Create New Tags:</strong> Users can press Enter or click a
            &ldquo;Create &quot;...&quot;&rdquo; option to create a custom tag that does
            not exist in the suggestion list.
          </li>
          <li>
            <strong>Tag Removal:</strong> Each tag pill has a remove button. Backspace on
            an empty input removes the last tag.
          </li>
          <li>
            <strong>Dropdown Display:</strong> A dropdown panel shows filtered suggestions
            with grouped sections (e.g., &ldquo;Recent&rdquo;, &ldquo;Suggestions&rdquo;).
            It shows loading spinners during fetch and empty-state messages when no results
            match.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Arrow Up/Down navigates suggestion
            options, Enter selects the highlighted option, Escape closes the dropdown and
            clears the input, Backspace removes the last tag when the input is empty.
          </li>
          <li>
            <strong>Max Selections:</strong> When the configured maximum is reached, the
            input is disabled and a visual indicator communicates the limit to the user.
          </li>
          <li>
            <strong>Duplicate Prevention:</strong> Already-selected tags are excluded from
            the suggestion list and cannot be added again.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Debounced API calls must not block the main
            thread. Dropdown rendering should handle 200+ options without jank
            (virtualization if necessary).
          </li>
          <li>
            <strong>Reliability:</strong> In-flight requests are cancelled via
            AbortController when a new query is typed before the previous request resolves.
          </li>
          <li>
            <strong>Accessibility:</strong> The component must follow the ARIA Combobox
            pattern: <code>role=&quot;combobox&quot;</code> on the wrapper,
            <code>role=&quot;listbox&quot;</code> on the dropdown,
            <code>aria-selected</code> on options, and <code>aria-live</code> for screen
            reader announcements.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support with generic types for
            tag data, suggestion payloads, and configuration.
          </li>
          <li>
            <strong>Cache Persistence:</strong> The tag cache persists across component
            unmount/remount within a session (in-memory Map) and optionally across page
            refreshes via localStorage.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User types a query, navigates away (component unmounts) before the API
            resolves — the AbortController must cancel the request to avoid setState on
            an unmounted component.
          </li>
          <li>
            User pastes a comma-separated list of tags (e.g., &quot;React, TypeScript,
            NextJS&quot;) — the component should parse and add each as an individual tag.
          </li>
          <li>
            API returns an error (500, network failure) — the dropdown should display an
            error state with a retry option, not crash.
          </li>
          <li>
            User rapidly types and deletes — debounce must fire only after the user stops
            typing for the configured interval.
          </li>
          <li>
            Two users create tags with the same label — deduplication must be label-based
            (case-insensitive) to avoid visually identical tags.
          </li>
          <li>
            The component appears near the bottom of the viewport — the dropdown should
            open upward instead of downward to avoid being clipped.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>selection state management</strong> from
          the <strong>suggestion fetching</strong> and the <strong>UI rendering</strong>
          into three cooperating modules. A Zustand store holds the selected tags, input
          value, loading state, and highlighted suggestion index. A dedicated hook
          (use-suggestions) handles async fetching with AbortController, debounce, caching,
          and result grouping. The UI layer subscribes to both and renders tag pills, the
          input field, and the suggestion dropdown.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>useState + useEffect only:</strong> Viable for simple cases but becomes
            unwieldy when managing input value, selected tags, suggestions, loading state,
            highlight index, and cache simultaneously. State updates become scattered across
            multiple useEffect hooks, leading to stale closures and race conditions.
          </li>
          <li>
            <strong>useReducer:</strong> More structured than useState but still requires
            the parent component to manage all state. Does not solve the problem of sharing
            state between sibling components (tag pills, input, dropdown) without prop
            drilling or context.
          </li>
          <li>
            <strong>Third-party libraries (react-select, Downshift):</strong> Production-ready
            and feature-rich. However, they add significant bundle size (15-30KB gzipped)
            and abstract away the design decisions interviewers expect candidates to
            articulate. Building from scratch demonstrates understanding of the underlying
            patterns.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + custom hooks is optimal:</strong> Zustand provides a
          lightweight, selector-based store that avoids prop drilling and re-render cascades.
          Custom hooks encapsulate the async fetching, debounce, and caching logic, making
          them independently testable and reusable. This pattern keeps the component layer
          thin — it only subscribes to state and renders UI.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>multi-select-types.ts</code>)</h4>
          <p>
            Defines the core types used across the system: <code>Tag</code> (id, label,
            avatarUrl?, color?, category?), <code>Suggestion</code> (id, label, metadata?,
            groupId?), <code>SelectState</code> (selected tags, input value, open/closed
            state, highlight index), and <code>MultiSelectConfig</code> (maxSelections,
            debounceMs, allowCreate, groupBy, cacheSize). See the Example tab for the
            complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Zustand Store (<code>multi-select-store.ts</code>)</h4>
          <p>
            Manages the selection state using Zustand. Exposes actions for adding tags,
            removing tags, toggling the dropdown, updating the input value, setting the
            highlight index, and resetting the component. The store also tracks whether
            the max selection limit has been reached.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>selected: Tag[]</code> — array of selected tag objects
            </li>
            <li>
              <code>inputValue: string</code> — current text in the input field
            </li>
            <li>
              <code>isOpen: boolean</code> — whether the dropdown is open
            </li>
            <li>
              <code>highlightedIndex: number</code> — index of the keyboard-highlighted option
            </li>
            <li>
              <code>isLoading: boolean</code> — whether suggestions are being fetched
            </li>
            <li>
              <code>config: MultiSelectConfig</code> — component configuration
            </li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>addTag(tag: Tag)</code> — adds a tag if under max limit and not duplicate
            </li>
            <li>
              <code>removeTag(id: string)</code> — removes a tag by ID
            </li>
            <li>
              <code>setInputValue(value: string)</code> — updates input, opens dropdown
            </li>
            <li>
              <code>setHighlight(index: number)</code> — sets keyboard highlight index
            </li>
            <li>
              <code>toggleDropdown(open?: boolean)</code> — opens/closes dropdown
            </li>
            <li>
              <code>setLoading(loading: boolean)</code> — sets loading state
            </li>
            <li>
              <code>reset()</code> — clears all state
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Tag Cache (<code>tag-cache.ts</code>)</h4>
          <p>
            An in-memory LRU-style cache that stores API responses keyed by query string.
            Supports configurable maximum entries (default: 100). Provides
            <code>get(query)</code>, <code>set(query, suggestions)</code>, and
            <code>has(query)</code> methods. Optionally persists to localStorage for
            cross-session caching. Also tracks user-created custom tags to prevent
            duplicate creation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. useMultiSelect Hook (<code>use-multi-select.ts</code>)</h4>
          <p>
            The main orchestrator hook. It subscribes to the Zustand store, manages the
            debounce timer for input changes, coordinates with the cache, and exposes
            callbacks for the UI components (onInputChange, onTagAdd, onTagRemove,
            onKeyDown). Handles the paste-split logic for comma-separated tag input.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useSuggestions Hook (<code>use-suggestions.ts</code>)</h4>
          <p>
            Encapsulates async suggestion fetching. Uses AbortController to cancel
            in-flight requests when the query changes. Checks the cache before making
            network calls. Groups results by category (e.g., &ldquo;Recent&rdquo;,
            &ldquo;Suggestions&rdquo;) based on the config. Filters out already-selected
            tags from the results. Returns <code>{`{ suggestions, isLoading, error, groups }`}</code>.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. UI Components</h4>
          <p>
            The rendering layer consists of six components: the root MultiSelect wrapper,
            TagPill for individual tags, SuggestionDropdown for the grouped options panel,
            SuggestionOption for each option row, InputField for the text input with
            auto-resize, and a CreateOption component for the &ldquo;Create ...&rdquo;
            entry when allowCreate is enabled. See the Example tab for the complete
            implementation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for selection state. Selected
          tags are stored as an array. The inputValue drives the suggestion fetch via the
          useMultiSelect hook, which debounces changes and delegates to useSuggestions.
          The highlightedIndex is managed in the store so keyboard navigation updates are
          globally visible to all components (dropdown options scroll into view, input
          aria-activedescendant updates).
        </p>
        <p>
          The cache is external to the store — it is a plain Map (or a class wrapping a
          Map) accessed by the useSuggestions hook. This separation ensures the store
          remains small and serializable, while the cache handles potentially large
          response payloads.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User types &ldquo;re&rdquo; into the input field.
          </li>
          <li>
            <code>onInputChange</code> fires, store updates inputValue, dropdown opens.
          </li>
          <li>
            useMultiSelect starts a 300ms debounce timer.
          </li>
          <li>
            Timer fires: useSuggestions checks cache for &ldquo;re&rdquo;. Cache miss.
          </li>
          <li>
            useSuggestions creates AbortController, calls API:
            <code>GET /api/tags?q=re</code>.
          </li>
          <li>
            API responds with <code>[{"{ id, label, category }"}, ...]</code>. Results cached by query.
          </li>
          <li>
            useSuggestions filters out already-selected tags, groups results, updates
            suggestion state.
          </li>
          <li>
            SuggestionDropdown re-renders with grouped options.
          </li>
          <li>
            User presses Arrow Down: highlightedIndex increments, SuggestionOption scrolls
            into view, aria-activedescendant updates.
          </li>
          <li>
            User presses Enter: highlighted option is added as a tag via store.addTag(),
            input clears, dropdown stays open if more suggestions exist.
          </li>
          <li>
            TagPill renders for the new tag with a remove button.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. User input flows
          into the store, the store change triggers the debounce hook, the hook fetches
          suggestions, suggestions flow back into the store, and the UI re-renders from
          store state. This ensures predictable behavior and makes each stage independently
          testable.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>AbortController on query change:</strong> If the user types &ldquo;re&rdquo;
            then immediately types &ldquo;rea&rdquo;, the previous request for &ldquo;re&rdquo;
            is aborted via <code>controller.abort()</code>. The hook catches the
            AbortError and ignores it (it is not a real error). This prevents stale
            results from overwriting fresher data.
          </li>
          <li>
            <strong>Paste handling:</strong> On paste event, the input value is split by
            comma, semicolon, or tab delimiters. Each trimmed segment is checked against
            selected tags for duplicates. Non-duplicate segments are added as tags, and
            the input clears. The dropdown closes if all pasted items resolved to tags.
          </li>
          <li>
            <strong>Max limit reached:</strong> When <code>selected.length === config.maxSelections</code>,
            the input sets <code>disabled</code>, a visual banner appears (&ldquo;Maximum
            5 selections reached&rdquo;), and further add attempts are silently ignored
            (not treated as errors).
          </li>
          <li>
            <strong>Viewport edge detection:</strong> The dropdown uses a ResizeObserver
            on mount to compute available space below the input. If insufficient space
            exists (less than 200px), the dropdown opens upward (<code>bottom: 100%</code>)
            instead of downward.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 12 files: type
            definitions, Zustand store with selection management, tag cache with LRU
            eviction, useMultiSelect orchestrator hook, useSuggestions async hook with
            AbortController and caching, root MultiSelect component, TagPill,
            SuggestionDropdown, SuggestionOption, InputField, and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the top of the
            article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (multi-select-types.ts)</h3>
        <p>
          Defines the <code>Tag</code> interface with id, label, optional avatarUrl, color,
          and category. The <code>Suggestion</code> interface extends Tag with an optional
          groupId for grouping. <code>SelectState</code> captures the full store shape.
          <code>MultiSelectConfig</code> exposes tunable parameters: maxSelections,
          debounceMs, allowCreate, groupBy strategy, and cacheSize. Generics allow the
          component to carry custom metadata through the type system.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (multi-select-store.ts)</h3>
        <p>
          The store manages selected tags, input value, open/closed state, highlight index,
          and loading state. Key design decisions include: using a computed
          <code>isAtMax</code> selector to gate input availability, deduplicating tags by
          both id and label (case-insensitive) in the addTag action, and auto-opening the
          dropdown when inputValue becomes non-empty. The store accepts an initial
          configuration object so multiple instances on the same page can have different
          limits and behavior.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Tag Cache (tag-cache.ts)</h3>
        <p>
          A class wrapping a <code>Map&lt;string, Suggestion[]&gt;</code> with LRU eviction.
          When the cache exceeds maxSize, the least-recently-accessed entry is removed.
          The cache also maintains a Set of user-created custom tag labels to prevent
          duplicate creation. Optionally serializes to localStorage on every write and
          deserializes on instantiation for cross-session persistence.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: useMultiSelect Hook (use-multi-select.ts)</h3>
        <p>
          The orchestrator hook wires together the store, debounce logic, and suggestion
          fetching. It uses <code>useMemo</code> for a stable debounce timer (via
          <code>useRef</code>), fires the suggestion fetch after the debounce interval,
          and handles paste events by splitting on delimiters. The hook returns callbacks
          (onInputChange, onTagAdd, onTagRemove, onKeyDown, onPaste) that the UI
          components consume directly.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useSuggestions Hook (use-suggestions.ts)</h3>
        <p>
          Encapsulates the async fetch cycle. On query change, it cancels the previous
          AbortController, checks the cache, and if missing, calls the fetcher function.
          On success, it stores results in the cache, filters out already-selected tags,
          and groups them by the configured strategy. On error, it sets an error state
          that the dropdown renders as a retryable message. The hook returns
          <code>{`{ groups, isLoading, error, totalCount }`}</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: UI Components (multi-select.tsx, tag-pill.tsx, suggestion-dropdown.tsx, suggestion-option.tsx, input-field.tsx)</h3>
        <p>
          The root MultiSelect component composes all sub-components: it renders the tag
          pill list, the input field, and the suggestion dropdown. It uses
          <code>useClickOutside</code> to close the dropdown when the user clicks outside.
          TagPill renders an optional avatar, the tag label, and a remove button with
          <code>aria-label</code>. SuggestionDropdown renders grouped sections with
          headers. SuggestionOption renders each row with a selected indicator (checkmark)
          and keyboard highlight styling. InputField manages auto-resize via a hidden
          measurement span and focuses itself when a tag is removed.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
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
                <td className="p-2">addTag</td>
                <td className="p-2">O(n) — duplicate check scans selected</td>
                <td className="p-2">O(n) — stores n selected tags</td>
              </tr>
              <tr>
                <td className="p-2">removeTag</td>
                <td className="p-2">O(n) — array filter</td>
                <td className="p-2">O(1) — removes one entry</td>
              </tr>
              <tr>
                <td className="p-2">cache lookup</td>
                <td className="p-2">O(1) — Map.get</td>
                <td className="p-2">O(m) — m cached queries</td>
              </tr>
              <tr>
                <td className="p-2">suggestion filter</td>
                <td className="p-2">O(s) — s suggestions scanned</td>
                <td className="p-2">O(s) — filtered result array</td>
              </tr>
              <tr>
                <td className="p-2">debounce timer</td>
                <td className="p-2">O(1) — clearTimeout/setTimeout</td>
                <td className="p-2">O(1) — single timer ref</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of selected tags (typically less than 10),
          <code>m</code> is the number of cached queries (bounded by cacheSize, default
          100), and <code>s</code> is the number of suggestions returned by the API
          (typically less than 200). All operations are well within the 16ms frame budget.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Duplicate check on add:</strong> O(n) scan of selected tags for each
            add. For large selection sets (50+ tags), this could degrade. Mitigation:
            maintain a <code>Set&lt;string&gt;</code> of selected IDs alongside the array
            for O(1) lookup. The trade-off is additional state synchronization overhead,
            which is not worth it for n less than 10.
          </li>
          <li>
            <strong>Dropdown render cost:</strong> Rendering 200+ suggestion options as
            DOM nodes causes layout cost. Mitigation: virtualize the dropdown list using
            a windowing library (e.g., @tanstack/react-virtual) so only visible rows are
            rendered. For most use cases, APIs return paginated results (20-50 items),
            making virtualization unnecessary.
          </li>
          <li>
            <strong>Cache memory growth:</strong> Unbounded cache growth with unique queries
            could consume significant memory. Mitigation: LRU eviction with a configurable
            max size (default: 100 entries). Each entry stores an array of suggestions
            (typically less than 2KB), so 100 entries use approximately 200KB.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>AbortController for stale requests:</strong> Cancelling in-flight
            requests prevents wasted network bandwidth, server load, and stale data
            overwriting fresh results. This is the single most impactful optimization
            for the async fetch path.
          </li>
          <li>
            <strong>Debounce with leading edge option:</strong> For slow typists, a
            leading-edge debounce (fire immediately, then suppress subsequent calls) can
            reduce perceived latency. The default trailing-edge debounce (wait then fire)
            is better for fast typists. Make it configurable.
          </li>
          <li>
            <strong>Selector-based subscriptions:</strong> Each sub-component subscribes
            only to the store slices it needs. TagPill subscribes to selected tags,
            InputField subscribes to inputValue and isAtMax, SuggestionDropdown subscribes
            to isOpen and suggestions. This prevents unnecessary re-renders.
          </li>
          <li>
            <strong>Request deduplication:</strong> If multiple MultiSelect instances on
            the same page search for the same query simultaneously, deduplicate the API
            call using a shared in-flight promise map keyed by query string. The first
            caller initiates the fetch; subsequent callers await the same promise.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization</h3>
        <p>
          User-entered tag labels (both from suggestions and custom-created tags) are
          rendered as text content, which React automatically escapes. However, if tag
          labels are rendered via <code>dangerouslySetInnerHTML</code> (e.g., for rich
          text highlights), they become XSS vectors. Always sanitize HTML content before
          rendering. For avatar URLs, validate that they are well-formed URLs from
          trusted domains to prevent open-redirect or data-exfiltration attacks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">API Security</h3>
        <p>
          The suggestion fetch endpoint should enforce rate limiting per user session to
          prevent abuse (e.g., a script sending one query per keystroke to exhaust server
          resources). The client-side debounce (300ms) provides some protection but is
          easily bypassed. Server-side rate limiting (e.g., 10 requests per second per
          session) is the authoritative defense. Additionally, the API should validate
          and sanitize the query parameter to prevent injection attacks (SQL, NoSQL, or
          command injection depending on the backend).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Combobox Pattern</h4>
          <ul className="space-y-2">
            <li>
              The wrapper element has <code>role=&quot;combobox&quot;</code> with
              <code>aria-expanded</code> reflecting the dropdown open/closed state and
              <code>aria-owns</code> pointing to the listbox ID.
            </li>
            <li>
              The input has <code>role=&quot;combobox&quot;</code> (or is a native
              <code>&lt;input&gt;</code> within the combobox wrapper) with
              <code>aria-autocomplete=&quot;list&quot;</code> and
              <code>aria-activedescendant</code> pointing to the highlighted option ID.
            </li>
            <li>
              The dropdown has <code>role=&quot;listbox&quot;</code> and each option has
              <code>role=&quot;option&quot;</code> with <code>aria-selected</code> set to
              true if the option is already selected as a tag.
            </li>
            <li>
              An <code>aria-live=&quot;polite&quot;</code> region announces selection
              changes to screen readers (e.g., &ldquo;React added&rdquo;, &ldquo;TypeScript
              removed&rdquo;).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Arrow Down</kbd> /
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Arrow Up</kbd> —
              navigate suggestion list, wrap around at boundaries.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd> —
              select highlighted suggestion or create new tag from input text.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Backspace</kbd> —
              remove last tag when input is empty.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd> —
              close dropdown and clear input.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Tab</kbd> — select
              highlighted option and move focus to next form element.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CSRF and Auth</h3>
        <p>
          If the suggestion API requires authentication, the fetch call must include
          credentials (e.g., <code>credentials: &quot;include&quot;</code> or an Authorization
          header from the app&apos;s auth context). The component itself does not manage
          auth — it accepts a fetcher function from the parent, which is responsible for
          attaching auth tokens. This keeps the component decoupled from the app&apos;s
          auth strategy.
        </p>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test addTag adds a tag and rejects duplicates
            (by id and by label, case-insensitive), removeTag removes the correct tag,
            setInputValue updates the value and opens the dropdown, setHighlight clamps
            index within bounds, toggleDropdown respects the passed boolean, and reset
            clears all state.
          </li>
          <li>
            <strong>Cache operations:</strong> Test set/get/has, LRU eviction when maxSize
            is exceeded, and custom-tag deduplication.
          </li>
          <li>
            <strong>Debounce logic:</strong> Mock <code>setTimeout</code> and verify that
            the fetch callback fires only after the debounce interval, not before. Test
            that rapid input resets the timer each time.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full user flow:</strong> Render MultiSelect, type a query, verify
            dropdown opens with suggestions. Press Arrow Down then Enter, verify tag pill
            appears and input clears. Press Backspace, verify tag is removed.
          </li>
          <li>
            <strong>AbortController:</strong> Mock a slow API response. Type a new query
            before the first resolves. Verify the first request was aborted and only the
            second request&apos;s results are rendered.
          </li>
          <li>
            <strong>Cache hit:</strong> Type query &ldquo;re&rdquo;, wait for results.
            Clear input, type &ldquo;re&rdquo; again. Verify no network call was made
            (cached results used).
          </li>
          <li>
            <strong>Max limit:</strong> Set maxSelections to 2. Add two tags. Verify input
            is disabled and a limit message is displayed. Attempt to add a third tag
            programmatically — verify it is rejected.
          </li>
          <li>
            <strong>Paste handling:</strong> Paste &ldquo;React, TypeScript, NextJS&rdquo;
            into the input. Verify three tags are created and input is cleared.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>
            Run axe-core automated checks on the rendered component. Verify combobox
            role, listbox role, option roles, aria-selected states, aria-activedescendant
            updates, and aria-live announcements.
          </li>
          <li>
            Test keyboard-only navigation: Arrow keys, Enter, Escape, Backspace, and Tab
            all behave as specified.
          </li>
          <li>
            Test with a screen reader (NVDA, VoiceOver): verify that selection changes
            are announced via the live region, and that option navigation is announced
            via aria-activedescendant.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Component unmount during in-flight request: verify no setState on unmounted
            component (no React warnings in console).
          </li>
          <li>
            API returns 500 error: verify dropdown shows error state with retry button,
            not a crash.
          </li>
          <li>
            Empty query: verify dropdown shows recent tags or closes (configurable), not
            an infinite loading spinner.
          </li>
          <li>
            Dropdown near viewport bottom: verify it opens upward, not downward.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>No debouncing:</strong> Candidates often fire an API call on every
            keystroke. Interviewers expect at minimum a basic debounce. Without it, typing
            &ldquo;typescript&rdquo; triggers 10 API calls — wasteful and likely rate-limited.
          </li>
          <li>
            <strong>Stale race conditions:</strong> Not cancelling in-flight requests when
            the query changes. If request A (for &ldquo;re&rdquo;) resolves after request
            B (for &ldquo;react&rdquo;), the dropdown shows stale results. AbortController
            or a request-ID check is the standard fix.
          </li>
          <li>
            <strong>Missing accessibility:</strong> Rendering a dropdown as a plain
            <code>&lt;div&gt;</code> without ARIA roles means screen readers cannot
            communicate the combobox pattern to users. Interviewers look for candidates
            who know the ARIA Combobox pattern.
          </li>
          <li>
            <strong>No duplicate prevention:</strong> Allowing the same tag to be added
            multiple times creates a broken UX. Deduplication by both id and label
            (case-insensitive) is expected.
          </li>
          <li>
            <strong>Ignoring keyboard navigation:</strong> Only supporting mouse clicks
            for suggestion selection is a red flag. Interviewers expect Arrow keys, Enter,
            Escape, and Backspace to work correctly.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Debounce Delay: 200ms vs 300ms vs 500ms</h4>
          <p>
            A shorter debounce (200ms) feels more responsive but generates more API calls.
            A longer debounce (500ms) reduces server load but introduces perceptible lag
            between typing and seeing suggestions. The sweet spot is 300ms — below the
            human perception threshold for delay (~350ms) while still batching most
            keystrokes. For slow APIs (greater than 500ms response time), increase to
            400-500ms. For fast, local searches (client-side filtering), 150ms is sufficient.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">In-Memory Cache vs localStorage Persistence</h4>
          <p>
            An in-memory Map cache is fast (O(1) lookup) but clears on page refresh.
            Persisting to localStorage survives refreshes but adds serialization overhead
            and has a 5-10MB storage limit. For most applications, in-memory is sufficient
            because users rarely repeat the exact same search within a session. localStorage
            persistence is justified when the suggestion data is expensive to fetch (e.g.,
            requires a multi-table server-side join) and users frequently re-open the same
            component.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Zustand vs useState for Selection State</h4>
          <p>
            useState is simpler and sufficient if the multi-select is a leaf component
            (no sibling components need access to selection state). Zustand becomes
            necessary when the selected tags need to be consumed by a sibling form
            validation component, a submit button that enables/disables based on selection,
            or a parent dashboard that aggregates filters. Zustand avoids prop drilling
            and makes the state globally accessible without context boilerplate.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle 10,000+ suggestions without virtualization?
            </p>
            <p className="mt-2 text-sm">
              A: First, push filtering to the server — the API should only return the top
              50 most relevant results, not the full dataset. If client-side filtering is
              unavoidable, use a trie or prefix tree data structure for O(k) lookup where
              k is the query length, rather than scanning 10,000 items on every keystroke.
              The trie is built once on component mount (O(n * L) where L is average label
              length) and each lookup is O(k). This is how client-side autocomplete
              libraries like Awesomplete work.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add drag-and-drop reordering of selected tags?
            </p>
            <p className="mt-2 text-sm">
              A: Use the HTML Drag and Drop API or a library like @dnd-kit/sortable. Each
              TagPill gets a <code>draggable</code> attribute and a drag handle. On drag
              end, the store&apos;s selected array is reordered via a splice operation.
              The key consideration is that the array order matters for display but not
              for the logical set of selected items — when submitting the form, you may
              want to send just the IDs regardless of order.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support multi-language tag labels (i18n)?
            </p>
            <p className="mt-2 text-sm">
              A: Store a <code>labels</code> map on the Tag type (e.g.,
              <code>{"{ en: 'React', es: 'Reacto', fr: 'React' }"}</code>) and resolve
              the label based on the current locale from the app&apos;s i18n context. The
              suggestion API should accept a language parameter and return localized labels.
              Deduplication should still be by ID, not by label, since the same entity has
              different labels in different languages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add tag validation (e.g., email-format tags only)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>validator</code> function to MultiSelectConfig that takes a
              label string and returns a boolean (or a result type with an error message).
              The addTag action runs the validator before adding. If validation fails, the
              tag is rejected and an inline error appears below the input (e.g.,
              &ldquo;&quot;invalid-email&quot; is not a valid email address&rdquo;). The
              validator runs for both suggestion-based and custom-created tags.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you share the same suggestion cache across multiple MultiSelect
              instances on the same page?
            </p>
            <p className="mt-2 text-sm">
              A: Make the TagCache a singleton (export a single instance) or use a
              module-level Map that all useSuggestions hooks reference. To avoid cache key
              collisions between different endpoints (e.g., one MultiSelect searches users,
              another searches labels), prefix cache keys with a namespace:
              <code>{"`${namespace}:${query}`"}</code>. Each MultiSelect instance passes
              its namespace via config.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle React 18 concurrent rendering?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React&apos;s rendering
              cycle, so it works correctly with concurrent features. The store uses
              useSyncExternalStore for subscription synchronization. The debounce timer
              and AbortController are both side effects managed in useEffect, which React
              18 handles correctly during concurrent renders. API calls are initiated in
              useEffect (not during render), avoiding the double-fire issue in StrictMode
              (the AbortController cleanup ensures the first call is cancelled and
              re-created).
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Combobox Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://react-select.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Select — Production-Ready Select Component
            </a>
          </li>
          <li>
            <a
              href="https://www.radix-ui.com/primitives/docs/components/select"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI Select — Accessible Select Component Primitives
            </a>
          </li>
          <li>
            <a
              href="https://zustand-demo.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://downshift-js.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Downshift — Primitives for Building Accessible Autocomplete Components
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/aria-combobox"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Accessible Combobox Patterns and Implementation Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

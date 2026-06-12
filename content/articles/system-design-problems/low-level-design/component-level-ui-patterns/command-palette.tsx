"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-command-palette",
  title: "Design a Command Palette / Spotlight Search",
  description:
    "Command palette with fuzzy search ranking, plugin architecture, async data sources, keyboard navigation, recency weighting, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "command-palette",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: [
    "lld",
    "command-palette",
    "spotlight-search",
    "fuzzy-matching",
    "plugin-architecture",
    "accessibility",
    "Web Worker",
    "recency-weighting",
  ],
  relatedTopics: ["rich-text-editor", "multi-select-tag-input", "tooltip-system"],
};

export default function CommandPaletteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design a Command Palette</h1>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Command Palette / Spotlight Search around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>Design a Command Palette is a low-level design problem about implementing shortcut arbitration, focus trapping, query normalization, fuzzy ranking, async provider fan-out, stale-response rejection, nested navigation, and command execution. A principal-level interview answer must define ownership boundaries, browser and accessibility semantics, local data structures, lifecycle cleanup, server reconciliation, and explicit degraded behavior.</p>
        <p>Treat registered commands, the current query, active result, nested route, and async request generation as separate state so stale providers cannot overwrite newer results. The central structures are command registry, permission predicate, normalized search index, ranked result list, request generation, nested route stack, recent-command weights, and execution audit event. The implementation is not complete until cancellation, stale work, SSR behavior, privacy, metrics, and rollback are deliberate rather than incidental.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/command-palette-runtime.svg" alt="Design a Command Palette runtime flow" caption="Runtime flow: input becomes a guarded state transition, a semantic projection, and a recoverable outcome." />
      </section>
      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Command Palette / Spotlight Search, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>The following deep dive preserves the component-specific mechanics and browser constraints that determine the implementation.</p>
        <p>
        The command palette (Cmd+K or Ctrl+K) is one of the most ergonomic power-user
        interfaces in modern software — Figma, Vercel, Linear, GitHub, VS Code, and
        Notion all have one. It surfaces any action or navigation target through a
        single unified search interface, eliminating the need to navigate menus or
        remember shortcut keys. Building a production command palette requires a fuzzy
        search engine with ranking, an extensible command registry, async data sources,
        keyboard-exclusive navigation, a recency/frequency weighting system, and
        strict accessibility semantics. The design is interesting because it is a
        microcosm of search infrastructure applied to a UI widget.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/command-palette-architecture.svg"
        alt="Command palette architecture diagram"
        caption="Command palette architecture: command registry, fuzzy search, async data sources, keyboard navigation"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        Key scope questions before designing:
      </p>
      <p>
        <strong>Commands only, or also navigation?</strong> A pure command palette
        (VS Code's Ctrl+Shift+P) shows only actions (commands). A hybrid Spotlight
        (Figma's Cmd+K, Linear's Cmd+K) shows both commands ("Create issue") and
        entities ("Go to issue ENG-123: Fix login bug"). The hybrid version requires
        searching both a static command list and dynamic entity data (from the backend).
      </p>
      <p>
        <strong>Sync or async results?</strong> A static command list can be searched
        synchronously on the main thread. Dynamic entity results (searching issues,
        pages, users) require async API calls. The UX must handle loading states,
        errors, and stale results gracefully.
      </p>
      <p>
        <strong>Nested menus?</strong> Some palettes support "scoped" commands — selecting
        "Set status" opens a sub-menu of status options. This is a significant UX
        pattern that requires a navigation stack (breadcrumbs showing where in the
        command tree the user is).
      </p>
      <p>
        <strong>Recent/frequent commands?</strong> A recently-used list that appears
        when the palette opens with an empty query is a critical usability feature.
        The ranking of results should weight recency and frequency.
      </p>

      <h3>The Command Registry</h3>
      <p>
        The command registry is a static list (or Map) of all available commands.
        Each command has: an id (unique string), a label (displayed text), keywords
        (alternative search terms — "remove" as a keyword for a "Delete" command),
        an icon, a category (for grouping in search results), and an action (a
        function to call when the command is selected).
      </p>
      <p>
        The registry is populated at app initialization and augmented by plugins or
        context-sensitive commands. Context-sensitive commands appear only when
        specific conditions are met — "Delete selected item" appears only when
        something is selected. These are registered dynamically: a React hook
        (useRegisterCommand) registers a command on mount and unregisters on unmount.
        The hook adds the command to the registry when the component mounts (and the
        condition is met) and removes it on unmount. This way, the palette always
        reflects the current application context.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Context-sensitive command registration is the key design insight that separates
        a flexible command palette from a hardcoded one. Commands are owned by the
        components that provide them, not by a central list. A "Delete layer" command
        is registered by the layer panel component when a layer is selected; it
        disappears when no layer is selected. This decouples the palette from knowing
        anything about the application's domain model — it just searches whatever is
        currently registered.
      </HighlightBlock>

      <h3>Fuzzy Search Algorithm</h3>
      <p>
        The search must find relevant results even when the user's query is not an
        exact prefix match. Fuzzy matching allows for typographical flexibility:
        "crt iss" should match "Create issue"; "fnt sz" should match "Font size."
      </p>
      <p>
        The algorithm used by most command palettes (and by libraries like fuse.js
        and the algorithm in VS Code's command palette) is a subsequence matcher with
        scoring. A query matches a string if all characters of the query appear in
        the string in order (as a subsequence), regardless of position or gaps between
        them. "crt" matches "Create" because c, r, t appear in that order.
      </p>
      <p>
        The score determines ranking. Higher scores are better. Score computation:
        consecutive character matches score higher than non-consecutive matches
        (matching "fi" in "file" at positions 0-1 scores higher than positions 0 and 3).
        Matches at the start of a word (word boundary) score higher than matches in
        the middle. A match at position 0 (the very start) scores highest. The total
        score is the sum of match-quality scores for each matched character.
      </p>
      <p>
        This bipartite matching approach is fast (O(n*m) where n is query length and
        m is string length) and produces intuitively correct rankings. Fuse.js implements
        a variant of the Bitap algorithm which is equivalent but bit-parallel and
        extremely fast in practice.
      </p>

      <h3>Search Result Ranking</h3>
      <p>
        Beyond fuzzy match score, result ranking incorporates recency and frequency.
        Items the user has selected recently or frequently should rank higher for
        the same query relevance score.
      </p>
      <p>
        The recency/frequency store: maintain a Map from command ID (or entity ID)
        to a score. On each selection, increment the score for the selected item.
        Apply time decay: scores from older selections contribute less. A simple
        implementation: store a list of timestamps for each item's selections; the
        recency score is a weighted sum of inversely-time-decayed selection counts
        (each selection at age t contributes weight = exp(-lambda * t) where lambda
        controls the decay rate). Persist this store to localStorage so it survives
        page reloads.
      </p>
      <p>
        The final rank combines the fuzzy match score and the recency/frequency score.
        Normalize each to [0, 1] and compute a weighted combination: total_score =
        alpha * match_score + (1 - alpha) * recency_score, where alpha is tuned
        (typically 0.7–0.8, heavily weighting match relevance). Items with zero match
        score (the query does not match) are excluded regardless of recency.
      </p>
      <p>
        When the query is empty (the palette was just opened), show the most recent N
        items from the recency/frequency store rather than all commands. This is the
        "recent items" view that makes the palette immediately useful without typing.
      </p>

      <h3>Async Data Sources</h3>
      <p>
        Entity search results (issues, documents, users, pages) are fetched from the
        backend. The fetch is triggered by each query change, debounced by 150–200ms
        to avoid a request on every keystroke.
      </p>
      <p>
        The results from static (command registry) and dynamic (API) sources are merged
        and displayed together. The merge strategy: show static results immediately
        (they are available synchronously); show a loading indicator in the dynamic
        results section; replace the loading indicator with API results when the
        fetch completes.
      </p>
      <p>
        Race condition handling: if the user types quickly, multiple fetch requests
        are in flight. Only the response to the most recent query should be applied.
        Use AbortController to cancel superseded requests: on each new fetch, abort
        the previous controller and create a new one.
      </p>
      <p>
        Error handling: if the API request fails, show a subtle error state in the
        dynamic results section ("Could not load results — showing local results only")
        and continue showing the static command results. Do not close the palette or
        show a blocking error.
      </p>

      <h3>Grouping and Sectioning</h3>
      <p>
        Results are grouped by category for visual clarity. Categories: "Recent" (items
        from the recency store), "Commands" (static command registry matches), "Pages"
        (entity search results), "People" (user search results). Each category has a
        heading and a list of items below it.
      </p>
      <p>
        Category ordering: "Recent" is always first (if the query is empty); otherwise,
        the most relevant category's results lead. Within a category, items are sorted
        by their combined score.
      </p>
      <p>
        Category collapsing: if a category has many results (more than 5–8), show only
        the top N with a "Show more" button at the bottom of that section. Clicking it
        expands to show all results in that category. This keeps the initial result
        list compact.
      </p>

      <h3>Keyboard Navigation</h3>
      <p>
        The command palette is keyboard-first. Mouse support is secondary. The
        interaction model:
      </p>
      <p>
        Opening: a global keyboard shortcut (Cmd+K / Ctrl+K) opens the palette with
        the text input focused. Register this as a keydown listener on document in a
        useEffect at the app root. The palette renders in a portal on top of all other
        content.
      </p>
      <p>
        Navigation: Arrow Down moves selection to the next item; Arrow Up moves to the
        previous. The selection wraps around (Down from the last item goes to the first).
        Home moves to the first item; End moves to the last.
      </p>
      <p>
        Selection: Enter activates the selected item's action. Escape closes the palette.
        Tab should not move selection within the palette (it is keyboard navigation,
        not focus management) — Tab closes the palette and returns focus to the
        triggering element.
      </p>
      <p>
        The text input always has keyboard focus. Arrow key events are intercepted
        in the input's keydown handler, preventing cursor movement in the input when
        the user intends to navigate the results list.
      </p>
      <HighlightBlock as="p" tier="important">
        The selection state is managed as a flat index into the linearized result list
        (categories flattened with their items in order). Category headings are skipped
        in navigation (they are not selectable). When the query changes and the result
        list is rebuilt, reset the selection index to 0 (first item) so keyboard
        navigation starts from the top of new results, not an arbitrary position in
        the old list.
      </HighlightBlock>

      <h3>Nested Commands (Sub-menus)</h3>
      <p>
        Some commands lead to a sub-menu — "Change status" opens a list of status
        options. This is implemented as a navigation stack: the current palette view
        is the top of the stack. Selecting a "parent" command pushes a new view onto
        the stack (the sub-menu). Pressing Escape or selecting a "back" item pops
        the stack to the previous view.
      </p>
      <p>
        The breadcrumb trail at the top of the palette shows the current navigation
        path: "Change status" appears as a breadcrumb when viewing the status sub-menu.
        Clicking a breadcrumb item navigates back to that level.
      </p>
      <p>
        The text input in a sub-menu filters only the items in that sub-menu, not all
        commands. The search scope is always the current level.
      </p>

      <h3>Portal and Focus Management</h3>
      <p>
        The palette renders in a React portal (ReactDOM.createPortal) at the document
        body, avoiding z-index and overflow: hidden issues from ancestor elements.
        It is wrapped in a modal focus trap: Tab inside the palette cycles between the
        text input and any other focusable elements within the palette (the "Show more"
        buttons, scrollable region). Focus does not escape the palette while it is open.
      </p>
      <p>
        Opening: save the previously focused element in a ref. Move focus to the text
        input. Closing: return focus to the saved element. This ensures keyboard users
        return to their position in the application after using the palette.
      </p>
      <p>
        The backdrop (the overlay behind the palette) closes the palette on click. It
        does not steal focus from the palette while the palette is open.
      </p>

      <h3>ARIA and Screen Reader Semantics</h3>
      <p>
        The palette's input element is a combobox: role="combobox" with aria-expanded,
        aria-controls pointing to the listbox ID, and aria-autocomplete="list."
        The results container has role="listbox." Each result item has role="option"
        with aria-selected="true" for the currently selected item. Category headings
        are rendered as aria-group with an aria-labelledby.
      </p>
      <p>
        The combobox pattern is the correct ARIA widget for a searchable dropdown with
        keyboard selection. Screen readers announce the number of matching options
        (via a hidden aria-live="polite" status region: "5 results found") and the
        currently selected option's label as the user navigates with arrow keys.
      </p>
      <p>
        For the loading state, the status region announces "Loading results..." when
        a fetch is in progress, and updates to "N results found" when the fetch
        completes. This keeps screen reader users informed of the asynchronous state
        without requiring them to navigate to a visual spinner.
      </p>

      <h3>Performance Optimizations</h3>
      <p>
        Fuzzy search over a large command registry (thousands of commands) can stall
        the main thread if done synchronously. Move the search to a Web Worker: send
        the query and the full command list to the worker; the worker returns ranked
        results. The Worker approach adds a small latency (message passing) but keeps
        the main thread free for animations and user input.
      </p>
      <p>
        For the command list, use a small fixed-size result set (max 50 items total
        across all categories). Rendering 1,000 list items in a virtualized list is
        more complex than necessary for a command palette where the user finds the
        target in the top 5–10 results. A fixed max of 50 keeps rendering simple and
        fast.
      </p>
      <p>
        The result list transitions (items appearing, reordering) should be kept
        subtle. Aggressive animation on every keystroke causes visual noise.
        A simple opacity fade-in for the entire list on query change (100ms duration)
        is sufficient. Avoid per-item animation during search to prevent the constant
        motion from distracting the user.
      </p>
      </section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>Implement the component as a small runtime with five boundaries. The input adapter normalizes keyboard, pointer, touch, browser, and async events. The state controller applies guards and separates preview state from committed state. The projection layer derives semantic DOM and ARIA relationships. The integration adapter owns server requests, URL synchronization, or browser APIs. The observability adapter emits bounded evidence for failures and slow paths.</p>
        <p>For this topic, the critical state rule is: Treat registered commands, the current query, active result, nested route, and async request generation as separate state so stale providers cannot overwrite newer results. During interaction, record enough context to cancel safely. On commit, validate the latest intent, update the durable projection, and release temporary listeners, timers, observers, pointer capture, and abort controllers. On unmount, cleanup must be idempotent.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/command-palette-edge-cases.svg" alt="Design a Command Palette edge-case defense map" caption="Edge-case map: validate intent, contain scale pressure, recover from failure, reconcile committed state, and emit evidence." />
      </section>
      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>a static menu is easier to discover; a command palette earns its complexity for expert workflows, large action sets, and cross-surface navigation. The custom design should still lean on native semantics and browser primitives where they remain correct. Replacing them creates testing obligations for keyboard behavior, focus ownership, reduced motion, touch interaction, zoom, SSR hydration, and assistive technology.</p>
        <p>Local registry filtering is immediate. Remote provider results are eventually consistent but generation-guarded; authorization is rechecked when a command executes. At scale, the failure pressure is thousands of commands, plugin providers, CJK composition, slow remote search, repeated shortcuts, and permission changes while the palette is open. Defend the latency budget by batching measurement, aborting stale async work, bounding caches and prefetch, and emitting analytics only for committed outcomes.</p>
        <p>A principal answer should distinguish local responsiveness from durable correctness. Optimistic UI is appropriate when the rollback is deterministic and visible. It is inappropriate when the client cannot validate authorization, inventory, resource conflicts, or destructive side effects.</p>
      </section>
      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>Use explicit state unions, typed events, idempotent cleanup, stable ids, native semantics, SSR-safe feature detection, abortable requests, and deterministic tests. Exercise keyboard-only use, touch cancellation, screen-reader output, high zoom, reduced motion, slow network, stale responses, unmount during work, and browser back-forward behavior where relevant.</p>
        <p>Observe blocked transitions, rollback frequency, stale-response drops, slow interaction latency, cache pressure, retry count, and accessibility regression results. Keep telemetry small and avoid sensitive payloads. Publish the public behavior contract before changing shared component semantics.</p>
      </section>
      <h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>Common failures include mixing draft and committed state, treating rendering state as the source of truth for browser-owned behavior, leaving listeners or timers active after unmount, accepting stale async completion, trusting client-side authorization, and producing inaccessible custom controls.</p>
        <p>For this component specifically, the failure policy is to abort superseded requests, discard stale responses, preserve keyboard position when groups change, and show provider-level partial failure without closing the palette. Security and privacy require the implementation to filter commands by authorization, sanitize labels, cap provider latency and result count, protect destructive actions with confirmation, and audit execution.</p>
      </section>
      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>Representative deployments include an IDE palette, an administration console with permissioned actions, and a collaborative editor with plugin-provided commands. In each case, the same component shell may be reused, but the policy layer changes: latency budget, permissions, persistence, fallback, and telemetry should be injected explicitly instead of hidden in presentation code.</p>
      </section>
      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3>How would you model component state?</h3><p>I would separate committed state, transient interaction state, derived presentation, and async request generations. For this component, Treat registered commands, the current query, active result, nested route, and async request generation as separate state so stale providers cannot overwrite newer results. That model makes cancellation and rollback explicit.</p>
        <h3>What breaks at scale?</h3><p>The dominant pressures are thousands of commands, plugin providers, CJK composition, slow remote search, repeated shortcuts, and permission changes while the palette is open. I would bound work per interaction, virtualize or cache only where measured, and cancel work that is no longer relevant.</p>
        <h3>What consistency model applies?</h3><p>Local registry filtering is immediate. Remote provider results are eventually consistent but generation-guarded; authorization is rechecked when a command executes. The interview answer must state which layer is authoritative and how stale completion is rejected.</p>
        <h3>How do you handle failure and rollback?</h3><p>I would abort superseded requests, discard stale responses, preserve keyboard position when groups change, and show provider-level partial failure without closing the palette. I would also emit a reason code so product metrics distinguish expected cancellation from defects and provider failures.</p>
        <h3>How do you defend the architecture over alternatives?</h3><p>a static menu is easier to discover; a command palette earns its complexity for expert workflows, large action sets, and cross-surface navigation. I would choose the smallest design that satisfies the required behavior and explicitly accept the testing and operability cost of custom interaction.</p>
      </section>
      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer events</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li>
          <li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React: Sharing State Between Components</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

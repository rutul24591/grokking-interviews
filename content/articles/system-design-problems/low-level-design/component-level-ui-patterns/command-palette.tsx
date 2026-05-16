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

      <h2>Clarifying the Requirements</h2>
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

      <h2>The Command Registry</h2>
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

      <h2>Fuzzy Search Algorithm</h2>
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

      <h2>Search Result Ranking</h2>
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

      <h2>Async Data Sources</h2>
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

      <h2>Grouping and Sectioning</h2>
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

      <h2>Keyboard Navigation</h2>
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

      <h2>Nested Commands (Sub-menus)</h2>
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

      <h2>Portal and Focus Management</h2>
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

      <h2>ARIA and Screen Reader Semantics</h2>
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

      <h2>Performance Optimizations</h2>
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

      <h2>Interview Q&A</h2>

      <h3>Q: How do you implement highlight of the matched characters in the result label?</h3>
      <p>
        The fuzzy matcher returns not just a score but the indices of the matched
        characters within the result string. Use these indices to split the label
        string into matched and unmatched segments, and render matched segments with
        a highlight class (bold or background color). For example, if "ci" matches
        "Create issue" at positions 0 and 7 (C and i), split the string into "C" (match),
        "reate " (no match), "i" (match), "ssue" (no match), and wrap each segment in
        a span with or without the highlight class. This makes it visually clear why
        a result matched the query, improving user trust in the search.
      </p>

      <h3>Q: How do you handle a very large command registry efficiently?</h3>
      <p>
        For registries with thousands of commands, sequential fuzzy matching (O(n*m)
        per command) scales linearly in the number of commands. Mitigations: pre-index
        the registry using an inverted index (for each character pair, a list of
        command IDs containing that bigram). On query, intersect the sets for each
        bigram in the query to get candidate commands. Only run the full fuzzy match
        on candidates, not all commands. This reduces the search space from all N
        commands to O(k) candidates where k is typically much smaller. For command
        palettes embedded in IDEs or design tools with thousands of extensions, this
        approach (used by VS Code) keeps search latency below 10ms even with very
        large registries.
      </p>

      <h3>Q: How do you prevent the palette from showing stale results when the user types quickly?</h3>
      <p>
        Two mechanisms: debouncing and request cancellation. Debounce the search
        trigger (150ms for synchronous search, 200–250ms for async) so the search
        only runs when the user pauses typing. For async searches, cancel in-flight
        requests using AbortController when a new query is submitted. For synchronous
        fuzzy search running in a Web Worker, send a cancel message (or simply ignore
        the response if a newer query's result arrives first — by tagging each request
        with a sequence number and discarding responses whose sequence number is less
        than the current one).
      </p>

      <h3>Q: How do you design the command palette to be extensible by third-party plugins?</h3>
      <p>
        The command registry exposes a public API: registerCommands(commands) and
        unregisterCommands(ids). A plugin calls registerCommands at initialization
        with its command definitions and unregisterCommands at teardown. The commands
        are plain data objects (not React components), so plugins do not need access
        to the palette's internal React tree. For context-sensitive commands, plugins
        use the registerCommands API within their own React components (in a useEffect),
        which are part of the main application's render tree. The palette reads only
        from the registry and is oblivious to which plugin registered which command.
        This is the same architecture used by VS Code's extension API and Figma's
        plugin API.
      </p>

      <h3>Q: How would you implement a "scoped" palette that changes context based on the focused element?</h3>
      <p>
        Some palettes change their available commands based on what is focused — focusing
        a canvas element shows "canvas commands"; focusing a table shows "table commands."
        Implement this via a context scope system: each focusable region of the app
        registers a scope name. The currently active scope is tracked in global state.
        Commands in the registry have an optional scope field. When the palette opens,
        the search preferentially shows commands matching the active scope (higher score
        multiplier) while still including all commands without a scope constraint.
        Commands with a scope that does not match the active scope are shown with lower
        priority or in a separate "Other" category. This gives the user context-aware
        results without hiding globally applicable commands.
      </p>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-command-palette",
  title: "Design a Command Palette / Spotlight Search",
  description:
    "Production-grade command palette with keyboard-driven navigation, fuzzy matching, plugin architecture, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "command-palette",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "command-palette",
    "spotlight-search",
    "fuzzy-matching",
    "keyboard-navigation",
    "plugin-architecture",
    "accessibility",
  ],
  relatedTopics: [
    "search-autocomplete",
    "tooltip-system",
    "context-menu",
  ],
};

export default function CommandPaletteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a command palette — a keyboard-driven search interface
          (triggered by Cmd+K / Ctrl+K) that lets users quickly navigate to pages,
          execute actions, or search content. The palette must support fuzzy matching
          for flexible query matching, keyboard navigation through results, a plugin
          architecture for extensibility (third-party commands), and full accessibility
          for keyboard-only users.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Triggered globally via Cmd+K (Mac) or Ctrl+K (Windows/Linux). Also accessible via a visible button.</li>
          <li>Commands come from multiple sources: navigation (pages), actions (toggle theme, logout), and content (search articles).</li>
          <li>Maximum visible results: 8-10. Excess results are scrollable.</li>
          <li>Fuzzy matching scores and ranks results by relevance.</li>
          <li>The palette is modal — it traps focus while open and closes on Escape.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Global Trigger:</strong> Cmd+K / Ctrl+K opens the palette from anywhere in the app.</li>
          <li><strong>Fuzzy Search:</strong> As the user types, results are filtered and ranked by fuzzy match score.</li>
          <li><strong>Keyboard Navigation:</strong> ArrowUp/Down moves the highlight. Enter executes the selected command. Escape closes the palette.</li>
          <li><strong>Command Execution:</strong> Each command has an execute callback that performs the action (navigate, toggle, open URL, etc.).</li>
          <li><strong>Grouped Results:</strong> Results grouped by category (Navigation, Actions, Recent).</li>
          <li><strong>Plugin Architecture:</strong> Third-party modules can register commands dynamically via a plugin API.</li>
          <li><strong>Recent Commands:</strong> Tracks recently executed commands and surfaces them when query is empty.</li>
          <li><strong>Loading State:</strong> Shows a loading indicator while async commands (content search) are fetching.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Fuzzy matching runs in under 5ms for 1000 commands. Debounce async command fetching.</li>
          <li><strong>Accessibility:</strong> Focus trap, aria-combobox pattern, screen reader announcements for result count.</li>
          <li><strong>Bundle Size:</strong> Core palette under 10KB gzipped. Plugin commands loaded on demand.</li>
          <li><strong>Type Safety:</strong> Full TypeScript generics for command payload types.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Async commands return stale results after the user has changed the query — must discard via AbortController.</li>
          <li>User rapidly types — debounce at 150ms for async commands, instant filtering for sync commands.</li>
          <li>Palette opens on top of another modal — z-index stacking must place palette on top.</li>
          <li>Command execution triggers navigation — palette must close before navigation to prevent flash.</li>
          <li>Plugin registers duplicate commands (same ID) — must reject or overwrite with warning.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>command registry</strong> that collects commands
          from all sources (static navigation, dynamic plugins, async content search).
          A <strong>fuzzy matching engine</strong> filters and ranks commands against
          the user&apos;s query. The UI renders results in grouped sections with keyboard
          navigation. A <strong>Zustand store</strong> manages open/close state, query
          text, highlighted index, and recent command history.
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>External library (cmdk, kbar, fuse.js-based):</strong> Ready-made but limits customization of the matching algorithm and plugin architecture.</li>
          <li><strong>Simple filter (startsWith or includes):</strong> Fast but poor fuzzy matching quality. Users expect substring and out-of-order character matching.</li>
        </ul>
        <p>
          <strong>Why custom fuzzy matching + plugin registry is optimal:</strong> Full
          control over the matching algorithm (configurable scoring weights), extensible
          command registration, and tailored accessibility. The plugin architecture
          allows third-party features to add commands without modifying the core palette.
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces (<code>command-palette-types.ts</code>)</h4>
          <p>Defines <code>Command</code> (id, label, keywords, icon, group, execute, payload), <code>CommandGroup</code>, <code>CommandResult</code> (with match score), and <code>PluginRegistration</code>.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Command Registry (<code>command-registry.ts</code>)</h4>
          <p>Central registry for all commands. Supports register, unregister, getCommands (by group), and duplicate detection. Commands are stored in a Map keyed by ID for O(1) lookup.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Fuzzy Matcher (<code>fuzzy-matcher.ts</code>)</h4>
          <p>Implements fuzzy string matching with scoring. Scores based on: exact match (highest), prefix match, substring match, fuzzy match (out-of-order characters). Returns sorted results by descending score.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Command Palette Store (<code>command-palette-store.ts</code>)</h4>
          <p>Zustand store: open state, query text, highlighted index, filtered results, loading state, recent commands (LRU cache of last 10). Actions: open, close, setQuery, setHighlight, executeCommand, addToRecent.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useCommandPalette Hook (<code>use-command-palette.ts</code>)</h4>
          <p>Main orchestrator: registers global keyboard listener (Cmd+K/Ctrl+K), debounces query changes, triggers fuzzy matching, manages async command fetching with AbortController.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Focus Trap (<code>focus-trap.ts</code>)</h4>
          <p>Focus trap implementation using Tab/Shift+Tab cycling within the palette. Returns focus to the trigger element on close. Handles edge case of no focusable elements.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/command-palette-architecture.svg"
          alt="Command palette architecture showing fuzzy search, command registry, and focus management"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User presses Cmd+K. Store sets open=true, focus moves to input.</li>
          <li>User types &quot;theme&quot;. Fuzzy matcher scores all commands against query.</li>
          <li>Results: &quot;Toggle Dark Theme&quot; (score: 95), &quot;Theme Settings&quot; (score: 80).</li>
          <li>Results grouped by category, rendered with highlighted matching characters.</li>
          <li>User presses ArrowDown — highlight moves to second result.</li>
          <li>User presses Enter — executeCommand calls the command&apos;s execute callback.</li>
          <li>Command runs (toggles theme), palette closes, command added to recent history.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow is: keyboard trigger → open palette → user types → debounce (150ms)
          → fuzzy match sync commands → fetch async commands → merge results → render grouped
          list → user selects → execute → close → record in recent history.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Stale async results:</strong> Each query increment a requestId. Async responses include the requestId they were generated for. If the current requestId differs, the response is discarded.</li>
          <li><strong>Duplicate command registration:</strong> The registry checks for existing IDs. If a duplicate is found, it logs a warning in development and overwrites the existing command.</li>
          <li><strong>Focus restoration:</strong> The store saves a reference to the element that had focus when the palette opened. On close, focus is returned to that element to maintain keyboard flow.</li>
          <li><strong>Z-index stacking:</strong> The palette renders in a Portal at the highest z-index (z-50 or higher). If another modal is open, the palette overlays it.</li>
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
            Complete production-ready implementation includes: command registry with
            plugin API, fuzzy matcher with scoring, Zustand store with recent history,
            Portal-rendered palette with focus trap, keyboard navigation, grouped results
            with match highlighting, and async command support with AbortController.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Types &amp; Interfaces</h3>
        <p>
          Command interface with id, label, optional keywords array for improved matching,
          icon (React node), group name, execute callback, and optional payload.
          CommandResult extends Command with a match score. PluginRegistration includes
          register and unregister functions returned when a plugin registers.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Command Registry</h3>
        <p>
          Singleton Map-based registry. <code>register(command)</code> adds to the map,
          <code>unregister(id)</code> removes. <code>getAll()</code> returns all commands
          as an array. <code>getByGroup(group)</code> filters by group name. Duplicate
          detection logs a dev warning. Plugin registration returns an unregister function
          for cleanup.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Fuzzy Matcher</h3>
        <p>
          Scores each command against the query. Scoring tiers: exact match (100 points),
          prefix match (90 points), substring match (80 points), fuzzy match with
          consecutive bonus (10 points per consecutive character match, plus base points
          for each matched character). Results sorted by descending score. Only commands
          with score above threshold (50) are returned.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules 4-6: Store, Hook, Focus Trap</h3>
        <p>
          The store manages palette state with LRU-cached recent commands. The hook
          orchestrates keyboard triggers, debounced matching, and async fetching. The
          focus trap uses Tab/Shift+Tab cycling with boundary detection, restoring focus
          on close.
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
                <td className="p-2">Fuzzy match (sync commands)</td>
                <td className="p-2">O(n × m) — n commands, m query length</td>
                <td className="p-2">O(n) — result array</td>
              </tr>
              <tr>
                <td className="p-2">Command registry lookup</td>
                <td className="p-2">O(1) — Map.get()</td>
                <td className="p-2">O(n) — command map</td>
              </tr>
              <tr>
                <td className="p-2">Recent commands (LRU)</td>
                <td className="p-2">O(1) — Map-based LRU</td>
                <td className="p-2">O(k) — k recent entries</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Fuzzy matching on large command sets:</strong> 1000+ commands × 10-character query = 10,000 character comparisons. Mitigation: Web Worker for off-main-thread matching, or pre-filter by first character index.</li>
          <li><strong>Async command fetching:</strong> Multiple concurrent API calls for content search. Mitigation: AbortController cancellation, debounce at 150ms, max 3 concurrent fetches.</li>
          <li><strong>Result rendering:</strong> Large result sets cause slow DOM updates. Mitigation: cap visible results at 10, virtualize if exceeding 50.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>First-character index:</strong> Pre-index commands by first character. Only scan commands whose first character appears in the query. Reduces comparisons by 90% for alphabetic queries.</li>
          <li><strong>Web Worker matching:</strong> Offload fuzzy matching to a Web Worker for command sets exceeding 5000 items.</li>
          <li><strong>Memoized results:</strong> Cache fuzzy match results by query string. Repeated queries (user backspaces then retypes) hit the cache.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          The query string is used only for fuzzy matching — it is never rendered as HTML
          or sent to the server without sanitization. Async command fetchers should sanitize
          the query before API calls to prevent injection.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>Cmd+K / Ctrl+K opens the palette from anywhere.</li>
            <li>ArrowUp/Down moves the highlight through results.</li>
            <li>Enter executes the highlighted command.</li>
            <li>Escape closes the palette and restores focus.</li>
            <li>Tab/Shift+Tab cycles focus within the palette (focus trap).</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Pattern</h4>
          <ul className="space-y-2">
            <li>Input has <code>role=&quot;combobox&quot;</code>, <code>aria-expanded</code>, <code>aria-activedescendant</code> linked to the highlighted result.</li>
            <li>Results list has <code>role=&quot;listbox&quot;</code>. Each result has <code>role=&quot;option&quot;</code>.</li>
            <li>An <code>aria-live=&quot;polite&quot;</code> region announces the number of results.</li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li><strong>Plugin sandboxing:</strong> Plugin commands are registered via a controlled API. Plugins cannot access the store directly or execute arbitrary commands without user selection.</li>
          <li><strong>Rate limiting:</strong> The keyboard trigger is debounced at 300ms to prevent rapid open/close cycles from accidental key holding.</li>
        </ul>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Fuzzy matcher:</strong> Test scoring for exact match, prefix, substring, fuzzy match, non-match. Verify sort order. Test edge cases (empty query, special characters, Unicode).</li>
          <li><strong>Command registry:</strong> Test register, unregister, duplicate detection, getByGroup. Test plugin registration and cleanup (unregister removes plugin commands).</li>
          <li><strong>Store:</strong> Test open/close, setQuery, highlight navigation (wrapping at boundaries), executeCommand triggers callback, addToRecent maintains LRU order.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Full flow:</strong> Simulate Cmd+K, type query, verify results render, press ArrowDown + Enter, verify command executes and palette closes.</li>
          <li><strong>Async commands:</strong> Mock API with 200ms delay, type query, verify loading state appears, verify results appear after fetch, verify stale results are discarded when query changes.</li>
          <li><strong>Focus trap:</strong> Open palette, press Tab repeatedly, verify focus cycles within palette, press Escape, verify focus returns to trigger element.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>Run axe-core on open palette — no violations.</li>
          <li>Test with VoiceOver — results count is announced, arrow key navigation announces each option.</li>
          <li>Verify focus trap works correctly with screen reader virtual cursor.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>No fuzzy matching:</strong> Using <code>includes()</code> or <code>startsWith()</code> only. Users expect forgiving search (e.g., &quot;dkt&quot; matches &quot;Toggle DarK Theme&quot;).</li>
          <li><strong>No focus trap:</strong> Tab key escapes the palette, focusing elements behind it. This breaks the modal experience for keyboard users.</li>
          <li><strong>No debounce on async commands:</strong> Every keystroke triggers an API call. This overwhelms the server and creates race conditions with out-of-order responses.</li>
          <li><strong>Not closing before navigation:</strong> Executing a navigation command while the palette is still open causes a flash of the palette on the new page. Must close before navigating.</li>
          <li><strong>No recent commands:</strong> Power users repeat commands frequently. Without recent command surfacing, they must retype every time.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Fuzzy Matching: Custom Algorithm vs Library (fuse.js)</h4>
          <p>
            A custom fuzzy matcher gives full control over scoring weights, consecutive
            character bonuses, and performance tuning. However, it is more code to maintain.
            fuse.js is a well-tested library with configurable scoring, but adds ~6KB
            gzipped and may be overkill for small command sets. For 500+ commands, a
            custom implementation with first-character indexing is faster than fuse.js.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Plugin Architecture: Registry vs Event Bus</h4>
          <p>
            A registry (Map-based) provides O(1) lookup and explicit registration/
            unregistration. An event bus (pub/sub) is more decoupled but harder to debug
            and lacks a clear command inventory. For a command palette, a registry is
            better because you need to enumerate all commands for matching.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you add keyboard shortcut hints next to each command (e.g., &quot;⌘D&quot; next to &quot;Toggle Dark Mode&quot;)?</p>
            <p className="mt-2 text-sm">
              A: Add a <code>shortcut</code> field to the Command interface. Render it
              as a styled kbd element aligned to the right of each result. Register global
              keyboard listeners for these shortcuts when the palette is closed. When the
              palette is open, disable global shortcuts to avoid conflicts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle command execution that requires user input (e.g., &quot;Go to file&quot; needs a file name)?</p>
            <p className="mt-2 text-sm">
              A: Two-phase execution. The first Enter opens a sub-palette with the
              command-specific prompt (e.g., &quot;Enter file name&quot;). The user types
              the input and presses Enter again to execute. This is how VS Code&apos;s
              command palette works for parameterized commands.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you support non-English languages (CJK, RTL)?</p>
            <p className="mt-2 text-sm">
              A: For CJK, use Intl.Segmenter for proper character boundary detection in
              the fuzzy matcher. For RTL languages, the palette layout flips
              (<code>dir=&quot;rtl&quot;</code>), and the fuzzy matcher should normalize
              Unicode directionality. The matching algorithm itself is language-agnostic
              since it operates on character sequences.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you measure command palette effectiveness?</p>
            <p className="mt-2 text-sm">
              A: Track: (1) usage frequency (opens per session), (2) average commands
              per session, (3) most-executed commands, (4) zero-result queries (indicates
              missing commands or poor matching), (5) average time from open to execute.
              Use this data to prioritize command additions and tune the fuzzy matcher.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent the palette from flickering on mount?</p>
            <p className="mt-2 text-sm">
              A: Render the palette with <code>opacity: 0</code> initially, then set
              <code>opacity: 1</code> after one frame using requestAnimationFrame. This
              ensures the browser has computed layout before the fade-in animation begins.
              Use CSS transitions for the fade (0.15s ease-out).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle commands that are only available in certain contexts (e.g., &quot;Save&quot; only when editing)?</p>
            <p className="mt-2 text-sm">
              A: Add a <code>isVisible</code> predicate to the Command interface. The
              registry evaluates this predicate before including the command in results.
              Context-aware commands re-evaluate their visibility when the context changes
              (e.g., when the user enters/exits edit mode, trigger a re-evaluation).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://github.com/pacocoursey/cmdk" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              cmdk — Fast, Composable Command Palette for React
            </a>
          </li>
          <li>
            <a href="https://github.com/timc1/kbar" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              kbar — Keyboard-first Navigation
            </a>
          </li>
          <li>
            <a href="https://www.fusejs.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Fuse.js — Lightweight Fuzzy Search Library
            </a>
          </li>
          <li>
            <a href="https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              VS Code Command Palette — Reference UX
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Combobox Pattern
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — KeyboardEvent API
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

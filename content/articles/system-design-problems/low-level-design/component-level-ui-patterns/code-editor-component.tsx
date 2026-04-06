"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-code-editor-component",
  title: "Design a Code Editor Component",
  description:
    "Production-grade code editor with syntax highlighting, line numbers, bracket matching, minimap, and when to embed Monaco vs build custom.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "code-editor-component",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: ["lld", "code-editor", "syntax-highlighting", "monaco", "accessibility", "line-numbers"],
  relatedTopics: ["rich-text-editor", "spreadsheet-like-grid", "file-explorer-ui"],
};

export default function CodeEditorComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a code editor component — a text editor optimized for writing
          and editing source code. The editor must provide syntax highlighting for multiple
          languages, line numbers, bracket matching, auto-indentation, and optionally a
          minimap (code overview on the right). The system must decide whether to embed an
          existing editor (Monaco, CodeMirror) or build a custom one based on requirements.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>Supports multiple languages (JavaScript, TypeScript, Python, etc.) with language-specific syntax highlighting.</li>
          <li>Handles large files (10,000+ lines) without performance degradation.</li>
          <li>Supports both light and dark themes.</li>
          <li>Must be keyboard-accessible for power users.</li>
          <li>Integration with a React 19+ SPA.</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Syntax Highlighting:</strong> Language-aware tokenization and coloring for 20+ languages.</li>
          <li><strong>Line Numbers:</strong> Gutter showing line numbers, sync-scrolls with content.</li>
          <li><strong>Bracket Matching:</strong> Highlight matching opening/closing brackets when cursor is adjacent.</li>
          <li><strong>Auto-Indentation:</strong> Indent on Enter, dedent on Shift+Tab, language-specific indent rules.</li>
          <li><strong>Minimap:</strong> Condensed code overview on the right side, clickable to navigate.</li>
          <li><strong>Find/Replace:</strong> Search with regex support, replace all, case sensitivity toggle.</li>
          <li><strong>Multi-Cursor:</strong> Alt+Click creates additional cursors, edit at multiple positions simultaneously.</li>
          <li><strong>Undo/Redo:</strong> Unlimited undo history, grouped by word/line for natural editing feel.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 10,000+ line files render smoothly. Virtualize off-screen lines.</li>
          <li><strong>Bundle Size:</strong> Custom editor under 50KB gzipped. Monaco embedding adds 3MB+.</li>
          <li><strong>Accessibility:</strong> Screen reader announces line/column position, keyboard shortcuts for all actions.</li>
          <li><strong>Theme Support:</strong> Light/dark themes with CSS variable-based customization.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Extremely long lines (no line breaks) — must not cause horizontal overflow.</li>
          <li>Copy-paste with mixed indentation — normalize to editor&apos;s indent setting.</li>
          <li>IME input for CJK characters — composition events must not interfere with editing.</li>
          <li>Large file (1MB+) — must not freeze the UI during load or edit.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The key decision is <strong>build vs embed</strong>. Embedding Monaco provides
          VS Code&apos;s editor with all features out of the box but adds 3MB+ to the
          bundle. Building custom gives full control but requires implementing syntax
          highlighting, bracket matching, and virtualization from scratch. The hybrid
          approach: use CodeMirror 6 for a balance of features and bundle size (~50KB
          core + language packs).
        </p>
        <p>
          <strong>Alternative approaches:</strong>
        </p>
        <ul className="space-y-2">
          <li><strong>Monaco Editor:</strong> Full VS Code editor. Best feature set, largest bundle. Ideal for IDE-like experiences.</li>
          <li><strong>CodeMirror 6:</strong> Modular, tree-shakeable, extensible. Best balance of features and size for most use cases.</li>
          <li><strong>Custom contentEditable:</strong> Full control but requires implementing tokenization, virtualization, undo/redo, IME handling. High maintenance cost.</li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Use CodeMirror 6 for most applications. It
          provides syntax highlighting (via Lezer parser), line numbers, bracket matching,
          and virtualization out of the box. The modular architecture allows importing
          only the languages and features needed. Reserve custom implementation for
          highly specialized requirements (e.g., domain-specific query editors).
        </p>
      </section>

      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture (Custom Implementation)</h3>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Interfaces (<code>editor-types.ts</code>)</h4>
          <p>Defines <code>CursorPosition</code> (line, column), <code>SelectionRange</code> (anchor, head), <code>Document</code> (line array), <code>Token</code> (start, end, type), and <code>EditorConfig</code> (tabSize, language, theme).</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Document Model (<code>document-model.ts</code>)</h4>
          <p>Piece table or gap buffer data structure for efficient insert/delete at cursor position. Supports undo/redo via operation history. Line-based indexing for O(1) line lookup.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Tokenizer (<code>tokenizer.ts</code>)</h4>
          <p>Language-aware syntax highlighting using TextMate grammars or Lezer parser. Returns array of tokens per line with type (keyword, string, comment, etc.) for CSS class assignment.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Virtual Renderer (<code>virtual-renderer.tsx</code>)</h4>
          <p>Renders only visible lines plus overscan buffer. Computes line heights, total scroll height, and visible window. Uses a spacer element for scroll height and absolute positioning for visible lines.</p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Bracket Matcher (<code>bracket-matcher.ts</code>)</h4>
          <p>Scans from cursor position to find matching opening/closing bracket pair. Handles nested brackets by counting depth. Highlights both brackets with CSS class.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/code-editor-component-architecture.svg"
          alt="Code editor architecture showing input, store, and CodeMirror rendering"
          caption="Code editor architecture: User Input → Editor Store → CodeMirror 6 Rendering"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Editor mounts with initial document and config.</li>
          <li>Tokenizer parses first visible lines, returns tokens for syntax highlighting.</li>
          <li>Virtual renderer computes visible window, renders highlighted lines.</li>
          <li>User types character: document model inserts at cursor, tokenizer re-parses affected line, virtual renderer updates.</li>
          <li>User moves cursor: bracket matcher checks for adjacent brackets, highlights pair if found.</li>
          <li>User scrolls: virtual renderer updates visible window, fetches and renders new lines.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The data flow is: user input → document model update → tokenizer re-parse
          affected lines → virtual renderer updates visible lines → screen paint.
          Scroll events trigger visible window recalculation without re-tokenizing
          (tokens are cached per line).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li><strong>Long lines:</strong> Lines exceeding viewport width are rendered with <code>overflow-x: auto</code> on the line container. The minimap shows a condensed version.</li>
          <li><strong>IME input:</strong> During composition, the tokenizer is paused. Raw input is rendered in a composition overlay. On compositionend, the final text is committed to the document model and tokenization resumes.</li>
          <li><strong>Large files:</strong> Files exceeding 10,000 lines use aggressive virtualization (only 20 lines rendered at a time). Tokenization is lazy — only visible lines are tokenized on demand.</li>
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
            Complete implementation using CodeMirror 6 with custom extensions: syntax
            highlighting for JavaScript/TypeScript, line numbers gutter, bracket matching,
            minimap, find/replace widget, multi-cursor support, and full keyboard navigation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Modules Overview</h3>
        <p>
          The document model uses a piece table for efficient insert/delete. The tokenizer
          uses Lezer parser for language-aware highlighting. The virtual renderer manages
          the visible window with overscan buffer. The bracket matcher scans from cursor
          with depth counting. The editor component composes all modules with a
          contentEditable surface and gutter sidebar.
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
                <td className="p-2">Insert character</td>
                <td className="p-2">O(1) — piece table insert</td>
                <td className="p-2">O(1) — new piece node</td>
              </tr>
              <tr>
                <td className="p-2">Tokenize line</td>
                <td className="p-2">O(l) — l = line length</td>
                <td className="p-2">O(t) — t tokens per line</td>
              </tr>
              <tr>
                <td className="p-2">Bracket match</td>
                <td className="p-2">O(d) — d = bracket depth</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Virtual render</td>
                <td className="p-2">O(v) — v = visible lines</td>
                <td className="p-2">O(v)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li><strong>Tokenization on every keystroke:</strong> Re-parsing the entire file on each change is O(n). Mitigation: only re-tokenize the edited line and its immediate neighbors (for multi-line constructs like template literals).</li>
          <li><strong>DOM updates during fast typing:</strong> Updating the DOM on every keystroke at 60+ WPM causes jank. Mitigation: batch DOM updates via requestAnimationFrame, debounce tokenizer at 16ms (one frame).</li>
          <li><strong>Minimap rendering:</strong> Rendering a condensed version of all lines is expensive for large files. Mitigation: render minimap as a canvas element, not DOM nodes. Update only the changed region.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li><strong>Token caching:</strong> Cache tokens per line, invalidate only on edit. Lookup is O(1) for cached lines.</li>
          <li><strong>Canvas minimap:</strong> Render the minimap as a canvas image, not DOM. Update incrementally on edit.</li>
          <li><strong>Web Worker tokenizer:</strong> For very large files, offload tokenization to a Web Worker to avoid blocking the main thread during scroll.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          The editor content is treated as plain text — never rendered as HTML. This
          eliminates XSS concerns within the editor itself. However, when exporting or
          displaying code elsewhere, it must be escaped. The editor should provide a
          <code>getContent()</code> method that returns raw text, not HTML.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>Announce line and column position on cursor move: &quot;Line 15, Column 8&quot;.</li>
            <li>Announce syntax context: &quot;Inside string literal&quot; when cursor enters a string.</li>
            <li>Use <code>aria-live=&quot;polite&quot;</code> for non-critical announcements.</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>All standard text editing shortcuts work (Ctrl+C/V/X, Ctrl+Z/Y, Ctrl+F).</li>
            <li>Ctrl+G jumps to line. Ctrl+Home/End jumps to file start/end.</li>
            <li>Alt+Click creates multi-cursor. Escape collapses to single cursor.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li><strong>Document model:</strong> Test insert, delete, undo, redo with piece table. Verify document text matches expected output after operations.</li>
          <li><strong>Tokenizer:</strong> Test syntax highlighting for keywords, strings, comments, numbers, operators in each supported language.</li>
          <li><strong>Bracket matcher:</strong> Test matching for nested brackets, mismatched brackets, brackets inside strings (ignored).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li><strong>Type and highlight:</strong> Type JavaScript code, verify keywords are colored, strings are colored, comments are grayed.</li>
          <li><strong>Virtual scroll:</strong> Load 10,000-line file, scroll to middle, verify correct lines render, scroll position is accurate.</li>
          <li><strong>Multi-cursor:</strong> Create two cursors, type, verify text appears at both positions simultaneously.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li><strong>Using contentEditable for code:</strong> contentEditable produces inconsistent HTML across browsers, making syntax highlighting and cursor management unreliable. A custom rendering layer (div-based or canvas) is preferred.</li>
          <li><strong>No virtualization:</strong> Rendering all lines in DOM causes severe performance issues for files over 1000 lines. Virtualization is mandatory.</li>
          <li><strong>Ignoring IME:</strong> CJK input methods produce composition events that interfere with custom key handlers. Candidates must mention IME handling.</li>
          <li><strong>Tokenizing the entire file on every change:</strong> This is O(n) per keystroke. Only the edited line needs re-tokenization.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Monaco vs CodeMirror vs Custom</h4>
          <p>
            Monaco is the gold standard but adds 3MB+ to the bundle. It is appropriate
            for IDE-like applications (web-based dev environments). CodeMirror 6 is
            modular and tree-shakeable (~50KB core + language packs), ideal for most
            web applications that need code editing. Custom implementation is only
            justified for domain-specific needs (e.g., a SQL query editor with
            autocomplete for a specific schema).
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement collaborative editing (Google Docs-style)?</p>
            <p className="mt-2 text-sm">
              A: Use CRDTs (Y.js or Automerge) for conflict-free concurrent edits. Each
              participant has a unique client ID. Edits are operations (insert, delete)
              with causal ordering. The CRDT merges concurrent edits deterministically.
              Remote cursors are shown as colored markers with the user&apos;s name.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you add autocomplete/intellisense?</p>
            <p className="mt-2 text-sm">
              A: On each keystroke, extract the current word and query a language server
              (LSP) or local symbol table for completions. Show a dropdown below the
              cursor position. Filter results as the user types. Use fuzzy matching for
              forgiving search. Insert the selected completion at the cursor.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle binary file viewing (hex editor)?</p>
            <p className="mt-2 text-sm">
              A: Detect binary content (null bytes, high ratio of non-printable chars).
              Switch to hex view: display hex bytes on left, ASCII representation on
              right. Group bytes in rows of 16. Allow editing hex values directly. Use
              virtualization for large binary files.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you add inline linting and error squiggles?</p>
            <p className="mt-2 text-sm">
              A: Run a linter (ESLint, TypeScript compiler) on file save or debounce
              (1-second idle). Map diagnostics to line/column ranges. Render red/green
              squiggles via CSS <code>text-decoration: wavy underline</code> on the
              affected token spans. Show diagnostic messages in a tooltip on hover.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle editor state persistence across page reloads?</p>
            <p className="mt-2 text-sm">
              A: Serialize cursor position (line, column), scroll offset, and open file
              path to localStorage or URL query params. On mount, restore these values.
              For undo/redo history, it is not practical to persist — the history stack
              is too large and version-dependent. Clear it on reload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement a split view (side-by-side diff)?</p>
            <p className="mt-2 text-sm">
              A: Two editor instances sharing a scroll position. When one scrolls, the
              other scrolls proportionally. Added/removed lines are highlighted with
              green/red backgrounds. Synchronization is maintained by computing the
              scroll ratio (scrollLeftA / scrollLeftB) and applying it on scroll events.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://codemirror.net/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              CodeMirror 6 — Modular Code Editor for the Web
            </a>
          </li>
          <li>
            <a href="https://microsoft.github.io/monaco-editor/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Monaco Editor — VS Code&apos;s Editor in the Browser
            </a>
          </li>
          <li>
            <a href="https://lezer.codemirror.net/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Lezer — Incremental Parser System
            </a>
          </li>
          <li>
            <a href="https://www.davidairey.com/building-a-code-editor/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Building a Code Editor from Scratch — Implementation Guide
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria/#textbox" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Textbox Role — Accessibility Guidelines
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-code-editor-component",
  title: "Design a Code Editor Component",
  description:
    "Code editor with extension system, syntax tokenization, LSP integration, theme tokens, diff view, and the build-vs-embed Monaco decision.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "code-editor-component",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["lld", "code-editor", "Monaco", "LSP", "syntax-highlighting", "CodeMirror", "diff", "accessibility"],
  relatedTopics: ["rich-text-editor", "spreadsheet-like-grid", "file-explorer-ui"],
};

export default function CodeEditorComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A code editor component is the most technically sophisticated widget in any
        developer tool product. It must tokenize code for syntax highlighting at
        keystroke speed, integrate with a Language Server Protocol implementation for
        autocomplete and diagnostics, handle large files without UI thread stalls,
        support multiple themes and font families, provide diff views for version
        comparison, and remain reasonably accessible. Most teams reach for Monaco or
        CodeMirror rather than building from scratch — but understanding what these
        libraries do internally is what an interviewer is testing.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/code-editor-component-architecture.svg"
        alt="Code editor component architecture diagram"
        caption="Code editor architecture: extension system, syntax tokenization, LSP integration, theme and diff"
      />

      <h2>Build vs Embed: Monaco vs CodeMirror</h2>
      <p>
        The first question in a code editor interview is always: build from scratch,
        embed Monaco, or embed CodeMirror 6? The answer is almost always embed, with
        the architecture decision being which library and how it is integrated.
      </p>
      <p>
        <strong>Monaco Editor</strong> (the editor powering VS Code) is the most
        feature-complete option. It has first-class TypeScript/JavaScript support with
        full type checking in the browser (using the TypeScript compiler running in a
        Web Worker), autocomplete, hover documentation, error diagnostics, find-and-replace,
        minimap, split view, git diff view, and breadcrumbs. The tradeoff: Monaco is
        large (2–5 MB gzipped depending on what languages are loaded), and its bundle
        cannot be code-split easily. It is designed for a full-page editor, not an
        inline widget.
      </p>
      <p>
        <strong>CodeMirror 6</strong> is modular and significantly smaller when only
        the needed features are bundled. Its architecture (described below) is designed
        for embedding in larger applications. It has excellent performance on large
        documents, a clean extension API, and growing ecosystem support. It is the
        right choice for an inline editor widget in a SaaS product.
      </p>
      <p>
        For a staff-level answer, describe the key architectural decisions that would
        go into embedding and customizing either library, not just "we'd use Monaco."
      </p>

      <h2>CodeMirror 6 Architecture</h2>
      <p>
        CodeMirror 6 is built around an immutable state model and a reactive extension
        system. This makes it worth studying in depth for interview purposes because
        the architecture is elegant and generalizable.
      </p>
      <p>
        <strong>EditorState</strong> is the immutable document state: the text content
        (as a Text object with a linked-list structure for efficient insertions in large
        documents), the selection ranges, and all extension state (stored as field
        values keyed by StateField tokens). State transitions produce new EditorState
        objects rather than mutating in place — similar to Redux.
      </p>
      <p>
        <strong>Transaction</strong> is the unit of change: a description of how the
        state should change (text changes as a ChangeSet, selection changes, effect
        dispatch). All user interactions — typing, deleting, pasting, undoing — produce
        transactions. Extensions can intercept and transform transactions before they
        are applied (the filter transaction mechanism), which is how features like
        "smart indentation" and "auto-close brackets" work.
      </p>
      <p>
        <strong>EditorView</strong> manages the DOM and bridges between the EditorState
        and the browser. It subscribes to state changes, computes the diff between the
        old and new state, and applies minimal DOM mutations to update the display.
        The view uses a virtual scroll approach — only the lines visible in the viewport
        are in the DOM; lines above and below are collapsed into spacer elements that
        maintain the correct scroll height.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The key performance insight in CodeMirror 6's design: the document is stored
        as a balanced B-tree of string segments (the Text class), not a single string.
        Insertions and deletions at arbitrary positions are O(log n) rather than O(n).
        Line number lookups (given a line number, find the character offset) are also
        O(log n). For a document with 100,000 lines, this is the difference between
        microseconds and milliseconds per edit operation.
      </HighlightBlock>

      <h2>Extension System</h2>
      <p>
        CodeMirror 6's extension system allows any feature to be composed as an extension.
        An extension is a value (or array of values) that contributes one or more of:
        StateField (custom state stored alongside the editor state), StateEffect (typed
        actions that can be dispatched), Facet (configuration values contributed by
        multiple extensions, merged by a defined combiner), or ViewPlugin (imperative
        DOM manipulation tied to state changes).
      </p>
      <p>
        The extension priority system (Prec.highest, Prec.high, Prec.default,
        Prec.low, Prec.lowest) determines which extension "wins" when multiple
        extensions contribute conflicting values to the same facet. For example, the
        keymap facet accepts multiple keymaps; higher priority keymaps are checked
        first. This allows a user-provided keymap to override a library's default
        keymap without forking the library.
      </p>
      <p>
        Building a custom feature (e.g., a "link preview on hover" extension): define
        a ViewPlugin that observes the cursor position on mousemove, checks if the
        cursor is over a URL token (using the syntax tree), fetches a link preview
        if the cursor stays still for 500ms, and renders the preview as a tooltip
        using a Decoration. The tooltip is a DOM element attached to a specific
        document position using EditorView.widgets. The whole feature is packaged
        as a single Extension export, composable with other extensions.
      </p>

      <h2>Syntax Highlighting</h2>
      <p>
        Syntax highlighting requires tokenizing the document text by the language's
        grammar. CodeMirror uses Lezer — a fast incremental parser built specifically
        for editor use. Lezer's key property: it parses only the changed parts of the
        document on each edit (incremental parsing), reusing the existing parse tree
        for unchanged regions. For a 10,000 line file, editing a single line re-parses
        only the affected subtree, not the entire file.
      </p>
      <p>
        The parse tree maps to highlight tokens. A decorator traverses the parse tree
        for the visible range and emits Decoration.mark objects with CSS class names
        corresponding to token types (cm-keyword, cm-string, cm-comment, etc.). These
        decorations are applied to the EditorView's DOM, adding the classes to the
        relevant text spans.
      </p>
      <p>
        Monaco uses TextMate grammars (the same format as VS Code) for syntax
        highlighting, powered by vscode-textmate running in a Web Worker. TextMate
        grammars are more expressive than Lezer's context-free grammars (they can
        match patterns across multiple lines using embedded language rules) but are
        slower and less incremental. For most editor-in-product use cases, Lezer's
        performance is superior.
      </p>

      <h2>LSP Integration</h2>
      <p>
        The Language Server Protocol is a standardized JSON-RPC protocol that language
        servers use to provide language intelligence to editors. The server process (e.g.,
        TypeScript Language Server, Pyright for Python) runs separately and communicates
        via stdin/stdout in a CLI context, or via WebSocket when accessed remotely.
      </p>
      <p>
        In a browser-based editor, the LSP server typically runs in one of three ways:
        a server-side process accessed via WebSocket proxy (the editor sends LSP
        requests to a WebSocket endpoint, which proxies them to the language server
        running on the backend); a Web Worker that runs a stripped-down language server
        in the browser (TypeScript's language server runs in a Worker with significant
        setup); or a third-party service (GitHub Copilot's infrastructure, or CodeSandbox's
        Sandpack which embeds the TypeScript LS in a Worker).
      </p>
      <p>
        The LSP capabilities relevant to an editor component: textDocument/completion
        (autocomplete suggestions as the user types), textDocument/hover (documentation
        shown on cursor hover), textDocument/publishDiagnostics (error and warning
        squiggles), textDocument/definition (go to definition), and
        textDocument/formatting (format the entire file or a selection).
      </p>
      <p>
        Autocomplete triggering: debounce the completion request by 150–200ms after
        each keystroke to avoid sending a request on every character. Cancel the
        previous request when a new one is started. Show a loading indicator in the
        completion dropdown while the response is pending. Filter the received
        completions client-side as the user continues typing, without waiting for
        another server round-trip.
      </p>

      <h2>Diff View</h2>
      <p>
        A diff view shows the differences between two versions of a file — the original
        and the modified. Monaco provides a built-in DiffEditor component. For custom
        implementations or CodeMirror, the diff algorithm (Myers diff or Patience diff)
        computes the edit script: the minimal sequence of insertions and deletions that
        transforms the original into the modified.
      </p>
      <p>
        The diff is computed at the line level for the primary view (each changed line
        is highlighted in red/green) and optionally at the character level within changed
        lines (showing exactly which characters were modified). Character-level diff is
        the more computationally expensive operation and is typically run only for
        changed lines, not the entire file.
      </p>
      <p>
        Rendering the diff: in a split view, the two editors are synchronized by scroll
        position (scrolling one scrolls the other to the corresponding line). Unchanged
        regions can be collapsed (folded) to show only the context around changes,
        similar to GitHub's diff view.
      </p>

      <h2>Theming</h2>
      <p>
        Editor themes define colors for all token types (keywords, strings, comments,
        identifiers) plus the editor chrome (background, gutter, selection highlight,
        cursor). CodeMirror's theme system uses CSS classes on the editor's root element
        and CSS rules scoped to those classes. Adding a theme is as simple as adding a
        StyleModule with CSS rules and providing the root class name as a facet.
      </p>
      <p>
        For a design system editor component, themes should use CSS custom properties
        as the values, allowing the surrounding application's theme (light/dark mode)
        to cascade into the editor. Define the token colors as CSS variables on the
        editor root and change the variable values by toggling the data-theme attribute
        on the application root — the same pattern as the overall theme system.
      </p>
      <p>
        Monaco uses JSON theme definitions (similar to VS Code's theme format) with
        token color rules and semantic highlight rules. Converting a design system's
        color tokens to a Monaco theme requires mapping the token type names to the
        design system's semantic color tokens.
      </p>

      <h2>Accessibility</h2>
      <p>
        Code editors are notoriously difficult to make accessible. The core challenge:
        a textarea element is the accessible baseline for text input, but all features
        beyond basic text entry (syntax highlighting, autocomplete, error squiggles)
        require custom rendering that the screen reader cannot interpret.
      </p>
      <p>
        CodeMirror takes the approach of using a contenteditable element for the editor
        content (which screen readers can interact with) but adds ARIA annotations to
        express editor state. Monaco uses a visually hidden textarea for screen reader
        interaction and a separate visual layer for the highlighted content.
      </p>
      <p>
        The minimum accessibility requirements: the editor has role="textbox",
        aria-multiline="true", and aria-label. Autocomplete dropdowns are a listbox
        with role="listbox" and role="option" for each item. Error diagnostics are
        announced via aria-live regions or aria-describedby on the affected lines.
        Keyboard navigation must be entirely possible — Tab should indent (not exit
        the editor); Escape followed by Tab should exit. The editor should expose
        a "Use Tab to exit the editor" hint for keyboard users.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: Why is the document stored as a B-tree rather than a string in production editors?</h3>
      <p>
        A string's concatenation cost is O(n) where n is the string length. Inserting
        a character in the middle of a 1MB file requires allocating a new 1MB string.
        At 60 keystrokes per second, this is 60 MB of string allocation per second —
        triggering frequent garbage collection and frame drops. A B-tree of string
        segments (the "rope" data structure) breaks the document into chunks of ~1,000
        characters. Insertions modify only the affected chunk and update the tree's
        metadata, both O(log n). The tree also maintains cumulative character counts,
        enabling O(log n) line-by-line access and range lookups. The tradeoff: more
        complex implementation and slightly higher constant-factor overhead than a
        plain string for reads. For files under ~10,000 characters, the overhead
        outweighs the benefit; production editors typically switch to a rope only above
        a file size threshold.
      </p>

      <h3>Q: How does autocomplete avoid making a server round-trip on every keystroke?</h3>
      <p>
        The completion protocol has two phases: triggering (requesting completions from
        the language server) and filtering (narrowing the completion list as the user
        continues typing). On trigger, send one request to the language server and
        receive a full list of completions for the current context (e.g., all properties
        of the object the user is accessing). Cache this list. As the user types
        additional characters, filter the cached list client-side by fuzzy-matching
        the typed prefix against the completion labels — no new server request needed.
        A new trigger request is sent only when the completion context changes (e.g.,
        the user moves the cursor to a different position, types a delimiter like a
        period or space that opens a new context, or the previous list was marked as
        non-complete by the server). This pattern reduces server requests to O(1) per
        completion context rather than O(keystrokes).
      </p>

      <h3>Q: How do you implement "find and replace" in a large document without UI thread stalls?</h3>
      <p>
        The search itself (matching a regex or string across the document) can stall
        the UI thread for large files. Mitigate by running the search in a Web Worker:
        send the document text and the search pattern to the worker, which returns
        the match positions. For incremental results (show matches as they are found
        rather than waiting for the full file), the worker sends batches of match
        positions back to the main thread as it processes the document in chunks.
        On the main thread, decorate the received match positions using CodeMirror
        Decoration.mark to highlight them. Replace-all is a batch transaction: compute
        all match ranges, construct a ChangeSet that replaces each match with the
        replacement text, and apply it as a single transaction. Undo-redo treats this
        as one atomic operation.
      </p>

      <h3>Q: How would you design a collaborative code editor (like Google Docs for code)?</h3>
      <p>
        Collaborative code editing requires an Operational Transformation (OT) or CRDT
        layer on top of the editor's document model. Each keystroke produces a
        ChangeSet (in CodeMirror terms) describing insertions and deletions. This
        ChangeSet is sent to a server that applies it to the canonical document state
        and broadcasts it to other connected editors. Each client applies received
        ChangeSets using OT's transform function: if client A and client B both edit
        at position 100, and A's change is applied first, B's change must be rebased
        (offset by A's insertion length) before being applied. Yjs uses a CRDT approach:
        each character has a globally unique ID, and the CRDT's merge rules guarantee
        convergence without a central server. yjs-codemirror provides the binding
        between Yjs's document model and CodeMirror 6's EditorState. The cursor
        positions of other users are rendered as remote cursors using Decorations —
        a small colored cursor element at each collaborator's position.
      </p>

      <h3>Q: How does the gutter (line numbers and other annotations) stay in sync with the editor content during fast scrolling?</h3>
      <p>
        The gutter is part of the EditorView's virtualized DOM layer, rendered with
        the same virtual scroll logic as the code lines themselves. Only the gutter
        cells for visible lines are in the DOM. When the user scrolls, the view
        recalculates which lines are visible, creates gutter cell DOM nodes for newly
        visible lines, and removes nodes for lines that scrolled out of view. The
        gutter cells are positioned absolutely at the same top offset as their
        corresponding code lines, keeping them aligned. This is managed entirely
        within the EditorView's layout phase — no separate scroll synchronization
        logic is needed. Custom gutter annotations (breakpoint indicators, coverage
        markers, error line highlights) are registered as GutterMarker extensions
        that contribute a DOM element for specific line numbers; the view renders
        them during its layout phase.
      </p>
    </ArticleLayout>
  );
}

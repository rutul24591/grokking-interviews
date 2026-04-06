"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-rich-text-editor",
  title: "Design a Rich Text Editor",
  description:
    "Complete LLD solution for a production-grade rich text editor with mentions, image upload, collaborative editing hooks, undo/redo, serialization, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "rich-text-editor",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "rich-text-editor",
    "contenteditable",
    "mentions",
    "image-upload",
    "collaborative-editing",
    "serialization",
    "accessibility",
  ],
  relatedTopics: [
    "form-builder",
    "file-upload-widget",
    "data-table",
    "search-autocomplete",
  ],
};

export default function RichTextEditorArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable rich text editor component for a large-scale
          React application. The editor must support standard formatting operations
          (bold, italic, underline, headings, lists, links, code blocks), inline
          mentions via an <code>@username</code> autocomplete system, drag-and-drop
          image uploads with inline placeholders and upload progress tracking, and
          placeholder hooks for collaborative editing integration (CRDT/OT-based
          conflict resolution with presence cursors). The editor must maintain an
          undo/redo history stack, serialize its internal document model to HTML,
          JSON, and Markdown, and meet accessibility standards for keyboard navigation
          and screen reader announcements.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            The editor operates on a single document at a time. Multi-document
            editing is out of scope.
          </li>
          <li>
            The content model uses a block-based structure (blocks, inlines, text
            leaves) rather than raw HTML strings. This enables structured manipulation
            and serialization.
          </li>
          <li>
            The editor uses a <code>contentEditable</code> div as its rendering surface,
            not a textarea or custom canvas.
          </li>
          <li>
            Image uploads are handled via a configurable upload endpoint. The editor
            displays inline placeholders with progress indicators during upload.
          </li>
          <li>
            Collaborative editing hooks are provided as extension points. The actual
            CRDT/OT implementation is external to the editor (e.g., Yjs, Automerge).
          </li>
          <li>
            The editor must support both light and dark mode.
          </li>
          <li>
            Documents may grow large (thousands of blocks). Performance optimizations
            such as virtualized rendering and debounced state updates are required.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Formatting Toolbar:</strong> Bold, italic, underline, headings
            (H1–H4), ordered/unordered lists, links, and code blocks. Active formatting
            state must be reflected in the toolbar (e.g., bold button highlighted when
            cursor is inside bold text).
          </li>
          <li>
            <strong>Mentions:</strong> Typing <code>@</code> followed by characters
            triggers an autocomplete dropdown with matching usernames. The dropdown
            supports keyboard navigation (arrow keys, Enter to select, Escape to dismiss)
            and inserts the mention at the cursor position as an inline node.
          </li>
          <li>
            <strong>Image Upload:</strong> Users can drag and drop images onto the editor
            or paste images from the clipboard. Images render as inline placeholders during
            upload, showing progress. On completion, the placeholder is replaced with the
            actual image. Failed uploads show a retry button.
          </li>
          <li>
            <strong>Collaborative Editing Hooks:</strong> The editor exposes extension
            points for CRDT/OT integration, including remote operation application,
            presence cursor rendering, and conflict resolution callbacks.
          </li>
          <li>
            <strong>Undo/Redo:</strong> A history stack maintains content snapshots.
            Users can undo/redo via toolbar buttons or keyboard shortcuts (Ctrl+Z /
            Ctrl+Shift+Z or Cmd+Z / Cmd+Shift+Z on macOS).
          </li>
          <li>
            <strong>Serialization:</strong> The editor state can be serialized to HTML
            (for rendering), JSON (for storage and collaborative editing), and Markdown
            (for export and interoperability).
          </li>
          <li>
            <strong>Accessibility:</strong> The toolbar is fully keyboard-navigable.
            Screen readers announce formatting changes, mention insertions, and image
            upload progress.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Typing should feel instantaneous (less than
            16ms per keystroke). Large documents (500+ blocks) should use virtualized
            rendering to maintain 60fps scrolling. State updates are debounced (default:
            150ms) to avoid excessive re-renders.
          </li>
          <li>
            <strong>Scalability:</strong> The editor should handle documents with
            10,000+ blocks without memory leaks. History stack is bounded (default:
            100 entries) to prevent unbounded memory growth.
          </li>
          <li>
            <strong>Reliability:</strong> Unsaved changes are preserved across page
            refreshes via auto-save to localStorage or IndexedDB. Image upload failures
            are retried with exponential backoff.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for the document model
            (EditorNode, EditorState), toolbar actions, mention data, image data, and
            serialization formats.
          </li>
          <li>
            <strong>Extensibility:</strong> The editor architecture supports plugins for
            custom node types, custom toolbar actions, and custom serialization formats
            without modifying core code.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            User types <code>@</code> at the very end of a line — the mention dropdown
            must position itself correctly without overflowing the viewport.
          </li>
          <li>
            User pastes HTML content from an external source (e.g., another editor, a
            webpage) — the pasted content must be sanitized and converted to the internal
            block model.
          </li>
          <li>
            Multiple images dropped simultaneously — each image uploads independently
            with its own progress indicator.
          </li>
          <li>
            Undo/redo during an active mention dropdown — the dropdown must dismiss
            and the mention insertion must be treated as a single atomic history entry.
          </li>
          <li>
            Collaborative editing conflict — two users edit the same block simultaneously.
            The CRDT/OT layer resolves conflicts; the editor must apply the resolved
            state without losing user input.
          </li>
          <li>
            Server-side rendering — the editor must not attempt to access
            <code>document</code> or <code>window</code> during SSR. It renders a
            placeholder during SSR and hydrates on the client.
          </li>
          <li>
            User navigates away with unsaved changes — the editor should prompt the user
            to save or discard changes.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>document model</strong> (a structured
          tree of blocks, inlines, and text leaves) from the <strong>rendering surface</strong>
          (a <code>contentEditable</code> div) and the <strong>state management</strong>
          (a Zustand store for editor state, history, and selection). The document model
          is the single source of truth — all formatting operations, mention insertions,
          and image uploads mutate the model, and the rendering surface reflects the model
          state. Serialization transforms the model into HTML, JSON, or Markdown on demand.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Raw HTML string as document model:</strong> Simple to implement
            initially but extremely difficult to manipulate programmatically. Parsing
            HTML to detect mentions, extract images, or apply collaborative edits
            requires fragile DOM traversal. Not suitable for production-scale editors.
          </li>
          <li>
            <strong>Textarea with Markdown syntax:</strong> Lightweight and predictable
            but lacks rich formatting feedback (users cannot see bold/italic visually
            while typing). Mention autocomplete and image inline rendering are impossible
            in a plain textarea. Suitable for developer-focused tools but not for general
            WYSIWYG use cases.
          </li>
          <li>
            <strong>Canvas-based rendering:</strong> Complete control over rendering but
            reinvents text layout, selection, and accessibility. Extremely high
            implementation cost. Only justified for specialized editors (e.g., Figma-like
            design tools).
          </li>
          <li>
            <strong>Existing library (Slate, ProseMirror, TipTap):</strong> Production-ready
            with battle-tested document models, serialization, and plugin ecosystems.
            The trade-off is reduced control over internals and dependency on library
            evolution. For this LLD, we implement a simplified version to demonstrate
            architectural understanding, but in production, using an existing library
            is the recommended approach.
          </li>
        </ul>
        <p>
          <strong>Why block-based content model + contentEditable is optimal:</strong>
          A block-based model (where each paragraph, heading, list item, or image is a
          discrete node) enables structured manipulation, efficient serialization, and
          clean collaborative editing integration. The <code>contentEditable</code> div
          leverages the browser&apos;s native text layout, selection, and IME support,
          avoiding the massive implementation cost of custom rendering. This pattern is
          used by production editors like Slate, ProseMirror, and Notion&apos;s editor.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eleven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Editor Types (<code>editor-types.ts</code>)</h4>
          <p>
            Defines the core TypeScript interfaces that power the entire editor. The
            <code>EditorNode</code> union type represents any node in the document tree
            (block nodes, inline nodes, text leaves). The <code>EditorState</code> interface
            captures the full editor state including the document tree, selection range,
            active formats, and metadata. The <code>ToolbarAction</code> union type enumerates
            all possible formatting operations. The <code>MentionData</code> interface
            represents a mentionable user, and <code>ImageData</code> captures image metadata
            including upload state and progress. See the Example tab for the complete type
            definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Editor Store (<code>editor-store.ts</code>)</h4>
          <p>
            A Zustand store managing the editor state, undo/redo history stack, and
            current selection. The store exposes actions for applying operations (format
            text, insert mention, insert image, update block type), pushing history
            snapshots, undoing, and redoing. The history stack is bounded (default: 100
            entries) to prevent unbounded memory growth. Selection state tracks the current
            cursor position and active formatting, enabling the toolbar to reflect real-time
            state. See the Example tab for the complete Zustand store implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Content Model (<code>content-model.ts</code>)</h4>
          <p>
            Implements the document model — a tree of blocks, inlines, and text leaves —
            and provides serialization functions to convert the model to HTML, JSON, and
            Markdown. Each block node has a type (paragraph, heading, list item, code block,
            image) and contains child nodes. Inline nodes (links, mentions) span within
            text. Text leaves carry the actual string content and format marks (bold,
            italic, underline). Serialization to HTML traverses the tree and emits semantic
            HTML elements. Serialization to JSON preserves the full tree structure for
            storage and collaborative editing. Serialization to Markdown produces a
            Markdown-compatible string representation. See the Example tab for the complete
            content model implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Mention Engine (<code>mention-engine.ts</code>)</h4>
          <p>
            Detects <code>@</code> triggers in text content, computes the autocomplete
            dropdown position relative to the cursor, filters the mentionable user list
            based on typed characters, and handles mention insertion into the document
            model. The engine listens to input events on the <code>contentEditable</code>
            div, extracts the text before the cursor, detects the <code>@query</code>
            pattern, and returns the matching users along with the bounding rectangle
            for dropdown positioning. See the Example tab for the complete mention engine
            implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Image Handler (<code>image-handler.ts</code>)</h4>
          <p>
            Handles drag-and-drop image events, clipboard paste image extraction, upload
            progress tracking, and inline placeholder management. When an image is dropped
            or pasted, the handler creates an <code>ImageData</code> object with a unique
            ID, upload status (pending, uploading, complete, failed), and progress
            percentage. The placeholder renders in the editor during upload. On completion,
            the placeholder is replaced with the actual image URL. Failed uploads expose a
            retry callback. See the Example tab for the complete image handler
            implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. useEditor Hook (<code>use-editor.ts</code>)</h4>
          <p>
            The core React hook that wires together the <code>contentEditable</code> div,
            the Zustand store, the mention engine, and the image handler. It manages input
            event handling, selection change tracking, format application (via
            <code>document.execCommand</code> or custom DOM manipulation), mention dropdown
            visibility, and image drop/paste handling. The hook returns refs, event handlers,
            and state values consumed by the root editor component. See the Example tab for
            the complete hook implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. useToolbar Hook (<code>use-toolbar.ts</code>)</h4>
          <p>
            Manages toolbar state, detects active formatting based on the current selection,
            and dispatches toolbar actions to the editor store. The hook subscribes to the
            store&apos;s active format state and exposes a <code>dispatch(action)</code>
            function that the toolbar buttons call. See the Example tab for the complete
            toolbar hook implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. RichTextEditor Component (<code>rich-text-editor.tsx</code>)</h4>
          <p>
            The root editor component that renders the <code>contentEditable</code> div,
            wires it to the <code>useEditor</code> hook, and manages selection tracking.
            It renders child components (mention dropdown, image placeholders) based on
            editor state. The component is SSR-safe — it returns a placeholder during
            server rendering and hydrates on the client. See the Example tab for the
            complete component implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">9. Toolbar Component (<code>toolbar.tsx</code>)</h4>
          <p>
            Renders the formatting toolbar with buttons for each formatting action. Each
            button reflects its active state (highlighted when the current selection has
            that format applied). The toolbar is keyboard-accessible — all buttons are
            native <code>&lt;button&gt;</code> elements with proper ARIA labels. See the
            Example tab for the complete toolbar component implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">10. MentionDropdown Component (<code>mention-dropdown.tsx</code>)</h4>
          <p>
            Renders the <code>@username</code> autocomplete dropdown with keyboard
            navigation (arrow keys, Enter to select, Escape to dismiss). The dropdown
            positions itself relative to the cursor using the bounding rectangle computed
            by the mention engine. It renders a scrollable list of matching users with
            avatars and display names. See the Example tab for the complete mention
            dropdown component implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">11. ImagePlaceholder Component (<code>image-placeholder.tsx</code>)</h4>
          <p>
            Renders an inline image placeholder with an upload progress indicator. During
            upload, it displays a progress bar with the percentage complete. On completion,
            it renders the actual image. On failure, it displays an error message and a
            retry button. See the Example tab for the complete image placeholder component
            implementation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for editor state. It maintains
          the document tree (root block node with child blocks), the undo/redo history
          stack (array of serialized document snapshots), the current selection range
          (anchor and focus offsets), and the active format set (which formats apply at
          the current cursor position). All mutations flow through store actions, which
          push a history snapshot before applying the mutation. Undo pops the last
          snapshot from the history stack and restores it; redo pushes the current state
          onto a redo stack and applies the next snapshot.
        </p>
        <p>
          The selection state is updated on every <code>selectionchange</code> event from
          the browser. The store computes active formats by inspecting the DOM nodes
          spanning the selection range (e.g., if the selection is inside a
          <code>&lt;strong&gt;</code> element, the <code>bold</code> format is active).
          This enables the toolbar to reflect real-time formatting state.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/rich-text-editor-architecture.svg"
          alt="Rich Text Editor Architecture"
          caption="Architecture of the rich text editor showing block-based document model, contentEditable surface, and extension points"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User types in the <code>contentEditable</code> div. The <code>useEditor</code>
            hook captures the input event, updates the document model in the store, and
            checks for mention triggers.
          </li>
          <li>
            If <code>@</code> is detected, the mention engine computes matching users and
            the dropdown position. The MentionDropdown component renders.
          </li>
          <li>
            User selects a mention from the dropdown (click or Enter key). The mention
            engine inserts the mention inline node into the document model at the cursor
            position. The store updates, and the editor re-renders.
          </li>
          <li>
            User clicks a toolbar button (e.g., Bold). The <code>useToolbar</code> hook
            dispatches the action to the store. The store applies the format to the
            current selection via <code>document.execCommand(&apos;bold&apos;)</code> or
            custom DOM manipulation.
          </li>
          <li>
            User drops an image onto the editor. The image handler creates an
            <code>ImageData</code> object with upload status <code>pending</code>, starts
            the upload, and inserts an inline placeholder into the document model. The
            ImagePlaceholder component renders with a progress bar.
          </li>
          <li>
            Image upload completes. The image handler updates the <code>ImageData</code>
            status to <code>complete</code> with the image URL. The placeholder is replaced
            with the actual image.
          </li>
          <li>
            User presses Ctrl+Z. The store pops the last history snapshot, restores the
            document model, and the editor re-renders with the previous state.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. User interactions
          (typing, clicking toolbar, dropping images, selecting mentions) are captured by
          event handlers in the <code>useEditor</code> hook. These handlers dispatch actions
          to the Zustand store, which mutates the document model, updates the history stack,
          and notifies subscribers. The React components (RichTextEditor, Toolbar,
          MentionDropdown, ImagePlaceholder) subscribe to the store and re-render when
          their selected state changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Mention dropdown at viewport edge:</strong> The mention engine computes
            the dropdown position using <code>getBoundingClientRect()</code> of the text
            node at the cursor. If the dropdown would overflow the viewport, it flips its
            position (above/below the cursor, left/right of the cursor) to remain visible.
          </li>
          <li>
            <strong>HTML paste sanitization:</strong> When the user pastes HTML content,
            the editor sanitizes it by stripping dangerous tags (script, iframe, object)
            and converting the remaining HTML to the internal block model. This prevents
            XSS attacks and ensures content conforms to the document model.
          </li>
          <li>
            <strong>Concurrent image uploads:</strong> Each image dropped or pasted gets a
            unique ID and uploads independently. The editor does not block typing while
            images upload — the placeholders render inline and the user can continue editing
            around them.
          </li>
          <li>
            <strong>History stack bounds:</strong> The store caps the history stack at 100
            entries. When the limit is reached, the oldest entry is discarded before pushing
            a new snapshot. This prevents unbounded memory growth during long editing
            sessions.
          </li>
          <li>
            <strong>SSR safety:</strong> The RichTextEditor component checks
            <code>typeof window === &apos;undefined&apos;</code> during render. If true,
            it returns a loading placeholder. On the client, a <code>useEffect</code>
            triggers the full editor mount. This prevents hydration mismatches.
          </li>
          <li>
            <strong>Debounced state updates:</strong> The editor debounces document model
            updates at 150ms to avoid excessive store mutations during rapid typing. The
            visual feedback (character appearing in the editor) is immediate via the
            browser&apos;s native <code>contentEditable</code> behavior; the debounce
            applies only to the structured document model synchronization.
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
            The complete, production-ready implementation consists of 12 files: TypeScript
            type definitions, Zustand store with undo/redo, document model with
            HTML/JSON/Markdown serialization, mention engine with autocomplete, image
            handler with upload progress, core editor hook, toolbar hook, root editor
            component, toolbar component, mention dropdown component, image placeholder
            component, and a full EXPLANATION.md walkthrough. Click the <strong>Example</strong>
            toggle at the top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Editor Types (editor-types.ts)</h3>
        <p>
          Defines the foundational type system. <code>EditorNode</code> is a discriminated
          union of BlockNode (paragraph, heading, list, code block, image), InlineNode
          (link, mention), and TextLeaf (text content with format marks).
          <code>EditorState</code> captures the full editor state including the document
          tree, selection, active formats, and metadata. <code>ToolbarAction</code> is a
          union of all formatting action types. <code>MentionData</code> and
          <code>ImageData</code> represent mention and image metadata respectively.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Editor Store (editor-store.ts)</h3>
        <p>
          The Zustand store manages the document tree, history stack (bounded at 100
          entries), selection state, and active formats. Key actions include
          <code>applyOperation</code> (mutates the document and pushes a history snapshot),
          <code>undo</code> (pops from history, restores previous state), <code>redo</code>
          (pushes current state to redo stack, applies next snapshot),
          <code>updateSelection</code> (updates cursor position and recomputes active
          formats), and <code>setActiveFormats</code> (updates the active format set for
          toolbar reflection).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Content Model (content-model.ts)</h3>
        <p>
          Implements the document model as a tree of blocks, inlines, and text leaves.
          Provides <code>serializeToHTML</code> (traverses the tree and emits semantic
          HTML elements), <code>serializeToJSON</code> (preserves full tree structure for
          storage), and <code>serializeToMarkdown</code> (produces Markdown-compatible
          string). The model supports insertion, deletion, and update operations on any
          node type.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Mention Engine (mention-engine.ts)</h3>
        <p>
            Detects <code>@</code> triggers by scanning the text content before the cursor
            position. Extracts the query string (characters after <code>@</code>), filters
            the mentionable user list by matching the query against usernames and display
            names, and computes the dropdown bounding rectangle using
            <code>Range.getClientRects()</code>. The insertion function creates a mention
            inline node and inserts it into the document model at the cursor position,
            replacing the <code>@query</code> text.
          </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Image Handler (image-handler.ts)</h3>
        <p>
          Handles <code>drop</code> and <code>paste</code> events to extract image files.
          Creates <code>ImageData</code> objects with unique IDs and initial
          <code>pending</code> status. Uploads images via a configurable endpoint using
          <code>XMLHttpRequest</code> (for progress events) or <code>fetch</code> with
          a ReadableStream. Updates the image status to <code>uploading</code> with
          progress percentage, then to <code>complete</code> with the final URL on success,
          or <code>failed</code> with an error message on failure. Exposes a retry callback
          for failed uploads.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: useEditor Hook (use-editor.ts)</h3>
        <p>
          The core hook that integrates the <code>contentEditable</code> div with the
          store, mention engine, and image handler. It creates a ref for the editor div,
          handles input events (updating the document model and checking for mentions),
          handles selection change events (updating the store), handles key events (Ctrl+Z
          for undo, Ctrl+Shift+Z for redo), and handles drop/paste events for images via
          the image handler. Returns the editor ref, event handlers, and state values.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: useToolbar Hook (use-toolbar.ts)</h3>
        <p>
          Subscribes to the store&apos;s active format state and exposes a
          <code>dispatch</code> function. The dispatch function applies the formatting
          action via <code>document.execCommand</code> (for bold, italic, underline,
          headings, lists) or custom logic (for links, code blocks, mentions). After
          applying the action, it updates the store&apos;s active format set and pushes
          a history snapshot.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: RichTextEditor Component (rich-text-editor.tsx)</h3>
        <p>
          The root component that renders the <code>contentEditable</code> div, wires it
          to the <code>useEditor</code> hook, and renders child components (MentionDropdown,
          ImagePlaceholder) conditionally based on editor state. SSR-safe — returns a
          placeholder during server rendering and hydrates on the client via
          <code>useEffect</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Toolbar Component (toolbar.tsx)</h3>
        <p>
          Renders buttons for each formatting action (bold, italic, underline, H1–H4,
          ordered list, unordered list, link, code block, undo, redo). Each button uses
          the <code>useToolbar</code> hook to determine its active state and dispatch
          actions on click. All buttons are native <code>&lt;button&gt;</code> elements
          with ARIA labels for accessibility.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: MentionDropdown Component (mention-dropdown.tsx)</h3>
        <p>
          Renders the autocomplete dropdown with a scrollable list of matching users.
          Supports keyboard navigation (arrow keys move the highlighted item, Enter selects,
          Escape dismisses). Positions itself using inline styles based on the bounding
          rectangle computed by the mention engine. Renders user avatars and display names
          for each option.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 11: ImagePlaceholder Component (image-placeholder.tsx)</h3>
        <p>
          Renders an inline image placeholder with a progress bar during upload. On
          completion, renders the actual image using an <code>&lt;img&gt;</code> tag. On
          failure, renders an error message and a retry button. The component is styled
          with TailwindCSS to integrate seamlessly with the editor&apos;s visual design.
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
                <td className="p-2">Apply operation</td>
                <td className="p-2">O(b) — traverse b blocks to find target</td>
                <td className="p-2">O(n) — full document snapshot in history</td>
              </tr>
              <tr>
                <td className="p-2">Undo/Redo</td>
                <td className="p-2">O(1) — stack pop/push</td>
                <td className="p-2">O(h * n) — h history entries of size n</td>
              </tr>
              <tr>
                <td className="p-2">Mention detection</td>
                <td className="p-2">O(m) — scan m users for match</td>
                <td className="p-2">O(k) — k matching users</td>
              </tr>
              <tr>
                <td className="p-2">Image upload</td>
                <td className="p-2">O(1) per image — async operation</td>
                <td className="p-2">O(i) — i concurrent image uploads</td>
              </tr>
              <tr>
                <td className="p-2">Serialize to HTML/JSON/Markdown</td>
                <td className="p-2">O(n) — traverse all nodes</td>
                <td className="p-2">O(n) — output string size</td>
              </tr>
              <tr>
                <td className="p-2">Selection change detection</td>
                <td className="p-2">O(d) — d DOM depth to compute formats</td>
                <td className="p-2">O(f) — f active formats</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the total number of nodes in the document, <code>b</code>
          is the number of blocks, <code>h</code> is the history stack size (bounded at
          100), <code>m</code> is the number of mentionable users, <code>i</code> is the
          number of concurrent image uploads, <code>d</code> is the DOM tree depth, and
          <code>f</code> is the number of active formats. For a typical document (500
          blocks, 10,000 nodes), operations complete in sub-millisecond time.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Document tree traversal:</strong> Finding a specific block node requires
            traversing the tree, which is O(b) where b is the number of blocks. For very
            large documents (5000+ blocks), this could degrade. Mitigation: maintain a flat
            index mapping block IDs to their positions in the tree for O(1) lookup.
          </li>
          <li>
            <strong>History snapshot size:</strong> Each history entry is a full document
            snapshot, which is O(n) space. With 100 entries and a 10,000-node document,
            the history stack consumes significant memory. Mitigation: use differential
            snapshots (store only the changed nodes) or a CRDT-based approach for
            collaborative editors.
          </li>
          <li>
            <strong>Selection change frequency:</strong> The <code>selectionchange</code>
            event fires on every cursor movement, which can be dozens of times per second
            during text selection. Mitigation: debounce the selection handler at 50ms and
            only update the store when the active formats actually change.
          </li>
          <li>
            <strong>contentEditable re-render cost:</strong> Updating the
            <code>contentEditable</code> div&apos;s innerHTML triggers browser layout
            recalculations. Mitigation: only update the DOM when the document model changes
            programmatically (e.g., undo, mention insertion, image upload). User typing
            updates the DOM natively; the model syncs asynchronously.
          </li>
          <li>
            <strong>Mention dropdown repositioning:</strong> If the cursor moves while the
            dropdown is open, the dropdown position must update. Mitigation: recompute the
            position on every input event when the dropdown is visible. Use
            <code>requestAnimationFrame</code> to batch DOM reads and writes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Virtualized rendering:</strong> For documents with 500+ blocks, render
            only the blocks visible in the viewport using a virtualization library (e.g.,
            react-virtuoso or a custom implementation). This reduces the DOM node count and
            keeps scrolling at 60fps.
          </li>
          <li>
            <strong>Debounced model sync:</strong> User typing updates the DOM immediately
            (native browser behavior) but the structured document model syncs after a 150ms
            debounce. This avoids excessive store mutations during rapid typing while
            maintaining responsive visual feedback.
          </li>
          <li>
            <strong>Selector-based store subscriptions:</strong> Each component subscribes
            only to the slice of state it needs (e.g., Toolbar subscribes to activeFormats
            only, MentionDropdown subscribes to mentionQuery and mentionResults only).
            This prevents unnecessary re-renders when unrelated state changes.
          </li>
          <li>
            <strong>Efficient mention filtering:</strong> For large user directories (10,000+
            users), use a trie or fuzzy-search library (Fuse.js) instead of linear scanning.
            This reduces mention detection from O(m) to O(log m) or O(1) average case.
          </li>
          <li>
            <strong>Image upload with XMLHttpRequest:</strong> Use XMLHttpRequest instead
            of fetch for image uploads because XHR provides native progress events
            (<code>upload.onprogress</code>). If using fetch, wrap the body in a
            ReadableStream with a progress-tracking transform.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">XSS Prevention</h3>
        <p>
          The editor handles user-generated content that may be rendered as HTML. When
          pasting HTML from external sources or serializing the document model back to
          HTML, there is a risk of XSS attacks via injected <code>&lt;script&gt;</code>
          tags, <code>onerror</code> handlers on images, or <code>javascript:</code> URLs
          in links. The content model sanitizes all HTML on paste by stripping dangerous
          tags and attributes. When serializing to HTML, all attribute values are escaped
          using <code>textContent</code> or a sanitization library like DOMPurify. Links
          are validated to ensure they use safe protocols (http, https, mailto) and reject
          <code>javascript:</code> URLs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Image Upload Security</h3>
        <p>
          Image uploads must validate file types (only image/png, image/jpeg, image/gif,
          image/webp), enforce file size limits (e.g., 10MB maximum), and scan uploaded
          files for malware on the server side. The editor should not trust the uploaded
          image URL — it should be served from a trusted CDN with proper Content-Security-Policy
          headers. Inline image placeholders should use <code>blob:</code> URLs during
          upload to avoid exposing temporary file paths.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              The toolbar is fully keyboard-navigable. All buttons are native
              <code>&lt;button&gt;</code> elements with <code>tabindex=&quot;0&quot;</code>.
            </li>
            <li>
              The mention dropdown supports arrow keys (up/down to navigate options),
              Enter to select, and Escape to dismiss. The highlighted option is visually
              indicated with a background color change.
            </li>
            <li>
              Standard keyboard shortcuts are supported: Ctrl+B (bold), Ctrl+I (italic),
              Ctrl+U (underline), Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+K (insert link).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The <code>contentEditable</code> div has <code>role=&quot;textbox&quot;</code>
              and <code>aria-multiline=&quot;true&quot;</code>.
            </li>
            <li>
              When formatting is applied, an <code>aria-live=&quot;polite&quot;</code> region
              announces the change (e.g., &quot;Bold applied&quot;).
            </li>
            <li>
              When a mention is inserted, the screen reader announces the mention text
              (e.g., &quot;Mention: John Doe inserted&quot;).
            </li>
            <li>
              During image upload, the screen reader announces the progress
              (e.g., &quot;Image upload: 45 percent complete&quot;).
            </li>
            <li>
              The mention dropdown has <code>role=&quot;listbox&quot;</code> with each
              option having <code>role=&quot;option&quot;</code> and
              <code>aria-selected</code> reflecting the current highlight.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Collaborative Editing Security</h3>
        <p>
          When integrating with a CRDT/OT backend, all operations must be authenticated
          and authorized. The editor should verify that the user has write permission for
          the document before applying remote operations. Presence data (cursor positions
          of other users) should only be shared with users who have access to the document.
          Operation transforms must be validated to prevent malicious operations that could
          corrupt the document state.
        </p>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Content model operations:</strong> Test block insertion, deletion,
            and update. Test inline mention insertion and text leaf format application.
            Verify that the tree structure remains valid after each operation.
          </li>
          <li>
            <strong>Serialization:</strong> Test serializeToHTML, serializeToJSON, and
            serializeToMarkdown against known document models. Verify that serializing
            and deserializing produces an equivalent model (round-trip consistency).
          </li>
          <li>
            <strong>Store actions:</strong> Test applyOperation mutates the document and
            pushes a history snapshot. Test undo restores the previous state. Test redo
            re-applies the undone state. Test that the history stack is bounded at the
            configured limit.
          </li>
          <li>
            <strong>Mention engine:</strong> Test detection of <code>@</code> triggers
            at various cursor positions. Test filtering logic with partial queries. Test
            mention insertion replaces the <code>@query</code> text with the mention node.
          </li>
          <li>
            <strong>Image handler:</strong> Test image extraction from drop and paste
            events. Test upload progress tracking. Test status transitions
            (pending → uploading → complete/failed). Test retry logic for failed uploads.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Editor rendering lifecycle:</strong> Render the RichTextEditor
            component, simulate typing, verify the document model updates in the store.
            Simulate toolbar button clicks, verify the format is applied to the selection.
          </li>
          <li>
            <strong>Mention workflow:</strong> Type <code>@joh</code>, verify the
            MentionDropdown renders with matching users. Press Enter, verify the mention
            is inserted and the dropdown dismisses.
          </li>
          <li>
            <strong>Image upload workflow:</strong> Simulate dropping an image file,
            verify the ImagePlaceholder renders with a progress bar. Simulate upload
            completion, verify the placeholder is replaced with the actual image.
          </li>
          <li>
            <strong>Undo/Redo workflow:</strong> Type text, apply bold, press Ctrl+Z,
            verify the bold is removed. Press Ctrl+Shift+Z, verify the bold is restored.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify RichTextEditor returns a placeholder during SSR and
            hydrates correctly on the client.
          </li>
          <li>
            HTML paste with malicious content: verify script tags and event handlers
            are stripped during sanitization.
          </li>
          <li>
            Mention dropdown at viewport edge: verify the dropdown repositions to remain
            visible.
          </li>
          <li>
            100+ image uploads simultaneously: verify no memory leaks, all progress
            indicators render correctly, and the editor remains responsive.
          </li>
          <li>
            Accessibility: run axe-core automated checks on the rendered editor, verify
            ARIA roles, live regions, keyboard navigation, and screen reader announcements.
          </li>
          <li>
            Large document (5000+ blocks): verify virtualized rendering maintains 60fps
            scrolling and typing remains responsive.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using raw HTML strings as the document model:</strong> Candidates often
            store the editor content as an HTML string and manipulate it via string
            operations or <code>innerHTML</code>. This makes mention detection, image
            extraction, and collaborative editing extremely difficult. Interviewers expect
            a structured document model (tree of blocks, inlines, leaves) that enables
            programmatic manipulation.
          </li>
          <li>
            <strong>Not handling the contentEditable sync problem:</strong> The
            <code>contentEditable</code> div and the document model can drift out of sync.
            Candidates often update one without the other, leading to inconsistent state.
            The correct approach is: user typing updates the DOM natively (immediate
            feedback), and the model syncs asynchronously (debounced). Programmatic
            changes (undo, mention insertion) update the model first, then the DOM.
          </li>
          <li>
            <strong>Forgetting to bound the history stack:</strong> An unbounded undo/redo
            history causes memory leaks in long editing sessions. Interviewers look for
            candidates who discuss memory management and set explicit limits (e.g., 100
            entries with oldest-first eviction).
          </li>
          <li>
            <strong>Ignoring mention dropdown positioning:</strong> Simply rendering the
            dropdown at a fixed position leads to overflow issues when the cursor is near
            the viewport edge. Candidates should discuss computing the dropdown position
            from the cursor&apos;s bounding rectangle and flipping the position when
            necessary.
          </li>
          <li>
            <strong>Not sanitizing pasted HTML:</strong> Allowing raw HTML paste without
            sanitization is an XSS vulnerability. Interviewers expect candidates to discuss
            content sanitization as a non-negotiable security requirement.
          </li>
          <li>
            <strong>Overlooking accessibility:</strong> Building a rich text editor without
            ARIA roles, live regions, and keyboard navigation excludes users who rely on
            assistive technology. This is a critical oversight in production systems and
            a red flag in interviews.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">contentEditable vs Custom Rendering</h4>
          <p>
            Using <code>contentEditable</code> leverages the browser&apos;s native text
            layout, selection, and IME (Input Method Editor) support for East Asian
            languages. The trade-off is inconsistent behavior across browsers (Chrome,
            Firefox, and Safari handle contentEditable differently) and limited control
            over the rendering surface. Custom rendering (canvas or custom DOM) provides
            complete control but requires implementing text layout, selection highlighting,
            and IME support from scratch — a massive engineering effort. For most
            applications, contentEditable is the pragmatic choice, with browser-specific
            quirks handled via normalization layers.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Full Snapshots vs Differential History</h4>
          <p>
            Storing full document snapshots in the history stack is simple and correct but
            consumes O(h * n) space where h is history depth and n is document size.
            Differential history (storing only the changed nodes) is more space-efficient
            but requires implementing a diff/patch system and is more complex to apply
            correctly. For documents under 10,000 nodes with a history limit of 100, full
            snapshots consume roughly 10-50MB, which is acceptable for desktop browsers.
            For mobile or very large documents, differential history is justified.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">execCommand vs Custom Formatting</h4>
          <p>
            <code>document.execCommand</code> is deprecated but still supported by all
            major browsers. It provides a simple API for applying formatting (bold, italic,
            headings) to the current selection. The trade-off is inconsistent behavior
            across browsers and no support for custom node types (mentions, custom blocks).
            Custom formatting (manipulating the DOM tree directly or via the document model)
            provides consistent behavior and supports custom nodes but requires significant
            implementation effort. The pragmatic approach is: use execCommand for standard
            formatting where browser support is reliable, and use custom logic for custom
            nodes (mentions, images, code blocks). Production editors like Slate have moved
            entirely to custom formatting to avoid execCommand&apos;s inconsistencies.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CRDT vs OT for Collaborative Editing</h4>
          <p>
            CRDTs (Conflict-free Replicated Data Types, e.g., Yjs, Automerge) are
            peer-to-peer and do not require a central server for conflict resolution. They
            are simpler to integrate as extension points but consume more memory (store
            metadata for each operation). OT (Operational Transformation, e.g., Google
            Docs) requires a central server to transform operations but is more
            memory-efficient. For this editor, we provide extension points for both — the
            editor exposes an <code>applyRemoteOperation</code> callback and a
            <code>getLocalOperations</code> function. The actual CRDT/OT implementation
            is external. Interviewers expect candidates to understand the trade-offs and
            articulate why one might be chosen over the other for a given use case.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement real-time collaborative cursors (presence)?
            </p>
            <p className="mt-2 text-sm">
              A: Each connected user&apos;s cursor position (block ID, text offset) is
              broadcast to all other users via WebSocket. The receiving editor renders a
              colored caret and a name label at the remote cursor position using an
              absolutely-positioned overlay element. The position is computed from the
              block&apos;s DOM element using <code>getBoundingClientRect()</code> and the
              text offset. When the remote user types, their cursor position updates are
              transformed against local operations (in an OT system) or automatically
              consistent (in a CRDT system). The overlay approach avoids modifying the
              document model for presence data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle offline editing with later synchronization?
            </p>
            <p className="mt-2 text-sm">
              A: Store local operations in IndexedDB as the user edits offline. Each
              operation has a Lamport timestamp or vector clock. When connectivity is
              restored, send the queued operations to the server. The server reconciles
              offline operations with concurrent operations from other users (using OT
              transformation or CRDT merge) and returns the resolved document state. The
              editor applies the resolved state, potentially showing the user a diff of
              changes made during the offline period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add support for custom block types (e.g., embeds, tables)?
            </p>
            <p className="mt-2 text-sm">
              A: Extend the <code>EditorNode</code> discriminated union with new block
              types (e.g., <code>{"type: 'embed'"}</code> or <code>{"type: 'table'"}</code>).
              Add a renderer map that maps block types to React components. The
              RichTextEditor component renders each block by looking up its renderer in the
              map. For tables, the renderer would be a custom table component with
              editable cells. For embeds, the renderer would be an iframe or a custom
              embed component. The content model&apos;s serialization functions handle
              the new block types by emitting the appropriate HTML/JSON/Markdown.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement spell checking and grammar suggestions?
            </p>
            <p className="mt-2 text-sm">
              A: Enable the browser&apos;s native spell checking via
              <code>spellCheck=&quot;true&quot;</code> on the contentEditable div. For
              grammar suggestions, send the document text to a grammar-checking API (e.g.,
              LanguageTool) on a debounce (e.g., 2 seconds after the user stops typing).
              The API returns suggestions with character offsets. The editor renders
              suggestions as underlined spans with a tooltip showing the suggestion on
              hover. Accepting a suggestion replaces the flagged text with the suggested
              correction. The document model tracks suggestion decorations separately from
              content to avoid conflating them.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you version the document format for backward compatibility?
            </p>
            <p className="mt-2 text-sm">
              A: Include a <code>version</code> field in the serialized JSON document.
              When loading a document, check the version against the current editor&apos;s
              supported version. If the document is older, run it through a migration
              pipeline (v1 → v2 → v3) that applies transformations to bring it to the
              current format. Each migration step is a pure function that takes the old
              format and returns the new format. This ensures backward compatibility as
              the document model evolves (e.g., new block types, changed field names).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle extremely large documents (100,000+ blocks)?
            </p>
            <p className="mt-2 text-sm">
              A: Implement virtualized rendering — only render the blocks visible in the
              viewport (plus a small buffer above and below). Use a block index (flat map
              of block ID to position) for O(1) block lookup. Implement lazy loading —
              fetch blocks from the server on demand as the user scrolls. The document
              model stores only the loaded blocks in memory, with unloaded blocks represented
              as lazy references. When the user scrolls to an unloaded region, the editor
              fetches and materializes the blocks. This keeps memory usage constant
              regardless of total document size.
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
              href="https://docs.slatejs.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slate.js — Extensible Rich Text Editor Framework
            </a>
          </li>
          <li>
            <a
              href="https://prosemirror.net/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ProseMirror — Toolkit for Building Rich Text Editors
            </a>
          </li>
          <li>
            <a
              href="https://tiptap.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TipTap — Headless Rich Text Editor Built on ProseMirror
            </a>
          </li>
          <li>
            <a
              href="https://docs.yjs.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yjs — CRDT Framework for Collaborative Editing
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
              href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Editable Content (contentEditable) Specification
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Authorable Practices — Accessibility Patterns
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cure53/DOMPurify"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOMPurify — HTML Sanitization Library
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

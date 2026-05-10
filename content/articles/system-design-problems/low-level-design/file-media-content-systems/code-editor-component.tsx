"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-code-editor-component",
  title: "Design a Code Editor Component",
  description:
    "LLD for an embedded code editor: syntax highlighting, autocomplete, line numbers, find-replace, embed Monaco vs build custom, accessibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "code-editor-component",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-29",
  tags: ["lld", "code-editor", "monaco", "syntax-highlighting", "react"],
  relatedTopics: [
    "rich-text-editor",
    "spreadsheet-like-grid",
    "wysiwyg-email-builder",
  ],
};

export default function CodeEditorComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing an embedded code editor
          component — VS-Code-like editing inside a web
          app, used in coding-focused products
          (CodeSandbox-style sandboxes), CI tools (edit
          configuration), low-code tools (embedded
          scripts), and any UI where users write or
          edit code. The component handles syntax
          highlighting, line numbers, autocomplete,
          find-and-replace, and proper text editing
          fundamentals (cursor, selection, undo). The
          decision matrix is mostly between embedding
          Monaco (the VS Code editor) for full
          features versus a lighter custom solution
          for simpler needs.
        </p>
        <p>
          The hard problems are: rendering text
          efficiently with syntax highlighting at
          scale; handling text input with proper IME
          and accessibility; autocomplete that&rsquo;s
          fast and language-aware; find-and-replace
          with regex; integration with language
          servers (LSP) for full IDE features; and
          configuration that gives consumers control
          without exposing every Monaco knob.
        </p>

        <h3>User Context</h3>
        <p>
          End users are developers writing code in the
          browser. They expect VS-Code-class editing:
          fast typing, accurate autocomplete, syntax
          highlighting, multi-cursor, find-replace,
          minimap. Engineering teams provide a
          language and source code; the runtime
          handles editing.
        </p>

        <h3>Assumptions</h3>
        <p>
          For VS-Code-class features, Monaco is the
          right embedded engine. For lighter needs
          (just syntax highlighting + basic
          editing), CodeMirror is a great alternative.
          We focus on Monaco given its feature
          completeness; the architecture applies to
          either.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement Monaco itself. We do not
          implement language servers (consumed via
          Monaco&rsquo;s LSP integration). We do not
          implement collaborative editing (Monaco
          supports it via plugins).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Text editing with cursor, selection,
          undo/redo. Syntax highlighting per language.
          Line numbers. Auto-indent. Find and replace
          (with regex). Autocomplete. Multi-cursor
          (Cmd-click). Code folding. Minimap.
          Configurable theme (light, dark, custom).
          Read-only mode. Diff view. Configurable
          font, tab size, word wrap.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Language Server Protocol integration for
          full IDE features (go-to-definition,
          rename, diagnostics, hover info).
          Bracket-pair colorization. Whitespace
          rendering. Sticky scroll. Inline error
          markers. Format on save. Vim/Emacs key
          bindings. Collaborative editing via
          plugins.
        </p>

        <h3>Out of Scope</h3>
        <p>
          File system integration, project navigation
          (use a Tree View alongside), terminal
          integration, debugging.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Typing has zero perceptible lag on files up
          to 100k lines. Syntax highlighting lazy
          (off-main where possible). Autocomplete
          dropdown opens within 50 ms. Memory bounded
          for large files.
        </p>

        <h3>Reliability</h3>
        <p>
          Undo/redo correct across all operations.
          Find-replace doesn&rsquo;t corrupt the
          document. Bracket matching accurate.
          Auto-format doesn&rsquo;t change semantics.
        </p>

        <h3>Security</h3>
        <p>
          Code is data; we don&rsquo;t execute it. The
          editor doesn&rsquo;t fetch external
          resources. LSP servers (when integrated)
          run in sandboxed workers or remote.
        </p>

        <h3>Accessibility</h3>
        <p>
          Monaco/CodeMirror provide solid
          accessibility foundations (screen-reader
          mode, keyboard parity). We don&rsquo;t
          regress them via custom styling.
        </p>

        <h3>Maintainability</h3>
        <p>
          Wrapper around Monaco/CodeMirror with a
          stable API. Language registration extensible.
          Theme tokens map to editor theme.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/code-editor-component-architecture.svg"
        alt="Code Editor Component Architecture"
        caption="Monaco / CodeMirror as the editor engine ← Language registry + Theme + Plugins (LSP, Vim, collab) → React wrapper exposing onChange, value, language. The wrapper handles lifecycle and doesn&rsquo;t leak Monaco internals to consumers."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The component wraps Monaco (or CodeMirror)
          with a React-friendly API. The wrapper
          handles editor lifecycle (mount, unmount,
          model creation), exposes the standard
          React props pattern (value, onChange,
          language), and integrates with the host
          app&rsquo;s theme and shortcuts.
        </p>
        <p>
          On <strong>mount</strong>, the wrapper imports
          Monaco lazily (it&rsquo;s a large bundle,
          ~1MB; we don&rsquo;t want it in the initial
          bundle of the host app). It instantiates an
          editor at the wrapper&rsquo;s container,
          creates a model with the initial value and
          language, attaches the theme, and registers
          event handlers. The editor renders into the
          container with all its features.
        </p>
        <p>
          <strong>Value sync</strong>: the editor&rsquo;s
          model is the source of truth for the text.
          The wrapper subscribes to model change
          events and emits onChange to the consumer.
          When the consumer updates the value prop
          externally (uncommon — usually the editor
          owns its content), the wrapper updates the
          model accordingly. We avoid the trap of
          two-way binding causing infinite loops by
          checking equality before applying external
          updates.
        </p>
        <p>
          <strong>Language registration</strong>: Monaco
          ships with many built-in languages (JavaScript,
          TypeScript, HTML, CSS, JSON, etc.). For
          custom languages, register a tokenizer or use
          the Monarch language definition syntax. The
          wrapper exposes a registration API for
          consumers.
        </p>
        <p>
          <strong>Theme</strong>: Monaco supports custom
          themes. We map host design tokens to
          Monaco theme properties (foreground,
          background, syntax token colors). Light and
          dark variants of the host theme produce
          corresponding Monaco themes. Theme switches
          (e.g. user toggles light/dark in the host)
          propagate to the editor.
        </p>
        <p>
          <strong>Autocomplete</strong>: built-in for
          standard languages; custom completion
          providers register per language. For
          LSP-backed languages, the LSP integration
          plugin connects to a language server (typically
          via WebSocket) and routes completion
          requests through it. Completion responses
          come back as ranked suggestions; Monaco
          renders the dropdown.
        </p>
        <p>
          <strong>Find and replace</strong>: built-in,
          accessed via Cmd-F. Supports regex,
          case-sensitivity, whole-word match. The find
          widget renders within the editor, doesn&rsquo;t
          require external integration.
        </p>
        <p>
          <strong>Lazy loading</strong>: dynamic import
          of Monaco. The editor renders a loading
          state until Monaco initializes. For
          language-specific assets (syntax definitions,
          worker files), lazy-load on demand. This
          keeps the host app&rsquo;s initial bundle
          small.
        </p>
        <p>
          <strong>Multi-instance</strong>: multiple
          editors on the same page share the Monaco
          environment but have independent models. We
          create a model per editor; sharing models
          across editors enables synchronized views
          when needed (split editor showing the same
          file).
        </p>
        <p>
          <strong>Diff view</strong>: Monaco includes a
          diff editor. For code review or change
          inspection, mount a diff editor instead of a
          standard editor; it shows two models
          side-by-side with diff highlighting.
        </p>
        <p>
          <strong>Custom commands and shortcuts</strong>:
          register commands via Monaco&rsquo;s API,
          bind to keyboard shortcuts. Don&rsquo;t
          conflict with browser shortcuts (the editor
          handles this for common cases). The wrapper
          exposes a hook for consumers to register
          their own commands.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>EditorWrapper</strong> is the React
          component. <strong>MonacoLoader</strong>{" "}
          handles dynamic import.
          <strong> EditorInstance</strong> manages the
          Monaco editor instance lifecycle.
          <strong> ThemeBridge</strong> maps host theme
          to Monaco theme.
          <strong> LanguageRegistry</strong> exposes
          language registration.
          <strong> CommandRegistry</strong> for custom
          commands. <strong>LSPBridge</strong> (optional
          plugin) for language server integration.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Monaco&rsquo;s model owns the text state. The
          React wrapper holds a stable ref to the
          editor instance; React doesn&rsquo;t re-render
          on text changes (that would be wasteful).
          Consumer subscribes to onChange for the
          serialized text when needed.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>value</code>,{" "}
          <code>onChange</code>,{" "}
          <code>language</code>, <code>theme</code>,
          <code> readOnly</code>,{" "}
          <code>options</code> (forwarded to Monaco).
          Optional plugins for LSP, vim, collab.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Monaco is highly optimized. Lazy loading
          keeps initial bundle small. We don&rsquo;t
          re-render React on text changes. Worker
          threads for syntax tokenization on long
          files. Memory bounded — Monaco handles
          large files efficiently.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Editor renders with familiar VS-Code
          feel. Toolbar in the host app for
          actions (run, format, save). Status bar
          for cursor position, language, indentation.
          Theme matches host. Loading state while
          Monaco initializes.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Monaco&rsquo;s accessibility mode is
          enabled by default for screen readers.
          Keyboard parity for all features.
          Focus management on mount and unmount.
          Custom UI around the editor (toolbars,
          status) accessible.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Code is data; we don&rsquo;t execute it.
          LSP servers run sandboxed (in workers or
          remote). User-entered code never causes
          XSS in the host app because Monaco
          renders it as text.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the wrapper (mount/unmount
          correctness, value sync). Integration tests
          with mocked Monaco for behavior. Visual
          regression on common languages and themes.
          Accessibility tests with screen reader
          simulators.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          External value prop changes mid-edit: we
          check equality and only update if
          different. Very large files: Monaco
          handles efficiently; we may show a
          warning above some threshold. LSP server
          disconnect: features degrade gracefully
          (no autocomplete, no diagnostics) but
          editing continues. Theme change: applies
          to live editor. Component unmounts during
          edit: editor instance disposes cleanly.
          Multiple editors: each has independent
          state.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Wrapper around Monaco is reusable
          across products. CodeMirror equivalent
          provides a lighter alternative when
          full Monaco features aren&rsquo;t
          needed. Plugins for LSP, vim, collab
          extend cleanly.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Monaco UI strings localized in many
          languages. Code content is the user&rsquo;s
          own. RTL doesn&rsquo;t apply to code (LTR
          by convention).
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Monaco vs CodeMirror vs custom</h3>
        <p>
          Monaco: full VS-Code features, large
          bundle (~1MB), used by VS Code
          itself. CodeMirror 6: lighter, modular,
          fits well for simpler editors.
          Custom: only justified for highly
          specialized needs. We default to Monaco
          for IDE-like products, CodeMirror for
          embedded snippets.
        </p>

        <h3>Lazy load vs eager</h3>
        <p>
          Eager bloats initial bundle by ~1MB.
          Lazy delays editor render but keeps
          host app fast. We always lazy with a
          loading state.
        </p>

        <h3>Controlled vs uncontrolled value</h3>
        <p>
          Fully controlled (React owns value)
          fights Monaco&rsquo;s internal model and
          causes re-render storms. Uncontrolled
          (Monaco owns, emit onChange) matches
          the framework&rsquo;s grain. We do
          uncontrolled with onChange.
        </p>

        <h3>LSP via WebSocket vs in-process</h3>
        <p>
          WebSocket scales (server-side language
          servers). In-process via Web Workers
          is faster (no network) but limited.
          For full IDE features, WebSocket; for
          basic syntax/lint, in-process workers.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          AI-assisted completion (Copilot-style).
          Real-time collaborative editing via
          plugins. Bring-your-own LSP (custom
          languages). Better mobile editing
          experience (Monaco is desktop-first).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Monaco vs CodeMirror?</strong>{" "}
          Monaco for full IDE features and
          VS-Code parity at the cost of bundle
          size. CodeMirror for lighter embedded
          snippets. Both handle text editing
          fundamentals well; choose based on
          feature needs and bundle budget.
        </p>

        <p>
          <strong>2. How is Monaco loaded?</strong>{" "}
          Lazy-loaded via dynamic import. Editor
          shows a loading state until Monaco
          initializes. Language workers also
          lazy-load.
        </p>

        <p>
          <strong>3. Why uncontrolled value?</strong>{" "}
          Monaco&rsquo;s internal model is the
          source of truth. Fully controlled would
          cause re-render storms. We let Monaco
          own value and emit onChange.
        </p>

        <p>
          <strong>4. How does theme integration
          work?</strong> Monaco supports custom
          themes. The wrapper maps host design
          tokens to Monaco theme properties.
          Theme switches propagate.
        </p>

        <p>
          <strong>5. How does LSP integration
          work?</strong> A plugin connects to a
          language server (WebSocket or in-process).
          Monaco routes completion, diagnostics,
          hover, etc. through the plugin.
        </p>

        <p>
          <strong>6. How does this scale to large
          files?</strong> Monaco handles 100k+
          line files efficiently. Worker threads
          for tokenization. Virtual scrolling for
          rendering. Built-in optimizations.
        </p>

        <p>
          <strong>7. How is accessibility
          handled?</strong> Monaco&rsquo;s
          accessibility mode for screen readers,
          keyboard parity for all features. The
          wrapper preserves this.
        </p>

        <p>
          <strong>8. When would you NOT use
          Monaco?</strong> When bundle size matters
          and only basic features are needed.
          When the product is mobile-first
          (Monaco is desktop-tuned). When custom
          rendering is required (rare).
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A code editor component embeds{" "}
          <strong>Monaco (or CodeMirror)</strong>{" "}
          with a React-friendly wrapper. Lazy
          loading keeps initial bundle small;
          uncontrolled value avoids re-render
          storms; theme bridge integrates with
          host design system; LSP plugin enables
          full IDE features. The result is
          VS-Code-class editing inside any web
          product.
        </p>
      </section>
    </ArticleLayout>
  );
}

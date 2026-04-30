"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-wysiwyg-email-builder",
  title: "Design a WYSIWYG Email Builder",
  description:
    "LLD for an email builder: drag-drop blocks, variable insertion, responsive preview, MJML/HTML output, brand themes, and mail-client compatibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "wysiwyg-email-builder",
  wordCount: 6800,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: ["lld", "email-builder", "mjml", "drag-and-drop", "react"],
  relatedTopics: [
    "rich-text-editor",
    "dashboard-builder",
    "form-builder",
  ],
};

export default function WYSIWYGEmailBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a WYSIWYG email builder — the
          tool that lets marketers and ops users compose
          emails by dragging blocks (headers, text,
          buttons, images, columns, dividers) onto a
          canvas, configuring each block&rsquo;s
          content and style, inserting personalization
          variables (<code>{`{{ firstName }}`}</code>),
          and previewing across devices. The output is
          an HTML email that renders correctly across
          the dozen-plus mail clients (Gmail, Outlook,
          Apple Mail, mobile clients) — a notoriously
          hard target because mail clients support
          radically different CSS subsets.
        </p>
        <p>
          The hard problems are: a block-based document
          model that&rsquo;s easier to author than raw
          HTML; mail-client-compatible HTML output
          (typically table-based layouts); responsive
          design that works in Outlook (which doesn&rsquo;t
          support media queries reliably) — typically
          via MJML or hand-tuned tables; variable
          interpolation with safe escaping; live
          preview across device widths and dark mode;
          and undo/redo across drag-and-drop and
          block-content edits.
        </p>

        <h3>User Context</h3>
        <p>
          End users are marketers and operations users
          composing transactional and marketing emails.
          They expect drag-and-drop fluency,
          per-block style editing, brand theme
          consistency, and reliable preview. Engineering
          teams provide the runtime; marketers compose
          and send via an integrated send pipeline.
        </p>

        <h3>Assumptions</h3>
        <p>
          The output target is HTML email; we generate
          either via MJML (the email-friendly markup
          language that compiles to robust HTML) or
          via hand-rolled table-based templates. Brand
          themes (colors, fonts, logo) come from
          configuration. Variables come from a known
          schema (recipient profile, custom fields).
          Modern browsers for the editor; the
          generated emails target mail clients with
          appropriate compatibility.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the email send pipeline.
          We do not implement complex automation (drip
          campaigns, A/B testing of subject lines).
          We do not implement subscriber list
          management.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Drag blocks from a palette onto the canvas.
          Blocks: header, text, button, image, divider,
          spacer, columns (1, 2, 3 column layouts),
          social icons, footer with unsubscribe link.
          Per-block style editing (font, color,
          padding, alignment). Variable insertion via
          a picker (<code>{`{{ firstName }}`}</code>).
          Live preview pane next to the canvas
          (desktop, tablet, mobile widths; light and
          dark mode). Reorder blocks by drag.
          Duplicate, delete blocks. Undo/redo across
          all changes. Export as HTML (MJML-generated
          or hand-rolled). Save and load drafts.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Brand theme editor (colors, fonts, default
          paddings). Section templates (pre-built
          combinations of blocks). Block templates
          (a frequently-used block saved for reuse).
          Conditional blocks (show only if a variable
          condition is met). Test send to a
          recipient. Spam-check integration. AMP for
          Email support. Image library.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Email send infrastructure, subscriber
          management, advanced personalization
          engines, automation workflows.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Drag at 60 fps. Preview updates within 200
          ms of edit. Save debounced. Loading drafts
          under 200 ms.
        </p>

        <h3>Reliability</h3>
        <p>
          Output HTML renders correctly across major
          mail clients (Gmail, Outlook, Apple Mail,
          iOS Mail, Android Gmail). Variables
          escape safely. Drafts persist reliably.
          Undo/redo never produces inconsistent
          state.
        </p>

        <h3>Security</h3>
        <p>
          User-supplied content (text, image URLs,
          links) sanitized at output. Variables
          interpolate at send time, not at edit time
          (don&rsquo;t leak template syntax into
          rendered emails). Tracking pixels and
          unsubscribe links handled by the send
          pipeline.
        </p>

        <h3>Accessibility</h3>
        <p>
          Editor is keyboard-accessible (drag has
          keyboard alternative). Blocks have
          accessible labels. Preview pane is
          accessible to screen readers (renders the
          generated HTML).
        </p>

        <h3>Maintainability</h3>
        <p>
          Block types in a registry with clean
          schemas. Output renderer separate from
          editor; swappable (MJML vs hand-rolled).
          Brand themes separate from content.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/wysiwyg-email-builder-architecture.svg"
        alt="WYSIWYG Email Builder Architecture"
        caption="Block palette → Document model (ordered list of blocks with content + style) → Canvas (drag/drop, edit) + Preview pane (responsive, dark/light) → Output renderer (MJML or hand-rolled table HTML). Variables interpolate at send time."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The builder has three main planes: a
          <strong> block-based document model</strong>{" "}
          (ordered list of blocks with content and
          style), an <strong>editor canvas</strong>{" "}
          with drag-and-drop and per-block editing, and
          an <strong>output renderer</strong> that
          translates the document into mail-client-
          compatible HTML (typically via MJML).
        </p>
        <p>
          The <strong>document model</strong> is a
          serializable JSON shape: a top-level
          email object with metadata (subject,
          preview text), a brand theme reference, and
          an ordered list of blocks. Each block has
          <code> { `{ type, id, content, style } `}</code>.
          Content is type-specific (text body, image
          URL, button label/link). Style is type-
          specific overrides on top of brand theme.
        </p>
        <p>
          The <strong>editor canvas</strong> renders
          the blocks in their authored order. Each
          block is interactive: hover shows edit
          handles, click selects for the inspector
          panel. Drag from the palette adds a new
          block; drag a block within the canvas
          reorders. Drop indicators show valid drop
          targets between blocks. The canvas
          re-renders on every edit; for performance,
          blocks memoize by (id, content, style).
        </p>
        <p>
          The <strong>inspector</strong> shows the
          selected block&rsquo;s editable
          properties. Text blocks have a rich-text
          editor (a constrained version of the
          general rich-text component, with only
          email-safe formats). Image blocks have URL
          input plus alt text. Button blocks have
          label, URL, and style. Style fields use
          color pickers, font selectors, slider
          inputs for padding and spacing.
        </p>
        <p>
          <strong>Variable insertion</strong>: a
          variable picker shows available variables
          (firstName, lastName, custom fields).
          Inserting a variable in a text block
          places a token (<code>{`{{ firstName }}`}</code>)
          in the content. The editor renders the
          token as a styled chip while editing; the
          output preserves the token literally for
          the send pipeline to interpolate.
        </p>
        <p>
          The <strong>preview pane</strong> renders
          the current document via the output
          renderer. We toggle between desktop,
          tablet, and mobile widths (640 px, 480 px,
          320 px typically). Dark mode toggle
          previews dark-mode appearance (some mail
          clients invert; some respect prefers-
          color-scheme; the renderer accommodates
          both). Variables show with placeholder
          values during preview (typically the
          variable name in brackets) so the
          designer can see how text flows.
        </p>
        <p>
          The <strong>output renderer</strong> is the
          most challenging part. Mail clients
          support different CSS subsets — Outlook
          notoriously uses Word&rsquo;s rendering
          engine, which doesn&rsquo;t support
          flexbox or grid. The standard solution is
          to generate table-based HTML: tables for
          layout (yes, in 2026; mail clients haven&rsquo;t
          modernized), inline styles for everything
          (because Gmail strips
          <code> {`<style>`}</code> blocks
          aggressively), and conditional comments
          for Outlook-specific overrides. MJML is a
          markup language that abstracts these
          concerns: write semantic MJML, get
          mail-client-compatible HTML out. We
          recommend MJML where possible; hand-rolled
          tables for the cases MJML doesn&rsquo;t
          cover.
        </p>
        <p>
          <strong>Brand themes</strong> are
          configuration: primary color, secondary
          color, heading font, body font, default
          paddings, button styles. The renderer
          consumes the theme; blocks can override
          per-instance. Editing the theme reflects
          across all blocks that don&rsquo;t override.
        </p>
        <p>
          <strong>Undo/redo</strong>: command-pattern
          stack same as in the spreadsheet and
          inline editing systems. Each edit (block
          add, reorder, content change, style
          change) is a command with apply/undo.
        </p>
        <p>
          <strong>Persistence</strong>: drafts save
          debounced to the server. The shape is the
          serialized JSON document. On load,
          deserialize and render. Schema versioning
          handles evolution.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>BuilderProvider</strong> instantiates
          document state, undo/redo, theme.
          <strong> Palette</strong> renders draggable
          block types. <strong>Canvas</strong>{" "}
          renders blocks with edit handles.
          <strong> Block</strong> renders one block
          with selection state.
          <strong> Inspector</strong> renders edit
          controls for the selected block.
          <strong> PreviewPane</strong> renders the
          generated HTML in an iframe at responsive
          widths. <strong>OutputRenderer</strong>{" "}
          translates document to MJML or HTML.
          <strong> ThemeEditor</strong> manages
          brand theme. <strong>VariablePicker</strong>{" "}
          inserts variables.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Document, selection, undo stack, theme — all
          in external store. Palette, inspector,
          preview subscribe via selectors.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Document shape:{" "}
          <code>{` { id, version, subject, preview, theme, blocks: [...] } `}</code>.
          Block shape:{" "}
          <code>{` { id, type, content, style? } `}</code>.
          Output: HTML or MJML string. Variables
          schema:{" "}
          <code>{` { name, type, defaultValue } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Memoized block renders. Preview iframe
          updates throttled. Drag uses pointer events
          with RAF-aligned updates. Save debounced.
          Output rendering on demand (not on every
          edit; on save and on preview).
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Three-pane layout: palette on left, canvas
          in middle, inspector on right. Preview
          toggle. Device width buttons. Dark mode
          toggle. Variable picker as a popover from
          text editors. Drop indicators during drag.
          Empty canvas shows a guide
          (&ldquo;Drag a block here&rdquo;).
          Save status indicator. Test send button.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Drag has keyboard alternative (focus a
          block, Cut, navigate, Paste). Inspector
          controls are real form fields. Preview
          renders accessible HTML. Block selection
          announces.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          User-entered URLs validated (no
          <code> javascript:</code> URLs). User-
          entered HTML in text blocks sanitized.
          Variables interpolate at send time only,
          not at preview time (preview shows
          placeholders). Tracking and unsubscribe
          links are handled by the send pipeline,
          not stored in the document.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the document model
          (add, reorder, edit), the renderer (output
          matches expected HTML for known
          documents). Visual regression tests of
          rendered output across mail clients
          (using tools like Litmus or Email on
          Acid). Drag-and-drop tests. Undo/redo
          tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Block with very long content: editor allows
          but warns if approaching mail-client size
          limits. Image without alt text: warn (a11y
          and rendering concerns). Variable referenced
          but not in schema: warn. Malformed user
          link: prompt to confirm. Outlook-specific
          rendering bug (e.g. button line-height):
          handled by the renderer&rsquo;s known
          quirks. Dark mode rendering: preview shows
          accurately; user can adjust per-block. Test
          send fails (invalid recipient): surface
          the error. Concurrent edits across tabs:
          broadcast warns; user reloads.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Block registry extensible. Themes
          per-product. The renderer can target
          different output formats (MJML, hand-rolled,
          AMP). The pattern (document model + canvas
          + preview + renderer) reuses across other
          composer products (landing pages, push
          notifications).
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Email content is the
          marketer&rsquo;s own language;
          variables can localize per recipient at
          send time. RTL support requires per-block
          direction config plus the renderer
          handling RTL tables.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>MJML vs hand-rolled tables</h3>
        <p>
          MJML abstracts mail-client quirks; output
          is robust. Hand-rolled gives finer
          control but requires deep mail-client
          expertise. We default to MJML and fall
          back to hand-rolled for cases MJML doesn&rsquo;t
          cover.
        </p>

        <h3>Live preview vs on-demand</h3>
        <p>
          Live preview reassures designers; on-demand
          is faster but breaks the WYSIWYG
          promise. We do live preview throttled to
          ~5 fps so it doesn&rsquo;t lag behind.
        </p>

        <h3>iframe preview vs inline</h3>
        <p>
          iframe sandboxes the preview HTML from
          the parent app&rsquo;s CSS. Inline would
          let parent CSS leak. We always use
          iframe for preview.
        </p>

        <h3>Schema validation at edit vs send</h3>
        <p>
          At edit: catches errors early. At send:
          catches everything before delivery. We
          do both; edit catches obvious issues,
          send is the authoritative gate.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          AMP for Email support (interactive emails).
          AI-generated content (subject lines, body
          variations). A/B testing of subject lines.
          Dynamic content blocks based on recipient
          attributes. Spam score integration.
          Real-time collaborative editing.
          Cross-channel (email + push + SMS) unified
          composer.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why MJML?</strong> Mail clients
          render HTML inconsistently; tables and
          inline styles are required. MJML
          abstracts these concerns: write
          semantic MJML, get robust output. It
          handles Outlook quirks, Gmail rules,
          mobile responsiveness, and dark mode.
        </p>

        <p>
          <strong>2. How does live preview work?</strong>{" "}
          Render the document to HTML/MJML, set as
          srcdoc on a sandboxed iframe at the
          chosen device width. Throttle updates to
          avoid stuttering on rapid edits.
        </p>

        <p>
          <strong>3. How are variables handled?</strong>{" "}
          Inserted as tokens
          (<code>{`{{ firstName }}`}</code>). At
          edit time, render as styled chips. At
          preview time, render placeholder values.
          Interpolation happens at send time
          server-side.
        </p>

        <p>
          <strong>4. How does responsive preview
          work?</strong> Set the iframe width to
          desktop (640 px), tablet (480 px), or
          mobile (320 px). The output HTML uses
          MJML&rsquo;s responsive primitives so
          layout adapts.
        </p>

        <p>
          <strong>5. How is undo/redo
          implemented?</strong> Command-pattern
          stack. Each edit is a command with
          apply/undo. Stack pushes on commit;
          undo pops and applies inverse.
        </p>

        <p>
          <strong>6. How is dark mode handled?</strong>{" "}
          Mail clients vary — some auto-invert,
          some respect prefers-color-scheme. The
          renderer outputs styles that work for
          both via the
          <code> @media (prefers-color-scheme: dark)</code>{" "}
          rule for clients that support it, and
          color schemes that look good when
          inverted for those that don&rsquo;t.
        </p>

        <p>
          <strong>7. How is the output
          tested?</strong> Tools like Litmus and
          Email on Acid render the output across
          dozens of mail clients and produce
          screenshots. Visual regression tests
          alert on changes. Internal test sends
          to QA accounts.
        </p>

        <p>
          <strong>8. How does this differ from a
          regular page builder?</strong> Email
          rendering is constrained by mail-client
          quirks (table-based layouts, inline
          styles, Outlook&rsquo;s Word renderer).
          Page builders target browsers, which
          support modern CSS. The block model is
          similar; the output renderer is
          dramatically different.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A WYSIWYG email builder is a{" "}
          <strong>block-based document model + drag-
          drop canvas + responsive preview +
          mail-client-compatible output renderer</strong>{" "}
          (MJML or hand-rolled tables). Brand themes
          parameterize visual style. Variables
          interpolate at send time. The result is
          marketers composing branded, reliable
          emails without writing HTML.
        </p>
      </section>
    </ArticleLayout>
  );
}

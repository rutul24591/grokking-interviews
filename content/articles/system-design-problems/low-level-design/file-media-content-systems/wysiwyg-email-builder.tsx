"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
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

export default function WYSIWYGEmailBuilderArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a WYSIWYG Email Builder</h1><h2>Definition &amp; Context</h2><p>Design a WYSIWYG Email Builder is an implementation-heavy low-level design problem covering block schema, drag layout, style allowlist, template versioning, variable substitution, deterministic HTML compilation, client preview, and test send. A principal-level answer must explain state ownership, browser or worker boundaries, scale limits, consistency, rollback, privacy, cost, and observability.</p><p>Treat the block schema as durable truth. Canvas DOM, generated email HTML, plaintext output, and client previews are disposable projections. The core structures are block tree, stable block ids, style whitelist, variable registry, schema version, undo journal, renderer version, compatibility warnings, preview cache, and receipt.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/file-media-content-systems/wysiwyg-email-builder-runtime.svg" alt="Design a WYSIWYG Email Builder runtime" caption="Topic-specific runtime from source intake through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users are marketers and operations users
          composing transactional and marketing emails.
          They expect drag-and-drop fluency,
          per-block style editing, brand theme
          consistency, and reliable preview. Engineering
          teams provide the runtime; marketers compose
          and send via an integrated send pipeline.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the email send pipeline.
          We do not implement complex automation (drip
          campaigns, A/B testing of subject lines).
          We do not implement subscriber list
          management.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Brand theme editor (colors, fonts, default
          paddings). Section templates (pre-built
          combinations of blocks). Block templates
          (a frequently-used block saved for reuse).
          Conditional blocks (show only if a variable
          condition is met). Test send to a
          recipient. Spam-check integration. AMP for
          Email support. Image library.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Email send infrastructure, subscriber
          management, advanced personalization
          engines, automation workflows.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Drag at 60 fps. Preview updates within 200
          ms of edit. Save debounced. Loading drafts
          under 200 ms.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="crucial">
          Output HTML renders correctly across major
          mail clients (Gmail, Outlook, Apple Mail,
          iOS Mail, Android Gmail). Variables
          escape safely. Drafts persist reliably.
          Undo/redo never produces inconsistent
          state.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          User-supplied content (text, image URLs,
          links) sanitized at output. Variables
          interpolate at send time, not at edit time
          (don&rsquo;t leak template syntax into
          rendered emails). Tracking pixels and
          unsubscribe links handled by the send
          pipeline.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="important">
          Editor is keyboard-accessible (drag has
          keyboard alternative). Blocks have
          accessible labels. Preview pane is
          accessible to screen readers (renders the
          generated HTML).
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Block types in a registry with clean
          schemas. Output renderer separate from
          editor; swappable (MJML vs hand-rolled).
          Brand themes separate from content.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
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
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Variable insertion</strong>: a
          variable picker shows available variables
          (firstName, lastName, custom fields).
          Inserting a variable in a text block
          places a token (<code>{`{{ firstName }}`}</code>)
          in the content. The editor renders the
          token as a styled chip while editing; the
          output preserves the token literally for
          the send pipeline to interpolate.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          <strong>Persistence</strong>: drafts save
          debounced to the server. The shape is the
          serialized JSON document. On load,
          deserialize and render. Schema versioning
          handles evolution.
        </HighlightBlock>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> Inspector</strong></Highlight> renders edit
          controls for the selected block.
          <strong> PreviewPane</strong> renders the
          generated HTML in an iframe at responsive
          widths.</HighlightBlock>
<HighlightBlock as="p" tier="crucial"><strong>OutputRenderer</strong>{" "}
          translates document to MJML or HTML.
          <strong> ThemeEditor</strong> manages
          brand theme. <strong>VariablePicker</strong>{" "}
          inserts variables.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Document, selection, undo stack, theme <Highlight tier="important">— all
          in external store. Palette,</Highlight> inspector,
          preview subscribe via selectors.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">Document shape:{" "}
          <code>{` { id, version, subject, preview, theme, blocks: [...] } `}</code>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Block shape:{" "}
          <code>{` { id, type, content, style? } `}</code>.
          Output: HTML</HighlightBlock>
<HighlightBlock as="p" tier="important">or MJML string. Variables
          schema:{" "}
          <code>{` { name, type, defaultValue } `}</code>.</HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Memoized block renders. Preview iframe
          updates throttled. Drag uses pointer events
          <Highlight tier="important">with RAF-aligned updates. Save debounced.
          Output</Highlight> rendering on demand (not on every
          edit; on save and on preview).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Variable picker as a popover from
          text editors. Drop indicators during drag.
          Empty canvas</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">shows a guide
          (&ldquo;Drag a block here&rdquo;).
          Save status indicator. Test send button.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Drag has keyboard alternative (focus a
          block, Cut, <Highlight tier="important">navigate, Paste). Inspector
          controls are real</Highlight> form fields. Preview
          renders accessible HTML. Block selection
          announces.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">Variables interpolate at send time only,
          not at preview time (preview shows
          placeholders).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Tracking and unsubscribe
          links are handled by the send pipeline,
          not stored in the document.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Visual regression tests of
          rendered output across mail clients
          (using</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">tools like Litmus or Email on
          Acid). Drag-and-drop tests. Undo/redo
          tests.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">button line-height):
          handled by the renderer&rsquo;s known
          quirks. Dark mode rendering: preview shows
          accurately; user can adjust</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">per-block. Test
          send fails (invalid recipient): surface
          the error. Concurrent edits across tabs:
          broadcast warns; user reloads.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">The pattern (document model + canvas
          + preview + renderer) reuses across</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">other
          composer products (landing pages, push
          notifications).</HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">UI strings via i18n. Email content is the
          marketer&rsquo;s own language;</HighlightBlock>
<HighlightBlock as="p" tier="important">variables can localize per recipient at
          send time. RTL support requires</HighlightBlock>
<HighlightBlock as="p" tier="important">per-block
          direction config plus the renderer
          handling RTL tables.</HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>MJML vs hand-rolled tables</h3>
        <HighlightBlock as="p" tier="important">
          MJML abstracts mail-client quirks; output
          is robust. Hand-rolled gives finer
          control but requires deep mail-client
          expertise. We default to MJML and fall
          back to hand-rolled for cases MJML doesn&rsquo;t
          cover.
        </HighlightBlock>

        <h3>Live preview vs on-demand</h3>
        <HighlightBlock as="p" tier="crucial">
          Live preview reassures designers; on-demand
          is faster but breaks the WYSIWYG
          promise. We do live preview throttled to
          ~5 fps so it doesn&rsquo;t lag behind.
        </HighlightBlock>

        <h3>iframe preview vs inline</h3>
        <HighlightBlock as="p" tier="important">
          iframe sandboxes the preview HTML from
          the parent app&rsquo;s CSS. Inline would
          let parent CSS leak. We always use
          iframe for preview.
        </HighlightBlock>

        <h3>Schema validation at edit vs send</h3>
        <HighlightBlock as="p" tier="important">
          At edit: catches errors early. At send:
          catches everything before delivery. We
          do both; edit catches obvious issues,
          send is the authoritative gate.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Dynamic content blocks based on recipient
          attributes. Spam score integration.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Real-time collaborative editing.
          Cross-channel (email + push + SMS) unified
          composer.</Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable source data, transient interaction state, derived render state, remote or worker effects, and bounded telemetry. Every object URL, request, worker, listener, timer, cache entry, and decoder task needs an explicit owner and cleanup path.</p><p>Treat the block schema as durable truth. Canvas DOM, generated email HTML, plaintext output, and client previews are disposable projections. Commit durable changes only after policy validation and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/file-media-content-systems/wysiwyg-email-builder-recovery.svg" alt="Design a WYSIWYG Email Builder recovery" caption="Recovery flow: classify failure, preserve stable state, and degrade predictably." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Raw HTML editing is flexible but unsafe; a block schema is justified for non-technical users and predictable output across hostile clients.</p><p>Published templates are immutable versions. Draft schemas autosave by version; compilation is deterministic for a renderer version while delivery remains external. Scale pressure comes from large templates, nested blocks, unsafe markup, missing variables, Outlook quirks, schema migration, images, and client rendering divergence. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only when rollback is deterministic and visible. Keep authorization, validation, and destructive actions server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed states, generation guards, bounded queues, abortable effects, semantic HTML, and idempotent cleanup. Test accessibility, stale work, retries, unmount, constrained devices, large files, and corrupted input.</p><p>Measure latency, memory, queue pressure, stale drops, retries, fallbacks, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: untrusted content, consistency, and cost</h3><p>Treat file bytes, markup, document metadata, decoded assets, and generated HTML as untrusted input. Keep the durable document or upload receipt separate from previews, render windows, worker results, and optimistic UI state. Every asynchronous result carries a session, generation, document version, or checksum so late work can be ignored. Recovery restores the last committed projection and retries only the missing or invalid unit.</p><p>Bound memory, decode work, concurrent chunks, cache size, preview dimensions, render tasks, and retry budgets. Validate content type server-side, sanitize rendered markup, enforce authorization on document access, and avoid exposing private filenames or content in telemetry. Observe queue depth, checksum mismatch, stale-result rejection, cancellation, memory pressure, fallback use, and recovery completion.</p><h3>Abuse controls and trade-off defense</h3><p>Abuse controls must reject oversized payloads, decompression bombs, pathological documents, unsafe markup, excessive retries, and decode or render work that exceeds budget. The trade-off is fidelity and immediacy versus bounded resource use: preserve inspectable, authorized content while degrading preview quality, concurrency, or background work before allowing memory, CPU, or network pressure to destabilize the client.</p><section><h2>Common Pitfalls</h2><p>Common failures include treating rendered output as durable truth, leaking resources, accepting stale worker completion, unbounded prefetch, and hiding degraded behavior.</p><p>For this topic, reject unsupported nesting, sanitize paste, require defaults, surface client warnings, preserve valid drafts, and roll back publication by version. Validate untrusted content, authorize durable mutations, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to content-heavy product surfaces where browser APIs, workers, networks, and remote policy fail independently. Reuse the controller boundary while injecting product-specific fallback and retention policy.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Treat the block schema as durable truth. Canvas DOM, generated email HTML, plaintext output, and client previews are disposable projections.</p><h3>What breaks at scale?</h3><p>large templates, nested blocks, unsafe markup, missing variables, Outlook quirks, schema migration, images, and client rendering divergence. I would bound work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Published templates are immutable versions. Draft schemas autosave by version; compilation is deterministic for a renderer version while delivery remains external.</p><h3>How do you recover?</h3><p>I would reject unsupported nesting, sanitize paste, require defaults, surface client warnings, preserve valid drafts, and roll back publication by version.</p><h3>Why this architecture?</h3><p>Raw HTML editing is flexible but unsafe; a block schema is justified for non-technical users and predictable output across hostile clients.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank" rel="noreferrer">MDN Web Workers API</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}

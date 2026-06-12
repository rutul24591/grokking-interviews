"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-wysiwyg-email-builder",
  title: "Design a WYSIWYG Email Template Builder",
  description:
    "Email builder with block schema, template store, MJML/table-based rendering, variable insertion, Outlook fallbacks, and multi-client preview.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "wysiwyg-email-builder",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "email-builder", "wysiwyg", "MJML", "drag-drop", "Outlook", "variable-substitution"],
  relatedTopics: ["rich-text-editor", "dashboard-builder", "form-builder"],
};

export default function ArticlePage(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a WYSIWYG Email Builder</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a WYSIWYG Email Template Builder around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design a WYSIWYG Email Builder is an implementation-heavy low-level design problem covering block schema editing, drag layout, template versioning, variable substitution, HTML compilation, email-client compatibility, preview, and test-send. A principal-level answer must define state ownership, durable boundaries, lifecycle cleanup, degraded behavior, privacy, cost, and observability.</p><p>Treat the block schema as the durable source. Editor canvas DOM, generated HTML, plaintext fallback, and client previews are disposable projections from a validated template version. The core structures are block tree, stable block ids, style whitelist, variable registry, schema version, undo journal, renderer target, compatibility warnings, preview cache, and test-send receipt.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/wysiwyg-email-builder-runtime.svg" alt="Design a WYSIWYG Email Builder runtime" caption="Topic-specific runtime stages from user intent through durable projection." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a WYSIWYG Email Template Builder, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><p>
        Email template builders occupy a unique architectural niche: the visual editor
        runs as a modern React SPA, but the output must be rendered correctly by email
        clients whose HTML/CSS support ranges from Gmail's inline-style-only model to
        Outlook's Word-based renderer that uses table layouts from the early 2000s.
        Building a production email builder requires deep knowledge of email client
        quirks, a block-based content schema that maps to email-safe HTML, a variable
        substitution engine, and a multi-client preview system.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/wysiwyg-email-builder-architecture.svg"
        alt="WYSIWYG email builder architecture diagram"
        caption="Email builder architecture: block schema, template store, MJML rendering, variable engine and preview"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        The scope of an email template builder varies from a simple text editor with
        color options to a full drag-and-drop block editor with multi-column layouts,
        dynamic content, and A/B test variants.
      </p>
      <p>
        <strong>Block-based or freeform?</strong> Block-based builders (like Mailchimp,
        Klaviyo) restrict the user to predefined content blocks (text, image, button,
        divider, columns) arranged in a vertical stack. Freeform builders allow arbitrary
        HTML editing. Block-based is significantly easier to build and ensures the output
        is always valid email HTML; freeform gives unlimited flexibility but requires
        educating users about email HTML constraints.
      </p>
      <p>
        <strong>Variable substitution?</strong> Marketing emails include personalization
        variables — the recipient's first name, their recent purchase, a personalized
        discount code. The template editor must allow inserting these variables in a
        way that is visually clear (placeholder text in the editor) and correctly
        rendered in the final HTML (replaced by the email sending platform's merge
        tags (e.g., a first_name variable syntax or *|FNAME|* for Mailchimp).
      </p>
      <p>
        <strong>Multi-client preview?</strong> Rendering the same template in
        Apple Mail, Gmail, Outlook, and mobile email clients reveals differences in
        how each client interprets CSS and HTML. A preview system that shows the
        template in multiple simulated clients catches issues before sending.
      </p>

      <h3>The Block Schema</h3>
      <p>
        The template is stored as a tree of block objects — a JSON document that is
        the source of truth for both the editor's visual representation and the HTML
        render output. This separation (JSON schema as intermediate representation)
        is what makes it possible to render the same template to both a React preview
        and an email-safe HTML string.
      </p>
      <p>
        The block hierarchy: a template root contains an ordered array of section blocks.
        Each section block contains an ordered array of column groups. Each column group
        contains an ordered array of content blocks. Content blocks are leaf nodes:
        text, image, button, spacer, divider, or custom HTML.
      </p>
      <p>
        Each block has a type, a unique ID (for React keying and undo tracking), a set
        of style properties (background color, padding, font properties), and type-specific
        content properties (a text block has a body property with rich text content; an
        image block has src, alt, link, and width; a button block has label, link, and
        style properties).
      </p>
      <HighlightBlock as="p" tier="crucial">
        The block schema should be version-stamped. When the schema changes (new block
        types are added, existing properties are renamed), templates created under old
        schema versions must still render correctly. Implement a schema migration layer:
        on load, read the template's schemaVersion, apply any migrations for versions
        between that and the current version in sequence, and save the upgraded template.
        Without this, old templates become unrenderable as the schema evolves.
      </HighlightBlock>

      <h3>The Editor Canvas</h3>
      <p>
        The editor canvas renders the block tree as an interactive layout. Each block
        is represented by a React component in the canvas with hover and selection
        overlays. Clicking a block selects it; the right-hand properties panel shows
        the selected block's editable properties.
      </p>
      <p>
        Block reordering via drag and drop: blocks within a section can be reordered
        by dragging. The HTML5 Drag and Drop API is possible but limited on mobile.
        A better approach is pointer events with a drag state: on pointerdown, start
        a drag; on pointermove, show a drag ghost and compute the drop target position;
        on pointerup, commit the reorder. The reorder is a mutation to the block tree:
        remove the dragged block from its current position and insert it at the target
        position. This dispatches to the undo stack as a reorder command.
      </p>
      <p>
        Adding blocks: the left panel shows a block palette. The user drags a block
        type from the palette to the canvas, or clicks a "+" button between existing
        blocks to insert a new one. The insert position is an index into the section's
        block array. New blocks are initialized with default properties for their type.
      </p>
      <p>
        Inline text editing: text blocks use a contenteditable div (or a rich text
        editor library like Tiptap/Slate) for inline editing. The rich text content
        is stored as a simple document model (paragraphs with inline marks: bold,
        italic, link, font size, color). The text editor must restrict features to
        what email clients support — no CSS flexbox, no custom web fonts (web fonts
        load in browsers but not in email clients; use system fonts or Google Fonts
        with a font-face fallback chain).
      </p>

      <h3>Email HTML Rendering</h3>
      <p>
        Converting the block JSON to email-safe HTML is the most technically challenging
        part of the builder. Email clients do not support: CSS flexbox or grid, CSS
        custom properties (variables), external stylesheets, most CSS selectors beyond
        basic element and class selectors, many CSS properties, and SVG. They do support:
        inline styles, table-based layouts, basic font properties, and background colors.
      </p>
      <p>
        MJML (Mailjet Markup Language) solves this by providing a higher-level XML
        dialect that compiles to email-safe HTML tables. An mj-section with two
        mj-columns compiles to a table with two td elements, with the appropriate
        VML (Vector Markup Language) fallback for Outlook. Using MJML as the compilation
        target means the builder only needs to generate MJML from the block schema,
        then call the MJML compiler to produce the final HTML. MJML handles all
        the email client quirks.
      </p>
      <p>
        For a custom renderer without MJML: multi-column layouts require nested HTML
        tables (table-tr-td for each column). Each td needs inline styles for
        width, padding, and vertical-align. Buttons require a VML fallback for Outlook
        (Outlook ignores background colors on anchor elements; the fix is a VML
        rectangle with a fill, with the anchor nested inside using conditional comments).
        Background images in sections also require VML for Outlook.
      </p>

      <h3>Outlook Compatibility</h3>
      <p>
        Outlook on Windows (2013–2019) uses the Microsoft Word HTML renderer, which
        is approximately a decade behind web standards. The key quirks:
      </p>
      <p>
        Background images: Outlook ignores CSS background-image on most elements.
        The workaround uses VML (Vector Markup Language) wrapped in conditional comments
        that only Outlook renders. The VML fill element specifies the background image.
        Other email clients ignore the VML. MJML generates this automatically.
      </p>
      <p>
        Padding and margins: Outlook has inconsistent support for padding on anchor
        elements and non-table elements. The safe approach: use td elements for
        spacing, not divs with margin. For button styling, the CTA (call-to-action)
        button pattern uses a td with a background color, with the anchor element
        filling the full td, padded by the td's own padding.
      </p>
      <p>
        Font rendering: Outlook uses Windows GDI for font rendering, which produces
        different font metrics than browser font rendering. Line heights may differ
        by several pixels. Test with real fonts and set explicit mso-line-height-rule:
        exactly in Outlook-specific styles to prevent Outlook from adding its own
        leading.
      </p>

      <h3>Variable Substitution Engine</h3>
      <p>
        Variables in email templates are placeholders replaced at send time by the
        email platform with recipient-specific values. Common syntax: Handlebars-style
        double-brace (e.g., firstName), Liquid (contact.firstName), or platform-specific
        merge tags (*|FNAME|* for Mailchimp).
      </p>
      <p>
        In the editor, variables are shown as highlighted inline chips with a
        human-readable label ("First Name") rather than raw syntax. Internally, the
        text block's rich text model stores variables as special marks or inline nodes
        with a variableKey property. When rendering to HTML, these inline nodes are
        serialized to the correct platform-specific syntax.
      </p>
      <p>
        The variable registry is a configurable list of available variables, each with
        a key, a display label, and an optional fallback value (used if the variable
        is undefined for a recipient). The editor's variable picker (triggered by typing
        "/" or clicking an "Insert variable" button) shows the registry list filtered
        by a search query. Selecting a variable inserts it at the cursor position in
        the text block.
      </p>
      <HighlightBlock as="p" tier="important">
        Preview mode should render the template with test variable values substituted,
        not the raw syntax. Maintain a "preview data" object with test values for each
        variable. The preview renderer walks the block tree, finds variable references
        in text blocks, and replaces them with the corresponding test values. This lets
        designers see a realistic preview without needing actual recipient data. The
        preview data is not persisted with the template; it is session-scoped.
      </HighlightBlock>

      <h3>Template Store and Versioning</h3>
      <p>
        Templates are persisted to a backend store (a database record with the block
        JSON, metadata, and schema version). The builder auto-saves on a debounced
        timer (typically 2–5 seconds after the last edit) with a visible "Saving..."
        indicator. Auto-save sends a PATCH request to the template's API endpoint.
      </p>
      <p>
        Template versioning: each save creates a new version entry. The version history
        panel shows a timeline of saves, with the ability to preview and restore any
        version. The diff between versions is computed by comparing the block JSON
        trees — a structural diff that identifies added, removed, or modified blocks
        and their properties.
      </p>
      <p>
        Template duplication and library: the template library shows all saved templates
        with thumbnail previews (generated by rendering the template HTML in a hidden
        iframe and capturing a screenshot via html2canvas or a server-side headless
        renderer). Users can duplicate templates to use as starting points.
      </p>

      <h3>Multi-Client Preview</h3>
      <p>
        Rendering the template in multiple email clients requires either actual email
        client rendering (using a service like Litmus or Email on Acid that sends the
        HTML to real devices) or simulation (rendering in a browser iframe with client-
        specific CSS overrides). For a production tool, the service approach is more
        accurate. For a self-hosted approach, render in an iframe with reset stylesheets
        that simulate each client's CSS baseline.
      </p>
      <p>
        The preview panel shows the rendered HTML in iframes at different widths: full
        desktop (600px wide content, email best practice), mobile (320px), and tablet.
        The iframe's srcdoc attribute is set to the rendered HTML. CSS within the iframe
        is sandboxed from the builder's own styles.
      </p>
      <p>
        Dark mode preview: many email clients now support dark mode via @media
        (prefers-color-scheme: dark) or by inverting colors. The preview panel should
        include a dark mode toggle that applies the prefers-color-scheme override to
        the preview iframe, showing how the template will look for dark mode users.
        Email templates should include explicit @media dark mode overrides for key
        colors rather than relying on client-specific inversion.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Normalize input before applying typed transitions. Separate draft, preview, committed state, derived projection, integration effects, and bounded telemetry. Every timer, listener, observer, request, worker, and persisted preference needs an explicit owner and cleanup path.</p><p>Treat the block schema as the durable source. Editor canvas DOM, generated HTML, plaintext fallback, and client previews are disposable projections from a validated template version. Commit only after the current policy gate succeeds and retain enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/wysiwyg-email-builder-recovery.svg" alt="Design a WYSIWYG Email Builder recovery decisions" caption="Recovery flow: invalidate obsolete work, preserve recoverable state, and explain the outcome." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>A raw HTML editor is flexible but unsafe; a block schema is justified when non-technical users need predictable output across hostile email clients.</p><p>Published template versions are immutable. Draft schemas are versioned; HTML compilation is deterministic per renderer version, while provider delivery remains an external effect. The scale risks are large templates, nested layout, Outlook quirks, unsafe HTML, missing variables, schema migration, image loading, and rendering differences across clients. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic transitions only when rollback is deterministic and understandable. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use stable ids, typed events, explicit state unions, versioned persistence, generation guards, SSR-safe feature checks, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, retries, restoration, and constrained devices.</p><p>Measure transition latency, blocked actions, stale drops, rollbacks, cache pressure, retry exhaustion, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include mixing draft and commit, trusting arrival order, leaking resources, accepting obsolete async completion, and hiding rollback from the user.</p><p>For this topic, reject unsupported nesting, sanitize pasted markup, preserve the last valid draft, surface compatibility warnings, require variable defaults, and roll back publication by template version. Validate untrusted input, authorize durable mutations server-side, and bound resource usage.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This runtime applies to repeated workflows where browser, persistence, and policy boundaries can fail independently. Reuse the controller structure while injecting product-specific policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>How do you model state?</h3><p>Treat the block schema as the durable source. Editor canvas DOM, generated HTML, plaintext fallback, and client previews are disposable projections from a validated template version.</p><h3>What breaks at scale?</h3><p>large templates, nested layout, Outlook quirks, unsafe HTML, missing variables, schema migration, image loading, and rendering differences across clients. I would bound expensive work and cancel obsolete effects.</p><h3>What consistency model applies?</h3><p>Published template versions are immutable. Draft schemas are versioned; HTML compilation is deterministic per renderer version, while provider delivery remains an external effect.</p><h3>How do you recover?</h3><p>I would reject unsupported nesting, sanitize pasted markup, preserve the last valid draft, surface compatibility warnings, require variable defaults, and roll back publication by template version.</p><h3>Why this architecture?</h3><p>A raw HTML editor is flexible but unsafe; a block schema is justified when non-technical users need predictable output across hostile email clients.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li></ul></section>
</ArticleLayout>}

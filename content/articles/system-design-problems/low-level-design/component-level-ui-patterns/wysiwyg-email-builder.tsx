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

export default function WYSIWYGEmailTemplateBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
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

      <h2>Clarifying the Requirements</h2>
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

      <h2>The Block Schema</h2>
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

      <h2>The Editor Canvas</h2>
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

      <h2>Email HTML Rendering</h2>
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

      <h2>Outlook Compatibility</h2>
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

      <h2>Variable Substitution Engine</h2>
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

      <h2>Template Store and Versioning</h2>
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

      <h2>Multi-Client Preview</h2>
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
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: Why use a JSON block schema as the intermediate representation rather than editing HTML directly?</h3>
      <p>
        Direct HTML editing exposes all the complexity of email HTML constraints to
        the user (table layouts, inline styles, VML for Outlook). A block schema
        abstracts these constraints: the user works with semantic blocks (text, image,
        button), and the renderer handles translating those to email-safe HTML. The
        schema is also easier to validate, version, and migrate than arbitrary HTML.
        It enables future renderers — the same schema could render to SMS templates,
        push notification content, or a different HTML format — without changing the
        editor. It also makes undo/redo straightforward: each edit is a mutation to
        the JSON tree, and undo is reversing that mutation.
      </p>

      <h3>Q: How do you handle the Outlook VML fallback for background images in the block renderer?</h3>
      <p>
        The section block renders conditional comments (only visible to Outlook's HTML
        parser) containing VML markup. The VML consists of a v:rect element with a
        v:fill child specifying the image source, sized to match the section dimensions.
        The actual HTML content (the inner table) is nested inside the VML using an
        absolute-positioned div. Non-Outlook clients see only the CSS background-image
        property on the outer td or div. The HTML output structure is: opening Outlook
        conditional comment, VML rectangle opening, inner content table, VML rectangle
        closing, end conditional comment, then the same inner content wrapped in a non-
        Outlook conditional comment (so Outlook does not render it twice). MJML
        generates all this boilerplate automatically from the section's backgroundUrl
        property.
      </p>

      <h3>Q: How would you implement real-time collaborative editing in the email builder?</h3>
      <p>
        The block tree JSON is well-suited for operational transforms (OT) or CRDT
        merging. Each operation on the tree is a typed command: insertBlock(parentId,
        index, blockData), removeBlock(id), updateBlockProperty(id, propertyPath,
        value), and reorderBlock(id, newIndex). These operations are designed to be
        commutative where possible (two users editing different blocks have independent
        changes that merge cleanly). Conflicts (two users editing the same text block
        simultaneously) are resolved using Yjs — a CRDT library that handles concurrent
        text edits with character-level granularity. The Yjs document represents the
        text content of each text block; the block tree structure is managed with
        simpler last-write-wins semantics for non-text properties. Real-time sync
        is delivered via WebSocket; the server broadcasts operations to all connected
        collaborators.
      </p>

      <h3>Q: How do you validate that the exported HTML will render correctly in Gmail?</h3>
      <p>
        Gmail strips all CSS styles that are not inlined. It also strips head elements
        and external stylesheets. The HTML renderer must inline all styles before export:
        walk the generated HTML, for each element collect all applicable CSS rules
        (from head styles, if any), and merge them into the element's style attribute
        as inline styles. Libraries like juice (Node.js) automate this. After inlining,
        run the output through a validator that checks for known Gmail-incompatible
        patterns: CSS properties not supported by Gmail (border-radius on table cells —
        stripped by Gmail), id attributes (Gmail prefixes them, breaking any CSS id
        selectors), and JavaScript (always stripped). The validator produces a report
        of issues with suggested fixes — shown in the preview panel before the user
        exports.
      </p>

      <h3>Q: How would you support multi-language email templates in the builder?</h3>
      <p>
        Multi-language templates can be implemented at two levels: separate templates
        per language (simplest, but hard to keep in sync across languages when the
        design changes) or a single template with language-conditional blocks. The
        conditional approach uses a "show if" condition on each block:
        condition: "recipient.language === 'es'" shows a block only for Spanish recipients.
        The variable substitution engine evaluates these conditions at render time using
        the recipient's data. In the editor, a language toggle switches the preview
        language and shows/hides blocks accordingly. The template stores all language
        variants in the same block tree, with language-conditional visibility properties.
        This keeps the design in sync across languages — changing a button color updates
        all language variants — while allowing language-specific text content in each
        visible block.
      </p>
    </ArticleLayout>
  );
}

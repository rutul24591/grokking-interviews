"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-wysiwyg-email-builder",
  title: "Design a WYSIWYG Email Template Builder",
  description:
    "Email template builder with drag blocks, variable insertion, responsive preview, and HTML output.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "wysiwyg-email-builder",
  wordCount: 3200,
  readingTime: 17,
  lastUpdated: "2026-04-03",
  tags: ["lld", "email-builder", "wysiwyg", "drag-drop", "templates", "responsive-preview"],
  relatedTopics: ["rich-text-editor", "dashboard-builder", "form-builder"],
};

export default function WYSIWYGEmailTemplateBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a WYSIWYG email template builder — a visual drag-and-drop
          interface where users compose email templates by arranging blocks (text, image,
          button, divider, spacer, columns). Users can insert variables (e.g.,
          {`{{firstName}}`}) for personalization, preview the template at different screen
          sizes, and export the final HTML for email delivery.
        </p>
        <p>
          <strong>Assumptions:</strong> Email HTML must be table-based for client
          compatibility (Gmail, Outlook, Apple Mail). The builder generates
          email-compatible HTML inline. Variable insertion uses double-brace syntax.
          The component is used in a React 19+ SPA.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Block Palette:</strong> Sidebar with draggable blocks: text, image, button, divider, spacer, single column, two-column, three-column.</li>
          <li><strong>Drag to Canvas:</strong> Drag blocks from palette to the email canvas. Reorder by drag within the canvas.</li>
          <li><strong>Block Editing:</strong> Click block to edit properties (text content, image URL, button link, colors, padding).</li>
          <li><strong>Variable Insertion:</strong> Insert variables ({`{{firstName}}`}, {`{{company}}`}) into text blocks. Variables show as styled tokens.</li>
          <li><strong>Responsive Preview:</strong> Preview at desktop (600px), tablet (480px), and mobile (320px) widths.</li>
          <li><strong>HTML Export:</strong> Generate table-based, inline-styled HTML compatible with major email clients.</li>
          <li><strong>Undo/Redo:</strong> Undo/redo block additions, deletions, and edits.</li>
          <li><strong>Templates:</strong> Save/load pre-built templates (welcome, newsletter, promotion).</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 50+ blocks render smoothly. Drag operations at 60fps.</li>
          <li><strong>Email Compatibility:</strong> Generated HTML must pass email client compatibility checks (Litmus, Email on Acid).</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Image URL is invalid or broken — show placeholder in builder, include fallback in HTML output.</li>
          <li>Variable not recognized — show warning, render as raw text in output.</li>
          <li>Nested columns exceed email width (600px) — auto-collapse or show warning.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>block-based document model</strong> where the email
          template is an ordered array of blocks, each with a type and configuration. A
          <strong>Zustand store</strong> manages the block array, selection state, and
          undo/redo history. A <strong>drag-and-drop system</strong> handles block
          insertion and reordering. An <strong>HTML generator</strong> converts the
          block model into table-based, inline-styled HTML for email clients.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Block Model</h4>
          <p><code>Block</code> discriminated union: TextBlock, ImageBlock, ButtonBlock, DividerBlock, SpacerBlock, ColumnBlock. Each block has id, type, and type-specific config.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Template Store</h4>
          <p>Zustand store: blocks array, selected block ID, undo/redo stack. Actions: addBlock, removeBlock, moveBlock, updateBlockConfig, selectBlock.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. HTML Generator</h4>
          <p>Converts block model to table-based HTML with inline styles. Handles variable substitution, image fallbacks, button styling, and column layout via nested tables.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Preview Renderer</h4>
          <p>Renders the template in an iframe at different viewport widths. Uses the generated HTML to ensure accurate preview (not React components, actual email HTML).</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/wysiwyg-email-builder-architecture.svg"
          alt="WYSIWYG email builder architecture showing drag-drop canvas, block rendering, and HTML generation"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User drags &quot;Text&quot; block from palette to canvas.</li>
          <li>Store adds TextBlock at drop position, selects it.</li>
          <li>Block renders in canvas with default content (&quot;Edit this text&quot;).</li>
          <li>User clicks block → property panel opens → user edits content, inserts variable.</li>
          <li>User clicks &quot;Preview&quot; → HTML generator converts blocks to email HTML → renders in iframe at selected viewport.</li>
          <li>User clicks &quot;Export HTML&quot; → generator outputs final HTML with inline styles → user copies or downloads.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Block edit → store update → canvas re-render → HTML generator recomputes.
          Preview: HTML generator → iframe src update → responsive viewport.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Broken images:</strong> HTML generator adds <code>alt</code> text and fallback background color. The builder shows a broken image icon placeholder.</li>
          <li><strong>Unknown variables:</strong> Variable parser checks against the known variable list. Unknown variables render as raw {`{{var}}`} text with a yellow highlight in the builder.</li>
          <li><strong>Column overflow:</strong> If nested columns exceed 600px total width, the builder shows a red border warning. The HTML generator collapses columns to full-width stacked layout for mobile.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Key approach: discriminated union block model, Zustand store with undo/redo,
          drag-and-drop block insertion, table-based HTML generation with inline styles,
          and iframe-based responsive preview.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Add block</td><td className="p-2">O(1) — array splice</td><td className="p-2">O(n) — n blocks</td></tr>
              <tr><td className="p-2">HTML generation</td><td className="p-2">O(n) — linear block traversal</td><td className="p-2">O(h) — h = HTML string length</td></tr>
              <tr><td className="p-2">Variable substitution</td><td className="p-2">O(v × t) — v variables, t text blocks</td><td className="p-2">O(1)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <p>
          Generated HTML is sanitized — no script tags, no event handlers, no external
          stylesheets. All styles are inlined. Image URLs are validated. For accessibility,
          the builder itself is keyboard-accessible: Tab navigates blocks, Enter selects,
          Arrow keys reorder, Delete removes blocks. The preview iframe has
          <code>title</code> attribute for screen readers.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <li><strong>Unit:</strong> HTML generator — test each block type generates correct table-based HTML. Variable substitution — test known and unknown variables.</li>
          <li><strong>Integration:</strong> Drag block to canvas, verify it appears. Edit block, verify preview updates. Export HTML, verify it renders correctly in email client simulators.</li>
          <li><strong>Accessibility:</strong> Keyboard navigation between blocks, screen reader announces block type and content, undo/redo accessible.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Using div-based HTML:</strong> Email clients (especially Outlook) require table-based layouts. Div-based HTML renders incorrectly in many clients.</li>
          <li><strong>Using CSS classes:</strong> Gmail strips <code>&lt;style&gt;</code> tags in some contexts. All styles must be inline.</li>
          <li><strong>No variable validation:</strong> Unrecognized variables render as raw {`{{text}}`} in the email. Validation against a known variable list is essential.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement A/B testing for email templates?</p>
            <p className="mt-2 text-sm">
              A: Duplicate the template, create variant B with different content/layout.
              Send variant A to 50% of recipients, variant B to 50%. Track open rates,
              click-through rates. The builder shows a comparison dashboard with metrics
              per variant.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement dark mode support for email templates?</p>
            <p className="mt-2 text-sm">
              A: Email clients handle dark mode differently. Use <code>@media
              (prefers-color-scheme: dark)</code> in the <code>&lt;style&gt;</code> tag
              (supported by Apple Mail, Gmail mobile). Provide dark-mode-friendly
              background colors and ensure text has sufficient contrast on both light
              and dark backgrounds. Avoid pure white (#FFF) backgrounds.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement dynamic content blocks (content that changes based on recipient data)?</p>
            <p className="mt-2 text-sm">
              A: Add conditional blocks to the template: &quot;Show this block if
              <code>{`{{tier}}`}</code> equals &apos;premium&apos;&quot;. The email
              sending engine evaluates conditions per recipient and includes/excludes
              blocks accordingly. The builder shows condition badges on conditional blocks.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement collaborative template editing?</p>
            <p className="mt-2 text-sm">
              A: Use CRDTs (Y.js) for conflict-free concurrent block edits. Each block
              operation (add, remove, edit) is a CRDT operation. Show remote cursors
              and user avatars on blocks being edited. Broadcast changes via WebSocket.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.caniemail.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Can I Email — HTML/CSS Support Across Email Clients
            </a>
          </li>
          <li>
            <a href="https://mjml.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MJML — Responsive Email Framework
            </a>
          </li>
          <li>
            <a href="https://templates.mailchimp.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mailchimp — Email Template Best Practices
            </a>
          </li>
          <li>
            <a href="https://litmus.com/blog/email-client-market-share" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Litmus — Email Client Market Share and Rendering Differences
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-clipboard-api",
  title: "Design Clipboard API",
  description:
    "Production-grade clipboard handling with copy/paste, permissions, data formats, and cross-platform compatibility for content sharing.",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "clipboard-api",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "clipboard",
    "copy",
    "paste",
    "sharing",
    "permissions",
  ],
  relatedTopics: [
    "geolocation-permissions",
    "error-state-management",
    "async-state-handling",
  ],
};

export default function ClipboardAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Copy/paste critical for user experience: share content, duplicate
          data, move between apps. Key challenges: browser security (restrict
          clipboard access), permissions (ask user), format negotiation (copy
          HTML vs plain text), and cross-platform (some formats unsupported).
          Naive approach: use old clipboard APIs (deprecated, unreliable). Better:
          modern Clipboard API (async, permission-aware, format support).
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Need to copy content to clipboard (share, export).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Need to paste from clipboard (import, bulk insert).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Support multiple formats (HTML, plain text, images, files).</HighlightBlock>
          <li>Handle permission requests (user consent).</li>
          <HighlightBlock as="li" tier="important">Cross-browser compatibility (fallback for older browsers).</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Copy to Clipboard:</strong> Copy text, HTML, images, files
            to system clipboard.
          </HighlightBlock>
          <li>
            <strong>Paste from Clipboard:</strong> Read text, HTML, images, files
            from clipboard.
          </li>
          <li>
            <strong>Permissions:</strong> Request clipboard access (user
            approval).
          </li>
          <li>
            <strong>Format Detection:</strong> Detect available formats (text,
            html, image/png).
          </li>
          <li>
            <strong>Feedback:</strong> Show copy/paste status (success, denied).
          </li>
          <li>
            <strong>Clipboard Monitoring:</strong> Listen to clipboard changes
            (paste event).
          </li>
          <li>
            <strong>Clear Clipboard:</strong> Clear sensitive data (password,
            token).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Latency:</strong> Copy/paste &lt;100ms (instant feel).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Security:</strong> No silent clipboard access (user
            permission required).
          </HighlightBlock>
          <li>
            <strong>Privacy:</strong> Don't expose clipboard without consent.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Compatibility:</strong> Work in all modern browsers
            (fallback for older).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            Large data: copy 10MB file to clipboard. Handle gracefully (may
            fail on some browsers).
          </HighlightBlock>
          <li>
            Async operations: copy takes time (user navigates away mid-copy).
            Handle cancellation.
          </li>
          <HighlightBlock as="li" tier="important">
            Permission denied: user blocks clipboard access. Show fallback (manual
            copy).
          </HighlightBlock>
          <li>
            Mixed formats: copy as both HTML and plain text (paste chooses).
          </li>
          <li>
            Unsupported format: paste image but app only supports text
            (graceful degrade).
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Use modern Clipboard API (navigator.clipboard). For copy: prepare
          data, call writeText/write, handle async. For paste: request
          permission, read data, parse formats.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Fallback for older browsers:
          document.execCommand('copy') or textarea workaround. Show feedback
          (toast: "Copied!"). Handle errors (permission denied, unsupported
          format).</Highlight></HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/clipboard-api.svg"
          alt="Clipboard API system showing copy flow through permissions check, ClipboardItem construction with multiple MIME types, and paste flow through read permission, MIME detection, DOMPurify sanitization, with execCommand fallback"
          caption="Clipboard API system showing copy flow through permissions check, ClipboardItem construction with multiple MIME types, and paste flow through read permission, MIME detection, DOMPurify sanitization, with execCommand fallback"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Clipboard API</h3>
        <p>Modern async clipboard access.</p>
        <ul className="space-y-2">
          <li>
            <strong>navigator.clipboard.writeText:</strong> Copy plain text
            (simple).
          </li>
          <li>
            <strong>navigator.clipboard.write:</strong> Copy complex data
            (multiple formats).
          </li>
          <li>
            <strong>navigator.clipboard.readText:</strong> Read plain text
            (simple).
          </li>
          <li>
            <strong>navigator.clipboard.read:</strong> Read complex data
            (multiple formats).
          </li>
          <li>
            <strong>Async:</strong> Returns Promise (await for result).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Copy Operations</h3>
        <p>Write to clipboard.</p>
        <ul className="space-y-2">
          <li>
            <strong>Simple Text:</strong> await
            navigator.clipboard.writeText('hello').
          </li>
          <li>
            <strong>Rich Formats:</strong> Create ClipboardItem with multiple
            MIME types (HTML, plain text).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Example:</strong> Copy HTML button, but fallback to plain
            text if HTML unsupported.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Feedback:</strong> Show "Copied!" toast on success (timeout
            3s).
          </HighlightBlock>
          <li>
            <strong>Error Handling:</strong> NotAllowedError if permission
            denied, show message.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Paste Operations</h3>
        <p>Read from clipboard.</p>
        <ul className="space-y-2">
          <li>
            <strong>Simple Text:</strong> await navigator.clipboard.readText()
            gets pasted text.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Rich Data:</strong> navigator.clipboard.read() returns
            ClipboardItem array (multiple formats).
          </HighlightBlock>
          <li>
            <strong>Format Check:</strong> item.types array lists available
            MIME types.
          </li>
          <li>
            <strong>Get Blob:</strong> item.getType('text/html') → blob (read
            data).
          </li>
          <li>
            <strong>Parsing:</strong> Parse blob to string (text) or handle
            binary (image).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permissions</h3>
        <p>Request user consent.</p>
        <ul className="space-y-2">
          <li>
            <strong>Clipboard-Read:</strong> Permission to read clipboard
            (paste).
          </li>
          <li>
            <strong>Clipboard-Write:</strong> Permission to write clipboard
            (copy).
          </li>
          <li>
            <strong>Request:</strong> navigator.permissions.query({'{'}name:
            'clipboard-read'{'}'}) check status.
          </li>
          <li>
            <strong>User Gesture:</strong> Copy/read must be triggered by user
            action (click, not async).
          </li>
          <li>
            <strong>Prompt:</strong> Browser may show permission prompt
            (Allows/Block).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Supported Formats</h3>
        <p>Data types for clipboard.</p>
        <ul className="space-y-2">
          <li>
            <strong>text/plain:</strong> Plain text (always supported).
          </li>
          <li>
            <strong>text/html:</strong> HTML markup (most browsers).
          </li>
          <li>
            <strong>image/png:</strong> PNG image (some browsers).
          </li>
          <li>
            <strong>image/jpeg:</strong> JPEG image (less common).
          </li>
          <li>
            <strong>Custom types:</strong> application/json (app-specific
            data).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Copy Button Pattern</h3>
        <p>Implement copy-to-clipboard button.</p>
        <ul className="space-y-2">
          <li>
            <strong>HTML:</strong> &lt;button onclick="copyToClipboard()"&gt;Copy
            &lt;/button&gt;
          </li>
          <li>
            <strong>JS:</strong> On click, copy content, show toast "Copied!",
            hide after 2s.
          </li>
          <li>
            <strong>Icon:</strong> Show copy icon (📋) or change text
            temporarily ("Copied!").
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Accessibility:</strong> ARIA label, keyboard support
            (Enter key).
          </HighlightBlock>
          <li>
            <strong>Error:</strong> Permission denied → "Copy manually (Ctrl+C)"
            message.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Paste Handling</h3>
        <p>React to paste events.</p>
        <ul className="space-y-2">
          <li>
            <strong>Paste Event:</strong> Fired when user pastes (Ctrl+V,
            right-click paste).
          </li>
          <li>
            <strong>event.clipboardData:</strong> Contains pasted data
            (before/after processing).
          </li>
          <li>
            <strong>Prevent Default:</strong> e.preventDefault() stops paste,
            handle manually.
          </li>
          <li>
            <strong>Use Case:</strong> Rich text editor pastes HTML, sanitize
            (remove scripts).
          </li>
          <li>
            <strong>File Paste:</strong> Paste files (Ctrl+V), access via
            clipboardData.files.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Fallback for Older Browsers</h3>
        <p>Support browsers without Clipboard API.</p>
        <ul className="space-y-2">
          <li>
            <strong>document.execCommand('copy'):</strong> Deprecated but
            widely supported (older fallback).
          </li>
          <li>
            <strong>textarea Trick:</strong> Create hidden textarea, set text,
            select, execCommand('copy'), cleanup.
          </li>
          <li>
            <strong>Detection:</strong> Check if navigator.clipboard exists
            (Clipboard API support).
          </li>
          <li>
            <strong>Graceful Degrade:</strong> If no support, show "Copy manually
            (Ctrl+C)" instruction.
          </li>
          <li>
            <strong>Modern Approach:</strong> Clipboard API universal in modern
            browsers (IE 11 no).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security & Privacy</h3>
        <p>Protect user data.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>No Silent Access:</strong> App cannot read clipboard
            without permission (security).
          </HighlightBlock>
          <li>
            <strong>User Gesture:</strong> Copy/paste must be user-triggered
            (no async calls).
          </li>
          <li>
            <strong>HTTPS Only:</strong> Clipboard API works on secure context
            (https://).
          </li>
          <li>
            <strong>Clear Sensitive:</strong> After operation, clear sensitive
            data (token, password).
          </li>
          <li>
            <strong>Prompt Context:</strong> Show why clipboard access needed
            (explain in UI).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track clipboard usage.</p>
        <ul className="space-y-2">
          <li>
            <strong>Copy Rate:</strong> % of users copying content (engagement).
          </li>
          <li>
            <strong>Paste Rate:</strong> % of users pasting (importance of
            feature).
          </li>
          <li>
            <strong>Permission Grant:</strong> % of users allowing clipboard
            access.
          </li>
          <li>
            <strong>Fallback Usage:</strong> % relying on manual copy (API
            unsupported).
          </li>
          <li>
            <strong>Success Rate:</strong> % of copy/paste operations succeeding
            (errors).
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">HTTPS Requirement</h3>
        <HighlightBlock as="p" tier="crucial">
          Clipboard API only works on https:// (secure context). http://
          blocked for security. Localhost ok for dev.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User Gesture</h3>
        <HighlightBlock as="p" tier="important">
          Copy/paste must be triggered by user action (click, not async).
          Prevents malicious scripts from stealing clipboard.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Clipboard</h3>
        <HighlightBlock as="p" tier="important">
          Mock navigator.clipboard in unit tests (real clipboard access hard
          to test). Integration tests on real browser. Verify toast feedback.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Copy Link Pattern</h3>
        <HighlightBlock as="p" tier="important">
          Generate shareable link, copy to clipboard. Common: "Copy link" button
          for collaboration.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Code Snippet Copy</h3>
        <HighlightBlock as="p" tier="important">
          Show code block with copy button. Common in docs. Highlight on copy
          (visual feedback).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Rich Format Copy</h3>
        <HighlightBlock as="p" tier="important">
          Copy as both HTML (formatted) and plain text (compatibility). Paste
          chooses best format.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="important">
          Copy very large text (10MB+): may fail on some systems. Test graceful
          failure. Permission edge cases.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="crucial">
          Common: copy button not visible (accessibility). Solution: always
          visible, keyboard accessible. Another: no feedback. Solution: toast
          "Copied!" (3s timeout).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <p>
          Copy fails silently: check HTTPS, permissions. Paste blocked: app
          may prevent defaults. Debug: check clipboard on user device.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Convenience vs Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Silent copy: convenient but dangerous (malicious scripts steal
          clipboard). Permission: secure but friction. Browser restricts for
          security.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Format Support</h3>
        <HighlightBlock as="p" tier="important">
          HTML copy: better UX (formatted on paste) but less compatible. Plain
          text: always works. Copy both.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Compatibility</h3>
        <HighlightBlock as="p" tier="important">
          Modern browsers: Clipboard API universal. Old browsers: use fallback
          (execCommand or manual instruction). Progressive enhancement:
          detect, provide best experience.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Paste event handling for rich editors (sanitize HTML). User gesture requirement prevents silent clipboard access (malicious scripts).</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Monitoring copy/paste rates, permission grant rates, success rates. Testing with mocks and real browser. Real-world systems implement copy-link buttons (collaboration), code snippet copy (docs), and rich format copy (HTML + plain text), with graceful degradation for unsupported browsers.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
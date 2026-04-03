"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-clipboard-api",
  title: "Clipboard API",
  description:
    "Comprehensive guide to the Clipboard API covering programmatic copy and paste operations, permission models, security considerations, structured clone serialization, and production-scale implementation patterns for web applications.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "clipboard-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "browser API",
    "clipboard",
    "copy paste",
    "permissions",
    "security",
    "structured clone",
  ],
  relatedTopics: ["notification-api"],
};

export default function ClipboardAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Clipboard API</strong> provides web applications with programmatic access to the system clipboard, enabling copy, cut, and paste operations through JavaScript. Exposed through the <code>navigator.clipboard</code> object, the API offers asynchronous methods for reading and writing text, HTML, images, and other data types to and from the clipboard. The API replaces the legacy <code>document.execCommand(&apos;copy&apos;)</code> approach with a modern, Promise-based interface that integrates with the browser&apos;s permission model and security architecture.
        </p>
        <p>
          The Clipboard API was introduced to address the limitations of the legacy clipboard access mechanisms. The <code>document.execCommand</code> approach required the content to be selected in the DOM before copying, was synchronous (blocking the main thread), provided no access to reading clipboard content, and offered no control over what types of data could be placed on the clipboard. The modern Clipboard API overcomes all of these limitations: it allows copying arbitrary content without DOM selection, operates asynchronously, supports reading clipboard content (with appropriate permissions), and enables writing multiple data types including text, HTML, and images through the ClipboardItem interface.
        </p>
        <p>
          The API operates under a strict security model. Writing to the clipboard generally requires a user gesture — the copy operation must be triggered by a user action such as a click or key press. Reading from the clipboard is even more restricted: it requires explicit user permission granted through a browser permission prompt, and in some browsers, reading is only available in secure contexts (HTTPS). These restrictions prevent malicious sites from silently reading sensitive clipboard content (such as passwords or credit card numbers that the user may have copied elsewhere) or from spamming the clipboard with unwanted content.
        </p>
        <p>
          For staff and principal engineers, the Clipboard API represents a tool for improving user experience in content-heavy applications — code editors, document processors, data management tools, and sharing features — where programmatic clipboard access reduces user friction. The decision to implement the API involves evaluating the security implications, browser support variations, permission model differences between reading and writing, and the need for fallback mechanisms for browsers that do not support the API or for contexts where permissions are denied.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The <strong>writeText method</strong> is the simplest way to write to the clipboard. Calling <code>navigator.clipboard.writeText(text)</code> with a string copies that text to the clipboard. The method returns a Promise that resolves when the write is complete. This method requires a user gesture in most browsers — it must be called from within a user-initiated event handler such as a click handler. If called outside a user gesture context, the Promise rejects with a permission error.
        </p>
        <p>
          The <strong>write method</strong> enables writing richer data types to the clipboard, including HTML, images, and custom formats. It accepts an array of ClipboardItem objects, each of which can contain multiple representations of the same data in different MIME types. For example, a single ClipboardItem can contain both HTML and plain text versions of the same content, allowing the receiving application to choose which format to use. Creating a ClipboardItem involves calling the constructor with a mapping of MIME types to Blob objects, where each MIME type key maps to a corresponding Blob object.
        </p>
        <p>
          The <strong>readText method</strong> reads plain text from the clipboard. Calling <code>navigator.clipboard.readText()</code> returns a Promise that resolves with the clipboard&apos;s text content. This method requires explicit user permission — the browser displays a permission prompt when the method is first called. Unlike writeText, readText does not require a user gesture beyond the initial permission grant, meaning it can be called programmatically after permission is granted. However, some browsers may re-prompt for permission if the application has not accessed the clipboard recently.
        </p>
        <p>
          The <strong>read method</strong> reads all data types from the clipboard, not just text. Calling <code>navigator.clipboard.read()</code> returns a Promise that resolves with an array of ClipboardItem objects, each containing the clipboard data in various MIME types. This method requires the same explicit user permission as readText. It is useful when the application needs to handle rich clipboard content — for example, a rich text editor that needs to paste HTML content with formatting, or an image editor that needs to paste image data from the clipboard.
        </p>
        <p>
          The <strong>permission model</strong> differentiates between read and write permissions. Write permission is generally granted automatically when the operation is triggered by a user gesture — the browser trusts that the user intends to copy the content. Read permission requires explicit user consent through a browser permission prompt, because reading the clipboard exposes potentially sensitive content that the user may have copied from another application. The permission can be queried using the Permissions API by querying for clipboard-read or clipboard-write permission names.
        </p>
        <p>
          The <strong>secure context requirement</strong> means that the Clipboard API is only available in secure contexts (HTTPS or localhost). Attempting to access <code>navigator.clipboard</code> in an insecure context returns undefined. This requirement prevents man-in-the-middle attacks that could intercept clipboard data during transmission. For development, localhost is treated as a secure context, so the API works during local development without HTTPS.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/clipboard-api-flow.svg"
          alt="Clipboard API Flow diagram showing write operations requiring user gesture, read operations requiring permission prompt, and the permission model differentiating read and write access"
          caption="Clipboard API flow — writeText and write require user gesture context, readText and read require explicit user permission through browser prompt, all operations require secure context (HTTPS)"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production Clipboard API implementation requires an architecture that manages copy operations, paste operations, permission handling, error recovery, and user feedback. While the API itself is simple, production usage patterns require careful design to ensure reliability across different browsers, graceful degradation when permissions are denied, and clear user feedback about clipboard operations.
        </p>
        <p>
          The <strong>copy operation layer</strong> manages writing content to the clipboard. It begins with a user action (clicking a &quot;Copy&quot; button, selecting a menu item, pressing a keyboard shortcut). The layer validates that the content to be copied is available and properly formatted, calls the appropriate write method (writeText for plain text, write for rich content), and provides user feedback about the result. Feedback is critical — users need to know whether their copy action succeeded or failed. A common pattern is displaying a brief toast notification (&quot;Copied to clipboard&quot;) on success or an error message on failure.
        </p>
        <p>
          The <strong>paste operation layer</strong> manages reading content from the clipboard. It begins by checking whether the Clipboard API is available and whether read permission has been granted. If permission has not been granted, the layer requests it, which triggers a browser permission prompt. If permission is denied, the layer falls back to alternative paste mechanisms — typically listening for the paste event on a focused input element, which provides clipboard access through the browser&apos;s native paste handling. If permission is granted, the layer reads the clipboard content, processes it (validating, sanitizing, transforming), and inserts it into the appropriate location in the application.
        </p>
        <p>
          The <strong>permission management layer</strong> tracks and manages clipboard permissions. It queries the current permission state using the Permissions API, caches the result to avoid redundant permission checks, and updates the cache when the permission state changes (by listening to the PermissionStatus onchange event). This layer enables the application to adapt its UI based on permission state — for example, hiding paste buttons when read permission is denied, or displaying a permission request prompt before attempting to read the clipboard.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/clipboard-permission-model.svg"
          alt="Clipboard Permission Model diagram showing the difference between write permission (granted with user gesture) and read permission (requires explicit prompt), and the permission state machine"
          caption="Clipboard permission model — write permission is granted automatically with user gesture, read permission requires explicit user consent through browser prompt, permission state can be queried and monitored through the Permissions API"
          width={900}
          height={500}
        />

        <p>
          The <strong>error handling layer</strong> manages the various failure modes of clipboard operations. Copy operations can fail if the user gesture requirement is not met, if the secure context requirement is not satisfied, or if the browser does not support the Clipboard API. Paste operations can fail if the user denies read permission, if the clipboard is empty, if the clipboard content cannot be deserialized, or if the content exceeds size limits. Each failure mode requires a different recovery strategy: for user gesture failures, re-prompt the user to click a button; for permission denials, explain why permission is needed and provide a manual paste alternative; for API unavailability, fall back to document.execCommand or native paste handling.
        </p>
        <p>
          The <strong>content sanitization layer</strong> ensures that pasted content is safe before inserting it into the application. Clipboard content can contain malicious HTML, scripts, or specially crafted data that exploits vulnerabilities in the receiving application. The sanitization layer strips dangerous elements (script tags, event handlers, iframe elements), validates data types and sizes, and applies content security policies before inserting pasted content into the DOM. This is particularly important for rich text editors and content management systems that accept HTML paste content.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/clipboard-security-model.svg"
          alt="Clipboard Security Model diagram showing content sanitization, secure context requirements, permission boundaries, and data validation for clipboard operations"
          caption="Clipboard security model — all operations require secure context (HTTPS), read operations require explicit user permission, pasted content must be sanitized before insertion (strip scripts, event handlers, iframes), and data types must be validated"
          width={900}
          height={550}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The Clipboard API involves trade-offs between user experience enhancement and security restriction, between modern API capability and browser support limitation, and between programmatic convenience and user control. Understanding these trade-offs is essential for choosing the right clipboard access strategy for each use case.
        </p>
        <p>
          The most significant trade-off is <strong>user experience versus security</strong>. Programmatic clipboard access significantly improves user experience — users can copy content with a single click, paste rich content with formatting preserved, and share content across applications seamlessly. However, unrestricted clipboard access would create severe security risks: malicious sites could silently read passwords, credit card numbers, or other sensitive content from the clipboard. The browser&apos;s permission model and user gesture requirements balance these concerns by granting access only when the user explicitly intends it. The trade-off is that clipboard operations sometimes require additional user interactions (clicking permission prompts, confirming paste actions) that add friction.
        </p>
        <p>
          The <strong>modern API versus legacy fallback</strong> trade-off affects browser compatibility. The Clipboard API is supported in all modern browsers (Chrome, Edge, Firefox, Safari), but with varying levels of capability. Safari supports writeText but has limited read support. Firefox supports both but may require configuration flags for read access in some versions. Legacy browsers (Internet Explorer, older versions of modern browsers) do not support the Clipboard API at all. Applications must implement fallback mechanisms — document.execCommand for writing, and native paste event handling for reading — to support these browsers. The fallback mechanisms are less capable (execCommand requires DOM selection, native paste only provides plain text) but provide basic clipboard functionality.
        </p>
        <p>
          The <strong>programmatic versus native paste</strong> trade-off affects paste operation design. The Clipboard API enables programmatic paste — reading the clipboard and inserting content without requiring a focused input element. This is powerful for rich text editors and content management systems that need to process and transform pasted content. However, the native paste mechanism (listening for the paste event on a focused element) is simpler, requires no permission prompt, and works in all browsers. The trade-off is capability versus simplicity: programmatic paste provides more control but requires permission handling, while native paste is simpler but provides less control over content processing.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/clipboard-tradeoffs.svg"
          alt="Clipboard API Trade-offs comparison matrix showing user experience benefit, security restriction level, browser support, and capability across Clipboard API, document.execCommand, and native paste event"
          caption="Clipboard access trade-offs — Clipboard API provides programmatic read and write with good security but requires permissions and has varying browser support; document.execCommand provides write-only with broad support but requires DOM selection; native paste event provides read-only with universal support but limited to plain text"
          width={900}
          height={500}
        />

        <h3>Clipboard Access Approach Comparison</h3>
        <p>
          <strong>Clipboard API</strong> provides programmatic read and write access with asynchronous operations and rich data type support. It requires secure context, user gesture for writing, and explicit permission for reading. Best for: modern applications requiring clipboard access with good user experience and security.
        </p>
        <p>
          <strong>document.execCommand(&apos;copy&apos;)</strong> provides write-only access through synchronous execution. It requires the content to be selected in the DOM, works in most browsers including older versions, and does not require explicit permission. Best for: fallback writing when Clipboard API is unavailable.
        </p>
        <p>
          <strong>Native paste event</strong> provides read-only access through the paste event listener. It requires a focused element, provides plain text only (no rich content), works in all browsers, and does not require permission. Best for: fallback reading when Clipboard API is unavailable or permission is denied.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          The most important best practice is <strong>always providing user feedback for clipboard operations</strong>. When a user clicks &quot;Copy,&quot; they need immediate confirmation that the content was copied successfully. Display a brief toast notification, tooltip, or button state change (&quot;Copied!&quot;) that confirms the operation. If the operation fails, display an error message explaining what went wrong and offering an alternative (such as selecting and copying manually). Silent failures leave users uncertain about whether their action succeeded.
        </p>
        <p>
          <strong>Checking for API support before use</strong> prevents runtime errors. Test for <code>&apos;clipboard&apos; in navigator</code> before calling Clipboard API methods. If the API is not available, fall back to document.execCommand for writing or native paste event handling for reading. Feature detection should be performed once on application initialization and cached, rather than checking on every clipboard operation.
        </p>
        <p>
          <strong>Sanitizing pasted content</strong> is essential for security. Clipboard content can contain malicious HTML, scripts, or specially crafted data. Always sanitize pasted content before inserting it into the DOM — strip script tags, event handlers, iframe elements, and other dangerous elements. Use a well-tested sanitization library such as DOMPurify rather than implementing custom sanitization logic.
        </p>
        <p>
          <strong>Handling permission denials gracefully</strong> ensures that users who deny clipboard read permission still have a functional experience. When read permission is denied, fall back to native paste event handling (listening for the paste event on a focused input element). Display a message explaining that programmatic paste is not available and instructing the user to use the browser&apos;s paste command (Ctrl+V or Cmd+V) instead.
        </p>
        <p>
          <strong>Using the appropriate write method for the content type</strong> ensures that pasted content is usable by the receiving application. For plain text content (URLs, codes, plain text), use writeText. For rich content (formatted text, HTML, images), use write with ClipboardItem objects containing multiple MIME type representations. Providing multiple representations increases compatibility — the receiving application can choose the format it supports.
        </p>
        <p>
          <strong>Respecting clipboard size limits</strong> prevents operation failures. Browsers impose limits on the amount of data that can be written to or read from the clipboard. Large images, complex HTML, or massive text blocks may exceed these limits. Check the content size before writing, and if it exceeds reasonable limits, warn the user and offer alternatives (such as sharing a link instead of copying the full content).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is <strong>calling write methods outside a user gesture context</strong>, which silently fails in most browsers. The Clipboard API requires that write operations be triggered by a user action — clicking a button, pressing a keyboard shortcut, or selecting a menu item. Calling writeText or write from a timer, network callback, or other non-gesture context results in a permission error. The solution is to ensure that all clipboard write operations are directly triggered by user event handlers.
        </p>
        <p>
          <strong>Not handling the secure context requirement</strong> leads to broken clipboard functionality on HTTP sites. The Clipboard API is only available in secure contexts (HTTPS or localhost). On HTTP sites, navigator.clipboard is undefined. Applications deployed on HTTP will have silently broken clipboard features. The solution is to always use HTTPS in production and to check for API availability before attempting clipboard operations.
        </p>
        <p>
          <strong>Not sanitizing pasted HTML content</strong> creates cross-site scripting vulnerabilities. When pasting HTML content from the clipboard, the content may contain script tags, event handlers, or other executable elements that can execute malicious code in the context of the application. Always sanitize pasted HTML before inserting it into the DOM. Use a sanitization library that strips dangerous elements while preserving safe formatting.
        </p>
        <p>
          <strong>Assuming universal read support</strong> leads to broken paste functionality. Not all browsers support clipboard read access — Safari has limited read support, and some Firefox versions require configuration flags. Applications that rely on programmatic paste without a fallback will have broken paste functionality in these browsers. The solution is to implement native paste event handling as a fallback for browsers that do not support programmatic read.
        </p>
        <p>
          <strong>Not providing fallback for unsupported browsers</strong> excludes users on older browsers. Internet Explorer and older versions of modern browsers do not support the Clipboard API. Applications that use the Clipboard API exclusively, without fallback to document.execCommand and native paste events, will have broken clipboard functionality for these users. The solution is to implement feature detection and provide appropriate fallbacks.
        </p>
        <p>
          <strong>Ignoring clipboard permission state</strong> creates confusing user experiences. If the application attempts to read the clipboard without checking whether permission has been granted, the browser displays a permission prompt that may surprise the user. The solution is to check the permission state before attempting to read, and if permission has not been granted, display an explanation of why permission is needed before triggering the permission prompt.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Code Sharing and Collaboration</h3>
        <p>
          Code sharing platforms (GitHub Gist, CodePen, JSFiddle) use the Clipboard API to enable one-click copying of code snippets. When a user clicks a &quot;Copy Code&quot; button, the application copies the code content to the clipboard using writeText. The user receives immediate feedback through a toast notification (&quot;Copied to clipboard&quot;). This pattern eliminates the need for manual text selection and keyboard shortcut, improving the user experience for developers who frequently share and reuse code snippets.
        </p>

        <h3>Rich Text Editing</h3>
        <p>
          Rich text editors (Google Docs, Notion, Quill-based editors) use the Clipboard API to handle paste operations with rich content preservation. When a user pastes content from another document (Word, another web page, an email), the editor reads the clipboard content using the read method, which provides the content in multiple MIME types (HTML, plain text, RTF). The editor sanitizes the HTML content, transforms it to the editor&apos;s internal format, and inserts it at the cursor position. This pattern preserves formatting, links, and structure from the source document while ensuring that pasted content is safe and compatible with the editor&apos;s data model.
        </p>

        <h3>Referral and Invitation Systems</h3>
        <p>
          Referral and invitation systems (Uber, Dropbox, SaaS platforms) use the Clipboard API to enable one-click copying of referral links and invitation codes. When a user clicks &quot;Copy Referral Link,&quot; the application copies the unique referral URL to the clipboard. The user can then paste the link into any communication channel (email, messaging app, social media). This pattern simplifies the referral process, increasing the likelihood that users will share their referral links and driving user acquisition through word-of-mouth.
        </p>

        <h3>Two-Factor Authentication and OTP</h3>
        <p>
          Authentication systems and applications that display one-time passwords (OTPs) use the Clipboard API to enable one-click copying of verification codes. When a user receives an OTP (displayed on screen, received via email, or generated by an authenticator app integration), a &quot;Copy Code&quot; button copies the code to the clipboard for easy pasting into the verification field. This pattern reduces entry errors (OTPs are typically 6-8 digit numbers that are error-prone to type manually) and improves the authentication experience, particularly on mobile devices where typing is more difficult.
        </p>

        <h3>Data Export and Reporting</h3>
        <p>
          Analytics dashboards and data management tools use the Clipboard API to enable copying of tabular data, chart data, or report summaries. When a user clicks &quot;Copy Table,&quot; the application formats the data as tab-separated values (for pasting into spreadsheets) and as HTML (for pasting into documents), wraps both formats in a ClipboardItem, and writes it to the clipboard. This pattern enables seamless data transfer between web applications and desktop applications (Excel, Google Sheets, Word), improving workflow efficiency for users who regularly export and share data.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Clipboard API work, and what are the differences between read and write operations?
            </p>
            <p className="mt-2 text-sm">
              A: The Clipboard API is accessed through navigator.clipboard and provides four main methods. writeText copies plain text to the clipboard and requires a user gesture. write copies rich content (HTML, images, custom types) using ClipboardItem objects and also requires a user gesture. readText reads plain text from the clipboard and requires explicit user permission through a browser prompt. read reads all data types from the clipboard as ClipboardItem objects and also requires explicit permission.
            </p>
            <p className="mt-2 text-sm">
              The key difference is that write operations are gated by user gesture requirements (the browser trusts the user&apos;s intent to copy), while read operations are gated by explicit permission requirements (the browser requires user consent to expose potentially sensitive clipboard content). Both read and write require a secure context (HTTPS).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle clipboard operations in browsers that do not support the Clipboard API?
            </p>
            <p className="mt-2 text-sm">
              A: Implement feature detection by checking whether clipboard exists in navigator. If supported, use the Clipboard API. If not supported, fall back to alternative mechanisms. For writing, use document.execCommand(&apos;copy&apos;) which requires selecting the content in the DOM and executing the copy command synchronously. For reading, use the native paste event — add a paste event listener to a focused input element and read the clipboard data from the event object. The fallback mechanisms are less capable but provide basic clipboard functionality.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the security considerations for the Clipboard API?
            </p>
            <p className="mt-2 text-sm">
              A: Several security considerations apply. First, the secure context requirement prevents man-in-the-middle attacks on clipboard data. Second, the user gesture requirement for writing prevents malicious sites from spamming the clipboard. Third, the permission requirement for reading prevents silent theft of sensitive clipboard content. Fourth, pasted content must be sanitized before insertion into the DOM to prevent cross-site scripting attacks — strip script tags, event handlers, and iframe elements. Fifth, applications should not store clipboard content in logs, analytics, or persistent storage, as it may contain sensitive information.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you write rich content (HTML, images) to the clipboard?
            </p>
            <p className="mt-2 text-sm">
              A: Use the write method with ClipboardItem objects. Create Blob objects for each MIME type you want to provide — for example, a text/plain blob with the plain text version and a text/html blob with the HTML version. Create a ClipboardItem with a mapping of MIME types to Blobs. Then call navigator.clipboard.write with an array containing the ClipboardItem. The receiving application can choose which MIME type to use based on its capabilities.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle clipboard permission management in a production application?
            </p>
            <p className="mt-2 text-sm">
              A: Use the Permissions API to query the current clipboard permission state before attempting read operations. Query with navigator.permissions.query and the clipboard-read permission name. Cache the result to avoid redundant permission checks. Listen for permission state changes using the PermissionStatus onchange event, and update the cache when the state changes. If permission is denied, fall back to native paste event handling. If permission is prompt, display an explanation of why permission is needed before triggering the permission prompt. If permission is granted, proceed with the read operation.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN Web Docs — Clipboard API Complete Reference
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/clipboard-apis/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C Clipboard API and Events Specification
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/clipboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Clipboard API Browser Compatibility Data
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/async-clipboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Async Clipboard API Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Permissions API for Clipboard Permission Management
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

# Security Notes

## dangerouslySetInnerHTML Usage

This codebase contains 51 instances of `dangerouslySetInnerHTML`. All instances fall into one of three safe categories:

### 1. Intentional Security Demonstrations
Files under `content/examples/system-design-concepts/frontend/security/xss-prevention/` intentionally demonstrate XSS attacks and their mitigations. These are **static educational examples**, not user-interactive components.

### 2. JSON-LD Structured Data
Several article layouts use `dangerouslySetInnerHTML` for JSON-LD `<script>` tags. This content is **programmatically generated** from article metadata — never user input. Safe.

### 3. Rich Text Demo Components
Files under `content/examples/system-design-concepts/frontend/` include demo components (comment-thread, rich-text-editor) that render unsanitized content for demonstration purposes. These are **static, non-interactive examples** displayed as article content.

### When to Add DOMPurify
If any of these example components become **interactive** (accepting real user input), add DOMPurify sanitization immediately:

```tsx
import DOMPurify from "isomorphic-dompurify";

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

## Content-Security-Policy Note

The CSP currently allows `'unsafe-inline'` for scripts and styles. This is required because:
- Tailwind CSS v4 generates inline styles dynamically at runtime
- Next.js injects inline scripts for hydration and interactivity

To tighten this to a nonce-based CSP:
1. Generate a per-request nonce in middleware
2. Add `nonce-{value}` to CSP `script-src` and `style-src`
3. Configure Next.js to inject the nonce into all inline scripts
4. Configure Tailwind to use nonce on its style tags

This is non-trivial with Tailwind v4's runtime style generation.

# Rich Text Editor — Example 2: Edge Cases & Advanced Scenarios

## Overview

These examples address two of the most complex edge cases in rich text editing: CJK input method handling and pasted content sanitization — both frequent interview follow-up questions.

---

## 1. IME Composition (`ime-composition.ts`)

### The Problem

When users type CJK (Chinese, Japanese, Korean) characters, the IME goes through a **composition phase**:

1. User types "k" → IME shows candidate "か" (hiragana)
2. User presses space → candidate changes to "が"
3. User presses Enter → final character "画" is committed

During steps 1-2, the browser fires `input` events for each keystroke. If the editor processes these naively, it will:
- Apply formatting (bold, italic) to intermediate states
- Trigger auto-complete with partial data
- Break the IME flow by intercepting keystrokes

### The Solution

Gate all input processing behind **composition state**:

```
compositionstart → suspend normal input handling
compositionupdate (×N) → track intermediate candidates
compositionend → process the final committed text
```

The `InputEvent.isComposing` property (standard in modern browsers) is the most reliable way to detect if an input event fired during active composition.

### Key Implementation Details

**Dual event listener attachment:** We attach both React synthetic events (for the component's event system) AND native DOM listeners (to catch composition events that React may not fully support across all browsers).

**Browser quirks:** Safari's `compositionend.event.data` may be empty even when text was committed. Fallback: read `element.textContent` directly.

**Custom keybindings during IME:** Shortcuts like Ctrl+B (bold) must check `isComposing` before processing — the IME may use the same keystrokes for candidate selection.

### Interview Talking Points

- **Why not just use `onInput`?** Because `onInput` fires for every IME keystroke, not just the committed result.
- **Mobile IME:** Gboard for Japanese may not fire composition events consistently. Always read textContent directly as a fallback.
- **contenteditable:** Let the browser manage the IME floating window — don't try to replicate it. Read the final state on `compositionend`.

---

## 2. Pasted Content Sanitizer (`pasted-content-sanitizer.ts`)

### The Problem

Pasting from Word, Google Docs, or web pages brings a mess of HTML:
- Inline styles (`style="font-family: Arial; font-size: 14px"`)
- Proprietary tags (`<o:p>`, `<w:WordDocument>`)
- Class names from the source site
- Potentially malicious content (`<script>`, `javascript:` URLs, event handlers)
- Images referencing local paths (`file:///Users/...`) or blob URLs

### The Solution: DOMParser-based Whitelist Sanitization

Instead of regex (fragile), we use `DOMParser` to parse HTML into a real DOM tree, then walk it removing anything not in our whitelist:

**Allowed tags:** `p, br, strong, b, em, i, u, a, ul, ol, li, h1, h2, h3, blockquote, code, pre, span`

**Strategy:**
1. Parse HTML with `DOMParser`
2. Walk the DOM tree recursively
3. **Unwrap** disallowed tags (keep children, remove the wrapper)
4. **Strip** disallowed attributes from allowed tags
5. **Validate** URLs (block `javascript:`, `vbscript:`, `data:`)
6. **Extract** images for upload to our CDN

### Image Extraction Pipeline

Images in pasted content need special handling:

1. **Local file paths** (`file://`) — won't resolve in the app, need upload
2. **Blob URLs** (`blob:https://...`) — temporary, need upload before page unload
3. **Direct clipboard images** (screenshots) — available as `File` objects in `clipboardData.files`

The `onImageExtracted` callback handles uploading each image and replacing blob URLs with permanent CDN URLs in the sanitized HTML.

### Interview Talking Points

- **Why DOMParser over regex?** Regex can't handle nested tags, escaped content, or malformed HTML correctly. DOMParser uses the browser's actual HTML parser.
- **Unwrap vs remove:** When we encounter a disallowed tag like `<font>`, we unwrap it (keep its children) rather than deleting everything. This preserves the text content.
- **Max images limit:** Prevents DoS from pasting a page with 10,000 images. Default cap is 10.
- **Plain text fallback:** If clipboard has no HTML, wrap plain text in `<p>` tags, converting double newlines to paragraph breaks.

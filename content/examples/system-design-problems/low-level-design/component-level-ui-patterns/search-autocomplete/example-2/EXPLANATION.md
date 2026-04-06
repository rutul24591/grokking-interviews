# Search Autocomplete — Edge Cases & Advanced Scenarios

This document covers the two most technically challenging follow-ups interviewers ask about search autocomplete: handling CJK (Chinese/Japanese/Korean) IME composition, and preventing stale response overwrites.

---

## Edge Case 1: CJK Input Method Editor (IME) Composition

### The problem

When a user types in a CJK language, they don't type characters directly. They type phonetic representations (like Pinyin for Chinese) through an Input Method Editor (IME), which then converts the phonetic input into the target script.

**Example — Chinese Pinyin:**
```
Keystrokes:  n → ni → nih → niha → nihao
IME shows:   [你] [泥] [拟] ...  (candidate list)
User picks:  你
Final:       你好 (after second character)
```

During this process, the browser fires `input` events for every single keystroke: "n", "ni", "nih", "niha", "nihao". A naive autocomplete handler fires an API call for each one — 5 wasted requests before the actual query even exists.

### The solution: Composition event gating

The DOM provides three composition events alongside the standard `input` event:

| Event | When it fires | What `e.data` contains |
|-------|--------------|----------------------|
| `compositionstart` | IME session begins | Initial composition text |
| `compositionupdate` | Each keystroke during composition | Current composition buffer |
| `compositionend` | Character committed | Final composed character |

The `CJKInputHandler` listens to all three and gates the tokenizer:

```
compositionstart → isComposing = true → SKIP all input events
compositionupdate → buffer updates → still SKIP
compositionend → isComposing = false → process final value
```

### Browser compatibility

Modern browsers support `event.isComposing` on `InputEvent`, but older browsers (Safari < 13, IE) don't. The handler maintains its own `isComposing` state as a fallback:

```typescript
// Dual check for maximum compatibility
if (event.isComposing || this.state.isComposing) {
  return; // Skip — still composing
}
```

### Race condition: `input` vs `compositionend` ordering

Different browsers fire these events in different orders:

- **Chrome**: `compositionend` → `input` (composed value)
- **Firefox**: `input` (composed value) → `compositionend`
- **Safari**: `compositionend` → `input` (composed value), but sometimes fires an extra `input` with the pre-composition value

The handler uses a 50ms post-composition debounce to ensure the DOM has settled before processing the final value.

### Script detection

The handler includes a Unicode-range-based script detector:

```
Chinese:  U+4E00 – U+9FFF (CJK Unified Ideographs)
Hiragana: U+3040 – U+309F
Katakana: U+30A0 – U+30FF
Hangul:   U+AC00 – U+D7AF
```

This is used for analytics (understanding user language patterns) and could drive language-specific tokenization (e.g., Japanese needs morphological analysis, not word-boundary splitting).

---

## Edge Case 2: Stale Response Prevention

### The problem

User types "apple" in 500ms. Five API requests are sent:

```
Request  "a"    → 800ms latency
         "ap"   → 600ms latency
         "app"  → 400ms latency
         "appl" → 500ms latency
         "apple"→ 300ms latency
```

Response arrival order:
```
t=300ms: "app" response arrives  ← applied (wrong — user is at "appl")
t=600ms: "ap" response arrives   ← applied (wrong — user is at "apple")
t=750ms: "apple" response arrives ← applied (correct, but only by chance)
t=800ms: "a" response arrives     ← applied (WRONG — overwrites "apple"!)
```

The final UI shows suggestions for "a" — completely useless.

### Two-layer defense

**Layer 1 — AbortController**: When a new keystroke arrives, we abort the previous in-flight HTTP request.

```typescript
abortController.abort(); // Rejects the fetch promise with AbortError
```

This saves bandwidth and server CPU. But it's not sufficient because:
- The abort signal might not reach a slow server before it responds
- A service worker might return a cached response regardless of abort
- A CDN might have already started streaming the response

**Layer 2 — Request ID validation**: Every request gets a unique monotonically increasing ID (`timestamp-counter`). The response must echo this ID back. If the stored `currentRequestId` doesn't match the response's `requestId`, we discard it.

```typescript
if (this.currentRequestId !== response.requestId) {
  // Stale — discard
  return;
}
```

This is the **canonical solution** to the out-of-order delivery problem and applies to any async system where responses can arrive in a different order than requests were sent.

### Why not just use the query string as the check?

You could compare `response.query === currentInputValue`. But this fails when:
- The user backspaces: "apple" → "appl" — a response for "appl" that was stale could now match
- Autocorrect changes the input value
- The same query is issued twice with different intents

Using a monotonically increasing request ID is unambiguous: higher IDs always mean later requests.

---

## Diagrams

### CJK composition event flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User types "nihao" in Pinyin mode         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  compositionstart   │  isComposing = true
              │  e.data = "n"       │  buffer = "n"
              └────────┬────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    ▼                  ▼                  ▼
input event       input event       input event
"data: ni"        "data: nih"       "data: niha"
⬇                 ⬇                 ⬇
CHECK:            CHECK:            CHECK:
isComposing?      isComposing?      isComposing?
= YES → SKIP     = YES → SKIP      = YES → SKIP
    │                  │                  │
    └──────────────────┼──────────────────┘
                       ▼
              ┌─────────────────────┐
              │  compositionend     │  isComposing = false
              │  e.data = "你好"    │  buffer = "你好"
              └────────┬────────────┘
                       │
              50ms debounce (DOM settling)
                       │
                       ▼
              ┌─────────────────────┐
              │  onQueryReady("你好")│  ← Single API call
              │  GET /api?q=你好    │
              └─────────────────────┘

WITHOUT this handler: 5 wasted API calls
WITH this handler:    1 API call for the actual query
```

### Stale response guard timeline

```
User types "apple" (5 chars, 100ms apart)

Timeline:
──────────────────────────────────────────────────────→

t=0     "a" typed
t=100   "ap" typed     ← abort "a" request
t=150   "a" debounce fires → Req#1 sent (ID: 1000-0)
t=200   "app" typed    ← abort Req#1 (AbortError caught)
t=350   "app" debounce fires → Req#2 sent (ID: 1001-0)
t=400   "appl" typed   ← abort Req#2
t=550   "appl" debounce fires → Req#3 sent (ID: 1002-0)
t=600   "apple" typed  ← abort Req#3
t=750   "apple" debounce fires → Req#4 sent (ID: 1003-0)
t=900   Req#4 response arrives
        currentRequestId = 1003-0 ✓
        response.requestId = 1003-0 ✓
        → Apply suggestions ✓

Edge case (without Layer 2):
t=950   Req#1 somehow arrives late (server ignored abort)
        currentRequestId = 1003-0
        response.requestId = 1000-0 ✗
        → DISCARD ✓

Final metrics: { total: 4, aborted: 3, stale: 1, applied: 1 }
```

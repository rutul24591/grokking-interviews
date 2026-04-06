# Rich Text Editor — Architecture Walkthrough

## Overview

This document provides a detailed walkthrough of the rich text editor implementation, covering the architecture, module interactions, design decisions, and extension points for collaborative editing.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     RichTextEditor                       │
│  ┌───────────────────────────────────────────────────┐   │
│  │                    Toolbar                         │   │
│  │  [B] [I] [U] [H1] [H2] [OL] [UL] [Link] [Code]   │   │
│  └───────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐   │
│  │              contentEditable div                   │   │
│  │  ┌─────────────────────────────────────────────┐  │   │
│  │  │  Paragraph with bold, italic, and @mention  │  │   │
│  │  │  [Image Placeholder — 65%]                  │  │   │
│  │  │  Heading 2                                  │  │   │
│  │  └─────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐   │
│  │            MentionDropdown (overlay)               │   │
│  │  [@john] [@jane] [@james]                         │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │    useEditor Hook      │
              │  - Input handling      │
              │  - Selection tracking  │
              │  - Mention detection   │
              │  - Image drop/paste    │
              └───────────┬───────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
  │ Editor Store │  │Mention Engine│ │Image Handler│
  │  (Zustand)   │  │              │ │              │
  │ - Document   │  │ - @detect    │ │ - Drop/Paste │
  │ - History    │  │ - Filter     │ │ - Upload     │
  │ - Selection  │  │ - Position   │ │ - Progress   │
  │ - Undo/Redo  │  │ - Insert     │ │ - Retry      │
  └──────┬───────┘  └──────────────┘  └──────────────┘
         │
  ┌──────▼──────┐
  │Content Model│
  │ - toHTML    │
  │ - toJSON    │
  │ - toMarkdown│
  └─────────────┘
```

## Module Breakdown

### 1. Type Definitions (`editor-types.ts`)

The foundation of the entire system. Defines the discriminated union types that power the document model:

- **`EditorNode`**: A union of `BlockNode`, `InlineNode`, and `TextLeaf`. Each node type carries different fields. Blocks carry type and children; inlines carry type, children, and optional URL/userId; leaves carry text and format marks.
- **`EditorState`**: The complete state of the editor — document tree, selection, active formats, history stack, and dirty flag.
- **`ToolbarAction`**: A discriminated union of all possible toolbar operations, enabling type-safe dispatching.
- **`MentionData`**: Represents a mentionable user with id, username, displayName, and optional avatar.
- **`ImageData``: Tracks image upload state (pending → uploading → complete/failed), progress percentage, and error messages.

### 2. Editor Store (`editor-store.ts`)

A Zustand store that serves as the single source of truth for all editor state. Key responsibilities:

- **Document tree**: The `root` array of `BlockNode` objects.
- **History stack**: An array of serialized document snapshots, bounded at 100 entries. The `historyIndex` tracks the current position for undo/redo.
- **Selection state**: Tracks the current cursor position (block ID and text offset) and whether the selection is collapsed.
- **Active formats**: The set of format marks (bold, italic, underline, code) active at the current cursor position, enabling the toolbar to reflect real-time state.

The store exposes actions for applying operations (which push a history snapshot before mutating), undo/redo (stack pop/push), block manipulation (update type, update content, insert after, remove), and loading external documents.

### 3. Content Model (`content-model.ts`)

Implements the document model tree and provides three serialization functions:

- **`serializeToHTML`**: Traverses the document tree and emits semantic HTML elements (`<p>`, `<h1>`–`<h4>`, `<li>`, `<pre><code>`, `<img>`, `<a>`, `<span data-mention>`). Text leaves are wrapped in appropriate formatting tags (`<strong>`, `<em>`, `<u>`, `<code>`).
- **`serializeToJSON`**: Produces a full JSON representation of the document tree, preserving all node types, metadata, and format marks. Used for storage and collaborative editing.
- **`serializeToMarkdown`**: Produces a Markdown-compatible string. Headings become `# Heading`, bold becomes `**text**`, links become `[text](url)`, images become `![alt](url)`.

Also provides factory functions for creating block nodes (paragraphs, headings, code blocks, images) and inline nodes (mentions, links).

### 4. Mention Engine (`mention-engine.ts`)

Handles the complete @mention lifecycle:

1. **Detection**: Scans the text before the cursor for an `@` trigger. Validates that there is no space between the `@` and the cursor (so `hello @world` triggers but `hello @ world` does not).
2. **Filtering**: Matches the query against usernames and display names using case-insensitive substring matching. Returns up to 8 results.
3. **Positioning**: Computes the dropdown position using `Range.getClientRects()` on the current selection. Constrains the position to the editor bounds and flips vertically if the dropdown would overflow below the editor.
4. **Keyboard Navigation**: Handles ArrowUp/ArrowDown for selection, Enter to confirm, and Escape to dismiss.
5. **Insertion**: Prepares the mention text and replacement range. The actual DOM insertion is handled by the `useEditor` hook, which replaces the `@query` text with a `<span data-mention>` element.

### 5. Image Handler (`image-handler.ts`)

Manages the complete image upload lifecycle:

1. **Extraction**: Extracts image files from drag-and-drop and clipboard paste events. Validates file type (PNG, JPEG, GIF, WebP) and size (max 10MB).
2. **Upload**: Uses `XMLHttpRequest` for native progress events (`upload.onprogress`). Creates a blob URL for the placeholder during upload.
3. **Progress Tracking**: Reports progress percentage via callbacks. The `ImagePlaceholder` component renders a progress bar.
4. **Retry Logic**: Failed uploads can be retried with exponential backoff (1s, 2s, 4s) for up to 3 attempts.
5. **Status Management**: Provides pure functions for creating, updating, and completing `ImageData` objects.

### 6. useEditor Hook (`use-editor.ts`)

The core integration hook that wires together all modules:

- **Input handling**: Captures input events on the `contentEditable` div, extracts text before the cursor, and triggers mention detection.
- **Selection tracking**: Listens to `selectionchange` events, walks up the DOM tree to detect active formats (checking for `<strong>`, `<em>`, `<u>`, `<code>` elements), and updates the store.
- **Keyboard shortcuts**: Handles Ctrl+Z (undo), Ctrl+Shift+Z (redo), and mention dropdown navigation (Arrow keys, Enter, Escape).
- **Image handling**: Processes drag-and-drop and paste events for image files, creates `ImageData` objects, starts uploads, and tracks progress in local state.
- **Mention insertion**: Replaces the `@query` text with a `<span data-mention>` element, updates the document model, and closes the dropdown.

### 7. useToolbar Hook (`use-toolbar.ts`)

A thin hook that subscribes to the store's active format state and exposes a `dispatch` function. The dispatch function maps `ToolbarAction` types to `document.execCommand` calls (for standard formatting) or custom logic (for code blocks, which require block-level conversion).

### 8. RichTextEditor Component (`rich-text-editor.tsx`)

The root component that renders the `contentEditable` div and wires it to the `useEditor` hook. Key features:

- **SSR safety**: Returns a loading placeholder during server rendering and hydrates on the client via `useEffect`.
- **Accessibility**: The `contentEditable` div has `role="textbox"`, `aria-multiline="true"`, and `aria-label="Rich text editor"`.
- **Child rendering**: Conditionally renders the `MentionDropdown` when the mention state is open.

### 9. Toolbar Component (`toolbar.tsx`)

Renders the formatting toolbar with buttons for each action. Key features:

- **Active state indicators**: Each button highlights when its format is active (e.g., the Bold button is highlighted when the cursor is inside bold text).
- **Accessibility**: All buttons are native `<button>` elements with `aria-label` and `aria-pressed` attributes. The toolbar container has `role="toolbar"`.
- **Inline SVG icons**: Each button uses an inline SVG icon (no external dependencies).

### 10. MentionDropdown Component (`mention-dropdown.tsx`)

Renders the @mention autocomplete dropdown. Key features:

- **Keyboard navigation**: Arrow keys move the highlighted option, Enter selects, Escape dismisses.
- **Accessibility**: Uses `role="listbox"` with `role="option"` for each item and `aria-selected` for the highlighted option.
- **Visual design**: Renders user avatars (or initials as fallback), display names, and usernames.

### 11. ImagePlaceholder Component (`image-placeholder.tsx`)

Renders the inline image upload state. Three states:

- **Uploading**: Progress bar with percentage and a pulsing upload icon.
- **Complete**: Renders the actual image in a `<figure>` element.
- **Failed**: Error message with retry and remove buttons.

All states use `role="status"` and `aria-live="polite"` for screen reader announcements.

## Extension Points for Collaborative Editing

The editor is designed to integrate with CRDT/OT-based collaborative editing systems:

1. **`EditorConfig.collaborative`**: A flag that enables collaborative mode.
2. **`onRemoteOperation`**: A callback that receives remote operations from the CRDT/OT layer and applies them to the document model.
3. **`onPresenceUpdate`**: A callback that receives remote cursor positions and renders presence cursors as overlay elements.
4. **`getLocalOperations`** (not implemented in this stub): Would export the local operation log for the CRDT/OT layer to send to the server.

The integration flow:
- The editor sends local operations to the CRDT/OT layer.
- The CRDT/OT layer transforms operations against concurrent remote operations.
- The resolved operations are passed back to the editor via `onRemoteOperation`.
- The editor applies the resolved operations to the document model and re-renders.

## Performance Considerations

- **Debounced model sync**: Document model updates are debounced at 150ms to avoid excessive store mutations during rapid typing.
- **Bounded history stack**: The history stack is capped at 100 entries to prevent unbounded memory growth.
- **Selector-based subscriptions**: Each component subscribes only to the slice of state it needs, preventing unnecessary re-renders.
- **Virtualized rendering** (for large documents): Not implemented in this version but supported by the block-based document model — blocks can be rendered using react-virtuoso or a custom virtualization layer.

## Security Considerations

- **HTML sanitization**: All HTML output is escaped using `escapeHTML` and `escapeAttr` functions. In production, use DOMPurify for sanitizing pasted HTML.
- **Image validation**: Only PNG, JPEG, GIF, and WebP images are accepted, with a 10MB size limit.
- **Link validation**: Links should be validated to ensure they use safe protocols (http, https, mailto) and reject `javascript:` URLs.

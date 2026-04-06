# WYSIWYG Email Template Builder — Implementation

## Key Decisions
1. **Block-based document model** — Ordered array of typed blocks (text, image, button, etc.)
2. **Table-based HTML generation** — Email client compatibility (Gmail, Outlook)
3. **All styles inlined** — No CSS classes, no <style> tags (Gmail strips them)
4. **Iframe preview** — Accurate rendering of generated HTML at different viewports

## File Structure
- `lib/email-types.ts` — Block discriminated union, Template types
- `lib/template-store.ts` — Zustand store with block array, undo/redo
- `lib/html-generator.ts` — Block → table-based HTML with inline styles
- `lib/variable-parser.ts` — Extracts {{variable}} tokens, validates against known list
- `hooks/use-template.ts` — Main builder hook
- `hooks/use-block-drag.ts` — Drag from palette to canvas, reorder within canvas
- `components/email-builder.tsx` — Root builder with palette, canvas, properties panel
- `components/block-palette.tsx` — Draggable block types
- `components/email-canvas.tsx` — Drop zone, block rendering, reorder handles
- `components/block-editor.tsx` — Property panel for selected block
- `components/preview-panel.tsx` — Iframe at desktop/tablet/mobile widths
- `EXPLANATION.md`

## Testing
- Unit: HTML generator (each block type), variable substitution, undo/redo
- Integration: drag block → appears, edit → preview updates, export → valid email HTML
- Accessibility: keyboard block navigation, screen reader announces block content

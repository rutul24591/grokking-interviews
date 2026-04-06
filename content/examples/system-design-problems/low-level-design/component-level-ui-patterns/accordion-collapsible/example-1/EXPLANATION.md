# Accordion / Collapsible Section — Implementation

## Key Decisions
1. **CSS grid-template-rows transition** — 0fr → 1fr for smooth height animation without JS measurement
2. **React Context** — exclusive mode tracks single open ID, independent mode tracks Set of open IDs
3. **Compound component pattern** — Accordion, Accordion.Item, Accordion.Header, Accordion.Panel

## File Structure
- `lib/accordion-types.ts` — AccordionMode, AccordionContext types
- `lib/accordion-store.ts` — Zustand store for open state management
- `hooks/use-accordion.ts` — Main hook with exclusive/independent mode logic
- `hooks/use-accordion-item.ts` — Per-item hook with expand/collapse, animation state
- `components/accordion.tsx` — Root accordion with context provider
- `components/accordion-item.tsx` — Item with header button, animated panel
- `components/accordion-header.tsx` — Button with aria-expanded, chevron rotation
- `components/accordion-panel.tsx` — Content panel with grid-row animation
- `EXPLANATION.md`

## Testing
- Unit: exclusive mode (one open), independent mode (multiple open), toggle same item
- Integration: click header → aria-expanded changes → content visible after animation
- Accessibility: axe-core, keyboard nav, screen reader announces expanded/collapsed

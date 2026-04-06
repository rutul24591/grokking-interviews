# Stepper / Progress Tracker — Implementation

## Key Decisions
1. **State machine** for step transitions — explicit rules prevent invalid transitions
2. **Zustand store** — step states, validation results, persistence
3. **Skip logic** — predicate-based conditional routing between steps
4. **Persistence with staleness** — versioned localStorage, 30-day expiry prompt

## File Structure
- `lib/stepper-types.ts` — Step, StepState types
- `lib/stepper-store.ts` — Zustand store with step state machine
- `lib/step-transition-machine.ts` — Validates transitions, skip logic
- `hooks/use-stepper.ts` — Main orchestrator hook
- `components/stepper.tsx` — Root stepper with step indicators, connecting lines
- `components/step-indicator.tsx` — Individual step circle with checkmark/number
- `EXPLANATION.md`

## Testing
- Unit: transition machine (valid/invalid), skip predicates
- Integration: complete step → advance, validation gate, persistence restore
- Accessibility: aria-current, keyboard navigation, screen reader announcements

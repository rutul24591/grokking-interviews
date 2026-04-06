# Color Picker Component — Implementation

## Key Decisions
1. **HSV internal model** — Easiest for visual manipulation, bidirectional conversion to hex/RGB/HSL
2. **Canvas HSV area** — 2D gradient (saturation × value), high-DPI aware
3. **WCAG contrast checker** — Relative luminance, AA/AAA compliance for normal/large text
4. **localStorage palette persistence** — Versioned schema, corruption handling

## File Structure
- `lib/color-types.ts` — HSV, RGB, HSL, ColorState types
- `lib/color-converter.ts` — HSV↔RGB, RGB↔HSL, RGB↔Hex pure functions
- `lib/contrast-checker.ts` — WCAG 2.1 luminance, contrast ratio, AA/AAA check
- `hooks/use-color-picker.ts` — Main hook with HSV state, format conversion
- `hooks/use-palette.ts` — Saved palette with localStorage persistence
- `components/color-picker.tsx` — Root picker with HSV area, sliders, inputs
- `components/hsv-area.tsx` — Canvas-rendered saturation/value gradient
- `components/hue-slider.tsx` — Horizontal rainbow gradient slider
- `components/alpha-slider.tsx` — Transparency with checkerboard
- `components/color-inputs.tsx` — Hex, RGB, HSL input fields
- `components/contrast-checker.tsx` — Real-time AA/AAA badge display
- `components/palette.tsx` — Saved colors grid with add/delete
- `EXPLANATION.md`

## Testing
- Unit: color conversions (round-trip), contrast ratio against WCAG test cases
- Integration: drag HSV area → hex updates, hue slider → area re-renders, save palette
- Accessibility: keyboard sliders, screen reader announces hex value

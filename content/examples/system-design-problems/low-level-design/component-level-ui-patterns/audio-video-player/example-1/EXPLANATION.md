# Audio/Video Player — Implementation

## Key Decisions
1. **HTML5 media element + custom controls** — Unified API for video/audio
2. **Zustand state sync** — Media events mirror to store, debounced timeupdate at 100ms
3. **HLS.js for streaming** — Adaptive bitrate, manifest parsing
4. **WebVTT caption parsing** — Custom renderer synced to currentTime

## File Structure
- `lib/player-types.ts` — PlayerState, Caption types
- `lib/media-engine.ts` — HTML5 video/audio wrapper, HLS.js init
- `lib/state-sync.ts` — Media event → Zustand store synchronization
- `lib/caption-parser.ts` — WebVTT parsing, cue timing
- `hooks/use-player.ts` — Main player hook
- `hooks/use-keyboard.ts` — Keyboard shortcuts (Space, arrows, M, C, F)
- `components/media-player.tsx` — Root player with video element, controls overlay
- `components/seek-bar.tsx` — Custom slider with buffered overlay, playhead
- `components/control-bar.tsx` — Play/pause, volume, speed, captions, fullscreen
- `components/caption-overlay.tsx` — WebVTT caption rendering
- `EXPLANATION.md`

## Testing
- Unit: state sync (events → store), seek bar (time↔position), caption parser
- Integration: play → state updates, seek → currentTime changes, captions toggle → overlay renders
- Accessibility: all controls keyboard accessible, aria-live for state changes

# Map-based UI — Implementation

## Key Decisions
1. **Mapbox GL JS** — GPU-accelerated vector tiles, native symbol layers for 100K+ points
2. **Supercluster** — Grid-based clustering, precomputed tree for O(1) zoom changes
3. **Viewport search** — On map moveend, filter markers within bounds
4. **Geofence as GeoJSON** — Polygon rendering via map's fill layer

## File Structure
- `lib/map-types.ts` — Marker, Geofence, MapState types
- `lib/map-store.ts` — Zustand store with markers, viewport, selected marker
- `lib/cluster-engine.ts` — Supercluster wrapper for marker grouping
- `lib/viewport-search.ts` — Bounds-based marker filtering
- `hooks/use-map.ts` — Main map hook with Mapbox initialization
- `hooks/use-markers.ts` — Marker CRUD, click handlers
- `components/map-view.tsx` — Root map with tile layer, controls
- `components/marker-layer.tsx` — Symbol layer for GPU-rendered markers
- `components/marker-popup.tsx` — Info popup on marker click
- `components/geofence-layer.tsx` — GeoJSON polygon rendering
- `components/map-search.tsx` — Geocoding search bar
- `EXPLANATION.md`

## Testing
- Unit: clustering algorithm, viewport search, geofence polygon validation
- Integration: zoom → clusters form, click cluster → zoom to bounds, pan → viewport search updates
- Accessibility: list view alternative, keyboard marker navigation

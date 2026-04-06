"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-map-based-ui",
  title: "Design a Map-based UI",
  description:
    "Map-based UI with markers, clustering, geofencing, viewport search, and Mapbox/Google Maps integration.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "map-based-ui",
  wordCount: 3200,
  readingTime: 18,
  lastUpdated: "2026-04-03",
  tags: ["lld", "map", "markers", "clustering", "geofencing", "viewport-search"],
  relatedTopics: ["file-explorer-ui", "dashboard-builder", "image-gallery-lightbox"],
};

export default function MapBasedUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a map-based UI — an interactive map component with markers
          for points of interest, marker clustering for dense areas, geofencing
          (visual boundaries), search within the current viewport, and integration
          with a mapping provider (Mapbox or Google Maps).
        </p>
        <p>
          <strong>Assumptions:</strong> The map displays geographic data with interactive
          markers. Clustering groups nearby markers when zoomed out. Geofencing draws
          polygon boundaries on the map. Viewport search filters markers visible in the
          current map bounds. The component is used in a React 19+ SPA.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Map Display:</strong> Interactive map with pan, zoom, and tile rendering via Mapbox GL or Google Maps.</li>
          <li><strong>Markers:</strong> Custom marker icons at geographic coordinates, click handler for info popup.</li>
          <li><strong>Clustering:</strong> Nearby markers grouped into clusters when zoomed out. Cluster shows count. Clicking cluster zooms in.</li>
          <li><strong>Geofencing:</strong> Draw polygon boundaries on the map (e.g., delivery zones, service areas).</li>
          <li><strong>Viewport Search:</strong> Filter markers based on current map bounds. Update results as user pans/zooms.</li>
          <li><strong>Info Popup:</strong> Click marker shows popup with details, action buttons, and close control.</li>
          <li><strong>Search Bar:</strong> Geocoding search — type address, get marker location on map.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> 10,000+ markers render smoothly. Clustering at 60fps during zoom.</li>
          <li><strong>Accessibility:</strong> Keyboard navigation between markers, screen reader announces marker details.</li>
          <li><strong>Offline:</strong> Cached tiles for previously viewed areas. Markers stored locally.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Marker at the same coordinate as another — offset markers slightly to prevent overlap.</li>
          <li>Geofence polygon crosses the antimeridian (180°/-180°) — must handle wrapping correctly.</li>
          <li>Map loads in a hidden container (e.g., tab) — must resize when container becomes visible.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>map wrapper component</strong> that initializes a
          Mapbox GL or Google Maps instance and manages markers, clusters, and geofences
          as map layers. A <strong>Zustand store</strong> manages the marker data,
          current viewport bounds, selected marker, and active geofence. Marker
          clustering uses a grid-based algorithm (supercluster) that groups markers
          within a pixel radius at each zoom level.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Store</h4>
          <p><code>Marker</code> (id, lat, lng, title, icon, data), <code>Geofence</code> (id, name, polygon coordinates, color). Store: markers array, viewport bounds, selected marker, active geofences.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Marker Manager</h4>
          <p>Adds/removes/updates markers on the map. Handles marker click events, info popup rendering, and marker offset for overlapping coordinates.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Cluster Engine</h4>
          <p>Uses supercluster algorithm: grid-based clustering with configurable radius and zoom-dependent grouping. Returns clusters with marker counts.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Viewport Search</h4>
          <p>On map moveend/zoomend, gets current bounds, filters markers within bounds, triggers re-render of visible markers.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/map-based-ui-architecture.svg"
          alt="Map-based UI architecture showing marker clustering, viewport filtering, and info popup rendering"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Map initializes with tile layer and zoom controls.</li>
          <li>Markers loaded from API, added to map as point features.</li>
          <li>Cluster engine groups markers at current zoom level.</li>
          <li>User zooms out: clusters recompute, markers replaced with cluster circles showing count.</li>
          <li>User clicks cluster: map zooms in to cluster bounds, clusters expand to individual markers.</li>
          <li>User clicks marker: info popup renders with marker details.</li>
          <li>User pans map: viewport search filters visible markers, sidebar updates.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Data flow: API fetch → store markers → cluster engine computes clusters →
          map renders → user interaction (zoom/pan/click) → viewport search → UI update.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Overlapping markers:</strong> Markers at the same coordinate are offset by a small random amount (jitter) within a 10px radius. The info popup lists all markers at that location.</li>
          <li><strong>Antimeridian crossing:</strong> Polygon coordinates are normalized to -180 to 180 range. If a polygon crosses the antimeridian, it is split into two polygons (one on each side).</li>
          <li><strong>Hidden container:</strong> Use ResizeObserver on the map container. When the container size changes from 0 to non-zero, call map.resize().</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Key approach: Mapbox GL JS for map rendering (GPU-accelerated vector tiles),
          supercluster for marker clustering, viewport-based marker filtering, and
          geofence polygon rendering with GeoJSON.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Clustering</td><td className="p-2">O(n) — supercluster linear scan</td><td className="p-2">O(n) — cluster tree</td></tr>
              <tr><td className="p-2">Viewport search</td><td className="p-2">O(n) — bounds check per marker</td><td className="p-2">O(m) — m visible markers</td></tr>
              <tr><td className="p-2">Marker render</td><td className="p-2">O(m) — m visible markers</td><td className="p-2">O(m)</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks &amp; Optimizations</h3>
        <ul className="space-y-2">
          <li><strong>10,000+ markers:</strong> Use map&apos;s native symbol layer (GPU-rendered) instead of DOM markers. Mapbox GL renders 100K+ points smoothly.</li>
          <li><strong>Clustering during zoom:</strong> Supercluster precomputes the cluster tree. Zoom changes only traverse the tree — no recalculation needed.</li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <p>
          Map tiles are loaded from trusted CDN. Geocoding search queries are sanitized
          before sending to the API. For accessibility, provide a list view alternative
          (markers as a sortable/filterable table for screen reader users). Keyboard
          navigation: Tab cycles through markers, Enter opens info popup. Announce
          marker details via aria-live regions.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <li><strong>Unit:</strong> Clustering algorithm — test with known marker positions, verify cluster grouping at different zoom levels. Viewport search — test bounds containment.</li>
          <li><strong>Integration:</strong> Pan map, verify viewport search updates. Zoom out, verify clusters form. Click cluster, verify zoom to bounds.</li>
          <li><strong>Accessibility:</strong> Keyboard navigation between markers, screen reader announces marker details, list view alternative renders correctly.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>DOM markers for large datasets:</strong> Rendering 10,000 markers as DOM elements causes severe jank. Native symbol layers (GPU) are essential.</li>
          <li><strong>No clustering:</strong> Dense marker areas are unreadable. Clustering is mandatory for datasets exceeding 100 markers.</li>
          <li><strong>No list view alternative:</strong> Maps are inherently inaccessible to screen reader users. A parallel list/table view is essential for accessibility.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement real-time marker updates (e.g., live vehicle tracking)?</p>
            <p className="mt-2 text-sm">
              A: Use WebSocket to receive position updates. For smooth movement,
              interpolate between the old and new positions using CSS transitions or
              requestAnimationFrame. Batch updates at 1-second intervals to avoid
              overwhelming the rendering pipeline.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement route drawing between two markers?</p>
            <p className="mt-2 text-sm">
              A: Use a routing API (Mapbox Directions, Google Directions) to get the
              route geometry (GeoJSON LineString). Render as a polyline layer on the
              map with a distinct color and width. Show turn-by-turn instructions in a
              sidebar panel.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle offline map usage?</p>
            <p className="mt-2 text-sm">
              A: Cache map tiles in IndexedDB as the user pans/zooms. Store marker data
              locally. When offline, serve cached tiles and local markers. Use a Service
              Worker to intercept tile requests and respond from cache. Show an &quot;offline
              mode&quot; indicator.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement heat maps for marker density?</p>
            <p className="mt-2 text-sm">
              A: Use the map&apos;s heatmap layer (Mapbox GL supports this natively).
              Convert marker positions to a point dataset. The heatmap layer computes
              kernel density estimation and renders a color gradient. Configure radius,
              weight, and color stops for the desired visual effect.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://docs.mapbox.com/mapbox-gl-js/api/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mapbox GL JS API Documentation
            </a>
          </li>
          <li>
            <a href="https://github.com/mapbox/supercluster" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Supercluster — Fast Geospatial Point Clustering
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Landmark Roles — Map Accessibility
            </a>
          </li>
          <li>
            <a href="https://docs.mapbox.com/help/tutorials/heatmap-layer/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Mapbox — Heatmap Layer Tutorial
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

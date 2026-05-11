"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-map-based-ui-system",
  title: "Design a Map-Based UI System (Markers, Clustering, Viewport Queries)",
  description:
    "Production-grade mapping interface with marker clustering, debounced viewport queries, WebGL rendering, and real-time location updates.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "map-based-ui-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "mapping", "markers", "clustering", "geospatial"],
  relatedTopics: ["observer-apis", "telemetry-analytics-pipeline"],
};

export default function MapBasedUISystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">Map-based UIs are used across a wide range of applications: delivery tracking (show driver locations), property search (show listings in the visible area), logistics (show warehouse and route data), social apps (show nearby users or events). The core challenge in all of these is performance: naively rendering every marker for every data point in the database would mean tens of thousands of DOM elements or canvas draw calls for applications with significant data, making the map laggy and unusable.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The solution requires two coordinated strategies. On the data side: only load markers for the currently visible viewport (bounding box query to the server, not a full dataset load). On the rendering side: for high-density data, cluster nearby markers into aggregate markers at lower zoom levels (showing "47 restaurants in this area" instead of 47 individual pins), and expand to individual markers as the user zooms in. Both strategies must update smoothly as the user pans and zooms, without jank or loading gaps.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> The mapping library is Mapbox GL JS (WebGL-based, handles large marker counts efficiently). Data points have a latitude/longitude and associated metadata. The server supports bounding box queries (WHERE lat BETWEEN south AND north AND lng BETWEEN west AND east) with spatial indexing (PostGIS, Elasticsearch geo_shape). Clustering uses the Supercluster library (client-side spatial clustering for viewports up to ~100,000 points). Real-time location updates are delivered via WebSocket for live-tracking use cases.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Viewport-based data loading:</strong> Only load markers for the currently visible map area. Reload when the viewport changes (pan or zoom) with debounce.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Marker clustering:</strong> Group nearby markers into cluster markers at lower zoom levels. Show count badge on cluster. Zoom to cluster on click.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Marker interaction:</strong> Click individual marker to show a popup with details. Hover to show a tooltip. Selected marker highlighted.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Real-time updates:</strong> Live-tracking markers (delivery drivers, vehicles) update their position in real-time without reloading all markers.</HighlightBlock>
          <li><strong>Filter integration:</strong> Active filters (category, date range, status) are applied to the viewport query. Changing a filter reloads markers for the current viewport.</li>
          <li><strong>URL state sync:</strong> Map center, zoom level, and selected marker ID are encoded in the URL for shareability and back-button support.</li>
          <li><strong>List-map sync:</strong> Clicking a result in an adjacent list view pans the map to that marker and shows its popup. Hovering a list item highlights the corresponding marker.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Render performance:</strong> Up to 10,000 markers in the viewport rendered without frame drops (WebGL-based rendering, not DOM markers).</li>
          <HighlightBlock as="li" tier="crucial"><strong>Viewport query latency:</strong> Bounding box query returns within 500ms for viewports up to city scale.</HighlightBlock>
          <li><strong>Clustering responsiveness:</strong> Cluster computation runs synchronously (or in a Web Worker) without causing visible jank during zoom transitions.</li>
          <li><strong>Real-time update rate:</strong> Live markers update position up to 2 times per second without accumulating update lag.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The map renders using Mapbox GL JS, which uses WebGL for the base tiles and a GeoJSON source layer for custom markers. All markers are in a single GeoJSON FeatureCollection; Mapbox renders them efficiently in a single WebGL draw call rather than creating one DOM element per marker. The clustering layer wraps this GeoJSON source with Mapbox's built-in clustering (which uses Supercluster under the hood) to automatically merge nearby points into clusters at lower zoom levels.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">When the map viewport changes (pan or zoom ends), the application reads the new bounding box and fires a debounced query to the server. The server returns GeoJSON features for all data points within the bounding box. The client updates the GeoJSON source; Mapbox re-renders the layer. The debounce prevents a flood of queries during continuous pan/zoom interactions—the query fires 300ms after the last viewport change event.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Live-tracking markers (delivery drivers, for example) are managed separately from the static marker layer. They are stored in a separate GeoJSON source updated via WebSocket events. Position updates modify only the relevant feature's coordinates in the GeoJSON source, not the entire source. Mapbox re-renders only the affected layer section.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/map-based-ui-system.svg"
          alt="Map-based UI system showing Supercluster algorithm for marker clustering, debounced viewport bounding box queries, WebGL GeoJSON layer rendering, real-time marker updates via WebSocket, and list-map synchronization"
          caption="Map-based UI system showing Supercluster algorithm for marker clustering, debounced viewport bounding box queries, WebGL GeoJSON layer rendering, real-time marker updates via WebSocket, and list-map synchronization"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design a Map-Based UI System (Markers, Clustering, Viewport Queries)</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Viewport Query and Bounding Box</h3>
        <p>Mapbox provides map.getBounds() which returns the current viewport as a LatLngBounds object with southwest and northeast corners. The bounding box query sends {"{"}south, north, west, east{"}"} to the server. The server queries the spatial database: SELECT * FROM locations WHERE lat BETWEEN south AND north AND lng BETWEEN west AND east AND [active filters]. A spatial index (PostGIS's GIST index on a geography column, or Elasticsearch's geo_bounding_box query) makes this query fast even for millions of records.</p>
        <HighlightBlock as="p" tier="crucial">The bounding box query is debounced at 300ms after the last viewport change. Mapbox fires moveend and zoomend events when panning and zooming complete; the query fires on these events with a 300ms debounce. During rapid pan/zoom, multiple moveend events fire in quick succession—the debounce ensures only the final viewport position triggers a query. A loading indicator (a small spinner in the map corner) appears when a query is in flight and disappears when the data updates.</HighlightBlock>
        <p>Stale data management: when the user pans to a new area, there is a loading gap where the old area's markers are still visible while the new area's data is being fetched. Options: (1) clear all markers immediately and show a loading skeleton (abrupt, but prevents stale markers from misleading the user); (2) keep old markers visible until new data arrives (avoids flash but may show irrelevant markers briefly); (3) fade out old markers and fade in new markers. For most applications, option 2 (keep until new data arrives) provides the best perceived performance, as the query is typically fast enough that the stale period is imperceptible.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Marker Clustering with Supercluster</h3>
        <p>Supercluster is a high-performance JavaScript library for geospatial point clustering. It takes a GeoJSON FeatureCollection of points and, for a given zoom level and bounding box, returns a new GeoJSON FeatureCollection where nearby points are replaced by cluster points (each cluster point has a count property and the bounding box of its members). Supercluster uses a k-d tree internally, making cluster queries O(log n) after the initial index build O(n log n).</p>
        <p>Mapbox GL JS has built-in clustering support that uses Supercluster. By setting cluster: true on the GeoJSON source, Mapbox automatically clusters points at lower zoom levels. The clusterRadius (in pixels) and clusterMaxZoom (the zoom level at which clustering stops and individual points show) are configurable. Typical values: clusterRadius: 50 (50 pixels radius for clustering), clusterMaxZoom: 14 (at zoom 14+, show individual markers; below 14, cluster).</p>
        <p>Custom cluster markers: Mapbox's default cluster marker is a circle with a number. Custom cluster markers (showing a category icon, a size-proportional circle, or a pie chart of category breakdown) require rendering to a canvas and using it as a Mapbox icon. For highly interactive cluster markers (progress bars, multi-category breakdown charts), rendering to a canvas and using map.addImage() is the correct approach—creating HTML div elements per cluster marker and using Mapbox's Marker API would create thousands of DOM elements at low zoom levels, defeating the purpose of clustering.</p>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">WebGL Marker Rendering</h3>
	        <HighlightBlock as="p" tier="important">Mapbox GL JS renders all GeoJSON features as WebGL draw calls. A GeoJSON FeatureCollection with 10,000 points renders as a single draw call with 10,000 point vertices—far more efficient than 10,000 DOM elements. Marker icons are packed into a sprite atlas (a single image containing all icon variants) and referenced by a sprite index. The rendering engine maps each feature's icon-image property to the correct sprite region.</HighlightBlock>
	        <p>Custom marker shapes (SVG icons, custom images) must be added to Mapbox's image atlas before use. The runtime loads the image once, registers it under a stable identifier, and the GeoJSON features reference that identifier in their layout configuration. Because all features that share the same icon point to the same atlas entry, you avoid per-marker downloads and keep GPU uploads bounded. Marker appearance can be driven directly from feature properties using data-driven styling: for example, you can map a priority property to a size range so higher priority markers render larger. This happens inside the WebGL pipeline, avoiding per-frame JavaScript work.</p>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Marker Updates</h3>
	        <p>For live-tracking use cases (delivery drivers, fleet vehicles, user presence), markers update their position in real-time via WebSocket. Each position update event includes the marker identifier, new coordinates, optional heading, and a timestamp. The client applies the update by locating the corresponding feature in the live GeoJSON source, updating its coordinates, and pushing an updated dataset into the map source so the renderer can draw the marker at the new position.</p>
        <HighlightBlock as="p" tier="important">Efficient position update handling: calling setData() with the full FeatureCollection on every position update is O(n) data transfer per update (where n is the number of features). For large numbers of live markers (100+ drivers), this is expensive. Mapbox GL JS supports partial GeoJSON source updates via updateData() (in newer versions), which allows updating individual features without replacing the entire source. If updateData() is not available, the alternative is to maintain the live markers as a separate GeoJSON source from the static markers—the live source has fewer features and can be fully replaced more cheaply.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Smooth position animation: receiving a position update and instantly teleporting the marker to the new position looks jarring. Interpolating the marker's position between the old coordinates and the new coordinates over the update interval (e.g., interpolate over 500ms if updates arrive every second) creates the appearance of smooth motion. This is implemented using requestAnimationFrame to lerp the coordinates at 60fps and calling setData() on each animation frame. The interpolation must be stopped if a new update arrives mid-interpolation (replace the target coordinates and continue interpolating to the new target).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">List-Map Synchronization</h3>
        <p>Many map applications show a list of results (property listings, restaurant search results) alongside the map. These two views must stay synchronized: hovering a list item highlights the corresponding map marker; clicking a map marker highlights and scrolls the list to the corresponding list item.</p>
	        <p>Synchronization is implemented through shared selection state (a selectedMarkerId in a context or store). Hovering a list item sets hoveredMarkerId, which the map layer reads to apply a highlight style to the corresponding marker (increase icon size, change icon color). Clicking a map marker sets selectedMarkerId, which the list view reads to smoothly scroll the corresponding item into view. The state flows: user interaction leads to a shared state update, and both views re-render from that shared state.</p>
        <HighlightBlock as="p" tier="important">For the list view to scroll to a list item without layout shifts, the list must be virtualized (only rendering visible items). Finding and scrolling to a specific item in a virtualized list requires the virtualization library's scrollToIndex() API (react-virtual or react-window provide this). The list must maintain a stable mapping from markerId to list index; this mapping is computed when the list data loads and updated on viewport query refresh.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">URL State for Map</h3>
        <p>The URL encodes: map center (lat, lng), zoom level, and selected marker ID. On map mount, the URL state is parsed and used to initialize the map view. On map interactions (pan, zoom, marker selection), the URL is updated (using history.replaceState for viewport changes to avoid cluttering the browser history, and history.pushState for marker selections so the back button deselects the marker). This allows bookmarking a specific map view and sharing it—the recipient opens the map at the same center, zoom, and selected marker.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Client-side clustering versus server-side clustering: client-side clustering (Supercluster on the data returned from the server) is simpler—the client applies clustering to whatever the server returns. Server-side clustering (the server returns pre-clustered data based on the zoom level) reduces the data volume sent to the client (especially useful when the viewport contains millions of points that cannot all be sent client-side). For most applications (up to ~100,000 points in a viewport), client-side clustering is sufficient. For truly massive datasets, server-side clustering (using PostGIS's ST_Collect or Elasticsearch's geo_tile aggregation) is necessary.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">DOM markers versus WebGL markers: Mapbox GL JS supports two marker types: HTML markers (Mapbox Marker API, each marker is a DOM element) and GeoJSON layer markers (WebGL). HTML markers support richer interactivity (full HTML/CSS, React components) but do not scale past ~1000 markers without significant performance impact. WebGL markers scale to millions of points but support only what Mapbox's data-driven styling can express. The decision rule: use WebGL markers for any application that might show hundreds or thousands of markers simultaneously; use HTML markers only for applications that will always have fewer than 50 markers or need very custom interactivity (embedded React component in a marker popup).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Viewport query versus static full dataset: if the total dataset is small (under 5000 points), loading the entire dataset once and filtering client-side is simpler than viewport queries and eliminates loading gaps during pan. This works for property search with a small inventory or a delivery dashboard with fewer than 1000 active drivers. For larger datasets, viewport queries are necessary.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">List-map synchronization uses shared selectedMarkerId state, with map layers applying data-driven highlight styles and the list using virtualized scrollToIndex for large result</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">sets. URL encoding of center, zoom, and selected marker makes map views bookmarkable and shareable. The defining performance constraint is the WebGL render path: keeping all markers in GeoJSON sources (not DOM elements) and using Mapbox's data-driven styling for appearance variations enables scaling to tens of thousands of visible markers at interactive frame rates.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

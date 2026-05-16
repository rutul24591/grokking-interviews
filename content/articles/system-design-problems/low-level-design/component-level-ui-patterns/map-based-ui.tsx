"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-map-based-ui",
  title: "Design a Map-based UI",
  description:
    "Map-based UI with tile rendering, marker clustering, viewport-driven data fetching, geofencing, custom overlays, and performance at scale.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "map-based-ui",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "map", "Mapbox", "tile-server", "marker-clustering", "geofencing", "WebGL", "viewport-search"],
  relatedTopics: ["file-explorer-ui", "dashboard-builder", "image-gallery-lightbox"],
};

export default function MapBasedUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Map-based UIs are a staple of real estate, logistics, food delivery, and
        ridesharing products. Building a production-quality map component requires
        understanding how tile servers work, how WebGL-based map renderers differ
        from SVG-based ones, how to efficiently cluster thousands of markers without
        layout thrashing, how to drive data fetching from the viewport, and how to
        keep the React layer synchronized with the map library's imperative API.
        The gap between a demo and a production map is measured in thousands of markers
        and the ability to handle them without dropping frames.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/map-based-ui-architecture.svg"
        alt="Map-based UI architecture diagram"
        caption="Map UI architecture: tile rendering, viewport-driven data fetching, marker clustering, and geofencing"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        Map UIs vary enormously in complexity. Start with the data scale: how many
        markers? A real estate map with 50 listings per viewport is trivially managed
        with a standard marker API. A logistics dashboard showing 50,000 active
        delivery vehicles simultaneously requires a fundamentally different approach
        (WebGL-rendered markers, server-side spatial aggregation, or canvas-based
        rendering).
      </p>
      <p>
        What does a marker represent? A static point of interest (restaurant location —
        never moves) versus a dynamic entity (delivery driver — updates every 10 seconds)
        requires different update strategies. Real-time moving markers need a WebSocket
        feed and smooth interpolation between position updates.
      </p>
      <p>
        What interactions are needed? Clicking a marker to show a detail popup is
        standard. Drawing geofences (polygon regions on the map) is a significantly
        more complex interaction requiring a polygon drawing tool, vertex dragging,
        and polygon coordinate persistence. Route display (a polyline drawn between
        waypoints) requires decoding Google Directions API or similar responses.
      </p>
      <p>
        Which map provider? Mapbox GL JS (WebGL-based, customizable, expensive at scale),
        Google Maps (widely known, constrained styling), Leaflet (open-source, older
        SVG/canvas-based, free), or OpenLayers (open-source, powerful, complex API).
        The choice affects what features are available natively and what must be built
        on top.
      </p>

      <h2>Tile Rendering Architecture</h2>
      <p>
        Map renderers display the world by fetching and compositing map tiles — raster
        images (PNG/JPEG) or vector data (Protobuf Mapbox Vector Tiles) for each
        zoom level and geographic area. The tile coordinate system uses (z, x, y) where
        z is the zoom level and x/y identify the tile column and row.
      </p>
      <p>
        WebGL-based renderers (Mapbox GL JS, MapLibre GL JS) load vector tiles and
        render them entirely in the GPU. The rendering pipeline: fetch vector tile
        data as binary Protobuf, decode it in a Web Worker (keeping the main thread
        free), transfer the decoded geometry to the GPU as vertex buffers, and render
        using WebGL draw calls. This produces smooth 60fps pan and zoom because the
        GPU handles the rendering; the CPU only fetches and decodes tiles.
      </p>
      <p>
        Raster-based renderers (classic Google Maps, Leaflet with raster tiles) fetch
        pre-rendered PNG images from the tile server. These are simpler but less
        customizable — styles are baked into the server-rendered images.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The most important performance principle for map UIs: never let React control
        the map rendering loop. Map libraries (Mapbox, Google Maps, Leaflet) manage
        their own rendering cycles internally. React should only interact with the map
        through the library's imperative API (addMarker, removeMarker, flyTo, setPaintProperty).
        Attempting to render markers as React DOM elements overlaid on a canvas-based
        map will cause layout thrashing and frame drops at any meaningful scale.
      </HighlightBlock>

      <h2>React + Map Library Integration Pattern</h2>
      <p>
        The canonical pattern for integrating a map library with React is to initialize
        the map once in a useEffect and hold the map instance in a ref. All subsequent
        interactions with the map go through the ref: adding markers, responding to
        events, updating the viewport. React state is used only for UI elements outside
        the map canvas (sidebars, search boxes, popups implemented as React portals).
      </p>
      <p>
        When data changes (new markers come in from an API call), compare the new
        marker set with the currently rendered set using a diff algorithm: compute
        added markers (in new set but not current), removed markers (in current but
        not new set), and updated markers (in both, with changed properties). Apply
        the diff to the map via the library's API: add markers for additions, remove
        markers for removals, update properties for changes. This avoids removing all
        markers and re-adding them on every render, which would cause a visible flash
        and unnecessary GPU work.
      </p>
      <p>
        Event handling: the map emits click, mousemove, zoom, and move events. These
        flow from the map library to React state via event listeners set up in the
        initialization effect. A map click event carries geographic coordinates; the
        handler dispatches an action to React state (setting selected marker, opening
        popup). The marker click event carries the marker's data ID; the handler looks
        up the full marker data from a store and shows a detail panel.
      </p>

      <h2>Viewport-Driven Data Fetching</h2>
      <p>
        A search-on-map-move pattern fetches data for the current viewport from the
        server. The map's moveend event fires when panning or zooming completes. The
        handler reads the current bounds (southwest and northeast corners as lat/lng),
        sends them as query parameters to an API endpoint, and updates the displayed
        markers with the response.
      </p>
      <p>
        Debouncing the moveend fetch is essential — rapid panning fires multiple events.
        Debounce with a 200–400ms delay so only the final position triggers a fetch.
        Cancel in-flight requests when a new fetch starts (using AbortController) to
        prevent stale responses from overwriting newer data.
      </p>
      <p>
        The server-side geospatial query uses a bounding box filter (WHERE latitude
        BETWEEN sw_lat AND ne_lat AND longitude BETWEEN sw_lng AND ne_lng) with a
        spatial index. PostgreSQL with PostGIS, Elasticsearch with geo_bounding_box,
        or MongoDB with $geoWithin all support this efficiently. The response includes
        only the markers within the current viewport, keeping the payload small.
      </p>
      <p>
        For zoom-sensitive data: at low zoom levels (country level), return aggregated
        cluster counts rather than individual markers. At high zoom levels (neighborhood
        level), return individual markers. The zoom level is sent as a query parameter;
        the server switches between cluster and point response formats based on it.
        This eliminates the need to perform clustering on the client for large datasets.
      </p>

      <h2>Marker Clustering</h2>
      <p>
        Client-side marker clustering groups nearby markers into single cluster markers
        with a count badge when the markers are too close together to be individually
        useful. The standard algorithm is supercluster (from Mapbox), which uses a
        hierarchical grid-based clustering approach.
      </p>
      <p>
        Supercluster precomputes clusters at each zoom level using a grid of cells.
        For each zoom level, markers within the same grid cell are grouped into a
        cluster. The cluster's position is the weighted centroid of its members. This
        precomputation happens in a Web Worker to avoid blocking the main thread.
        Once computed, fetching clusters for a viewport is an O(1) lookup into the
        precomputed spatial index.
      </p>
      <p>
        Rendering clusters: clusters and individual markers are both rendered as the
        map library's marker type. Cluster markers have a custom icon (a circle with
        the count). Clicking a cluster zooms the map to the cluster's bounds (the
        geographic extent of its member markers), expanding it into sub-clusters or
        individual markers. This is computed by querying supercluster for the cluster's
        leaves at the next zoom level.
      </p>
      <HighlightBlock as="p" tier="important">
        For more than ~10,000 markers, even supercluster's precomputed lookup becomes
        slow if clusters must be updated on every zoom and pan. The production approach
        at this scale: render all markers and clusters using Mapbox's built-in clustering
        (which runs natively in the GL pipeline without JavaScript overhead) or using
        a canvas/WebGL overlay that renders markers as GPU sprites rather than DOM
        elements. deck.gl's ScatterplotLayer can render 1 million points at 60fps.
      </HighlightBlock>

      <h2>Custom Popups and Info Windows</h2>
      <p>
        When the user clicks a marker, a popup appears showing the marker's detail
        content. Map libraries provide their own popup implementations, but these are
        limited — they render plain HTML strings, not React components. For rich popups
        with React components (including state, hooks, and context), use React portals.
      </p>
      <p>
        The pattern: create an empty container div managed by the map library's popup
        API, then use ReactDOM.createPortal to render a React component tree into
        that container. The portal lets the React component be positioned by the
        map library (at the marker's geographic coordinates, translated to screen pixels
        by the map's projection) while still being part of React's component tree for
        state, context, and event handling.
      </p>
      <p>
        Popup positioning: the popup must reposition when the map pans or zooms so it
        stays anchored to the marker's geographic coordinates. Map library popups handle
        this automatically. For custom-built popups (absolute-positioned divs), listen
        to the map's move event and update the popup's pixel position by projecting
        the marker's geographic coordinates to screen coordinates using the map's
        project() method.
      </p>

      <h2>Geofence Drawing</h2>
      <p>
        Geofencing allows users to draw polygon regions on the map. The drawing tool
        has two modes: drawing (adding vertices by clicking) and editing (dragging
        existing vertices to reshape the polygon).
      </p>
      <p>
        In drawing mode: each map click adds a vertex to the in-progress polygon. The
        polygon is rendered as a Mapbox layer with the current vertex set. A "close
        polygon" action (clicking the first vertex again, or pressing Escape) finalizes
        the polygon. The polygon coordinates are stored as an array of [lng, lat] pairs
        in GeoJSON format.
      </p>
      <p>
        In editing mode: each vertex of a finalized polygon is rendered as a draggable
        handle (a small circle marker). Dragging a handle updates the polygon's vertex
        at that index. The polygon layer re-renders with the updated coordinates on
        each drag update. Mid-edge click adds a new vertex at the clicked position on
        the edge.
      </p>
      <p>
        Geofence validation: polygons must be topologically valid (no self-intersections,
        at least 3 vertices, closed). Use Turf.js's kinks() function to detect
        self-intersections and unkink() to fix them if needed.
      </p>

      <h2>Real-Time Moving Markers</h2>
      <p>
        For markers that move (delivery drivers, vehicles, aircraft), receiving position
        updates every 10 seconds and snapping the marker to the new position creates
        jarring movement. Smooth interpolation: between position updates, animate the
        marker along the great-circle arc between the old and new positions. Use
        requestAnimationFrame and linear interpolation (lerp) on the latitude and
        longitude values, driven by the elapsed time since the update arrived.
      </p>
      <p>
        Also rotate the marker icon to point in the direction of movement. Compute the
        bearing (compass direction) from the old position to the new position using the
        haversine formula, and set the icon's rotation to match.
      </p>

      <h2>Accessibility</h2>
      <p>
        Map canvases (WebGL or canvas elements) are inherently inaccessible to screen
        readers — they render pixels, not accessible semantic elements. The accessible
        alternative: provide a text-based representation alongside the map. A data
        table listing all visible markers with their names, addresses, and distances
        can be visually hidden and accessible only to screen readers (sr-only class).
        The map itself has role="application" with aria-label describing its purpose.
        Interactive map controls (zoom in/out, search) are real button/input elements
        outside the canvas with proper labels and keyboard handling.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you efficiently update 1,000 moving markers without dropping frames?</h3>
      <p>
        Avoid the pattern of calling mapbox.Marker.setLngLat() in a loop for 1,000
        markers on every update — this forces 1,000 DOM style mutations per frame.
        Instead, use a GeoJSON data source layer. Store all marker positions in a GeoJSON
        FeatureCollection, update the map source using map.getSource('markers').setData(geojson),
        and let Mapbox's GL rendering pipeline handle the visual update. setData is a
        single operation that pushes the entire feature collection to the GPU in one
        batch; Mapbox's shader computes the screen positions for all 1,000 features
        in parallel on the GPU. For animated position transitions, use Mapbox's symbol
        layer animation or deck.gl's ScatterplotLayer with animated props.
      </p>

      <h3>Q: How do you implement "search as I move the map" without fetching on every frame?</h3>
      <p>
        The map's move event fires on every animation frame during panning (typically
        60 times per second). Fetching on every move event would fire 60 requests per
        second during a pan. The solution has two parts: listen to moveend (which fires
        only when the pan animation completes) rather than move, and add a debounce of
        200–300ms on top of moveend to handle rapid sequential pans. The debounce
        resets on each new moveend event, so only the final position after a pause in
        panning triggers a fetch. Also cancel any in-flight request when a new one starts
        using AbortController, so out-of-order responses from slow network requests do
        not overwrite newer data.
      </p>

      <h3>Q: How do you handle a map that needs to show both raw markers and cluster markers at the same time, depending on zoom?</h3>
      <p>
        Use Mapbox's built-in clustering (clusterMaxZoom and clusterRadius on the
        GeoJSON source). Below the maxZoom threshold, Mapbox automatically computes
        and renders cluster points. Above it, individual points are shown. Add two
        separate symbol layers in the map style: one for cluster features (a circle
        with a count label, using the point_count expression to access the cluster's
        member count) and one for individual features (custom marker icons). Mapbox
        evaluates the appropriate layer for each feature based on whether it is a
        cluster or individual point — no client-side switching logic needed.
      </p>

      <h3>Q: What are the privacy implications of sending viewport coordinates to the backend on every map move?</h3>
      <p>
        The viewport bounding box reveals where the user is looking, which can infer
        the user's location (if they zoom in on a specific neighborhood), their interests
        (if they search a specific area), and their daily patterns (if they frequently
        look at the same area). This is sensitive data under GDPR and CCPA, particularly
        if combined with a user ID. Mitigations: do not log viewport queries with
        user identifiers if the feature does not require it; add query anonymization
        (coarsen the bounding box to the nearest tile boundary before sending to the
        server); cache viewport query results aggressively at a tile granularity so
        the same viewport does not generate multiple identifiable requests; and disclose
        viewport data collection in the privacy policy.
      </p>

      <h3>Q: How would you implement a map that works offline (like a hiking map app)?</h3>
      <p>
        Offline maps require pre-downloading tiles for a geographic region. The user
        selects a bounding box and zoom range; the app computes the list of tile
        coordinates (z, x, y) for all zoom levels in that range and bounding box,
        fetches each tile, and stores the tiles in IndexedDB. A Service Worker
        intercepts subsequent tile requests and serves them from IndexedDB when offline.
        For vector tiles (Mapbox GL), the tile data is the Protobuf binary; for raster
        tiles, it is PNG/JPEG blobs. Storage estimates: a city-scale area at zoom
        levels 10–16 is typically 50–200 MB of vector tile data. Expose a download
        progress indicator and a storage usage display to keep the user informed.
        Implement an eviction policy (oldest downloaded region first) when storage
        approaches the quota limit.
      </p>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-maps-delivery-tracking",
  title: "Design a Maps-Based Delivery Tracking Application",
  description:
    "Architecture for real-time delivery tracking: driver location streaming, ETA calculation, map rendering, geofencing, privacy controls, and multi-party visibility.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "maps-based-delivery-tracking-application",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "maps", "delivery-tracking", "geolocation", "websocket", "ETA"],
  relatedTopics: ["map-based-ui-system", "geolocation-permissions"],
};

export default function MapsDeliveryTrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A delivery tracking application solves a fundamental information asymmetry: the customer does not know where their order is, while the driver knows but cannot communicate in real time. The map-based visualization makes abstract location data concrete and reduces "where is my package" customer support contacts—DoorDash and Uber Eats report that live tracking reduces support contacts by 25–35%. The system must show the driver's location updating smoothly on a map, display an accurate ETA, and handle the complex edge cases of real-world delivery: driver goes offline mid-delivery, driver takes an unexpected route, traffic delays change the ETA dynamically.</p>
        <p>The tracking application involves multiple parties with different visibility requirements: the customer can see the driver's location while en route to their address; the restaurant or merchant can see the driver's location during pickup but not delivery; the driver can see the customer's address; the operations team can see all drivers and all orders simultaneously. Each party's view is a different projection of the same underlying location data, with different privacy constraints.</p>
        <p><strong>Explicit assumptions:</strong> Drivers use a native mobile app (iOS/Android) that sends GPS location updates every 3–5 seconds. The customer-facing tracking page is a web application (mobile-responsive). Location data is processed by a Location Service that maintains each driver's current position and computes route ETA. The map is rendered using Mapbox GL JS (WebGL-based for smooth animation). Privacy requirement: the driver's precise GPS coordinates are not exposed to the customer—only the driver's position is shown as a dot on the map, and no coordinates are returned in the API response.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Live driver location:</strong> The driver's position on the map updates every 3–5 seconds. The marker animates smoothly between position updates (not teleporting).</li>
          <li><strong>ETA display:</strong> Estimated time of arrival, updated in real-time as the driver's route progress and traffic conditions change. ETA is shown as "arriving in N minutes" rather than an absolute time to handle time zone complexity.</li>
          <li><strong>Route visualization:</strong> The planned route from the driver's current position to the delivery address is drawn on the map. The route updates if the driver deviates significantly.</li>
          <li><strong>Delivery milestones:</strong> Status progression: "Order placed" → "Restaurant preparing" → "Driver picking up" → "Driver on the way" → "Arriving soon" → "Delivered."</li>
          <li><strong>Geofencing events:</strong> When the driver enters a geofence around the delivery address (e.g., within 0.5km), push a notification: "Your driver is almost there."</li>
          <li><strong>Multi-party views:</strong> Customer sees driver en route to them. Restaurant sees driver en route for pickup. Ops dashboard sees all active drivers simultaneously.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Location update latency:</strong> Driver position update visible on customer's map within 5 seconds of the driver's GPS event.</li>
          <li><strong>Scale:</strong> The location service must handle 100,000 concurrent active deliveries with 3–5 second location updates (20,000–33,000 events per second).</li>
          <li><strong>Privacy:</strong> Driver GPS coordinates are never returned to customers. The customer sees only the driver's approximate map position (rendered server-side as a visual indicator, not as coordinates).</li>
          <li><strong>Resilience:</strong> If location updates stop (driver goes underground, offline), the UI shows the driver's last known position with a "Last updated X seconds ago" indicator rather than removing the marker.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The architecture has three primary subsystems. The location ingestion pipeline receives GPS updates from driver apps, validates and persists them, and publishes them to a Kafka topic. The location service consumes the Kafka topic, maintains an in-memory cache of current driver positions (using Redis Geo for geospatial queries), computes ETA updates using a routing API, and detects geofence events. The real-time delivery layer pushes location and ETA updates to customers via WebSocket (for the web app) and via push notifications for mobile customers who have the tracking page open in a background tab.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The customer tracking page connects to a WebSocket endpoint authenticated with an order token (a time-limited signed token linked to the specific delivery). The WebSocket delivers only the updates relevant to this customer's order, not a broadcast of all location data. This scoping ensures customers cannot see other customers' delivery details by manipulating the WebSocket connection.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/maps-based-delivery-tracking-application-architecture.svg"
          alt="Delivery tracking architecture showing driver app GPS events → location ingestion API → Kafka → location service (Redis Geo, ETA computation, geofence evaluation) → WebSocket delivery → customer tracking page (Mapbox GL JS marker animation). Multi-party visibility: customer WebSocket (order-scoped), restaurant WebSocket (pickup-scoped), ops dashboard (all drivers). Push notification geofence trigger shown."
          caption="Delivery tracking architecture: GPS ingestion → Kafka → location service → order-scoped WebSocket → Mapbox GL JS map animation"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Driver Location Ingestion at Scale</h3>
        <HighlightBlock as="p" tier="important">Driver apps send GPS updates every 3–5 seconds as HTTP POST requests to the Location Ingestion API. At 100,000 concurrent deliveries with one driver each, that is 20,000–33,000 HTTP requests per second. Each request contains: driverId, orderId, latitude, longitude, accuracy (GPS accuracy in meters), heading (degrees, for map marker rotation), speed (for route interpolation), and timestamp. The Ingestion API is stateless—it validates the update (driverId matches an active delivery, timestamp is not stale), enriches it (reverse geocode to street-level address for display purposes), and publishes to a Kafka topic partitioned by driverId. Partitioning by driverId ensures that location updates for the same driver are processed in order by the Location Service consumer.</HighlightBlock>
        <p>GPS accuracy metadata is crucial for display quality. A GPS accuracy of 10 meters (city with clear sky view) produces a tight, accurate driver position. An accuracy of 100 meters (urban canyon, indoor) produces a position that may be a full block off. The UI can display an accuracy circle around the driver marker when accuracy is poor, similar to how Apple Maps shows the blue accuracy ring around the user's location. Alternatively, the backend can apply a Kalman filter to smooth GPS positions and reduce the impact of momentary accuracy spikes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">ETA Computation and Route Updates</h3>
        <HighlightBlock as="p" tier="important">ETA is computed by the Location Service on each location update: it queries a routing API (Google Maps Directions API, Mapbox Directions API, or an internal routing service) with the driver's current position and the delivery destination, requesting the estimated travel time given current traffic conditions. The routing API returns a route geometry (encoded polyline) and an ETA in seconds. The Location Service stores the current ETA and route geometry in Redis (keyed by orderId) and publishes both to the WebSocket delivery layer.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Querying the routing API on every GPS update (every 3–5 seconds, 20,000 deliveries = 4,000–6,000 routing API calls per second) would be prohibitively expensive. The optimization: ETA is recomputed only when the driver has moved more than 50 meters from the last computed position, when the driver deviates significantly from the current route (cross-track distance exceeds 200 meters), or when 60 seconds have elapsed since the last ETA update. This reduces routing API calls by 90%+ while keeping ETA accuracy adequate for "arriving in N minutes" display granularity.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Route deviation detection identifies when the driver has taken an unexpected turn or has gone significantly off-route. Cross-track distance (the perpendicular distance from the driver's current position to the nearest point on the planned route) is computed geometrically without a routing API call. If cross-track distance exceeds 200 meters and the driver is not stationary (speed &gt; 5km/h), a rerouting event is triggered: a new routing API call computes the updated route from the current position, and the new route geometry is delivered to the customer's map via WebSocket.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Map Rendering and Marker Animation</h3>
        <HighlightBlock as="p" tier="important">Mapbox GL JS renders the map using WebGL for smooth vector tile rendering at 60fps. The driver marker is a custom HTML element or a Mapbox symbol layer. The critical UX detail: the driver marker must not teleport between GPS updates (appearing to jump from one position to another every 3–5 seconds). Instead, the marker animates smoothly between the previous and new positions over the duration of the update interval.</HighlightBlock>
        <p>The animation uses requestAnimationFrame to interpolate the marker's coordinates between the previous position (p0) and the new position (p1) over the 3-5 second expected update interval. Linear interpolation (lerp) produces smooth movement: at time t within the interval, position = p0 + (p1 - p0) × (t / interval). For more natural movement, ease-in-out interpolation can be applied. The marker's rotation (heading) is also interpolated. If the next GPS update arrives before the interpolation completes, the animation is cancelled and restarts from the current interpolated position toward the new target. If the next update is late (driver briefly offline), the marker continues on its current trajectory extrapolating beyond p1 for a grace period (1–2 seconds) before stopping.</p>
        <p>The route line on the map is rendered as a Mapbox GeoJSON source layer. When a new route geometry is received (on ETA recomputation or rerouting), the GeoJSON source is updated with the new coordinates. The portion of the route already traveled is trimmed from the display: only the route from the driver's current position to the destination is shown, not the completed portion. This trimming is computed client-side by finding the nearest point on the route geometry to the driver's current position and slicing the route from that point forward.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Geofencing and Notifications</h3>
        <HighlightBlock as="p" tier="important">Geofence evaluation runs in the Location Service on each location update. For each active delivery, the service maintains the delivery address coordinates and the geofence radius (500 meters). Using Redis Geo's GEODIST command (or a simple haversine calculation), the service checks whether the driver's current position is within the geofence. When the driver enters the geofence (transition from outside to inside), a geofence_entered event is published to a notification Kafka topic. A notification worker consumes this topic and sends a push notification to the customer's mobile device: "Your delivery is almost here!" The event is published only once (on the first entry into the geofence); subsequent location updates within the geofence do not re-trigger the notification.</HighlightBlock>
        <p>Geofence state (inside/outside) per delivery is stored in Redis as a boolean, toggled on entry and exit events. This stateful tracking is necessary to debounce geofence events—GPS inaccuracy can cause a driver at the geofence boundary to rapidly cross in and out, which without state tracking would send repeated notifications.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy and Coordinate Masking</h3>
        <HighlightBlock as="p" tier="important">The customer's tracking page must never receive the driver's precise GPS coordinates in the API response. The WebSocket message delivered to the customer contains only: marker_position (an encoded representation the Mapbox SDK uses to render the driver's position on the map) and eta_seconds (the ETA). The customer cannot extract latitude/longitude values from these fields. On the server side, the coordinate → Mapbox token translation happens in the WebSocket relay layer before the message reaches the customer.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Additional privacy layer: the driver's home address and personal information are never accessible to customers. The driver's name and photo (for the delivery confirmation screen) are stored separately from the location data and accessed only by the customer's own order. A customer cannot look up a driver's location for an order that is not theirs. The order token (used to authenticate the WebSocket connection) is scoped to the specific orderId and expires when the delivery is completed or 24 hours after order placement, whichever comes first.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/maps-based-delivery-tracking-application-workflow.svg"
          alt="Delivery tracking data flow showing driver GPS update → ingestion API → Kafka → location service (ETA computation with routing API, geofence evaluation, route deviation detection) → Redis location cache → WebSocket relay (coordinate masking) → customer map (Mapbox GL JS marker animation + route line trimming). Geofence event → notification worker → FCM/APNs push notification."
          caption="Delivery tracking data flow: GPS → Kafka → ETA computation → coordinate-masked WebSocket → smooth map animation and push notifications"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">WebSocket versus Server-Sent Events for location delivery: WebSocket is bidirectional (the server can push; the client can also send) but requires stateful server connections. SSE is one-directional (server to client only) but lighter-weight and HTTP/2-compatible. For delivery tracking, the customer only needs to receive updates (no client-to-server messages needed), making SSE technically sufficient. However, WebSocket is better supported across browser environments and mobile WebViews, and the bidirectional capability enables future features (customer messaging the driver). WebSocket is the pragmatic choice.</HighlightBlock>
        <HighlightBlock as="p" tier="important">GPS update frequency trade-offs: 3–5 second GPS updates balance location freshness against battery consumption on the driver's device and server load. Sub-second updates would provide smoother tracking but drain the driver's battery significantly faster (continuous GPS polling is the largest battery consumer on a smartphone) and multiply server load by 3–5×. The 3–5 second interval, combined with client-side marker animation interpolation, produces visually smooth tracking with acceptable battery impact. For high-speed deliveries (courier on a motorcycle at 80km/h), 5 seconds of position change is 110 meters—significant for urban navigation. For slow deliveries (food delivery in congested city traffic at 10km/h), 5 seconds is 14 meters, which is barely visible at typical map zoom levels.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Internal routing versus third-party routing API: Google Maps and Mapbox Directions APIs provide accurate traffic-aware ETAs but cost per request. At 4,000 routing API calls per second for 100,000 concurrent deliveries, cost becomes significant. OSRM (Open Source Routing Machine) or Valhalla are open-source routing engines that can be self-hosted with OSM data, eliminating per-call costs. The trade-off is accuracy: third-party routing APIs incorporate real-time traffic data from their own data collection systems (GPS data from millions of users), while self-hosted OSRM without real-time traffic will produce less accurate ETAs in dynamic traffic conditions. Hybrid approach: use a self-hosted OSRM for route geometry (the actual path), query a traffic API for real-time congestion data on the route segments, and compute ETA as (route distance) / (average speed adjusted for traffic congestion).</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A maps-based delivery tracking application is a real-time location streaming system with privacy constraints. GPS events from driver apps are ingested via HTTP to a Kafka topic, consumed by a Location Service that maintains current positions in Redis Geo, computes ETAs using a routing API (triggered by 50m movement or 60s elapsed, not every update), and detects geofence entry events for "arriving soon" push notifications. Location and ETA updates are delivered to customers via order-scoped WebSockets with coordinate masking (the customer never receives raw GPS coordinates). The Mapbox GL JS map animates driver marker positions smoothly between 3–5 second GPS updates using requestAnimationFrame interpolation. Route lines are trimmed to the remaining portion from the driver's current position. Geofence state is maintained in Redis to debounce entry/exit events from GPS noise at the boundary.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

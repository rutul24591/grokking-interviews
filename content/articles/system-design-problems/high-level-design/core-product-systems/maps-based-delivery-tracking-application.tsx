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
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "maps", "delivery-tracking", "geolocation", "websocket", "ETA"],
  relatedTopics: ["map-based-ui-system", "geolocation-permissions"],
};

export default function MapsDeliveryTrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Maps-Based Delivery Tracking Application around product-critical path, data ownership, user trust, latency SLOs, and safe degradation. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          A maps-based delivery tracking application turns live driver telemetry into a customer, merchant, driver, and
          operations experience. The customer wants confidence that the order is moving. The merchant wants to know
          when a courier will arrive for pickup. The driver needs route and delivery context. Operations needs fleet
          visibility and exception handling. The same location stream powers all of these views, but each view has
          different privacy, latency, scale, and precision requirements.
        </HighlightBlock>
        <p>
          The visible feature is a moving marker on a map with an ETA. The real system is a high-volume location
          ingestion pipeline, geospatial state store, routing and ETA service, geofence evaluator, privacy enforcement
          layer, realtime delivery channel, and map-rendering frontend. At 100,000 active deliveries with updates every
          three to five seconds, ingestion receives roughly 20,000 to 33,000 location events per second before retries
          and operational dashboards are included.
        </p>
        <p>
          The core product constraint is trust without overexposure. A customer should see enough motion and ETA
          context to stop asking support where the order is, but they should not receive unrestricted driver GPS data
          or visibility outside the active delivery window. A merchant may see approach-to-pickup, not the customer's
          home route. Operations may see broader data, but should be audited and access-controlled.
        </p>
        <p>
          A strong interview answer should clarify that accuracy, freshness, smooth animation, ETA quality, and privacy
          are separate problems. A very accurate GPS point can still be stale. A smooth marker can hide poor data. A
          cheap ETA can be misleading during traffic. A precise coordinate can be a privacy leak. The design needs
          explicit state for each of these concerns.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the user must see a consistent product state even when derived artifacts, personalization, search, upload, or collaboration subsystems lag behind.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Maps-Based Delivery Tracking Application, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Location Events and Current Position State</h3>
        <p>
          Driver apps emit location events with driver ID, active order or task ID, latitude, longitude, accuracy,
          heading, speed, timestamp, and app state. The ingestion path validates that the driver is assigned to the
          task, rejects stale timestamps, and publishes events to a partitioned stream. The current position cache is a
          derived view used for live tracking and geospatial queries; the raw event log supports debugging, audit, ETA
          model training, and incident replay.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">ETA Is a Computed Product Signal</h3>
        <p>
          ETA is not just distance divided by speed. It may combine current route, traffic, stop duration, pickup
          readiness, batching, driver behavior, road closures, and marketplace-specific buffers. The UI should show
          ETA at the right precision, usually "arriving in N minutes," and avoid overpromising second-level accuracy.
          The backend should recompute ETA when meaningful inputs change, not necessarily on every GPS ping.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Geofences Are Stateful Transitions</h3>
        <p>
          A geofence event should fire on transition, not on every point inside a radius. The service must remember
          whether the driver was previously outside or inside the pickup or drop-off radius. GPS noise near the edge
          can otherwise produce repeated "arriving soon" notifications. Debounce, hysteresis, and minimum dwell time
          are common techniques to avoid false entry and exit events.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Realtime Delivery Is Scoped by Audience</h3>
        <p>
          Customer, merchant, driver, and operations streams should be different projections. The customer stream is
          order-scoped and expires after delivery. Merchant visibility ends after pickup. Operations visibility may be
          broader but requires stronger authorization and audit. The system should not broadcast raw driver telemetry
          and rely on clients to filter it.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: API shape, read/write model, async workflow, permission boundary, cache policy, realtime update strategy, and rollback behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/maps-based-delivery-tracking-application-architecture.svg"
          alt="Delivery tracking architecture showing driver GPS ingestion, Kafka stream, location service, Redis Geo cache, ETA service, geofence evaluator, WebSocket relay, customer map, merchant view, and operations dashboard"
          caption="Architecture: driver telemetry feeds a stream, location service derives current state, and audience-scoped realtime channels power maps and notifications."
        />
        <p>
          Driver apps send updates over a mobile-friendly ingestion API. HTTP is simple and reliable for periodic
          pings; MQTT or persistent WebSocket can also work for fleets with tighter battery and connection control.
          The ingestion API is stateless. It authenticates the driver app, verifies assignment, validates timestamp and
          accuracy, enriches with coarse region metadata where useful, and writes to a stream partitioned by driver ID
          or active task ID to preserve per-driver ordering.
        </p>
        <p>
          Location consumers update a current-position store such as Redis Geo or a sharded in-memory cache backed by
          durable storage. They also update active delivery state: last seen time, current heading, speed, accuracy,
          route progress, ETA, and geofence state. The event stream remains the durable sequence; the current cache is
          optimized for live reads and fanout. If a cache shard fails, it can be rebuilt from recent stream history and
          active delivery records.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/maps-based-delivery-tracking-application-workflow.svg"
          alt="Delivery tracking workflow showing GPS event validation, stream publish, ETA trigger, route deviation check, geofence transition, scoped WebSocket update, and map animation"
          caption="Workflow: each GPS event can update current state, trigger ETA recomputation, detect geofence transitions, and publish scoped tracking updates."
        />
        <p>
          ETA computation should be rate-limited and event-driven. Recomputing route and traffic on every GPS update is
          too expensive at scale. Trigger recomputation when the driver moves a threshold distance, deviates from the
          route, crosses a route milestone, traffic age exceeds a threshold, pickup readiness changes, or enough time
          has elapsed. The customer UI can receive both location updates and lower-frequency ETA updates.
        </p>
        <p>
          The realtime relay authenticates order-scoped tokens and subscribes the connection only to that delivery's
          safe projection. For the customer, messages include approximate display position, marker heading, freshness,
          ETA, route polyline where allowed, and milestone status. For operations, messages may include precise
          coordinates, but access should be role-gated and audited. The relay should support reconnect with last event
          ID or snapshot-on-connect to avoid stale maps after a connection break.
        </p>
        <p>
          The web map renders vector tiles and overlays. The driver marker should interpolate between updates rather
          than teleporting every few seconds. The route layer should update only when the route changes. If updates
          stop, the marker should remain at last known position with a "last updated" indicator and eventually switch
          to a degraded state. Smooth animation should never hide stale-data warnings.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/maps-based-delivery-tracking-application-privacy.svg"
          alt="Delivery tracking privacy model showing different visibility for customer, merchant, driver, and operations views with scoped tokens and coordinate precision controls"
          caption="Privacy model: each audience receives a scoped projection with different timing, precision, and retention rules."
        />
        <p>
          Higher GPS frequency improves freshness but increases battery drain, mobile data usage, ingestion load, and
          privacy exposure. A three to five second interval with client-side interpolation is a practical default for
          delivery tracking. More frequent updates may be justified near pickup or drop-off, while lower frequency is
          acceptable when the driver is far away or stationary.
        </p>
        <p>
          WebSocket and Server-Sent Events both work for customer updates. SSE is simpler for one-way server-to-client
          updates and can be easier through proxies. WebSocket supports bidirectional features such as customer-driver
          messaging, acknowledgement, and richer session control. The decisive factor is usually platform consistency,
          connection infrastructure, and future product needs rather than raw latency.
        </p>
        <p>
          Third-party routing APIs provide strong traffic-aware ETAs but can become expensive at large scale. Self-hosted
          routing engines reduce per-call cost and improve control, but traffic accuracy may be weaker unless the
          company has its own traffic signals. A hybrid design can use self-hosted route geometry, cached travel-time
          matrices, and selective third-party calls when route deviation or ETA uncertainty is high.
        </p>
        <p>
          Raw location precision is useful operationally but risky for customer views. Customers usually need a marker
          that communicates progress, not exact coordinates. Precision can be reduced by snapping to route, rounding,
          delaying, or encoding server-rendered marker positions. The stronger the privacy requirement, the more the
          server should own projection rather than sending exact coordinates to the browser.
        </p>
        <p>
          Client-side marker extrapolation makes movement feel smooth during short gaps, but it can become misleading.
          Extrapolate only for a small grace window and stop when data is stale. The UI should prefer an honest last
          known position over a smoothly animated fiction.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The principal decision is how much precision each audience should receive. Operations may need exact telemetry
          for safety, fraud, and dispatch. Customers usually need confidence, ETA, and visible progress, not raw
          coordinates. Merchants may need milestone state rather than driver trails. A strong architecture creates
          separate projections with different precision, latency, retention, and audit requirements instead of sending
          one location stream to everyone.
        </p>
        <p>
          Cost control should be part of the core design. Routing API calls, map tile loads, websocket fanout, and GPS
          ingestion can all scale with active deliveries and refresh frequency. The system should define when ETA
          recomputation is necessary, cache route geometry, downsample telemetry for customer views, and track cost per
          active delivery. Without these controls, a popular live tracking page can become unexpectedly expensive.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: activation, completion rate, p95 interaction latency, stale-state duration, conversion lag, error rate, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Keep raw telemetry, derived current state, and customer projection separate. Raw telemetry is high-cardinality
          and sensitive. Current state is optimized for live delivery logic. Customer projection is privacy-scoped and
          often lower precision. This separation makes privacy reviews, retention, and debugging much cleaner.
        </p>
        <p>
          Use stateful geofence debouncing. Store outside, near-boundary, and inside states with hysteresis instead of
          firing on a single distance check. Consider GPS accuracy; a point with 150 meter uncertainty near a 500 meter
          geofence should not trigger the same confidence as a point with 10 meter accuracy.
        </p>
        <p>
          Track freshness explicitly. Every location and ETA message should carry event time and server processed time.
          The UI can show last-updated age and degrade when the stream is stale. Operations dashboards should alert on
          drivers with old positions, abnormal accuracy, impossible speed, or route deviation.
        </p>
        <p>
          Design for connection churn. Customers open tracking pages in mobile browsers, background tabs, and embedded
          WebViews. The realtime relay should handle reconnects, token expiry, duplicate subscriptions, and snapshot
          refresh on resume. Mobile push can complement live sockets for milestone notifications.
        </p>
        <p>
          Put cost controls around routing. Cache route geometry, rate-limit recomputation, batch traffic lookups where
          possible, and monitor routing calls per active delivery. ETA quality should be measured against actual arrival
          time, not just service availability.
        </p>
        <p>
          Make privacy and retention configurable by market and role. Some regions or enterprise customers may require
          shorter raw-location retention, stricter customer projection, or audit trails for operations access. The
          architecture should enforce these policies in the projection service and storage layer rather than relying on
          frontend map rendering choices.
        </p>
        <p>
          Delivery tracking needs separate truth models for courier location, route estimate, order state, and customer-facing promise. GPS pings can be stale or noisy, route estimates can change with traffic, and order state may come from fulfillment systems rather than the map. A principal-ready design shows confidence and freshness instead of presenting every moving marker as exact truth.
        </p>
        <p>
          Privacy and safety controls are central. Customer addresses, courier locations, contact options, and live movement traces are sensitive. The frontend should minimize precision when exact location is not needed, expire tracking links, restrict sharing, and avoid exposing courier home or idle locations. The backend should decide which actor can see which granularity at each delivery phase.
        </p>
        <p>
          Multi-region and offline behavior should be explicit. A courier device may keep moving while the app is offline, then upload a batch of stale points. The backend should order points by event time, reject impossible jumps, preserve last-known freshness, and avoid overwriting newer trusted positions with late data. The UI should show stale or estimated state clearly so customers and support agents do not interpret delayed updates as live movement.
        </p>
        <p>
          Support tooling should see the same delivery state with richer diagnostics: last accepted location, discarded pings, ETA source, route provider, courier app version, and notification delivery status. This lets operations resolve customer complaints without exposing raw telemetry to end users.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: partial data, stale projections, duplicate writes, permission drift, missing audit trail, and UI states that hide backend uncertainty.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common mistake is recomputing ETA on every GPS ping. That design becomes expensive and can overload routing
          providers. Trigger ETA updates from meaningful movement, route deviation, traffic staleness, or milestone
          changes instead.
        </p>
        <p>
          Another pitfall is over-sharing precise coordinates. Even if the UI only renders a dot, raw coordinates in
          API responses can be inspected. Privacy-sensitive systems should project, round, snap, or otherwise reduce
          precision server-side before data reaches customer clients.
        </p>
        <p>
          Teams often animate markers smoothly but forget stale state. A marker that keeps drifting after the driver
          loses connectivity is worse than a frozen marker with a clear "last updated" label. Animation should stop
          quickly when fresh updates are missing.
        </p>
        <p>
          Geofence spam is another failure mode. GPS jitter near a boundary can create repeated enter and exit events.
          Use hysteresis, minimum dwell time, and one-time milestone notification state so customers do not receive
          multiple "almost there" notifications.
        </p>
        <p>
          Finally, operations dashboards can accidentally become the largest consumer. Showing all active drivers with
          high-frequency updates may overwhelm browsers and realtime infrastructure. Ops views need clustering,
          viewport-based subscriptions, sampling, and server-side aggregation.
        </p>
        <p>
          Teams often treat map updates as simple polling. In real delivery systems, mobile devices background, lose connectivity, batch pings, or send low-accuracy points. The system should smooth movement, detect stale locations, and fall back to ETA ranges rather than showing misleading precise markers.
        </p>
        <p>
          Another pitfall is coupling map UI directly to routing providers. Provider outages, quota limits, and geocoding differences can break the product. A mature architecture caches tiles and route summaries where allowed, abstracts providers, and degrades to textual status when maps or live routes are unavailable.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Food delivery applications use live tracking to coordinate restaurant pickup, driver progress, customer ETA,
          and arrival notifications. They need fast updates near pickup and drop-off, but can use lower precision and
          lower frequency while the driver is far from the customer.
        </p>
        <p>
          Package and grocery delivery platforms use similar architecture with longer delivery windows, route batching,
          multi-stop ETAs, and customer privacy constraints. The map may show a broader delivery window rather than
          precise driver location until the driver is nearby.
        </p>
        <p>
          Ride-hailing products require even tighter pickup tracking, driver-rider matching, cancellation handling, and
          bidirectional messaging. They also need to hide sensitive destination details from parties who no longer need
          them after trip completion.
        </p>
        <p>
          Fleet operations and field-service products use maps for technician dispatch, route progress, SLA risk, and
          exception handling. These systems emphasize ops dashboards, clustering, route optimization, and audit trails
          more than customer-facing marker animation.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you scale location ingestion for 100,000 active deliveries?
        </h3>
        <p>
          I would keep the ingestion API stateless, authenticate driver apps, validate assignment and timestamps, and
          publish events to a partitioned stream by driver or active task. At three to five second intervals, the system
          handles roughly 20,000 to 33,000 events per second. Consumers update a current-position cache and derived
          delivery state. The raw stream remains durable for replay and debugging, while the cache serves low-latency
          live tracking.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you avoid expensive ETA recomputation?
        </h3>
        <p>
          Do not call routing on every GPS update. Recompute ETA when the driver moves a meaningful distance, deviates
          from the route, traffic data becomes stale, pickup readiness changes, or a time threshold passes. Cache route
          geometry and current ETA, and send location updates more frequently than ETA updates. Measure ETA quality
          against actual arrival to tune thresholds.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you handle privacy for customer tracking?
        </h3>
        <p>
          The customer receives only an order-scoped projection during the active delivery window. The server should
          reduce precision by snapping to route, rounding, delaying, or sending display-only marker data, depending on
          policy. The token expires after delivery. Merchant and operations views have separate scopes. Raw telemetry is
          not broadcast and should be access-controlled, audited, and retained according to policy.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you make the marker move smoothly without lying?
        </h3>
        <p>
          The client interpolates between fresh location points using requestAnimationFrame and heading data. If the
          next update is late, it can extrapolate briefly, then stop and show last-updated age. Smooth animation should
          not hide stale state. The UI should degrade from live movement to last-known location to connection warning
          as freshness decays.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you implement geofence notifications safely?
        </h3>
        <p>
          Evaluate geofence transitions in the location service using current position, destination, accuracy, and
          previous inside/outside state. Fire only on transition into the geofence, add hysteresis or dwell time near
          boundaries, and store a notification-sent flag for the delivery milestone. This prevents repeated
          notifications caused by GPS jitter.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How should the operations dashboard differ from the customer map?
        </h3>
        <p>
          The operations dashboard needs broader visibility, but it cannot subscribe every browser to every high-rate
          driver event. It should use viewport-based subscriptions, clustering, aggregation, and lower update frequency
          when zoomed out. Access should be role-based and audited because ops users may see precise locations across
          many active deliveries.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://docs.mapbox.com/mapbox-gl-js/guides/" target="_blank" rel="noreferrer">
              Mapbox GL JS documentation
            </a>
            , WebGL map rendering and source/layer model.
          </li>
          <li>
            <a href="https://docs.mapbox.com/api/navigation/directions/" target="_blank" rel="noreferrer">
              Mapbox Directions API documentation
            </a>
            , routing and ETA service concepts.
          </li>
          <li>
            <a href="https://redis.io/docs/latest/develop/data-types/geospatial/" target="_blank" rel="noreferrer">
              Redis geospatial indexes
            </a>
            , geospatial storage and distance queries.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">
              MDN: WebSocket API
            </a>
            , browser realtime delivery.
          </li>
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc7946" target="_blank" rel="noreferrer">
              RFC 7946: GeoJSON
            </a>
            , route and geometry representation.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

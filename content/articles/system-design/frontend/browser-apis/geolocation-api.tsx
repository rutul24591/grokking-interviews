"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-geolocation-api",
  title: "Geolocation API",
  description:
    "Comprehensive guide to Geolocation API covering location detection, accuracy considerations, privacy, power optimization, and production-scale implementation patterns.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "geolocation-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "browser API",
    "geolocation",
    "GPS",
    "privacy",
    "location",
  ],
  relatedTopics: [
    "notification-api",
    "payment-request-api",
    "mobile-performance-optimization",
  ],
};

export default function GeolocationAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Geolocation API</strong> provides programmatic access to device location information including latitude, longitude, altitude, accuracy, heading, and speed. Location data comes from multiple sources depending on device capabilities: GPS satellites (most accurate, slowest, highest power consumption), WiFi networks (moderate accuracy, fast, moderate power consumption), cell towers (low accuracy, fast, low power consumption), and IP address (city-level accuracy, instant, no power consumption). The browser automatically selects the best available source based on device capabilities and the enableHighAccuracy option.
        </p>
        <p>
          For staff-level engineers, Geolocation API involves critical considerations around privacy, accuracy trade-offs, power consumption, and user experience. Location is sensitive personal data — browsers require explicit user permission before accessing location, and the API only works in secure contexts (HTTPS or localhost). Accuracy varies significantly by device and method: GPS provides 1-10 meter accuracy but can take seconds to minutes for the first fix and drains battery quickly. WiFi provides 10-100 meter accuracy and is faster with less power consumption. Cell towers provide 100-1000 meter accuracy and are fast with low power consumption. IP address provides city-level accuracy instantly with no power consumption but no permission required.
        </p>
        <p>
          The Geolocation API provides two main methods: getCurrentPosition for one-time location requests and watchPosition for continuous location tracking. getCurrentPosition is appropriate for use cases where you need the user&apos;s location once (e.g., finding nearby businesses, checking in at a location). watchPosition is appropriate for use cases where you need to track the user&apos;s location over time (e.g., navigation, fitness tracking, delivery tracking). watchPosition returns a watch ID that can be used to stop tracking with clearWatch, which is essential for preventing battery drain.
        </p>
        <p>
          The business case for Geolocation API is location-based functionality that enhances user experience and enables new use cases. Delivery apps (Uber Eats, DoorDash) track drivers in real-time to provide accurate ETAs. Ride-sharing apps (Uber, Lyft) match riders with nearby drivers. Fitness apps (Strava, Nike Run Club) track runs and workouts. Retail apps show nearby stores and products. News and weather apps show local content. For all of these use cases, the Geolocation API is essential for providing a good user experience.
        </p>
        <p>
          However, the Geolocation API must be used responsibly. Request location only when needed, explain why you need it before requesting, provide manual alternatives for users who deny permission, and respect user privacy. Location tracking can drain battery quickly, so use getCurrentPosition instead of watchPosition when possible, use enableHighAccuracy only when GPS precision is needed, and clear watchPosition when tracking is no longer needed.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>getCurrentPosition:</strong> One-time location request. Takes three arguments: success callback (receives Position object with coordinates and accuracy), error callback (receives PositionError with code and message), and options object (enableHighAccuracy, timeout, maximumAge). The success callback is invoked when location is available, the error callback is invoked when location is unavailable or permission is denied. The options object controls accuracy, timeout, and caching behavior.
          </li>
          <li>
            <strong>watchPosition:</strong> Continuous location tracking. Takes the same arguments as getCurrentPosition. Returns a watch ID that can be used to stop tracking with clearWatch. The success callback is invoked whenever location changes (with a frequency determined by the device and options). The error callback is invoked when location becomes unavailable. Use for navigation, fitness tracking, delivery tracking. Clear watch when done to save battery.
          </li>
          <li>
            <strong>Position Object:</strong> Contains coords (Coordinates object with latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed) and timestamp (milliseconds since epoch when location was acquired). latitude and longitude are in decimal degrees. accuracy is the radius of uncertainty in meters (actual location is within this radius of reported coordinates with 95% confidence). altitude is in meters above the WGS84 ellipsoid (null if unavailable). altitudeAccuracy is the accuracy of altitude in meters (null if unavailable). heading is the direction of travel in degrees clockwise from north (null if unavailable). speed is the speed in meters per second (null if unavailable).
          </li>
          <li>
            <strong>Permission:</strong> Browsers require explicit user consent before accessing location. The permission prompt is shown when getCurrentPosition or watchPosition is called. Permission can be granted, denied, or prompted (user has not yet decided). HTTPS is required for geolocation (except localhost). Handle all permission states gracefully: granted (use location), denied (offer manual location entry or IP-based fallback), prompted (wait for user decision).
          </li>
          <li>
            <strong>Accuracy vs. Power:</strong> enableHighAccuracy: true uses GPS (accurate but slow, drains battery). enableHighAccuracy: false uses WiFi/cell (faster, less accurate, less power). Choose based on use case: use enableHighAccuracy: true for navigation, fitness tracking, precise location needed. Use enableHighAccuracy: false for nearby businesses, local content, approximate location sufficient.
          </li>
          <li>
            <strong>Error Handling:</strong> Errors include PERMISSION_DENIED (user denied permission), POSITION_UNAVAILABLE (can&apos;t get location, e.g., no GPS signal, no WiFi, no cell coverage), TIMEOUT (took too long to get location). Handle each appropriately: PERMISSION_DENIED — offer manual location entry, explain how to enable in browser settings. POSITION_UNAVAILABLE — retry later, offer manual location entry. TIMEOUT — increase timeout, retry, offer manual location entry.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/geolocation-api-flow.svg"
          alt="Geolocation API Flow showing permission request, location sources, and position callback"
          caption="Geolocation API flow — request permission, browser determines location source (GPS/WiFi/cell), callback receives position with coordinates and accuracy"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Geolocation architecture consists of permission handling (request, handle grant/deny), location retrieval (getCurrentPosition or watchPosition), and position processing (use coordinates, handle errors). The architecture must handle permission states (granted, denied, prompted), accuracy trade-offs (GPS vs WiFi vs cell vs IP), and provide fallback for denied/unavailable location (manual location entry, IP-based location).
        </p>
        <p>
          The browser automatically selects the best available location source based on device capabilities and the enableHighAccuracy option. If enableHighAccuracy is true, the browser uses GPS (if available). If enableHighAccuracy is false, the browser uses WiFi or cell towers (if available). If no location source is available, the browser returns a POSITION_UNAVAILABLE error. The browser may cache location results and return cached results if maximumAge is set to a non-zero value.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/location-accuracy-sources.svg"
          alt="Location Accuracy Sources showing GPS, WiFi, cell towers, and IP-based location with accuracy ranges"
          caption="Location accuracy sources — GPS (1-10m, accurate but slow), WiFi (10-100m, faster), cell towers (100-1000m), IP (city-level, least accurate)"
          width={900}
          height={500}
        />

        <h3>Permission Patterns</h3>
        <p>
          <strong>Request on User Action:</strong> Request location when user clicks a location-related feature (e.g., &quot;Find Nearby&quot; button, &quot;Use My Location&quot; button). Advantages: user understands why location is needed (higher grant rate), user is more likely to grant permission (because they requested it). Limitations: can&apos;t show location features upfront (must wait for user action). Best for: most applications (e-commerce, retail, content sites).
        </p>
        <p>
          <strong>Request on Load:</strong> Request location on page load. Advantages: location is ready immediately (no wait for user action). Limitations: users deny without context (lower grant rate), can&apos;t re-request after denial (browser does not show permission prompt again after denial). Best for: location-first apps (maps, navigation, weather apps where location is the primary feature).
        </p>
        <p>
          <strong>Progressive:</strong> Start with coarse location (IP-based), request precise location when needed. Advantages: works without permission (IP-based location provides city-level accuracy), request precise location only when valuable (e.g., when user clicks &quot;Find Nearby Stores&quot;). Best for: content sites with optional location features (news, weather, e-commerce sites where location enhances but is not required for the primary experience).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/geolocation-use-cases.svg"
          alt="Geolocation Use Cases showing delivery tracking, nearby businesses, fitness tracking, and local content"
          caption="Geolocation use cases — delivery tracking (continuous), nearby businesses (one-time), fitness tracking (watchPosition), local content (IP fallback)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Geolocation involves trade-offs between accuracy, speed, power consumption, and privacy. Understanding these trade-offs is essential for making informed decisions about when to use geolocation and how to configure it.
        </p>

        <h3>Accuracy vs. Power</h3>
        <p>
          <strong>GPS (enableHighAccuracy: true):</strong> Most accurate (1-10 meter accuracy) but slow (seconds to minutes for first fix), drains battery quickly (GPS radio consumes significant power). Best for: navigation (turn-by-turn directions need precise location), fitness tracking (distance calculation needs precise location), delivery tracking (ETA calculation needs precise location). Use only when GPS precision is needed.
        </p>
        <p>
          <strong>WiFi/Cell (enableHighAccuracy: false):</strong> Less accurate (10-1000 meter accuracy) but fast (seconds to get location), less power consumption (WiFi and cell radios consume less power than GPS). Best for: nearby businesses (finding stores within a few miles does not need GPS precision), local content (showing local news, weather, currency does not need GPS precision), approximate location (showing city-level location does not need GPS precision). Use for most use cases where GPS precision is not needed.
        </p>
        <p>
          <strong>IP-based (fallback):</strong> Least accurate (city-level accuracy) but instant (no delay), no power consumption (no radio needed), no permission required (IP address is always available). Best for: coarse localization (language, currency, regional content), fallback when geolocation is denied (provide a basic experience without precise location), initial page load (show content based on IP location while waiting for precise location).
        </p>

        <h3>One-Time vs. Continuous</h3>
        <p>
          <strong>getCurrentPosition:</strong> One-time location request. Advantages: simple (no need to manage watch ID), less battery drain (location is acquired once, not continuously). Limitations: location becomes stale (if user moves, location is not updated). Best for: nearby businesses (finding stores near current location), local content (showing local news, weather, currency), check-in (recording current location).
        </p>
        <p>
          <strong>watchPosition:</strong> Continuous location tracking. Advantages: always current location (location is updated as user moves). Limitations: drains battery (location is acquired continuously), must clear watch when done (otherwise tracking continues and drains battery). Best for: navigation (turn-by-turn directions need current location), fitness tracking (distance calculation needs current location), delivery tracking (ETA calculation needs current location).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/location-accuracy-sources.svg"
          alt="Geolocation Trade-offs showing accuracy vs speed vs power consumption"
          caption="Geolocation trade-offs — GPS (accurate, slow, high power) vs WiFi (moderate accuracy, fast, moderate power) vs cell (low accuracy, fast, low power) vs IP (city-level, instant, no power)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Request on User Action:</strong> Do not request location on page load — users deny without understanding why (lower grant rate). Request when user clicks a location-related feature (e.g., &quot;Find Nearby&quot; button, &quot;Use My Location&quot; button). Explain why you need location before requesting (e.g., show a message: &quot;We need your location to find nearby stores&quot;). This increases the grant rate and provides a better user experience.
          </li>
          <li>
            <strong>Use Appropriate Accuracy:</strong> Do not use enableHighAccuracy unless you need GPS precision. WiFi/cell location is faster and uses less battery. Most use cases (nearby businesses, local content, approximate location) do not need GPS precision. Use enableHighAccuracy: true only for navigation, fitness tracking, delivery tracking, and other use cases that need precise location.
          </li>
          <li>
            <strong>Clear watchPosition:</strong> Always call clearWatch(watchId) when continuous tracking is no longer needed. This prevents battery drain (tracking continues even after the user leaves the page if watch is not cleared). Common bug: forget to clear watch when component unmounts (tracking continues in background, draining battery). In React, call clearWatch in the useEffect cleanup function. In other frameworks, call clearWatch in the appropriate lifecycle hook (e.g., componentWillUnmount in class components).
          </li>
          <li>
            <strong>Provide Fallback:</strong> Not all devices have GPS, users can deny permission, location can be unavailable (no WiFi, no cell coverage). Provide manual location entry as fallback (e.g., a search box where users can enter their city or zip code). Provide IP-based location as coarse fallback (use a geolocation service to get city-level location from IP address). This ensures that users who deny permission or have no location source still have a basic experience.
          </li>
          <li>
            <strong>Handle Errors Gracefully:</strong> PERMISSION_DENIED — offer manual location entry, explain how to enable in browser settings (e.g., &quot;Go to browser settings and enable location access for this site&quot;). POSITION_UNAVAILABLE — retry later (location may become available later, e.g., when user moves to an area with WiFi or cell coverage), offer manual location entry. TIMEOUT — increase timeout (default is infinite, but you can set a timeout in milliseconds), retry, offer manual location entry.
          </li>
          <li>
            <strong>Respect Privacy:</strong> Only request location when needed. Do not track continuously without clear user benefit (e.g., do not track location in background when user is not using the app). Be transparent about location usage in privacy policy (explain what location data is collected, how it is used, how long it is stored). Provide a way for users to delete location data (e.g., a &quot;Clear Location History&quot; button).
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Requesting on Load:</strong> Requesting location on page load causes users to deny without understanding why (lower grant rate). After denial, the browser does not show the permission prompt again (user must manually enable location access in browser settings). Always request location on user action with explanation (e.g., &quot;We need your location to find nearby stores&quot;). This increases the grant rate and provides a better user experience.
          </li>
          <li>
            <strong>Not Clearing Watch:</strong> watchPosition continues tracking after component unmounts (tracking continues even after the user leaves the page). This drains battery (GPS radio consumes significant power). Always clear watch in cleanup (useEffect return in React, componentWillUnmount in class components). Common bug: create watch on component mount, forget to clear watch on component unmount.
          </li>
          <li>
            <strong>Always Using High Accuracy:</strong> Using enableHighAccuracy: true for all use cases drains battery (GPS radio consumes significant power) and is slow (seconds to minutes for first fix). Use enableHighAccuracy: false for most use cases (nearby businesses, local content, approximate location). Use enableHighAccuracy: true only for navigation, fitness tracking, delivery tracking, and other use cases that need precise location.
          </li>
          <li>
            <strong>No Fallback:</strong> Users deny permission or device lacks GPS. App breaks without location (no manual location entry, no IP-based fallback). Always provide manual location entry (e.g., a search box where users can enter their city or zip code) or IP-based fallback (use a geolocation service to get city-level location from IP address). This ensures that users who deny permission or have no location source still have a basic experience.
          </li>
          <li>
            <strong>Ignoring Accuracy:</strong> Treating coordinates as exact point (actual location is within accuracy radius of reported coordinates with 95% confidence). For nearby search, use accuracy to determine search radius (e.g., search within accuracy radius, not within a fixed radius). For navigation, use accuracy to determine when to recalculate route (e.g., recalculate route when accuracy is below a threshold).
          </li>
          <li>
            <strong>HTTP Instead of HTTPS:</strong> Geolocation requires HTTPS (except localhost). HTTP requests fail silently or throw error (POSITION_UNAVAILABLE or PERMISSION_DENIED). Always use HTTPS for production. For development, localhost works without HTTPS. If you must support HTTP (legacy), provide IP-based fallback and explain HTTPS requirement for location features.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Delivery Tracking</h3>
        <p>
          Delivery apps (Uber Eats, DoorDash, Instacart) use watchPosition to track driver location in real-time. High accuracy needed for precise ETA calculation (enableHighAccuracy: true). Update location every few seconds (not continuously, to balance accuracy with battery drain). Clear watch when delivery is complete (stop tracking driver). Show driver location on map for customer (real-time tracking). Calculate ETA based on driver location and traffic conditions. This pattern provides accurate ETAs and real-time tracking for customers, improving user experience and reducing customer support inquiries (&quot;Where is my order?&quot;).
        </p>

        <h3>Nearby Businesses</h3>
        <p>
          Maps, review sites (Yelp, Google Maps, TripAdvisor) use getCurrentPosition for nearby search. One-time location (user clicks &quot;Find Nearby&quot; button). WiFi/cell accuracy sufficient (finding stores within a few miles does not need GPS precision). Show businesses within accuracy radius (e.g., search within 10 miles of user location). Provide manual location entry for users who deny permission (e.g., a search box where users can enter their city or zip code). This pattern provides a good user experience for users who grant permission and a basic experience for users who deny permission.
        </p>

        <h3>Fitness Tracking</h3>
        <p>
          Fitness apps (Strava, Nike Run Club, MapMyRun) use watchPosition with enableHighAccuracy for route tracking. GPS accuracy needed for distance calculation (enableHighAccuracy: true). Background location permission required (tracking continues when app is in background). Clear watch when workout ends (stop tracking). Calculate distance, pace, elevation from location data. Show route on map. This pattern provides accurate workout tracking for users, enabling them to track their progress and share their workouts with friends.
        </p>

        <h3>Local Content</h3>
        <p>
          News, weather sites (Weather Channel, local news sites) use geolocation for local content. Coarse location (city-level) sufficient (showing local news, weather, events does not need GPS precision). IP-based fallback when permission denied (use a geolocation service to get city-level location from IP address). Cache location to avoid repeated requests (store location in localStorage, use cached location on next visit). This pattern provides local content for users who grant permission and a basic experience for users who deny permission.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Geolocation API work and what are the location sources?
            </p>
            <p className="mt-2 text-sm">
              A: Geolocation API requests location from browser, which determines best source based on device capabilities and enableHighAccuracy option. GPS (most accurate, 1-10 meters, slow, drains battery) is used when enableHighAccuracy is true. WiFi (10-100 meters, faster, moderate power) is used when enableHighAccuracy is false and WiFi is available. Cell towers (100-1000 meters, fast, low power) are used when enableHighAccuracy is false and cell coverage is available. IP (city-level, instant, no power) is used as fallback when no other source is available. Browser returns Position object with latitude, longitude, accuracy (radius in meters), timestamp. Accuracy varies by source — GPS is precise, IP is coarse. The browser automatically selects the best available source, so you do not need to manage sources manually.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle geolocation permission denial?
            </p>
            <p className="mt-2 text-sm">
              A: Handle PERMISSION_DENIED error gracefully: explain why location is useful, provide instructions to enable in browser settings, offer manual location entry as fallback, and use IP-based location for coarse localization. Never repeatedly request after denial since the browser does not show the permission prompt again after denial.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you use getCurrentPosition vs. watchPosition?
            </p>
            <p className="mt-2 text-sm">
              A: getCurrentPosition for one-time location (nearby search, check-in, local content). watchPosition for continuous tracking (navigation, fitness, delivery). watchPosition drains battery — always clear watch when done. For most use cases, getCurrentPosition is sufficient. Only use watchPosition when location changes frequently and you need to track those changes (e.g., navigation, fitness tracking, delivery tracking). Use enableHighAccuracy: true for watchPosition only when GPS precision is needed (navigation, fitness tracking). Use enableHighAccuracy: false for watchPosition when approximate location is sufficient (delivery tracking, where 10-100 meter accuracy is acceptable).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize geolocation for battery life?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: (1) Use enableHighAccuracy: false unless GPS needed (WiFi/cell uses less power than GPS). (2) Use getCurrentPosition instead of watchPosition when possible (one-time location uses less power than continuous tracking). (3) Clear watchPosition when done (stop tracking when no longer needed). (4) Use maximumAge to accept cached position (e.g., maximumAge: 60000 accepts location up to 1 minute old, avoiding a new location acquisition). (5) Set reasonable timeout (e.g., timeout: 10000, 10 seconds, to avoid waiting too long for location). (6) Do not request location repeatedly — cache result (store location in state, use cached location for subsequent requests). Battery impact: GPS can drain 10-20% per hour of continuous use, WiFi/cell much less (1-5% per hour).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle geolocation on HTTP vs. HTTPS?
            </p>
            <p className="mt-2 text-sm">
              A: Geolocation requires secure context (HTTPS or localhost). HTTP requests fail with POSITION_UNAVAILABLE or PERMISSION_DENIED (browser does not allow location access over insecure connection). Solution: always use HTTPS for production. For development, localhost works without HTTPS. If you must support HTTP (legacy), provide IP-based fallback (use a geolocation service to get city-level location from IP address) and explain HTTPS requirement for location features (e.g., &quot;Location features require HTTPS. Please upgrade to HTTPS for full functionality.&quot;). For most projects, use HTTPS for production and provide IP-based fallback for HTTP.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you interpret the accuracy property?
            </p>
            <p className="mt-2 text-sm">
              A: Accuracy is radius in meters — actual location is within this radius of reported coordinates with 95% confidence. GPS: 1-10 meter accuracy, WiFi: 10-100 meter accuracy, cell: 100-1000 meter accuracy, IP: city-level accuracy (10-50 km). Use accuracy to determine search radius — for nearby search, search within accuracy radius (e.g., if accuracy is 100 meters, search within 100 meters of reported coordinates). Do not treat coordinates as exact point — they are approximate within accuracy radius. For navigation, use accuracy to determine when to recalculate route (e.g., recalculate route when accuracy is below 10 meters, to avoid recalculating route due to inaccurate location).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Geolocation API
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/geolocation/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Geolocation API Specification
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/geolocation/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Geolocation Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/lighthouse/best-practices/geolocation-on-start/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Chrome — Geolocation Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/geolocation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Geolocation Browser Support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );

}

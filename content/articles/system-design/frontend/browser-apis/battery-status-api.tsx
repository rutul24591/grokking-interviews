"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-battery-status-api",
  title: "Battery Status API",
  description:
    "Comprehensive guide to the Battery Status API covering battery level monitoring, charging state detection, power-aware application behavior adaptation, privacy and fingerprinting considerations, and production-scale implementation patterns for energy-efficient web applications.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "battery-status-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "browser API",
    "battery status",
    "power optimization",
    "energy efficiency",
    "mobile performance",
    "privacy",
    "fingerprinting",
  ],
  relatedTopics: ["mobile-performance-optimization"],
};

export default function BatteryStatusAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Battery Status API</strong> provides web applications with access to information about the device&apos;s battery level, charging state, and estimated charging or discharging time. Exposed through the <code>navigator.getBattery()</code> method, the API returns a Promise that resolves to a BatteryManager object with properties for the current battery level (a value between 0.0 and 1.0), whether the device is currently charging, the estimated time until the battery is fully charged, and the estimated time until the battery is fully discharged. The API also provides event listeners for changes to each of these properties, enabling applications to adapt their behavior dynamically as the battery state changes.
        </p>
        <p>
          The Battery Status API was introduced as part of the System Information API suite to enable web applications to make power-aware decisions that improve the user experience on battery-powered devices. When a device is running on battery power — particularly when the battery level is low — users benefit from applications that reduce their power consumption automatically. This can include reducing animation complexity, deferring non-critical network requests, lowering video quality, reducing the frequency of background tasks, and warning the user before initiating battery-intensive operations. On desktop laptops, where battery life directly impacts productivity, these optimizations can meaningfully extend the time between charges. On mobile devices, where battery anxiety is a common user concern, power-aware applications demonstrate respect for the user&apos;s device resources.
        </p>
        <p>
          The API&apos;s history is closely tied to privacy and fingerprinting concerns that have significantly limited its adoption. The Battery Status API was one of the first APIs to be identified as a potential fingerprinting vector — the characteristics of a device&apos;s battery (current level, charging rate, discharge rate) can be used as part of a fingerprint to identify and track users across sessions. Research demonstrated that battery characteristics, combined with other browser-exposed information, could uniquely identify a significant percentage of users. In response to these findings, several browsers restricted or removed Battery Status API support. Firefox deprecated the API entirely. Chrome restricted it to secure contexts and added mitigations. Safari never implemented it. This privacy-driven restriction is a critical consideration for any application planning to use the Battery Status API.
        </p>
        <p>
          For staff and principal engineers, the Battery Status API represents a tool for power-aware application optimization that must be used with careful consideration of privacy implications and browser support limitations. The API is valuable for applications that are particularly power-intensive — video streaming, real-time collaboration, gaming, data visualization — where adapting behavior based on battery state can meaningfully improve the user experience. However, the API should be treated as a progressive enhancement: the application must function fully without battery status information, and battery-aware optimizations should improve the experience for users whose browsers support the API without degrading it for users whose browsers do not. The privacy implications must also be considered — applications should not use battery status for tracking, fingerprinting, or any purpose that could compromise user privacy.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The <strong>BatteryManager object</strong> is the core interface of the Battery Status API, obtained by calling <code>navigator.getBattery()</code>, which returns a Promise that resolves to the BatteryManager instance. The BatteryManager provides four read-only properties that describe the current battery state. The <code>level</code> property is a number between 0.0 (completely discharged) and 1.0 (fully charged) representing the current battery charge level. The property is updated by the browser as the battery charges or discharges, and changes are reported through the <code>levelchange</code> event. The level property is the most commonly used battery metric, enabling applications to determine whether the battery is low (typically below 0.2 or 20%), medium (between 0.2 and 0.8), or high (above 0.8).
        </p>
        <p>
          The <code>charging</code> property is a boolean indicating whether the device is currently connected to a power source and charging. This property is true when the device is plugged in and actively receiving charge, and false when the device is running on battery power. Changes to this property are reported through the <code>chargingchange</code> event. The charging property is important for distinguishing between situations where power consumption is a concern (running on battery) and situations where it is not (plugged in). Applications can use this property to enable power-intensive features (high-quality video, complex animations, frequent background sync) only when the device is charging, and reduce power consumption when running on battery.
        </p>
        <p>
          The <code>chargingTime</code> property is a number representing the estimated time in seconds until the battery is fully charged. If the battery is already fully charged, the value is 0. If the battery is not charging, the value is Infinity (since the battery will never reach full charge while not connected to power). If the browser cannot determine the charging time (some devices do not provide this information), the value is also Infinity. Changes to this property are reported through the <code>chargingtimechange</code> event. The chargingTime property is less commonly used than level and charging, but it can be useful for applications that need to estimate when the device will be at full capacity — for example, a video editing application might defer a battery-intensive export operation until the battery is fully charged.
        </p>
        <p>
          The <code>dischargingTime</code> property is a number representing the estimated time in seconds until the battery is fully discharged. If the device is currently charging, the value is Infinity (since the battery will not discharge while connected to power). If the browser cannot determine the discharging time, the value is Infinity. Changes to this property are reported through the <code>dischargingtimechange</code> event. The dischargingTime property is valuable for estimating how much time the user has remaining before the device shuts down, enabling applications to warn the user when time is running out and to prioritize critical operations.
        </p>
        <p>
          The <strong>event model</strong> provides four event types for responding to battery state changes: <code>levelchange</code> fires when the battery level changes, <code>chargingchange</code> fires when the charging state changes (plugged in or unplugged), <code>chargingtimechange</code> fires when the estimated charging time changes, and <code>dischargingtimechange</code> fires when the estimated discharging time changes. These events enable applications to adapt their behavior dynamically as the battery state changes — for example, reducing animation complexity when the battery level drops below a threshold, or re-enabling full features when the device is plugged in. Event listeners are attached using the standard <code>addEventListener</code> method on the BatteryManager object.
        </p>
        <p>
          The <strong>privacy and fingerprinting implications</strong> are the most significant consideration for using the Battery Status API in production. The battery&apos;s characteristics — current level, charging rate, discharge rate, and the timing of changes to these values — can be used as part of a device fingerprint to identify and track users. Research has shown that battery status information, combined with other browser-exposed data (screen resolution, user agent, installed fonts), can uniquely identify a significant percentage of users. In response, Firefox deprecated the Battery Status API entirely, returning a BatteryManager that always reports 100% charge and charging state. Chrome restricted the API to secure contexts (HTTPS) and may add further restrictions in the future. Safari never implemented the API. Applications using the Battery Status API must be transparent about their use of battery data, must not use it for tracking or fingerprinting, and must handle the case where the API returns falsified or restricted data.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/battery-status-flow.svg"
          alt="Battery Status Flow diagram showing battery level monitoring, charging state detection, event handling, and behavior adaptation based on battery state"
          caption="Battery Status flow — application calls navigator.getBattery() to obtain BatteryManager, monitors level and charging properties, listens for change events, and adapts application behavior (reduce animations, defer tasks, warn user) based on current battery state"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production Battery Status API implementation requires an architecture that manages battery state monitoring, power-aware behavior adaptation, user notification, and privacy-compliant data handling. The architecture must handle the case where the API is unavailable or restricted, adapt gracefully to changing battery conditions, and ensure that battery-aware optimizations improve the user experience without introducing unexpected behavior changes.
        </p>
        <p>
          The <strong>battery monitoring layer</strong> is responsible for obtaining the BatteryManager object, reading the current battery state, and listening for state changes. On application initialization, the layer calls <code>navigator.getBattery()</code> and stores the resulting BatteryManager object. It reads the current battery level, charging state, and time estimates, and determines the current power mode (high power when plugged in or battery above 80%, balanced when battery is between 20% and 80%, and power saving when battery is below 20%). The layer registers event listeners for all four battery change events, and each listener updates the current power mode and triggers the appropriate behavior adaptation. The monitoring layer should handle the case where <code>getBattery()</code> is not available (API not supported) or where the BatteryManager returns restricted data (Firefox&apos;s always-full battery).
        </p>
        <p>
          The <strong>behavior adaptation layer</strong> modifies application behavior based on the current power mode. In high power mode (plugged in or battery above 80%), the application runs at full capability — all animations are enabled, background tasks run at normal frequency, video plays at the highest quality, and all features are available. In balanced mode (battery between 20% and 80%), the application makes moderate power optimizations — reducing animation frame rate, increasing the interval between background sync operations, and deferring non-critical network requests. In power saving mode (battery below 20%), the application makes aggressive power optimizations — disabling non-essential animations, pausing background sync, reducing video quality, and warning the user before initiating battery-intensive operations.
        </p>
        <p>
          The <strong>animation optimization layer</strong> is one of the most impactful behavior adaptations. Animations are a significant source of power consumption on mobile devices, as they require continuous GPU activity and screen refreshes. In power saving mode, the application can reduce animation complexity by replacing complex keyframe animations with simple opacity transitions, reducing animation frame rate from 60fps to 30fps, or disabling animations entirely for non-essential elements. The Web Animations API and CSS animations can be controlled through the <code>prefers-reduced-motion</code> media query or through JavaScript-based power mode detection. The animation optimization layer should be designed to degrade gracefully — animations should become simpler, not broken, as power mode decreases.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/battery-adaptation-strategies.svg"
          alt="Battery Adaptation Strategies diagram showing high power mode (full features), balanced mode (moderate optimizations), and power saving mode (aggressive optimizations) with specific adaptations for each mode"
          caption="Battery adaptation strategies — high power mode enables all features and animations, balanced mode reduces animation complexity and defers non-critical tasks, power saving mode disables non-essential animations, pauses background sync, reduces video quality, and warns user before battery-intensive operations"
          width={900}
          height={500}
        />

        <p>
          The <strong>network optimization layer</strong> reduces power consumption by optimizing network activity. Network requests are power-intensive because they activate the device&apos;s radio hardware, which consumes significant power even for brief transfers. In power saving mode, the application can reduce network activity by batching multiple small requests into a single larger request, increasing the interval between periodic polling operations, deferring non-critical requests (analytics, telemetry, pre-fetching) until the device is charging, and using the Background Sync API to queue requests for when connectivity and power are available. These optimizations reduce the frequency of radio activation, which is one of the largest contributors to mobile battery drain.
        </p>
        <p>
          The <strong>user notification layer</strong> communicates battery-aware behavior changes to the user. When the battery level drops below a critical threshold (e.g., 10%), the application can display a non-intrusive notification warning the user of low battery and explaining the power-saving measures that have been activated. Before initiating a battery-intensive operation (video upload, large file download, complex data processing), the application can display a confirmation dialog asking the user whether they want to proceed given the current battery level. The user notification layer should be respectful and informative — it should explain what the application is doing to conserve power and give the user control over whether to proceed with battery-intensive operations.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/battery-privacy-model.svg"
          alt="Battery Privacy Model diagram showing how battery data can be used for fingerprinting and the browser mitigations that restrict or falsify battery information"
          caption="Battery privacy model — battery characteristics (level, charging rate, discharge rate) can be used as part of a device fingerprint; browsers mitigate this by restricting API access (secure contexts only), returning falsified data (Firefox always reports 100% charge), or not implementing the API at all (Safari)"
          width={900}
          height={550}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The Battery Status API involves trade-offs between power optimization and implementation complexity, between user experience enhancement and privacy risk, and between progressive enhancement and core functionality dependency. Understanding these trade-offs is essential for making informed decisions about battery-aware application design.
        </p>
        <p>
          The most significant trade-off is <strong>power optimization versus implementation complexity</strong>. Adapting application behavior based on battery state requires implementing multiple power modes, designing behavior adaptations for each mode, testing the adaptations across different battery states, and handling edge cases (API unavailable, restricted data, rapid state changes). This adds significant complexity to the application&apos;s architecture and codebase. The benefit — extended battery life for users on battery-powered devices — must be weighed against the cost of implementing and maintaining the battery-aware infrastructure. For applications that are particularly power-intensive (video streaming, gaming, real-time collaboration), the benefit justifies the cost. For applications with minimal power consumption (static content sites, simple forms), the cost may outweigh the benefit.
        </p>
        <p>
          The <strong>user experience enhancement versus privacy risk</strong> trade-off is the most consequential consideration for the Battery Status API. Using battery status to optimize application behavior genuinely improves the user experience for battery-powered device users — they get longer battery life and fewer unexpected shutdowns. However, the same battery data can be used for fingerprinting and tracking, compromising user privacy. The browser&apos;s mitigations (restricted access, falsified data) reduce the privacy risk but also reduce the API&apos;s usefulness. Applications must be transparent about their use of battery data, must not use it for any purpose other than power optimization, and must handle the case where the API returns restricted or falsified data gracefully.
        </p>
        <p>
          The <strong>progressive enhancement versus core functionality</strong> trade-off affects how the application handles the case where the Battery Status API is unavailable. The API should be treated as a progressive enhancement — the application must function fully without battery status information, and battery-aware optimizations should improve the experience for users whose browsers support the API without degrading it for users whose browsers do not. If the application depends on battery status for core functionality (e.g., refusing to run when battery is low), users on browsers that do not support the API (Safari, Firefox) will have a broken experience. The solution is to assume a default power mode (balanced) when the API is unavailable and apply no battery-specific optimizations for those users.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/battery-tradeoffs.svg"
          alt="Battery Status API Trade-offs comparison matrix showing power optimization benefit, implementation complexity, privacy risk, and browser support across Battery Status API, OS-level power mode detection, and no battery awareness"
          caption="Battery awareness trade-offs — Battery Status API provides granular battery data but has privacy concerns and limited browser support; OS-level power mode detection (prefers-reduced-motion, Energy Saver API) provides indirect power awareness with better privacy; no battery awareness is simplest but ignores user battery constraints"
          width={900}
          height={500}
        />

        <h3>Power Awareness Approach Comparison</h3>
        <p>
          <strong>Battery Status API</strong> provides direct access to battery level, charging state, and time estimates. It enables granular power-aware behavior adaptation based on specific battery thresholds. Limitations include privacy concerns (fingerprinting risk), limited browser support (Firefox deprecated, Safari never implemented), and the need to handle restricted or falsified data. Best for: power-intensive applications on browsers that support the API.
        </p>
        <p>
          <strong>OS-level power mode detection</strong> uses indirect signals to infer power constraints. The <code>prefers-reduced-motion</code> media query can indicate a user&apos;s preference for reduced sensory input, which often correlates with power saving mode. The <code>Save-Data</code> client hint indicates that the user has enabled data-saving mode, which often coincides with power saving. The Battery Saver API (proposed) would provide a simple &quot;power saver mode active&quot; signal without exposing detailed battery data. These approaches have better privacy characteristics and broader browser support but provide less granular information than the Battery Status API.
        </p>
        <p>
          <strong>No battery awareness</strong> is the simplest approach — the application runs at full capability regardless of battery state. This is appropriate for applications with minimal power consumption (static content, simple forms) or for applications where power optimization is not a priority. The trade-off is that users on low battery do not benefit from any power-saving adaptations, and the application may contribute to faster battery drain than necessary.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          The most important best practice is <strong>treating battery status as a progressive enhancement</strong>. The application must function fully without battery status information, and battery-aware optimizations should improve the experience for users whose browsers support the API without degrading it for users whose browsers do not. Check for API support using <code>&apos;getBattery&apos; in navigator</code> before calling <code>navigator.getBattery()</code>. If the API is not supported, assume a default power mode (balanced) and apply no battery-specific optimizations. This ensures that all users have a functional experience, regardless of browser support.
        </p>
        <p>
          <strong>Using battery status only for power optimization</strong> is essential for user trust and privacy compliance. Battery data should not be sent to analytics servers, used for user tracking, stored in user profiles, or used for any purpose other than adapting application behavior to conserve power. If the application collects battery data for debugging or monitoring purposes, it should be anonymized, aggregated, and disclosed in the privacy policy. Users should be able to understand why the application is accessing their battery status and what it is doing with that information.
        </p>
        <p>
          <strong>Implementing graceful degradation for restricted API data</strong> ensures that the application works correctly when the browser returns falsified or restricted battery data. Firefox, for example, always reports 100% charge and charging state for the Battery Status API. The application should handle this gracefully — if the battery level is always 1.0 and charging is always true, the application should not assume the user is always plugged in. Instead, it should use other signals (such as the <code>Save-Data</code> client hint or <code>prefers-reduced-motion</code> media query) to infer power constraints, or simply apply no battery-specific optimizations.
        </p>
        <p>
          <strong>Defining clear power mode thresholds</strong> provides consistent behavior adaptation across the application. Define three power modes with specific battery level thresholds: high power (plugged in or battery level above 0.8), balanced (battery level between 0.2 and 0.8), and power saving (battery level below 0.2). For each mode, define specific behavior adaptations: which animations are enabled or disabled, which background tasks run, what video quality is used, and whether the user is warned before battery-intensive operations. Clear thresholds and defined adaptations ensure that the application&apos;s power-aware behavior is predictable and testable.
        </p>
        <p>
          <strong>Providing user control over power-aware behavior</strong> allows users to override the application&apos;s automatic power optimizations. Some users may prefer full performance even on low battery (e.g., during a critical presentation or demo), while others may prefer aggressive power saving even when plugged in. Provide a setting in the application&apos;s preferences that allows users to choose their power mode manually: &quot;Performance&quot; (always high power), &quot;Balanced&quot; (follow battery state), or &quot;Power Saving&quot; (always power saving). The manual setting should override the automatic battery-based detection.
        </p>
        <p>
          <strong>Testing battery-aware behavior across scenarios</strong> ensures that the application adapts correctly to changing battery conditions. Test the application in each power mode (high power, balanced, power saving) to verify that the appropriate adaptations are applied. Test the transition between modes — when the battery drops from 25% to 15%, the application should switch from balanced to power saving mode and apply the corresponding adaptations. Test the case where the API is unavailable or returns restricted data. Test the user notification flow — warnings and confirmations should be informative but not intrusive.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most critical pitfall is <strong>using battery status for tracking or fingerprinting</strong>, which violates user privacy and potentially breaches privacy regulations. Battery characteristics can uniquely identify users when combined with other browser data, and using this information for tracking is a serious privacy violation. Applications should never send battery data to analytics servers, use it for user identification, or store it in user profiles. The only legitimate use of battery status is power optimization — adapting application behavior to conserve battery. Any other use is a privacy violation and should be avoided.
        </p>
        <p>
          <strong>Depending on battery status for core functionality</strong> leads to broken experiences for users on browsers that do not support the API. If the application refuses to run a feature when battery is low, but the battery API is unavailable (Safari, Firefox), the application cannot determine the battery state and must make an assumption. Assuming the battery is low would block the feature for all Safari and Firefox users. Assuming the battery is high would allow the feature to run without battery awareness. The solution is to treat battery status as a progressive enhancement — the feature always runs, and battery awareness optimizes it for users whose browsers support the API.
        </p>
        <p>
          <strong>Not handling restricted or falsified API data</strong> leads to incorrect behavior assumptions. Firefox always reports 100% charge and charging state for the Battery Status API. If the application assumes this data is accurate, it will always operate in high power mode for Firefox users, missing the opportunity to optimize power consumption. The solution is to detect restricted data patterns (always 1.0 level, always charging) and fall back to alternative power awareness signals (Save-Data client hint, prefers-reduced-motion) or simply apply no battery-specific optimizations.
        </p>
        <p>
          <strong>Making power mode changes too aggressive</strong> creates a jarring user experience. When the battery level drops below a threshold, the application should not immediately disable all animations, pause all background tasks, and reduce video quality to the minimum. Sudden, dramatic behavior changes are confusing and frustrating. The solution is to implement gradual adaptation — as the battery level decreases, progressively apply more power-saving measures. For example, at 30% battery, reduce animation frame rate; at 20%, disable non-essential animations; at 10%, pause background sync and warn the user. Gradual adaptation provides a smoother experience and gives users time to adjust.
        </p>
        <p>
          <strong>Not providing user override for power-saving measures</strong> removes user control from critical situations. A user giving a presentation on low battery may need full animation and video quality despite the battery level. A user downloading a critical file on low battery may need the download to proceed despite the power cost. The solution is to provide a manual power mode setting that overrides the automatic battery-based detection, and to confirm with the user before applying aggressive power-saving measures that could impact their current task.
        </p>
        <p>
          <strong>Ignoring the impact of battery-aware optimizations on user experience</strong> can degrade the experience more than the battery drain it prevents. Disabling all animations on low battery may make the application feel broken or unresponsive. Reducing video quality too aggressively may make content unwatchable. The solution is to balance power savings with user experience — optimize power consumption in ways that are minimally perceptible to the user (reducing background task frequency, batching network requests) before resorting to visible degradations (disabling animations, reducing video quality).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Video Streaming Applications</h3>
        <p>
          Video streaming platforms use the Battery Status API to optimize playback quality based on battery state. When the battery is high or the device is charging, the application plays video at the highest available quality (4K, HDR) with all UI animations enabled. When the battery drops to medium levels, the application reduces the maximum quality to 1080p and reduces UI animation complexity. When the battery drops to low levels (below 20%), the application reduces quality to 720p, disables non-essential UI animations, and displays a notification to the user explaining the quality reduction and offering the option to restore higher quality at the cost of faster battery drain. Video playback is one of the most power-intensive activities on mobile devices, and battery-aware quality optimization can meaningfully extend playback time.
        </p>

        <h3>Real-Time Collaboration Tools</h3>
        <p>
          Collaborative applications (document editors, whiteboards, design tools) use the Battery Status API to optimize background synchronization and real-time update frequency based on battery state. When the battery is high, the application syncs changes in real-time with sub-second latency and maintains a persistent WebSocket connection. When the battery is medium, the application increases the sync interval to 2-5 seconds and reduces the frequency of presence updates. When the battery is low, the application pauses non-critical background sync, reduces the update frequency to 10-30 seconds, and warns the user before initiating battery-intensive operations like large file uploads or complex document rendering.
        </p>

        <h3>Mobile Gaming</h3>
        <p>
          Web-based games use the Battery Status API to optimize rendering quality, animation complexity, and background processing based on battery state. When the battery is high, the game runs at 60fps with full visual effects, particle systems, and audio. When the battery is medium, the game reduces the frame rate to 30fps, simplifies particle effects, and reduces audio quality. When the battery is low, the game further reduces visual quality, pauses background audio, and displays a warning to the user. Gaming is extremely power-intensive due to continuous GPU activity, and battery-aware optimization can significantly extend play time.
        </p>

        <h3>Navigation and Mapping Applications</h3>
        <p>
          Web-based navigation applications use the Battery Status API to optimize map rendering, GPS update frequency, and route recalculation based on battery state. When the battery is high, the application renders maps at full detail, updates GPS position frequently, and recalculates routes proactively. When the battery is low, the application reduces map detail, decreases GPS update frequency, and only recalculates routes when the user significantly deviates from the planned route. Navigation applications are commonly used while traveling, where access to charging may be limited, making battery optimization particularly valuable.
        </p>

        <h3>Data-Intensive Dashboards</h3>
        <p>
          Analytics dashboards and data visualization applications use the Battery Status API to optimize chart rendering, data refresh frequency, and animation complexity. When the battery is high, charts render with full detail, data refreshes every 30 seconds, and transitions between data states are animated. When the battery is low, chart detail is reduced (fewer data points rendered, simpler visualizations), data refresh interval increases to 5 minutes, and animations are disabled. Dashboard applications are commonly used on laptops during meetings and presentations, where battery life is critical and access to charging may not be available.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Battery Status API work, and what information does it provide?
            </p>
            <p className="mt-2 text-sm">
              A: The Battery Status API is accessed through <code>navigator.getBattery()</code>, which returns a Promise that resolves to a BatteryManager object. The BatteryManager provides four properties: <code>level</code> (battery charge from 0.0 to 1.0), <code>charging</code> (boolean indicating whether the device is plugged in), <code>chargingTime</code> (estimated seconds until fully charged, or Infinity), and <code>dischargingTime</code> (estimated seconds until fully discharged, or Infinity). It also provides four event listeners for changes to each property: levelchange, chargingchange, chargingtimechange, and dischargingtimechange.
            </p>
            <p className="mt-2 text-sm">
              The API enables applications to adapt their behavior based on battery state — reducing animations, deferring network requests, and warning users when battery is low. However, the API has limited browser support due to privacy concerns: Firefox deprecated it (always returns 100% charge), Safari never implemented it, and Chrome restricts it to secure contexts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the privacy concerns with the Battery Status API, and how do browsers mitigate them?
            </p>
            <p className="mt-2 text-sm">
              A: The primary privacy concern is fingerprinting. Battery characteristics — current level, charging rate, discharge rate, and the timing of changes to these values — can be used as part of a device fingerprint to identify and track users across sessions. Research demonstrated that battery data, combined with other browser-exposed information, could uniquely identify a significant percentage of users.
            </p>
            <p className="mt-2 text-sm">
              Browsers have responded with various mitigations. Firefox deprecated the Battery Status API entirely, returning a BatteryManager that always reports 100% charge and charging state. Chrome restricted the API to secure contexts (HTTPS only) and may add further restrictions. Safari never implemented the API. These mitigations reduce the fingerprinting risk but also reduce the API&apos;s usefulness — applications must handle the case where the API returns falsified or unavailable data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement power-aware behavior adaptation in a web application?
            </p>
            <p className="mt-2 text-sm">
              A: Power-aware behavior adaptation involves three steps. First, detect battery state: call <code>navigator.getBattery()</code> to obtain the BatteryManager, read the current level and charging state, and determine the power mode (high power when plugged in or above 80%, balanced between 20-80%, power saving below 20%). Register event listeners for battery change events to update the power mode dynamically.
            </p>
            <p className="mt-2 text-sm">
              Second, define behavior adaptations for each power mode. In high power mode, enable all features. In balanced mode, make moderate optimizations (reduce animation frame rate, increase background sync interval). In power saving mode, make aggressive optimizations (disable non-essential animations, pause background sync, reduce video quality, warn user before battery-intensive operations).
            </p>
            <p className="mt-2 text-sm">
              Third, handle the case where the API is unavailable or returns restricted data. If <code>getBattery()</code> is not supported, assume balanced mode and apply no battery-specific optimizations. If the API returns restricted data (Firefox&apos;s always-full battery), detect the pattern and fall back to alternative signals or no optimization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you balance power optimization with user experience quality?
            </p>
            <p className="mt-2 text-sm">
              A: The key is to prioritize optimizations that are minimally perceptible to the user. Network optimization (batching requests, increasing polling intervals, deferring non-critical requests) reduces power consumption without any visible impact on the user experience. Background task optimization (reducing sync frequency, pausing analytics reporting) also has minimal user-visible impact.
            </p>
            <p className="mt-2 text-sm">
              Visible optimizations (reducing animation complexity, lowering video quality, simplifying chart rendering) should be applied gradually and only when necessary. Implement progressive degradation — as battery level decreases, apply more optimizations incrementally rather than all at once. At 30% battery, reduce animation frame rate. At 20%, disable non-essential animations. At 10%, reduce video quality and warn the user. This gradual approach provides a smoother experience and gives users time to adapt.
            </p>
            <p className="mt-2 text-sm">
              Always provide user override — allow users to manually select their power mode and to override automatic optimizations when they need full performance despite low battery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What alternatives exist for power awareness when the Battery Status API is not available?
            </p>
            <p className="mt-2 text-sm">
              A: Several alternatives provide indirect power awareness. The <code>Save-Data</code> client hint indicates that the user has enabled data-saving mode in their browser, which often coincides with power saving mode. Applications can check <code>navigator.connection.saveData</code> and reduce data transfer (lower image quality, defer non-critical requests) when Save-Data is enabled.
            </p>
            <p className="mt-2 text-sm">
              The <code>prefers-reduced-motion</code> media query indicates that the user prefers reduced visual motion, which often correlates with a preference for reduced power consumption. Applications can check this preference and reduce animation complexity accordingly.
            </p>
            <p className="mt-2 text-sm">
              The proposed Battery Saver API would provide a simple &quot;power saver mode active&quot; signal without exposing detailed battery data, addressing the privacy concerns of the current Battery Status API. Until this API is widely supported, applications should use the available signals (Save-Data, prefers-reduced-motion) as proxies for power constraints and apply conservative optimizations that improve the experience for all users, not just those with battery concerns.
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN Web Docs — Battery Status API Complete Reference
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/battery-status/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C Battery Status API Specification
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/battery-status"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Battery Status API Browser Compatibility Data
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/battery-status/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Battery Fingerprinting and Privacy Considerations
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/save-data/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Save-Data Client Hint for Data and Power Saving
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

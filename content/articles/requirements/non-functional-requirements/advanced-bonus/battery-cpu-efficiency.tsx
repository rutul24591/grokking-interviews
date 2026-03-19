"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-battery-cpu-efficiency-extensive",
  title: "Battery & CPU Efficiency",
  description: "Comprehensive guide to mobile battery and CPU efficiency, covering power consumption optimization, background task management, and performance profiling for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "battery-cpu-efficiency",
  version: "extensive",
  wordCount: 11000,
  readingTime: 44,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "battery", "cpu", "mobile", "performance", "power-optimization"],
  relatedTopics: ["memory-management", "performance-optimization", "network-efficiency"],
};

export default function BatteryCpuEfficiencyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Battery & CPU Efficiency</strong> refers to optimizing application behavior to minimize
          power consumption and CPU usage, particularly critical for mobile devices where battery life is a
          primary user concern. Unlike desktop applications where power is often assumed to be unlimited,
          mobile apps must operate within strict energy budgets.
        </p>
        <p>
          Battery drain is one of the top reasons users uninstall mobile apps. A study by Greenlytics found
          that poorly optimized apps can drain up to 30% of daily battery capacity. Users expect their devices
          to last a full day on a single charge, and apps that violate this expectation face negative reviews
          and abandonment.
        </p>
        <p>
          CPU efficiency directly impacts battery life. The CPU is one of the most power-hungry components in
          a mobile device. High CPU usage causes:
        </p>
        <ul>
          <li>
            <strong>Battery drain:</strong> CPU cycles consume power. More cycles = faster battery depletion.
          </li>
          <li>
            <strong>Thermal throttling:</strong> Sustained high CPU usage generates heat, triggering thermal
            throttling that reduces performance.
          </li>
          <li>
            <strong>Poor user experience:</strong> Janky animations, slow interactions, and device warmth
            signal poor optimization.
          </li>
          <li>
            <strong>Background restrictions:</strong> iOS and Android aggressively terminate apps that abuse
            background resources.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Power Is a Finite Resource</h3>
          <p>
            Mobile devices have battery capacities ranging from 2,000-5,000 mAh. Every operation — rendering,
            network requests, animations, sensor polling — draws from this finite pool. Efficient apps
            maximize user value per milliamp-hour.
          </p>
          <p className="mt-3">
            <strong>Power efficiency is not optional</strong> — it is a core quality metric that impacts user
            retention, app store ratings, and platform compliance (both Apple and Google enforce background
            execution limits).
          </p>
        </div>

        <p>
          This article covers power consumption fundamentals, CPU profiling techniques, optimization strategies
          for common operations, and platform-specific best practices for iOS and Android.
        </p>
      </section>

      <section>
        <h2>Power Consumption Fundamentals</h2>
        <p>
          Understanding how mobile devices consume power is essential for optimization.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Major Power Consumers</h3>
        <p>
          A typical smartphone&apos;s power budget breaks down as follows:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Component</th>
                <th className="p-2 text-left">Power Draw</th>
                <th className="p-2 text-left">Optimization Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Display</td>
                <td className="p-2">30-40% of total</td>
                <td className="p-2">Reduce brightness, use dark mode, minimize screen-on time</td>
              </tr>
              <tr>
                <td className="p-2">CPU</td>
                <td className="p-2">20-30% of total</td>
                <td className="p-2">Optimize algorithms, reduce polling, batch operations</td>
              </tr>
              <tr>
                <td className="p-2">Radio (Cellular/WiFi)</td>
                <td className="p-2">15-25% of total</td>
                <td className="p-2">Batch network requests, use push notifications</td>
              </tr>
              <tr>
                <td className="p-2">GPU</td>
                <td className="p-2">10-15% of total</td>
                <td className="p-2">Simplify animations, reduce overdraw</td>
              </tr>
              <tr>
                <td className="p-2">Sensors (GPS, etc.)</td>
                <td className="p-2">5-10% of total</td>
                <td className="p-2">Use coarse location, reduce polling frequency</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CPU Power States</h3>
        <p>
          Modern mobile CPUs use dynamic voltage and frequency scaling (DVFS) to balance performance and
          power consumption:
        </p>
        <ul>
          <li>
            <strong>Idle (C-states):</strong> CPU cores enter low-power sleep states when idle. Deeper sleep
            states (C3, C6) save more power but take longer to wake.
          </li>
          <li>
            <strong>Active (P-states):</strong> CPU frequency scales based on workload. Higher frequencies
            provide more performance but consume exponentially more power (P ∝ V²f).
          </li>
          <li>
            <strong>Big.LITTLE Architecture:</strong> Modern SoCs use heterogeneous processing with high-efficiency
            cores for light tasks and high-performance cores for demanding workloads.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/cpu-power-states.svg"
          alt="CPU Power States and DVFS"
          caption="CPU Power States — showing idle C-states (C0 active, C1-C6 progressively deeper sleep), active P-states (frequency scaling), and Big.LITTLE architecture with efficiency vs performance cores"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tail Energy</h3>
        <p>
          <strong>Tail energy</strong> is the power consumed after an operation completes, while the radio or
          CPU returns to idle. This is often overlooked but can account for 30-50% of total energy usage.
        </p>
        <p>
          <strong>Example:</strong> After a network request completes, the cellular radio remains in a
          high-power state for several seconds before transitioning to idle. Making many small requests
          incurs tail energy overhead for each request.
        </p>
        <p>
          <strong>Mitigation:</strong> Batch operations together to amortize tail energy. Instead of sending
          10 analytics events individually, batch them into a single request.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Power Profiling Tools</h3>
        <p>
          Measure power consumption to identify optimization opportunities:
        </p>
        <ul>
          <li>
            <strong>Android Battery Historian:</strong> Analyze battery usage, wake locks, and background
            activity from bugreports.
          </li>
          <li>
            <strong>iOS Energy Log:</strong> Profile app energy impact using Xcode&apos;s Instruments
            (Energy Log template).
          </li>
          <li>
            <strong>Android Profiler:</strong> Real-time CPU, memory, and network profiling in Android Studio.
          </li>
          <li>
            <strong>Chrome DevTools Performance:</strong> Profile web app CPU usage and identify long tasks.
          </li>
        </ul>
      </section>

      <section>
        <h2>CPU Optimization Strategies</h2>
        <p>
          Reducing CPU usage is the most impactful way to improve battery efficiency.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Minimize Main Thread Work</h3>
        <p>
          The main thread handles UI rendering, user input, and JavaScript execution. Blocking the main
          thread causes jank and forces the CPU to stay in high-power states longer.
        </p>
        <p>
          <strong>Strategies:</strong>
        </p>
        <ul>
          <li>
            <strong>Avoid long tasks:</strong> Break work into chunks of {'<'}50ms to allow the browser to
            process input and paint frames.
          </li>
          <li>
            <strong>Use Web Workers:</strong> Offload CPU-intensive computations (image processing, data
            transformation) to background threads.
          </li>
          <li>
            <strong>Defer non-critical work:</strong> Use <code>requestIdleCallback</code> to schedule work
            during idle periods.
          </li>
          <li>
            <strong>Virtualize long lists:</strong> Render only visible items to reduce DOM manipulation and
            layout calculations.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Optimize Animations</h3>
        <p>
          Animations are a major source of CPU and GPU usage. Poorly optimized animations cause frame drops
          and excessive power consumption.
        </p>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>
            <strong>Use CSS transforms:</strong> <code>transform</code> and <code>opacity</code> are
            GPU-accelerated and avoid layout recalculation.
          </li>
          <li>
            <strong>Avoid animating layout properties:</strong> Properties like <code>width</code>,
            <code>height</code>, <code>top</code>, <code>left</code> trigger layout and paint on every frame.
          </li>
          <li>
            <strong>Use will-change sparingly:</strong> This hints the browser to promote elements to
            compositor layers, but overuse increases memory usage.
          </li>
          <li>
            <strong>Reduce animation complexity:</strong> Simplify animations on low-end devices using
            <code>prefers-reduced-motion</code> media query.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Efficient Event Handling</h3>
        <p>
          Event listeners can cause excessive CPU wakeups if not implemented carefully.
        </p>
        <p>
          <strong>Strategies:</strong>
        </p>
        <ul>
          <li>
            <strong>Debounce and throttle:</strong> Limit how often scroll, resize, and input handlers fire.
            Debouncing waits for a pause; throttling limits to once per interval.
          </li>
          <li>
            <strong>Use passive listeners:</strong> <code>{`{ passive: true }`}</code> for scroll and touch
            events tells the browser the listener won&apos;t call <code>preventDefault()</code>, allowing
            smoother scrolling.
          </li>
          <li>
            <strong>Remove unused listeners:</strong> Clean up event listeners when components unmount to
            prevent unnecessary callbacks.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Reduce Polling</h3>
        <p>
          Polling keeps the CPU awake and prevents deep sleep states. Replace polling with event-driven
          alternatives where possible.
        </p>
        <p>
          <strong>Alternatives to polling:</strong>
        </p>
        <ul>
          <li>
            <strong>Push notifications:</strong> Use WebSocket, Server-Sent Events, or platform push
            notifications instead of polling for updates.
          </li>
          <li>
            <strong>Intersection Observer:</strong> Detect element visibility without polling scroll position.
          </li>
          <li>
            <strong>Mutation Observer:</strong> React to DOM changes without polling.
          </li>
          <li>
            <strong>Adaptive polling:</strong> If polling is unavoidable, increase intervals during inactivity
            and decrease during active use.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/cpu-optimization-strategies.svg"
          alt="CPU Optimization Strategies"
          caption="CPU Optimization — showing main thread work distribution, GPU-accelerated animation properties (transform, opacity), debouncing vs throttling, and polling alternatives"
        />
      </section>

      <section>
        <h2>Network Efficiency</h2>
        <p>
          Network operations are among the most power-intensive tasks a mobile app performs. The radio
          subsystem consumes significant power during transmission and has substantial tail energy.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Radio State Machine</h3>
        <p>
          Cellular radios operate in multiple states with different power consumption:
        </p>
        <ul>
          <li>
            <strong>Connected (DCH):</strong> High power (~500-1000 mW). Active data transfer.
          </li>
          <li>
            <strong>FACH:</strong> Medium power (~200-400 mW). Low-rate data, short tail period after transfer.
          </li>
          <li>
            <strong>IDLE (PCH):</strong> Low power (~5-20 mW). No active transfer, periodic paging.
          </li>
        </ul>
        <p>
          <strong>Tail energy problem:</strong> After data transfer completes, the radio stays in FACH for
          5-12 seconds before transitioning to IDLE. Making multiple small requests within this window is
          efficient; spreading them out wastes tail energy.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Network Optimization Strategies</h3>
        <p>
          <strong>1. Batch Requests:</strong> Combine multiple API calls into a single request. Instead of
          fetching user data, preferences, and feed separately, use a single GraphQL query or batched REST
          endpoint.
        </p>
        <p>
          <strong>2. Use Connection Coalescing:</strong> HTTP/2 multiplexing allows multiple requests over a
          single TCP connection, reducing connection setup overhead.
        </p>
        <p>
          <strong>3. Implement Smart Caching:</strong> Cache responses aggressively to avoid redundant
          network requests. Use ETag and If-None-Match for conditional requests.
        </p>
        <p>
          <strong>4. Prefetch Strategically:</strong> Prefetch data when the radio is already active (e.g.,
          after a user action) rather than waking it separately.
        </p>
        <p>
          <strong>5. Reduce Payload Size:</strong> Compress responses (gzip, Brotli), use efficient formats
          (Protocol Buffers, MessagePack), and request only needed fields (GraphQL).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">WiFi vs Cellular</h3>
        <p>
          WiFi is significantly more power-efficient than cellular:
        </p>
        <ul>
          <li>
            <strong>WiFi:</strong> ~100-300 mW during transfer, fast tail decay.
          </li>
          <li>
            <strong>Cellular (4G/5G):</strong> ~500-1500 mW during transfer, longer tail period.
          </li>
        </ul>
        <p>
          <strong>Strategy:</strong> Defer non-urgent transfers (analytics, backups, sync) until WiFi is
          available. Use Network Information API to detect connection type.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/radio-state-machine.svg"
          alt="Cellular Radio State Machine"
          caption="Radio State Machine — showing Connected (DCH), FACH, and IDLE (PCH) states with power consumption levels, tail energy periods, and batching optimization"
        />
      </section>

      <section>
        <h2>Background Task Management</h2>
        <p>
          Background execution is heavily restricted on mobile platforms to preserve battery. Understanding
          these constraints is critical for designing efficient apps.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">iOS Background Execution</h3>
        <p>
          iOS allows limited background execution for specific purposes:
        </p>
        <ul>
          <li>
            <strong>Background Fetch:</strong> App wakes periodically (~every 15 minutes) to fetch content.
            System controls timing based on usage patterns.
          </li>
          <li>
            <strong>Remote Notifications:</strong> Push notifications can wake app for background processing
            (content-available flag).
          </li>
          <li>
            <strong>Background Tasks (BGTaskScheduler):</strong> Schedule processing or refresh tasks with
            quality-of-service constraints.
          </li>
          <li>
            <strong>Location Updates:</strong> Continuous or significant location changes (requires user
            permission and App Store justification).
          </li>
          <li>
            <strong>Audio/VoIP:</strong> Apps providing audio or VoIP services can run in background.
          </li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>Complete background tasks quickly (under 30 seconds).</li>
          <li>Use expiration handlers to save state if time runs out.</li>
          <li>Avoid waking the device unnecessarily — batch work during system-scheduled fetches.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Android Background Execution</h3>
        <p>
          Android provides more flexibility but has progressively tightened restrictions:
        </p>
        <ul>
          <li>
            <strong>WorkManager:</strong> Deferred background work with constraints (network type, charging
            state, battery level).
          </li>
          <li>
            <strong>Foreground Services:</strong> Long-running tasks with visible notification (music
            playback, navigation, fitness tracking).
          </li>
          <li>
            <strong>JobScheduler:</strong> System-managed job scheduling with Doze mode compatibility.
          </li>
          <li>
            <strong>AlarmManager:</strong> Precise timing for alarms (use sparingly due to battery impact).
          </li>
        </ul>
        <p>
          <strong>Doze Mode:</strong> When device is stationary and screen-off, Android enters Doze mode,
          deferring network access, alarms, and background work to periodic maintenance windows.
        </p>
        <p>
          <strong>App Standby:</strong> Apps not used recently are placed in standby, restricting background
          network and job execution.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Web Background Sync</h3>
        <p>
          Progressive Web Apps have limited background capabilities:
        </p>
        <ul>
          <li>
            <strong>Background Sync API:</strong> Defer actions until network is available. Browser handles
            retry logic.
          </li>
          <li>
            <strong>Periodic Background Sync:</strong> Fetch content periodically (requires user permission
            and Chrome on Android).
          </li>
          <li>
            <strong>Push Notifications:</strong> Wake service worker to handle push events.
          </li>
        </ul>
        <p>
          <strong>Limitation:</strong> Web APIs are less powerful than native. For heavy background processing,
          native apps have significant advantages.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/background-task-management.svg"
          alt="Background Task Management"
          caption="Background Task Management — comparing iOS (BGTaskScheduler, Background Fetch) and Android (WorkManager, JobScheduler, Doze Mode) background execution models"
        />
      </section>

      <section>
        <h2>Sensor and Location Efficiency</h2>
        <p>
          Sensors (GPS, accelerometer, gyroscope) and location services are significant power consumers.
          Optimize their usage carefully.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Location Services</h3>
        <p>
          GPS is one of the most power-hungry sensors. Optimize location usage:
        </p>
        <ul>
          <li>
            <strong>Use appropriate accuracy:</strong> Don&apos;t request <code>highAccuracy</code> unless
            necessary. Coarse location (cell tower, WiFi) uses far less power.
          </li>
          <li>
            <strong>Reduce update frequency:</strong> Request location updates only as often as needed. For
            fitness tracking, 1 Hz may be sufficient; for navigation, 5-10 Hz.
          </li>
          <li>
            <strong>Use significant location changes:</strong> iOS provides significant location change
            notifications (~500m movement) with minimal power impact.
          </li>
          <li>
            <strong>Stop updates when not needed:</strong> Always call <code>clearWatch()</code> or
            <code>stopLocationUpdates()</code> when location is no longer required.
          </li>
          <li>
            <strong>Geofencing:</strong> Use geofences to trigger location-based actions instead of
            continuous polling.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Motion Sensors</h3>
        <p>
          Accelerometer, gyroscope, and magnetometer consume less power than GPS but still impact battery:
        </p>
        <ul>
          <li>
            <strong>Use appropriate sampling rate:</strong> Higher sample rates (100 Hz+) drain more power.
            Use the lowest rate that meets your needs.
          </li>
          <li>
            <strong>Batch sensor data:</strong> Read sensor data in batches rather than continuous streaming.
          </li>
          <li>
            <strong>Use step detector:</strong> Android&apos;s step detector hardware offloads step counting
            to a low-power co-processor.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sensor Fusion</h3>
        <p>
          Modern devices use sensor fusion to combine data from multiple sensors efficiently:
        </p>
        <ul>
          <li>
            <strong>Android Sensor Hub:</strong> Dedicated low-power processor handles sensor fusion, allowing
            main CPU to sleep.
          </li>
          <li>
            <strong>iOS Motion Coprocessor:</strong> M-series coprocessors continuously track motion data
            with minimal power impact.
          </li>
        </ul>
        <p>
          <strong>Best practice:</strong> Use fused sensor APIs (Android SensorManager, iOS CMDeviceMotion)
          rather than raw sensor data when possible.
        </p>
      </section>

      <section>
        <h2>Display Optimization</h2>
        <p>
          The display is the largest power consumer. While web developers have limited control over display
          hardware, several optimizations are possible.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dark Mode</h3>
        <p>
          OLED displays (used in most premium smartphones) power individual pixels. Black pixels are off and
          consume no power.
        </p>
        <p>
          <strong>Power savings:</strong> Studies show dark mode can reduce display power consumption by
          30-60% on OLED displays, depending on content.
        </p>
        <p>
          <strong>Implementation:</strong> Use <code>prefers-color-scheme</code> media query to respect
          system dark mode setting:
        </p>
        <ul>
          <li>Design dark theme with true black (#000000) for maximum OLED savings.</li>
          <li>Avoid pure white backgrounds — use dark gray (#1a1a1a to #2a2a2a).</li>
          <li>Reduce brightness of non-essential UI elements.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Reduce Screen-On Time</h3>
        <p>
          The longer the screen is on, the more power is consumed. Optimize user flows to minimize
          screen-on time:
        </p>
        <ul>
          <li>
            <strong>Quick interactions:</strong> Design efficient UIs that allow users to complete tasks
            quickly.
          </li>
          <li>
            <strong>Voice interfaces:</strong> For certain tasks (timers, reminders, queries), voice
            interaction can reduce screen dependency.
          </li>
          <li>
            <strong>Ambient display:</strong> Show only essential information when device is idle (e.g.,
            always-on display for notifications).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Refresh Rate</h3>
        <p>
          High refresh rate displays (90 Hz, 120 Hz) consume more power. Consider:
        </p>
        <ul>
          <li>
            <strong>Match content frame rate:</strong> Don&apos;t render at 120 fps if content only updates
            at 30 fps.
          </li>
          <li>
            <strong>Reduce refresh during static content:</strong> Some devices support variable refresh
            rates — use this when available.
          </li>
        </ul>
      </section>

      <section>
        <h2>Profiling and Measurement</h2>
        <p>
          You cannot optimize what you cannot measure. Use profiling tools to identify power-hungry
          operations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Chrome DevTools Performance</h3>
        <p>
          The Performance panel shows CPU activity over time:
        </p>
        <ul>
          <li>
            <strong>Main thread waterfall:</strong> Identify long tasks, layout thrashing, and scripting
            bottlenecks.
          </li>
          <li>
            <strong>Frame analysis:</strong> Check for dropped frames (red bars) indicating CPU/GPU overload.
          </li>
          <li>
            <strong>Event timing:</strong> See how user interactions trigger cascading work.
          </li>
        </ul>
        <p>
          <strong>Power profiler (experimental):</strong> Chrome&apos;s <code>chrome://tracing</code> with
          power profiling enabled shows energy impact of web operations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Android Battery Historian</h3>
        <p>
          Analyze battery usage from bugreports:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Enable USB debugging on device.</li>
          <li>Run <code>adb bugreport</code> to capture battery stats.</li>
          <li>Run <code>battery-historian --port 9999</code> and open in browser.</li>
          <li>Analyze wake locks, network usage, and background activity.</li>
        </ol>
        <p>
          <strong>Key metrics:</strong>
        </p>
        <ul>
          <li>Wake lock duration</li>
          <li>Cellular radio active time</li>
          <li>Background job execution</li>
          <li>Alarm triggers</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Xcode Instruments (iOS)</h3>
        <p>
          Energy Log template in Xcode Instruments:
        </p>
        <ul>
          <li>
            <strong>Energy Impact:</strong> Real-time energy consumption graph.
          </li>
          <li>
            <strong>App Nap:</strong> See when system reduces app priority.
          </li>
          <li>
            <strong>Idle Display Sleep:</strong> Track display power states.
          </li>
          <li>
            <strong>Power Report:</strong> Detailed breakdown by subsystem (CPU, GPU, network, location).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/power-profiling-tools.svg"
          alt="Power Profiling Tools"
          caption="Power Profiling Tools — showing Chrome DevTools Performance panel, Android Battery Historian interface, and Xcode Instruments Energy Log with key metrics"
        />
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">CPU Efficiency Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Break long tasks into chunks {'<'}50ms</li>
            <li>✓ Use Web Workers for heavy computations</li>
            <li>✓ Animate only transform and opacity</li>
            <li>✓ Debounce/throttle scroll and resize handlers</li>
            <li>✓ Use passive event listeners</li>
            <li>✓ Replace polling with event-driven alternatives</li>
            <li>✓ Virtualize long lists</li>
            <li>✓ Use requestIdleCallback for deferrable work</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Network Efficiency Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Batch API requests together</li>
            <li>✓ Use HTTP/2 for connection multiplexing</li>
            <li>✓ Implement aggressive caching (ETag, Cache-Control)</li>
            <li>✓ Compress responses (Brotli, gzip)</li>
            <li>✓ Prefetch during radio active periods</li>
            <li>✓ Defer non-urgent transfers to WiFi</li>
            <li>✓ Use Protocol Buffers for binary data</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Background Task Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Use WorkManager (Android) / BGTaskScheduler (iOS)</li>
            <li>✓ Complete background tasks in {'<'}30 seconds</li>
            <li>✓ Handle expiration gracefully</li>
            <li>✓ Avoid waking device unnecessarily</li>
            <li>✓ Respect Doze mode and App Standby</li>
            <li>✓ Use foreground services only when necessary</li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Location & Sensor Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Use coarse location when high accuracy not needed</li>
            <li>✓ Reduce location update frequency</li>
            <li>✓ Stop location updates when not needed</li>
            <li>✓ Use geofencing instead of continuous tracking</li>
            <li>✓ Use sensor fusion APIs (not raw sensors)</li>
            <li>✓ Leverage low-power coprocessors (M-series, Sensor Hub)</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does tail energy impact mobile battery life?</p>
            <p className="mt-2 text-sm">
              A: Tail energy is power consumed after data transfer while the radio returns to idle. Cellular
              radios stay in high-power FACH state for 5-12 seconds post-transfer. Making many small requests
              incurs tail energy for each, potentially wasting 30-50% of total radio energy. Solution: batch
              requests together to amortize tail overhead.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What strategies reduce CPU usage in mobile web apps?</p>
            <p className="mt-2 text-sm">
              A: Key strategies: (1) Break long tasks into {'<'}50ms chunks to allow idle periods, (2) Use Web
              Workers for heavy computations, (3) Animate only GPU-accelerated properties (transform, opacity),
              (4) Debounce/throttle scroll and resize handlers, (5) Use passive event listeners, (6) Replace
              polling with IntersectionObserver/MutationObserver, (7) Virtualize long lists.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do iOS and Android handle background execution differently?</p>
            <p className="mt-2 text-sm">
              A: iOS is more restrictive: Background Fetch (~every 15 min), BGTaskScheduler for deferred work,
              remote notifications, and specific modes (audio, VoIP, location). Android offers WorkManager,
              JobScheduler, Foreground Services with notifications, and AlarmManager. Both have Doze-like
              modes that defer background work during inactivity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is dark mode more power-efficient on OLED displays?</p>
            <p className="mt-2 text-sm">
              A: OLED pixels emit their own light. Black pixels are turned off completely, consuming zero
              power. White pixels require all sub-pixels (RGB) at full brightness. Studies show dark mode
              reduces display power by 30-60% on OLED. LCD displays use a constant backlight, so dark mode
              provides minimal power savings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you optimize location tracking for a fitness app?</p>
            <p className="mt-2 text-sm">
              A: Use appropriate accuracy (GPS for outdoor runs, coarse for general tracking). Reduce update
              frequency (1 Hz sufficient for most fitness use cases). Use step detector hardware for step
              counting. Implement geofencing for route boundaries. Stop tracking when activity pauses. Use
              sensor fusion APIs that leverage low-power coprocessors. Batch location data for upload.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What tools would you use to profile battery consumption?</p>
            <p className="mt-2 text-sm">
              A: For web: Chrome DevTools Performance panel, chrome://tracing with power profiling. For
              Android: Battery Historian (from bugreports), Android Profiler in Android Studio. For iOS:
              Xcode Instruments Energy Log template. Key metrics: wake lock duration, radio active time,
              background job execution, CPU usage patterns.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.android.com/topic/performance/power" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Android Developers - Power Efficiency
            </a>
          </li>
          <li>
            <a href="https://developer.apple.com/documentation/xcode/improving-your-app-s-energy-impact" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Apple Developer - Improving Your App&apos;s Energy Impact
            </a>
          </li>
          <li>
            <a href="https://web.dev/power-efficiency/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev - Power Efficiency for Web Apps
            </a>
          </li>
          <li>
            <a href="https://www.gsmarena.com/battery-life-testing_methodology-news-28687.php" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GSM Arena - Battery Life Testing Methodology
            </a>
          </li>
          <li>
            <a href="https://chromium.googlesource.com/chromium/src/+/main/docs/scheduling.md" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chromium Docs - Scheduling and Task Management
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

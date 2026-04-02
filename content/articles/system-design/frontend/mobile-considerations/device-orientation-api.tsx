"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-device-orientation-api",
  title: "Device Orientation API",
  description:
    "Comprehensive guide to Device Orientation API covering orientation events, motion sensors, use cases for gaming and AR, and privacy considerations.",
  category: "frontend",
  subcategory: "mobile-considerations",
  slug: "device-orientation-api",
  wordCount: 4800,
  readingTime: 19,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "device orientation",
    "motion sensors",
    "mobile",
    "gyroscope",
    "accelerometer",
  ],
  relatedTopics: [
    "touch-events-vs-pointer-events",
    "viewport-configuration",
    "app-like-experience-pwa",
  ],
};

export default function DeviceOrientationAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Device Orientation API</strong> provides access to device
          motion sensors (accelerometer, gyroscope, magnetometer) for detecting
          device orientation and movement. The API exposes three rotation angles
          (alpha, beta, gamma) representing device orientation in 3D space, plus
          acceleration data including gravity compensation. For staff-level
          engineers, Device Orientation API enables immersive experiences:
          gaming (tilt controls), augmented reality (device as viewport),
          fitness tracking (movement detection), and creative interactions
          (parallax effects based on device tilt).
        </p>
        <p>
          Device Orientation involves several technical considerations.{" "}
          <strong>Coordinate system</strong> — alpha (0-360°, compass
          direction), beta (-180 to 180°, front-back tilt), gamma (-90 to 90°,
          left-right tilt). <strong>Permission model</strong> — iOS 13+ requires
          user permission for orientation access. <strong>Privacy</strong> —
          sensor data can fingerprint users, browsers are restricting access.{" "}
          <strong>Cross-device variation</strong> — sensor quality varies by
          device.
        </p>
        <p>
          The business case for Device Orientation API is experiential — it
          enables unique interactions impossible with traditional input. Gaming
          apps use tilt for steering controls. AR apps use orientation to render
          3D content anchored to real world. Fitness apps track movement and
          reps. However, always provide alternative input — not all devices have
          sensors, not all users can tilt devices.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Orientation Angles:</strong> Alpha (0-360°) — rotation around
            Z-axis (compass direction). Beta (-180 to 180°) — rotation around
            X-axis (front-back tilt). Gamma (-90 to 90°) — rotation around
            Y-axis (left-right tilt). Together define device orientation in 3D
            space.
          </li>
          <li>
            <strong>Acceleration:</strong>{" "}
            <code>acceleration</code> (without gravity),{" "}
            <code>accelerationIncludingGravity</code> (with gravity). Measured
            in m/s². Useful for detecting movement, steps, shakes.
          </li>
          <li>
            <strong>Rotation Rate:</strong> Rotation speed around each axis,
            measured in degrees/second. Useful for detecting quick turns,
            gestures.
          </li>
          <li>
            <strong>Permission Model:</strong> iOS 13+ requires explicit user
            permission via <code>DeviceOrientationEvent.requestPermission()</code>.
            Android doesn&apos;t require permission (yet). Always handle
            permission denied gracefully.
          </li>
          <li>
            <strong>Coordinate System:</strong> Based on device&apos;s natural
            orientation. For phones: portrait is natural orientation. For
            tablets: landscape may be natural. Account for screen orientation
            changes.
          </li>
          <li>
            <strong>Compass Calibration:</strong> Alpha (compass direction)
            requires calibration. <code>webkitCompassHeading</code> (iOS)
            provides calibrated heading. Android uses alpha directly.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/device-orientation-coordinates.svg"
          alt="Device Orientation Coordinates showing alpha, beta, gamma rotation angles"
          caption="Device orientation — alpha (compass direction), beta (front-back tilt), gamma (left-right tilt) define device orientation in 3D space"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Device Orientation architecture consists of sensor data collection
          (browser accesses device sensors), event dispatch (orientationchange,
          deviceorientation), and application logic (interpreting orientation
          for use case). The architecture must handle permission requests,
          sensor calibration, and cross-device variation.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/device-orientation-permission-flow.svg"
          alt="Device Orientation Permission Flow showing iOS permission request and handling"
          caption="Permission flow — iOS 13+ requires explicit permission request, handle granted/denied, Android doesn't require permission (yet)"
          width={900}
          height={500}
        />

        <h3>iOS Permission Handling</h3>
        <p>
          iOS 13 and later requires permission for orientation access. Request on user action such as button click, not page load. Explain why you need access. Handle denial gracefully and provide alternative interaction. Store permission state to avoid repeated requests.
        </p>
        <p>
          Example: use async function on button click to request permission, then start orientation tracking if granted.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/mobile-considerations/motion-sensor-applications.svg"
          alt="Motion Sensor Applications showing gaming, AR, fitness, and creative use cases"
          caption="Motion applications — gaming (tilt controls), AR (device as viewport), fitness (movement tracking), creative (parallax effects)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Device Orientation involves trade-offs between immersion,
          accessibility, and privacy.
        </p>

        <h3>Permission Trade-offs</h3>
        <p>
          <strong>Request on Load:</strong> Ask immediately. Advantages: know
          early if available. Limitations: users deny without context, can&apos;t
          re-request. Best for: orientation-first apps.
        </p>
        <p>
          <strong>Request on Action:</strong> Ask when user tries orientation
          feature. Advantages: users understand why, higher grant rate.
          Limitations: can&apos;t show orientation features upfront. Best for:
          most apps.
        </p>
        <p>
          <strong>Progressive Enhancement:</strong> Orientation as enhancement,
          not requirement. Advantages: works for everyone, no permission needed.
          Limitations: can&apos;t use orientation features. Best for: content
          sites, e-commerce.
        </p>

        <h3>Sensor Quality Variation</h3>
        <p>
          High-end devices have accurate sensors (low noise, high sample rate).
          Low-end devices have noisy sensors (drift, lag). Design for lowest
          common denominator — smooth noisy data, don&apos;t require precision.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Request Permission on User Action:</strong> Don&apos;t
            request on page load — users deny without context. Request when user
            clicks &quot;Enable Tilt Controls&quot; button. Explain why you need
            access.
          </li>
          <li>
            <strong>Provide Alternative Input:</strong> Not all devices have
            sensors. Not all users can tilt devices (accessibility). Always
            provide button/touch alternative. Orientation enhances, doesn&apos;t
            replace, traditional input.
          </li>
          <li>
            <strong>Smooth Noisy Data:</strong> Sensor data is noisy — apply
            low-pass filter, moving average. Don&apos;t react to every small
            change. Use threshold for activation.
          </li>
          <li>
            <strong>Handle Screen Orientation:</strong> Device orientation is
            relative to screen orientation. Account for portrait/landscape
            changes. Remap axes when screen rotates.
          </li>
          <li>
            <strong>Test on Multiple Devices:</strong> Sensor quality varies
            wildly. Test on high-end (iPhone, Pixel) and low-end devices.
            Calibrate for lowest common denominator.
          </li>
          <li>
            <strong>Respect Privacy:</strong> Don&apos;t collect sensor data
            unnecessarily. Don&apos;t transmit sensor data without consent.
            Sensor data can fingerprint users — handle responsibly.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Requesting Permission Too Early:</strong> Asking on page
            load gets denied. Users don&apos;t understand why you need access.
            Request when user tries orientation feature.
          </li>
          <li>
            <strong>Not Handling Denial:</strong> User denies permission — app
            breaks. Always handle denial gracefully, provide alternative input.
          </li>
          <li>
            <strong>Ignoring Sensor Noise:</strong> Raw sensor data is noisy —
            jittery movement. Apply smoothing filter. Use threshold for
            activation.
          </li>
          <li>
            <strong>Not Accounting for Screen Rotation:</strong> Orientation
            angles are relative to screen orientation. Portrait vs. landscape
            changes axis mapping. Handle screen orientation changes.
          </li>
          <li>
            <strong>Requiring Precision:</strong> expecting precise angles.
            Sensors drift, vary by device. Design for approximate input, not
            precision.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Gaming: Tilt Controls</h3>
        <p>
          Racing games use device tilt for steering (tilt left = turn left).
          Maze games use tilt to roll ball. Permission requested when user
          selects &quot;Tilt Controls&quot; option. Alternative: on-screen
          buttons for users who can&apos;t or won&apos;t use tilt.
        </p>

        <h3>Augmented Reality</h3>
        <p>
          AR apps use device orientation to render 3D content anchored to real
          world. Device acts as viewport into AR scene. Orientation tracking
          critical for stable AR experience. WebXR builds on Device Orientation
          for web-based AR.
        </p>

        <h3>Fitness Tracking</h3>
        <p>
          Fitness apps use accelerometer for step counting, rep counting.
          Detect exercise form from movement patterns. Orientation helps detect
          exercise type (push-up vs. squat). Privacy critical — fitness data is
          sensitive.
        </p>

        <h3>Creative Interactions</h3>
        <p>
          Parallax effects based on device tilt create depth. 360° photos/videos
          use orientation for viewport control. Interactive art installations
          respond to device movement. Always provide mouse/touch alternative.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you request permission for Device Orientation on iOS?
            </p>
            <p className="mt-2 text-sm">
              A: iOS 13 and later requires explicit permission. Request on user action such as button click, not page load. Use async function to request permission, then add event listener if granted, otherwise show alternative interface. Explain why you need access before requesting. Handle denial gracefully and provide fallback interaction.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What do alpha, beta, and gamma represent?
            </p>
            <p className="mt-2 text-sm">
              A: Alpha (0-360°): rotation around Z-axis, compass direction
              (0 = North). Beta (-180 to 180°): rotation around X-axis, front-back
              tilt (0 = flat, 90 = face up, -90 = face down). Gamma (-90 to
              90°): rotation around Y-axis, left-right tilt (0 = flat, 90 =
              tilted right). Together define device orientation in 3D space.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle sensor noise in orientation data?
            </p>
            <p className="mt-2 text-sm">
              A: Apply smoothing: (1) Low-pass filter — weighted average of
              current and previous values. (2) Moving average — average of last
              N readings. (3) Threshold — ignore changes below threshold.
              Example: <code>smoothed = 0.8 * previous + 0.2 * current</code>.
              Don&apos;t react to every small change — use dead zone.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle devices without orientation sensors?
            </p>
            <p className="mt-2 text-sm">
              A: Feature detection: <code>&apos;DeviceOrientationEvent&apos; in
              window</code>. If not available, hide orientation features, show
              alternative input. Always provide button/touch alternative — not
              just for devices without sensors, but for users who can&apos;t
              tilt devices (accessibility). Sensor availability varies by
              device — even within same OS, some devices lack gyroscope or
              magnetometer. Graceful degradation ensures app works everywhere.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are privacy concerns with Device Orientation API?
            </p>
            <p className="mt-2 text-sm">
              A: Sensor data can fingerprint users — unique sensor
              characteristics identify device. Some sites collect sensor data
              without consent for tracking. Browsers are restricting access
              (iOS permission, potential Android restrictions). Best practice:
              only collect when needed, don&apos;t transmit without consent,
              explain why you need access. Sensor fingerprinting is a growing
              privacy concern — be transparent about data collection and give
              users control over sensor access.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle screen orientation changes?
            </p>
            <p className="mt-2 text-sm">
              A: Listen to <code>screen.orientation.change</code> event. When
              screen rotates, orientation angles are still relative to
              device&apos;s natural orientation, but your interpretation may
              need to change. For landscape: swap beta/gamma interpretation.
              Remap axes based on screen orientation angle (0°, 90°, 180°,
              270°). Screen orientation changes affect how users hold device —
              test both portrait and landscape modes to ensure orientation
              controls work correctly in both orientations.
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — DeviceOrientationEvent API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — DeviceMotionEvent API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/device-orientation/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Device Orientation Guide
            </a>
          </li>
          <li>
            <a
              href="https://webkit.org/blog/6757/the-deviceorientation-and-deviceorientation-events/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WebKit — Device Orientation Events
            </a>
          </li>
          <li>
            <a
              href="https://immersiveweb.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Immersive Web Working Group — WebXR
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/orientation-sensor/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Orientation Sensor Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-vibration-api",
  title: "Vibration API",
  description:
    "Comprehensive guide to the Vibration API covering haptic feedback patterns, tactile interaction design, accessibility considerations for vestibular and sensory needs, mobile UX optimization, and production-scale implementation patterns for tactile web experiences.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "vibration-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "browser API",
    "vibration",
    "haptic feedback",
    "tactile interaction",
    "mobile UX",
    "accessibility",
    "sensory feedback",
  ],
  relatedTopics: ["notification-api"],
};

export default function VibrationAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Vibration API</strong> provides web applications with programmatic access to the device&apos;s vibration hardware, enabling tactile haptic feedback that enhances user interactions on mobile devices. The API exposes a single method — <code>navigator.vibrate()</code> — that accepts either a duration in milliseconds for a single vibration burst or an array of durations for patterned vibration sequences (vibrate, pause, vibrate, pause, etc.). The vibration hardware is the same eccentric rotating mass (ERM) motor or linear resonant actuator (LRA) that native applications use for haptic feedback, and the Vibration API provides web applications with access to this hardware within the constraints of the browser&apos;s security and permission model.
        </p>
        <p>
          The Vibration API was introduced as part of the HTML5 device APIs suite to bridge the gap between web and native application experiences on mobile devices. Native applications have long used haptic feedback to enhance user interactions — the iPhone&apos;s Taptic Engine provides subtle, precise vibrations for keyboard feedback, notification alerts, and interaction confirmations. Android devices have used vibration for similar purposes since the early days of the platform. Web applications, by contrast, had no access to vibration hardware, creating a perceptible gap in the quality of interaction between web and native apps. The Vibration API addresses this gap by enabling web applications to provide tactile feedback that makes interactions feel more tangible, responsive, and immersive.
        </p>
        <p>
          The API operates under a strict user gesture requirement — vibration can only be triggered in response to a user action such as a tap, click, or key press. This prevents web pages from vibrating the device without user consent, which would be a significant abuse vector (imagine a malicious site vibrating the device continuously). The user gesture requirement is enforced by the browser — calls to <code>navigator.vibrate()</code> outside of a user gesture handler are silently ignored. This security model ensures that vibration is always a response to user intent, not a surprise initiated by the application.
        </p>
        <p>
          For staff and principal engineers, the Vibration API represents a tool for enhancing mobile user experience through tactile feedback, but one that must be used with careful restraint. Haptic feedback is most effective when it is subtle, purposeful, and infrequent — a brief vibration confirming a button press, a patterned vibration signaling an important notification, or a rhythmic vibration providing game feedback. Overuse of vibration leads to user annoyance, battery drain, and potential accessibility issues for users with sensory sensitivities. The API is supported on Android devices with vibration hardware but is not supported on iOS Safari, which means that any vibration-based interaction must have a visual or audio fallback for iOS users.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The <strong>single vibration model</strong> is the simplest use of the Vibration API. Calling <code>navigator.vibrate(duration)</code> with a single number causes the device to vibrate for the specified duration in milliseconds. The actual vibration behavior depends on the device&apos;s hardware capabilities — some devices support precise duration control (vibrating for exactly the specified time), while others have minimum vibration durations (e.g., 10-15ms) and may round shorter durations up. Typical single vibration durations range from 10ms (barely perceptible, used for subtle button feedback) to 200ms (clearly noticeable, used for important confirmations). Durations longer than 200ms are generally perceived as excessive and should be avoided unless the vibration serves a critical accessibility purpose.
        </p>
        <p>
          The <strong>pattern vibration model</strong> enables more complex haptic feedback by specifying an array of alternating vibration and pause durations. The array follows the pattern <code>[vibrate, pause, vibrate, pause, ...]</code>, where odd-indexed elements (0, 2, 4, ...) are vibration durations and even-indexed elements (1, 3, 5, ...) are pause durations. For example, <code>[100, 50, 100]</code> vibrates for 100ms, pauses for 50ms, then vibrates for 100ms again. This pattern model enables the creation of distinctive vibration signatures for different types of feedback — a short double-burst for button confirmation, a longer triple-burst for error notification, or a rhythmic pattern for game events. The pattern is executed sequentially, and the total pattern duration is the sum of all elements in the array.
        </p>
        <p>
          The <strong>cancellation model</strong> allows stopping an ongoing vibration immediately. Calling <code>navigator.vibrate(0)</code> or <code>navigator.vibrate([])</code> cancels any active vibration, whether it is a single vibration or a pattern. This is important for interrupting long vibration patterns when the user performs another action — for example, if a vibration pattern is playing for a notification and the user taps the screen to dismiss it, the vibration should stop immediately. Cancellation is also useful for preventing vibration overlap — if a new vibration is triggered while a previous one is still running, the new vibration replaces the previous one. Explicit cancellation provides clearer intent than implicit replacement.
        </p>
        <p>
          The <strong>user gesture requirement</strong> is the primary security constraint of the Vibration API. The browser only allows vibration in response to a user-initiated event — click, tap, keydown, touchstart, or other user gesture events. Calls to <code>navigator.vibrate()</code> from timers, network callbacks, or other non-gesture contexts are silently ignored. This prevents malicious sites from vibrating the device without user consent. The user gesture requirement also means that vibration cannot be used for unsolicited notifications — if the application wants to vibrate when a push notification arrives, it can only do so if the notification includes a user action (tapping the notification) that triggers the vibration.
        </p>
        <p>
          The <strong>hardware abstraction model</strong> means that the Vibration API provides a simplified interface to the device&apos;s vibration hardware without exposing hardware-specific details. The API does not provide control over vibration intensity, frequency, or waveform — it only controls duration. The actual vibration characteristics (strength, feel, sound) depend on the device&apos;s hardware — an ERM motor produces a different feel than an LRA, and different devices have different motor strengths. This abstraction ensures that the API works across devices but means that the tactile experience is not consistent across devices. Applications should design vibration patterns that are effective across a range of hardware capabilities, not optimized for a specific device.
        </p>
        <p>
          The <strong>platform support model</strong> is a critical consideration for production use. The Vibration API is supported on Android browsers (Chrome, Firefox, Samsung Internet) on devices with vibration hardware. It is not supported on iOS Safari — Apple has not implemented the Vibration API in Safari, and there is no indication that they plan to. It is not supported on desktop browsers (desktop devices typically lack vibration hardware). This means that vibration-based interactions are Android-mobile-only and must have fallbacks for all other platforms. The fallback can be visual (animation, color change), audio (sound effect), or simply the absence of tactile feedback — the interaction should still function without vibration.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/vibration-patterns.svg"
          alt="Vibration Patterns diagram showing single vibration, pattern vibration with alternating vibrate-pause durations, and cancellation"
          caption="Vibration patterns — single vibration uses a single duration in milliseconds, pattern vibration uses an array of alternating vibrate and pause durations, cancellation uses vibrate(0) or vibrate([]) to stop ongoing vibration"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production Vibration API implementation requires an architecture that manages vibration pattern definitions, platform detection, user preference handling, accessibility considerations, and fallback mechanisms. While the API itself is simple, production usage requires careful design to ensure that vibration enhances rather than degrades the user experience.
        </p>
        <p>
          The <strong>vibration pattern library</strong> is a centralized module that defines all vibration patterns used by the application. Each pattern is given a descriptive name and a corresponding duration array. For example, a &quot;button-press&quot; pattern might be <code>[15]</code> (a brief 15ms vibration), a &quot;success&quot; pattern might be <code>[50, 30, 50]</code> (two short bursts), an &quot;error&quot; pattern might be <code>[200, 100, 200]</code> (two longer bursts), and a &quot;notification&quot; pattern might be <code>[100, 50, 100, 50, 100]</code> (three bursts). Centralizing pattern definitions ensures consistent tactile feedback across the application and makes it easy to adjust patterns based on user testing or device-specific optimization.
        </p>
        <p>
          The <strong>platform detection layer</strong> determines whether vibration is available on the current device. This is done by checking <code>&apos;vibrate&apos; in navigator</code>. If the check returns false (iOS Safari, desktop browsers, or Android devices without vibration hardware), the vibration layer skips vibration and relies on fallback feedback mechanisms. The platform detection should be performed once on application initialization and cached, rather than checking on every vibration call. This improves performance and ensures consistent behavior throughout the application session.
        </p>
        <p>
          The <strong>user preference layer</strong> respects the user&apos;s preference for haptic feedback. Many operating systems provide a system-wide setting for haptic feedback intensity or enable/disable. On Android, users can disable vibration for apps in system settings. The application should respect these preferences by checking the system&apos;s haptic feedback setting before vibrating. Additionally, the application should provide its own in-app setting for enabling or disabling haptic feedback, allowing users to control vibration independently of system settings. Users who disable haptic feedback in the app should never experience vibration, regardless of the system setting.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/vibration-architecture.svg"
          alt="Vibration API Architecture diagram showing pattern library, platform detection, user preference handling, accessibility checks, and fallback mechanisms"
          caption="Vibration API architecture — pattern library defines named vibration patterns, platform detection checks for API support, user preference layer respects system and app settings, accessibility layer checks for reduced motion preference, and fallback mechanisms provide visual or audio feedback when vibration is unavailable"
          width={900}
          height={500}
        />

        <p>
          The <strong>accessibility layer</strong> ensures that vibration does not create barriers for users with sensory sensitivities. The <code>prefers-reduced-motion</code> media query, while primarily intended for visual motion, can also be interpreted as a preference for reduced sensory input overall. Users who enable reduced motion may also prefer reduced haptic feedback. The application should check this preference and reduce or eliminate vibration for users who have enabled it. Additionally, the application should provide alternative feedback mechanisms (visual animations, audio cues) for users who cannot perceive vibration — either because their device lacks vibration hardware or because they have a physical condition that reduces tactile sensitivity.
        </p>
        <p>
          The <strong>fallback feedback layer</strong> provides alternative sensory feedback when vibration is unavailable. For button press confirmation, a visual animation (button scale-down, color change, or ripple effect) provides visual feedback. For notification alerts, an audio cue (short beep or chime) provides auditory feedback. For game events, a combination of visual and audio feedback can replace vibration. The fallback should be designed to provide equivalent information to the vibration it replaces — a brief button vibration maps to a brief visual animation, while a longer notification vibration maps to a more prominent audio cue.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/vibration-accessibility.svg"
          alt="Vibration Accessibility diagram showing how vibration feedback maps to visual and audio fallbacks for users who cannot perceive haptic feedback"
          caption="Vibration accessibility — haptic feedback (vibration patterns) is the primary feedback mechanism on Android devices, visual feedback (animations, color changes) serves as fallback for iOS and desktop, and audio feedback (sound effects) provides an additional alternative for users with tactile sensitivity"
          width={900}
          height={550}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The Vibration API involves trade-offs between tactile enhancement and user annoyance, between platform-specific capability and cross-platform consistency, and between accessibility benefit and accessibility risk. Understanding these trade-offs is essential for using vibration effectively without degrading the user experience.
        </p>
        <p>
          The most critical trade-off is <strong>tactile enhancement versus user annoyance</strong>. Vibration, when used sparingly and purposefully, enhances user interactions by providing tangible confirmation that an action has been registered. A brief vibration on button press makes the interaction feel more responsive and satisfying. However, vibration is inherently intrusive — it physically moves the device in the user&apos;s hand or on the surface. Excessive or unexpected vibration is annoying and can cause users to disable vibration for the entire application or browser. The balance is achieved through restraint: use vibration only for interactions where tactile feedback adds genuine value, keep vibrations brief (under 50ms for routine feedback), and never use vibration for decorative or gratuitous purposes.
        </p>
        <p>
          The <strong>platform-specific capability versus cross-platform consistency</strong> trade-off affects interaction design. Vibration is available on Android mobile devices but not on iOS or desktop. This means that tactile feedback is an enhancement available to only a subset of users. If the application&apos;s interaction design depends on vibration (e.g., vibration is the only feedback for a critical action), iOS and desktop users will have a degraded experience. The solution is to treat vibration as a progressive enhancement — the core interaction works without vibration, and vibration adds an extra layer of feedback for users whose devices support it. Visual and audio fallbacks ensure that all users receive equivalent feedback, regardless of platform.
        </p>
        <p>
          The <strong>accessibility benefit versus accessibility risk</strong> trade-off is nuanced. For visually impaired users, vibration provides non-visual feedback that can enhance accessibility — a vibration pattern can confirm that an action was successful without requiring the user to look at the screen. However, for users with sensory processing disorders or tactile hypersensitivity, vibration can be uncomfortable or even painful. The solution is to provide user control — allow users to enable or disable vibration in the application settings, respect system-level haptic feedback preferences, and check the <code>prefers-reduced-motion</code> media query as a proxy for reduced sensory input preference.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/vibration-tradeoffs.svg"
          alt="Vibration API Trade-offs comparison matrix showing tactile enhancement, platform support, accessibility impact, and battery consumption across vibration, visual animation, and audio feedback"
          caption="Haptic feedback trade-offs — vibration provides tangible confirmation but is Android-only and can annoy users if overused, visual animations work on all platforms but require visual attention, audio feedback works on all platforms but may be inappropriate in quiet environments"
          width={900}
          height={500}
        />

        <h3>Feedback Mechanism Comparison</h3>
        <p>
          <strong>Vibration (haptic feedback)</strong> provides tactile confirmation that is immediately perceptible without visual attention. It is ideal for mobile interactions where the user may not be looking directly at the screen. Limitations include Android-only support, battery consumption, potential for user annoyance, and inaccessibility for users with tactile sensitivity. Best for: mobile button confirmation, game feedback, notification alerts on Android devices.
        </p>
        <p>
          <strong>Visual feedback (animations, color changes)</strong> works on all platforms and provides clear, observable confirmation of user actions. It is ideal for interactions where the user is looking at the screen. Limitations include requiring visual attention (not suitable for visually impaired users without screen readers) and potential performance impact if animations are not optimized. Best for: universal feedback mechanism, fallback for vibration, confirmation of form submissions and navigation actions.
        </p>
        <p>
          <strong>Audio feedback (sound effects)</strong> provides auditory confirmation that is perceptible without visual attention and works on all platforms. It is ideal for notification alerts and game feedback. Limitations include being inappropriate in quiet environments (meetings, libraries, public transit), requiring audio output (speakers or headphones), and potential annoyance if sounds are repetitive or loud. Best for: notification alerts, game events, and as a complement to visual feedback for multi-sensory confirmation.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          The most important best practice is <strong>using vibration sparingly and purposefully</strong>. Vibration should be reserved for interactions where tactile feedback adds genuine value — button press confirmation, error notification, game events, and accessibility alerts. It should not be used for decorative purposes, hover effects, or every user interaction. A good rule of thumb is that a user should notice the absence of vibration more than its presence — if vibration is so frequent that users stop noticing it, it is being overused. Limit vibration to 3-5 distinct patterns across the entire application, each serving a specific purpose.
        </p>
        <p>
          <strong>Keeping vibration durations short</strong> minimizes battery consumption and user annoyance. For routine button press confirmation, use durations of 10-20ms — barely perceptible but enough to provide tangible feedback. For success confirmation, use 30-50ms — clearly noticeable but not intrusive. For error or warning notifications, use 100-200ms — prominent enough to demand attention. Avoid durations longer than 200ms unless the vibration serves a critical accessibility purpose (alerting a visually impaired user to an important event). Short vibrations consume less battery and are less likely to annoy users.
        </p>
        <p>
          <strong>Providing user control over haptic feedback</strong> is essential for user satisfaction and accessibility. Include a setting in the application&apos;s preferences that allows users to enable or disable vibration. The default should be enabled (for users who want tactile feedback), but the setting should be easy to find and change. Additionally, respect the system-level haptic feedback setting — if the user has disabled haptic feedback in their device settings, the application should not override this preference. On Android, this can be checked through the system&apos;s haptic feedback preference.
        </p>
        <p>
          <strong>Implementing visual and audio fallbacks</strong> ensures that all users receive equivalent feedback regardless of platform. When vibration is unavailable (iOS, desktop, or disabled by user preference), provide visual feedback (button animation, color change, ripple effect) or audio feedback (short sound effect) as an alternative. The fallback should convey the same information as the vibration — a brief button vibration maps to a brief visual animation, while a longer notification vibration maps to a more prominent audio or visual cue. Test the fallback experience on iOS and desktop to ensure it is equivalent to the vibration experience on Android.
        </p>
        <p>
          <strong>Checking for API support before calling vibrate</strong> prevents runtime errors on unsupported platforms. Always check <code>&apos;vibrate&apos; in navigator</code> before calling <code>navigator.vibrate()</code>. If the API is not supported, skip the vibration and rely on fallback feedback. This check should be performed once on application initialization and cached, rather than on every vibration call. The cached result can be used throughout the application session to determine whether vibration is available.
        </p>
        <p>
          <strong>Designing distinctive vibration patterns</strong> for different types of feedback helps users distinguish between interaction types through tactile sensation alone. A button press should feel different from an error notification, which should feel different from a game event. Use pattern vibration to create distinctive signatures: a single short burst for button press, a double burst for success, a longer double burst for error, and a rhythmic pattern for game events. Consistency in pattern design across the application helps users develop tactile associations — they learn to recognize what each pattern means through repeated exposure.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is <strong>overusing vibration</strong>, which leads to user annoyance and battery drain. Vibrating on every button press, every scroll event, every page transition, and every notification quickly becomes overwhelming. Users respond by disabling vibration for the application or browser, which eliminates the benefit for users who want it. The solution is to reserve vibration for interactions where tactile feedback adds genuine value — typically 3-5 patterns across the entire application — and to keep durations short (under 50ms for routine feedback).
        </p>
        <p>
          <strong>Assuming universal platform support</strong> leads to broken experiences for iOS and desktop users. The Vibration API is not supported on iOS Safari or any desktop browser. If the application relies on vibration as the primary feedback mechanism, iOS and desktop users will receive no feedback at all. The solution is to treat vibration as a progressive enhancement — the core interaction works without vibration, and vibration adds an extra layer of feedback for Android users. Always provide visual or audio fallbacks for platforms that do not support vibration.
        </p>
        <p>
          <strong>Not respecting user preferences</strong> creates a frustrating experience for users who have disabled haptic feedback. If the user has disabled vibration in their device settings or in the application&apos;s settings, the application should not vibrate. Ignoring user preferences signals that the application does not respect user choice and can lead to negative reviews and uninstalls. The solution is to check both system-level and app-level haptic feedback preferences before vibrating, and to provide an easily accessible setting for users to control vibration.
        </p>
        <p>
          <strong>Using vibration for non-gesture-triggered actions</strong> silently fails and wastes development effort. The Vibration API requires a user gesture — calls to <code>navigator.vibrate()</code> from timers, network callbacks, or other non-gesture contexts are silently ignored by the browser. If the application attempts to vibrate when a push notification arrives (without the user tapping the notification), the vibration will not occur. The solution is to only trigger vibration in response to user gesture event handlers (click, tap, keydown, touchstart).
        </p>
        <p>
          <strong>Not providing accessibility alternatives</strong> excludes users with sensory sensitivities or tactile impairments. Users with vestibular disorders, sensory processing disorders, or tactile hypersensitivity may find vibration uncomfortable or painful. If vibration is the only feedback mechanism for a critical interaction, these users may be unable to use the application effectively. The solution is to provide visual and audio alternatives for every vibration pattern, and to check the <code>prefers-reduced-motion</code> media query as a proxy for reduced sensory input preference.
        </p>
        <p>
          <strong>Creating vibration patterns that are too complex</strong> wastes battery and provides diminishing returns. While the Vibration API supports arbitrarily long pattern arrays, complex patterns (more than 5-6 elements) are difficult for users to distinguish and consume significant battery. A pattern like <code>[50, 30, 50, 30, 50, 30, 50]</code> is not meaningfully different from <code>[50, 30, 50]</code> to most users, but it consumes twice the battery. The solution is to keep patterns simple — 2-4 elements for most patterns — and to focus on making patterns distinctive rather than complex.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Mobile Game Feedback</h3>
        <p>
          Mobile web games use the Vibration API to provide tactile feedback for game events — collisions, power-ups, level completions, and score milestones. When a player collides with an obstacle, a short vibration burst provides immediate tactile confirmation of the event. When a player collects a power-up, a distinctive double-burst pattern signals the positive event. When a level is completed, a longer celebratory pattern provides satisfying feedback. The tactile feedback enhances the game experience by adding a physical dimension to visual and audio events, making the game feel more immersive and responsive. Games like the mobile web versions of Snake, Tetris, and casual puzzle games commonly use vibration for this purpose.
        </p>

        <h3>Form Submission Confirmation</h3>
        <p>
          Mobile web forms use vibration to confirm successful form submission. When a user submits a form (login, registration, checkout, contact), a brief vibration provides tangible confirmation that the submission was received. This is particularly valuable on mobile networks where the server response may be delayed — the vibration confirms immediately that the form was submitted, reducing the user&apos;s uncertainty about whether their action was registered. The vibration is triggered by the submit button&apos;s click event (a user gesture), and the actual submission happens asynchronously. If the submission fails, a different vibration pattern (longer, more prominent) signals the error.
        </p>

        <h3>Accessibility for Visually Impaired Users</h3>
        <p>
          The Vibration API provides non-visual feedback for visually impaired users who may not be able to see visual confirmation of their actions. When a visually impaired user interacts with a web application using a screen reader, vibration provides an additional tactile channel of feedback. A brief vibration confirms that a button was pressed, a patterned vibration indicates success or error, and a distinctive vibration pattern can signal specific events (message received, task completed). This multi-sensory feedback approach — combining screen reader audio with tactile vibration — provides a richer, more confident interaction experience for visually impaired users.
        </p>

        <h3>Notification and Alert Enhancement</h3>
        <p>
          Web applications that display in-app notifications (chat messages, system alerts, reminders) use vibration to enhance the notification&apos;s prominence. When a notification appears on screen, a vibration pattern draws the user&apos;s attention to it, particularly when the user may not be looking directly at the screen. The vibration is triggered by the user action that opens the notification panel or by the user&apos;s tap on the notification indicator. This is particularly effective for time-sensitive notifications (incoming messages, calendar reminders, security alerts) where immediate attention is important. The vibration pattern should be distinctive enough to differentiate notification alerts from routine interaction feedback.
        </p>

        <h3>Interactive Prototyping and Design Tools</h3>
        <p>
          Web-based design and prototyping tools use vibration to provide tactile feedback for design interactions — snapping elements to a grid, confirming a deletion, or signaling an invalid action. When a designer drags an element and it snaps to the grid, a brief vibration confirms the snap. When a designer attempts an invalid action (placing an element outside the canvas), a distinctive vibration pattern signals the error. This tactile feedback enhances the design tool&apos;s responsiveness and makes interactions feel more tangible, similar to the feedback provided by native design applications like Figma or Sketch on mobile devices.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Vibration API work, and what are its constraints?
            </p>
            <p className="mt-2 text-sm">
              A: The Vibration API exposes a single method — <code>navigator.vibrate()</code> — that triggers device vibration. It accepts either a single number (duration in milliseconds for a single vibration) or an array of numbers (alternating vibration and pause durations for patterned vibration). Calling <code>navigator.vibrate(0)</code> or <code>navigator.vibrate([])</code> cancels any ongoing vibration.
            </p>
            <p className="mt-2 text-sm">
              The API has several important constraints. It requires a user gesture — vibration can only be triggered in response to a user action (click, tap, key press). Calls from timers, network callbacks, or other non-gesture contexts are silently ignored. It is platform-specific — supported on Android browsers with vibration hardware, not supported on iOS Safari or desktop browsers. It provides no control over vibration intensity or frequency — only duration. The actual vibration characteristics depend on the device&apos;s hardware.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you design effective vibration patterns for different types of feedback?
            </p>
            <p className="mt-2 text-sm">
              A: Effective vibration patterns are distinctive, brief, and purposeful. For button press confirmation, use a single short burst of 10-20ms — barely perceptible but enough to provide tangible feedback. For success confirmation, use a double burst like <code>[30, 20, 30]</code> — two short vibrations with a brief pause between them. For error notification, use a longer double burst like <code>[100, 50, 100]</code> — more prominent to demand attention. For game events, use a rhythmic pattern like <code>[50, 30, 50, 30, 50]</code> — distinctive enough to be recognized as a game event.
            </p>
            <p className="mt-2 text-sm">
              The key principles are: keep patterns short (under 200ms total for routine feedback), make patterns distinctive (different patterns for different event types), and be consistent (use the same pattern for the same event type throughout the application). Avoid complex patterns with more than 5-6 elements — they are difficult for users to distinguish and consume excessive battery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle the lack of iOS Safari support for the Vibration API?
            </p>
            <p className="mt-2 text-sm">
              A: The standard approach is progressive enhancement with fallback feedback. Check for API support using <code>&apos;vibrate&apos; in navigator</code>. If supported (Android), use vibration as the primary tactile feedback. If not supported (iOS, desktop), provide visual feedback (button animation, color change, ripple effect) or audio feedback (short sound effect) as an alternative.
            </p>
            <p className="mt-2 text-sm">
              The fallback should convey equivalent information to the vibration — a brief button vibration maps to a brief visual animation, while a longer notification vibration maps to a more prominent audio or visual cue. Design the interaction so that it works fully without vibration — vibration is an enhancement, not a requirement. Test the fallback experience on iOS to ensure it is equivalent to the vibration experience on Android.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you ensure vibration is accessible to users with sensory sensitivities?
            </p>
            <p className="mt-2 text-sm">
              A: Accessibility for vibration involves three strategies. First, provide user control — include a setting in the application that allows users to enable or disable vibration. Respect system-level haptic feedback preferences — if the user has disabled vibration in their device settings, do not override it.
            </p>
            <p className="mt-2 text-sm">
              Second, check the <code>prefers-reduced-motion</code> media query as a proxy for reduced sensory input preference. Users who enable reduced motion may also prefer reduced haptic feedback. For these users, reduce vibration intensity (shorter durations) or disable it entirely.
            </p>
            <p className="mt-2 text-sm">
              Third, provide alternative feedback mechanisms — visual animations and audio cues — for users who cannot perceive or tolerate vibration. The alternatives should convey the same information as the vibration, ensuring that users who disable vibration do not miss critical feedback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does vibration affect battery life, and how do you minimize its impact?
            </p>
            <p className="mt-2 text-sm">
              A: Vibration consumes battery power because it activates the device&apos;s vibration motor, which is one of the more power-hungry components. The battery impact depends on the duration and frequency of vibration — longer and more frequent vibrations consume more power. A single 15ms vibration has negligible impact, but hundreds of vibrations per minute can noticeably drain the battery.
            </p>
            <p className="mt-2 text-sm">
              To minimize battery impact: keep vibration durations short (under 50ms for routine feedback), limit the number of vibration events (3-5 patterns across the application), avoid continuous or looping vibrations, and respect user preferences for reduced or disabled vibration. Additionally, cancel ongoing vibrations when they are no longer needed — if a vibration pattern is playing and the user performs another action, cancel the pattern rather than letting it complete.
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN Web Docs — Vibration API Complete Reference
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/vibration/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C Vibration API Specification
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/vibration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Vibration API Browser Compatibility Data
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/haptics/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Haptic Feedback Best Practices for Web
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C Media Queries Level 5 — prefers-reduced-motion
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

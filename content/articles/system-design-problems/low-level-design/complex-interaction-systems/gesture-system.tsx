"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-gesture-system",
  title: "Gesture Recognition and Handling System",
  description: "Designing touch gesture recognizers for mobile and desktop applications with support for swipe, pinch, rotate, and other multi-touch patterns.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "gesture-system",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-05",
  tags: ["lld", "gestures", "touch", "mobile", "interaction", "multi-touch"],
  relatedTopics: ["carousel-slider", "pan-zoom-minimap", "drag-drop-list", "resizable-split-pane"],
};

export default function GestureSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A user opens a map app on their phone and wants to zoom in. They place two fingers on the map, moving them apart (pinch gesture). Simultaneously, another user swipes left on a carousel to move to the next image. A third user long-presses on an item to open a context menu. These interactions—swipe, pinch, long-press—are "gestures": high-level user intents recognized from low-level touch events.</p>
        <p>Building gesture support is deceptively complex. At the lowest level, the browser fires raw touch events: touchstart, touchmove, touchend, each containing the coordinates of every active finger. To recognize a "pinch" gesture, the app must track two simultaneous touches, measure the distance between them, compute whether that distance is increasing or decreasing, and determine if the rate of change exceeds a threshold (fast pinch) or is slow (slow pinch zoom). Raw event handling is error-prone: off-by-one errors in touch tracking, incorrect distance calculations, and false positive gesture detections (user intended to pan, system recognized pinch).</p>
        <p>Challenges include: (1) accurately recognizing gestures (distinguish swipe from pan by velocity), (2) handling multiple simultaneous touches (two-finger rotations while panning), (3) managing state transitions (gesture began → moved → ended → cancelled), (4) providing responsive feedback (visual feedback as gesture progresses), (5) enabling gesture cancellation (user changes mind mid-gesture), and (6) desktop compatibility (map app works on desktop with mouse, on mobile with touch).</p>
        <p>A gesture system abstracts these low-level details. Instead of writing raw touchstart handlers, developers use gesture recognizers: "on swipe left, advance carousel", "on pinch, zoom map". The system handles velocity calculation, distance measurement, state management, and multi-touch disambiguation. It also handles edge cases: what if two gestures start simultaneously (pinch + rotate)? Which one wins? How long do we wait before deciding?</p>
        <p><strong>Explicit assumptions:</strong> Multi-touch is supported (minimum 2, typically 10 simultaneous touches). Gesture recognition must be accurate (minimize false positives). Gestures can be cancelled (user decides mid-gesture they don't want the action). Desktop mouse events must be handled (tap maps to click, pan maps to drag, long-press maps to right-click). Frameworks like React Native, Flutter, and web libraries like Hammer.js exist but custom implementation is common for specific needs.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Swipe Detection:</strong> Recognize fast single-finger movement as swipe left/right/up/down. Require a velocity threshold (for example above 0.5 px/ms) and minimum distance (for example 30 pixels). Distinguish from pan (slower movement). Report swipe direction and velocity to handler.</li>
          <li><strong>Pan Detection:</strong> Recognize slow continuous multi-directional movement. No velocity requirement, just track movement. Useful for scrolling, dragging. Report pan offset and velocity to handler.</li>
          <li><strong>Pinch Detection:</strong> Recognize two-finger pinch gesture (fingers moving apart or together). Report scale (new distance / initial distance) to handler. Support both zoom-in (expanding) and zoom-out (contracting).</li>
          <li><strong>Rotate Detection:</strong> Recognize two-finger rotation (angle changing). Report rotation angle delta to handler. Enable photo rotation, compass needle adjustment.</li>
          <li><strong>Long-Press Detection:</strong> Recognize stationary finger held for duration (e.g., 500ms). Fire event after threshold met. Allow gesture to be cancelled if finger moves before threshold. Useful for opening context menus, initiating drag-and-drop.</li>
          <li><strong>Double-Tap Detection:</strong> Recognize two quick taps separated by under 300ms at a similar location. Distinguish from single tap. Enable zoom-to-fit and expand actions.</li>
          <li><strong>Tap Detection:</strong> Recognize a single quick touch lasting under 200ms without movement. Report tap location. Useful for buttons and list item selection.</li>
          <li><strong>Gesture State Reporting:</strong> Report gesture state (began, moved, ended, cancelled) to handlers. Include relevant data (velocity, distance, scale, angle). Enable handlers to provide realtime visual feedback.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Latency:</strong> Gesture recognition completes within 100ms of gesture completion (end of swipe, pinch, etc.). Real-time updates (swipe moving) should fire with under 50ms latency for smooth visual feedback.</li>
          <li><strong>Accuracy:</strong> Minimize false positives (recognizing pan as swipe). Minimize false negatives (missing a swipe). Typical false positive rate is under 1%.</li>
          <li><strong>Scale:</strong> Handle 10+ simultaneous touches. Recognize complex multi-touch patterns (rotate while pinching). Scale gesture tracking to thousands of concurrent gesture recognizers (multiple elements each with swipe handlers).</li>
          <li><strong>Responsiveness:</strong> Touch event handlers are non-blocking. Process touch events within 100ms to avoid jank (frame drops). Use passive event listeners to avoid blocking scroll.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>A gesture system has three layers: touch tracking, gesture recognition, and gesture handling.</p>
        <p>Layer 1 (Tracking): Subscribe to touchstart, touchmove, touchend events. For each touch event, record the position, timestamp, and touch ID. Maintain a history of positions for each touch (last 10-20 positions) to enable velocity calculation. Update touch state: started, moving, ended. Handle multi-touch by keying touches by ID.</p>
        <p>Layer 2 (Recognition): Analyze touch histories to classify into gesture types. For swipe: check if movement was fast (velocity above a threshold) and distance above a minimum. For pinch: check if two touches exist and distance is changing. For rotate: check if angle is changing. For long-press: check if touch is stationary for 500ms. Emit gesture events (swipeLeft, swipeRight, pinch, rotate, longPress, etc.) when a gesture is recognized.</p>
        <p>Layer 3 (Handling): Register gesture handlers ("when user swipes left, advance carousel"). When a gesture event fires, call the registered handler. Handle gesture state transitions: on recognize (gesture began), on update (gesture data changed, e.g., zoom scale increased), on end (gesture completed), on cancel (gesture rejected).</p>
        <p>Key design pattern: gestures are stateful. A pinch gesture begins (two touches, distance stable), moves (distance increases), and ends (fingers lifted). Handlers receive state updates ("pinch moved, scale 1.2x") so they can provide realtime feedback. Handlers can reject a gesture mid-stream (e.g., "pinch cancelled because third finger touched"), triggering cancellation state.</p>
      </section>

      <section>
        <h2>Detailed Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/gesture-system-architecture.svg"
          alt="Gesture system architecture showing gesture types (tap, long press, swipe, pinch), 5-step recognition pipeline from raw pointer events to custom event emission, conflict resolution arbitration, velocity and momentum calculation, and accessibility requirements"
          caption="Gesture recognition pipeline: normalize input → track state → classify gesture → emit custom event, with conflict resolution and velocity-based momentum"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Touch Tracking and State Management</h3>
        <p>The foundation of gesture recognition is accurate touch tracking. When a touch event fires (touchstart, touchmove, touchend), the system records the touch point data: clientX, clientY, identifier (unique per touch), and timestamp. The identifier is critical for multi-touch: when user places two fingers, touchstart fires twice (once per finger), each with a unique identifier. Subsequent move events include the identifier, so the system can track which finger moved.</p>
        <p>The system maintains a "active touches" map keyed by touch identifier, storing touch history: a list of recent positions and timestamps. History length is typically 10-20 positions (last 100-200ms of movement). This history is used for velocity calculation and direction detection. When touch ends, the touch is removed from active touches.</p>
        <p>Touch state transitions matter for gesture recognition. A touch has states: began (just pressed), moved (position changed), ended (released), cancelled (system interrupted, e.g., notification). A gesture responder can react to each state. Example: on swipe began (recognized after first move), provide visual feedback (highlight scrollable area). On swipe ended, perform the action (scroll). On swipe cancelled (user lifted finger before completing), reset visual feedback.</p>
        <p><strong>Velocity Calculation and Gesture Discrimination:</strong> To distinguish a swipe from a pan, compute velocity using recent touch history: distance traveled divided by elapsed time. Swipes tend to have higher velocity and more linear movement, while pans tend to be slower and can change direction. The exact threshold depends on device and product; you tune it using telemetry and user testing. In practice, you combine velocity and linearity checks so the system does not mistake a slow drag for a swipe.</p>
        <p><strong>Multi-Touch State and Disambiguation:</strong> When multiple touches are active (for example a two-finger pinch), the system must track each touch independently and also compute multi-touch properties such as the distance between touches, the relative angle, and the centroid. Those derived values drive pinch, rotate, and multi-finger pan. When the touch count changes unexpectedly during a gesture (for example a third finger appears mid-pinch), the system must decide whether to cancel the current gesture or switch to a different recognizer; many systems cancel to avoid ambiguous interpretation.</p>
        <p><strong>Event Listener Setup and Passive Listeners:</strong> Touch event listeners should be registered in a way that preserves scroll performance. Passive listeners tell the browser the handler will not block scrolling, which improves responsiveness. If the gesture system must suppress default browser behaviors in rare cases, restrict that to the minimum set of interactions and treat it as a higher-risk path because it can impact scrolling smoothness.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Velocity Calculation and Direction Detection</h3>
        <p>Distinguishing swipe from pan requires velocity. Velocity is distance divided by time. From the touch history (positions and timestamps), calculate the distance covered in the last 100-200ms and divide by elapsed time. If velocity is above 0.5 pixels/millisecond (500 pixels/second), it's fast enough to be a swipe. Otherwise, it's a pan.</p>
        <p>Direction is the angle of the velocity vector. Given two points (x1, y1) and (x2, y2), the direction is atan2(y2 - y1, x2 - x1). Quantize angles to 8 directions (N, NE, E, SE, S, SW, W, NW) or 4 directions (horizontal/vertical). Classify: if angle is between -22.5° and 22.5°, it's rightward (East). Between 22.5° and 67.5°, it's diagonal (NE). This enables "swipe left", "swipe up-right", etc.</p>
        <p>Momentum is velocity at gesture end, used for inertia animations. If user swipes left with velocity 1.0 px/ms, the momentum is high—scroll list with deceleration animation. If user swipes with velocity 0.2 px/ms (slow swipe), momentum is low—minor scroll. Use momentum value to decelerate scroll naturally.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Gesture Recognition Algorithms</h3>
        <p>Swipe recognition: on touchmove, check if distance moved is above 30px and velocity is above 0.5 px/ms. Detect direction (left, right, up, down). Emit swipeLeft, swipeRight, swipeUp, or swipeDown event. Recognition happens during the move, not at the end, to provide realtime feedback.</p>
        <p>Pan recognition: on touchmove, report the delta (how much moved since last position). No velocity or distance threshold. Handler receives updates: "pan 50px left, 10px down". Useful for scrolling—on each move event, update scroll position.</p>
        <p>Pinch recognition: require 2 active touches. On touchmove, calculate distance between the two touches: sqrt((x2-x1)² + (y2-y1)²). Compare to initial distance (at touchstart): scale equals currentDistance divided by initialDistance. If scale is above 1.1 (10% increase), emit pinch event with scale value. Scale 1.0 means no change, 1.2 means 20% zoom in, and 0.9 means 10% zoom out.</p>
        <p>Rotate recognition: require 2 active touches. Calculate angle between the two touches at start: angle1 = atan2(y2 - y1, x2 - x1). On touchmove, recalculate: angle2. Rotation delta = angle2 - angle1. Emit rotate event with rotation value (e.g., 15 degrees).</p>
        <p>Long-press recognition: on touchstart, set a timeout (500ms). On touchmove, check if movement exceeds 10px. If yes, cancel the long-press (user is moving, not holding). If timeout fires without cancel, emit longPress event. If touchend before timeout, emit tap event instead.</p>
        <p>Double-tap recognition: on tap, record timestamp and location. On next tap, check if timestamp is under 300ms and location is within a 20px radius. If yes, emit doubleTap. If tap is too late or too far, treat as new single tap.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Touch Disambiguation and Priority</h3>
        <p>When user initiates two gestures simultaneously (e.g., place two fingers to pinch while already panning with one), the system must decide which gesture takes priority. Typically, use a "first to recognize" strategy: if pan is recognized first, pinch is ignored. Or use priority: pinch (zoom) might have higher priority than pan (scroll), so pinch wins.</p>
        <p>Disambiguation delay: before committing to a gesture, wait briefly (50-100ms) to see if additional touches arrive. If second touch arrives within window, switch from pan to pinch. This prevents misclassifying pan as pinch immediately when user touches with second finger.</p>
        <p>Gesture cancellation: once a gesture is recognized, if the input changes unexpectedly (e.g., third finger touches during pinch), cancel the gesture and potentially recognize a new one. Send cancelled event to handler, allowing cleanup.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Event Delegation and Responder Chain</h3>
        <p>In apps with nested views (list inside scrollable container, button inside list), which view handles a swipe? The responder chain model answers this: the innermost view gets first chance to handle the gesture. If it rejects, the gesture bubbles up to parent views.</p>
        <p>Example: user swipes on a list item inside a horizontally-scrollable carousel. The list item's swipe handler is called first. If it returns false (doesn't handle), the carousel's handler is called (advance carousel). This enables proper event flow without requiring explicit delegation.</p>
        <p>Gesture exclusivity: if one view claims a gesture (returns true), other views don't receive it. This prevents both list item and carousel from responding to the same swipe.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mouse and Pointer Event Support</h3>
        <p>Desktop users interact with mouse, not touch. Map mouse events to touch equivalents: mousedown → touchstart, mousemove → touchmove, mouseup → touchend. Use a synthetic "touch" object with mouse coordinates. Pinch is simulated with keyboard modifier: Ctrl+scroll wheel becomes pinch.</p>
        <p>Pointer Events API (modern browsers) unifies touch and mouse under "pointer" events. PointerDown, PointerMove, PointerUp work for both touch and mouse. This simplifies gesture recognition (single code path for both inputs).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance and Optimization</h3>
        <p>Touch events fire very frequently (60+ times per second on 60Hz displays). Processing each event in a heavy gesture recognizer causes jank (dropped frames). Optimization strategies: (1) Use passive event listeners (addEventListener with passive: true). This tells browser it's safe to scroll during event processing, enabling smooth scrolling even if JavaScript is busy. (2) Debounce event emissions: don't emit gesture events on every touchmove, batch them or emit every Nth event. (3) Cache calculations: if you calculated velocity once, reuse it for multiple checks. (4) Early exit: if gesture is impossible (e.g., only 1 finger for pinch), skip gesture check. (5) Use requestAnimationFrame for visual updates (scaling, rotating) instead of running in touch handlers.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p><strong>Library vs Custom Implementation:</strong> Gesture libraries (Hammer.js, Pointer Events polyfills) provide battle-tested recognizers and handle edge cases. Custom implementation gives full control and smaller bundle size. For simple apps, use library. For apps with specific gesture needs (unique three-finger gestures), custom is better.</p>
        <p><strong>Latency vs Accuracy:</strong> Strict recognition (high thresholds, delay to disambiguate) is accurate but high latency (user perceives lag). Loose recognition (low thresholds, quick emission) is low latency but high false positive rate. Balance: use 50-100ms disambiguation delay, reasonable thresholds (0.5 px/ms for swipe, 30px minimum distance).</p>
        <p><strong>Passive Listeners vs Control:</strong> Passive listeners (passive: true) prevent preventDefault() in handler, but enable browser optimizations (smooth scroll). If your gesture handler prevents default (e.g., override scroll), you can't use passive. Compromise: use passive for non-preventing handlers, passive: false only for handlers that call preventDefault().</p>
        <p><strong>Complex Gestures vs Recognition Load:</strong> Supporting many gesture types (swipe, pinch, rotate, long-press, double-tap) increases computational load and false positive risk. Prioritize gestures by user value. Long-press and swipe are common; rotate is less common (only for photo apps).</p>
        <p><strong>Desktop Parity vs Mobile-First:</strong> Full mouse support (pinch via Ctrl+wheel, double-tap via click) adds complexity. Mobile-first approach: optimize for touch, provide basic mouse fallback (click instead of tap). Accept that desktop UX may be slightly different.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Simple Swipe Carousel</h3>
        <p>Register swipe handler on carousel container. On swipeLeft, advance to next slide. On swipeRight, go to previous slide. Use CSS transitions for smooth slide movement. Include touch tracking to show visual feedback mid-swipe.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Pinch-to-Zoom Image</h3>
        <p>Track two-finger pinch. On pinch event with scale above 1.0, increase image size proportionally to the scale delta. Use a scale transform. Clamp scale to a bounded range such as 0.5 to 3.0 to prevent over-zooming. Include momentum: on pinch end, continue scaling with deceleration based on velocity.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Long-Press Context Menu</h3>
        <p>On longPress event, show context menu (fixed position or floating popup). Menu appears at touch location. Provide visual feedback during long-press (highlight item). If user moves finger before long-press fires, cancel (reset highlight).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 4: Multi-Gesture Responder Chain</h3>
        <p>Implement responder protocol: view can claim gesture or pass to parent. ListItem implements swipe to delete. ScrollableList implements swipe to advance page. On swipe: ListItem checks if swipe is horizontal/far enough to delete. If yes, claim and delete. If no, pass to parent (ListItem returns false). ScrollableList receives swipe, advances page.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Gesture recognition systems enable intuitive mobile interactions by abstracting low-level touch events into high-level gestures (swipe, pinch, rotate, long-press, double-tap, pan). Essential components include touch tracking (maintaining position history per touch), gesture recognition algorithms (velocity and distance thresholds for classification), multi-touch support (handling simultaneous fingers), state management (began, moved, ended, cancelled), and responsiveness (recognition latency under 100ms). Design patterns include velocity-based swipe detection (fast movement), scale-based pinch detection (distance ratio), stationary-touch long-press, and disambiguation delays (wait briefly before committing to gesture). Trade-offs include library vs custom (simplicity vs control), latency vs accuracy (responsive vs reliable), and passive listeners vs preventDefault control. Real-world systems (maps apps, photo viewers, iOS) use sophisticated gesture recognizers handling 10+ simultaneous touches, complex multi-touch patterns, and edge cases (gesture cancellation, priority resolution). For best results, support common gestures (swipe, pinch, long-press), use passive event listeners (enable smooth scroll), implement disambiguation delays (50-100ms), provide visual feedback during gesture (highlight, scale preview), include undo/cancel mechanisms (user changes mind), and thoroughly test edge cases (two-finger vs three-finger, rapid vs slow gestures, interrupted touches). Gesture systems significantly improve mobile UX by enabling natural, physical interactions.</p>
      </section>
    </ArticleLayout>
  );
}

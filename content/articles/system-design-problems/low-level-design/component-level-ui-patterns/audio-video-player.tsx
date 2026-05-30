"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-audio-video-player",
  title: "Design an Audio/Video Player",
  description:
    "Audio/video player with HLS adaptive streaming, seek preview, buffer management, caption rendering, accessibility keyboard map, and Picture-in-Picture.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "audio-video-player",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "audio", "video", "HLS", "adaptive-bitrate", "captions", "accessibility", "MSE"],
  relatedTopics: ["image-gallery-lightbox", "carousel-slider", "code-editor-component"],
};

export default function AudioVideoPlayerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design an Audio/Video Player</h1>
        <h2>Definition &amp; Context</h2>
        <p>Design an Audio/Video Player is a low-level design problem about implementing media element events, manifest loading, segment buffering, caption cues, seek previews, fullscreen, and Picture-in-Picture. A principal-level interview answer must define ownership boundaries, browser and accessibility semantics, local data structures, lifecycle cleanup, server reconciliation, and explicit degraded behavior.</p>
        <p>The browser media element remains the playback source of truth; the UI store mirrors durable presentation state and reconciles after every media event. The central structures are buffered TimeRanges, playback intent, active quality level, bandwidth estimate, caption cue index, seek-preview sprite map, controls timer, and recovery counters. The implementation is not complete until cancellation, stale work, SSR behavior, privacy, metrics, and rollback are deliberate rather than incidental.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/audio-video-player-runtime.svg" alt="Design an Audio/Video Player runtime flow" caption="Runtime flow: input becomes a guarded state transition, a semantic projection, and a recoverable outcome." />
      </section>
      <section>
        <h2>Core Concepts</h2>
        <p>The following deep dive preserves the component-specific mechanics and browser constraints that determine the implementation.</p>
        <p>
        Building a video player that works well across devices, network conditions, and
        accessibility requirements is substantially harder than wrapping an HTML video
        element with custom controls. A production player must handle adaptive bitrate
        streaming (switching quality levels as bandwidth fluctuates), seek thumbnail
        previews, chapter markers, subtitle rendering with karaoke-style highlighting,
        buffering state management, autoplay policy compliance (different per browser),
        keyboard shortcuts that match YouTube and Netflix conventions, and Picture-in-Picture.
        This article covers the full depth expected in a staff-level design interview.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/audio-video-player-architecture.svg"
        alt="Audio/video player architecture diagram"
        caption="Player architecture: media state, HLS adaptive streaming, seek and buffer, controls and accessibility"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        The key design questions determine the architecture's complexity:
      </p>
      <p>
        <strong>Progressive download or adaptive streaming?</strong> A simple video file
        (MP4 served from S3 with a proper Content-Range header for seeking) needs only
        an HTML video element. Adaptive bitrate streaming (HLS or DASH) requires the
        Media Source Extensions API (MSE) and a library like hls.js to handle manifest
        parsing, segment fetching, and quality switching.
      </p>
      <p>
        <strong>Live or on-demand?</strong> Live streams have a growing buffer at the
        live edge; seeking backward is limited to the DVR window. On-demand streams
        have a fixed duration and support arbitrary seeking. The player's seek bar
        behavior differs: on-demand shows the full duration; live shows the DVR window
        length with the live edge indicator.
      </p>
      <p>
        <strong>Closed captions?</strong> VTT (WebVTT) format is the web standard.
        Multiple language tracks may be available. Some use cases require karaoke-style
        highlight animation within a caption line (showing which word is currently
        spoken). SRT and TTML are other formats that may need parsing.
      </p>
      <p>
        <strong>Platform targets?</strong> iOS Safari does not support MSE for HLS
        playback; it uses native HLS playback through the video element directly.
        The player implementation must detect this and fall back to native HLS. Android
        WebView has MSE support but with different codec constraints than desktop
        Chrome.
      </p>

      <h3>Media State Model</h3>
      <p>
        The player's state is a snapshot of the HTML media element's current state plus
        application-level metadata. It includes: playing (boolean), currentTime (float
        in seconds), duration (float), buffered (TimeRanges object or a simplified
        [start, end] range), volume (0–1), muted (boolean), playbackRate (float),
        quality level (for adaptive streams), captionsEnabled (boolean), activeTrack
        index, fullscreen (boolean), and pip (Picture-in-Picture, boolean).
      </p>
      <p>
        The HTML media element is the source of truth for most of these properties.
        The player layer synchronizes React state (or a Zustand store) with the
        media element by listening to its events: timeupdate, play, pause, ended,
        volumechange, ratechange, waiting, canplay, and durationchange. This
        unidirectional sync (element → state) prevents the mismatch that occurs when
        React state gets out of sync with the element's actual state (e.g., the browser
        pauses playback due to an autoplay policy, but the React state still shows playing).
      </p>
      <HighlightBlock as="p" tier="crucial">
        Never trust React state as the source of truth for media playback. The browser
        can pause, buffer, or terminate playback independently of React's state. Always
        read media state from the element itself (videoRef.current.paused, .currentTime,
        .buffered) when precision matters, and use React state only as a mirror for
        rendering the UI. The play/pause button should set state optimistically but
        reconcile with the element's actual paused state in the play/pause event
        handlers.
      </HighlightBlock>

      <h3>HLS Adaptive Bitrate Streaming</h3>
      <p>
        HLS (HTTP Live Streaming) serves video as a playlist file (M3U8) referencing
        short segments (typically 2–10 seconds each) in multiple quality variants
        (480p, 720p, 1080p, 4K). The player fetches segments sequentially, appending
        them to the media element's buffer using the Media Source Extensions API.
      </p>
      <p>
        hls.js is the most widely used open-source HLS implementation for browsers.
        It handles: parsing the M3U8 manifest, fetching video and audio segments
        (which may be in separate streams, requiring A/V sync), managing the media
        source buffer, and automatic quality switching based on network bandwidth
        estimation.
      </p>
      <p>
        Bandwidth estimation in hls.js uses the download speed of recently fetched
        segments as a proxy for available bandwidth. If a 720p segment downloads faster
        than real-time, hls.js upgrades to 1080p for the next segment. If a 720p segment
        takes more than 1.5× real-time to download, it downgrades to 480p. The player
        UI exposes a "quality" selector allowing the user to override automatic selection
        with a specific level.
      </p>
      <p>
        iOS Safari does not support MSE, so hls.js falls back to a video element with
        a direct src pointing to the M3U8 playlist. Safari's native HLS parser handles
        the rest. Feature-detect with the hls.js isSupported() check; if false, set
        the video src to the M3U8 URL directly and let Safari handle it.
      </p>
      <p>
        The buffer health indicator shows how much video is pre-buffered ahead of the
        current playback position. A healthy buffer is 15–30 seconds ahead. The player
        reads the video element's buffered TimeRanges, finds the range containing
        currentTime, and computes the buffer end minus currentTime as the buffer ahead
        duration. Display this as the "loaded" portion of the seek bar.
      </p>

      <h3>Seek Bar and Seek Preview</h3>
      <p>
        The seek bar has three visual layers: a background track (the full duration),
        a buffered indicator (the loaded ranges), and a played indicator (0 to currentTime).
        Each layer is an absolutely positioned div or a range input's CSS custom
        properties for the fill.
      </p>
      <p>
        The seek thumb (the draggable handle) uses pointer capture to maintain drag
        behavior even when the pointer moves off the seek bar. On pointerdown, call
        setPointerCapture(event.pointerId); on pointermove, compute the target time
        from the pointer's x position relative to the bar's width and call
        video.currentTime = targetTime directly for responsive seeking (not via React
        state, to avoid rendering lag during drag).
      </p>
      <p>
        Seek preview thumbnails appear above the seek bar when the user hovers or
        drags. Two implementation approaches: video sprite thumbnails (a single image
        file containing thumbnails for every 10–30 seconds of video, accessed by CSS
        background-position) or video element scrubbing (a second hidden video element
        whose currentTime is set to the hover position, which the browser renders
        as a preview frame). Sprite thumbnails are more efficient (no network requests
        during hover); video scrubbing is simpler to implement but adds CPU and
        network overhead.
      </p>

      <h3>Caption Rendering</h3>
      <p>
        WebVTT captions can be rendered using the video element's native track element
        (add a track element as a child of video with kind="subtitles" and src pointing
        to the VTT file). Native rendering works but provides very limited styling
        control — the browser applies default caption styles and the user's system
        caption preferences override them.
      </p>
      <p>
        Custom caption rendering gives full styling control. Parse the VTT file
        (fetch it, split by double-newline cue boundaries, extract timecodes and text).
        Display the active caption by maintaining the list of all cue objects, finding
        the cue whose [startTime, endTime] range contains currentTime on each timeupdate
        event, and rendering it in an absolutely positioned overlay above the video.
        Styling the overlay with CSS gives full control over font, size, background,
        positioning, and animation.
      </p>
      <p>
        Karaoke-style highlighting requires VTT cues with timing metadata per word
        (the WebVTT specification supports this). Each word has a start time. On each
        timeupdate event (which fires approximately every 250ms), find the current
        word and apply a highlight CSS class to it. For smooth highlighting, requestAnimationFrame
        is more precise than relying on timeupdate frequency.
      </p>

      <h3>Custom Controls Architecture</h3>
      <p>
        Custom controls overlay the video element. They auto-hide on inactivity (after
        3 seconds without mouse movement) using a debounced mousemove handler that resets
        a visibility timer. Controls reappear immediately on any mouse movement, touch,
        or keyboard event.
      </p>
      <p>
        The controls layer is a div with position: absolute filling the video container.
        On mobile, the controls behave differently: they appear on a single tap (not
        on hover), and a second tap on the play area toggles play/pause. Implement this
        with a timeout: on touchend, wait 200ms; if no second touch arrives, toggle
        controls visibility; if a second touch arrives within 200ms, toggle play/pause
        and cancel the controls toggle (similar to double-click detection).
      </p>
      <p>
        The full-screen button uses the Fullscreen API (document.documentElement.requestFullscreen()
        for the container, not the video element alone — this allows the custom controls
        to be included in full-screen mode). Listen to the fullscreenchange event to
        update the full-screen button icon. On mobile, use video.webkitEnterFullscreen()
        as a fallback for iOS.
      </p>

      <h3>Keyboard Accessibility</h3>
      <p>
        The player container should have tabIndex=0 to be focusable. When focused,
        keyboard events control the player. The standard keyboard map (following YouTube
        and Netflix conventions): Space or K toggles play/pause; Left/Right arrow seeks
        backward/forward 5 seconds; J/L seeks 10 seconds; Up/Down arrow adjusts volume
        by 5%; M toggles mute; F toggles full-screen; C toggles captions; numbers
        0–9 seek to the 0%–90% position markers; less-than and greater-than keys adjust
        playback speed.
      </p>
      <p>
        The keyboard handler calls event.preventDefault() for all handled keys to
        prevent the browser from scrolling the page when arrow keys are pressed while
        the player is focused. Do not call preventDefault() for Tab — Tab should move
        focus to the next element outside the player.
      </p>
      <p>
        Each control button has an aria-label describing its current state: "Play"
        when paused, "Pause" when playing. The seek bar is a native range input
        (or has role="slider") with aria-valuemin="0", aria-valuemax equal to duration,
        aria-valuenow equal to currentTime, and aria-valuetext="2 minutes 34 seconds"
        (human-readable time). Volume follows the same pattern.
      </p>
      <HighlightBlock as="p" tier="important">
        The media element itself announces its state changes to screen readers via
        ARIA live regions if given aria-live="polite". However, frequent timeupdate
        events would spam screen reader announcements. Limit announcements to
        significant state changes: play, pause, ended, error, and caption track
        changes. For the seek bar's aria-valuenow, update it only in the timeupdate
        handler (250ms intervals) — this is frequent enough for screen reader feedback
        without being too noisy.
      </HighlightBlock>

      <h3>Picture-in-Picture</h3>
      <p>
        The Picture-in-Picture API (video.requestPictureInPicture()) detaches the
        video into a floating window that persists across tab switches. Feature-detect
        with document.pictureInPictureEnabled before showing the PiP button.
        The floating window shows only the video; custom controls are not available
        in the PiP window (they are handled by the browser's native PiP UI). However,
        the Media Session API (navigator.mediaSession) can be used to populate
        metadata (title, artist, artwork) and register action handlers (play, pause,
        seekforward, seekbackward) that appear in the PiP window's controls and in
        the OS media control center.
      </p>

      <h3>Error Handling and Recovery</h3>
      <p>
        Video element errors are reported via the error event with a MediaError code:
        MEDIA_ERR_ABORTED (1), MEDIA_ERR_NETWORK (2), MEDIA_ERR_DECODE (3), and
        MEDIA_ERR_SRC_NOT_SUPPORTED (4). Network errors (code 2) are recoverable via
        retry: re-set the src and call load() to restart fetching. Decode errors
        (code 3) may be recoverable by seeking to a different position and reloading.
        Format errors (code 4) indicate the file format is not supported — show a
        descriptive error message with a download link as a fallback.
      </p>
      <p>
        HLS-specific errors from hls.js are categorized as network errors (segment
        fetch failure), media errors (MSE append failure), and fatal errors. hls.js
        exposes a recoverMediaError() method for MSE corruption recovery (which forces
        a buffer reset and seeks back to the current position). Network errors can
        trigger a fragment retry with exponential backoff.
      </p>
      </section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>Implement the component as a small runtime with five boundaries. The input adapter normalizes keyboard, pointer, touch, browser, and async events. The state controller applies guards and separates preview state from committed state. The projection layer derives semantic DOM and ARIA relationships. The integration adapter owns server requests, URL synchronization, or browser APIs. The observability adapter emits bounded evidence for failures and slow paths.</p>
        <p>For this topic, the critical state rule is: The browser media element remains the playback source of truth; the UI store mirrors durable presentation state and reconciles after every media event. During interaction, record enough context to cancel safely. On commit, validate the latest intent, update the durable projection, and release temporary listeners, timers, observers, pointer capture, and abort controllers. On unmount, cleanup must be idempotent.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/audio-video-player-edge-cases.svg" alt="Design an Audio/Video Player edge-case defense map" caption="Edge-case map: validate intent, contain scale pressure, recover from failure, reconcile committed state, and emit evidence." />
      </section>
      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>native controls are cheaper and more robust; custom controls are justified only when product requirements need adaptive-stream observability, branded interaction, or richer accessibility. The custom design should still lean on native semantics and browser primitives where they remain correct. Replacing them creates testing obligations for keyboard behavior, focus ownership, reduced motion, touch interaction, zoom, SSR hydration, and assistive technology.</p>
        <p>Playback control is locally authoritative, while analytics and resume-position sync are asynchronous and monotonic so delayed events cannot move a user backward. At scale, the failure pressure is long live streams, unstable mobile networks, codec incompatibility, segment retry storms, and excessive caption or thumbnail work. Defend the latency budget by batching measurement, aborting stale async work, bounding caches and prefetch, and emitting analytics only for committed outcomes.</p>
        <p>A principal answer should distinguish local responsiveness from durable correctness. Optimistic UI is appropriate when the rollback is deterministic and visible. It is inappropriate when the client cannot validate authorization, inventory, resource conflicts, or destructive side effects.</p>
      </section>
      <section>
        <h2>Best practices</h2>
        <p>Use explicit state unions, typed events, idempotent cleanup, stable ids, native semantics, SSR-safe feature detection, abortable requests, and deterministic tests. Exercise keyboard-only use, touch cancellation, screen-reader output, high zoom, reduced motion, slow network, stale responses, unmount during work, and browser back-forward behavior where relevant.</p>
        <p>Observe blocked transitions, rollback frequency, stale-response drops, slow interaction latency, cache pressure, retry count, and accessibility regression results. Keep telemetry small and avoid sensitive payloads. Publish the public behavior contract before changing shared component semantics.</p>
      </section>
      <section>
        <h2>Common Pitfalls</h2>
        <p>Common failures include mixing draft and committed state, treating rendering state as the source of truth for browser-owned behavior, leaving listeners or timers active after unmount, accepting stale async completion, trusting client-side authorization, and producing inaccessible custom controls.</p>
        <p>For this component specifically, the failure policy is to fall back from MSE to native HLS where supported, cap segment retries, downgrade quality before surfacing an error, and preserve an accessible retry action. Security and privacy require the implementation to validate remote media origins, caption content, signed URLs, analytics payload size, and autoplay behavior; never let untrusted cue markup enter the DOM.</p>
      </section>
      <section>
        <h2>Real-world use cases</h2>
        <p>Representative deployments include a live sports player near the live edge, a learning platform with captions and speed control, and an audio application that continues through OS media controls. In each case, the same component shell may be reused, but the policy layer changes: latency budget, permissions, persistence, fallback, and telemetry should be injected explicitly instead of hidden in presentation code.</p>
      </section>
      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3>How would you model component state?</h3><p>I would separate committed state, transient interaction state, derived presentation, and async request generations. For this component, The browser media element remains the playback source of truth; the UI store mirrors durable presentation state and reconciles after every media event. That model makes cancellation and rollback explicit.</p>
        <h3>What breaks at scale?</h3><p>The dominant pressures are long live streams, unstable mobile networks, codec incompatibility, segment retry storms, and excessive caption or thumbnail work. I would bound work per interaction, virtualize or cache only where measured, and cancel work that is no longer relevant.</p>
        <h3>What consistency model applies?</h3><p>Playback control is locally authoritative, while analytics and resume-position sync are asynchronous and monotonic so delayed events cannot move a user backward. The interview answer must state which layer is authoritative and how stale completion is rejected.</p>
        <h3>How do you handle failure and rollback?</h3><p>I would fall back from MSE to native HLS where supported, cap segment retries, downgrade quality before surfacing an error, and preserve an accessible retry action. I would also emit a reason code so product metrics distinguish expected cancellation from defects and provider failures.</p>
        <h3>How do you defend the architecture over alternatives?</h3><p>native controls are cheaper and more robust; custom controls are justified only when product requirements need adaptive-stream observability, branded interaction, or richer accessibility. I would choose the smallest design that satisfies the required behavior and explicitly accept the testing and operability cost of custom interaction.</p>
      </section>
      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer events</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li>
          <li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React: Sharing State Between Components</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

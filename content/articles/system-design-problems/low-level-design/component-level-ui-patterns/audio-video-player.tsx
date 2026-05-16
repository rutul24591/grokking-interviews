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

      <h2>Clarifying the Requirements</h2>
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

      <h2>Media State Model</h2>
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

      <h2>HLS Adaptive Bitrate Streaming</h2>
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

      <h2>Seek Bar and Seek Preview</h2>
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

      <h2>Caption Rendering</h2>
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

      <h2>Custom Controls Architecture</h2>
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

      <h2>Keyboard Accessibility</h2>
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

      <h2>Picture-in-Picture</h2>
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

      <h2>Error Handling and Recovery</h2>
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

      <h2>Interview Q&A</h2>

      <h3>Q: How does adaptive bitrate streaming decide when to switch quality levels?</h3>
      <p>
        Quality switching in hls.js (and similar implementations) uses a bandwidth
        estimation algorithm based on recent segment download throughput. For each
        fetched segment, record (segment size in bits) / (download duration in seconds)
        as the effective bandwidth. Apply exponential weighted moving average (EWMA)
        to smooth out fluctuations: new_estimate = alpha * recent_bandwidth + (1 - alpha)
        * old_estimate. To select the next quality level, choose the highest quality
        level whose average segment bitrate is below a confidence margin of the estimated
        bandwidth (typically 80% of the estimate, to leave headroom for estimation error).
        Switching is also constrained by the buffer health: do not upgrade quality if
        the buffer is below a minimum threshold (e.g., 5 seconds), because the higher
        bitrate segments will take longer to download and may stall playback.
      </p>

      <h3>Q: How do you implement a seek thumbnail preview efficiently at scale?</h3>
      <p>
        The sprite thumbnail approach: a media processing pipeline generates a single
        image containing a grid of thumbnails captured every 10 seconds, and a VTT
        file mapping time ranges to (x, y, width, height) coordinates within the sprite.
        The player fetches the VTT file on load, parses the coordinate data, and on
        hover uses CSS background-image and background-position to display the correct
        thumbnail from the sprite sheet. For a 2-hour video at 10-second intervals,
        this is 720 thumbnails — easily fitting in one or two sprite sheets. The player
        reads the VTT cue whose time range contains the hovered timestamp, extracts
        the sprite coordinates, and sets them as CSS properties. No network requests
        during hover — only the initial sprite fetch.
      </p>

      <h3>Q: How do you handle autoplay policies across browsers?</h3>
      <p>
        Modern browsers block autoplay with audio for videos loaded without user
        interaction. The policy: autoplay is allowed for muted video, and for
        audible video only if the user has previously interacted with the site.
        The practical implementation: attempt autoplay with video.play() which returns
        a Promise. If the Promise rejects with a NotAllowedError, the browser blocked
        autoplay. At this point, mute the video (video.muted = true) and retry — muted
        autoplay is almost always permitted. Display a "Click to unmute" overlay that
        unmutes on user interaction, satisfying the browser's gesture requirement for
        future audible playback. Never assume autoplay will succeed; always handle the
        rejection.
      </p>

      <h3>Q: How do you design the player to support server-side ad insertion?</h3>
      <p>
        Server-Side Ad Insertion (SSAI) stitches ad segments directly into the video
        stream at the server level. The player receives a single HLS playlist containing
        both content and ad segments transparently — no client-side ad scheduling is
        needed. The player detects ad boundaries from HLS EXT-X-DATERANGE or EXT-X-CUE-OUT
        tags in the manifest. When playback enters an ad range, the player: disables
        seeking (ads cannot be skipped), hides the seek bar, shows an "Ad" indicator,
        and starts a countdown to the skip button (if the ad is skippable after 5 seconds).
        After the ad range, restore seeking and the seek bar. The player must also
        fire ad tracking beacons (impression, quartile, complete URLs from the manifest)
        via fetch() at the appropriate playback positions.
      </p>

      <h3>Q: How would you implement a player that works offline after first view?</h3>
      <p>
        Offline playback requires caching media segments using a Service Worker and the
        Cache API. On first playback, the Service Worker intercepts each HLS segment
        request and stores the response in a named cache. On subsequent plays (offline),
        the Service Worker serves segments from the cache. For HLS, cache the lowest
        quality level's segments to minimize storage. Store the M3U8 manifest with
        updated segment URLs pointing to the cached versions. The video duration and
        metadata are cached in IndexedDB. On the application side, expose a "Download
        for offline" button that triggers the Service Worker to pre-fetch all segments
        for a given quality level. Show download progress via a ServiceWorkerMessageChannel.
        Manage storage quotas with navigator.storage.estimate() and evict old downloads
        when approaching the limit.
      </p>
    </ArticleLayout>
  );
}

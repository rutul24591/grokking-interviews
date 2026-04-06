"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-audio-video-player",
  title: "Design an Audio/Video Player",
  description:
    "Audio/video player with custom controls, keyboard shortcuts, captions, streaming support, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "audio-video-player",
  wordCount: 3200,
  readingTime: 18,
  lastUpdated: "2026-04-03",
  tags: ["lld", "audio", "video", "player", "streaming", "captions", "accessibility", "keyboard"],
  relatedTopics: ["image-gallery-lightbox", "carousel-slider", "code-editor-component"],
};

export default function AudioVideoPlayerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design an audio/video player component — a media player with custom
          controls (play/pause, seek, volume, playback speed), keyboard shortcuts,
          closed captions/subtitles, streaming support (HLS/DASH), picture-in-picture
          mode, and full keyboard accessibility.
        </p>
        <p>
          <strong>Assumptions:</strong> The player uses the HTML5 video/audio element
          as the underlying media engine. Custom controls replace the browser&apos;s
          default controls. Streaming uses HLS.js for HLS support. Captions are in
          WebVTT format.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Playback Controls:</strong> Play/pause, seek bar with time display, volume control, mute toggle.</li>
          <li><strong>Playback Speed:</strong> 0.25x to 2x speed selection.</li>
          <li><strong>Captions/Subtitles:</strong> Toggle captions, language selection, caption styling (font size, color, background).</li>
          <li><strong>Fullscreen:</strong> Fullscreen toggle with proper exit handling.</li>
          <li><strong>Picture-in-Picture:</strong> PiP mode for video, continues playing when tab is not focused.</li>
          <li><strong>Keyboard Shortcuts:</strong> Space (play/pause), Left/Right (seek ±5s), Up/Down (volume), M (mute), C (captions), F (fullscreen).</li>
          <li><strong>Streaming:</strong> HLS/DASH support with adaptive bitrate switching.</li>
          <li><strong>Playback Quality:</strong> Manual quality selection (360p, 720p, 1080p) or auto.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Controls respond within 100ms. Seek bar updates at 30fps during drag.</li>
          <li><strong>Accessibility:</strong> All controls keyboard accessible, ARIA labels, screen reader announces playback state.</li>
          <li><strong>Responsive:</strong> Controls adapt to screen size — fewer controls on mobile, touch-friendly targets.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Network drops during streaming — show buffering indicator, auto-reconnect.</li>
          <li>Video source is audio-only — hide video-specific controls (fullscreen, PiP, quality).</li>
          <li>Caption file fails to load — show error, continue playback without captions.</li>
          <li>User seeks beyond buffered range — show loading spinner, resume when buffered.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>custom controls layer</strong> on top of the HTML5
          video/audio element. A <strong>Zustand store</strong> mirrors the media
          element&apos;s state (currentTime, duration, paused, volume, buffered ranges)
          so that React components react to media changes. The seek bar uses a custom
          draggable slider with buffered range overlay. Captions render as an HTML
          overlay parsed from WebVTT, timed to the current playback position.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Media Engine Wrapper</h4>
          <p>Wraps the HTML5 video/audio element, exposes a unified API (play, pause, seek, setVolume, setPlaybackRate). Handles HLS.js initialization for streaming.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. State Sync</h4>
          <p>Event listeners on the media element (timeupdate, play, pause, volumechange, etc.) sync state to the Zustand store. Debounced at 100ms for timeupdate to avoid excessive re-renders.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Seek Bar</h4>
          <p>Custom slider with buffered range overlay (gray bar), playhead (red dot), and hover preview (optional thumbnail). Pointer drag for seeking.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Caption Renderer</h4>
          <p>Parses WebVTT file, renders current caption as an HTML overlay synced to currentTime. Supports caption styling (font, color, position).</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/audio-video-player-architecture.svg"
          alt="Audio video player architecture showing media state sync, HLS streaming, and caption rendering"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Player mounts: media element loads source, HLS.js initializes if streaming.</li>
          <li>State sync listeners update store: duration, buffered ranges, playback state.</li>
          <li>User clicks play: store calls media.play(), state sync updates paused=false, controls re-render.</li>
          <li>User drags seek bar: store calls media.currentTime=newTime, timeupdate fires, playhead updates.</li>
          <li>Caption renderer: on timeupdate, finds active cue, renders caption overlay.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Media element events → state sync → store update → controls re-render.
          User interaction → store action → media element method call → media event →
          state sync (loop closes).
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Network drop:</strong> Media element fires &apos;waiting&apos; event. Show buffering spinner. On &apos;canplay&apos; resume, hide spinner.</li>
          <li><strong>Seek beyond buffered:</strong> Media element fires &apos;seeking&apos; then &apos;waiting&apos;. Show loading state. Resume when &apos;canplay&apos; fires.</li>
          <li><strong>Caption parse error:</strong> WebVTT parser throws error. Log warning, continue playback without captions. Show &quot;Captions unavailable&quot; indicator.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Key approach: HTML5 video/audio element with custom React controls layer, Zustand
          state sync via media events, WebVTT caption parsing and rendering, HLS.js for
          streaming, and full keyboard shortcut support.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">State sync (timeupdate)</td><td className="p-2">O(1) — debounced at 100ms</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Caption lookup</td><td className="p-2">O(c) — c cues per time window</td><td className="p-2">O(c)</td></tr>
              <tr><td className="p-2">Seek bar render</td><td className="p-2">O(1) — buffered ranges overlay</td><td className="p-2">O(b) — b buffered ranges</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <p>
          Media source URLs are validated against an allowlist. For streaming, HLS
          manifests are fetched from trusted CDNs. For accessibility, all controls have
          <code>aria-label</code>, play/pause state is announced via
          <code>aria-live</code>, keyboard shortcuts are documented in a help overlay,
          and captions are always available for video content.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <li><strong>Unit:</strong> State sync — test media events map to store updates correctly. Seek bar — test time-to-position conversion, buffered range overlay.</li>
          <li><strong>Integration:</strong> Play video, verify play state updates, verify time increments. Seek, verify currentTime updates. Toggle captions, verify overlay renders.</li>
          <li><strong>Accessibility:</strong> All controls keyboard accessible, screen reader announces playback state, caption text is readable.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Not handling media events:</strong> Relying on React state alone without syncing to the media element&apos;s events causes stale UI (e.g., play button shows &quot;play&quot; when video is actually playing).</li>
          <li><strong>No buffering indicator:</strong> When the network is slow, the video freezes with no feedback. The &apos;waiting&apos; event must trigger a loading spinner.</li>
          <li><strong>Ignoring audio-only sources:</strong> Video-specific controls (fullscreen, PiP) should hide when the source is audio-only.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement adaptive bitrate streaming?</p>
            <p className="mt-2 text-sm">
              A: HLS.js handles this automatically. It monitors network bandwidth and
              buffer health, switching between quality levels in the HLS manifest. The
              UI shows the current quality and allows manual override. When set to &quot;Auto&quot;,
              HLS.js manages quality transitions.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement video chapters?</p>
            <p className="mt-2 text-sm">
              A: Parse a chapter manifest (JSON with timestamps and titles). Render
              chapter markers on the seek bar as vertical lines. Show chapter title on
              hover. Clicking a marker seeks to that timestamp. Display the current
              chapter name in the controls.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement watch time tracking (analytics)?</p>
            <p className="mt-2 text-sm">
              A: On timeupdate, track the highest watermark reached. On pause/stop,
              send the watched duration to analytics. Track quality changes, buffering
              events, and caption usage. Use this data to optimize video encoding and
              CDN delivery.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement DRM-protected content?</p>
            <p className="mt-2 text-sm">
              A: Use Encrypted Media Extensions (EME) with the video element&apos;s
              <code>setMediaKeys()</code> API. The DRM license server issues a license
              after authentication. The browser decrypts the content during playback.
              HLS.js supports FairPlay, Widevine, and PlayReady DRM systems.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — HTMLMediaElement API
            </a>
          </li>
          <li>
            <a href="https://github.com/video-dev/hls.js/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              HLS.js — HTTP Live Streaming Client
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/TR/webvtt1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WebVTT — Web Video Text Tracks Format
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/media/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI-ARIA Media Player Pattern
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

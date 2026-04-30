"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-audio-video-player",
  title: "Design an Audio / Video Player",
  description:
    "LLD for a custom media player: HLS/DASH streaming, custom controls, captions, picture-in-picture, keyboard shortcuts, accessibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "audio-video-player",
  wordCount: 6800,
  readingTime: 36,
  lastUpdated: "2026-04-29",
  tags: ["lld", "video-player", "hls", "captions", "react", "accessibility"],
  relatedTopics: [
    "image-gallery-lightbox",
    "real-time-data-dashboard",
  ],
};

export default function AudioVideoPlayerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing an embedded audio/video
          player — the component that plays media inline
          with custom controls, adaptive streaming
          (HLS/DASH for video), captions, playback
          speed, quality switching, picture-in-picture,
          and accessibility. Native HTML5
          <code> {`<video>`}</code> handles a lot, but
          custom controls give brand consistency and
          finer-grained UX. The hard work is bridging
          the native element&rsquo;s state machine to
          custom React UI without race conditions or
          desync.
        </p>
        <p>
          The hard problems are: keeping React state in
          sync with the native media element&rsquo;s
          state (which has its own event lifecycle);
          adaptive bitrate streaming via HLS/DASH (using
          libraries like hls.js); captions overlay
          synced to playback; keyboard shortcuts that
          don&rsquo;t conflict with form inputs;
          picture-in-picture lifecycle; analytics
          (play, pause, seek, completion); and
          accessibility for non-sighted users (audio
          descriptions, transcripts).
        </p>

        <h3>User Context</h3>
        <p>
          End users watch videos and listen to audio in
          various contexts (educational content,
          podcasts, livestreams, social videos). They
          expect smooth playback, quality switching on
          slow networks, captions, and keyboard
          control. Engineering teams provide a media
          source URL and the player handles everything
          else.
        </p>

        <h3>Assumptions</h3>
        <p>
          Sources are HLS (.m3u8) for adaptive video,
          MP4 for non-adaptive, MP3/AAC for audio.
          For HLS in non-Safari browsers, hls.js
          provides the adaptive layer. Modern browsers;
          we use the Media Source Extensions API,
          Picture-in-Picture API, Media Session API for
          OS-level integration, and
          <code> {`<track>`}</code> elements for
          captions.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement video upload, encoding, or
          server-side streaming. We do not implement DRM
          (Widevine, FairPlay) — that&rsquo;s a separate
          enterprise concern. We don&rsquo;t implement
          live broadcasting (one-to-many real-time).
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Play, pause, seek via progress bar.
          Volume control with mute. Captions toggle
          (off, language selection). Playback speed
          (0.5x to 2x). Quality selection (auto + manual
          for HLS/DASH). Fullscreen toggle. Picture-in-
          Picture toggle (where supported). Keyboard
          shortcuts: Space play/pause, Left/Right seek,
          Up/Down volume, F fullscreen, M mute, C
          captions. Loading states (spinner during
          buffering). Error states with retry.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Chapter markers on the progress bar. Thumbnail
          preview on progress-bar hover. Watch progress
          persistence (resume where you left off).
          Audio descriptions track. Transcript panel
          synced with playback. AirPlay / Cast
          integration. Skip-intro / skip-outro buttons.
          Share with timestamp.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Live broadcasting (RTMP, WebRTC ingestion),
          DRM, video editing, transcoding.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Initial play under 2 seconds (network
          permitting). Smooth seeking. Buffering
          minimization via adaptive quality. UI
          responsive during playback (controls don&rsquo;t
          stutter).
        </p>

        <h3>Reliability</h3>
        <p>
          Playback recovers from network interruption.
          Errors degrade gracefully (try lower quality,
          surface error if unrecoverable). Captions
          sync with playback even after seek.
        </p>

        <h3>Security</h3>
        <p>
          Media sources authenticated as needed.
          Cross-origin headers (CORS) for media. CSP
          considerations for inline media. No user-
          generated HTML in custom controls.
        </p>

        <h3>Accessibility</h3>
        <p>
          Captions are text, screen-reader-readable.
          Controls are real form elements with
          labels. Keyboard parity. Audio descriptions
          track for blind users. Transcript panel
          accessible.
        </p>

        <h3>Maintainability</h3>
        <p>
          Adapter for streaming engines (HLS via
          hls.js, DASH via dash.js, native).
          Controls customizable via render-props.
          Plugins for chapters, thumbnails,
          analytics.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/audio-video-player-architecture.svg"
        alt="Audio / Video Player Architecture"
        caption="Media element (HTML5 video/audio) ← Streaming engine (hls.js, dash.js, or native) → React control layer (state synced via media events) → Custom UI (controls, captions overlay, progress, quality) + Picture-in-Picture + Media Session integration."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The player wraps a native
          <code> {`<video>`}</code> or
          <code> {`<audio>`}</code> element and provides
          a React control layer that mirrors the
          element&rsquo;s state. The architecture has
          three core parts: <strong>streaming engine
          adapter</strong> (selects between native, HLS,
          DASH based on source and browser),
          <strong> media state synchronizer</strong>{" "}
          (keeps React state in sync with the media
          element via DOM events), and <strong>control
          layer</strong> (custom UI that manipulates the
          media element).
        </p>
        <p>
          The <strong>streaming engine adapter</strong>{" "}
          inspects the source URL and browser
          capabilities. For native HLS support (Safari),
          set the URL directly on the video element. For
          non-native HLS, dynamically import hls.js,
          attach to the video element, load the
          manifest. For DASH, use dash.js similarly.
          For plain MP4/MP3, set src directly. The
          adapter abstracts these differences from the
          control layer.
        </p>
        <p>
          The <strong>media state synchronizer</strong>{" "}
          listens to media element events (timeupdate,
          play, pause, ended, waiting, canplay,
          ratechange, volumechange, durationchange,
          error) and reflects them into a React state
          store. The control layer subscribes to this
          store via selector hooks. The synchronizer
          throttles
          <code> timeupdate</code> events
          (which fire ~4x/sec natively) to a rate that
          matches our progress-bar update needs.
        </p>
        <p>
          The <strong>control layer</strong> renders
          buttons and sliders that, on user interaction,
          call media element methods (play, pause,
          set currentTime, set volume). The flow is
          one-way: user interaction → method call →
          media event → state update → re-render. We
          never set React state and the media element
          state independently; one always follows the
          other.
        </p>
        <p>
          <strong>Captions</strong> use the
          <code> {`<track>`}</code> element with WebVTT
          files. The browser handles caption rendering
          natively when track mode is set to showing.
          For custom-styled captions, we hide the
          native rendering (track mode hidden) and
          render captions ourselves in an overlay,
          reading the active cue from
          <code> textTracks[i].activeCues</code> on
          cue change events. Custom rendering gives
          consistent styling across browsers.
        </p>
        <p>
          <strong>Quality switching</strong>: hls.js and
          dash.js expose level lists. Auto mode uses
          the engine&rsquo;s adaptive bitrate
          algorithm. Manual mode lets the user pick a
          specific level. The control surfaces both as
          a menu.
        </p>
        <p>
          <strong>Picture-in-Picture</strong>: the
          Picture-in-Picture API is straightforward —
          <code> video.requestPictureInPicture()</code>{" "}
          enters,
          <code> document.exitPictureInPicture()</code>{" "}
          exits. The player listens to enter/exit
          events to update its UI state.
        </p>
        <p>
          <strong>Media Session API</strong> integrates
          with OS-level media controls (lock-screen
          play/pause, hardware media keys). We set
          metadata (title, artwork) and action handlers
          (play, pause, seek). This makes the player
          feel native on mobile and desktop.
        </p>
        <p>
          <strong>Keyboard shortcuts</strong>: registered
          globally when the player has focus. We avoid
          conflicts with form inputs by checking the
          active element before handling. Shortcuts
          announce on first use via a tooltip or in a
          help overlay.
        </p>
        <p>
          <strong>Watch progress persistence</strong>:
          on pause and on unload, save the current
          time to the host&rsquo;s storage (per user,
          per video). On next mount, offer to resume
          from saved position with a banner.
        </p>
        <p>
          <strong>Errors</strong>: media element error
          events surface via the synchronizer. We
          map error codes to user-friendly messages
          and offer Retry. Network-level errors
          trigger automatic retry with backoff before
          surfacing to the user.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>PlayerProvider</strong> instantiates
          the streaming engine and synchronizer.
          <strong> StreamingEngine</strong> abstracts
          HLS/DASH/native. <strong>MediaSync</strong>{" "}
          mirrors media state to React.
          <strong> ControlBar</strong> renders custom
          controls. <strong>ProgressBar</strong>{" "}
          renders seek bar with chapter and thumbnail
          preview. <strong>VolumeControl</strong>,{" "}
          <strong>SpeedMenu</strong>,
          <strong> QualityMenu</strong>,
          <strong> CaptionsControl</strong> render
          their respective controls.
          <strong> CaptionsOverlay</strong> renders
          custom-styled captions.
          <strong> KeyboardShortcuts</strong> handles
          global key events.
          <strong> MediaSessionBridge</strong>{" "}
          integrates with OS controls.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Media state (currentTime, duration, paused,
          volume, muted, playbackRate, ready, error)
          mirrors in an external store. Control state
          (open menus, fullscreen) lives in component
          state. The media element is the source of
          truth; the React store is a mirror.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>source</code> (URL or sources array),
          <code> tracks</code> (caption tracks),
          <code> chapters</code>,{" "}
          <code>autoPlay</code>, <code>poster</code>,
          <code> onTimeUpdate</code>,
          <code> onEnded</code>, etc. The
          <code> source</code> can be a single URL
          or an array of qualities; the streaming
          engine picks.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Streaming engine handles adaptive bitrate.
          Time updates throttled. Captions overlay
          renders only the active cue. Controls
          memoized. Off-screen video pauses (Page
          Visibility API) to save battery. Heavy
          features (thumbnails, transcripts) lazy-load.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Controls auto-hide during playback (after a
          few seconds of inactivity), reappear on
          mouse move or touch. Tap-to-toggle on mobile.
          Buffering shows spinner. Quality menu shows
          current selection. Captions menu shows
          available languages. Time display in
          mm:ss or hh:mm:ss. Keyboard shortcut hints
          on hover. Loading state with poster image.
          Error with retry.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          All controls are real buttons or sliders with
          labels. Captions are screen-reader-readable.
          Audio descriptions track when available.
          Transcript panel accessible. Keyboard parity.
          Focus visible on all controls. Volume
          slider operable via arrow keys with
          announcement.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Media sources authenticated and CORS-enabled
          where needed. No user content rendered as
          HTML in controls. DRM is out of scope but
          would slot in via the streaming engine
          adapter.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the synchronizer (event →
          state mapping). Integration tests with mock
          streaming engines. Cross-browser tests for
          HLS native vs hls.js. Accessibility tests
          for caption rendering and keyboard parity.
          Performance tests for control responsiveness
          during playback.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Network drop mid-playback: engine handles
          buffering; we show spinner; auto-resume on
          reconnect. Source not supported by browser:
          adapter falls back or shows error.
          Autoplay blocked by browser: detect and
          show a play button with explanation. User
          rapidly clicks play/pause: state machine
          handles transitions correctly. Seeking to
          unbuffered area: shows spinner during
          fetch. Captions track loads slowly:
          captions appear when ready. Picture-in-
          picture and fullscreen interactions: only
          one at a time; entering one exits the
          other. Tab backgrounded: continues playing
          (audio especially); we update Media
          Session for OS controls.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over media source and streaming
          engine. Plugin system for chapters,
          thumbnails, analytics. Theme tokens for
          control styling.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Control labels, language names in caption
          menu, error messages via i18n. RTL flips
          layout via CSS logical properties. Captions
          display the source language.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Custom controls vs native controls</h3>
        <p>
          Custom controls give brand consistency and
          fine-grained UX. Native controls are
          accessible by default and simpler. Custom is
          right for product-quality embeds; native
          for low-stakes embeds.
        </p>

        <h3>HLS via hls.js vs native</h3>
        <p>
          Safari supports HLS natively. Other browsers
          need hls.js. We dynamically pick at runtime.
          The bundle cost of hls.js is paid only when
          needed.
        </p>

        <h3>Custom captions vs native</h3>
        <p>
          Native captions render with browser styling.
          Custom captions give consistent styling but
          more code. We default to native and switch
          to custom only when the product needs
          consistent styling (typical for branded
          experiences).
        </p>

        <h3>Sync via events vs polling</h3>
        <p>
          Events (timeupdate, play, pause, etc.) are
          accurate and efficient. Polling
          <code> currentTime</code> wastes CPU. We
          always use events, throttling timeupdate to
          our needs.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          DRM integration (Widevine, FairPlay).
          AirPlay/Cast support. Real-time
          collaborative watching (sync state across
          users). AI-generated captions. Chapter
          auto-detection.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How do you sync React state with the
          media element?</strong> Listen to media element
          events (timeupdate, play, pause, etc.) and
          mirror to a React store. User interactions
          call media element methods, which trigger
          events, which update state. One-way flow.
        </p>

        <p>
          <strong>2. How is HLS handled?</strong> Native
          HLS in Safari (set src directly).
          Non-native browsers use hls.js attached to
          the video element. The streaming engine
          adapter picks at runtime.
        </p>

        <p>
          <strong>3. How do captions work?</strong>
          <code> {`<track>`}</code> element with
          WebVTT file. Native rendering by default;
          custom rendering for consistent styling
          reads active cues from
          <code> textTracks[i].activeCues</code>.
        </p>

        <p>
          <strong>4. How does Picture-in-Picture
          integrate?</strong> Picture-in-Picture API:
          <code> video.requestPictureInPicture()</code>{" "}
          and
          <code> document.exitPictureInPicture()</code>.
          Listen to enter/exit events to update UI.
        </p>

        <p>
          <strong>5. How is Media Session API
          used?</strong> Set metadata (title,
          artwork) and action handlers (play, pause,
          seek). This connects the player to OS-level
          media controls (lock screen, hardware
          keys).
        </p>

        <p>
          <strong>6. How are keyboard shortcuts handled
          without conflicting with inputs?</strong>{" "}
          Check active element before handling keys.
          If the user is in a form input, ignore
          shortcuts. Otherwise handle and prevent
          default.
        </p>

        <p>
          <strong>7. How does watch progress persist?</strong>{" "}
          On pause and unload, save current time to
          host storage keyed by (user, video). On
          next mount, offer to resume.
        </p>

        <p>
          <strong>8. How is the player accessible?</strong>{" "}
          Real form controls with labels, captions,
          audio descriptions, transcript panel,
          keyboard parity. Focus visible on all
          controls.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A custom audio/video player is a{" "}
          <strong>streaming engine adapter + media
          state synchronizer + custom control layer</strong>.
          The engine adapter handles HLS/DASH/native.
          The synchronizer mirrors media element
          state to React. The control layer renders
          custom UI that calls media methods. Media
          Session API integrates with OS controls;
          captions, keyboard shortcuts, and progress
          persistence round out the experience.
        </p>
      </section>
    </ArticleLayout>
  );
}

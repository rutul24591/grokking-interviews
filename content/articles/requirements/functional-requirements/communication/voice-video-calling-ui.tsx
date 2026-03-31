"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-voice-video-calling",
  title: "Voice/Video Calling UI",
  description:
    "Comprehensive guide to implementing voice and video calling UI covering call controls, quality indicators, screen sharing, participant management, and real-time communication features for rich calling experiences.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "voice-video-calling-ui",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "calling",
    "video",
    "frontend",
    "webrtc",
    "real-time",
  ],
  relatedTopics: ["webrtc", "real-time-communication", "audio-video-processing", "screen-sharing"],
};

export default function VoiceVideoCallingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Voice/Video calling UI enables real-time audio/video communication with call controls, quality indicators, and collaboration features. Users make 1:1 calls for personal conversations, group calls for team meetings, and large calls for webinars. The UI must handle call establishment, media rendering, controls (mute, video toggle, end), quality feedback, and additional features like screen sharing and chat. Call quality directly impacts user satisfaction—choppy audio or frozen video frustrates users.
        </p>
        <p>
          The complexity of calling UI stems from real-time media handling. Audio/video streams must render smoothly with minimal latency. Network conditions vary—UI must adapt quality dynamically. Multiple participants require grid layouts that scale. Screen sharing needs secure capture and display. Call controls must be accessible during the call without obscuring video. Background processes (noise suppression, echo cancellation) run without user intervention.
        </p>
        <p>
          For staff and principal engineers, calling UI implementation involves WebRTC integration, media stream management, and real-time state synchronization. The UI must handle call states (ringing, connected, ended), participant states (joined, left, muted), and network states (good, poor, disconnected). Error handling for failed calls, reconnection logic, and fallback options are critical. The architecture must support multiple platforms (web, iOS, Android) with consistent UX.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Call States</h3>
        <p>
          Idle: No active call. Show call initiation UI (contact list, dial pad, new call button). Background state: check for incoming calls. Battery efficient—no media processing.
        </p>
        <p>
          Ringing (Outgoing): Call initiated, waiting for recipient. Show caller info, call status ("Calling..."), cancel button. Play ringback tone (optional). Handle no answer timeout (30-60 seconds).
        </p>
        <p>
          Ringing (Incoming): Incoming call notification. Full-screen takeover (mobile) or modal (desktop). Show caller info, answer/decline buttons. Play ringtone. Handle timeout (auto-decline after 30-60 seconds).
        </p>
        <p>
          Connected: Call active. Show participant video/audio, call controls, duration timer, quality indicator. Media streams active. Background audio allowed (mobile). Handle network changes, participant join/leave.
        </p>
        <p>
          Ended: Call terminated. Show call summary (duration, participants). Return to idle state. Log call analytics. Offer feedback option (call quality rating).
        </p>

        <h3 className="mt-6">Call Controls</h3>
        <p>
          Mute/Unmute: Toggle microphone. Muted: icon with slash, red indicator. Unmuted: microphone icon. Visual feedback essential—users need to know mute state. Keyboard shortcut (Space or M).
        </p>
        <p>
          Video Toggle: Enable/disable camera. Video off: avatar/placeholder, camera icon with slash. Video on: live video, camera icon. Privacy indicator when camera active. Keyboard shortcut.
        </p>
        <p>
          Speaker Selection: Choose audio output (speaker, earpiece, Bluetooth, headphones). Platform-specific: iOS route picker, Android speaker toggle. Default to speakerphone for group calls.
        </p>
        <p>
          End Call: Red button, prominent placement. Confirmation for group calls (accidental end disrupts meeting). Keyboard shortcut (Escape or E).
        </p>
        <p>
          Additional Controls: Screen share toggle, chat toggle, participant list, raise hand (group calls), reactions (emoji reactions during call), recording toggle (with consent notification).
        </p>

        <h3 className="mt-6">Video Layouts</h3>
        <p>
          1:1 Call: Full-screen remote video, picture-in-picture local video (corner). Tap to swap (local full-screen). Minimal controls overlay (auto-hide).
        </p>
        <p>
          Grid View (Group): Equal tiles for all participants. Auto-layout (2x2, 3x3, etc.). Active speaker highlighted (border, larger tile). Scroll for large calls (10+ participants).
        </p>
        <p>
          Speaker View (Group): Active speaker full-screen, others as thumbnails. Auto-switch on voice activity. Manual pin option (keep specific participant visible).
        </p>
        <p>
          Presentation View: Screen share full-screen, participants as thumbnails. Picture-in-picture for speaker. Return to grid/speaker view on share end.
        </p>

        <h3 className="mt-6">Quality Indicators</h3>
        <p>
          Network Quality: Signal bars or icon (green=good, yellow=fair, red=poor). Tooltip with details (bitrate, packet loss, latency). Update every 5-10 seconds.
        </p>
        <p>
          Audio Quality: Visual indicator when audio issues detected ("Poor connection", "Echo detected"). Suggest fixes ("Use headphones", "Move closer to WiFi").
        </p>
        <p>
          Video Quality: Resolution indicator (HD, SD). Auto-downgrade on poor network. Manual quality setting (prefer quality vs smoothness).
        </p>
        <p>
          Connection Status: "Reconnecting..." on disconnect. Retry indicator. Fallback to audio-only on severe bandwidth constraints.
        </p>

        <h3 className="mt-6">Screen Sharing</h3>
        <p>
          Initiation: Screen share button, select window/screen/tab (browser), entire screen or application (desktop). Preview before sharing.
        </p>
        <p>
          Active Share: Green indicator (recording-style). Share controls (pause, stop). Audio share option (share computer audio). Participant view of shared content.
        </p>
        <p>
          Permissions: OS-level permission (macOS screen recording, Windows capture). First-time setup flow. Persistent permission option.
        </p>
        <p>
          Security: Blur sensitive areas (passwords, notifications). Stop on call end. Notify when recording starts.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Calling UI architecture spans call management, media rendering, controls, and state synchronization. Call manager handles call lifecycle (start, answer, end). Media renderer displays audio/video streams. Controls overlay provides user interaction. State sync keeps all participants synchronized.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/voice-video-calling-ui/calling-ui-architecture.svg"
          alt="Calling UI Architecture"
          caption="Figure 1: Calling UI Architecture — Call management, media rendering, controls, and state synchronization"
          width={1000}
          height={500}
        />

        <h3>Call Manager</h3>
        <p>
          Call initialization: select contact, choose call type (audio/video), initiate WebRTC connection. Signal to recipient (push notification for background). Handle incoming call (ring, answer/decline).
        </p>
        <p>
          Media stream management: request camera/microphone permissions. Handle permission denied (fallback to audio-only). Switch cameras (front/back on mobile). Adjust camera settings (resolution, frame rate).
        </p>
        <p>
          Call lifecycle: track call duration, participant count, join/leave events. Handle reconnection (network blip). Graceful end (send end signal, cleanup streams).
        </p>

        <h3 className="mt-6">Media Renderer</h3>
        <p>
          Video rendering: WebRTC video element (web), AVPlayer (iOS), ExoPlayer (Android). Auto-play on stream received. Handle stream changes (participant video on/off). Optimize for performance (hardware decoding).
        </p>
        <p>
          Audio rendering: WebRTC audio element, system audio routing. Echo cancellation, noise suppression (built-in to WebRTC). Volume control, mute handling.
        </p>
        <p>
          Layout management: grid calculation for N participants. Active speaker detection (voice activity). Smooth transitions on join/leave. Responsive design (mobile vs desktop).
        </p>

        <h3 className="mt-6">Controls Overlay</h3>
        <p>
          Control bar: bottom placement (thumb-friendly on mobile). Auto-hide after inactivity (3-5 seconds). Tap to show. Essential controls always visible (end call).
        </p>
        <p>
          State indicators: mute state (icon change), video state (icon change), network quality (color-coded). Tooltip on hover/long-press.
        </p>
        <p>
          Accessibility: keyboard navigation, screen reader labels, high contrast mode. Large touch targets (44x44px minimum).
        </p>

        <h3 className="mt-6">State Synchronization</h3>
        <p>
          Participant state: sync join/leave, mute/unmute, video on/off. WebSocket or data channel for signaling. Optimistic updates (show local change immediately).
        </p>
        <p>
          Call state: sync call duration, recording state, screen share state. All participants see consistent state. Conflict resolution (last-write-wins for simple state).
        </p>
        <p>
          Chat integration: in-call chat messages. Sync message delivery. Show chat toggle with unread count.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/voice-video-calling-ui/call-states-flow.svg"
          alt="Call States Flow"
          caption="Figure 2: Call States Flow — Idle → Ringing → Connected → Ended with transitions"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Group Call Management</h3>
        <p>
          Participant grid: dynamic layout for N participants. Max visible (9-16), overflow in scroll/pagination. Active speaker highlight. Pin specific participants.
        </p>
        <p>
          Participant list: side panel with all participants. Show status (muted, video off, hand raised). Host controls (mute all, remove participant).
        </p>
        <p>
          Large call optimization: virtual scrolling for 50+ participants. Audio-only mode for bandwidth. Server-side mixing for very large calls (webinar mode).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/voice-video-calling-ui/video-layouts.svg"
          alt="Video Layouts"
          caption="Figure 3: Video Layouts — 1:1, Grid, Speaker, and Presentation views"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Calling UI design involves trade-offs between quality, performance, features, and complexity. Understanding these trade-offs enables informed decisions aligned with use case and platform constraints.
        </p>

        <h3>Video Quality vs Bandwidth</h3>
        <p>
          High quality (1080p, 30fps): Pros: Best visual experience. Cons: High bandwidth (4+ Mbps), battery drain. Best for: WiFi, desktop, important calls.
        </p>
        <p>
          Balanced (720p, 30fps): Pros: Good quality, reasonable bandwidth (1-2 Mbps). Cons: Some quality loss. Best for: Most consumer calls.
        </p>
        <p>
          Low bandwidth (480p, 15fps): Pros: Works on cellular, battery efficient. Cons: Visible quality loss. Best for: Mobile, poor networks.
        </p>
        <p>
          Adaptive: automatically adjust based on network. Pros: Best of both worlds. Cons: Complexity, visible quality changes. Best for: Most production apps.
        </p>

        <h3>Layout: Grid vs Speaker View</h3>
        <p>
          Grid view: all participants equal size. Pros: Everyone visible, democratic. Cons: Small tiles for large calls, hard to see active speaker. Best for: Small calls (2-9 participants).
        </p>
        <p>
          Speaker view: active speaker full-screen. Pros: Focus on speaker, better visibility. Cons: Others hard to see, auto-switch can be jarring. Best for: Large calls, presentations.
        </p>
        <p>
          Hybrid: user-selectable, auto-switch based on call size. Pros: Flexibility. Cons: More complex. Best for: Most production apps.
        </p>

        <h3>Controls: Minimal vs Full</h3>
        <p>
          Minimal controls: auto-hide, essential only. Pros: Clean UI, more screen for video. Cons: Harder to find features. Best for: 1:1 calls, consumer apps.
        </p>
        <p>
          Full controls: always visible, all features. Pros: Easy access, discoverable. Cons: Obscures video, cluttered. Best for: Enterprise, group calls.
        </p>
        <p>
          Contextual: show relevant controls based on state. Pros: Balanced. Cons: Complexity. Best for: Most production apps.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/voice-video-calling-ui/quality-indicators.svg"
          alt="Quality Indicators"
          caption="Figure 4: Quality Indicators — Network quality, audio/video status, and connection feedback"
          width={1000}
          height={450}
        />

        <h3>Screen Share: Full vs Window</h3>
        <p>
          Full screen share: share entire display. Pros: Everything visible, easy. Cons: Privacy risk (notifications visible). Best for: Trusted environments.
        </p>
        <p>
          Window share: share specific application. Pros: Privacy (other apps hidden). Cons: Can't switch apps easily. Best for: Professional use.
        </p>
        <p>
          Tab share (browser): share browser tab only. Pros: Secure, no OS permissions. Cons: Only web content. Best for: Web apps.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Request permissions early:</strong> Ask for camera/mic permissions before call starts. Explain why needed. Handle denial gracefully (audio-only fallback).
          </li>
          <li>
            <strong>Auto-hide controls:</strong> Hide controls after 3-5 seconds inactivity. Tap to show. End call always visible. Maximizes video space.
          </li>
          <li>
            <strong>Show quality indicators:</strong> Network quality icon (color-coded). Tooltip with details. Suggest fixes on poor quality.
          </li>
          <li>
            <strong>Handle layout changes smoothly:</strong> Animate on participant join/leave. Maintain aspect ratio. Active speaker transition smooth (not jarring).
          </li>
          <li>
            <strong>Support keyboard shortcuts:</strong> Mute (M/Space), video toggle (V), end call (Escape). Show shortcuts in tooltip. Power user feature.
          </li>
          <li>
            <strong>Optimize for mobile:</strong> Thumb-friendly controls. Landscape mode for group calls. Picture-in-picture for multitasking.
          </li>
          <li>
            <strong>Handle errors gracefully:</strong> Call failed: show reason, offer retry. Network lost: show reconnecting, auto-retry. Permission denied: explain, offer settings.
          </li>
          <li>
            <strong>Provide call summary:</strong> After call: show duration, participants. Offer feedback. Log analytics.
          </li>
          <li>
            <strong>Support accessibility:</strong> Screen reader labels, keyboard navigation, high contrast. Captions for hearing impaired.
          </li>
          <li>
            <strong>Test on various networks:</strong> WiFi, 4G, 3G, poor networks. Test reconnection. Test quality adaptation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No permission handling:</strong> App crashes on permission denial. Solution: Graceful fallback to audio-only, explain why needed.
          </li>
          <li>
            <strong>Controls always visible:</strong> Obscures video. Solution: Auto-hide after inactivity, tap to show.
          </li>
          <li>
            <strong>No quality feedback:</strong> Users don't know why call is choppy. Solution: Show network quality, suggest fixes.
          </li>
          <li>
            <strong>Jarring layout changes:</strong> Participant join/leave causes layout jump. Solution: Smooth animations, maintain positions.
          </li>
          <li>
            <strong>No reconnection logic:</strong> Network blip ends call. Solution: Auto-reconnect, show "Reconnecting..." state.
          </li>
          <li>
            <strong>Audio issues:</strong> Echo, no sound. Solution: Echo cancellation, speaker selection, audio troubleshooting guide.
          </li>
          <li>
            <strong>Mobile not optimized:</strong> Desktop UI on mobile. Solution: Responsive design, thumb-friendly controls, landscape mode.
          </li>
          <li>
            <strong>No accessibility:</strong> Keyboard-only users can't navigate. Solution: Full keyboard support, screen reader labels.
          </li>
          <li>
            <strong>Screen share security:</strong> Notifications visible during share. Solution: Blur notifications, window share option.
          </li>
          <li>
            <strong>No call summary:</strong> Call ends abruptly. Solution: Show duration, participants, offer feedback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>FaceTime</h3>
        <p>
          Apple's FaceTime: 1:1 and group calls (up to 32). Grid view with active speaker highlight. Portrait/landscape support. Screen share (iOS 15+). SharePlay for synchronized viewing. End-to-end encrypted.
        </p>

        <h3 className="mt-6">Zoom</h3>
        <p>
          Zoom: Large group calls (100-1000 participants). Gallery view (49 participants), speaker view. Screen share with annotation. Virtual backgrounds. Recording, transcription. Breakout rooms.
        </p>

        <h3 className="mt-6">Google Meet</h3>
        <p>
          Google Meet: Browser-based, no install. Auto-layout for N participants. Live captions. Screen share, present now (window/tab/screen). Integration with Google Calendar. Noise cancellation.
        </p>

        <h3 className="mt-6">Discord</h3>
        <p>
          Discord: Voice channels (always-on), video calls. Screen share (Go Live). Low latency for gaming. Overlay for in-game calls. Server-based organization.
        </p>

        <h3 className="mt-6">WhatsApp Calls</h3>
        <p>
          WhatsApp: 1:1 and group calls (up to 8). Simple UI (mute, video, end). Switch camera. Speaker toggle. Works on poor networks. End-to-end encrypted.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle video layout for N participants?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Grid layout with dynamic columns: 1 participant (full), 2 (side-by-side), 3-4 (2x2), 5-9 (3x3), 9-16 (4x4). Max visible 16, overflow in pagination. Active speaker highlighted (border, slightly larger). Smooth animations on join/leave using FLIP technique.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement screen sharing?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Browser: getDisplayMedia API, select window/screen/tab. Desktop: Electron desktopCapturer. Show preview before sharing. Green indicator during share. Handle permission denied. Stop on call end. Security: blur notifications, offer window share vs full screen.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle poor network quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Monitor bandwidth, packet loss, latency. Auto-downgrade video quality (1080p → 720p → 480p → audio-only). Show quality indicator with suggestions ("Move closer to WiFi"). Reconnection logic with exponential backoff. Fallback to TURN server if P2P fails.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement mute/unmute?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Toggle audio track enabled property. Update icon (mic/mic-off). Visual indicator (red slash when muted). Keyboard shortcut (M or Space). Sync state to other participants via data channel. Optimistic update (show immediately).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle incoming calls?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Push notification for background calls. Full-screen takeover (mobile) or modal (desktop). Show caller info, answer/decline buttons. Play ringtone. Timeout after 30-60 seconds (auto-decline). Handle multiple incoming calls (queue or busy signal).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize for large group calls?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Virtual scrolling for 50+ participants (render only visible). Audio-only mode for bandwidth. Server-side mixing (SFU) instead of P2P. Active speaker detection, highlight only. Pagination for participant list. Reduce video quality for non-active speakers.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — WebRTC API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Screen Capture API
            </a>
          </li>
          <li>
            <a
              href="https://webrtc.org/getting-started/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebRTC.org — Getting Started
            </a>
          </li>
          <li>
            <a
              href="https://zoom.us"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zoom — Video Conferencing Platform
            </a>
          </li>
          <li>
            <a
              href="https://meet.google.com"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Meet — Browser-Based Video Calls
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/video-conferencing-usability/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Video Conferencing Usability
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-video-conferencing-frontend",
  title: "Design a Video Conferencing Frontend (Zoom/Google Meet Style)",
  description:
    "Architecture for a browser-based video conferencing client: WebRTC mesh vs SFU, media negotiation, adaptive quality, layout management, and resilience under poor network conditions.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "video-conferencing-frontend",
  wordCount: 5600,
  readingTime: 34,
  lastUpdated: "2026-05-10",
  tags: ["hld", "video-conferencing", "WebRTC", "SFU", "adaptive-bitrate", "media"],
  relatedTopics: ["real-time-collaborative-whiteboard", "presence-system"],
};

export default function VideoConferencingFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A browser-based video conferencing system must solve one of the hardest real-time communication problems: delivering low-latency, high-quality audio and video between multiple participants while adapting to wildly heterogeneous network conditions, device capabilities, and participant counts. A two-person call has very different technical requirements than a 50-person all-hands meeting, and a user on fiber has very different constraints than a user on a congested mobile 4G connection. The frontend must handle all of these conditions gracefully, ideally without the user ever needing to troubleshoot their video quality.</p>
        <p>WebRTC (Web Real-Time Communication) is the browser API that enables peer-to-peer audio/video streaming without plugins. Understanding WebRTC's architecture—ICE (Interactive Connectivity Establishment), STUN/TURN servers for NAT traversal, SDP (Session Description Protocol) for capability negotiation, RTP for media delivery—is essential for designing a production video conferencing system. The choice between a peer-to-peer mesh architecture and a server-mediated SFU (Selective Forwarding Unit) architecture is the most consequential architectural decision for a multi-participant call.</p>
        <p><strong>Explicit assumptions:</strong> Browser-only clients (no native app in scope). Maximum 50 participants per call. Audio is always transmitted (unless explicitly muted); video is simulcast at multiple quality levels. The architecture uses an SFU (not a peer-to-peer mesh) for calls with more than 2 participants. Screen sharing is supported (a separate media stream from the camera stream). The signaling server uses WebSocket for SDP and ICE candidate exchange.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Audio/video calling:</strong> Real-time audio and video between 2–50 participants. Camera and microphone access via browser MediaDevices API.</li>
          <li><strong>Screen sharing:</strong> Share the entire screen, a window, or a browser tab. Screen share stream is separate from camera stream.</li>
          <li><strong>Mute/unmute and camera on/off:</strong> Instant local control. Visual indicator shown to all participants when a user is muted or camera-off.</li>
          <li><strong>Layout management:</strong> Gallery view (grid of participant tiles), speaker view (large active speaker with thumbnails), and spotlight mode (presenter-pinned). Layout adapts to participant count.</li>
          <li><strong>Active speaker detection:</strong> Automatically highlight the participant who is currently speaking. Transition smoothly as the active speaker changes.</li>
          <li><strong>Chat, reactions, and raise hand:</strong> In-call text chat, emoji reactions, and raise-hand queue.</li>
          <li><strong>Waiting room and admit/deny:</strong> Participants wait in a lobby before being admitted by the host.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Audio latency:</strong> End-to-end audio delay under 150ms for natural conversation. Video latency under 500ms is acceptable.</li>
          <li><strong>Quality degradation:</strong> Under poor network (packet loss &gt; 5%, bandwidth &lt; 500kbps), the system must reduce video quality rather than freeze or disconnect.</li>
          <li><strong>Join time:</strong> A participant should see and hear other participants within 3 seconds of clicking "Join."</li>
          <li><strong>Reliability:</strong> Brief network interruptions (under 3 seconds) are recovered automatically without the user needing to rejoin.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The architecture uses a Selective Forwarding Unit (SFU) for all calls with more than 2 participants. In an SFU architecture, each participant sends their media streams to the SFU server, and the SFU selectively forwards each participant's streams to every other participant. The SFU does not decode or re-encode media (that would be an MCU—Media Control Unit, which is more expensive and higher-latency); it simply routes RTP packets. Each participant maintains one WebRTC connection to the SFU (one connection per participant would be a mesh architecture, which does not scale beyond 4–5 participants due to exponential upload bandwidth growth).</p>
        <p>The signaling server handles the WebRTC handshake (SDP offer/answer exchange, ICE candidate sharing) via WebSocket. The SFU handles media routing. A presence and control API handles non-media events: mute status, camera status, raise hand, chat messages, waiting room management. These are logically separate services, though they may share infrastructure.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/video-conferencing-frontend-architecture.svg"
          alt="Video conferencing architecture showing SFU topology (each client sends one uplink to SFU, SFU forwards to all others), signaling server (WebSocket SDP/ICE exchange), STUN/TURN for NAT traversal, simulcast layers (high/medium/low quality), active speaker detection pipeline, screen share as separate stream, and waiting room admit flow."
          caption="Video conferencing architecture: SFU-based media routing, signaling server, simulcast quality layers, and active speaker detection"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">WebRTC Connection Setup</h3>
        <p>The WebRTC connection lifecycle begins with media acquisition (getUserMedia for camera/microphone), followed by RTCPeerConnection creation, SDP offer/answer exchange (negotiating codecs, resolution, and bitrate capabilities), and ICE candidate gathering and exchange (determining the network path between client and SFU). This process takes 1–3 seconds on a typical connection; during this time the participant sees a "Connecting..." state.</p>
        <p>ICE (Interactive Connectivity Establishment) determines the best network path using a priority list of candidate types: host candidates (direct local network address, fastest if both endpoints are on the same network), server-reflexive candidates (via STUN: the public IP/port as seen by the STUN server, works for most NAT configurations), and relayed candidates (via TURN: all media routed through a TURN server, works for symmetric NAT and corporate firewalls). The ICE agent tries all candidate pairs and selects the highest-priority pair that succeeds. A TURN server fallback is critical for enterprise users behind restrictive firewalls; without it, approximately 10–20% of corporate users cannot establish direct connections. TURN relaying adds 50–100ms of additional latency.</p>
        <p>SDP negotiation establishes the codec parameters. For video, the preferred codec is VP9 (better compression than VP8, supported by Chrome and Firefox) with H.264 as fallback (required for Safari). For audio, Opus is universal (all modern browsers support it) with superior compression and quality over older codecs. The SDP offer from the client lists all supported codecs in priority order; the SFU responds with its preferred subset. Renegotiation (restarting ICE or changing codec parameters mid-call) is used when the network conditions change significantly or when the user starts screen sharing.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Simulcast and Adaptive Quality</h3>
        <p>Simulcast is the technique of encoding the camera stream at multiple quality levels (spatial layers) simultaneously and sending all layers to the SFU. The SFU then forwards only the appropriate layer to each subscriber based on their available bandwidth. A typical simulcast configuration: high (1280×720, 1.5Mbps), medium (640×360, 500kbps), low (320×180, 150kbps). A subscriber on a fast connection receives the high layer; a subscriber on a slow connection receives the low layer. The encoder does this simultaneously, so the quality switch for individual subscribers is instant (no encoding delay when switching layers).</p>
        <p>The SFU's layer selection logic is driven by subscriber bandwidth estimation: the SFU receives RTCP feedback (Receiver Estimated Maximum Bitrate, REMB, or Transport-wide Congestion Control, TWCC) from each subscriber's client, reporting the subscriber's estimated available bandwidth. When a subscriber's bandwidth drops below the threshold for the current layer (e.g., available bandwidth drops below 500kbps for the medium layer), the SFU switches the subscriber to the low layer. The switch is performed at a keyframe boundary (to avoid showing corrupted video during the transition). The client's video element continues playing uninterrupted; it simply receives lower-resolution frames.</p>
        <p>Bandwidth estimation uses the Google Congestion Control (GCC) algorithm, which is built into Chrome's WebRTC implementation. GCC combines REMB (receiver-estimated bitrate based on inter-packet delays and packet loss) with probing (sending additional packets to test available bandwidth). The encoder's target bitrate is adjusted based on GCC's output, providing a feedback loop that adapts the encoding bitrate to the network conditions within 2–5 seconds of a bandwidth change.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Active Speaker Detection</h3>
        <p>Active speaker detection identifies who is currently speaking and highlights their video tile (or switches it to the large position in speaker view layout). WebRTC provides the RTCPeerConnection.getStats() API, which includes audio level information for each audio track. The client polls getStats() every 500ms and computes a smoothed audio level per participant. A participant is classified as "speaking" when their smoothed audio level exceeds a threshold (e.g., -50dBFS) for at least 500ms continuously. Short sounds (coughs, background noise) do not trigger the "speaking" state.</p>
        <p>The speaking state is also used for layout decisions: in speaker view, the largest tile shows the most recent "speaking" participant. Speaker transitions are smoothed (there is a debounce: the speaker does not change if the new candidate has been speaking for less than 1000ms, preventing rapid layout shifts when two people speak simultaneously). The "speaking" indicator (a green ring around the video tile) has a faster update rate (200ms) than the layout switch (1000ms debounce) so the user sees immediate audio level feedback without layout thrashing.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Layout Management</h3>
        <p>Gallery view (grid layout) dynamically adjusts the grid configuration based on participant count: 2 participants use a side-by-side 2-column layout; 3–4 use a 2×2 grid; 5–9 use a 3×3 grid; 10–25 use a 5×5 grid (with pagination for the remainder); 25+ paginate with a fixed grid size per page. Each tile's aspect ratio is fixed (16:9 for video, with letterboxing for portrait mobile video). The grid reflows when participants join, leave, or turn their cameras on or off (a camera-off participant shows a placeholder with their name and avatar).</p>
        <p>The layout computation must be CSS-based (not JavaScript-calculated positions) to avoid JavaScript-driven layout at 60fps. CSS Grid with auto-fill and minmax provides responsive grid reflow without JavaScript: grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) adapts the column count to the available container width automatically. Individual tile sizing and aspect ratio are enforced via CSS aspect-ratio and object-fit: cover on the video element.</p>
        <p>Video tiles for participants with cameras off should not hold open the video element with an active MediaStream (which would consume decoding resources for a black frame). Camera-off tiles are rendered as static DOM elements (name + avatar), and the MediaStream for that participant's video track is unsubscribed from the SFU subscription. When the participant turns their camera back on, the SFU subscription is resumed, and the video element is reactivated. This subscription management is a key optimization for large calls: a 50-person call where 40 people have cameras off should not be consuming decoding resources for 40 inactive video streams.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Reconnection and Network Resilience</h3>
        <p>Brief network interruptions (mobile user briefly in a tunnel, WiFi hiccup) should be recovered automatically without the user rejoining. The RTCPeerConnection ICE connection state transitions through disconnected → failed if packets stop flowing. The recovery strategy: on disconnected state, wait up to 5 seconds for automatic ICE restart (WebRTC's built-in reconnection). If the state transitions to failed (the full 5 seconds elapsed without recovery), the client initiates an explicit ICE restart: it sends a new SDP offer to the signaling server with the iceRestart flag set, triggering a fresh ICE candidate gathering and selection cycle. This usually reconnects within 1–3 seconds.</p>
        <p>During reconnection, the participant's video tile shows a "Reconnecting..." overlay to other participants (signaled via a WebSocket presence event: the signaling server notifies all participants when a user's connection state changes). Audio is prioritized over video during degraded conditions: if bandwidth drops severely, the SFU sends only the audio layer and drops the video stream entirely. Audio-only mode consumes approximately 30–60kbps per participant (Opus at 48kHz) and can sustain a call on connections as poor as 100kbps with acceptable quality.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Screen Sharing</h3>
        <p>Screen sharing uses the getDisplayMedia() API to capture the user's screen, window, or tab as a MediaStream. This stream is a separate video track sent to the SFU alongside (or instead of) the camera track. Screen share content benefits from different encoding parameters than camera video: screen content (slides, code, documents) has large uniform regions and sharp text, which compresses better with higher keyframe frequency and content-adaptive encoding. Chrome's getDisplayMedia() enables screen content hints (cursor: always, displaySurface: monitor/window/browser) that the browser uses to optimize encoding for the content type.</p>
        <p>The SFU handles the screen share stream as a separate subscription: participants can subscribe to the screen share independently of the camera feeds. In screen share mode, the UI layout switches to a "presentation" layout: the screen share is displayed at full size, with participant video tiles arranged as small thumbnails along the side or bottom. The layout transition is triggered by the sharing participant sending a "screen share started" control event via the WebSocket channel; all participants' UIs switch to presentation layout simultaneously.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/video-conferencing-frontend-qoe.svg"
          alt="Video conferencing quality of experience showing simulcast layer switching (REMB feedback → SFU layer selection → keyframe-aligned switch), active speaker detection pipeline (WebRTC getStats audio level → smoothed threshold → layout switch with debounce), ICE reconnection flow (disconnected → 5s wait → ICE restart → new candidates), and bandwidth estimation via GCC feedback loop."
          caption="Video conferencing QoE: simulcast adaptive quality, active speaker detection, ICE reconnection, and GCC bandwidth estimation"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>SFU versus MCU versus peer-to-peer mesh: a peer-to-peer mesh (each participant sends to every other participant directly) works well for 2–3 participants but upload bandwidth grows as O(N-1) per participant—a 10-person mesh requires each participant to upload 9 video streams, which is infeasible on most consumer connections. An MCU (Multipoint Control Unit) decodes all streams, mixes them into a single composite video, and sends one stream to each participant. This minimizes subscriber bandwidth (each participant receives only one composite stream) but requires server-side decoding and encoding (expensive, high latency) and loses individual video tiles (everyone sees the same composed view). An SFU is the correct choice for browser-based conferencing: it routes packets without decoding (low CPU cost per connection), allows each client to receive individual streams (flexible layout on the client), and scales to 50+ participants with per-subscriber simulcast layer selection.</p>
        <p>Audio processing challenges: echo cancellation, noise suppression, and automatic gain control (AGC) are critical for call quality. WebRTC's built-in audio processing pipeline (WebRTC AEC, NS, AGC) handles these automatically when getUserMedia is called with audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }. The built-in processing is adequate for most use cases; professional use cases (broadcast, music) may require disabling automatic processing and applying custom AudioWorklet-based processing. Background noise suppression models (running in a Web Worker via AudioWorklet) can significantly improve call quality in noisy environments and are worth the CPU cost for professional use cases.</p>
        <p>End-to-end encryption: standard WebRTC provides transport-level encryption (DTLS-SRTP encrypts all media in transit). However, the SFU can theoretically decrypt and inspect media (it processes RTP packets). True end-to-end encryption (where the SFU cannot decrypt) requires Insertable Streams (a newer WebRTC API that allows JavaScript to transform encoded frames before sending and after receiving, enabling custom encryption). Insertable Streams-based E2EE is used by Zoom (for E2EE calls), and is the technically correct approach for privacy-sensitive use cases, at the cost of added complexity and the inability to use server-side audio processing (which requires decryption).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A browser-based video conferencing frontend uses WebRTC with an SFU topology: each participant maintains one WebRTC connection to the SFU, which selectively forwards media to all other participants. ICE/STUN/TURN handle NAT traversal; TURN fallback serves corporate users behind restrictive firewalls. Simulcast (three quality layers encoded simultaneously) combined with per-subscriber bandwidth estimation (REMB/TWCC) enables the SFU to deliver appropriate quality to each subscriber independently. Active speaker detection uses RTCPeerConnection.getStats() audio levels with smoothing and debounce to drive layout transitions. Screen sharing uses getDisplayMedia() as a separate stream routed via the same SFU. Reconnection uses ICE restart (5-second timeout before explicit SFU renegotiation). Audio-only fallback preserves call continuity on very poor connections. Camera-off tiles unsubscribe from the SFU to avoid decoding inactive streams. The defining architectural choice—SFU over MCU or mesh—is driven by the need to scale to 50+ participants while maintaining flexible per-client layouts and avoiding server-side media decoding cost.</p>
      </section>
    </ArticleLayout>
  );
}

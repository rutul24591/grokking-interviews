"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-music-audio-streaming-frontend",
  title: "Design a Music/Audio Streaming Frontend",
  description:
    "Architecture for a music streaming client: adaptive bitrate audio, gapless playback, offline caching, queue management, cross-device continuity, and DRM integration.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "music-audio-streaming-frontend",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "audio-streaming", "music", "gapless-playback", "offline", "DRM", "MSE"],
  relatedTopics: ["social-media-stories-reels-feature"],
};

export default function MusicAudioStreamingFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A music streaming frontend is distinguished from general media playback by three requirements that do not apply to video-on-demand: gapless playback (the end of one track must transition imperceptibly to the beginning of the next, with no audible gap or click), offline playback (users download tracks for playback without network connectivity), and cross-device continuity (pausing on a phone and resuming on a laptop should continue from the exact same position, mid-track). Each of these requirements has significant architectural implications that do not exist in simpler media players.</p>
        <p>The quality of experience is measurable: Spotify's quality engineering team has published that a 100ms increase in time-to-first-sound reduces session engagement, and that buffer underruns (playback interruptions due to insufficient buffering) are the primary driver of premium subscription churn. The frontend's job is to make the network conditions invisible to the user: aggressive pre-buffering of the next track, adaptive bitrate selection based on available bandwidth, and intelligent offline caching make the difference between an application that "works" and one that users love.</p>
        <p><strong>Explicit assumptions:</strong> Audio content is licensed and DRM-protected (Widevine/FairPlay). Audio formats available: Ogg Vorbis (128kbps and 320kbps for free and premium), AAC (128kbps and 256kbps for free and premium), and lossless FLAC for hi-fi tier. The streaming infrastructure delivers audio as a series of DASH segments (Dynamic Adaptive Streaming over HTTP). The web frontend uses the Media Source Extensions API (MSE) for adaptive streaming. Offline caching uses the Cache API (Service Worker) and IndexedDB for metadata.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Adaptive bitrate playback:</strong> Switch between quality levels (128kbps, 320kbps, lossless) based on available network bandwidth. Quality switches should not interrupt playback.</li>
          <li><strong>Gapless playback:</strong> No audible gap or silence between consecutive tracks in a playlist or album. The transition must be seamless.</li>
          <li><strong>Queue management:</strong> A play queue with current track, upcoming tracks, and history. Users can add to queue, reorder, and clear. Queue state persists across page refreshes.</li>
          <li><strong>Offline playback:</strong> Premium users can download tracks for offline playback. Downloads manage storage quota, allow selective download (specific playlists), and prevent unauthorized copying (DRM for offline files).</li>
          <li><strong>Cross-device playback state:</strong> Play/pause/skip actions on one device are reflected on other active devices. Resuming on a new device continues from the current position.</li>
          <li><strong>Lyrics synchronization:</strong> Time-synced lyrics displayed in real-time as the track plays, scrolling to keep the current line visible.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Time to first sound:</strong> Playback starts within 1 second of the user clicking play on a mobile 4G connection.</li>
          <li><strong>Buffer target:</strong> Maintain 15–30 seconds of audio buffered ahead of the playback position to absorb network jitter.</li>
          <li><strong>Battery efficiency:</strong> Audio decoding and network fetching must be optimized for battery life on mobile. Background playback must not wake the screen unnecessarily.</li>
          <li><strong>DRM compliance:</strong> Protected content must not be extractable from memory or storage in unencrypted form. The CDM (Content Decryption Module) handles decryption in a trusted execution environment.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The audio streaming architecture centers on the browser's Media Source Extensions API, which allows JavaScript to programmatically feed audio data to an HTMLAudioElement. MSE enables adaptive bitrate switching (the application controls which segment quality is fetched next) and gapless playback (the application can append segments from the next track to the same buffer before the current track ends, eliminating the gap). The audio pipeline: the application fetches DASH manifest (an XML file listing all available segments and quality levels), selects the appropriate quality based on bandwidth estimation, fetches audio segments, decrypts them via the Encrypted Media Extensions API (EME), and appends them to the MSE SourceBuffer.</p>
        <p>The playback controller manages the playback queue, segment fetching, bandwidth adaptation, and cross-device state synchronization. It is separate from the UI layer: the playback controller is a background service (or a Web Worker) that continues operating even when the user navigates between pages of the application. The UI registers listeners on the controller to update progress bars, track information displays, and queue views.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/music-audio-streaming-frontend-architecture.svg"
          alt="Music streaming frontend architecture showing audio pipeline (DASH manifest fetch → segment fetch → EME decryption → MSE SourceBuffer append → HTMLAudioElement), playback controller (bandwidth estimator, adaptive bitrate selector, gapless pre-buffer for next track), queue manager, cross-device state sync via WebSocket, offline download manager (Service Worker + IndexedDB), and Media Session API for OS media controls."
          caption="Music streaming architecture: DASH + MSE + EME pipeline, gapless pre-buffering, adaptive bitrate, offline Service Worker, and cross-device WebSocket sync"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">DASH Streaming and Adaptive Bitrate</h3>
        <p>Each track's DASH manifest lists the available Representations (quality levels) with their bitrates, codec information, and URLs. Each Representation consists of an initialization segment (containing codec configuration data, required before any audio segment can be decoded) and a series of media segments (typically 2–5 seconds each). The application selects a Representation based on the estimated available bandwidth, with hysteresis to prevent rapid quality oscillation: switch up only when measured bandwidth exceeds the next quality's bitrate by 1.5×, switch down when bandwidth drops below the current quality's bitrate by 0.8×.</p>
        <p>Bandwidth estimation uses the download speed of recent segment fetches: segment_size (bytes) / download_time (seconds). An exponential weighted moving average smooths the estimate (new_estimate = 0.3 × measured_speed + 0.7 × previous_estimate). The first segment fetch uses a conservative initial quality (128kbps) to minimize time-to-first-sound; subsequent fetches can upgrade quality if bandwidth allows. This matches the Spotify approach: start fast (lower quality), upgrade transparently during playback.</p>
        <p>Quality switches during playback are transparent: when switching from 128kbps to 320kbps mid-track, the application fetches the initialization segment for the 320kbps Representation, appends it to the SourceBuffer alongside the new media segment, and MSE seamlessly transitions to the higher quality without a gap. The switch point is aligned to a segment boundary (a clean decode point) to avoid decoding artifacts at the transition.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Gapless Playback Implementation</h3>
        <p>Gapless playback requires that the audio SourceBuffer contains contiguous audio data spanning the end of the current track and the beginning of the next track, with no gap in the timestamp sequence. The application begins fetching the next track's segments when the current track's playback position reaches T-15s (15 seconds from the end). The next track's initialization segment and first several media segments are appended to the same SourceBuffer, with timestamps continuing from where the current track's last segment ended. This creates a single, unbroken audio stream in the SourceBuffer that spans the track boundary; the HTMLAudioElement plays through the boundary without interruption.</p>
        <p>The gap between tracks in the source audio files (the natural silence at the start and end of audio recordings, typically 50–200ms) must be removed for gapless playback. The track metadata from the streaming service includes gapless metadata: iTunSMPB tags (for AAC/MP4) or ReplayGain pre/post silence padding values. These values specify how many audio samples to skip at the start and end of each track file, eliminating the recording silence. The MSE SourceBuffer's appendWindowStart and appendWindowEnd properties implement this trimming: the application sets these to exclude the silence samples before appending the first/last segments.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Offline Playback Architecture</h3>
        <p>Offline playback downloads and stores DRM-encrypted audio segments in the Cache API (managed by a Service Worker), with track metadata (title, artist, album art URL, segment manifest) stored in IndexedDB. The download manager queues download jobs per track, manages download priorities (download currently playing album first, then the next in the user's downloads list), and tracks per-track download progress. Each track's segments are downloaded sequentially; if a download is interrupted (app backgrounded, network lost), it resumes from the last successfully downloaded segment on next opportunity.</p>
        <p>DRM for offline content: the CDM (Content Decryption Module, provided by the browser) issues a persistent license for each downloaded track. A persistent license is stored on the device (in the CDM's secure storage, not accessible to JavaScript) and allows offline decryption for a configured license duration (typically 30 days for most streaming services). The persistent license request is made to the DRM license server when the download begins; subsequent offline playback uses the cached license. This means offline playback requires that the user was online at the time of download (to obtain the license) but does not require connectivity during playback.</p>
        <p>Storage quota management: the browser's storage API provides a quota estimate per origin, typically 50–80% of available device storage. The download manager enforces a per-user download quota (e.g., 10GB or 10,000 tracks, whichever is lower) and shows a storage usage indicator in the downloads UI. When the quota is exceeded, new downloads are rejected with a "Storage full. Delete some downloads to free space" message. The oldest downloaded tracks are candidates for auto-eviction (only when the user explicitly enables auto-eviction in settings—silent deletion of downloaded content the user expected to have available offline is a severe UX failure).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cross-Device Playback State</h3>
        <p>Cross-device state synchronization uses a persistent playback session stored on the server. The session record contains: userId, currentTrackId, positionMs (current playback position in milliseconds), queueState (ordered list of trackIds), repeatMode, shuffleMode, volumeLevel, and updatedAt. When the user pauses on their phone, the client sends a state update to the Playback Session API. When they open the app on their laptop, the laptop client fetches the latest session state on mount and displays "Continue where you left off: [Track Name] – 2:34."</p>
        <p>Real-time sync across simultaneously active devices (user is playing on laptop and opens the app on phone, wants to transfer playback) uses WebSocket. The Playback Session Service broadcasts state changes to all connected devices in the same session. The phone receives the play/pause/skip event within 500ms and updates its UI to reflect the current state. The user can explicitly "transfer playback" to the current device, which causes the phone to take over as the active player and the laptop player to pause. This is the Spotify Connect pattern: one canonical active player, others are passive remote controls.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Media Session API and OS Integration</h3>
        <p>The Media Session API allows the web application to integrate with the operating system's media controls: lock screen media controls on mobile, hardware media keys on desktop (play/pause/next/previous keys on keyboards), and the macOS Touch Bar. The application registers media session action handlers (play, pause, seekto, previoustrack, nexttrack) and updates the Media Session metadata (title, artist, album, artwork image URL) when the track changes. The OS media controls reflect this metadata, displaying the current track in the system-level "now playing" view without the user needing to switch to the browser tab.</p>
        <p>Background audio playback on mobile requires that the audio context remains active when the browser tab is backgrounded. The MediaSession API's setActionHandler is the mechanism for maintaining this: registering handlers signals to the browser that this page is an audio player and should receive background media capabilities. Without this, aggressive mobile browsers (Safari on iOS, some Android browsers) may pause audio playback when the tab goes to the background, a critical failure for a music streaming application.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/music-audio-streaming-frontend-qoe.svg"
          alt="Music streaming quality of experience metrics showing time-to-first-sound optimization (128kbps initial, adaptive upgrade), buffer health monitoring (15-30s target ahead of playback position), gapless transition success rate, rebuffering ratio, adaptive bitrate quality level distribution over session, offline download progress and license persistence, and cross-device sync latency"
          caption="Audio streaming QoE: time-to-first-sound, buffer health, gapless success, rebuffering ratio, adaptive quality distribution, and offline license management"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>MSE versus native HTMLAudioElement src: the simplest audio streaming implementation sets HTMLAudioElement.src to the audio file URL and lets the browser handle buffering. This works for progressive download but provides no control over adaptive bitrate or gapless playback. MSE adds significant complexity (segment management, SourceBuffer manipulation, initialization segment handling) but enables the quality of experience features (gapless playback, adaptive bitrate) that differentiate premium streaming services. For simple podcast or audiobook players where gapless playback and adaptive bitrate are not required, the native HTMLAudioElement src approach is sufficient.</p>
        <p>Pre-buffering strategy for gapless: buffering 15 seconds ahead of the playback position provides buffer headroom for network jitter but doubles the data transfer compared to just-in-time buffering. For users on mobile data plans, this additional buffering costs real money. Spotify and Apple Music offer "data saver" modes that reduce pre-buffering and quality to minimize data consumption. The pre-buffer duration should be configurable and respect the user's data saving preferences.</p>
        <p>DRM complexity: EME/CDM implementation varies significantly across browsers and platforms. Safari requires FairPlay DRM (Apple's proprietary CDM), which has a different implementation model than Widevine (used by Chrome, Firefox, Edge). Supporting all platforms requires implementing both DRM systems. The segment delivery and key acquisition flows are similar but the specific APIs differ, requiring platform detection and separate code paths. This is the primary reason music streaming services often prefer native apps (which have unified DRM APIs per platform) over web-only implementations for DRM-protected premium content.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A music streaming frontend's defining technical challenge is audio quality of experience: sub-1-second time to first sound, gapless track transitions, and resilient playback under variable network conditions. The audio pipeline uses DASH (Dynamic Adaptive Streaming over HTTP) with Media Source Extensions for programmatic segment delivery, enabling adaptive bitrate selection (bandwidth estimation via EWMA, quality hysteresis to prevent oscillation) and gapless playback (pre-buffering the next track's segments into the same SourceBuffer, using gapless metadata to trim silence from track boundaries). Offline playback uses the Cache API for encrypted segment storage with persistent DRM licenses from the CDM. Cross-device state sync uses a server-side playback session record with WebSocket real-time broadcast. The Media Session API integrates with OS media controls and enables background audio playback on mobile. The system's most critical failure mode is a rebuffering event (playback pause due to exhausted buffer), which the pre-buffering strategy, adaptive bitrate downgrade, and stall recovery logic must prevent.</p>
      </section>
    </ArticleLayout>
  );
}

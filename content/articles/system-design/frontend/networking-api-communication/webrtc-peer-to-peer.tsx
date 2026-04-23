"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-webrtc-peer-to-peer",
  title: "WebRTC for Peer-to-Peer",
  description:
    "Comprehensive guide to WebRTC covering peer-to-peer architecture, signaling, STUN/TURN servers, NAT traversal, data channels, media streams, and building real-time communication applications.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "webrtc-peer-to-peer",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "webrtc",
    "peer-to-peer",
    "rtcpeerconnection",
    "signaling",
    "nat-traversal",
    "data-channels",
  ],
  relatedTopics: [
    "websockets",
    "server-sent-events",
    "media-processing",
    "real-time-features",
  ],
};

export default function WebRtcPeerToPeerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="important">
          <strong>WebRTC (Web Real-Time Communication)</strong> is a collection
          of protocols, APIs, and standards that enable real-time communication
          directly between browsers and devices without requiring a central
          server to relay data. Standardized by the W3C and IETF (RFC 8825-8831,
          2021), WebRTC provides three core capabilities:{" "}
          <strong>RTCPeerConnection</strong> for audio/video calls,{" "}
          <strong>RTCDataChannel</strong> for arbitrary data transfer, and{" "}
          <strong>MediaStream</strong> for capturing camera/microphone input.
          The key innovation of WebRTC is peer-to-peer (P2P) communication:
          once a connection is established, data flows directly between peers,
          reducing latency, eliminating server bandwidth costs, and enabling
          decentralized architectures.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          WebRTC was initially developed by Google (acquired from Global IP
          Solutions in 2010) and open-sourced in 2011. It became a W3C
          recommendation in 2018 and is now supported in all major browsers
          (Chrome, Firefox, Safari, Edge) and mobile platforms (iOS via WKWebView,
          Android via WebView). WebRTC powers applications like Google Meet,
          Discord voice channels, WhatsApp Web calls, and peer-to-peer file
          sharing tools. The protocol stack includes SRTP (Secure Real-time
          Transport Protocol) for encrypted media, SCTP (Stream Control
          Transmission Protocol) for data channels, and ICE (Interactive
          Connectivity Establishment) for NAT traversal.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          At a staff or principal engineer level, understanding WebRTC requires
          grasping the distinction between the signaling phase (establishing the
          P2P connection) and the media/data phase (actual communication).
          Signaling is intentionally not standardized -- applications can use
          WebSockets, HTTP polling, or any mechanism to exchange SDP (Session
          Description Protocol) offers/answers and ICE candidates. Once peers
          exchange this metadata, the RTCPeerConnection handles the rest: NAT
          traversal via STUN/TURN servers, encryption via DTLS, and media
          transport via SRTP. This separation gives developers flexibility in
          signaling while ensuring interoperable media transport.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The business case for WebRTC is compelling for real-time
          applications. Server-relayed communication (e.g., WebSocket-based
          video) requires significant server bandwidth and introduces latency
          (data must traverse client → server → client). WebRTC eliminates this
          middleman: once connected, peers communicate directly. For a video
          conferencing app with 100 participants, a mesh of P2P connections
          reduces server costs by orders of magnitude compared to an MCU
          (Multipoint Control Unit) architecture. However, WebRTC introduces
          complexity: NAT traversal fails in 10-20% of cases (requiring TURN
          relays), firewall restrictions may block P2P, and mobile networks may
          terminate idle connections. Understanding these trade-offs is critical
          for architecture decisions.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="important">
          WebRTC is built on six foundational concepts that govern how
          peer-to-peer connections are established and maintained:
        </HighlightBlock>
        <ul>
          <HighlightBlock as="li" tier="crucial">
            <strong>RTCPeerConnection:</strong> The core WebRTC API that
            represents a P2P connection between two peers. It handles:
            negotiating capabilities via SDP (Session Description Protocol),
            discovering network paths via ICE (Interactive Connectivity
            Establishment), encrypting data via DTLS (Datagram Transport Layer
            Security), and transporting media via SRTP. The connection lifecycle
            is: create peer connection, generate SDP offer/answer, exchange ICE
            candidates, wait for ICE gathering to complete, and transition to
            "connected" state. RTCPeerConnection manages the underlying UDP
            sockets, retransmissions, congestion control, and quality adaptation
            automatically.
          </HighlightBlock>
          <li>
            <strong>SDP (Session Description Protocol):</strong> A text-based
            format for describing multimedia session capabilities. SDP includes:
            media types (audio, video, data), codecs supported (H.264, VP8,
            Opus), network addresses (IP, port), and session metadata (session
            name, bandwidth). In WebRTC, SDP is exchanged as offers and answers:
            Peer A creates an offer (I support H.264, VP8, Opus; my IP is
            X.X.X.X), sends it to Peer B via signaling; Peer B creates an answer
            (I support H.264, Opus; my IP is Y.Y.Y.Y), sends it back. Both peers
            now know each other's capabilities and can establish a connection.
            SDP is opaque to applications -- developers treat it as a blob to
            transmit, not parse.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>ICE Candidates:</strong> Network addresses that a peer can
            receive data on. A peer typically has multiple candidates: host
            candidates (local IP addresses), server-reflexive candidates (public
            IP discovered via STUN), and relay candidates (TURN server
            addresses). ICE candidates are exchanged incrementally during
            connection setup. The ICE agent on each peer tries candidates in
            priority order (host first, then server-reflexive, then relay) until
            a working pair is found. This process is called ICE gathering and
            connectivity checks.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>STUN/TURN Servers:</strong> Infrastructure for NAT traversal.
            <strong>STUN (Session Traversal Utilities for NAT)</strong> servers
            help peers discover their public IP address. A peer sends a request
            to a STUN server, which responds with the peer's public IP and port
            (as seen from the internet). This allows peers behind NAT to learn
            their external address. <strong>TURN (Traversal Using Relays around
            NAT)</strong> servers relay data when direct P2P fails. If both
            peers are behind symmetric NATs or restrictive firewalls, P2P
            connection is impossible, and TURN acts as a relay (client → TURN →
            peer). TURN is a fallback -- it introduces latency and server costs,
            so it is used only when direct connection fails. Google provides free
            STUN servers (stun.l.google.com:19302); TURN requires self-hosting
            (coturn) or paid services (Twilio, Xirsys).
          </HighlightBlock>
          <li>
            <strong>RTCDataChannel:</strong> A bidirectional channel for
            arbitrary data transfer over an RTCPeerConnection. Data channels use
            SCTP over DTLS, providing reliable or unreliable delivery, ordered
            or unordered messages, and congestion control. Use cases include:
            file transfer, gaming state synchronization, chat messages, and
            remote procedure calls. Data channels have lower latency than
            WebSockets for P2P scenarios (no server relay) and support both
            string and binary data. The API is similar to WebSocket: send(),
            onmessage, onopen, onclose.
          </li>
          <li>
            <strong>MediaStream and Tracks:</strong> MediaStream represents a
            stream of media (audio, video) from a capture device (camera,
            microphone) or remote peer. It contains MediaStreamTracks (individual
            audio or video tracks). The pattern is: navigator.mediaDevices.getUserMedia()
            captures local media, returns a MediaStream; addTrack() adds tracks
            to the RTCPeerConnection; the remote peer receives tracks via the
            ontrack event and attaches them to a video/audio element for
            playback. MediaStream is also used for screen sharing (getDisplayMedia)
            and advanced scenarios like multi-party calls (multiple streams).
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
      <p>
          The WebRTC connection lifecycle involves signaling exchange, ICE
          gathering, connectivity checks, and finally media/data transfer.
          Understanding this flow is essential for debugging connection issues
          and building robust applications.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            WebRTC Connection Lifecycle
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Initialize Peer Connections:</strong> Both peers create
              RTCPeerConnection with STUN/TURN server configuration
            </li>
            <li>
              <strong>2. Capture Media:</strong> Initiating peer calls
              getUserMedia() to capture local camera/microphone
            </li>
            <li>
              <strong>3. Create Offer:</strong> Initiating peer calls
              createOffer(), gets SDP offer describing capabilities
            </li>
            <li>
              <strong>4. Send Offer via Signaling:</strong> Offer is sent to
              remote peer via WebSocket, HTTP, or custom signaling channel
            </li>
            <li>
              <strong>5. Create Answer:</strong> Remote peer calls
              setRemoteDescription(offer), createAnswer(), gets SDP answer
            </li>
            <li>
              <strong>6. Send Answer via Signaling:</strong> Answer is sent back
              to initiating peer
            </li>
            <li>
              <strong>7. Exchange ICE Candidates:</strong> Both peers discover
              and exchange ICE candidates incrementally
            </li>
            <li>
              <strong>8. Connectivity Checks:</strong> ICE agent tests candidate
              pairs, finds working path (direct or via TURN)
            </li>
            <li>
              <strong>9. Connection Established:</strong> RTCPeerConnection
              transitions to "connected", media/data flows P2P
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/webrtc-connection-flow.svg"
          alt="WebRTC Connection Flow Diagram"
          caption="WebRTC Connection Flow: Signaling exchanges SDP offer/answer and ICE candidates, then media flows directly P2P via SRTP"
        />

        <p>
          The signaling phase is application-specific and not standardized by
          WebRTC. Most applications use WebSockets for signaling due to its
          low-latency, bidirectional nature. The signaling server's role is
          minimal: it relays SDP offers/answers and ICE candidates between
          peers. It does not process or modify the messages -- it is essentially
          a message router. Once peers have exchanged enough information, they
          connect directly, and the signaling server is no longer involved in
          the media/data path.
        </p>

        <p>
          NAT traversal is the most complex part of WebRTC. Most devices are
          behind NAT (Network Address Translation), where multiple devices share
          a single public IP. The NAT router maps internal (private IP, port)
          to external (public IP, port). For P2P to work, peers must discover
          their external addresses. This is where STUN comes in: a peer sends a
          UDP packet to a STUN server, which responds with the peer's public IP
          and port. The peer includes this in its ICE candidates. When both
          peers have server-reflexive candidates, they can send packets directly
          to each other's public addresses, and the NAT routers forward them
          correctly.
        </p>

        <p>
          However, some NATs are symmetric -- they assign different external
          ports for different destinations. In this case, the port discovered
          via STUN is not the port that Peer B will use to send to Peer A. P2P
          fails, and TURN is required. TURN servers have a public IP and relay
          data: Peer A sends to TURN, TURN forwards to Peer B. This works
          reliably but introduces latency (extra hop) and server costs (bandwidth
          charges). Approximately 10-20% of WebRTC connections require TURN,
          depending on the user base's network topology.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/webrtc-nat-traversal.svg"
          alt="WebRTC NAT Traversal Diagram"
          caption="NAT Traversal: STUN discovers public IP for direct P2P; TURN relays when direct connection fails due to symmetric NAT or firewall"
        />

        <p>
          For multi-party calls (3+ participants), there are two architectures:
          mesh and SFU. In a <strong>mesh topology</strong>, each peer connects
          to every other peer directly. For N participants, there are N*(N-1)/2
          connections. This works for small groups (up to 5-6 participants) but
          does not scale: each peer must encode and send N-1 video streams,
          consuming significant CPU and upload bandwidth. In an{" "}
          <strong>SFU (Selective Forwarding Unit)</strong> architecture, peers
          connect to a central server that forwards media. Each peer sends one
          stream to the SFU and receives N-1 streams from the SFU. The SFU does
          not transcode (unlike an MCU) -- it simply forwards packets, reducing
          server CPU. SFU is the standard for large video conferences (Zoom,
          Google Meet use variants of this).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/webrtc-mesh-vs-sfu.svg"
          alt="WebRTC Mesh vs SFU Architecture Comparison"
          caption="Mesh vs SFU: Mesh has direct P2P connections between all peers (N*(N-1)/2 connections); SFU routes all streams through a central server (N connections)"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Latency</strong>
              </td>
              <td className="p-3">
                • Direct P2P eliminates server relay latency
                <br />
                • Sub-100ms round-trip for nearby peers
                <br />• No server processing delay
              </td>
              <td className="p-3">
                • NAT traversal adds initial connection delay (1-5 seconds)
                <br />
                • TURN relay introduces extra hop (20-50ms additional)
                <br />• Connection setup is slower than WebSocket
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Bandwidth</strong>
              </td>
              <td className="p-3">
                • Server bandwidth costs eliminated for P2P
                <br />
                • Scales with participants (no central bottleneck)
                <br />• Efficient for large file transfers
              </td>
              <td className="p-3">
                • Each peer uploads to all other peers (mesh)
                <br />
                • Upload bandwidth limits participant count
                <br />• TURN relay consumes server bandwidth
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Reliability</strong>
              </td>
              <td className="p-3">
                • Works through most NATs with STUN
                <br />
                • TURN fallback for restrictive networks
                <br />• Automatic reconnection on network changes
              </td>
              <td className="p-3">
                • 10-20% of connections require TURN (costly)
                <br />
                • Some corporate firewalls block WebRTC entirely
                <br />• Mobile networks may terminate idle connections
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Security</strong>
              </td>
              <td className="p-3">
                • All traffic encrypted (DTLS, SRTP)
                <br />
                • No server can eavesdrop on P2P traffic
                <br />• Built-in authentication via signaling
              </td>
              <td className="p-3">
                • IP addresses exposed to peers (privacy concern)
                <br />
                • TURN server can see relayed traffic
                <br />• Signaling server must be secured separately
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            WebRTC vs WebSocket for Real-Time Communication
          </h3>
          <p>
            WebRTC and WebSocket both enable real-time communication but serve
            different use cases. Use <strong>WebRTC</strong> for: peer-to-peer
            audio/video calls, direct file transfer between users, low-latency
            gaming, and scenarios where server relay cost is prohibitive. Use{" "}
            <strong>WebSocket</strong> for: client-to-server real-time updates
            (notifications, live feeds), chat applications with server-side
            storage, scenarios requiring server authority (game state
            validation), and when P2P is not needed. WebRTC has higher
            connection setup complexity but lower per-byte cost for P2P.
            WebSocket is simpler to implement but requires server relay for all
            traffic.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices represent hard-won lessons from operating WebRTC
          applications at scale:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Use Reliable STUN/TURN Infrastructure:</strong> Deploy
            multiple STUN servers (Google's free servers are reliable but
            rate-limited) and self-host TURN servers (coturn) in multiple
            regions. Configure TURN with long-term credentials (HMAC-SHA1) to
            prevent abuse. Monitor TURN usage and set bandwidth limits per user
            to prevent cost overruns. For production, use a managed TURN service
            (Twilio, Xirsys) unless you have specific requirements.
          </li>
          <li>
            <strong>Implement Connection Quality Monitoring:</strong> Use
            RTCPeerConnection.getStats() to monitor connection quality: packet
            loss, jitter, round-trip time, bitrate, and resolution. Display
            quality indicators to users (e.g., "Poor connection" warning).
            Adapt media quality based on network conditions: reduce video
            resolution when packet loss exceeds 5%, switch to audio-only when
            bandwidth is insufficient.
          </li>
          <li>
            <strong>Handle Network Changes Gracefully:</strong> Mobile devices
            frequently switch networks (Wi-Fi to cellular, cellular to Wi-Fi).
            WebRTC connections may break on network changes. Implement
            reconnection logic: detect connection state changes (onconnectionstatechange),
            re-negotiate if needed, and re-establish the connection. For data
            channels, queue messages during disconnection and flush on
            reconnection.
          </li>
          <li>
            <strong>Use ICE Restart for Failed Connections:</strong> When a
            connection fails (state transitions to "failed" or "disconnected"),
            call peerConnection.restartIce() to restart ICE gathering. This
            discovers new candidates (e.g., if the device's IP changed) and
            attempts to reconnect. Combine with signaling to exchange new ICE
            candidates. ICE restart is faster than full re-negotiation.
          </li>
          <li>
            <strong>Implement Proper Cleanup:</strong> When a call ends, release
            all resources: close RTCPeerConnection, close RTCDataChannels, stop
            MediaStreamTracks (camera/microphone), and remove event listeners.
            Failure to stop tracks keeps the camera/microphone active, draining
            battery and showing the recording indicator. The pattern is to call
            getTracks on the stream, iterate over each track, call stop on each
            track, and then close the peer connection.
          </li>
          <li>
            <strong>Secure Signaling Channel:</strong> The signaling channel
            (WebSocket, HTTP) must be secured with TLS (wss://, https://). SDP
            contains IP addresses and media capabilities -- if intercepted, an
            attacker could hijack the session or launch DoS attacks. Authenticate
            users before allowing signaling, and validate that users are
            authorized to connect to each other (e.g., both are in the same
            meeting room).
          </li>
          <li>
            <strong>Handle Browser Compatibility:</strong> WebRTC APIs vary
            across browsers. Use adapter.js (a WebRTC shim) to normalize
            differences. Test on all target browsers: Chrome, Firefox, Safari,
            and Edge. Safari has historically had quirks (e.g., requiring
            explicit video element attachment before playback). Mobile browsers
            have additional restrictions (e.g., iOS Safari requires user gesture
            for getUserMedia).
          </li>
          <li>
            <strong>Implement Privacy Controls:</strong> Give users explicit
            control over media: show camera/microphone selection UI, display
            recording indicators, and allow muting/unmuting. For screen sharing,
            use getDisplayMedia() which shows a browser-native permission dialog
            (users can select which window/screen to share). Never access media
            without explicit user permission.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes appear frequently even in production applications at
          well-funded companies:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Not Handling ICE Connection Failures:</strong> Assuming P2P
            always succeeds. Approximately 10-20% of connections require TURN
            relay. Without TURN configuration, these connections fail silently.
            Always configure iceServers with both STUN and TURN. Monitor
            iceConnectionState and alert if it stays in "checking" for more
            than 10 seconds.
          </li>
          <li>
            <strong>Not Stopping Media Tracks:</strong> Forgetting to call
            track.stop() when ending a call. The camera/microphone remains
            active, draining battery and showing the recording indicator. Always
            stop all tracks when the call ends by calling getTracks on the
            stream and stopping each track.
          </li>
          <li>
            <strong>Exposing IP Addresses Without Consent:</strong> WebRTC leaks
            the user's local and public IP addresses to peers. For privacy-sensitive
            applications, inform users that their IP will be visible, or route
            all traffic through TURN (which hides the real IP). Some users may
            want to use a VPN to mask their IP.
          </li>
          <li>
            <strong>Not Handling Signaling Failures:</strong> Assuming signaling
            messages always arrive. Network issues, server crashes, and message
            ordering problems can cause signaling failures. Implement
            acknowledgments and retries for signaling messages. Use sequence
            numbers to detect out-of-order delivery.
          </li>
          <li>
            <strong>Mesh Topology for Large Groups:</strong> Using P2P mesh for
            groups larger than 5-6 participants. Each peer must encode and
            upload N-1 video streams, which quickly exceeds upload bandwidth and
            CPU capacity. Use SFU architecture for groups larger than 6
            participants.
          </li>
          <li>
            <strong>Not Adapting to Network Conditions:</strong> Sending
            high-bitrate video regardless of network quality. This causes packet
            loss, jitter, and frozen video. Monitor getStats() and adapt bitrate
            dynamically. Reduce resolution, frame rate, or switch to audio-only
            when network degrades.
          </li>
          <li>
            <strong>Ignoring Mobile Constraints:</strong> Not accounting for
            mobile network characteristics: higher latency, lower bandwidth,
            frequent network switches, and aggressive battery optimization.
            Mobile networks may terminate idle UDP connections (WebRTC uses UDP).
            Implement keep-alive (send periodic dummy packets) and fast
            reconnection.
          </li>
          <li>
            <strong>Not Testing NAT Traversal Scenarios:</strong> Testing only
            on the same network (where P2P always works). Test across different
            networks: home Wi-Fi, corporate networks, mobile data, and
            restrictive firewalls. Use tools like webrtc-internals (Chrome) to
            debug ICE candidate selection and connection failures.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          WebRTC is the foundation for these production scenarios:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Video Conferencing (Google Meet, Zoom, Whereby):</strong>{" "}
            Multi-party video calls with screen sharing, chat, and recording.
            Implementation: SFU architecture for groups larger than 4, adaptive
            bitrate based on network conditions, TURN fallback for restrictive
            networks, and simulcast (sending multiple resolutions) for bandwidth
            adaptation. Server-side: SFU routes streams, recording service
            captures streams, and signaling coordinates participants.
          </li>
          <li>
            <strong>Peer-to-Peer File Sharing (WebTorrent, FilePizza):</strong>{" "}
            Direct file transfer between browsers without server storage.
            Implementation: RTCDataChannel for file chunks, chunk-based transfer
            with progress tracking, multiple parallel connections for speed, and
            magnet link support for torrent-style discovery. Files never touch
            the server -- only signaling metadata passes through.
          </li>
          <li>
            <strong>Remote Desktop and Screen Sharing (Chrome Remote Desktop,
            Screenhero):</strong> Low-latency screen sharing with remote
            control. Implementation: getDisplayMedia() for screen capture,
            RTCDataChannel for mouse/keyboard events, high frame rate (30-60
            fps) for responsiveness, and H.264 for efficient compression.
            Server-side: signaling for session setup, optional TURN for relay.
          </li>
          <li>
            <strong>IoT Device Control:</strong> Browser-based control of IoT
            devices (drones, robots, cameras) with low-latency video feedback.
            Implementation: WebRTC on embedded devices (via libwebrtc),
            RTCDataChannel for control commands, RTCPeerConnection for video
            stream, and local network discovery for initial pairing. Advantage
            over HTTP: sub-100ms latency for real-time control.
          </li>
          <li>
            <strong>Telehealth and Remote Consultations:</strong> HIPAA-compliant
            video consultations with screen sharing for medical imaging.
            Implementation: encrypted signaling (TLS end-to-end), BAA-compliant
            TURN servers, recording with consent for medical records, and
            integration with EHR systems. WebRTC's built-in encryption (DTLS,
            SRTP) helps meet compliance requirements.
          </li>
          <li>
            <strong>Live Streaming with Low Latency:</strong> Interactive live
            streaming where viewers can respond in real time (live quizzes,
            auctions, gaming). Implementation: broadcaster uses WebRTC to send
            to SFU, viewers use WebRTC or HLS (with low-latency extensions) to
            receive, and RTCDataChannel for interactive elements (votes, bids).
            Latency is 1-3 seconds vs 10-30 seconds for traditional HLS.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: Explain the WebRTC connection setup process.</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> WebRTC connection setup involves: (1)
              Both peers create RTCPeerConnection with STUN/TURN config. (2)
              Initiating peer captures media with getUserMedia(), creates SDP
              offer with createOffer(). (3) Offer is sent to remote peer via
              signaling (WebSocket, HTTP). (4) Remote peer sets remote
              description with setRemoteDescription(offer), creates SDP answer
              with createAnswer(). (5) Answer is sent back via signaling. (6)
              Both peers exchange ICE candidates incrementally. (7) ICE agent
              performs connectivity checks, finds working path (direct via STUN
              or relay via TURN). (8) Connection transitions to "connected",
              media flows P2P via SRTP.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What is the role of STUN and TURN servers in WebRTC?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> STUN servers help peers discover their
              public IP address behind NAT. A peer sends a request to STUN,
              which responds with the peer's public IP and port. This enables
              direct P2P connection. TURN servers relay data when direct P2P
              fails (symmetric NAT, restrictive firewalls). TURN is a fallback
              -- it introduces latency and server costs, so it is used only when
              STUN-based direct connection fails. Approximately 80-90% of
              connections succeed via STUN; 10-20% require TURN.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How do you handle multi-party calls (3+ participants) in
              WebRTC?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> For small groups (up to 5-6
              participants), use mesh topology where each peer connects to every
              other peer directly. For larger groups, use SFU (Selective
              Forwarding Unit) architecture where peers connect to a central
              server that forwards streams. Each peer sends one stream to SFU
              and receives N-1 streams from SFU. SFU does not transcode -- it
              simply forwards packets, reducing server CPU. For very large
              groups (100+), use simulcast (multiple resolutions) and layer
              switching.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you monitor and adapt to network conditions in WebRTC?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I use RTCPeerConnection.getStats() to
              collect metrics: packet loss, jitter, round-trip time, bitrate,
              and resolution. I monitor these metrics periodically (every 5
              seconds) and adapt: if packet loss exceeds 5%, reduce video
              resolution; if bitrate drops, reduce frame rate; if RTT exceeds
              500ms, switch to audio-only. I display quality indicators to users
              and log metrics for debugging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What are the security considerations for WebRTC applications?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> WebRTC has built-in encryption (DTLS for
              signaling, SRTP for media), but several considerations remain: (1)
              Secure the signaling channel with TLS (wss://, https://). (2)
              Authenticate users before allowing signaling. (3) Be aware that IP
              addresses are exposed to peers (privacy concern). (4) TURN servers
              can see relayed traffic -- use trusted providers. (5) Implement
              proper access control (users should only connect to authorized
              peers). (6) Handle permissions properly (camera/microphone access
              requires user consent).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How do you handle network changes (Wi-Fi to cellular) in
              WebRTC?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I listen to the
              onconnectionstatechange event. When the state transitions to
              "disconnected" or "failed", I call peerConnection.restartIce() to
              restart ICE gathering. This discovers new candidates for the new
              network. I re-negotiate if needed (new SDP offer/answer). For
              data channels, I queue messages during disconnection and flush on
              reconnection. I also implement a reconnection timeout with
              exponential backoff if ICE restart fails.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/TR/webrtc/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C WebRTC Specification 
            </a>
          </li>
          <li>
            MDN Web Docs: <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebRTC API 
            </a>
          </li>
          <li>
            IETF RFC 8825: <a
              href="https://datatracker.ietf.org/doc/html/rfc8825"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebRTC Overview 
            </a>
          </li>
          <li>
            <a
              href="https://webrtc.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google WebRTC Documentation 
            </a>
          </li>
          <li>
            <a
              href="https://github.com/coturn/coturn"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              coturn TURN Server 
            </a>
          </li>
          <li>
            <a
              href="https://webrtcforthecurious.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebRTC for the Curious 
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

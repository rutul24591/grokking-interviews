"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-other-webrtc",
  title: "WebRTC for Real-Time Communication",
  description: "Guide to implementing WebRTC covering peer-to-peer connections, STUN/TURN, and media handling.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "webrtc",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "webrtc", "real-time", "video"],
  relatedTopics: ["voice-video-calling", "peer-to-peer", "streaming"],
};

export default function WebRTCArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>WebRTC</strong> enables peer-to-peer real-time communication 
          directly between browsers, reducing server costs and latency for 
          voice/video calls.
        </p>
      </section>

      <section>
        <h2>Connection Setup</h2>
        <ul className="space-y-3">
          <li><strong>Signaling:</strong> Exchange SDP offers/answers via server.</li>
          <li><strong>STUN:</strong> Discover public IP address.</li>
          <li><strong>TURN:</strong> Relay for NAT traversal when P2P fails.</li>
        </ul>
      </section>

      <section>
        <h2>Media Handling</h2>
        <ul className="space-y-3">
          <li><strong>Codecs:</strong> VP8/VP9 for video, Opus for audio.</li>
          <li><strong>Adaptive Bitrate:</strong> Adjust quality based on network.</li>
          <li><strong>Encryption:</strong> DTLS-SRTP for secure media.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When do you need TURN servers?</p>
            <p className="mt-2 text-sm">A: When P2P fails due to symmetric NAT, firewalls. ~15-20% of connections need TURN. Cost consideration.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale WebRTC?</p>
            <p className="mt-2 text-sm">A: SFU/MCU for multi-party, selective forwarding, simulcast for different quality levels, edge servers.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

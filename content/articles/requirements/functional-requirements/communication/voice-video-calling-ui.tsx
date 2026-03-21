"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-voice-video-calling",
  title: "Voice/Video Calling UI",
  description: "Guide to implementing voice and video calling covering call controls, quality indicators, and screen sharing.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "voice-video-calling-ui",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "calling", "video", "frontend"],
  relatedTopics: ["webrtc", "real-time", "chat"],
};

export default function VoiceVideoCallingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Voice/Video Calling UI</strong> enables real-time audio/video 
          communication with call controls, quality indicators, and collaboration 
          features.
        </p>
      </section>

      <section>
        <h2>Call Controls</h2>
        <ul className="space-y-3">
          <li><strong>Mute:</strong> Toggle microphone on/off.</li>
          <li><strong>Camera:</strong> Toggle video on/off.</li>
          <li><strong>End:</strong> Red button to end call.</li>
          <li><strong>Speaker:</strong> Toggle speakerphone.</li>
        </ul>
      </section>

      <section>
        <h2>Quality Indicators</h2>
        <ul className="space-y-3">
          <li><strong>Signal:</strong> Connection quality bars.</li>
          <li><strong>Network:</strong> Show bandwidth, latency.</li>
          <li><strong>Warnings:</strong> Alert on poor connection.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle call quality issues?</p>
            <p className="mt-2 text-sm">A: Adaptive bitrate, degrade gracefully (video → audio), reconnect logic, network quality monitoring.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement screen sharing?</p>
            <p className="mt-2 text-sm">A: WebRTC getDisplayMedia, permission prompt, share window/screen/tab, indicator while sharing.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-device-session-tracking",
  title: "Device Session Tracking",
  description: "Guide to implementing device session tracking covering device fingerprinting, session metadata, tracking patterns, and privacy considerations.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "device-session-tracking",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "device-tracking", "sessions", "backend", "security"],
  relatedTopics: ["session-management", "security-audit-logging", "authentication-service"],
};

export default function DeviceSessionTrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Device Session Tracking</strong> is the practice of recording and monitoring 
          device information for each user session. It enables security features like recognizing 
          trusted devices, detecting suspicious logins, and providing users visibility into their 
          active sessions.
        </p>
      </section>

      <section>
        <h2>Device Fingerprinting</h2>
        <ul className="space-y-3">
          <li><strong>Signals:</strong> User agent, screen resolution, timezone, language, fonts, WebGL fingerprint.</li>
          <li><strong>Hash:</strong> Combine signals into device hash for identification.</li>
          <li><strong>Persistence:</strong> Store device fingerprint with session.</li>
          <li><strong>Privacy:</strong> Don't track across sites, respect Do Not Track.</li>
        </ul>
      </section>

      <section>
        <h2>Session Metadata</h2>
        <ul className="space-y-3">
          <li><strong>Device Info:</strong> Type (mobile/desktop), OS, browser, browser version.</li>
          <li><strong>Location:</strong> Country, city from IP (approximate).</li>
          <li><strong>Network:</strong> IP address (masked for display), ISP.</li>
          <li><strong>Timing:</strong> Created at, last activity, last IP.</li>
        </ul>
      </section>

      <section>
        <h2>Security Use Cases</h2>
        <ul className="space-y-3">
          <li><strong>Trusted Devices:</strong> Skip MFA on recognized devices.</li>
          <li><strong>Anomaly Detection:</strong> Alert on new device + location.</li>
          <li><strong>Session Management:</strong> Show users their active devices.</li>
          <li><strong>Fraud Prevention:</strong> Block known fraudulent devices.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate device fingerprint?</p>
            <p className="mt-2 text-sm">A: Combine user agent, screen resolution, timezone, language. Hash with SHA256. Store as device_id.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle device privacy?</p>
            <p className="mt-2 text-sm">A: Don't track across sites, allow opt-out, mask IP addresses, delete old device data.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

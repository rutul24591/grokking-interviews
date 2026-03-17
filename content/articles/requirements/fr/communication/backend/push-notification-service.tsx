"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-push-notifications",
  title: "Push Notification Service",
  description: "Guide to implementing push notifications covering APNs, FCM, delivery, and tracking.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "push-notification-service",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "communication", "push", "notifications", "backend"],
  relatedTopics: ["notifications", "messaging", "mobile"],
};

export default function PushNotificationServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Push Notification Service</strong> delivers notifications to 
          user devices via platform-specific providers (APNs, FCM), enabling 
          re-engagement and real-time alerts.
        </p>
      </section>

      <section>
        <h2>Providers</h2>
        <ul className="space-y-3">
          <li><strong>APNs:</strong> Apple Push Notification service (iOS).</li>
          <li><strong>FCM:</strong> Firebase Cloud Messaging (Android, Web).</li>
          <li><strong>Web Push:</strong> Browser push API.</li>
        </ul>
      </section>

      <section>
        <h2>Delivery Flow</h2>
        <ul className="space-y-3">
          <li><strong>Token Management:</strong> Store device tokens per user.</li>
          <li><strong>Notification Build:</strong> Title, body, data payload.</li>
          <li><strong>Send:</strong> API call to provider.</li>
          <li><strong>Track:</strong> Delivery status, open rate.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle token invalidation?</p>
            <p className="mt-2 text-sm">A: Listen for invalid token responses, remove from database, require re-registration on app open.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize push delivery?</p>
            <p className="mt-2 text-sm">A: Batch notifications, priority queuing, rate limit per user, collapse duplicate notifications.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

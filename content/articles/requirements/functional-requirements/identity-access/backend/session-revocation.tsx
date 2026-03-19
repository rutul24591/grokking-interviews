"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-session-revocation",
  title: "Session Revocation",
  description: "Guide to implementing session revocation covering token invalidation, logout all devices, and distributed session management.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "session-revocation",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "session-revocation", "logout", "backend"],
  relatedTopics: ["session-management", "token-generation", "logout"],
};

export default function SessionRevocationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Session Revocation</strong> is the process of invalidating active sessions, 
          either individually or in bulk. It is essential for security (compromised accounts), 
          user control (logout all devices), and compliance (password changes).
        </p>
      </section>

      <section>
        <h2>Revocation Scenarios</h2>
        <ul className="space-y-3">
          <li><strong>User Logout:</strong> Single session or all sessions.</li>
          <li><strong>Password Change:</strong> Revoke all sessions.</li>
          <li><strong>Security Incident:</strong> Admin revokes sessions.</li>
          <li><strong>Device Loss:</strong> User revokes specific device.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Token Denylist:</strong> Add JTI to denylist until expiry.</li>
          <li><strong>Delete Session:</strong> Remove from session store.</li>
          <li><strong>Version Increment:</strong> Increment user version, invalidate old tokens.</li>
          <li><strong>Broadcast:</strong> Notify all services of revocation.</li>
        </ul>
      </section>

      <section>
        <h2>Distributed Revocation</h2>
        <ul className="space-y-3">
          <li><strong>Event Stream:</strong> Publish revocation event (Kafka).</li>
          <li><strong>Shared Store:</strong> All services check same denylist.</li>
          <li><strong>Propagation Delay:</strong> Accept brief window (seconds).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you revoke JWT tokens?</p>
            <p className="mt-2 text-sm">A: Can't directly (stateless). Use denylist, short expiry, or version claim. Or use opaque tokens.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle logout all devices?</p>
            <p className="mt-2 text-sm">A: Delete all sessions from store, increment user version, broadcast to all services.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-login-attempt-tracking",
  title: "Login Attempt Tracking",
  description: "Guide to implementing login attempt tracking covering failed attempt logging, rate limiting, fraud detection, and security monitoring.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "login-attempt-tracking",
  version: "extensive",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "login-tracking", "security", "backend"],
  relatedTopics: ["account-lockout", "authentication-service", "security-audit-logging"],
};

export default function LoginAttemptTrackingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Login Attempt Tracking</strong> is the practice of recording all authentication 
          attempts (successful and failed) for security monitoring, fraud detection, and account 
          protection. It enables detection of brute force attacks, credential stuffing, and 
          unauthorized access attempts.
        </p>
      </section>

      <section>
        <h2>Tracking Data</h2>
        <ul className="space-y-3">
          <li><strong>Timestamp:</strong> When the attempt occurred.</li>
          <li><strong>Identifier:</strong> Email/username attempted.</li>
          <li><strong>Outcome:</strong> Success or failure reason.</li>
          <li><strong>Context:</strong> IP, user agent, device fingerprint.</li>
          <li><strong>Location:</strong> Geolocation from IP.</li>
        </ul>
      </section>

      <section>
        <h2>Security Use Cases</h2>
        <ul className="space-y-3">
          <li><strong>Brute Force Detection:</strong> Many failures on one account.</li>
          <li><strong>Credential Stuffing:</strong> Failures across many accounts from same IP.</li>
          <li><strong>Anomaly Detection:</strong> Login from new location/device.</li>
          <li><strong>Account Takeover:</strong> Success after many failures.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <ul className="space-y-3">
          <li><strong>Storage:</strong> Redis for recent attempts, database for history.</li>
          <li><strong>Rate Limiting:</strong> Track attempts per IP and account.</li>
          <li><strong>Alerting:</strong> Trigger on suspicious patterns.</li>
          <li><strong>Retention:</strong> 90 days for security analysis.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect credential stuffing?</p>
            <p className="mt-2 text-sm">A: Track failures across accounts per IP. Many accounts, many failures = stuffing. Block IP, require CAPTCHA.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you reveal if email exists?</p>
            <p className="mt-2 text-sm">A: No, use generic messages. Timing attacks too - same response time for all cases.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

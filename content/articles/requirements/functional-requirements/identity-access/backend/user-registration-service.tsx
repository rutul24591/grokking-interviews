"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-user-registration",
  title: "User Registration Service",
  description: "Comprehensive guide to building user registration services covering account creation, validation, email verification, fraud prevention, and scaling patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "user-registration-service",
  version: "extensive",
  wordCount: 8000,
  readingTime: 32,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "registration", "backend", "user-management", "security"],
  relatedTopics: ["authentication-service", "email-verification", "password-hashing", "account-verification"],
};

export default function UserRegistrationServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>User Registration Service</strong> is the backend component responsible for 
          creating new user accounts, validating input data, preventing fraud, and initiating 
          verification flows. It is the gateway for user acquisition and must balance conversion 
          optimization with security and data quality.
        </p>
        <p>
          For staff and principal engineers, building a registration service requires understanding 
          data validation, password security, fraud prevention, email verification, database design, 
          and scaling for high-volume signup events. The service must handle millions of registrations 
          while preventing abuse (fake accounts, bot signups) and maintaining data integrity.
        </p>
      </section>

      <section>
        <h2>Core Architecture</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Registration Flow</h3>
          <ul className="space-y-3">
            <li>
              <strong>Input Validation:</strong> Validate email format, password strength, 
              username availability. Return specific errors for client correction.
            </li>
            <li>
              <strong>Fraud Checks:</strong> Check IP reputation, device fingerprint, email 
              domain validity. Block high-risk signups.
            </li>
            <li>
              <strong>Password Hashing:</strong> Hash password with bcrypt/argon2 before 
              storage. Never store plaintext.
            </li>
            <li>
              <strong>User Creation:</strong> Insert user record with unique ID. Set initial 
              status (unverified).
            </li>
            <li>
              <strong>Verification Trigger:</strong> Send verification email/SMS. Create 
              verification token.
            </li>
            <li>
              <strong>Response:</strong> Return user ID, require verification before full 
              access.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">API Design</h3>
          <ul className="space-y-3">
            <li>
              <strong>POST /api/auth/register:</strong> Accept email, password, optional 
              username. Return user ID + verification required flag.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Per IP (5/hour), per email domain (10/hour). 
              Prevent bulk account creation.
            </li>
            <li>
              <strong>Idempotency:</strong> Support idempotency key for retry safety. 
              Return same response for duplicate requests.
            </li>
            <li>
              <strong>Response:</strong> Don't reveal if email exists (prevent enumeration). 
              Generic success message.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Validation &amp; Security</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Format Check:</strong> Regex validation for email format. Allow 
              international domains.
            </li>
            <li>
              <strong>MX Record:</strong> Verify domain has mail servers (async API call). 
              Reject invalid domains.
            </li>
            <li>
              <strong>Disposable Detection:</strong> Block known disposable email providers 
              (optional, based on business needs).
            </li>
            <li>
              <strong>Typo Detection:</strong> Suggest corrections for common typos 
              (gmial.com → gmail.com).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Password Security</h3>
          <ul className="space-y-3">
            <li>
              <strong>Hashing Algorithm:</strong> bcrypt (cost 12+) or argon2id (recommended). 
              Unique salt per password.
            </li>
            <li>
              <strong>Breach Check:</strong> Check against Have I Been Pwned API. Warn if 
              password compromised.
            </li>
            <li>
              <strong>Strength Requirements:</strong> Minimum 8 characters (NIST). No 
              composition rules. Show strength meter.
            </li>
            <li>
              <strong>Timing-Safe:</strong> Constant-time comparison for password validation. 
              Prevent timing attacks.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Fraud Prevention</h3>
          <ul className="space-y-3">
            <li>
              <strong>IP Reputation:</strong> Check IP against blocklists, proxy detection, 
              VPN detection.
            </li>
            <li>
              <strong>Device Fingerprint:</strong> Collect device signals. Detect known 
              fraud devices.
            </li>
            <li>
              <strong>Pattern Detection:</strong> Detect bulk signup patterns (same IP, 
              sequential emails).
            </li>
            <li>
              <strong>CAPTCHA:</strong> Trigger for suspicious signups. Invisible CAPTCHA 
              preferred.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Database Design</h2>
        <ul className="space-y-3">
          <li>
            <strong>Users Table:</strong> id (UUID), email (unique), password_hash, 
            username (unique, nullable), status, created_at, updated_at.
          </li>
          <li>
            <strong>Indexes:</strong> email (unique), username (unique), status, 
            created_at.
          </li>
          <li>
            <strong>Partitioning:</strong> Partition by created_at for large tables 
            ({'>'}100M rows).
          </li>
          <li>
            <strong>Audit Table:</strong> Separate table for registration events 
            (IP, device, outcome).
          </li>
        </ul>
      </section>

      <section>
        <h2>Scaling Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>Async Verification:</strong> Send verification email asynchronously 
            (queue). Don't block registration response.
          </li>
          <li>
            <strong>Database Sharding:</strong> Shard by user_id hash for horizontal 
            scaling.
          </li>
          <li>
            <strong>Cache Unverified:</strong> Cache unverified user data temporarily 
            (Redis, 24h TTL).
          </li>
          <li>
            <strong>Cleanup Job:</strong> Delete unverified accounts after 7 days. 
            Free up emails.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent duplicate account creation?</p>
            <p className="mt-2 text-sm">
              A: Unique constraint on email (database-level). Check availability before 
              insert. Handle race condition with unique constraint error. Return generic 
              "account may already exist" message.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle high-volume signup events?</p>
            <p className="mt-2 text-sm">
              A: Queue-based processing, async email delivery, rate limiting, database 
              write buffering, auto-scaling workers. Monitor queue depth, add capacity 
              proactively.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you verify email before allowing login?</p>
            <p className="mt-2 text-sm">
              A: Depends on risk. Low-risk: allow limited access, require verification 
              for sensitive actions. High-risk (financial): require verification before 
              any access. Balance security vs conversion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle username selection?</p>
            <p className="mt-2 text-sm">
              A: Real-time availability check (debounced). Reserve username on 
              registration, release if unverified after 24h. Allow changes (rate 
              limited). Handle squatting (inactive accounts).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement progressive profiling?</p>
            <p className="mt-2 text-sm">
              A: Collect minimal info at signup (email, password). Request additional 
              data post-registration based on user actions. Store completion progress. 
              Incentivize completion (unlock features).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle registration from blocked regions?</p>
            <p className="mt-2 text-sm">
              A: GeoIP blocking at edge (CDN), comply with sanctions (OFAC), clear 
              error message, allow appeals process. Document blocked regions in 
              terms of service.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

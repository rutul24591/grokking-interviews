"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-analytics-tracking-privacy-compliant-tracking",
  title: "Privacy-Compliant Tracking",
  description: "Staff-level guide to privacy-compliant tracking: GDPR/CCPA compliance, data minimization, anonymization, consent management, and privacy-preserving analytics architectures.",
  category: "frontend",
  subcategory: "analytics-tracking",
  slug: "privacy-compliant-tracking",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "analytics", "privacy", "gdpr", "ccpa", "consent", "anonymization", "compliance"],
  relatedTopics: ["cookie-consent-management", "event-tracking", "data-governance", "security-privacy"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Privacy-compliant tracking</strong> is analytics implementation that respects user privacy rights and complies with regulations like GDPR (EU), CCPA (California), LGPD (Brazil), and emerging privacy laws worldwide. It balances business need for user behavior data with individual rights to privacy, consent, and data control.
        </p>
        <p>
          Privacy compliance is not optional—violations carry severe penalties. GDPR fines can reach 20 million euros or 4% of global annual revenue, whichever is higher. CCPA allows statutory damages of 100 to 750 dollars per consumer per incident. Beyond fines, privacy violations damage brand trust and user relationships.
        </p>
        <p>
          For staff/principal engineers, privacy-compliant tracking requires balancing four competing concerns. <strong>Compliance</strong> means meeting all regulatory requirements for consent, data rights, and retention. <strong>Data Quality</strong> means maintaining analytics quality despite consent restrictions and data minimization. <strong>User Experience</strong> means respecting privacy without degrading experience for consenting users. <strong>Business Value</strong> means extracting actionable insights while respecting privacy boundaries.
        </p>
        <p>
          The business impact of privacy-compliant tracking is significant and multifaceted. Compliance avoids fines, legal liability, and reputational damage. Transparent privacy practices build trust, and trust drives engagement and loyalty. GDPR compliance is required for EU market access. CCPA compliance is required for California. Privacy-first positioning differentiates from competitors.
        </p>
        <p>
          In system design interviews, privacy-compliant tracking demonstrates understanding of regulatory requirements, data governance, consent architecture, and the trade-offs between privacy and analytics. It shows you think about legal and ethical implications, not just technical implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <h3>Key Privacy Regulations</h3>
        <p>
          Major privacy regulations affect tracking differently. <strong>GDPR (General Data Protection Regulation - EU)</strong> applies to any organization processing EU residents' data. It requires explicit opt-in consent before tracking, which must be freely given, specific, informed, and unambiguous. It provides data rights including right to access, rectify, erase, port, and object to processing. Penalties reach up to 20 million euros or 4% of global annual revenue.
        </p>
        <p>
          <strong>CCPA (California Consumer Privacy Act)</strong> applies to businesses collecting California residents' data. It requires an opt-out mechanism ("Do Not Sell My Personal Information"). It provides data rights including right to know, delete, and opt-out of sale. Penalties are 100 to 750 dollars per consumer per incident in statutory damages.
        </p>
        <p>
          <strong>LGPD (Lei Geral de Proteção de Dados - Brazil)</strong> applies to organizations processing Brazilian residents' data. It requires explicit opt-in consent similar to GDPR. Penalties reach up to 2% of Brazilian revenue, capped at 50 million reais.
        </p>

        <h3>Personal Data vs. Non-Personal Data</h3>
        <p>
          Understanding what constitutes personal data is critical. <strong>Personal Data (PII)</strong> is any data that can identify an individual directly or indirectly. Examples include email, name, IP address, device ID, cookie ID, and location data. <strong>Non-Personal Data</strong> is data that cannot identify an individual. Examples include aggregated statistics and truly anonymized data.
        </p>
        <p>
          Key insight: Cookie IDs and device IDs are personal data under GDPR. Tracking requires consent even if you don't know the user's name.
        </p>

        <h3>Consent Types</h3>
        <p>
          Different tracking purposes require different consent. <strong>Strictly Necessary</strong> cookies are essential for service like shopping cart and authentication. No consent is required. <strong>Functional</strong> cookies enhance experience like language preference. Consent is recommended. <strong>Analytics</strong> cookies track user behavior. Consent is required under GDPR. <strong>Marketing</strong> cookies are for advertising and retargeting. Explicit consent is required.
        </p>
        <p>
          Best practice: Allow granular consent—users can consent to analytics but not marketing.
        </p>

        <h3>Data Minimization</h3>
        <p>
          Data minimization is a core privacy principle. Collect only what's needed—don't collect data "just in case." Limit purpose by using data only for stated purposes. Limit retention by deleting data when no longer needed. Aggregate when possible by using aggregated data instead of individual-level when sufficient.
        </p>
        <p>
          Implementation: Review all tracking. Remove unnecessary data. Aggregate where possible. Set retention policies.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/gdpr-consent-flow.svg"
          alt="GDPR consent flow showing user visit, consent banner display, consent storage, and tracking gate that checks consent before allowing tracking"
          caption="GDPR consent flow — explicit opt-in required before tracking; granular choices for analytics vs marketing; store consent records for compliance proof"
        />

        <h3>Anonymization vs. Pseudonymization</h3>
        <p>
          Two approaches protect privacy differently. <strong>Anonymization</strong> irreversibly removes identifying information. Data is no longer personal. Techniques include aggregation, k-anonymity, and differential privacy. Under GDPR, anonymized data is not personal data, so no consent is required. The challenge is that true anonymization is difficult—re-identification attacks are possible.
        </p>
        <p>
          <strong>Pseudonymization</strong> replaces identifiers with pseudonyms. Re-identification is possible with a key. Techniques include hashing, tokenization, and encryption. Under GDPR, pseudonymized data is still personal data, so consent is required. The benefit is reduced risk while maintaining analytical utility.
        </p>
        <p>
          Best practice: Pseudonymize by default. Anonymize for long-term storage and aggregate reporting.
        </p>

        <h3>Privacy-Preserving Analytics</h3>
        <p>
          Techniques enable analytics without compromising privacy. <strong>Aggregation</strong> reports aggregates (counts, averages) instead of individual records. <strong>Differential Privacy</strong> adds statistical noise to prevent individual identification. <strong>Cohort Analysis</strong> analyzes groups instead of individuals, like FLoC. <strong>On-Device Processing</strong> processes data on the user's device and sends only aggregates. <strong>Synthetic Data</strong> generates artificial data with the same statistical properties.
        </p>
        <p>
          Example: Apple uses differential privacy for keyboard suggestions. Google's Privacy Sandbox uses cohort-based targeting.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A privacy-compliant tracking architecture treats privacy as a first-class requirement with proper consent management, data governance, and user rights handling.
        </p>

        <h3>Consent Management Architecture</h3>
        <p>
          Implement consent management by displaying a consent banner on the first visit that explains what data is collected and why. Allow granular choices with separate consent for analytics, marketing, and functional. Store consent choices with timestamp and version. Share consent status with all tracking systems. Allow easy consent withdrawal and stop tracking immediately.
        </p>
        <p>
          Implementation: Use a Consent Management Platform (CMP) like OneTrust, Cookiebot, or build custom.
        </p>

        <h3>Consent Gating Architecture</h3>
        <p>
          Implement consent gating by checking consent status before firing any tracking event. If consent has not yet been given, queue events in memory. When consent is granted, flush the queue and send all queued events. If consent is withdrawn, stop tracking immediately and delete queued events. Don't rely solely on client-side consent checks—enforce server-side as well.
        </p>
        <p>
          Implementation: Wrap the tracking function with a consent check. If no consent, push to a queue. When consent is granted, flush the queue.

        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/consent-gating-architecture.svg"
          alt="Consent gating architecture showing event queue holding events until consent check passes, then routing to appropriate tracking systems based on consent category"
          caption="Consent gating — queue events until consent; check category per event (analytics vs marketing); stop immediately on withdrawal"
        />

        <h3>Data Retention Architecture</h3>
        <p>
          Implement data retention policies by defining retention periods for each data type, such as raw events for 90 days and aggregates for 2 years. Automatically delete data after the retention period. Delete user data on request for GDPR right to erasure. Log deletions for compliance proof.
        </p>
        <p>
          Implementation: Use data warehouse features like BigQuery partition expiration or Snowflake data retention policies.
        </p>

        <h3>User Rights Architecture</h3>
        <p>
          Implement user rights handling by providing a mechanism for users to request their data (access). Allow users to correct inaccurate data (rectification). Delete user data on request (erasure). Provide data in machine-readable format (portability). Allow users to object to processing (objection).
        </p>
        <p>
          Implementation: Build a user rights portal or integrate with a privacy platform.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/user-rights-architecture.svg"
          alt="User data rights architecture showing user requests (access, deletion, portability, rectification) flowing through request processing (verify identity, locate data, execute, confirm) to data stores (analytics, profiles, consent records, third-party systems)"
          caption="User rights architecture — verify identity, locate all data across stores, execute request (export/delete/correct), confirm within 30 days per GDPR"
        />

        <h3>Privacy-First Analytics Architecture</h3>
        <p>
          Consider privacy-first analytics alternatives. <strong>Self-hosted</strong> analytics like Matomo or Plausible give you full data control. <strong>Privacy-focused vendors</strong> like Plausible, Fathom, and Simple Analytics prioritize privacy. <strong>No cookies</strong> tracking uses cookieless tracking like session fingerprinting. <strong>Aggregated only</strong> collection gathers only aggregated data, no individual tracking.
        </p>
        <p>
          Trade-off: Privacy-first analytics may have less functionality than Google Analytics. Evaluate based on needs.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Privacy-compliant tracking involves trade-offs between privacy, data quality, and implementation complexity. Full consent plus tracking provides good privacy with consent but the best data quality and medium complexity. This is best for most organizations. Privacy-first analytics provides the best privacy and good aggregated data quality with low complexity. This is best for privacy-focused sites. Cookieless tracking provides fair privacy and fair data quality with low complexity. This is best for simple analytics needs.
        </p>
        <p>
          The staff-level insight is that consent-based tracking with privacy safeguards works best for most organizations. Get consent, but minimize data, anonymize where possible, and respect user rights.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Implement consent management by using a CMP or building a custom consent banner with granular choices. Gate tracking on consent by never tracking before consent and queueing events until consent is given. Minimize data collection by collecting only data necessary for stated purposes.
        </p>
        <p>
          Anonymize where possible by using aggregated data instead of individual-level when sufficient. Set retention policies by defining and enforcing data retention periods. Enable user rights by providing mechanisms for access, deletion, and portability. Document processing by maintaining records of processing activities (GDPR requirement). Conduct regular audits of tracking implementation for compliance annually.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Tracking before consent by firing tracking scripts before the user consents violates GDPR. Pre-ticked boxes are invalid consent under GDPR—consent must be opt-in, not opt-out. Bundled consent by combining analytics consent with terms of service is invalid.
        </p>
        <p>
          Ignoring user rights by not providing access or deletion mechanisms violates regulations. Indefinite retention by keeping data forever violates the data minimization principle. Cookie IDs as anonymous is wrong—cookie IDs are personal data under GDPR, so consent is required. No audit trail means you can't prove compliance without documentation.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>News Site: GDPR Compliance</h3>
        <p>
          A news site had EU traffic but no GDPR-compliant tracking. The solution was implementing a consent banner with granular choices, gating all tracking on consent, setting 13-month retention for consent records, and enabling user data deletion. The site achieved GDPR compliance with a 65% consent rate and zero compliance incidents.
        </p>

        <h3>E-Commerce: Privacy-First Analytics</h3>
        <p>
          An e-commerce site wanted to avoid GDPR complexity. The solution was switching to privacy-first analytics (Plausible) with no cookies, no personal data, and aggregated only. No consent banner was needed. This simplified compliance while maintaining essential analytics and improving site trust.
        </p>

        <h3>SaaS: User Rights Portal</h3>
        <p>
          A SaaS company couldn't handle user data requests manually. The solution was building a self-service privacy portal where users can download data, request deletion, and manage consent. Backend processing was automated. This reduced manual work by 90%, improved response times, and enhanced user trust.
        </p>

        <h3>Media Site: Differential Privacy</h3>
        <p>
          A media site wanted to share usage data publicly without revealing individual behavior. The solution was implementing differential privacy for public reports by adding statistical noise to prevent individual identification. This enabled sharing valuable insights publicly while protecting user privacy with no re-identification risk.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are the key requirements for GDPR-compliant tracking?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Consent requires explicit opt-in before tracking, which must be freely given, specific, informed, and unambiguous. Data minimization means collecting only data necessary for stated purposes. User rights include enabling access, rectification, erasure, portability, and objection. Retention means deleting data when no longer needed and defining retention periods. Documentation requires maintaining records of processing activities.
            </p>
            <p>
              Non-compliance can result in fines up to 20 million euros or 4% of global annual revenue.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you implement consent gating for tracking?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Check before tracking by checking consent status before firing any tracking event. Queue events if consent has not yet been given, and fire when consent is granted. Respect withdrawal by stopping tracking immediately if consent is withdrawn and deleting queued events. Enforce server-side by not relying solely on client-side consent checks.
            </p>
            <p>
              Implementation: Wrap tracking function with consent check. If no consent, push to queue. When consent is granted, flush queue.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the difference between anonymization and pseudonymization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Anonymization irreversibly removes identifying information. Data is no longer personal. GDPR doesn't apply. Pseudonymization replaces identifiers with pseudonyms. Re-identification is possible with a key. Data is still personal. GDPR applies.
            </p>
            <p>
              Best practice: Pseudonymize by default. Anonymize for long-term storage and aggregate reporting.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle user data deletion requests?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Identify the user by finding all data associated with the user including user_id, email, and device_id. Delete from all systems including analytics, CRM, databases, and backups. Log deletion for compliance proof. Notify the user when deletion is complete.
            </p>
            <p>
              GDPR requires deletion within 30 days of request. Automate where possible.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are privacy-preserving analytics techniques?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Aggregation reports aggregates instead of individual records. Differential Privacy adds statistical noise to prevent individual identification. Cohort Analysis analyzes groups instead of individuals. On-Device Processing processes data on the user's device and sends only aggregates. Synthetic Data generates artificial data with the same statistical properties.
            </p>
            <p>
              These techniques enable analytics while protecting individual privacy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are common consent banner mistakes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Pre-ticked boxes are invalid under GDPR. Asymmetric buttons by making "Reject" harder to find than "Accept" is a dark pattern. Tracking before consent by loading scripts before the user decides is invalid. Bundled consent by combining analytics consent with terms of service is invalid. No withdrawal by not providing an easy way to change consent is invalid.
            </p>
            <p>
              These mistakes can invalidate consent and result in compliance violations.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://gdpr.eu/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GDPR.eu
            </a> — Comprehensive GDPR compliance guide.
          </li>
          <li>
            <a href="https://oag.ca.gov/privacy/ccpa" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              California Attorney General: CCPA
            </a> — Official CCPA guidance.
          </li>
          <li>
            <a href="https://plausible.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Plausible Analytics
            </a> — Privacy-first, cookieless analytics.
          </li>
          <li>
            <a href="https://www.onetrust.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OneTrust
            </a> — Consent management platform.
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Differential_privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Differential Privacy
            </a> — Privacy-preserving analytics technique.
          </li>
          <li>
            <a href="https://privacy.google.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Privacy
            </a> — Google's privacy tools and guidance.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

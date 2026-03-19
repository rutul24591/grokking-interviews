"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-privacy-consent-ux",
  title: "Privacy & Consent UX",
  description:
    "Comprehensive guide to privacy compliance: GDPR, CCPA, cookie consent, data collection transparency, and user privacy controls.",
  category: "frontend",
  subcategory: "nfr",
  slug: "privacy-consent-ux",
  version: "extensive",
  wordCount: 8500,
  readingTime: 34,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "privacy", "gdpr", "ccpa", "consent", "cookies"],
  relatedTopics: ["third-party-scripts", "security", "analytics"],
};

export default function PrivacyConsentUXArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Privacy & Consent UX</strong> encompasses how applications
          collect, use, and disclose user data, and how users control their
          privacy. This includes cookie consent, data collection transparency,
          privacy preferences, and compliance with regulations like GDPR (EU),
          CCPA (California), LGPD (Brazil), and others.
        </p>
        <p>
          For staff engineers, privacy is both a legal requirement and a trust
          signal. Poor privacy UX frustrates users (cookie banners everywhere),
          while transparent privacy practices build trust. Non-compliance
          carries significant fines (GDPR: up to 4% of global revenue).
        </p>
        <p>
          <strong>Privacy regulations overview:</strong>
        </p>
        <ul>
          <li>
            <strong>GDPR (EU):</strong> Consent required for non-essential
            cookies, right to access/delete data
          </li>
          <li>
            <strong>CCPA/CPRA (California):</strong> Right to opt-out of sale,
            right to know/delete
          </li>
          <li>
            <strong>LGPD (Brazil):</strong> Similar to GDPR, consent
            requirements
          </li>
          <li>
            <strong>ePrivacy Directive:</strong> Cookie consent specifically
            (EU)
          </li>
          <li>
            <strong>Global Privacy Control (GPC):</strong> Browser signal for
            opt-out
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookie Consent</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cookie Categories</h3>
        <ul className="space-y-2">
          <li>
            <strong>Essential:</strong> Required for site functionality (no
            consent needed)
          </li>
          <li>
            <strong>Functional:</strong> Enhanced features (consent recommended)
          </li>
          <li>
            <strong>Analytics:</strong> Usage tracking (consent required in EU)
          </li>
          <li>
            <strong>Marketing:</strong> Advertising, tracking (consent required)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Consent Requirements (GDPR)
        </h3>
        <ul className="space-y-2">
          <li>Freely given (not forced)</li>
          <li>Specific (per purpose, not bundled)</li>
          <li>Informed (clear what they&apos;re consenting to)</li>
          <li>Unambiguous (affirmative action, not pre-checked)</li>
          <li>Easy to withdraw (as easy as to give)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Consent Banner Design
        </h3>
        <ul className="space-y-2">
          <li>Clear, plain language (not legal jargon)</li>
          <li>Equal prominence to Accept and Reject</li>
          <li>No dark patterns (hidden reject, confusing options)</li>
          <li>Link to detailed cookie policy</li>
          <li>Remember user choice (don&apos;t ask every visit)</li>
          <li>Allow granular choices (not just all-or-nothing)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Consent Management Platforms
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>OneTrust:</strong> Enterprise, comprehensive
          </li>
          <li>
            <strong>Cookiebot:</strong> Popular, good UX
          </li>
          <li>
            <strong>Consent Manager:</strong> Nordic, GDPR-focused
          </li>
          <li>
            <strong>Osano:</strong> SMB-friendly
          </li>
          <li>
            <strong>Custom implementation:</strong> Full control, more work
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/consent-banner-patterns.svg"
          alt="Consent Banner Patterns"
          caption="Cookie consent banner patterns — compliant designs with equal accept/reject options"
        />
      </section>

      <section>
        <h2>Script Blocking</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Blocking Before Consent
        </h3>
        <ul className="space-y-2">
          <li>Don&apos;t load non-essential scripts before consent</li>
          <li>Block analytics (Google Analytics, Mixpanel)</li>
          <li>Block marketing (Facebook Pixel, ads)</li>
          <li>Essential scripts can load (auth, security)</li>
          <li>Load scripts after consent granted</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Implementation Approaches
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Tag Manager:</strong> Configure triggers based on consent
          </li>
          <li>
            <strong>Manual loading:</strong> Load scripts after consent callback
          </li>
          <li>
            <strong>Consent API:</strong> Use browser Storage Access API
          </li>
          <li>
            <strong>Server-side:</strong> Don&apos;t include scripts in HTML
            without consent
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Consent State Management
        </h3>
        <ul className="space-y-2">
          <li>Store consent in localStorage or cookie</li>
          <li>Include consent timestamp and version</li>
          <li>Respect consent across sessions</li>
          <li>Allow users to change consent anytime</li>
          <li>Log consent for compliance records</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Global Privacy Control (GPC)
        </h3>
        <ul className="space-y-2">
          <li>Browser signal for &quot;do not sell my data&quot;</li>
          <li>Respect GPC signal as opt-out</li>
          <li>Check navigator.globalPrivacyControl</li>
          <li>Required in California (CCPA)</li>
          <li>Supported in Firefox, Brave, Safari (optional)</li>
        </ul>
      </section>

      <section>
        <h2>Privacy Preferences</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Preference Center</h3>
        <ul className="space-y-2">
          <li>Allow users to manage privacy settings</li>
          <li>Granular controls (analytics yes, marketing no)</li>
          <li>Easy to access (footer link, settings menu)</li>
          <li>Clear descriptions of each category</li>
          <li>Show current consent status</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Data Access & Deletion
        </h3>
        <ul className="space-y-2">
          <li>Right to access (what data you have)</li>
          <li>Right to deletion (&quot;right to be forgotten&quot;)</li>
          <li>Right to portability (export data)</li>
          <li>Self-service portal for requests</li>
          <li>Verify identity before fulfilling requests</li>
          <li>Respond within legal timeframe (GDPR: 30 days)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Do Not Sell/Share</h3>
        <ul className="space-y-2">
          <li>
            CCPA requires &quot;Do Not Sell My Personal Information&quot; link
          </li>
          <li>Honor opt-out requests</li>
          <li>Don&apos;t discriminate against users who opt-out</li>
          <li>Respect GPC signal as opt-out</li>
          <li>12-month waiting period before re-asking</li>
        </ul>
      </section>

      <section>
        <h2>Privacy by Design</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Minimization</h3>
        <ul className="space-y-2">
          <li>Collect only what you need</li>
          <li>Don&apos; collect &quot;just in case&quot;</li>
          <li>Regular data audits (what do we collect, why)</li>
          <li>Delete data when no longer needed</li>
          <li>Anonymize where possible</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Transparency</h3>
        <ul className="space-y-2">
          <li>Clear privacy policy (readable, not legal jargon)</li>
          <li>Explain what data you collect and why</li>
          <li>List third-parties who receive data</li>
          <li>Update policy when practices change</li>
          <li>Notify users of significant changes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Measures</h3>
        <ul className="space-y-2">
          <li>Encrypt data in transit (HTTPS)</li>
          <li>Encrypt sensitive data at rest</li>
          <li>Access controls (who can access user data)</li>
          <li>Regular security audits</li>
          <li>Breach notification procedures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Third-Party Management
        </h3>
        <ul className="space-y-2">
          <li>Audit third-party scripts for data collection</li>
          <li>Data processing agreements with vendors</li>
          <li>Ensure vendors comply with regulations</li>
          <li>Document data sharing with third-parties</li>
          <li>Regular vendor security assessments</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/privacy-by-design.svg"
          alt="Privacy by Design"
          caption="Privacy by design principles — data minimization, transparency, security, and user control"
        />
      </section>

      <section>
        <h2>Compliance Checklist</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GDPR Compliance</h3>
        <ul className="space-y-2">
          <li>Cookie consent before non-essential cookies</li>
          <li>Privacy policy accessible and clear</li>
          <li>Data access/deletion process</li>
          <li>Data processing agreements with vendors</li>
          <li>Breach notification procedure</li>
          <li>Data Protection Officer (if required)</li>
          <li>Records of processing activities</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CCPA Compliance</h3>
        <ul className="space-y-2">
          <li>&quot;Do Not Sell My Personal Information&quot; link</li>
          <li>Privacy policy with CCPA disclosures</li>
          <li>Data access/deletion process</li>
          <li>Non-discrimination for opt-out</li>
          <li>Respect GPC signal</li>
          <li>12-month lookback in privacy policy</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation</h3>
        <ul className="space-y-2">
          <li>Record of consent (who, when, what)</li>
          <li>Data inventory (what data, where, why)</li>
          <li>Third-party data sharing list</li>
          <li>Privacy impact assessments</li>
          <li>Data retention policies</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are GDPR cookie consent requirements?
            </p>
            <p className="mt-2 text-sm">
              A: Consent must be freely given, specific, informed, and
              unambiguous. No pre-checked boxes. Equal prominence to accept and
              reject. Clear description of what they&apos;re consenting to. Easy
              to withdraw consent. Block non-essential scripts until consent.
              Remember user choice. Allow granular choices per category.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement cookie consent?
            </p>
            <p className="mt-2 text-sm">
              A: Use consent management platform (OneTrust, Cookiebot) or custom
              implementation. Show banner on first visit. Block non-essential
              scripts until consent. Store consent in localStorage with
              timestamp. Load scripts after consent granted. Provide preference
              center to change consent. Respect GPC signal for opt-out.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is Global Privacy Control (GPC)?
            </p>
            <p className="mt-2 text-sm">
              A: GPC is a browser signal that tells websites &quot;do not sell
              or share my personal information.&quot; Required to honor in
              California (CCPA). Check navigator.globalPrivacyControl in
              browser. Treat GPC as opt-out request. Don&apos;t re-ask for 12
              months after opt-out. Supported in Firefox, Brave, Safari.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are dark patterns in consent design?
            </p>
            <p className="mt-2 text-sm">
              A: Dark patterns manipulate users into consenting. Examples:
              Hidden reject button, accept more prominent than reject, confusing
              language, pre-checked boxes, making withdrawal harder than
              consent, nagging users who reject. GDPR requires consent to be as
              easy to withdraw as to give. Avoid all manipulative designs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle data access/deletion requests?
            </p>
            <p className="mt-2 text-sm">
              A: Provide self-service portal or contact method. Verify user
              identity before fulfilling. Respond within legal timeframe (GDPR:
              30 days). Export all user data for access requests. Delete all
              user data for deletion requests (with legal exceptions). Document
              requests for compliance records. Don&apos;t discriminate against
              users who exercise rights.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://gdpr.eu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR.eu — GDPR Compliance Guide
            </a>
          </li>
          <li>
            <a
              href="https://oag.ca.gov/privacy/ccpa"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              California Attorney General — CCPA
            </a>
          </li>
          <li>
            <a
              href="https://globalprivacycontrol.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Global Privacy Control
            </a>
          </li>
          <li>
            <a
              href="https://www.iab.com/gdpr/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IAB — GDPR Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-analytics-tracking-cookie-consent-management",
  title: "Cookie Consent Management",
  description: "Staff-level cookie consent management: consent banner design, consent storage, propagation across systems, withdrawal handling, and compliance with GDPR, CCPA, and ePrivacy Directive.",
  category: "frontend",
  subcategory: "analytics-tracking",
  slug: "cookie-consent-management",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "analytics", "cookies", "consent", "gdpr", "ccpa", "privacy", "compliance"],
  relatedTopics: ["privacy-compliant-tracking", "event-tracking", "data-governance", "security-privacy"],
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
          <strong>Cookie consent management</strong> is the system for obtaining, storing, managing, and respecting user consent for cookie usage and tracking. It encompasses the consent banner (UI), consent storage (database), consent propagation (sharing consent status across systems), and consent withdrawal (allowing users to change their minds).
        </p>
        <p>
          Cookie consent is required by multiple regulations. GDPR (EU) requires opt-in consent before setting non-essential cookies. ePrivacy Directive (EU Cookie Law) specifically addresses cookie consent. CCPA (California) requires an opt-out mechanism for cookie-based tracking. Non-compliance carries severe penalties—GDPR fines can reach 4% of global revenue.
        </p>
        <p>
          For staff/principal engineers, cookie consent management requires balancing four competing concerns. <strong>Compliance</strong> means meeting all regulatory requirements for consent. <strong>User Experience</strong> means minimizing disruption while obtaining valid consent. <strong>Technical Integration</strong> means propagating consent to all tracking systems. <strong>Consent Rate</strong> means maximizing valid consent without dark patterns.
        </p>
        <p>
          The business impact of cookie consent management is significant and multifaceted. Compliance avoids fines, legal liability, and reputational damage. Low consent rates mean incomplete analytics data. Ad-based revenue depends on tracking consent. Transparent consent practices build trust, and dark patterns destroy it.
        </p>
        <p>
          In system design interviews, cookie consent management demonstrates understanding of regulatory requirements, distributed system coordination, state management, and the trade-offs between compliance and user experience. It shows you think about legal and ethical implications, not just technical implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <h3>Consent Requirements by Regulation</h3>
        <p>
          Different regulations have different consent requirements. <strong>GDPR (EU)</strong> applies to any organization processing EU residents' data. It requires explicit opt-in before setting non-essential cookies. Valid consent must be freely given, specific, informed, and unambiguous. It requires granularity with separate consent for different purposes like analytics and marketing. Users must be able to withdraw consent as easily as giving it. Maintain records of consent including who, when, what, and how.
        </p>
        <p>
          <strong>ePrivacy Directive (EU Cookie Law)</strong> requires consent for non-essential cookies. Strictly necessary cookies like shopping cart and authentication don't require consent. Member states implement differently, with some stricter than others.
        </p>
        <p>
          <strong>CCPA (California)</strong> applies to businesses collecting California residents' data. It requires an opt-out mechanism ("Do Not Sell My Personal Information"). Disclose cookie usage in the privacy policy. Opt-in is required for users under 16.
        </p>

        <h3>Cookie Categories</h3>
        <p>
          Cookies fall into different categories with different consent requirements. <strong>Strictly Necessary</strong> cookies are essential for service like shopping cart, authentication, and security. No consent is required. <strong>Functional</strong> cookies enhance experience like language preference and video player settings. Consent is recommended. <strong>Analytics</strong> cookies track user behavior. Consent is required under GDPR. <strong>Marketing</strong> cookies are for advertising and retargeting. Explicit consent is required.
        </p>
        <p>
          Best practice: Allow granular consent—users can consent to analytics but not marketing.
        </p>

        <h3>Consent Banner Design</h3>
        <p>
          Consent banner design impacts both compliance and consent rates. Compliant design requires the banner to appear before any non-essential cookies are set. Use clear language to explain what cookies are used and why in plain language. Allow granular choices with separate accept/reject for each category. Make "Accept" and "Reject" buttons equally prominent. All checkboxes must be unchecked by default—no pre-ticked boxes.
        </p>
        <p>
          Dark patterns to avoid include asymmetric buttons by making "Accept" prominent and "Reject" hidden, nagging by repeatedly showing the banner after the user rejected, forced consent by blocking access unless the user accepts, and confusing language by using legal jargon or misleading descriptions.
        </p>
        <p>
          Key insight: Dark patterns may increase consent rates short-term but risk regulatory action and user trust.
        </p>

        <h3>Consent Storage</h3>
        <p>
          Consent must be stored for compliance proof. Store consent with user identifier like user ID or device ID. Store consent choices for which categories were accepted or rejected. Record timestamp for when consent was given. Store version for the consent banner version (for policy changes). Record method for how consent was obtained like banner or settings.
        </p>
        <p>
          GDPR doesn't specify a retention period. Industry standard is 12 to 24 months. Refresh consent after expiry.
        </p>

        <h3>Consent Propagation</h3>
        <p>
          Consent status must be shared across all systems. Share consent with all tracking scripts on the client-side including analytics, ads, and widgets. Share consent with the backend for server-side tracking. Share consent with third-party vendors like Google and Facebook. For multi-domain sites, share consent across domains.
        </p>
        <p>
          Implementation: Use Consent Management Platform (CMP) API like IAB TCF for standardized consent propagation.
        </p>

        <h3>Consent Withdrawal</h3>
        <p>
          Users must be able to withdraw consent easily. Provide easy access to consent settings via a footer link or settings icon. Withdrawal must take effect immediately. Remove cookies for withdrawn categories. Stop all tracking for withdrawn categories. Withdrawal must be as easy as giving consent—this is a GDPR requirement.
        </p>
        <p>
          Implementation: Provide a "Cookie Settings" link in the footer. On click, show a consent management modal.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust consent management architecture treats consent as first-class system state with proper storage, propagation, and enforcement.
        </p>

        <h3>Consent Management Architecture</h3>
        <p>
          Implement a consent management system by displaying a consent banner on the first visit that explains cookies and obtains consent. Store consent in a cookie or localStorage and sync to the backend. Provide an API for checking consent status. Block tracking until consent is given. Allow users to change consent at any time.
        </p>
        <p>
          Implementation: Use a Consent Management Platform (CMP) like OneTrust, Cookiebot, or Sourcepoint, or build custom.
        </p>

        <h3>Consent Gating Architecture</h3>
        <p>
          Implement consent gating for all tracking by checking consent before loading any tracking script. Tag all scripts with consent category. Load scripts dynamically after consent is given. Queue tracking events until consent is given.
        </p>
        <p>
          Implementation: Use Google Tag Manager with consent mode or a custom script loader.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/gdpr-consent-flow.svg"
          alt="GDPR consent flow showing user visit triggering consent banner, user making choice, consent stored in cookie, and tracking scripts only loading after consent"
          caption="GDPR consent flow — banner before any tracking; store consent with timestamp; gate all scripts on consent status"
        />

        <h3>Consent Storage Architecture</h3>
        <p>
          Store consent for compliance and propagation. Store client-side in a cookie for cross-session and in localStorage for quick access. Sync consent to the backend for server-side tracking. Store consent record with user_id, consent choices, timestamp, version, and method. Log consent changes for compliance proof.
        </p>
        <p>
          Cookie name: Use standard name like cookie_consent or consent_id. Set secure and httpOnly flags.
        </p>

        <h3>Consent Propagation Architecture</h3>
        <p>
          Propagate consent to all systems. Use IAB TCF API for standardized consent access on the client-side. Provide an API for the backend to check consent status. Use Google Consent Mode and Facebook Limited Data Use for third-party integration. Use webhooks to notify systems when consent changes.
        </p>
        <p>
          IAB TCF is an industry standard for consent propagation, supported by major ad tech vendors.
        </p>

        <h3>Consent Expiry and Renewal</h3>
        <p>
          Implement consent expiry and renewal by setting a consent expiry period, typically 6 to 12 months. Check consent expiry on each visit. Show a banner when consent expires. Show a banner when the cookie policy changes significantly.
        </p>
        <p>
          Best practice: Renew consent every 12 months. Show a banner with "Review your choices" messaging.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/user-rights-architecture.svg"
          alt="User data rights architecture showing user requests (access, deletion, portability, rectification) flowing through request processing to data stores"
          caption="User rights handling — users can request access, deletion, or correction of their consent data; process within 30 days per GDPR"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/analytics-tracking/consent-gating-architecture.svg"
          alt="Consent gating architecture showing event queue holding events, consent check decision, and routing to tracking systems based on consent category"
          caption="Consent gating — check consent before any tracking; queue events until consent; respect withdrawal immediately"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Consent management involves trade-offs between compliance, user experience, and consent rates. CMP solutions like OneTrust provide the best compliance, fair UX, and good consent rate. This is best for enterprise and regulated organizations. Custom banner provides good compliance, the best UX, and variable consent rate. This is best for smaller organizations. Privacy-first (no consent) provides the best compliance and the best UX, but consent rate is N/A. This is best for privacy-focused sites.
        </p>
        <p>
          The staff-level insight is that CMP is worth it for enterprise. Compliance risk outweighs cost. For smaller sites, a custom banner with privacy-first analytics may suffice.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use a CMP for enterprise like OneTrust, Cookiebot, or Sourcepoint for compliance assurance. Allow granular consent with separate consent for analytics, marketing, and functional. Make "Accept" and "Reject" equally prominent. All checkboxes must be unchecked by default—no pre-ticked boxes.
        </p>
        <p>
          Provide easy withdrawal by providing a "Cookie Settings" link accessible from every page. Store consent records to maintain an audit trail for compliance proof. Renew periodically by renewing consent every 12 months. Test regularly by testing consent gating to ensure tracking is blocked before consent.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Tracking before consent by loading tracking scripts before the user consents violates GDPR. Pre-ticked boxes are invalid consent under GDPR. Asymmetric buttons by making "Reject" harder to find than "Accept" is a dark pattern.
        </p>
        <p>
          No withdrawal by not providing easy consent withdrawal violates GDPR. Bundled consent by bundling analytics consent with terms of service is invalid. No records means you can't prove compliance without documentation. Ignoring third-party scripts means they must also respect consent.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>News Site: GDPR Compliance with CMP</h3>
        <p>
          A news site had EU traffic but no GDPR-compliant consent. The solution was implementing OneTrust CMP with granular consent for analytics and marketing, consent gating for all scripts, and consent records stored for 2 years. The site achieved GDPR compliance with a 60% consent rate for analytics and zero compliance incidents.
        </p>

        <h3>E-Commerce: Google Consent Mode</h3>
        <p>
          An e-commerce site needed to maintain Google Ads functionality with consent restrictions. The solution was implementing Google Consent Mode. When consent is denied, Google uses modeled conversions instead of tracked. This maintained ad optimization with a 40% consent denial rate while remaining GDPR compliant.
        </p>

        <h3>SaaS: Custom Consent Banner</h3>
        <p>
          A SaaS company wanted a simple, branded consent experience. The solution was building a custom consent banner, storing consent in localStorage, syncing to the backend, and providing a settings modal. This had lower cost than a CMP, achieved a 70% consent rate, and passed a compliance audit.
        </p>

        <h3>Media Site: Consent Renewal</h3>
        <p>
          A media site had old consent records (2+ years) that may not be valid. The solution was implementing a consent renewal campaign by showing a banner to all users with expired consent with "Review your choices" messaging. This achieved an 80% renewal rate with fresh consent records and reduced compliance risk.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are the requirements for valid GDPR consent?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Freely given means no coercion or negative consequences for refusing. Specific means separate consent for different purposes. Informed means clear explanation of what cookies are used and why. Unambiguous means clear affirmative action like click or toggle—no pre-ticked boxes.
            </p>
            <p>
              Consent must be obtained before setting non-essential cookies. Withdrawal must be as easy as giving consent.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you implement consent gating for tracking scripts?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Check before load by checking consent status before loading any tracking script. Tag scripts with consent category like analytics or marketing. Load scripts dynamically after consent is given. Queue tracking events until consent is given.
            </p>
            <p>
              Implementation: Use Google Tag Manager with consent mode or a custom script loader that checks consent before injecting scripts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle consent withdrawal?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Provide accessible settings with a "Cookie Settings" link from every page. Ensure immediate effect by stopping tracking immediately when consent is withdrawn. Delete cookies for withdrawn categories. Notify all tracking systems of the consent change.
            </p>
            <p>
              GDPR requires withdrawal to be as easy as giving consent. Don't hide settings or require multiple clicks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is Google Consent Mode and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Google Consent Mode is a Google API that adjusts tracking based on consent status. When consent is denied, Google uses cookieless pings and modeled conversions instead of tracked data. The benefit is maintaining some ad optimization even with consent denial while remaining compliant.
            </p>
            <p>
              Use when running Google Ads with GDPR requirements. Helps maintain ad performance with partial consent.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are common consent banner mistakes?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Pre-ticked boxes are invalid under GDPR. Asymmetric buttons by making "Reject" harder to find is a dark pattern. Tracking before consent by loading scripts before the user decides. Bundled consent by combining analytics consent with terms of service. No withdrawal by not providing an easy way to change consent.
            </p>
            <p>
              These mistakes can invalidate consent and result in compliance violations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How long should you retain consent records?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              GDPR has no specific period—it must be "no longer than necessary." Industry standard is 12 to 24 months for active consent. Retain records long enough to prove compliance if audited. Renew consent after the expiry period, typically 12 months.
            </p>
            <p>
              Best practice: Retain consent records for 12 months, then renew. Keep an audit trail of consent changes.
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
            <a href="https://gdpr.eu/cookies/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              GDPR.eu: Cookies
            </a> — GDPR cookie consent requirements.
          </li>
          <li>
            <a href="https://support.google.com/analytics/answer/9976101" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google: Consent Mode
            </a> — Google Consent Mode documentation.
          </li>
          <li>
            <a href="https://www.onetrust.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OneTrust
            </a> — Leading consent management platform.
          </li>
          <li>
            <a href="https://www.cookiebot.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cookiebot
            </a> — Cookie consent management solution.
          </li>
          <li>
            <a href="https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              IAB TCF
            </a> — Industry standard for consent propagation.
          </li>
          <li>
            <a href="https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              EDPB: Consent Guidelines
            </a> — Official EU consent guidance.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

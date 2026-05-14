"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-privacy-consent-management",
  title: "Design a Privacy & Consent Management System",
  description:
    "Architecture for a GDPR/CCPA-compliant privacy and consent management system: cookie consent banner with granular category toggles (necessary, analytics, marketing, personalization), consent version tracking and re-prompting on policy updates, consent storage in a tamper-proof audit log, data subject rights UI (access, deletion, portability requests), privacy preference center, consent propagation to third-party tags via a tag manager integration, cookie scanning and categorization, and Do Not Sell / Do Not Track signal handling.",
  category: "high-level-design",
  subcategory: "security-auth-privacy-systems",
  slug: "privacy-consent-management",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "gdpr", "ccpa", "consent-management", "cookie-banner", "data-rights", "privacy", "tag-manager", "cmp"],
  relatedTopics: ["permission-access-control-ui", "secure-token-session-handling"],
};

export default function PrivacyConsentManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A privacy and consent management system (CMP) handles the legal and technical requirements of GDPR (EU), CCPA (California), LGPD (Brazil), and similar regulations. The core requirement: users must give informed, specific, and freely-given consent before their data is processed for non-essential purposes (analytics, marketing, personalization). The CMP must: (1) collect consent through an unambiguous UI (no pre-checked boxes, no dark patterns, reject must be as easy as accept); (2) store consent records with timestamps and policy version; (3) enforce consent by preventing non-consented data collection; and (4) provide data subject rights mechanisms (access, deletion, portability).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The technical challenge: consent must be collected before any analytics or marketing scripts run. A cookie banner that loads after Google Analytics has already fired a pageview is legally non-compliant (you collected data before getting consent). The CMP must be in the critical path — it runs before any third-party scripts, evaluates existing consent, and either allows scripts to run (consented) or blocks them until consent is obtained. This makes the CMP performance-critical: a slow banner delays the entire page.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Consent banner UI, granular category consent, consent storage and versioning, third-party script blocking, and data subject rights UI. Not in scope: backend data deletion pipelines, consent string encoding standards (IAB TCF), or cross-device consent synchronization at scale.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Consent banner:</strong> A non-intrusive banner (bottom of screen, not a full-page overlay) appears on first visit. It shows: "We use cookies for analytics and personalization. Accept all / Manage preferences / Reject all." "Reject all" must be as prominent as "Accept all" (same button size and style — GDPR requirement). "Manage preferences" opens a preference center with category-level toggles. Necessary cookies (session management, security) are always on and non-toggleable. Each category explains in plain language what data is collected and why.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Consent storage:</strong> Consent is stored in two places: (1) a first-party cookie (consent-token, 1-year expiry, HttpOnly: false so JS can read it) containing the consent record — &#123;version: "2.3", timestamp: "2026-05-12T...", categories: &#123;analytics: true, marketing: false, personalization: true&#125;, method: "explicit"&#125;; (2) the backend consent audit log (POST /api/consent with the same record + IP hash + user agent) — immutable for compliance evidence. The cookie is the fast-path for checking consent on page load; the server record is the authoritative compliance evidence.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Consent version tracking:</strong> When the privacy policy changes materially (new data categories, new third parties), the consent version increments. On page load, the CMP compares the current policy version with the version stored in the user's consent cookie. If they differ, the banner re-appears for re-consent. Previously consented categories are pre-selected but the user must actively reconfirm. Soft updates (wording changes, not new data collection) do not trigger re-consent.</HighlightBlock>
          <li><strong>Third-party script blocking:</strong> Before consent is obtained, analytics and marketing scripts are blocked using a tag manager integration (Google Tag Manager with consent mode, or a custom script loader). The CMP exports a consent state object that the tag manager reads. Scripts tagged with "analytics" category only fire if analytics consent is true. The script blocking is implemented by holding script loading in a promise that resolves when consent is obtained, or immediately if existing consent is found in the cookie.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Performance:</strong> The CMP must resolve the consent state (from the cookie) within 50ms on page load. The consent check is synchronous (no async network call) — it reads the first-party cookie immediately. The banner UI itself is lazy-loaded (only loads the banner component code if the user has not yet consented). For already-consented users, the CMP adds zero perceptible latency.</HighlightBlock>
          <li><strong>Data subject rights:</strong> An authenticated user can submit: Data Access Request (generates a downloadable ZIP of all personal data within 30 days), Data Deletion Request (removes personal data from all systems within 30 days), Data Portability Request (JSON export of data in machine-readable format). Requests are submitted via the privacy settings page and tracked with a request ID. Users receive email updates on request status (received, processing, complete). The UI shows pending requests with their current status and estimated completion date.</li>
          <li><strong>Do Not Track / Global Privacy Control:</strong> If the browser sends a DNT: 1 header or the Navigator.globalPrivacyControl property is true (GPC signal), the CMP defaults to rejecting all optional cookies and does not show the banner (in CCPA-applicable regions, GPC is legally binding). The GPC check is performed in the CMP's initialization code (reading navigator.globalPrivacyControl).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The CMP architecture has a critical performance constraint: it must complete the consent check before any third-party scripts load. Implementation: the CMP script is the first inline script in the HTML &lt;head&gt; (not async, not deferred — it must execute synchronously). It: (1) reads the consent cookie synchronously; (2) checks if consent version matches the current policy version; (3) if consented and current, sets window.__consent = &#123;analytics: true, ...&#125; and allows the tag manager to proceed; (4) if not consented or outdated, blocks the tag manager (by not setting window.__consent) and lazy-loads the banner component. The banner and preference center are React components loaded on-demand via dynamic import — they add no weight to the initial page load for consented users.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/privacy-consent-management.svg"
          alt="Privacy and consent management system: CMP init (inline script in head, no async; read consent cookie; version match? yes → set window.__consent → GTM proceeds; no → block GTM, lazy-load banner), consent banner (bottom banner non-intrusive; Accept All / Reject All same prominence; Manage Preferences → category toggles; Necessary always on; GDPR: reject as easy as accept), consent storage (first-party cookie: &#123;version, timestamp, categories, method&#125; 1yr; POST /api/consent immutable audit log + IP hash + UA; version compare on each load), third-party blocking (GTM consent mode: analytics tag fires only if window.__consent.analytics===true; marketing blocked until marketing:true; script loader promise resolves on consent), data subject rights (authenticated: submit access/deletion/portability request; GET /api/privacy/requests status list; ZIP download link; 30-day SLA email updates), GPC signal (navigator.globalPrivacyControl===true → default all optional=false, no banner shown; DNT:1 header → same; CCPA binding)."
          caption="CMP inline script (synchronous consent check before GTM), consent cookie + server audit log (version tracking, re-consent on policy change), GTM consent mode blocking (analytics/marketing wait for window.__consent), data subject rights UI (access/deletion/portability requests, 30-day SLA), GPC/DNT signal auto-reject, reject-as-easy-as-accept GDPR compliance"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CMP Initialization and Script Blocking</h3>
        <HighlightBlock as="p" tier="important">The CMP initialization script (2–3KB, inlined in the HTML &lt;head&gt;) runs synchronously before any other scripts. It defines a global function window.__cmp that the tag manager calls to check consent. The initialization flow: (1) Parse the consent cookie (document.cookie lookup for "consent-token"); (2) If cookie exists and version matches CURRENT_POLICY_VERSION, decode it and set window.__consent = &#123;analytics: true, marketing: false, personalization: true&#125;; (3) If cookie is absent, outdated, or GPC signal is present (navigator.globalPrivacyControl), set window.__consent = &#123;analytics: false, marketing: false, personalization: false&#125; and schedule banner loading after paint; (4) The tag manager defers firing any non-necessary tags until window.__consent is populated with the user's affirmative choices. Google Tag Manager's built-in consent mode handles this automatically — tags wait for the consent_update event before firing.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The consent cookie is not HttpOnly (it must be readable by JavaScript for the synchronous check). It is marked Secure (HTTPS only) and SameSite=Lax (prevents cross-site cookie sending while allowing top-level navigations). The cookie has a 1-year expiry but is re-evaluated on every page load to check the version.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Consent Banner UX and Dark Patterns</h3>
        <HighlightBlock as="p" tier="crucial">GDPR requires that consent be freely given, specific, informed, and unambiguous. Dark patterns (pre-checked boxes, "Accept" in a large green button vs. "Reject" hidden in small grey text, "Manage preferences" requiring 5 clicks to reject all) are explicitly prohibited. The CMP design principles: (1) "Accept all" and "Reject all" must be the same visual weight and size; (2) no pre-checked optional categories in the preference center; (3) "Manage preferences" must not be harder than accepting — the toggle to decline all must be one click; (4) the banner cannot obscure the entire page or prevent scrolling (intrusive banners that force interaction before the user can see content are prohibited in many EU jurisdictions); (5) withdrawing consent must be as easy as giving it — a persistent "Privacy preferences" link in the footer opens the preference center at any time.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The preference center is a modal (or a dedicated page on mobile) with one row per consent category: Necessary (forced on, greyed toggle), Analytics ("Help us improve by collecting usage statistics"), Marketing ("Receive personalized offers"), Personalization ("Remember your preferences"). Each category has an expandable "See details" section listing the specific third-party services and data collected (e.g., Analytics: Google Analytics, Mixpanel — stores anonymized pageview events for 26 months).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Data Subject Rights UI</h3>
        <HighlightBlock as="p" tier="important">The data subject rights section lives in the authenticated user's account settings (/settings/privacy). Three request types: (1) Access Request — "Download all my data." The UI shows: a description of what data will be included, an estimated completion time (30 days by law, typically 3–5 days in practice), and a submit button. On submit, a request record is created with status "Received" and the user gets a confirmation email with the request ID. When the data export is ready (generated asynchronously), the user receives an email with a secure time-limited download link (pre-signed S3 URL, 7-day expiry). (2) Deletion Request — "Delete all my personal data." Same UX flow plus a 14-day cancellation period (the user can cancel before deletion is permanent). (3) Portability — same as access but in machine-readable JSON format instead of a user-friendly export.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Request status display: GET /api/privacy/requests returns all pending and completed requests. Each request shows: type icon, submission date, current status (Received, Processing, Complete), estimated completion date. Completed access/portability requests show a download button (re-fetches the pre-signed URL on click). The UI polls GET /api/privacy/requests every 60 seconds while the page is open to update status without requiring a page reload.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Consent Version Management</h3>
        <HighlightBlock as="p" tier="important">Consent versions are managed in a server-side config: &#123;version: "2.3", required_reconsent: true, changes: "Added new data retention periods and three new marketing partners"&#125;. The current version is embedded in the page HTML (as a &lt;meta name="consent-version" content="2.3"&gt; tag) so the synchronous CMP script can compare it without a network request. When the version changes, the CMP script detects the mismatch and shows the consent banner again, with a prominent notice: "Our privacy policy has been updated. Please review and update your preferences." The notice summarizes the changes (from the changes field) so users can make an informed decision. Previously given consents are preserved as defaults in the toggle UI but are not legally valid until the user actively clicks "Save preferences" or "Accept all."</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Consent before analytics vs. accurate analytics: blocking analytics scripts before consent means you have incomplete data for users who reject analytics. This is unavoidable under GDPR — you cannot collect data without consent, and consent cannot be obtained through dark patterns. Practical approaches: use consent-mode (anonymized, aggregate analytics without individual tracking) for non-consenting users; use server-side first-party analytics (no third-party cookies, cookieless measurement) which may not require consent in some interpretations; or accept that analytics for EU users will have a gap. The analytics gap is a business decision, not a technical one.</HighlightBlock>
        <HighlightBlock as="p" tier="important">First-party cookie vs. server-side consent storage: the first-party cookie provides fast synchronous consent checking (no network round trip). But cookies can be cleared by the user or browser. The server-side consent record is the authoritative compliance evidence but requires a network request to check. The dual-storage approach (cookie for speed + server for compliance) is the right pattern. The server record should include enough context to demonstrate compliance to a data protection authority: timestamp, IP hash (anonymized), user agent, policy version, and the specific consent choices made.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A privacy and consent management system requires: (1) synchronous CMP initialization (inline script in &lt;head&gt;, reads consent cookie before any third-party scripts, sets window.__consent for GTM consent mode); (2) GDPR-compliant banner (reject as easy as accept, no pre-checked boxes, persistent footer link to re-open preferences); (3) dual consent storage (first-party cookie for speed + immutable server audit log with IP hash for compliance); (4) consent version management (version embedded in page HTML, mismatch triggers re-consent banner with change summary); (5) GTM consent mode integration (analytics/marketing tags wait for affirmative window.__consent categories); (6) data subject rights UI (access/deletion/portability requests with 30-day SLA, request status polling, secure pre-signed download links); and (7) GPC/DNT auto-reject (navigator.globalPrivacyControl → default all optional=false, no banner). The defining constraint: compliance is not optional — every architectural shortcut that makes analytics more convenient at the expense of genuine user consent creates legal liability.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

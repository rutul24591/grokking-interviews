"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-social-login",
  title: "Social Login Options",
  description: "Comprehensive guide to implementing social login covering OAuth providers, button design, account linking, permission handling, and conversion optimization for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "social-login-options",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "social-login", "oauth", "frontend", "conversion"],
  relatedTopics: ["oauth-providers", "signup-interface", "login-interface", "account-linking"],
};

export default function SocialLoginOptionsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Social Login Options</strong> allow users to authenticate using existing 
          accounts from providers like Google, Facebook, Apple, GitHub, and Microsoft. 
          Social login reduces signup friction, improves conversion rates, and eliminates 
          password management overhead for users.
        </p>
        <p>
          For staff and principal engineers, implementing social login requires understanding 
          OAuth flows, provider-specific requirements, button placement and design, account 
          linking strategies, and conversion optimization. The implementation must provide 
          seamless UX while maintaining security and respecting user privacy.
        </p>
      </section>

      <section>
        <h2>Provider Selection</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Common Providers</h3>
          <ul className="space-y-3">
            <li>
              <strong>Google:</strong> Highest adoption, trusted, provides email/name/photo. 
              Required for Android apps.
            </li>
            <li>
              <strong>Apple:</strong> Required for iOS apps offering other social logins 
              (App Store guideline). Privacy-focused (hide email option).
            </li>
            <li>
              <strong>Facebook:</strong> Large user base, declining usage. Requires app 
              review for permissions.
            </li>
            <li>
              <strong>GitHub:</strong> Developer-focused apps. Provides repos/orgs for 
              developer tools.
            </li>
            <li>
              <strong>Microsoft:</strong> Enterprise apps, Office 365 integration. Azure 
              AD for B2B.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Provider Selection Criteria</h3>
          <ul className="space-y-3">
            <li>
              <strong>Target Audience:</strong> Consumer apps (Google, Apple, Facebook). 
              Developer apps (GitHub, GitLab). Enterprise (Microsoft, Okta).
            </li>
            <li>
              <strong>Geography:</strong> Regional providers (WeChat in China, LINE in 
              Japan, Kakao in Korea).
            </li>
            <li>
              <strong>Privacy:</strong> Apple for privacy-focused users. Minimal data 
              sharing.
            </li>
            <li>
              <strong>Platform:</strong> iOS requires Apple if offering other social 
              logins.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>UI Implementation</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Button Placement</h3>
          <ul className="space-y-3">
            <li>
              <strong>Above Email Form:</strong> Maximum visibility, highest conversion. 
              Users see social options first.
            </li>
            <li>
              <strong>Below Email Form:</strong> Secondary option. Users consider email 
              first.
            </li>
            <li>
              <strong>Side-by-Side:</strong> Equal prominence with email signup. More 
              visual complexity.
            </li>
            <li>
              <strong>Separate Tab:</strong> "Sign in with Email" vs "Sign in with 
              Social". Not recommended (adds friction).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Button Design</h3>
          <ul className="space-y-3">
            <li>
              <strong>Official Assets:</strong> Use provider's brand guidelines (colors, 
              logos, sizing). Don't modify logos.
            </li>
            <li>
              <strong>Full-Width:</strong> Mobile-friendly, prominent. Stack vertically 
              on mobile.
            </li>
            <li>
              <strong>Clear Label:</strong> "Continue with Google", "Sign in with Apple". 
              Action-oriented.
            </li>
            <li>
              <strong>Loading State:</strong> Show spinner on button during OAuth 
              redirect. Prevent double-clicks.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Permission Display</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pre-Consent:</strong> Show what data will be accessed ("We'll 
              access your email and name").
            </li>
            <li>
              <strong>Minimal Scopes:</strong> Request only necessary permissions. 
              Additional scopes later if needed.
            </li>
            <li>
              <strong>Privacy Notice:</strong> Link to privacy policy near social buttons.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Account Linking</h2>
        <ul className="space-y-3">
          <li>
            <strong>Email Match:</strong> If social email matches existing account, prompt 
            to link. Verify password first.
          </li>
          <li>
            <strong>Multiple Providers:</strong> Allow linking multiple social accounts 
            to one account.
          </li>
          <li>
            <strong>Unlinking:</strong> Allow removing social accounts. Require at least 
            one auth method.
          </li>
          <li>
            <strong>Conflict Resolution:</strong> If social email already registered 
            separately, offer merge or use different email.
          </li>
        </ul>
      </section>

      <section>
        <h2>Conversion Optimization</h2>
        <ul className="space-y-3">
          <li>
            <strong>A/B Test Placement:</strong> Test above/below email form. Measure 
            conversion impact.
          </li>
          <li>
            <strong>Track Provider Performance:</strong> Which provider converts best? 
            Optimize order/prominence.
          </li>
          <li>
            <strong>Reduce Friction:</strong> One-click social login vs multi-step email 
            signup. Highlight speed.
          </li>
          <li>
            <strong>Trust Signals:</strong> "10M+ users sign in with Google". Social 
            proof increases adoption.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Which social providers should you support?</p>
            <p className="mt-2 text-sm">
              A: Minimum: Google (universal), Apple (iOS requirement). Add based on 
              audience: Facebook (consumer), GitHub (developers), Microsoft (enterprise). 
              Track usage, remove unused providers. Consider regional providers for 
              specific markets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle Apple's hide email feature?</p>
            <p className="mt-2 text-sm">
              A: Apple generates relay email (@privaterelay.appleid.com). Store as-is, 
              forward to user's real email. Can't contact directly. Respect privacy 
              choice—don't attempt to deanonymize. User can change to real email later.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should social login replace email signup?</p>
            <p className="mt-2 text-sm">
              A: No, offer both. Some users prefer email (privacy, no social account). 
              Email provides direct communication channel. Social login for convenience. 
              Track split and optimize.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle social provider outages?</p>
            <p className="mt-2 text-sm">
              A: Graceful degradation: hide provider button if down (health check), 
              fallback to email signup, circuit breaker pattern. Never block all auth 
              due to one provider outage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What data do you request from social providers?</p>
            <p className="mt-2 text-sm">
              A: Minimum: email, name, profile photo. Additional data requires justification 
              and user consent. Request additional scopes when needed (not at signup). 
              Respect provider rate limits and terms.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle social login for users with multiple accounts?</p>
            <p className="mt-2 text-sm">
              A: Check if social email matches existing accounts. If multiple matches, 
              show account selector. If no match, create new account. Allow linking 
              social to existing account with password verification.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

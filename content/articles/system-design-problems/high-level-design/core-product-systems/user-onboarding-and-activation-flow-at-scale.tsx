"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-user-onboarding-activation-flow",
  title: "Design a User Onboarding & Activation Flow at Scale",
  description:
    "Architecture for scalable user onboarding: progressive profiling, activation milestone tracking, personalization, A/B testing, fraud detection, and retention loop integration.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "user-onboarding-and-activation-flow-at-scale",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "onboarding", "activation", "A/B-testing", "progressive-profiling", "fraud-detection"],
  relatedTopics: ["feature-flag-system", "feature-rollout-system"],
};

export default function UserOnboardingActivationFlowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>User onboarding is the first experience a new user has with a product, and activation is the moment they first experience the product's core value. The distinction matters: onboarding is the process (account creation, profile setup, tutorial); activation is the outcome (the user does the thing that makes them likely to return). For Slack, activation might be "sent their first message to a coworker"; for Spotify, "listened to a full album"; for Airbnb, "completed their first booking." Designing the onboarding flow to drive users toward activation—not just to collect profile data—is the core product design challenge.</p>
        <HighlightBlock as="p" tier="crucial">At scale (millions of new user signups per month), onboarding must be personalized (different flows for users who signed up via different channels, different user segments, different device types), measurable (activation milestone events must be tracked to compute activation rates and A/B test variations), and resilient to fraud (bot signups, fake accounts, and referral fraud inflate activation metrics and consume resources). The engineering challenge is building these capabilities without creating a monolithic onboarding system that is difficult to iterate on.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The platform acquires users via paid marketing (ads), organic search, referral programs, and app store. Different acquisition channels warrant different onboarding flows (a user who clicked a specific ad should land in a flow optimized for that ad's value proposition). The activation milestone is product-specific and must be configurable without code deployment. The onboarding flow must support A/B testing of individual steps (not just full flow variants). Fraud detection runs asynchronously and can flag accounts for review without blocking the onboarding flow.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Multi-step onboarding flow:</strong> Registration (email/OAuth) → email verification → profile setup (progressive, not all-at-once) → personalization (preferences, interests) → product tour (interactive, skippable) → first value action.</li>
          <li><strong>Channel-specific flows:</strong> Users arriving from different acquisition channels (referral link, ad campaign, organic search) see different onboarding variants tailored to the source context.</li>
          <li><strong>Progressive profiling:</strong> Collect only the information needed at each step; defer non-critical profile data to later (after the user has experienced value). Do not front-load the registration form with 10 fields.</li>
          <li><strong>Activation milestone tracking:</strong> Define activation events (e.g., "user sends first message") and track which users have completed them. Compute activation rate by cohort.</li>
          <li><strong>Personalization:</strong> Use early profile signals (interests, role, team size) to personalize the product experience immediately—show relevant content, suggest relevant connections, pre-configure relevant features.</li>
          <li><strong>A/B testing integration:</strong> Individual steps of the onboarding flow can be A/B tested independently. New flow variants deploy via feature flags without code deployment.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Registration speed:</strong> Account creation must complete in under 2 seconds (email/password). OAuth registration under 1 second after the OAuth callback.</li>
          <li><strong>Scale:</strong> Handle 10,000 concurrent registrations per second at peak (post-viral event, Super Bowl ad airing). The registration endpoint must be horizontally scalable with no single-point bottleneck.</li>
          <li><strong>Email delivery:</strong> Verification email delivered within 30 seconds of registration in 99.9% of cases.</li>
          <li><strong>Fraud resilience:</strong> Bot signup rate should not exceed 0.1% of registered accounts. Fraudulent referral claims should be detected and reversed within 24 hours.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The onboarding system is composed of three services. The Registration Service handles account creation, email/OAuth authentication, and email verification. It is stateless, horizontally scalable, and backed by a write-optimized database (PostgreSQL with connection pooling). The Onboarding State Service manages each user's progress through the onboarding flow, records completed steps, applies flow assignments (which variant the user is in based on acquisition channel and A/B test bucket), and exposes the current step for the frontend to render. The Activation Tracking Service records milestone events (from both the onboarding flow and subsequent product usage), computes cohort activation rates, and feeds data to the personalization and retention systems.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/user-onboarding-and-activation-flow-at-scale-architecture.svg"
          alt="User onboarding architecture showing registration service (account creation, OAuth, email verification via SES), onboarding state service (flow assignment by acquisition channel + A/B bucket, step tracking, progressive profiling), activation tracking (milestone events → Kafka → analytics + personalization engine), fraud detection pipeline (async risk scoring, account flagging), and A/B test framework integration."
          caption="Onboarding architecture: registration → channel-specific flow assignment → progressive profiling → activation milestone tracking → personalization feedback loop"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Registration at Scale</h3>
        <HighlightBlock as="p" tier="crucial">The registration endpoint must handle 10,000 concurrent requests per second. The bottleneck is usually the database write (creating the user record). Three patterns enable scale: write-ahead with async enrichment (create a minimal user record synchronously—email, hashed password, userId, createdAt—and defer profile setup, welcome email, and analytics events to asynchronous workers); connection pooling (PgBouncer in front of PostgreSQL to multiplex thousands of application connections into a manageable pool of 50–200 database connections); and idempotency (if the user's browser submits the registration form twice due to a double-click or network retry, the second request returns the already-created account rather than creating a duplicate—enforced via a unique constraint on the email field and an upsert or 409 Conflict response for duplicate email).</HighlightBlock>
        <p>OAuth registration (Google, Apple, GitHub sign-in) is simpler than email/password from a database perspective (no password hashing) but adds complexity in account linking: if a user previously registered with email and later signs in with Google using the same email, should the system link the accounts? The common behavior (used by Slack, Notion, GitHub) is to link accounts automatically when the OAuth provider's email matches an existing account, with the user's consent ("We found an existing account with this email. Link your Google account?"). This requires querying by email before creating a new user record, which is an additional database lookup on the registration path.</p>
        <HighlightBlock as="p" tier="important">Email verification: the registration endpoint returns a success response immediately (the user sees the next onboarding step) while the verification email is sent asynchronously via a transactional email service (AWS SES, Postmark). The email contains a verification link with a signed token (HMAC-SHA256 of userId + email + secret, with a 24-hour expiry). Clicking the link verifies the account. Certain features (sharing content with others, inviting team members) are gated behind email verification; core product usage is not, to avoid blocking new users from experiencing value before they verify. This progressive verification model (verify to unlock collaboration features, not to use the product at all) improves verification completion rates by giving users a reason to complete it rather than making it a prerequisite.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Onboarding Flow as a State Machine</h3>
        <HighlightBlock as="p" tier="important">The onboarding flow is modeled as a directed graph of steps with conditional transitions. Each step has a stepId, a component to render, a completion condition (user submits the step's form, user clicks "Skip"), and next step rules (if the user selected "individual" in step 2, go to step 3A; if "team", go to step 3B). The flow definition is stored in a database and loaded by the Onboarding State Service—not hardcoded in the frontend. This means flow changes (adding a step, modifying the completion condition, A/B testing a variant) are backend configuration changes that do not require frontend deployment.</HighlightBlock>
        <p>The user's current position in the flow is stored in the Onboarding State Service: (userId, flowId, currentStepId, completedSteps, flowVariant, assignedAt). The frontend calls GET /onboarding/current-step at startup; the Onboarding State Service returns the step to render. After the user completes a step, the frontend calls POST /onboarding/complete-step with the step's output (the answers to that step's form). The service records the completion, evaluates the transition rules, advances the currentStepId, and returns the next step. This server-authoritative flow state enables resumption: a user who closes the app mid-onboarding resumes from the correct step on next open.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Channel Attribution and Flow Personalization</h3>
        <p>Acquisition channel attribution is captured from UTM parameters in the registration URL: utm_source (e.g., google, facebook, newsletter), utm_medium (cpc, organic, email), utm_campaign (campaign name), and referralCode (for referral program attribution). These parameters are stored alongside the user record (attributionSource, attributionMedium, attributionCampaign, referrerId). The Onboarding State Service uses the attribution source to assign the user to a channel-specific flow variant: a user from a "team collaboration" ad campaign sees an onboarding flow emphasizing collaboration features; a user from a "personal productivity" campaign sees a flow emphasizing individual features. This targeting is configured as rules in the flow assignment engine, evaluated at the moment of registration.</p>
        <p>A/B test assignment is layered on top of channel-specific flow assignment: within a given channel's flow, individual steps may have A/B test variants. The user is assigned to a variant using consistent hashing on (userId, testId) plus a rollout threshold (for example: hash into 0–99, then compare to a rollout percentage). This assignment is deterministic (the same user always gets the same variant) and consistent (the variant does not change mid-onboarding if the test configuration changes). The variant assignment is recorded in the onboarding state and in the analytics events, enabling downstream comparison of activation rates between control and treatment groups.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Activation Milestone Tracking</h3>
        <HighlightBlock as="p" tier="important">Activation milestones are events that the product team has identified as predictive of long-term retention. They are defined in a configuration (not hardcoded) with fields like: milestoneId, eventType, conditions (for example, recipient type is coworker), and a human-readable description. When the user completes the corresponding action anywhere in the product, the event is published to a Kafka topic. A milestone evaluator consumer checks each event against the registered milestone conditions; when a match is found, the milestone is recorded for the user (userId, milestoneId, completedAt, sessionId).</HighlightBlock>
        <p>Activation rate is computed as the percentage of users who complete the activation milestone within N days of registration (N is product-specific, typically 7–30 days). This metric is computed by cohort (registration week, acquisition channel, A/B test variant). The activation rate by A/B variant is the primary metric for evaluating onboarding changes: a new step variant is successful if it increases the activation rate (not just step completion rate—a step that is easy to complete but does not drive activation is worse than a harder step that does). Cohort analysis requires joining the milestone completion table with the registration table (by userId, cohort week, variant); this analysis runs in the data warehouse (BigQuery, Snowflake), not in the production database.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Fraud Detection and Referral Abuse Prevention</h3>
        <HighlightBlock as="p" tier="important">Bot signups and referral abuse are the primary fraud vectors during onboarding. Bot signups are detected by a combination of: CAPTCHA or invisible challenge (reCAPTCHA v3, which runs invisibly and scores each session's risk), device fingerprinting (a device that has registered 5 accounts in the past hour is likely a bot), email pattern analysis (temporary email addresses, random character patterns), and behavioral signals (registration form completed in under 2 seconds is suspicious—humans take longer). Accounts with a high fraud risk score are flagged for async review rather than blocked synchronously (blocking introduces false positives that harm legitimate users; async review is more accurate).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Referral fraud occurs when users generate large numbers of fake signups using their referral code to claim referral rewards. Detection: monitor referral conversions per referrer (a user who generates 50 referrals in one day is suspicious); require each referred user to complete an activation milestone before the referral reward is credited (rather than crediting on signup—this makes referral farming unprofitable since fake accounts are unlikely to activate); delay reward crediting by 48 hours to allow fraud review. Fraudulent referral rewards are reversed and the referrer's account is flagged for review. A referral fraud score is computed per referrer based on the activation rate of their referred users—a referrer whose referred users never activate is likely generating fake signups.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/user-onboarding-and-activation-flow-at-scale-fraud.svg"
          alt="Onboarding fraud detection showing bot signup detection (reCAPTCHA v3 risk score, device fingerprint, email pattern, behavioral timing), referral fraud detection (activation rate per referrer, 48-hour reward delay, per-referrer conversion velocity), async account review pipeline, and referral reward reversal flow."
          caption="Onboarding fraud detection: bot scoring via reCAPTCHA + fingerprint, referral fraud via activation-gated rewards and conversion velocity monitoring"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Minimal registration versus comprehensive upfront profiling: asking for extensive profile information upfront (name, role, company size, use case, team members) provides data for personalization but increases registration friction and reduces completion rates. Progressive profiling (ask for the minimum at signup, request additional information contextually within the product as it becomes relevant) consistently shows higher registration completion rates but results in partially complete profiles for churned users who never returned after signup. The right balance depends on how much the product's value proposition depends on initial configuration (Slack needs a workspace before it is useful; Spotify can provide value immediately without profile data).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server-authoritative versus client-authoritative onboarding state: storing onboarding state on the server (as described) enables resumption across devices and browsers, provides a consistent view of completion for analytics, and allows step definitions to change server-side. Client-only state (localStorage) is simpler but cannot be resumed on a different device, is lost on browser clear/device reset, and provides no server-side visibility into completion. For an enterprise SaaS product where onboarding may span days (user completes some steps on day 1, continues on day 2), server-authoritative state is essential. For a consumer product with a short onboarding (under 5 minutes), client-only state may be acceptable for its simplicity.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Email verification as a prerequisite versus post-registration: requiring email verification before the user can access the product reduces fake signups (spam email addresses fail to verify) but blocks legitimate users who don't check email immediately. "Magic link" login (send an email with a one-time login link, eliminating the password entirely) combines registration and verification into one step but requires email access at the moment of signup—problematic for enterprise users who register at work on one device but want to use the product on their phone immediately. The most user-friendly approach (used by Notion, Linear) is to allow full product access immediately and prompt for verification with a persistent banner, gating only the most sensitive actions (inviting others, exporting data) behind verification.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A scalable user onboarding and activation system is built as three decoupled services: registration (stateless, write-optimized, idempotent), onboarding state management (server-authoritative flow state with channel-specific and A/B-test flow assignment), and activation tracking (event-driven milestone recording feeding cohort activation rate computation). The onboarding flow is defined as a configurable directed graph of steps with conditional transitions, enabling flow iteration without frontend deployment. Channel attribution (UTM parameters) assigns users to channel-specific flows; A/B testing is layered via consistent hashing on userId. Activation milestones are product-defined events evaluated against a Kafka event stream. Fraud detection runs asynchronously using reCAPTCHA, device fingerprinting, and behavioral signals for bot detection; referral fraud is detected via activation-gated rewards and per-referrer conversion velocity. The activation rate by cohort and A/B variant is the primary success metric, computed in the data warehouse against the production event stream.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

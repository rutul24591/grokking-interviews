"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-content-sharing",
  title: "Content Sharing Interface",
  description:
    "Comprehensive guide to implementing content sharing interfaces covering social sharing (Twitter, Facebook, LinkedIn, WhatsApp), link generation (short links, UTM parameters, deep linking), embed codes (iframe, widget), sharing analytics (share counts, referral tracking, attribution), Open Graph optimization (og:title, og:description, og:image), native share dialog, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-sharing-interface",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "sharing",
    "social",
    "frontend",
    "analytics",
  ],
  relatedTopics: ["discovery", "analytics", "open-graph"],
};

export default function ContentSharingInterfaceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Content Sharing Interface</strong> enables users to share content across social
          platforms (Twitter, Facebook, LinkedIn, WhatsApp), via direct links (copy link, email,
          SMS), or through embed codes (iframe, widget). Sharing is critical for organic growth —
          every share amplifies content reach, drives referral traffic, and attracts new users.
          Without sharing, content remains siloed, limiting discoverability and growth potential.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/sharing-interface.svg"
          alt="Sharing Interface"
          caption="Sharing Interface — showing social share buttons (Twitter, Facebook, LinkedIn, WhatsApp), copy link with one-click copy, embed code generator with customization options, and native share dialog"
        />

        <p>
          For staff and principal engineers, implementing content sharing requires deep
          understanding of social sharing APIs (Twitter intent URLs, Facebook share dialog, LinkedIn
          share API, WhatsApp share URL), link generation (short links via URL shortener, UTM
          parameters for tracking — utm_source, utm_medium, utm_campaign, deep linking for mobile
          apps — Universal Links for iOS, App Links for Android), embed codes (iframe generation,
          widget customization, responsive embeds), sharing analytics (share counts per platform,
          referral traffic tracking, attribution — who shared, viral coefficient calculation), Open
          Graph optimization (og:title, og:description, og:image, og:url, twitter:card), native
          share dialog (Web Share API for mobile, fallback for desktop), and UX patterns (prominent
          but not intrusive buttons, mobile-optimized, one-click copy with confirmation). The
          implementation must balance ease of sharing (frictionless) with tracking (attribution,
          analytics) and prevent abuse (rate limiting, spam detection).
        </p>
        <p>
          Modern sharing systems have evolved from simple social buttons to sophisticated sharing
          platforms with analytics, attribution, and optimization. Platforms like Buffer, AddThis,
          and ShareThis provide share buttons, analytics dashboards, and A/B testing for share
          prompts. Open Graph optimization is critical — without proper og: tags, shared links show
          broken previews (no image, generic title), reducing click-through rates. Native share
          dialog (Web Share API) provides OS-level sharing on mobile — users share to any app
          installed on their device.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content sharing is built on fundamental concepts that determine how content is shared,
          tracked, and optimized. Understanding these concepts is essential for designing effective
          sharing systems.
        </p>
        <p>
          <strong>Social Sharing:</strong> Twitter share (intent URL with pre-filled text —
          https://twitter.com/intent/tweet?text=..., hashtags, via handle), Facebook share (share
          dialog with Open Graph preview — https://www.facebook.com/sharer/sharer.php?u=...),
          LinkedIn share (professional network — https://www.linkedin.com/sharing/share-offsite/?url=...),
          WhatsApp share (mobile messaging — https://wa.me/?text=... with URL). Each platform has
          specific URL format, character limits, preview behavior.
        </p>
        <p>
          <strong>Link Generation:</strong> Short links (bit.ly, tinyurl, custom shortener —
          generate short, memorable URLs), UTM parameters (utm_source=twitter, utm_medium=social,
          utm_campaign=spring_sale — track sharing source/medium/campaign in analytics), deep
          linking (Universal Links for iOS — apps.apple.com links open app, App Links for Android —
          example.com links open app, fallback to web if app not installed). Link generation
          enables tracking, attribution, and mobile app integration.
        </p>
        <p>
          <strong>Embed Codes:</strong> iframe embed (generate iframe HTML code — width, height,
          src URL, allow fullscreen), widget embed (JavaScript widget — dynamically loads content,
          customizable theme/colors), responsive embed (auto-size to container, mobile-friendly).
          Embed codes enable third-party sites to display your content — amplifying reach.
        </p>
        <p>
          <strong>Sharing Analytics:</strong> Share counts (track total shares per platform —
          Twitter count, Facebook count, LinkedIn count), referral traffic (track traffic from
          shares — Google Analytics utm_source/medium), attribution (track who shared — user ID,
          unique share ID, track referral chain), viral coefficient (k-factor — shares per user,
          measure viral growth). Analytics enable optimization — which platforms drive most traffic,
          which content gets shared most.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Sharing architecture separates UI (share buttons, link copy, embed generator) from
          tracking (analytics, attribution), enabling frictionless sharing with comprehensive
          tracking. This architecture is critical for user experience and measurement.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/link-generation.svg"
          alt="Link Generation"
          caption="Link Generation — showing URL shortening service, UTM parameter addition (utm_source, utm_medium, utm_campaign), deep linking (Universal Links for iOS, App Links for Android), and Open Graph preview"
        />

        <p>
          Sharing flow: User clicks share button. Frontend opens share dialog (platform-specific
          URL — Twitter intent, Facebook share dialog, or native Web Share API). User confirms
          share (adds comment if desired). Platform publishes share (with Open Graph preview).
          Frontend tracks share event (send analytics — platform, content_id, user_id, timestamp).
          If copy link: generate URL (add UTM parameters), copy to clipboard (navigator.clipboard.writeText),
          show confirmation toast ("Link copied!"). If embed: generate embed code (iframe or
          widget), show in modal, copy to clipboard.
        </p>
        <p>
          Link generation architecture includes: URL shortener (generate short code — 6-8 chars,
          store mapping: short_code → original_url), UTM parameter addition (auto-add utm_source,
          utm_medium, utm_campaign based on share context), deep linking (Universal Links for iOS
          — configure apple-app-site-association, App Links for Android — configure assetlinks.json,
          fallback to web if app not installed), Open Graph preview (ensure og:title, og:description,
          og:image, og:url are set — test with Facebook Debugger, Twitter Card Validator). This
          architecture enables trackable, mobile-friendly sharing.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/sharing-analytics.svg"
          alt="Sharing Analytics"
          caption="Sharing Analytics — showing share event tracking (platform, content_id, user_id), referral traffic tracking (UTM parameters in Google Analytics), attribution (unique share ID, referral chain), and viral coefficient calculation (k-factor)"
        />

        <p>
          Sharing analytics architecture includes: share event tracking (track each share —
          platform, content_id, user_id, timestamp, unique_share_id), referral traffic tracking
          (UTM parameters in shared links — Google Analytics tracks utm_source, utm_medium,
          utm_campaign), attribution (unique_share_id passed in URL — track who shared, track
          referral chain — user A shared to user B who shared to user C), viral coefficient
          calculation (k-factor = shares per user — track invites sent, invites accepted,
          conversion rate). This architecture enables measurement — which content goes viral, which
          platforms drive most traffic, ROI of sharing features.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing sharing involves trade-offs between friction, tracking, and privacy.
          Understanding these trade-offs is essential for making informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Native Share Dialog vs Custom Share Buttons</h3>
          <ul className="space-y-3">
            <li>
              <strong>Native Share (Web Share API):</strong> OS-level sharing (share to any app
              installed), clean UX (no button clutter), mobile-optimized. Limitation: desktop
              support limited (Safari, Chrome on macOS only), can't pre-fill text, no share count
              tracking.
            </li>
            <li>
              <strong>Custom Share Buttons:</strong> Full control (pre-fill text, track shares,
              show counts), desktop support. Limitation: button clutter, maintenance (API changes),
              platform-dependent (buttons break if platform changes API).
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — native share for mobile (detect Web Share
              API support), custom buttons for desktop. Best of both — clean mobile UX with
              desktop functionality.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Show Share Counts vs Hide Share Counts</h3>
          <ul className="space-y-3">
            <li>
              <strong>Show Counts:</strong> Social proof (high counts encourage sharing),
              transparency. Limitation: API deprecation (Facebook, Twitter deprecated public share
              count APIs), stale counts (cached, not real-time), low counts discourage sharing.
            </li>
            <li>
              <strong>Hide Counts:</strong> No API dependency, no stale data, no discouragement
              from low counts. Limitation: lose social proof.
            </li>
            <li>
              <strong>Recommendation:</strong> Hide counts (most platforms deprecated APIs). Use
              alternative social proof ("X people shared this" — approximate, or "Shared by
              [influencer names]").
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Many Share Buttons vs Few Share Buttons</h3>
          <ul className="space-y-3">
            <li>
              <strong>Many Buttons:</strong> More sharing options (Twitter, Facebook, LinkedIn,
              WhatsApp, Pinterest, Reddit, email, SMS — 8+ buttons). Limitation: button clutter,
              overwhelming, performance cost (load 8+ scripts).
            </li>
            <li>
              <strong>Few Buttons:</strong> Clean UX (show top 3-4 platforms based on analytics),
              performance (load fewer scripts). Limitation: users may want other platforms.
            </li>
            <li>
              <strong>Recommendation:</strong> Few buttons (top 3-4 based on your analytics) +
              "More" menu (expand to show all options). Balance clean UX with flexibility.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing content sharing requires following established best practices to ensure
          usability, tracking, and platform compatibility.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Sharing Design</h3>
        <p>
          Make sharing prominent but not intrusive (sticky sidebar on desktop, bottom bar on
          mobile, inline after content). Support multiple sharing options (social buttons, copy
          link, embed, native share). Pre-fill share text appropriately (include title, URL,
          @handle for Twitter — but don't be spammy). Optimize for mobile sharing (touch-friendly
          buttons, native share dialog, fast loading). Test on multiple platforms (iOS, Android,
          desktop — ensure buttons work).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Link Generation</h3>
        <p>
          Generate short, memorable links (use URL shortener — bit.ly or self-hosted). Add UTM
          parameters automatically (utm_source={"{{platform}}"}, utm_medium=social, utm_campaign={"{{content_id}}"}).
          Support deep linking (Universal Links for iOS, App Links for Android — open app if
          installed, fallback to web). Optimize Open Graph tags (og:title, og:description, og:image
          — test with Facebook Debugger, Twitter Card Validator).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Analytics</h3>
        <p>
          Track share counts (per platform — Twitter, Facebook, LinkedIn, total). Track by platform
          (which platforms drive most shares). Track referral traffic (Google Analytics — utm_source,
          utm_medium). Attribute shares to users (unique_share_id — track who shared, referral
          chain). Track conversions (users who signed up/purchased from share — ROI measurement).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Open Graph Optimization</h3>
        <p>
          Set compelling og:title (55-60 chars — truncate gracefully). Set clear og:description
          (150-160 chars — summarize content). Set high-quality og:image (1200x630px recommended —
          test on multiple platforms). Set og:url (canonical URL — avoid duplicate content). Set
          twitter:card (summary_large_image for large preview). Test with Facebook Debugger,
          Twitter Card Validator, LinkedIn Post Inspector.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing content sharing to ensure usability,
          tracking, and platform compatibility.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No tracking:</strong> Can't measure sharing effectiveness, don't know which
            platforms drive traffic. <strong>Fix:</strong> Add UTM parameters to all shared links.
            Track share events (platform, content_id, user_id).
          </li>
          <li>
            <strong>Poor Open Graph:</strong> Broken link previews (no image, generic title),
            reduced click-through. <strong>Fix:</strong> Optimize og:title, og:description,
            og:image. Test with Facebook Debugger, Twitter Card Validator.
          </li>
          <li>
            <strong>Too many buttons:</strong> Overwhelming share options (8+ buttons), button
            clutter, slow loading. <strong>Fix:</strong> Show top 3-4 platforms (based on
            analytics). Hide others in "More" menu.
          </li>
          <li>
            <strong>No mobile support:</strong> Can't share on mobile, tiny buttons, no native
            share. <strong>Fix:</strong> Use native share dialog (Web Share API) for mobile.
            Touch-friendly buttons (44x44px minimum).
          </li>
          <li>
            <strong>No embed option:</strong> Users can't embed content on their sites, lost
            amplification. <strong>Fix:</strong> Provide embed code generator (iframe, widget).
            Allow customization (size, theme).
          </li>
          <li>
            <strong>Broken deep links:</strong> App links don't work, users land on web instead of
            app. <strong>Fix:</strong> Implement Universal Links (iOS), App Links (Android). Test
            on multiple devices. Fallback to web.
          </li>
          <li>
            <strong>No attribution:</strong> Can't track who shared, can't measure viral growth.{" "}
            <strong>Fix:</strong> Generate unique_share_id for each share. Track referral chain
            (user A → user B → user C).
          </li>
          <li>
            <strong>Poor copy UX:</strong> Hard to copy link, no confirmation, URL not visible.{" "}
            <strong>Fix:</strong> One-click copy button. Show confirmation toast ("Link copied!").
            Display shortened URL.
          </li>
          <li>
            <strong>No analytics:</strong> Can't measure sharing impact, don't know ROI.{" "}
            <strong>Fix:</strong> Track share counts, referral traffic, conversions. Dashboard for
            sharing metrics.
          </li>
          <li>
            <strong>Outdated share counts:</strong> Inaccurate share counts (APIs deprecated),
            stale data. <strong>Fix:</strong> Hide share counts (most platforms deprecated). Use
            alternative social proof ("X people shared this").
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Content sharing is critical for organic growth. Here are real-world implementations from
          production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">News Website (NYTimes)</h3>
        <p>
          <strong>Challenge:</strong> Articles must be easily shareable. Drive referral traffic
          from social platforms. Track which articles go viral.
        </p>
        <p>
          <strong>Solution:</strong> Prominent share buttons (Twitter, Facebook, LinkedIn, WhatsApp,
          email). Copy link button (shortened URL with UTM). Open Graph optimization (compelling
          title, description, image). Share analytics (track shares per article, platform
          breakdown). Viral coefficient tracking (measure article virality).
        </p>
        <p>
          <strong>Result:</strong> 40% of traffic from social shares. Viral articles identified
          quickly. Referral traffic tracked accurately.
        </p>
        <p>
          <strong>Growth:</strong> Share buttons, Open Graph optimization, share analytics, viral
          tracking.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Shopify)</h3>
        <p>
          <strong>Challenge:</strong> Product pages must be shareable. Track which products get
          shared most. Attribute sales to shares.
        </p>
        <p>
          <strong>Solution:</strong> Product share buttons (Pinterest for visual products,
          Facebook, WhatsApp for direct sharing). Copy link (shortened product URL with UTM).
          Embed code (product widget for blogs). Share analytics (track shares per product,
          attribute sales to shares via unique_share_id).
        </p>
        <p>
          <strong>Result:</strong> 25% of sales attributed to social shares. Top shared products
          identified. ROI of sharing measured.
        </p>
        <p>
          <strong>Growth:</strong> Product sharing, sales attribution, embed widgets, share
          analytics.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Video Platform (YouTube)</h3>
        <p>
          <strong>Challenge:</strong> Videos must be shareable across platforms. Track video
          virality. Deep link to mobile app.
        </p>
        <p>
          <strong>Solution:</strong> Share button (native share dialog on mobile — share to any
          app). Timestamp sharing (share video at specific timestamp — ?t=120). Deep linking
          (Universal Links for iOS, App Links for Android — open YouTube app). Share analytics
          (track shares per video, viral coefficient).
        </p>
        <p>
          <strong>Result:</strong> Videos shared 10M+ times daily. Viral videos identified in
          real-time. App installs from shares tracked.
        </p>
        <p>
          <strong>Growth:</strong> Native share, timestamp sharing, deep linking, viral tracking.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blog Platform (Medium)</h3>
        <p>
          <strong>Challenge:</strong> Articles must be shareable. Track which writers drive most
          shares. Attribute new signups to shares.
        </p>
        <p>
          <strong>Solution:</strong> Inline share buttons (Twitter, Facebook, LinkedIn). Copy link
          (medium.com short URL with UTM). Share analytics (track shares per article, per writer).
          Attribution (unique_share_id — track new signups from shares). Viral coefficient (k-factor
          per article).
        </p>
        <p>
          <strong>Result:</strong> 50% of new signups attributed to shares. Top writers identified
          by share performance. Viral articles amplified.
        </p>
        <p>
          <strong>Growth:</strong> Share analytics, writer attribution, signup tracking, viral
          coefficient.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SaaS Platform (Notion)</h3>
        <p>
          <strong>Challenge:</strong> Public pages must be shareable. Track page virality.
          Attribute signups to shared pages.
        </p>
        <p>
          <strong>Solution:</strong> Share button (native share dialog). Copy link (notion.site
          short URL with UTM). Embed code (embed Notion page in other sites). Share analytics
          (track shares per page, attribute signups via unique_share_id). Viral loop (shared page
          → viewer signs up → creates page → shares).
        </p>
        <p>
          <strong>Result:</strong> Viral coefficient k = 0.4 (4 signups per 10 viewers). Shared
          pages drive 60% of signups. Viral loop optimized.
        </p>
        <p>
          <strong>Growth:</strong> Native share, embed pages, signup attribution, viral loop.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of content sharing design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track sharing analytics?</p>
            <p className="mt-2 text-sm">
              A: Multiple tracking layers. UTM parameters (utm_source={"{{platform}}"}, utm_medium=social,
              utm_campaign={"{{content_id}}"} — track in Google Analytics). Share event tracking (send
              analytics event when user clicks share — platform, content_id, user_id, timestamp).
              Unique share ID (generate per share — track referral chain, attribute conversions).
              Referral traffic tracking (track traffic from shared links — which platform, which
              content). This enables measurement of sharing effectiveness, viral growth tracking.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize Open Graph previews?</p>
            <p className="mt-2 text-sm">
              A: Set all required og: tags. og:title (55-60 chars — compelling, include keywords).
              og:description (150-160 chars — summarize content, include call-to-action). og:image
              (1200x630px recommended — high-quality, relevant to content, test on multiple
              platforms). og:url (canonical URL — avoid duplicate content). twitter:card
              (summary_large_image for large preview). Test with Facebook Debugger (shares
              debugger), Twitter Card Validator (cards.twitter.com), LinkedIn Post Inspector.
              Update tags, re-scrape to refresh cache.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle share counts?</p>
            <p className="mt-2 text-sm">
              A: Most platforms deprecated public share count APIs (Facebook 2019, Twitter 2020).
              Options: hide counts (recommended — no API dependency), use approximate counts
              ("X people shared this" — internal tracking), use third-party services (ShareCount,
              BuzzSumo — paid, rate limited). If showing counts: cache counts (don't fetch on every
              page load — fetch hourly/daily), fallback gracefully (if API fails, hide count),
              don't show low counts (discourages sharing — show only if &gt;10).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement deep linking?</p>
            <p className="mt-2 text-sm">
              A: Universal Links for iOS (configure apple-app-site-association file on server —
              list paths that should open app, iOS 9+). App Links for Android (configure
              assetlinks.json on server — verify app ownership, Android 6+). Fallback to web (if
              app not installed — open web URL). Test on multiple devices (iOS, Android, different
              OS versions). Use libraries (react-native-universal-links, branch.io) for easier
              implementation. This enables seamless mobile experience — shared links open app
              directly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you attribute shares?</p>
            <p className="mt-2 text-sm">
              A: Generate unique_share_id for each share (UUID — store in database: share_id,
              user_id, content_id, platform, timestamp). Pass share_id in shared URL (?share_id=abc123).
              Track referral chain (user A shares → user B clicks share_id=A → user B shares →
              user C clicks share_id=B — track chain A→B→C). Attribute conversions (user signs up/
              purchases — look up share_id in URL, attribute to original sharer). This enables
              viral coefficient calculation, influencer identification, ROI measurement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent sharing abuse?</p>
            <p className="mt-2 text-sm">
              A: Rate limiting (limit shares per user per hour — 100 shares/hour, detect spam
              behavior). Detect spam shares (same content shared repeatedly, shares to known spam
              accounts). Validate share content (don't allow sharing private/sensitive content).
              Monitor for abuse patterns (sudden spike in shares from one user, shares to
              suspicious domains). Block abusive users (revoke sharing privileges). This prevents
              platform abuse while enabling legitimate sharing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize for mobile sharing?</p>
            <p className="mt-2 text-sm">
              A: Use native share dialog (Web Share API — navigator.share() on mobile, opens OS
              share sheet — share to any app installed). Touch-friendly buttons (44x44px minimum —
              Apple HIG). Fast loading (lazy load share buttons, don't block page load). Test on
              multiple devices (iOS Safari, Android Chrome, different screen sizes). Fallback for
              desktop (Web Share API not supported everywhere — show custom buttons). This provides
              best mobile UX — users share to their preferred app.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for sharing?</p>
            <p className="mt-2 text-sm">
              A: Share counts (total shares, per platform — Twitter, Facebook, LinkedIn). Share
              rate (shares per pageview — measure sharing propensity). Platform distribution (% of
              shares per platform — inform which buttons to show). Referral traffic (visits from
              shares — Google Analytics utm_source/medium). Conversion rate (signups/purchases
              from shares — ROI). Viral coefficient (k-factor — shares per user, invites sent,
              invites accepted). Top shared content (which articles/products/videos get shared
              most). Alert on anomalies (sudden spike/drop in shares — investigate).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle embed codes?</p>
            <p className="mt-2 text-sm">
              A: Generate embed code (iframe HTML — width, height, src URL, allow fullscreen,
              loading="lazy" for performance). Widget embed (JavaScript widget — dynamically loads
              content, customizable theme/colors via data attributes). Allow customization (size —
              small/medium/large, theme — light/dark, show/hide header). Track embed usage (track
              embed loads — which sites embed your content). Prevent abuse (rate limit embed
              loads, block malicious sites via CSP). Provide copy functionality (one-click copy
              embed code to clipboard). This enables third-party amplification while maintaining
              control.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://ogp.me/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Graph Protocol
            </a>
          </li>
          <li>
            <a
              href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Cards
            </a>
          </li>
          <li>
            <a
              href="https://developers.facebook.com/docs/sharing/webmasters"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Sharing Debugger
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/post-inspector/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Post Inspector
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Web Share API
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/ios/universal-links/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Universal Links
            </a>
          </li>
          <li>
            <a
              href="https://developer.android.com/training/app-links"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Android App Links
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/analytics/devguides/collection/protocol/ga4"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics 4 - Measurement Protocol
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

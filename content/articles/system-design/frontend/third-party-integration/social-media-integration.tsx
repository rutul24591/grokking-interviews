"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-social-media-integration",
  title: "Social Media Integration",
  description: "System design for social media integrations: embed loading patterns, share buttons, Open Graph metadata, privacy considerations, performance isolation, and failure handling in modern React/Next.js applications.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "social-media-integration",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "social", "third-party", "embeds", "privacy", "performance", "seo", "open-graph"],
  relatedTopics: ["widget-embedding", "script-loading-strategies", "analytics-tools-integration", "seo-optimization"],
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
          <strong>Social media integration</strong> covers the set of capabilities that connect your product to social platforms: share buttons, embedded posts (tweets, Instagram posts, TikTok videos), social login (covered separately under OAuth), link preview metadata (Open Graph / Twitter Cards), and platform APIs for publishing or reading content.
        </p>
        <p>
          These integrations are often owned by growth or marketing, but they have deep system consequences: third-party scripts can degrade performance, embeds can introduce privacy and compliance risk, and platform APIs create rate-limit and availability dependencies. High-performing products treat social integrations as a <strong>governed subsystem</strong> rather than ad hoc snippets.
        </p>
        <p>
          For staff/principal engineers, social media integration requires balancing three competing concerns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Growth:</strong> Social sharing drives user acquisition. Share buttons and embeds increase visibility.
          </li>
          <li>
            <strong>Performance:</strong> Social scripts are often heavy and block rendering. Unoptimized embeds slow page load.
          </li>
          <li>
            <strong>Privacy:</strong> Social platforms track users across sites. GDPR/CCPA require consent before loading tracking scripts.
          </li>
        </ul>
        <p>
          The business impact of social integration decisions is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>User Acquisition:</strong> Social sharing drives 5-20% of new user acquisition for content sites. Poor share experience reduces viral growth.
          </li>
          <li>
            <strong>Engagement:</strong> Embedded social content (tweets, videos) increases time on page. But heavy embeds slow page load, increasing bounce rate.
          </li>
          <li>
            <strong>Compliance:</strong> Loading social tracking scripts without consent violates GDPR/CCPA. Fines can reach 4% of global revenue.
          </li>
          <li>
            <strong>SEO:</strong> Open Graph metadata affects how links appear on social. Poor metadata reduces click-through rates.
          </li>
        </ul>
        <p>
          In system design interviews, social media integration demonstrates understanding of third-party script management, privacy compliance, performance optimization, and the trade-offs between growth and user experience. It shows you think about real-world constraints, not just feature implementation.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/social-embed-patterns.svg"
          alt="Comparison of social embed loading patterns: eager load (slow, many requests), lazy load (faster, on scroll), static fallback (fastest, user-triggered)"
          caption="Social embed patterns — eager load impacts performance; lazy load balances UX and performance; static fallback maximizes privacy and speed"
        />

        <h3>Social Embed Loading Patterns</h3>
        <p>
          There are three primary approaches to loading social embeds, each with different performance and privacy trade-offs:
        </p>

        <h4>Pattern 1: Eager Load (Not Recommended)</h4>
        <p>
          Load all embeds on page load. Simplest to implement but worst for performance.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Implementation:</strong> Paste embed code directly. Scripts load immediately.
          </li>
          <li>
            <strong>Performance:</strong> Poor. Each embed adds 100-500KB and multiple requests.
          </li>
          <li>
            <strong>Privacy:</strong> Poor. Trackers load immediately, even if user never scrolls to embed.
          </li>
          <li>
            <strong>Use Case:</strong> Avoid for production. Only acceptable for single-embed pages.
          </li>
        </ul>

        <h4>Pattern 2: Lazy Load on Scroll (Recommended)</h4>
        <p>
          Load embeds when they scroll into viewport using IntersectionObserver.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Implementation:</strong> Replace embed src with placeholder. Observe with IntersectionObserver. Load real embed when visible.
          </li>
          <li>
            <strong>Performance:</strong> Good. Embeds below fold don't impact initial load.
          </li>
          <li>
            <strong>Privacy:</strong> Fair. Trackers load only if user scrolls to embed.
          </li>
          <li>
            <strong>Use Case:</strong> Most content sites. Good balance of UX and performance.
          </li>
        </ul>

        <h4>Pattern 3: Static Fallback with User Trigger (Privacy-Focused)</h4>
        <p>
          Show static preview (screenshot, server-rendered HTML) with "Load embed" button. Only load actual embed if user clicks.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Implementation:</strong> Generate static preview at build time or on-demand. Show preview with button. Load embed on click.
          </li>
          <li>
            <strong>Performance:</strong> Best. Zero third-party requests unless user opts in.
          </li>
          <li>
            <strong>Privacy:</strong> Best. No tracking unless user explicitly consents.
          </li>
          <li>
            <strong>Use Case:</strong> Privacy-focused sites, GDPR compliance, performance-critical pages.
          </li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Use lazy load for most cases. Use static fallback for privacy-focused sites or pages with many embeds.
        </p>

        <h3>Share Button Strategies</h3>
        <p>
          Share buttons enable users to share content on social platforms. There are two approaches:
        </p>

        <h4>Approach 1: Official Share Buttons</h4>
        <ul className="space-y-2">
          <li>
            <strong>Implementation:</strong> Load official scripts from Twitter, Facebook, LinkedIn, etc.
          </li>
          <li>
            <strong>Pros:</strong> Shows share count (if available). Branded appearance.
          </li>
          <li>
            <strong>Cons:</strong> Heavy scripts (100-300KB per button). Trackers load on page load. Multiple third-party requests.
          </li>
          <li>
            <strong>Recommendation:</strong> Avoid unless share count is critical. Performance cost is too high.
          </li>
        </ul>

        <h4>Approach 2: Custom Share Links (Recommended)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Implementation:</strong> Simple links to share URLs (e.g., `https://twitter.com/intent/tweet?url=...`).
          </li>
          <li>
            <strong>Pros:</strong> Zero JavaScript. No third-party scripts. Fast.
          </li>
          <li>
            <strong>Cons:</strong> No share count. Less branded.
          </li>
          <li>
            <strong>Recommendation:</strong> Use for most sites. Performance benefit far outweighs share count.
          </li>
        </ul>
        <p>
          <strong>Key insight:</strong> Share counts are rarely worth the performance cost. Most platforms (Twitter, Facebook) no longer show share counts anyway.
        </p>

        <h3>Open Graph and Social Preview Metadata</h3>
        <p>
          Open Graph (OG) and Twitter Cards control how your links appear when shared on social:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>og:title:</strong> Title shown in preview.
          </li>
          <li>
            <strong>og:description:</strong> Description shown in preview.
          </li>
          <li>
            <strong>og:image:</strong> Preview image (min 1200x630px for best display).
          </li>
          <li>
            <strong>og:url:</strong> Canonical URL of the page.
          </li>
          <li>
            <strong>twitter:card:</strong> Card type (summary, summary_large_image).
          </li>
          <li>
            <strong>twitter:site:</strong> Your Twitter handle.
          </li>
        </ul>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            Use absolute URLs for og:image.
          </li>
          <li>
            Image should be 1200x630px minimum for best display.
          </li>
          <li>
            Test previews using Facebook Sharing Debugger, Twitter Card Validator.
          </li>
          <li>
            Update OG tags dynamically for dynamic content (articles, products).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/open-graph-flow.svg"
          alt="Open Graph flow showing website with OG tags, social platform crawler fetching and parsing tags, and link preview display"
          caption="Open Graph flow — crawlers fetch OG tags when link is shared; proper metadata ensures rich preview display"
        />

        <h3>Privacy and Consent</h3>
        <p>
          Social embeds and share buttons often include tracking scripts. GDPR and CCPA require consent before loading trackers:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>GDPR (EU):</strong> Requires explicit opt-in before loading tracking scripts.
          </li>
          <li>
            <strong>CCPA (California):</strong> Requires opt-out mechanism ("Do Not Sell My Info").
          </li>
          <li>
            <strong>Consent Management:</strong> Use CMP (Consent Management Platform) or build your own consent banner.
          </li>
          <li>
            <strong>Consent Gating:</strong> Don't load social scripts until user consents. Show placeholder until then.
          </li>
        </ul>
        <p>
          <strong>Implementation:</strong> Check consent status before loading social scripts. If no consent, show static placeholder with "Load embed" button. When user clicks, that's implicit consent for that embed.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust social integration architecture treats social embeds as <strong>optional enhancements</strong> that degrade gracefully when unavailable.
        </p>

        <h3>Embed Loading Architecture</h3>
        <p>
          The recommended architecture for social embeds:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Static Placeholder:</strong> Show static preview (image, title) initially. Zero third-party requests.
          </li>
          <li>
            <strong>IntersectionObserver:</strong> Observe placeholder. When visible, trigger load.
          </li>
          <li>
            <strong>Consent Check:</strong> Before loading, check consent status. If no consent, show "Load embed" button.
          </li>
          <li>
            <strong>Lazy Load:</strong> Load actual embed script on user interaction or scroll.
          </li>
          <li>
            <strong>Error Handling:</strong> If embed fails to load, show fallback message. Don't break page.
          </li>
        </ul>

        <h3>Share Link Architecture</h3>
        <p>
          For share buttons, use custom links instead of official scripts:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Twitter:</strong> `https://twitter.com/intent/tweet?url=(url)&text=(text)`
          </li>
          <li>
            <strong>Facebook:</strong> `https://www.facebook.com/sharer/sharer.php?u=(url)`
          </li>
          <li>
            <strong>LinkedIn:</strong> `https://www.linkedin.com/sharing/share-offsite/?url=(url)`
          </li>
          <li>
            <strong>Reddit:</strong> `https://www.reddit.com/submit?url=(url)&title=(title)`
          </li>
        </ul>
        <p>
          Open in new window (`target="_blank"`) to avoid navigating away from your page. Add UTM parameters for tracking (`utm_source`, `utm_medium`, `utm_campaign`).
        </p>

        <h3>OG Tag Generation</h3>
        <p>
          For dynamic content (articles, products), OG tags must be generated dynamically:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>SSR/SSG:</strong> Generate OG tags at build time (SSG) or request time (SSR).
          </li>
          <li>
            <strong>Dynamic Metadata:</strong> Next.js App Router supports dynamic metadata via `generateMetadata()`.
          </li>
          <li>
            <strong>Fallback:</strong> Provide default OG tags for pages without specific metadata.
          </li>
        </ul>
        <p>
          <strong>Important:</strong> Social crawlers don't execute JavaScript. OG tags must be in initial HTML, not added client-side.
        </p>

        <h3>Error Handling</h3>
        <p>
          Social embeds can fail to load. Handle errors gracefully:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Timeout:</strong> If embed doesn't load in 5 seconds, show fallback.
          </li>
          <li>
            <strong>Network Error:</strong> Show "Embed unavailable" message with link to original content.
          </li>
          <li>
            <strong>Blocked by Ad Blocker:</strong> Many ad blockers block social scripts. Show fallback.
          </li>
          <li>
            <strong>Platform API Changes:</strong> Social platforms change embed formats. Monitor and update.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Social integration involves trade-offs between growth, performance, and privacy.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Privacy</th>
              <th className="p-3 text-left">UX</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Eager Load</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Best (immediate)</td>
              <td className="p-3">Avoid</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Lazy Load</td>
              <td className="p-3">Good</td>
              <td className="p-3">Fair</td>
              <td className="p-3">Good (on scroll)</td>
              <td className="p-3">Most sites</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Static Fallback</td>
              <td className="p-3">Best</td>
              <td className="p-3">Best</td>
              <td className="p-3">Fair (requires click)</td>
              <td className="p-3">Privacy-focused</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that <strong>lazy load or static fallback should be the default</strong>. Eager loading social scripts is rarely justified given the performance and privacy costs.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Custom Share Links:</strong> Don't load official share button scripts. Use simple links to share URLs.
          </li>
          <li>
            <strong>Lazy Load Embeds:</strong> Load embeds only when they scroll into viewport. Use IntersectionObserver.
          </li>
          <li>
            <strong>Respect Consent:</strong> Don't load tracking embeds until user consents. Show placeholder until then.
          </li>
          <li>
            <strong>Generate OG Tags Server-Side:</strong> Social crawlers don't execute JavaScript. OG tags must be in HTML.
          </li>
          <li>
            <strong>Use Correct Image Sizes:</strong> OG images should be 1200x630px minimum for best display.
          </li>
          <li>
            <strong>Test Previews:</strong> Use Facebook Sharing Debugger and Twitter Card Validator to test previews.
          </li>
          <li>
            <strong>Handle Errors Gracefully:</strong> If embed fails, show fallback. Don't break page.
          </li>
          <li>
            <strong>Monitor Embed Performance:</strong> Track embed load times and failure rates. Alert on issues.
          </li>
          <li>
            <strong>Provide Fallback Links:</strong> Always link to original content in case embed fails.
          </li>
          <li>
            <strong>Limit Number of Embeds:</strong> Too many embeds slow page load. Be selective about which content to embed.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Loading Official Share Scripts:</strong> Official scripts are heavy and track users. Use custom links instead.
          </li>
          <li>
            <strong>Eager Loading Embeds:</strong> Loading all embeds on page load wastes bandwidth. Lazy load instead.
          </li>
          <li>
            <strong>Client-Side OG Tags:</strong> Adding OG tags via JavaScript doesn't work. Crawlers don't execute JS.
          </li>
          <li>
            <strong>Small OG Images:</strong> Images under 1200x630px display poorly. Use correct sizes.
          </li>
          <li>
            <strong>No Consent Check:</strong> Loading tracking embeds without consent violates GDPR/CCPA.
          </li>
          <li>
            <strong>No Error Handling:</strong> Embeds can fail. Show fallback if embed doesn't load.
          </li>
          <li>
            <strong>Too Many Embeds:</strong> Each embed adds weight. Be selective about which content to embed.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>News Site: Lazy-Loaded Tweet Embeds</h3>
        <p>
          <strong>Problem:</strong> News site embedded many tweets in articles. Page load time was 8+ seconds due to Twitter script weight.
        </p>
        <p>
          <strong>Solution:</strong> Implemented lazy loading with IntersectionObserver. Show static tweet preview initially. Load actual embed when scrolled into view.
        </p>
        <p>
          <strong>Results:</strong> Page load time reduced from 8.2s to 3.1s. Bounce rate decreased 22%. Tweet engagement unchanged.
        </p>

        <h3>E-Commerce: Custom Share Links</h3>
        <p>
          <strong>Problem:</strong> E-commerce site used official share buttons. Multiple third-party scripts slowed product pages.
        </p>
        <p>
          <strong>Solution:</strong> Replaced official buttons with custom share links. Added UTM parameters for tracking.
        </p>
        <p>
          <strong>Results:</strong> Page load time reduced by 1.5s. Share rate unchanged. Third-party scripts reduced from 8 to 2.
        </p>

        <h3>Blog: Privacy-Focused Embeds</h3>
        <p>
          <strong>Problem:</strong> Blog embedded YouTube videos and tweets. Privacy-conscious users complained about tracking.
        </p>
        <p>
          <strong>Solution:</strong> Implemented static fallback pattern. Show video thumbnail with "Load video" button. Only load YouTube player if user clicks.
        </p>
        <p>
          <strong>Results:</strong> 60% of users chose not to load embeds (saving bandwidth). GDPR compliant. Page load time improved 40%.
        </p>

        <h3>SaaS: Dynamic OG Tags</h3>
        <p>
          <strong>Problem:</strong> SaaS company's shared links showed generic preview instead of dynamic content preview.
        </p>
        <p>
          <strong>Solution:</strong> Implemented dynamic OG tags via Next.js `generateMetadata()`. Each page has unique title, description, and image.
        </p>
        <p>
          <strong>Results:</strong> Social click-through rate increased 35%. Links more engaging when shared.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What are the different approaches to loading social embeds and when do you use each?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Eager Load:</strong> Load all embeds on page load. Simple but worst for performance. Avoid unless single embed on page.
              </li>
              <li>
                <strong>Lazy Load on Scroll:</strong> Load embeds when they scroll into viewport using IntersectionObserver. Good balance of UX and performance. Recommended for most sites.
              </li>
              <li>
                <strong>Static Fallback:</strong> Show static preview with "Load embed" button. Only load if user clicks. Best for privacy and performance. Recommended for privacy-focused sites.
              </li>
            </ul>
            <p>
              The general principle is <strong>don't load embeds until needed</strong>. Lazy load or static fallback should be the default.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: Why should you use custom share links instead of official share buttons?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Performance:</strong> Official scripts are heavy (100-300KB per button). Custom links are zero JavaScript.
              </li>
              <li>
                <strong>Privacy:</strong> Official buttons track users across sites. Custom links don't load trackers.
              </li>
              <li>
                <strong>Third-Party Requests:</strong> Official buttons make multiple third-party requests. Custom links make none.
              </li>
              <li>
                <strong>Share Counts:</strong> Most platforms (Twitter, Facebook) no longer show share counts anyway. No benefit to official buttons.
              </li>
            </ul>
            <p>
              Custom share links are simple: `https://twitter.com/intent/tweet?url=(url)`. Open in new window. Add UTM parameters for tracking. Zero performance impact.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is Open Graph and how do you implement it for dynamic content?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Open Graph (OG) is a protocol that controls how links appear when shared on social. Key tags:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <code>og:title</code> — Title shown in preview.
              </li>
              <li>
                <code>og:description</code> — Description shown in preview.
              </li>
              <li>
                <code>og:image</code> — Preview image (min 1200x630px).
              </li>
              <li>
                <code>og:url</code> — Canonical URL.
              </li>
            </ul>
            <p className="mb-3">
              For dynamic content (articles, products):
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                Generate OG tags server-side (SSR/SSG). Social crawlers don't execute JavaScript.
              </li>
              <li>
                Use Next.js `generateMetadata()` for dynamic metadata.
              </li>
              <li>
                Provide fallback OG tags for pages without specific metadata.
              </li>
            </ul>
            <p>
              Test previews using Facebook Sharing Debugger and Twitter Card Validator.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle GDPR/CCPA compliance for social embeds?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Consent Check:</strong> Before loading social scripts, check if user has consented to tracking.
              </li>
              <li>
                <strong>Placeholder:</strong> If no consent, show static placeholder instead of embed.
              </li>
              <li>
                <strong>User Trigger:</strong> Show "Load embed" button. When user clicks, that's implicit consent for that embed.
              </li>
              <li>
                <strong>Consent Management:</strong> Use CMP (Consent Management Platform) or build your own consent banner.
              </li>
              <li>
                <strong>Granular Consent:</strong> Allow users to consent to different categories (analytics, social, advertising) separately.
              </li>
            </ul>
            <p>
              Non-compliance can result in fines up to 4% of global revenue under GDPR. Consent gating is critical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you optimize social embed performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Lazy Load:</strong> Load embeds only when scrolled into view. Use IntersectionObserver.
              </li>
              <li>
                <strong>Static Fallback:</strong> Show static preview initially. Load embed only if user interacts.
              </li>
              <li>
                <strong>Limit Embeds:</strong> Don't embed everything. Be selective about which content to embed.
              </li>
              <li>
                <strong>Use Custom Share Links:</strong> Don't load official share button scripts.
              </li>
              <li>
                <strong>Monitor Performance:</strong> Track embed load times. Alert on slow embeds.
              </li>
              <li>
                <strong>Handle Errors:</strong> If embed fails, show fallback. Don't break page.
              </li>
            </ul>
            <p>
              The goal is to minimize third-party script impact while maintaining social functionality.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What are best practices for Open Graph images?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Size:</strong> Minimum 1200x630px for best display on all platforms.
              </li>
              <li>
                <strong>Format:</strong> JPG or PNG. JPG for photos, PNG for graphics/text.
              </li>
              <li>
                <strong>File Size:</strong> Under 5MB. Smaller loads faster.
              </li>
              <li>
                <strong>Absolute URL:</strong> Use absolute URL for og:image, not relative.
              </li>
              <li>
                <strong>Text Overlay:</strong> Include text on image for context (title, brand).
              </li>
              <li>
                <strong>Test:</strong> Test previews using Facebook Sharing Debugger and Twitter Card Validator.
              </li>
            </ul>
            <p>
              Good OG images significantly increase click-through rates when content is shared.
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
            <a href="https://ogp.me/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Open Graph Protocol
            </a> — Official Open Graph specification.
          </li>
          <li>
            <a href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Twitter Cards Documentation
            </a> — Twitter Card implementation guide.
          </li>
          <li>
            <a href="https://developers.facebook.com/docs/sharing/webmasters/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Facebook Sharing Debugger
            </a> — Test and debug Open Graph tags.
          </li>
          <li>
            <a href="https://web.dev/third-party-facades/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev: Third-Party Facades
            </a> — Pattern for lazy loading third-party embeds with static fallbacks.
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js: generateMetadata
            </a> — Dynamic metadata generation for OG tags.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Intersection Observer API
            </a> — Lazy loading embeds on scroll.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

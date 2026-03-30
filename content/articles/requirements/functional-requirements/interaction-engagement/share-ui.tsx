"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-share-ui",
  title: "Share UI",
  description:
    "Comprehensive guide to implementing share interfaces covering share sheets, native sharing, link copying, external destination integration, share tracking, and viral growth optimization.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "share-ui",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "sharing",
    "engagement",
    "frontend",
    "virality",
    "social-sharing",
  ],
  relatedTopics: ["social-sharing", "content-sharing", "virality", "analytics-tracking"],
};

export default function ShareUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Share UI enables users to distribute content externally across multiple destinations including social media platforms, messaging applications, email, and direct link copying. Sharing represents the highest-value engagement action—when a user shares content, they become a distribution channel, exposing your platform to their network and driving organic user acquisition. Well-designed share UI directly impacts viral coefficient and growth velocity.
        </p>
        <p>
          Share implementations vary significantly by platform and context. Twitter offers simple share with pre-populated text and link. Instagram allows sharing posts to Stories with interactive stickers. YouTube provides share options with timestamp parameters for specific video moments. LinkedIn enables sharing with professional context and colleague tagging. Each implementation reflects different sharing goals and audience expectations.
        </p>
        <p>
          For staff and principal engineers, share UI implementation involves navigating technical and product challenges. The system must integrate with multiple external APIs, each with different authentication flows and content formatting requirements. It must generate shareable links with tracking parameters for analytics attribution. The architecture must handle share preview generation with Open Graph tags for social platforms. Additionally, engineers must consider privacy implications of shared content, deep linking for app-to-app sharing, and fallback strategies for unsupported sharing destinations.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Share Destinations</h3>
        <p>
          Share destinations fall into several categories with different integration approaches. Social media platforms like Twitter, Facebook, LinkedIn, and Instagram accept share URLs with pre-populated text through web intent URLs. Each platform has specific URL parameters for customizing the share experience—Twitter supports pre-filled tweet text, Facebook allows quote comments, LinkedIn enables professional context addition.
        </p>
        <p>
          Messaging applications including WhatsApp, Telegram, Messenger, and SMS enable direct sharing to contacts. Mobile platforms provide native share sheets that integrate with installed messaging apps. Web implementations use click-to-chat URLs that open the messaging app with pre-populated text. WhatsApp uses wa.me URLs, Telegram uses t.me/share URLs, each with platform-specific parameter formats.
        </p>
        <p>
          Email sharing opens the user's default email client with pre-populated subject and body. Web mail services like Gmail and Outlook provide web-based share intents. Copy link functionality copies the shareable URL to clipboard, providing a universal fallback that works everywhere. Users can then paste the link anywhere—messaging apps, documents, or social platforms not directly supported.
        </p>

        <h3 className="mt-6">Native vs Custom Share</h3>
        <p>
          Native share uses the Web Share API, which invokes the operating system's share dialog. On mobile devices, this displays the familiar iOS or Android share sheet with all installed apps that accept shared content. Desktop support is growing with Chrome, Edge, and Safari implementing the API. Native share provides the best user experience with familiar UI and access to all installed sharing destinations.
        </p>
        <p>
          Custom share modals provide consistent cross-platform experience with full control over design and tracking. The modal displays share destination options as buttons or cards, each triggering the appropriate share flow. Custom modals work everywhere regardless of browser support but require maintaining share destination integrations and cannot access apps not explicitly supported.
        </p>
        <p>
          Hybrid approaches detect Web Share API support and use native share when available, falling back to custom modal for unsupported browsers. This provides optimal experience for most users while maintaining universal compatibility. The implementation requires feature detection and duplicate code paths but delivers the best overall user experience.
        </p>

        <h3 className="mt-6">Share Link Generation</h3>
        <p>
          Share links require careful construction for tracking and attribution. The base URL should be the canonical URL for the content, ensuring consistent sharing regardless of how users arrived at the content. Query parameters for UTM tracking identify the share source, medium, and campaign. Standard UTM parameters include utm_source (the platform), utm_medium (social, email, etc.), and utm_campaign (optional campaign identifier).
        </p>
        <p>
          Referral codes enable user attribution for growth programs. When a user shares content, their unique referral code is appended to the URL. New users who sign up through the shared link are attributed to the sharer, enabling referral rewards. Referral codes require secure generation to prevent guessing and abuse, typically using cryptographically random strings.
        </p>
        <p>
          URL shortening services like bit.ly or custom shorteners create compact shareable links. Short URLs are essential for platforms with character limits like Twitter and look cleaner in messaging. Short URLs also provide click tracking independent of your analytics infrastructure. However, they add a redirect hop that slightly increases load time and may be flagged by spam filters.
        </p>

        <h3 className="mt-6">Share Previews</h3>
        <p>
          Share previews determine how content appears when shared on social platforms. Open Graph tags control Facebook and LinkedIn previews, specifying title, description, image, and URL. The og:image tag is particularly important—social platforms display large preview images that significantly impact click-through rates. Recommended image size is 1200x630 pixels for optimal display across platforms.
        </p>
        <p>
          Twitter Cards provide Twitter-specific preview control. The twitter:card tag specifies card type (summary or summary_large_image), while twitter:title, twitter:description, and twitter:image control content. Twitter also supports twitter:creator for attributing content to specific Twitter accounts, which can increase engagement through creator visibility.
        </p>
        <p>
          Preview customization enables different content for different platforms. A news article might show the headline for Twitter but a more detailed description for LinkedIn's professional audience. Implementation requires server-side rendering or pre-generated HTML snapshots, as social platform crawlers don't execute JavaScript. Testing tools like Facebook Sharing Debugger and Twitter Card Validator help verify preview appearance before sharing.
        </p>

        <h3 className="mt-6">Share Tracking</h3>
        <p>
          Share tracking captures when users initiate shares and which destinations they select. Event tracking logs share action with content ID, destination, and user context. This data reveals which content gets shared most, which destinations users prefer, and how share behavior varies by user segment. Share analytics inform content strategy and product decisions about which destinations to prioritize.
        </p>
        <p>
          Click-through tracking measures how many people click on shared links. This requires tracking parameters in the shared URL and analytics infrastructure to attribute clicks to specific shares. Click-through rate varies significantly by destination—shares to close contacts via messaging typically have higher CTR than broadcast social shares. Understanding CTR by destination helps optimize share flow and content formatting.
        </p>
        <p>
          Viral coefficient calculation measures how many new users each sharing user brings. K-factor equals invites per user multiplied by conversion rate. A K-factor above 1.0 indicates viral growth where each user brings more than one new user. Tracking viral coefficient over time reveals whether product changes improve or degrade viral growth. Most consumer products have K-factors well below 1.0, making viral growth rare and valuable.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Share UI architecture spans client interaction, link generation, external integrations, and analytics tracking. The client component manages share button interaction, destination selection, and feedback. Link generation creates shareable URLs with tracking parameters. External integrations handle platform-specific share flows. Analytics tracking captures share events and click-throughs for measurement.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/share-ui/share-architecture.svg"
          alt="Share Architecture"
          caption="Figure 1: Share Architecture — Client share UI, link generation, external platform integration, and analytics tracking"
          width={1000}
          height={500}
        />

        <h3>Client Component Architecture</h3>
        <p>
          The share button component triggers the share flow on user interaction. It may display a share count if the platform tracks and displays share metrics. On click, the component either invokes the Web Share API or opens a custom share modal. The component should be reusable across contexts—article pages, video players, product pages—with consistent behavior and appearance.
        </p>
        <p>
          Share modals display available share destinations as selectable options. Destinations are typically ordered by usage frequency with most-used options first. The modal should support both icon-only and icon-with-label display modes depending on available space. Dismissal should occur on destination selection, background click, or escape key press.
        </p>
        <p>
          Copy link functionality requires clipboard API integration with fallback for older browsers. On successful copy, display a toast notification confirming "Link copied to clipboard." On failure, provide manual copy instructions with the URL displayed for manual selection. Clipboard operations should be secure—only copy over HTTPS connections to prevent man-in-the-middle attacks.
        </p>

        <h3 className="mt-6">Web Share API Integration</h3>
        <p>
          Web Share API integration begins with feature detection checking for navigator.share availability. The API accepts a share data object with title, text, and URL properties. Not all properties are required—platforms may use different combinations. The API returns a promise that resolves on successful share or rejects on cancellation or error.
        </p>
        <p>
          Web Share API Level 2 extends the base API with file sharing capability. This enables sharing images, documents, and other files directly from web applications. File sharing requires user gesture (click) to invoke and has size limitations that vary by platform. Browser support is more limited than base Web Share API, requiring careful fallback handling.
        </p>
        <p>
          Error handling addresses share cancellation, unsupported content types, and platform-specific failures. Share cancellation (user closes the share dialog without selecting a destination) is common and should not be treated as an error. Log actual errors for debugging but don't display error notifications for user cancellations. Provide fallback to custom share modal if Web Share API fails.
        </p>

        <h3 className="mt-6">Share Action Flow</h3>
        <p>
          When a user initiates share, the client generates the share URL with tracking parameters. The URL includes content identifier, user ID for attribution, and UTM parameters for analytics. If using URL shortening, the client requests a short URL from the shortening service and caches it for future shares of the same content.
        </p>
        <p>
          For Web Share API, the client calls navigator.share with the prepared share data. The OS displays the share sheet, and the user selects a destination. The share completes in the external app, and control returns to your application. Track the share event when the user selects a destination, before the external app opens, to capture the intent even if the external share fails.
        </p>
        <p>
          For custom share modals, clicking a destination opens the appropriate share URL in a new window or tab. Twitter uses intent/tweet URLs, Facebook uses sharer.php, LinkedIn uses shareLink. Each platform has specific URL formats and parameter names. After opening the share window, track the share event and close the modal. Some platforms provide share confirmation callbacks, but most do not—track on intent rather than completion.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/share-ui/share-destinations.svg"
          alt="Share Destinations"
          caption="Figure 2: Share Destinations — Social platforms, messaging apps, email, copy link, and embed options"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Open Graph Implementation</h3>
        <p>
          Open Graph tags are placed in the HTML head section and crawled by social platforms when URLs are shared. Required tags include og:title for the content title, og:description for the summary, og:image for the preview image, and og:url for the canonical URL. Optional tags include og:type (article, video, etc.), og:site_name, and og:locale for internationalization.
        </p>
        <p>
          Dynamic content requires server-side rendering of Open Graph tags. When a URL is shared, social platform crawlers fetch the HTML and extract OG tags without executing JavaScript. Static site generation or server-side rendering ensures crawlers receive complete OG tags. For single-page applications without SSR, consider generating OG tag snapshots or using services that provide dynamic OG image generation.
        </p>
        <p>
          Image optimization for social previews requires attention to size, aspect ratio, and content. Facebook recommends 1200x630 pixels (1.91:1 ratio) for link previews. Twitter summary cards work best at 1200x600 pixels. Include text overlay on images for context when viewed without surrounding content. Avoid images with important content near edges that may be cropped on different platforms.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Share UI design involves numerous trade-offs affecting user experience, tracking capability, and implementation complexity. Understanding these trade-offs enables informed decisions aligned with growth goals and technical constraints.
        </p>

        <h3>Native vs Custom Share Trade-offs</h3>
        <p>
          Native Web Share API provides the best user experience with familiar OS-native dialogs and access to all installed sharing destinations. Users see apps they actually use rather than a curated list. However, native share provides limited tracking—you know the user opened the share sheet but not which destination they selected. Desktop browser support is incomplete, requiring fallback implementation.
        </p>
        <p>
          Custom share modals provide full tracking of destination selection and complete control over the share experience. You can A/B test destination ordering, highlight promoted destinations, and customize the UI to match your brand. However, custom modals cannot access apps not explicitly supported, requiring users to copy link for unsupported destinations. Implementation requires maintaining integrations with each share destination.
        </p>
        <p>
          Hybrid approaches use Web Share API when available with custom modal fallback. This provides optimal experience for most users while maintaining universal compatibility. The trade-off is implementation complexity—two code paths to maintain and potential inconsistency in tracking between native and custom flows. For most platforms, hybrid provides the best balance of user experience and functionality.
        </p>

        <h3>Share Button Placement</h3>
        <p>
          Inline share buttons within content are always visible but may distract from content consumption. Placing buttons at the end of content captures users who finished reading and are most likely to share. Floating share buttons that follow scroll maximize visibility but can obstruct content on smaller screens. Testing different placements for your specific content type and audience is essential.
        </p>
        <p>
          Mobile share placement requires special consideration. Bottom-of-screen placement is thumb-friendly and doesn't obstruct content. Top placement may conflict with navigation. Consider platform conventions—iOS apps typically place share at bottom, Android at top. Responsive design should adapt share button placement based on screen size and orientation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/share-ui/share-tracking-flow.svg"
          alt="Share Tracking Flow"
          caption="Figure 3: Share Tracking Flow — UTM parameters, referral attribution, click tracking, and viral coefficient calculation"
          width={1000}
          height={450}
        />

        <h3>Tracking Depth vs Privacy</h3>
        <p>
          Comprehensive share tracking captures user ID, content ID, destination, timestamp, and subsequent click-throughs. This data enables precise attribution and viral coefficient calculation. However, extensive tracking raises privacy concerns and may trigger browser privacy features that block tracking parameters. GDPR and CCPA require explicit consent for certain tracking.
        </p>
        <p>
          Privacy-focused tracking uses anonymized identifiers and aggregates data to prevent individual user profiling. First-party tracking (your domain to your domain) faces fewer restrictions than third-party tracking. Consider offering privacy-respecting sharing options like copy link that don't require tracking parameters while still enabling sharing.
        </p>
        <p>
          The balance between tracking and privacy affects user trust and regulatory compliance. Transparent privacy policies explaining what share data is collected and how it's used build user trust. Provide opt-out mechanisms for users who don't want their shares tracked. Consider the minimum tracking necessary for your growth goals rather than maximum possible tracking.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Web Share API with fallback:</strong> Detect navigator.share and use native share when available. Fall back to custom modal for unsupported browsers. This provides optimal experience for most users while maintaining universal compatibility.
          </li>
          <li>
            <strong>Include UTM parameters:</strong> Add utm_source, utm_medium, and utm_campaign to all shared URLs. This enables analytics attribution showing which destinations drive the most traffic and conversions.
          </li>
          <li>
            <strong>Optimize Open Graph tags:</strong> Set og:title, og:description, and og:image for all shareable content. Use 1200x630 pixel images for optimal social preview display. Test previews with Facebook Sharing Debugger and Twitter Card Validator.
          </li>
          <li>
            <strong>Provide copy link fallback:</strong> Always include copy link as an option even when other share destinations are available. This works everywhere and users can paste into any destination.
          </li>
          <li>
            <strong>Show share confirmation:</strong> Display toast notification when link is copied to clipboard. For native share, don't show confirmation since the OS handles feedback.
          </li>
          <li>
            <strong>Limit destination options:</strong> Show 5-8 most relevant share destinations. Too many options create decision paralysis. Order by usage frequency with most-used first.
          </li>
          <li>
            <strong>Track share events:</strong> Log share initiation with content ID and destination. Track click-throughs from shared links to measure share effectiveness and calculate viral coefficient.
          </li>
          <li>
            <strong>Support deep linking:</strong> For app-to-app sharing, use deep links that open specific content in your mobile app rather than the web. This improves user experience for app users.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Web Share API fallback:</strong> Relying solely on Web Share API excludes users on unsupported browsers. Always implement custom modal fallback for universal compatibility.
          </li>
          <li>
            <strong>Missing Open Graph tags:</strong> Sharing content without OG tags results in broken or missing previews. This significantly reduces click-through rates. Implement OG tags for all shareable content.
          </li>
          <li>
            <strong>No share tracking:</strong> Without tracking, you cannot measure which content gets shared or which destinations are most effective. Implement share event tracking from launch.
          </li>
          <li>
            <strong>Too many share options:</strong> Displaying 15+ share destinations overwhelms users. Limit to 5-8 most relevant options. Use "More" expansion if additional options are needed.
          </li>
          <li>
            <strong>No copy confirmation:</strong> Users don't know if copy link succeeded without feedback. Always show toast notification on successful copy.
          </li>
          <li>
            <strong>Poor mobile experience:</strong> Share buttons that are too small or poorly positioned frustrate mobile users. Ensure 44px minimum touch targets and thumb-friendly placement.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Share Implementation</h3>
        <p>
          Twitter uses Web Share API on supported platforms with custom modal fallback. Share URLs include pre-populated tweet text with content title and link. Twitter Cards display rich previews with images when tweets are shared. The platform tracks share events and provides share counts for tweets. Twitter's intent URLs support additional parameters like hashtags and mention suggestions.
        </p>

        <h3 className="mt-6">YouTube Share Features</h3>
        <p>
          YouTube provides share modal with destination icons and timestamp option. Users can check "Start at" to share a specific video moment, which appends ?t=seconds to the shared URL. YouTube generates short youtu.be URLs for cleaner sharing. Share tracking includes destination selection and click-through attribution. YouTube Studio shows creators share metrics for their videos.
        </p>

        <h3 className="mt-6">Instagram Story Sharing</h3>
        <p>
          Instagram enables sharing posts and external content to Stories with interactive stickers. Shared posts appear as tappable stickers that viewers can tap to see the original. External links require 10K+ followers or verified accounts for the link sticker. Instagram tracks Story shares separately from other engagement metrics, providing creators with share-specific analytics.
        </p>

        <h3 className="mt-6">Spotify Share Integration</h3>
        <p>
          Spotify integrates with Instagram Stories for visual song sharing. Users share songs as Stories with album art and interactive playback sticker. Viewers tap to play the song in Spotify. Spotify uses deep linking to open specific content in the app. Share tracking attributes new signups to the sharing user for referral programs.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track shares?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Add UTM parameters to share links identifying the source (utm_source=twitter), medium (utm_medium=social), and campaign (utm_campaign=spring_promo). Log share events when users click share destinations, capturing content ID, destination, user ID, and timestamp. Track click-throughs when shared links are clicked, attributing the visit to the original share. Calculate viral coefficient by dividing new users from shares by total shares over a time period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle share preview?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Set Open Graph tags in HTML head for Facebook and LinkedIn previews. Include og:title, og:description, og:image (1200x630px), and og:url. Set Twitter Card tags for Twitter previews including twitter:card type, twitter:title, twitter:description, and twitter:image. Use server-side rendering to ensure crawlers receive complete OG tags since they don't execute JavaScript. Test previews with Facebook Sharing Debugger and Twitter Card Validator before deployment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement native share?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect Web Share API support with 'share' in navigator. Call navigator.share with share data object containing title, text, and URL. Handle the promise—resolve on successful share, reject on cancellation or error. Don't treat user cancellation as an error. Implement fallback to custom share modal if navigator.share is undefined or throws. For file sharing, use Web Share API Level 2 with files array, checking browser support first.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize for viral sharing?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Make share buttons prominent and accessible—place at end of content and as floating button on mobile. Pre-populate share text with compelling message that encourages clicks. Use engaging share images with text overlay for context. Implement referral incentives where both sharer and recipient receive benefit. Track and optimize share destinations based on conversion rates. A/B test share button placement, copy, and design to improve share rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle share failures?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Catch share API errors including user abort, unsupported content type, and platform failures. For user abort (closing share sheet), don't show error—this is expected behavior. For actual failures, show friendly error message like "Couldn't share. Try copying the link instead." Offer copy link as fallback. Log failures with error type and context for debugging. Implement retry mechanism for transient network failures.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate short share links?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use URL shortener service API (bit.ly, TinyURL) or build custom shortener. Generate unique short code (6-8 characters) and store mapping to original URL in database. Return short URL for sharing. Track clicks on short URLs before redirecting to original. Cache short URLs to avoid regenerating for same content. Use custom domain for branded short links (your.co/abc123). Implement rate limiting to prevent shortener abuse.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Web Share API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://ogp.me/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Graph Protocol — OG Tags Specification
            </a>
          </li>
          <li>
            <a
              href="https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Developer — Twitter Cards Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developers.facebook.com/tools/debug/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook — Sharing Debugger Tool
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/web-share/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Web.dev — Web Share API Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-content-preview",
  title: "Content Preview",
  description:
    "Comprehensive guide to implementing content preview covering live preview, responsive preview, social preview cards, draft watermarks, preview security, and UX patterns for effective content validation before publishing.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-preview",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "content",
    "preview",
    "frontend",
    "responsive",
    "draft",
  ],
  relatedTopics: ["create-content-ui", "edit-content-ui", "responsive-design", "content-publishing"],
};

export default function ContentPreviewArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Content Preview enables users to see how their content will appear when published, allowing them to catch formatting issues, optimize presentation, and validate the user experience before going live. Preview functionality is essential for content creation workflows—authors need to verify formatting (headings, images, links render correctly), responsive behavior (content looks good on mobile, tablet, desktop), social sharing (preview cards display properly on Twitter, Facebook, LinkedIn), and overall presentation (layout, typography, spacing match expectations). For platforms with rich content creation (blogs, e-commerce product listings, marketing pages, documentation), effective preview is critical for content quality and author confidence.
        </p>
        <p>
          For staff and principal engineers, content preview architecture involves preview modes (live preview, full preview, responsive preview), rendering strategies (client-side rendering, server-side rendering, hybrid), social preview (Open Graph, Twitter Cards, LinkedIn preview), draft watermarks (indicate unpublished status), preview security (prevent unauthorized access to drafts), and performance optimization (fast preview generation without impacting editor performance). The implementation must balance preview accuracy (match published output exactly) with performance (instant preview without lag) and security (drafts not accessible to unauthorized users). Poor preview implementation leads to publishing errors, frustrated authors, and degraded content quality.
        </p>
        <p>
          The complexity of content preview extends beyond simple rendering. Live preview must update in real-time without lag (debounced rendering, efficient diffing). Responsive preview must accurately simulate different devices (viewport sizes, touch interactions, performance characteristics). Social preview must fetch and render external preview cards (Open Graph metadata, Twitter Cards). Draft watermarks must be visible but not obstructive. Preview security must prevent unauthorized access (authentication, authorization, expiring preview URLs). For staff engineers, preview is a content quality tool affecting author experience, content accuracy, and publishing confidence.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Preview Modes</h3>
        <p>
          Live preview updates in real-time as user types. Side-by-side layout (editor on left, preview on right). Debounced rendering (update after user stops typing for 300-500ms to avoid excessive re-renders). Efficient diffing (only re-render changed portions). Live preview enables quick formatting checks without leaving editor. Benefits include immediate feedback (see formatting as you write), reduced context switching (don&apos;t need to navigate to separate preview). Drawbacks include performance impact (rendering while typing can lag editor), limited context (side-by-side view may not show full page layout).
        </p>
        <p>
          Full preview renders content on dedicated preview page. Separate URL (preview.example.com/post/123/preview). Full page context (shows complete layout including header, footer, navigation). Shareable URL (send preview link to reviewers). Full preview enables final review before publishing. Benefits include accurate representation (exact published output), full context (see how content fits in page), shareable (collaborators can review). Drawbacks includes context switching (navigate away from editor), slower (requires page load).
        </p>
        <p>
          Responsive preview shows content at different device sizes. Device toggles (mobile, tablet, desktop buttons). Viewport simulation (resize preview to device dimensions). Touch simulation (simulate touch interactions for mobile). Responsive preview enables checking mobile experience before publishing. Benefits include mobile validation (ensure content works on mobile), responsive issues caught early (fix before publishing). Drawbacks includes complexity (multiple viewport rendering), may not perfectly simulate device characteristics (performance, touch accuracy).
        </p>

        <h3 className="mt-6">Social Preview</h3>
        <p>
          Open Graph metadata controls how content appears when shared on Facebook, LinkedIn, and other platforms. og:title (page title), og:description (page description), og:image (preview image), og:url (canonical URL). Open Graph metadata must be set correctly for proper social sharing. Preview shows how link will appear on social platforms. Benefits include social optimization (ensure attractive preview), click-through improvement (good previews get more clicks).
        </p>
        <p>
          Twitter Cards control Twitter link preview. Card types (summary, summary with large image, player card). Twitter-specific metadata (twitter:card, twitter:title, twitter:description, twitter:image). Twitter preview shows how link will appear in tweets. Benefits include Twitter optimization (ensure attractive tweet preview), engagement improvement.
        </p>
        <p>
          LinkedIn preview displays when content is shared on LinkedIn. LinkedIn uses Open Graph metadata with some LinkedIn-specific enhancements. LinkedIn preview shows title, description, image. Preview ensures professional appearance on LinkedIn. Benefits include LinkedIn optimization, professional presentation.
        </p>

        <h3 className="mt-6">Draft Watermarks and Indicators</h3>
        <p>
          Draft watermarks indicate content is unpublished. Visual indicator (&quot;DRAFT&quot; watermark overlaid on preview). Banner (draft banner at top of preview). URL indicator (preview URL contains /draft/ or /preview/). Watermarks prevent confusion between draft and published content. Benefits include clear status (know this is draft), prevents accidental sharing (looks unpublished). Drawbacks includes visual obstruction (watermark may block content).
        </p>
        <p>
          Preview expiration limits preview URL lifetime. Time-limited URLs (preview URL expires after 7 days). Authentication required (must be logged in to view preview). Owner-only access (only content author can view preview). Expiration prevents stale previews from circulating. Benefits include security (old previews inaccessible), accuracy (previews reflect current content).
        </p>

        <h3 className="mt-6">Preview Rendering Strategies</h3>
        <p>
          Client-side rendering renders preview in browser. Fast for live preview (no server round-trip). May not match server rendering exactly (browser differences). Benefits include speed (instant preview), offline capability (preview without server). Drawbacks includes accuracy (may not match published output), JavaScript required.
        </p>
        <p>
          Server-side rendering renders preview on server. Accurate (matches published output exactly). Requires server round-trip (slower than client-side). Benefits include accuracy (exact published output), works without JavaScript. Drawbacks includes latency (server request required), server load (preview requests consume server resources).
        </p>
        <p>
          Hybrid rendering combines client and server. Live preview uses client-side (fast, frequent updates). Full preview uses server-side (accurate, final review). Benefits include best of both (fast live, accurate full). Drawbacks includes complexity (two rendering paths).
        </p>

        <h3 className="mt-6">Preview Security</h3>
        <p>
          Authentication ensures only authorized users access preview. Login required (must be authenticated). Session validation (valid session required). Benefits include draft protection (unauthorized users can&apos;t see drafts).
        </p>
        <p>
          Authorization ensures only permitted users access specific previews. Owner access (content author can preview). Collaborator access (team members can preview). Admin access (admins can preview all). Benefits include access control (right people see drafts).
        </p>
        <p>
          Preview URL security prevents unauthorized access. Token-based URLs (preview URL includes secure token). Expiring URLs (URLs expire after time). Benefits include link security (can&apos;t guess preview URLs), time-limited access (old links stop working).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Content preview architecture spans preview service, rendering engine, social preview generator, and security layer. Preview service manages preview requests and URLs. Rendering engine generates preview output. Social preview generator creates social media preview cards. Security layer ensures only authorized access. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/preview-modes.svg"
          alt="Preview Modes"
          caption="Figure 1: Preview Modes — Live preview, full preview, and responsive preview comparison"
          width={1000}
          height={500}
        />

        <h3>Preview Service</h3>
        <p>
          Preview service manages preview generation and URLs. Preview URL generation (create unique preview URL per draft). URL expiration (URLs expire after configurable period). Access control (check authentication/authorization). Preview service is the entry point for all preview requests.
        </p>
        <p>
          Preview caching improves performance. Render cache (cache rendered preview for speed). Invalidation (invalidate cache when content changes). Cache headers (appropriate caching for preview content). Caching reduces server load and improves preview speed.
        </p>

        <h3 className="mt-6">Rendering Engine</h3>
        <p>
          Rendering engine generates preview output. Template rendering (apply content to page template). Asset inclusion (CSS, JavaScript, images). Layout rendering (header, footer, navigation). Rendering must match published output exactly for accurate preview.
        </p>
        <p>
          Responsive rendering handles different device sizes. Viewport detection (detect requested device size). Responsive CSS (apply responsive styles). Image resizing (serve appropriate image sizes). Responsive rendering ensures preview matches how content will appear on different devices.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/social-preview.svg"
          alt="Social Preview"
          caption="Figure 2: Social Preview — Open Graph, Twitter Cards, and LinkedIn preview generation"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Social Preview Generator</h3>
        <p>
          Social preview generator creates social media preview cards. Metadata extraction (extract title, description, image from content). Open Graph generation (generate og:* tags). Twitter Card generation (generate twitter:* tags). LinkedIn preview (generate LinkedIn-specific metadata). Social preview ensures content looks good when shared.
        </p>
        <p>
          Social preview validation checks metadata completeness. Required fields (title, description, image present). Image validation (image meets size requirements). URL validation (canonical URL set). Validation ensures social previews render correctly.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/preview-security.svg"
          alt="Preview Security"
          caption="Figure 3: Preview Security — Authentication, authorization, and expiring URLs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Content preview design involves trade-offs between accuracy and performance, client-side and server-side rendering, and open and restricted preview access. Understanding these trade-offs enables informed decisions aligned with platform requirements and user needs.
        </p>

        <h3>Rendering: Client-side vs. Server-side</h3>
        <p>
          Client-side rendering (render in browser). Pros: Fast (no server round-trip), works offline (preview without server), low server load (client does work). Cons: May not match server exactly (browser differences), JavaScript required (no JS = no preview), initial load may be slow (download rendering code). Best for: Live preview, frequent updates, simple content.
        </p>
        <p>
          Server-side rendering (render on server). Pros: Accurate (matches published output), works without JavaScript, consistent (same rendering for all users). Cons: Slower (server round-trip required), server load (preview requests consume resources), requires server capacity. Best for: Full preview, final review, complex content.
        </p>
        <p>
          Hybrid: client-side live, server-side full. Pros: Best of both (fast live preview, accurate full preview). Cons: Complexity (two rendering paths), maintenance overhead. Best for: Most platforms—client-side for live, server-side for full preview.
        </p>

        <h3>Preview Access: Open vs. Restricted</h3>
        <p>
          Open preview (anyone with URL can view). Pros: Easy sharing (send link to anyone), no authentication friction, simple implementation. Cons: Security risk (drafts accessible if URL leaked), no access control, URLs may be guessed. Best for: Public previews, marketing content, low-sensitivity drafts.
        </p>
        <p>
          Restricted preview (authentication required). Pros: Secure (drafts protected), access control (only authorized users), audit trail (track who viewed). Cons: Sharing friction (recipients must log in), implementation complexity, authentication overhead. Best for: Sensitive content, internal reviews, user drafts.
        </p>
        <p>
          Hybrid: token-based URLs with expiration. Pros: Best of both (shareable links, time-limited access). Cons: Complexity (token generation, expiration), URL management. Best for: Most platforms—token-based URLs that expire after period.
        </p>

        <h3>Live Preview: Real-time vs. Debounced</h3>
        <p>
          Real-time (update on every keystroke). Pros: Instant feedback (see changes immediately), smooth experience (no delay). Cons: Performance impact (excessive re-rendering), server load (many requests), may lag editor. Best for: Simple content, powerful clients, low-latency servers.
        </p>
        <p>
          Debounced (update after typing pause). Pros: Better performance (fewer re-renders), reduced server load, smoother editor experience. Cons: Slight delay (wait for debounce period), may feel less responsive. Best for: Most platforms—300-500ms debounce balances responsiveness with performance.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/preview-comparison.svg"
          alt="Preview Approaches Comparison"
          caption="Figure 4: Preview Approaches Comparison — Rendering, access, and update strategy trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide multiple preview modes:</strong> Live preview for quick checks. Full preview for final review. Responsive preview for mobile validation.
          </li>
          <li>
            <strong>Use hybrid rendering:</strong> Client-side for live preview (fast). Server-side for full preview (accurate).
          </li>
          <li>
            <strong>Implement social preview:</strong> Open Graph for Facebook/LinkedIn. Twitter Cards for Twitter. Preview social cards before publishing.
          </li>
          <li>
            <strong>Add draft watermarks:</strong> Clear &quot;DRAFT&quot; indicator. Prevents confusion with published content.
          </li>
          <li>
            <strong>Secure preview URLs:</strong> Token-based URLs. Expiration (7 days typical). Authentication required.
          </li>
          <li>
            <strong>Debounce live preview:</strong> 300-500ms delay. Reduces re-rendering. Improves editor performance.
          </li>
          <li>
            <strong>Cache previews:</strong> Cache rendered output. Invalidate on content change. Reduces server load.
          </li>
          <li>
            <strong>Validate social metadata:</strong> Check required fields. Image size validation. Warn if incomplete.
          </li>
          <li>
            <strong>Support responsive preview:</strong> Mobile, tablet, desktop views. Touch simulation for mobile. Accurate viewport rendering.
          </li>
          <li>
            <strong>Track preview usage:</strong> Who viewed preview. When preview accessed. Preview-to-publish conversion.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Preview doesn&apos;t match published:</strong> Client-side differs from server. <strong>Solution:</strong> Use server-side for full preview, validate rendering matches.
          </li>
          <li>
            <strong>Slow live preview:</strong> Laggy editor experience. <strong>Solution:</strong> Debounce rendering, optimize diffing, use client-side for live.
          </li>
          <li>
            <strong>No responsive preview:</strong> Mobile issues caught after publishing. <strong>Solution:</strong> Provide responsive preview with device toggles.
          </li>
          <li>
            <strong>Insecure preview URLs:</strong> Drafts accessible to unauthorized users. <strong>Solution:</strong> Token-based URLs, authentication, expiration.
          </li>
          <li>
            <strong>No social preview:</strong> Poor social sharing appearance. <strong>Solution:</strong> Open Graph, Twitter Cards preview before publishing.
          </li>
          <li>
            <strong>No draft indicators:</strong> Confusion between draft and published. <strong>Solution:</strong> Clear watermarks, banners, URL indicators.
          </li>
          <li>
            <strong>Preview URLs never expire:</strong> Old drafts accessible indefinitely. <strong>Solution:</strong> Expiring URLs (7 days typical).
          </li>
          <li>
            <strong>No preview caching:</strong> Slow preview generation, high server load. <strong>Solution:</strong> Cache rendered previews, invalidate on change.
          </li>
          <li>
            <strong>Social metadata not validated:</strong> Missing image, wrong dimensions. <strong>Solution:</strong> Validate metadata, warn if incomplete.
          </li>
          <li>
            <strong>No preview analytics:</strong> Don&apos;t know if preview is used. <strong>Solution:</strong> Track preview views, preview-to-publish rate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Blog Platform Preview</h3>
        <p>
          Blog platform provides comprehensive preview. Live preview (side-by-side, debounced rendering). Full preview (dedicated URL, shareable with editors). Responsive preview (mobile, tablet, desktop toggles). Social preview (Open Graph, Twitter Cards preview). Draft watermark (&quot;DRAFT&quot; banner). Preview URL expires after 7 days. Authentication required for preview access.
        </p>

        <h3 className="mt-6">E-commerce Product Listing Preview</h3>
        <p>
          E-commerce platform provides product preview. Live preview (see product page as editing). Full preview (complete product page with related products). Mobile preview (critical for shopping experience). Social preview (product sharing on social media). Draft indicator (unpublished products marked). Preview accessible to merchandising team. Preview expires when product published.
        </p>

        <h3 className="mt-6">Documentation Site Preview</h3>
        <p>
          Documentation platform provides technical preview. Live preview (Markdown rendered in real-time). Full preview (complete docs site with navigation). Table of contents preview (see generated TOC). Link validation (check internal links work). Code syntax highlighting preview. Draft watermark for unpublished docs. Preview shareable with team for review.
        </p>

        <h3 className="mt-6">Marketing Page Builder Preview</h3>
        <p>
          Marketing page builder provides visual preview. Live preview (WYSIWYG editing with instant preview). Full preview (complete page with all components). Responsive preview (critical for marketing pages). A/B test preview (see variant appearance). Social preview (how page appears when shared). Draft indicator for unpublished pages. Preview accessible to marketing team.
        </p>

        <h3 className="mt-6">Email Campaign Preview</h3>
        <p>
          Email platform provides email preview. Live preview (email content as editing). Inbox preview (how email appears in inbox). Mobile email preview (critical for email). Email client preview (Gmail, Outlook, Apple Mail rendering). Spam score preview (likelihood of hitting spam). Send test email (actual email to test inbox). Draft indicator for unsent campaigns.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure preview matches published output exactly?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use server-side rendering for full preview. Same rendering pipeline as publishing (same templates, same assets). Validation testing (compare preview vs. published output). Client-side for live preview (fast), server-side for full preview (accurate). The key insight: preview accuracy is critical for user trust—if preview doesn&apos;t match published, users won&apos;t trust preview. Invest in accurate rendering.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize live preview performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement debounced rendering (300-500ms delay). Efficient diffing (only re-render changed portions). Client-side rendering (no server round-trip). Web Workers for heavy rendering (don&apos;t block UI). Cache rendered portions (re-use unchanged sections). The performance insight: live preview must feel instant—any lag breaks the flow. Optimize rendering pipeline for speed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure preview URLs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement token-based URLs (include secure random token). Authentication required (must be logged in). Authorization check (user must have access to content). URL expiration (tokens expire after 7 days). Audit logging (track who accessed preview). The security insight: preview URLs are often shared—must protect against unauthorized access while enabling legitimate sharing. Token-based expiration balances both.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle responsive preview?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement viewport simulation (resize preview container to device dimensions). CSS media queries (responsive styles apply). Touch simulation (simulate touch events for mobile). Device presets (common device sizes: iPhone, iPad, desktop). Actual rendering (not just resize—test responsive behavior). The UX insight: mobile traffic is majority for many platforms—responsive preview is essential, not optional.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement social preview?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Extract metadata (title, description, image from content). Generate Open Graph tags (og:title, og:description, og:image). Generate Twitter Card tags (twitter:card, twitter:title, etc.). Preview rendering (show how link appears on each platform). Validation (warn if missing required fields, image too small). The social insight: social sharing drives significant traffic—social preview optimization directly impacts click-through rates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle preview caching?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Cache rendered preview (store HTML output). Cache key includes content version (invalidate on change). TTL-based expiration (cache expires after time). Manual invalidation (invalidate when content updated). Cache warming (pre-render preview for active drafts). The performance insight: preview generation can be expensive—caching reduces server load and improves preview speed, but must invalidate correctly to show current content.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://ogp.me/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Graph Protocol — Standard for Social Preview
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
              href="https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin?lang=en"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Help — Making Your Website Shareable on LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/preview/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Preview Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developers.facebook.com/docs/sharing/webmasters/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Developers — Sharing Debugger
            </a>
          </li>
          <li>
            <a
              href="https://schema.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schema.org — Structured Data for Rich Previews
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-view-content",
  title: "View Content Pages",
  description:
    "Comprehensive guide to implementing content viewing interfaces covering content rendering (rich text, markdown, blocks), pagination strategies (infinite scroll, numbered pages), related content algorithms, engagement features (comments, shares, reactions), reading progress tracking, accessibility (WCAG compliance), SEO optimization (structured data, meta tags), and performance considerations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "view-content-pages",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "view",
    "rendering",
    "frontend",
    "seo",
  ],
  relatedTopics: ["discovery", "engagement", "seo"],
};

export default function ViewContentPagesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>View Content Pages</strong> is the primary interface for consuming published
          content. It must provide optimal reading experience through proper typography, layout,
          and media rendering, engagement features enabling user interaction (comments, shares,
          reactions), and discovery of related content through recommendations. View pages are
          critical for user experience — poor reading experience causes high bounce rates, while
          well-designed view pages increase time on page, engagement, and return visits.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/view-content-layout.svg"
          alt="View Content Layout"
          caption="View Content Layout — showing content body, metadata display, engagement features, related content sidebar, and table of contents"
        />

        <p>
          For staff and principal engineers, implementing view pages requires deep understanding of
          content rendering including rich text rendering (HTML sanitization, XSS prevention),
          markdown rendering (markdown to HTML conversion, syntax highlighting for code), and
          block-based rendering (rendering block tree with proper styling). Pagination strategies
          encompass infinite scroll (automatic loading of more content, ideal for feeds), numbered
          pages (traditional pagination, ideal for articles and search results), and load more
          button (manual trigger for more content). Related content algorithms include
          content-based filtering (similar topics, tags, categories), collaborative filtering
          (users who read this also read), and hybrid approaches combining both. Engagement features
          encompass comments (threaded discussions, moderation), shares (social sharing, copy link),
          reactions (likes, claps, emoji reactions), and bookmarks (save for later reading). Reading
          progress tracking enables progress bar showing reading completion, estimated time
          remaining, and scroll-based progress. Accessibility requires WCAG 2.1 compliance through
          proper heading structure, alt text for images, keyboard navigation, and screen reader
          support. SEO optimization encompasses structured data (schema.org markup), meta tags
          (title, description, Open Graph), canonical URLs, and performance optimization (Core Web
          Vitals). The implementation must balance content visibility with user engagement and
          discovery while maintaining performance and accessibility.
        </p>

        <p>
          Modern view pages have evolved from simple article display to sophisticated reading
          experiences with personalized recommendations, interactive engagement, and accessibility
          features. Platforms like Medium provide clean reading experience with claps and
          highlights, Substack offers newsletter-style reading with comments, and news sites like
          NYT provide related articles and multimedia integration. Performance optimization through
          lazy loading, code splitting, and CDN delivery ensures fast page loads critical for user
          retention and SEO ranking.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          View content pages are built on fundamental concepts that determine how content is
          rendered, engaged with, and discovered. Understanding these concepts is essential for
          designing effective reading experiences.
        </p>

        <p>
          <strong>Content Rendering:</strong> Rich text rendering converts stored HTML to rendered
          output through sanitization (XSS prevention through DOMPurify), CSS styling (typography,
          spacing, responsive design), and media embedding (images, videos, embeds with lazy
          loading). Markdown rendering converts markdown syntax to HTML through markdown parsers
          (marked, markdown-it) with syntax highlighting for code blocks (highlight.js, Prism).
          Block-based rendering renders block tree structure through component mapping (paragraph
          block → Paragraph component, image block → Image component) enabling flexible layouts.
        </p>

        <p>
          <strong>Pagination Strategies:</strong> Infinite scroll automatically loads more content
          when user scrolls near bottom through intersection observer providing seamless browsing
          ideal for feeds and social media but complicates bookmarking and footer access. Numbered
          pages provides traditional pagination (page 1, 2, 3) enabling bookmarking and direct
          navigation ideal for articles and search results but requires page reload or complex
          state management. Load more button provides manual trigger for more content balancing
          infinite scroll and numbered pages through explicit user action.
        </p>

        <p>
          <strong>Related Content:</strong> Content-based filtering recommends content through
          similar topics, tags, and categories providing explainable recommendations (similar
          because same topic) but limited to content attributes. Collaborative filtering recommends
          through user behavior (users who read this also read) providing serendipitous discovery
          but requires sufficient user data and has cold start problem. Hybrid approaches combine
          both through weighted scoring providing best of both explainability and serendipity.
        </p>

        <p>
          <strong>Engagement Features:</strong> Comments enable threaded discussions through
          nested comments, moderation (approval workflow, spam detection), and notifications
          (reply notifications, mention notifications). Shares enable content distribution through
          social sharing (Twitter, Facebook, LinkedIn share buttons), copy link (clipboard copy
          with tracking), and email share (email client integration). Reactions enable quick
          feedback through likes (binary like/unlike), claps (multiple claps showing appreciation
          level), and emoji reactions (various emoji for different reactions). Bookmarks enable
          save for later through user bookmarks (personal reading list) and reading queue
          (ordered reading list).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          View content page architecture separates content rendering, engagement features, related
          content, and SEO optimization enabling modular implementation with clear boundaries. This
          architecture is critical for reading experience, engagement, and discoverability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/view-content-layout.svg"
          alt="View Content Layout"
          caption="View Content Layout — showing content body, metadata display, engagement features, related content sidebar, and table of contents"
        />

        <p>
          View page flow begins with URL routing matching content slug or ID. Backend fetches
          content from database or cache including content body, metadata (author, date, category,
          tags), and engagement data (comment count, reaction count). Content is rendered through
          appropriate renderer (rich text, markdown, block-based) with sanitization and styling.
          Metadata is displayed including author info (name, avatar, bio link), dates (published,
          updated with relative time), category and tags (with links), and reading time estimate.
          Engagement features are rendered including comments section, share buttons, reaction
          buttons, and bookmark button. Related content is fetched through recommendation algorithm
          and displayed in sidebar or below content. Reading progress is tracked through scroll
          position updating progress bar. SEO metadata is rendered including title tag, meta
          description, Open Graph tags, and structured data.
        </p>

        <p>
          Content rendering architecture includes sanitizer (XSS prevention through DOMPurify
          removing script tags and event handlers), renderer (converts content to HTML through
          appropriate parser), and styler (applies typography and layout styles through CSS).
          Media lazy loading defers image and video loading until visible through intersection
          observer reducing initial page load. Code syntax highlighting applies language-specific
          styling through highlight.js or Prism.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/related-content.svg"
          alt="Related Content Algorithms"
          caption="Related Content — showing content-based filtering, collaborative filtering, and hybrid recommendation approaches"
        />

        <p>
          Related content architecture includes content-based filtering computing similarity through
          topic modeling (LDA, TF-IDF), tag overlap (Jaccard similarity), and category matching.
          Collaborative filtering computes similarity through user-item matrix (matrix
          factorization, SVD) and user behavior (co-reading patterns). Hybrid approach combines
          both through weighted scoring (content score × 0.6 + collaborative score × 0.4) providing
          balanced recommendations. Caching stores related content results reducing computation
          through Redis cache with TTL.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing view content pages involves trade-offs between reading experience, engagement,
          performance, and complexity. Understanding these trade-offs is essential for making
          informed architecture decisions.
        </p>

        <p>
          Infinite scroll versus numbered pages presents seamless browsing versus navigation
          trade-offs. Infinite scroll provides seamless content browsing without page reloads
          keeping users engaged through continuous content flow but complicates bookmarking (URL
          doesn't reflect position), footer access (footer pushed below viewport), and analytics
          (hard to track page views). Numbered pages provides clear navigation through page numbers
          enabling bookmarking, direct navigation, and accurate analytics but requires page reload
          or complex state management interrupting reading flow. The recommendation is infinite
          scroll for feeds and social media (engagement priority), numbered pages for articles and
          search results (navigation priority), and load more button for balanced approach.
        </p>

        <p>
          Content-based versus collaborative filtering presents explainability versus serendipity
          trade-offs. Content-based filtering provides explainable recommendations (similar because
          same topic, tags, category) working for new content (no user data required) and new users
          (no history required) but limited to content attributes creating filter bubble.
          Collaborative filtering provides serendipitous discovery (users who read this also read)
          through user behavior patterns but requires sufficient user data (cold start problem for
          new content and users) and less explainable. The recommendation is hybrid approach
          combining both through weighted scoring providing explainability with serendipity.
        </p>

        <p>
          Client-side rendering versus server-side rendering presents interactivity versus SEO
          trade-offs. Client-side rendering (CSR) provides rich interactivity through JavaScript
          frameworks (React, Vue) with fast subsequent navigation but poor SEO (search engines may
          not execute JavaScript) and slow initial load (download JavaScript bundle). Server-side
          rendering (SSR) provides excellent SEO (HTML rendered on server) and fast initial load
          (HTML ready immediately) but slower subsequent navigation (full page reload) and server
          load. The recommendation is SSR or static generation for content pages (SEO priority),
          CSR for interactive applications (interactivity priority), and hybrid through
          next-generation frameworks (Next.js, Nuxt) providing both.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing view content pages requires following established best practices to ensure
          reading experience, engagement, accessibility, and SEO.
        </p>

        <p>
          Content rendering sanitizes HTML preventing XSS through DOMPurify. Applies typography
          best practices (readable font size 16-18px, line height 1.6-1.8, line length 50-75
          characters). Implements lazy loading for images and videos reducing initial page load.
          Applies syntax highlighting for code blocks improving readability.
        </p>

        <p>
          Engagement features implements comments with threading (nested replies), moderation
          (approval workflow, spam detection), and notifications (reply, mention). Implements
          shares through social buttons (Twitter, Facebook, LinkedIn), copy link (clipboard with
          tracking), and email share. Implements reactions through likes, claps, or emoji
          reactions. Implements bookmarks for save for later reading.
        </p>

        <p>
          Related content implements hybrid recommendation combining content-based and collaborative
          filtering. Caches related content results reducing computation. Displays related content
          in sidebar or below content based on layout. Limits related content to 3-5 items
          preventing choice paralysis.
        </p>

        <p>
          Reading progress implements scroll-based progress bar showing reading completion.
          Displays estimated reading time based on word count (200-250 words per minute). Implements
          time remaining estimate updating as user scrolls.
        </p>

        <p>
          Accessibility implements WCAG 2.1 compliance through proper heading structure (H1 for
          title, H2 for sections), alt text for images, keyboard navigation (Tab, Enter, Escape),
          and screen reader support (ARIA labels). Implements focus management for interactive
          elements. Tests with screen readers (NVDA, VoiceOver).
        </p>

        <p>
          SEO optimization implements structured data (schema.org Article markup) enabling rich
          snippets. Implements meta tags (title, description, Open Graph for social sharing).
          Implements canonical URLs preventing duplicate content issues. Optimizes Core Web Vitals
          (LCP, FID, CLS) through performance optimization.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing view content pages to ensure reading
          experience, engagement, accessibility, and SEO.
        </p>

        <p>
          No XSS sanitization allows malicious scripts in content. Fix by sanitizing all HTML
          through DOMPurify before rendering. Remove script tags, event handlers, and javascript:
          URLs. Validate and sanitize on server-side never trusting client-side.
        </p>

        <p>
          Poor typography causes reading fatigue. Fix by using readable font size (16-18px for
          body), appropriate line height (1.6-1.8), and optimal line length (50-75 characters).
          Use high contrast text color. Provide sufficient whitespace.
        </p>

        <p>
          No lazy loading causes slow initial page load. Fix by implementing lazy loading for
          images and videos through intersection observer. Defer offscreen media loading. Use
          placeholder images (blurhash, low-quality preview).
        </p>

        <p>
          No related content limits content discovery. Fix by implementing related content through
          hybrid recommendation. Cache results for performance. Display in sidebar or below content.
        </p>

        <p>
          No reading progress frustrates long-form readers. Fix by implementing scroll-based
          progress bar. Display estimated reading time. Update time remaining as user scrolls.
        </p>

        <p>
          No accessibility excludes users with disabilities. Fix by implementing WCAG 2.1 compliance
          through proper heading structure, alt text, keyboard navigation, and screen reader
          support. Test with screen readers.
        </p>

        <p>
          No SEO optimization limits content discoverability. Fix by implementing structured data
          (schema.org), meta tags (title, description, Open Graph), and canonical URLs. Optimize
          Core Web Vitals.
        </p>

        <p>
          Infinite scroll without URL update prevents bookmarking. Fix by updating URL through
          history API as user scrolls. Enable direct navigation to scroll position. Provide page
          numbers as fallback.
        </p>

        <p>
          No engagement features limits user interaction. Fix by implementing comments, shares,
          reactions, and bookmarks. Moderate comments preventing spam. Track engagement analytics.
        </p>

        <p>
          No performance optimization causes high bounce rates. Fix by optimizing images (compress,
          responsive images), implementing code splitting, using CDN for static assets, and
          minimizing JavaScript bundle size.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          View content pages are critical for content consumption across different domains. Here
          are real-world implementations from production systems demonstrating different approaches
          to viewing challenges.
        </p>

        <p>
          Medium article viewing addresses long-form reading with engagement. The solution uses
          clean typography (optimized font, line height, line length), reading progress bar showing
          completion percentage, claps for reactions (multiple claps showing appreciation),
          highlights (user can highlight text), related articles through hybrid recommendation, and
          comments with threading. The result is optimized reading experience with high engagement.
        </p>

        <p>
          Substack newsletter viewing addresses email-style reading with community. The solution
          uses newsletter-style layout (email-like reading experience), comments section for
          community discussion, share buttons for distribution, related posts through author and
          topic, and subscription prompts. The result is newsletter reading experience with
          community engagement.
        </p>

        <p>
          New York Times article viewing addresses news reading with multimedia. The solution uses
          responsive layout (optimized for all devices), multimedia integration (images, videos,
          interactive graphics), related articles through topic and section, comments with
          moderation, and share options. The result is comprehensive news reading experience with
          multimedia enrichment.
        </p>

        <p>
          Stack Overflow question viewing addresses technical Q&A reading. The solution uses
          code-friendly layout (syntax highlighting, copy button), voting system (upvote/downvote),
          answers sorted by votes, comments on questions and answers, and related questions through
          tags. The result is technical Q&A reading experience optimized for code.
        </p>

        <p>
          GitHub README viewing addresses documentation reading. The solution uses markdown
          rendering (github-flavored markdown), syntax highlighting for code blocks, table of
          contents for long READMEs, anchor links for sections, and related repositories. The
          result is documentation reading experience optimized for technical content.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of view content page design, implementation, and
          operational concerns for staff and principal engineer interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you render content safely?</p>
            <p className="mt-2 text-sm">
              A: Sanitize HTML through DOMPurify preventing XSS attacks. Remove script tags, event
              handlers, and javascript: URLs. Validate and sanitize on server-side never trusting
              client-side. Use content security policy (CSP) headers for additional protection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement pagination?</p>
            <p className="mt-2 text-sm">
              A: Choose strategy based on use case (infinite scroll for feeds, numbered pages for
              articles). Implement through intersection observer (infinite scroll) or page
              parameters (numbered pages). Update URL through history API enabling bookmarking.
              Handle footer access for infinite scroll.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement related content?</p>
            <p className="mt-2 text-sm">
              A: Use hybrid recommendation combining content-based (topic, tags, category) and
              collaborative filtering (user behavior). Cache results through Redis reducing
              computation. Display 3-5 related items in sidebar or below content. Update
              periodically through background job.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement engagement features?</p>
            <p className="mt-2 text-sm">
              A: Implement comments with threading (nested replies), moderation (approval, spam
              detection), and notifications. Implement shares through social buttons, copy link,
              and email. Implement reactions (likes, claps, emoji). Implement bookmarks for save
              for later.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement reading progress?</p>
            <p className="mt-2 text-sm">
              A: Track scroll position through scroll event listener. Calculate progress as
              (scrollTop / (scrollHeight - clientHeight)) × 100. Display progress bar at top of
              page. Calculate reading time as word count / 200-250 words per minute. Update time
              remaining as user scrolls.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure accessibility?</p>
            <p className="mt-2 text-sm">
              A: Implement WCAG 2.1 compliance through proper heading structure (H1 for title, H2
              for sections), alt text for images, keyboard navigation (Tab, Enter, Escape), and
              screen reader support (ARIA labels). Test with screen readers (NVDA, VoiceOver).
              Ensure sufficient color contrast.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize for SEO?</p>
            <p className="mt-2 text-sm">
              A: Implement structured data (schema.org Article markup) enabling rich snippets.
              Implement meta tags (title, description, Open Graph for social). Implement canonical
              URLs preventing duplicate content. Optimize Core Web Vitals (LCP, FID, CLS) through
              performance optimization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize performance?</p>
            <p className="mt-2 text-sm">
              A: Optimize images through compression and responsive images. Implement lazy loading
              for offscreen media. Implement code splitting reducing JavaScript bundle. Use CDN for
              static assets. Minimize render-blocking resources. Monitor Core Web Vitals.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle content updates?</p>
            <p className="mt-2 text-sm">
              A: Invalidate cache on content update through cache key versioning or purge. Update
              related content cache for affected content. Notify users through feed or notification
              for followed content. Update search index for discoverability.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/appearance/structured-data/article"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google - Article Structured Data
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/fast/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev - Performance Best Practices
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP XSS Filter Evasion Cheat Sheet
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cure53/DOMPurify"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOMPurify - HTML Sanitizer
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

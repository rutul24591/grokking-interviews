"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-search-results",
  title: "Search Results UI",
  description:
    "Comprehensive guide to search results UI covering result display, highlighting, pagination strategies, infinite scroll, empty states, and performance optimization for optimal search experience.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "search-results-ui",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "search",
    "results",
    "frontend",
    "pagination",
    "ux",
  ],
  relatedTopics: ["search-bar", "filters", "ranking", "infinite-scrolling"],
};

export default function SearchResultsUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Results UI</strong> is the interface that displays search results
          in an organized, scannable format with relevant metadata, highlighting, and
          navigation options. It is the critical moment of truth—users have expressed
          their intent through search, and now they judge whether the system understood
          them based on what they see. Well-designed results UI drives engagement, while
          poor results UI frustrates users even if the underlying search is good.
        </p>
        <p>
          Key challenges include: presenting results clearly (title, snippet, metadata),
          showing why results match (highlighting), enabling navigation (pagination,
          infinite scroll), handling edge cases (0 results, 1 result, many results),
          and optimizing performance (fast render, lazy loading). E-commerce sites live
          or die by search results—70% of e-commerce conversions start with search.
        </p>
        <p>
          For staff-level engineers, search results UI involves component architecture
          (result cards, lists, grids), state management (loading, error, empty states),
          performance optimization (virtualization, lazy loading), accessibility (screen
          reader support, keyboard navigation), and A/B testing (layout variations,
          snippet length, image sizes).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Result Display Formats</h3>
        <p>
          Different formats for different content types:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>List View:</strong> Vertical list of result cards. Most common,
            works for all content types. Shows: title, snippet, metadata (date, author,
            source). Best for: General search, documents, articles.
          </li>
          <li>
            <strong>Grid View:</strong> Card grid layout. Visual content benefits from
            grid. Shows: thumbnail image, title, brief metadata. Best for: Products,
            images, videos.
          </li>
          <li>
            <strong>Table View:</strong> Structured data in table format. Shows: multiple
            attributes as columns. Best for: Comparisons, structured data (flights,
            hotels).
          </li>
          <li>
            <strong>Rich Cards:</strong> Enhanced cards with images, ratings, prices.
            Shows: rich snippets from structured data. Best for: Products, recipes,
            events.
          </li>
        </ul>

        <h3 className="mt-6">Result Components</h3>
        <p>
          Essential elements of a result item:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Title:</strong> Primary identifier. Clickable link to content.
            Truncate if long (max 60 chars). Show relevance indicator if applicable.
          </li>
          <li>
            <strong>Snippet:</strong> Excerpt from content showing query context.
            Highlight matched terms. 2-3 lines max. Show beginning of content or
            most relevant passage.
          </li>
          <li>
            <strong>Metadata:</strong> Supporting information (date, author, source,
            category). Helps users assess relevance. Format consistently.
          </li>
          <li>
            <strong>Thumbnail:</strong> Visual preview (if available). 100-200px wide.
            Lazy load to avoid blocking render.
          </li>
          <li>
            <strong>Actions:</strong> Quick actions (save, share, preview). Keep
            secondary—don't distract from main click.
          </li>
        </ul>

        <h3 className="mt-6">Highlighting Strategies</h3>
        <p>
          Showing why results match:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Term Highlighting:</strong> Bold or highlight matched query terms
            in title and snippet. Most common. Use &lt;mark&gt; tag or CSS class.
          </li>
          <li>
            <strong>Snippet Selection:</strong> Show snippet from most relevant passage,
            not just beginning. Ellipsis (...) for skipped text.
          </li>
          <li>
            <strong>Multiple Highlights:</strong> Show multiple matching passages if
            relevant. "Show more matches" expandable.
          </li>
          <li>
            <strong>Field Highlighting:</strong> Highlight in specific fields (title
            matches more important than body matches). Weight by field importance.
          </li>
        </ul>

        <h3 className="mt-6">Pagination Strategies</h3>
        <p>
          Navigating through results:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Page Numbers:</strong> Traditional pagination (1, 2, 3... 10). Clear
            position, bookmarkable. Risk: Users don't go past page 1.
          </li>
          <li>
            <strong>Infinite Scroll:</strong> Auto-load more on scroll. Seamless
            experience. Risk: Footer inaccessible, hard to return to position.
          </li>
          <li>
            <strong>Load More Button:</strong> Explicit "Load More" button. User control.
            Best of both worlds. Most recommended approach.
          </li>
          <li>
            <strong>Cursor-based:</strong> Use cursor token instead of page numbers.
            Prevents duplicates, handles real-time changes. Best for: Dynamic content.
          </li>
        </ul>

        <h3 className="mt-6">Empty States</h3>
        <p>
          Handling 0 or few results:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>0 Results:</strong> Clear message ("No results for X"). Suggest
            alternatives (remove filters, broaden search). Show popular/trending
            content. Don't show blank page.
          </li>
          <li>
            <strong>1-5 Results:</strong> Show results but indicate scarcity ("Only 3
            results"). Suggest related searches. Consider relaxing filters automatically.
          </li>
          <li>
            <strong>Did You Mean:</strong> Spelling correction suggestions. "Did you mean:
            Y?" with clickable link.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production search results UI involves efficient rendering and state management.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/search-results-ui/results-display-layouts.svg"
          alt="Search Results Display Layouts"
          caption="Figure 1: Results Display — List view, grid view, table view, and rich cards for different content types"
          width={1000}
          height={500}
        />

        <h3>Component Structure</h3>
        <ul className="space-y-3">
          <li>
            <strong>Results Container:</strong> Main wrapper. Manages results state
            (loading, error, empty, success). Handles pagination state.
          </li>
          <li>
            <strong>Results Header:</strong> Shows result count ("123 results"), sort
            dropdown, view toggle (list/grid). Search time if relevant.
          </li>
          <li>
            <strong>Results List/Grid:</strong> Renders result items. Virtualized for
            performance (100+ results). Maintains scroll position.
          </li>
          <li>
            <strong>Result Item:</strong> Individual result card. Title, snippet,
            metadata, thumbnail. Clickable. Memoized to prevent re-render.
          </li>
          <li>
            <strong>Pagination Controls:</strong> Page numbers, load more button, or
            infinite scroll trigger. Shows current position.
          </li>
          <li>
            <strong>Empty State:</strong> Shown when 0 results. Message, suggestions,
            popular content.
          </li>
        </ul>

        <h3 className="mt-6">Results Loading Flow</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Initial Search:</strong> User submits query. Show loading skeleton.
          </li>
          <li>
            <strong>Fetch Results:</strong> API call with query, filters, page/cursor.
            Cancel pending requests.
          </li>
          <li>
            <strong>Render Results:</strong> Display results with highlighting. Update
            result count.
          </li>
          <li>
            <strong>Track Impression:</strong> Log search event for analytics. Query,
            results shown, position.
          </li>
          <li>
            <strong>User Interaction:</strong> Track clicks, pagination, filter changes.
          </li>
          <li>
            <strong>Load More:</strong> On pagination, append new results. Maintain
            scroll position.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/search-results-ui/pagination-strategies.svg"
          alt="Pagination Strategies"
          caption="Figure 2: Pagination Strategies — Page numbers, infinite scroll, load more button, and cursor-based pagination"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Performance Optimization</h3>
        <ul className="space-y-3">
          <li>
            <strong>Virtualization:</strong> Render only visible results (react-window,
            tanstack/virtual). Essential for 100+ results.
          </li>
          <li>
            <strong>Lazy Loading:</strong> Lazy load images, thumbnails. Don't block
            initial render.
          </li>
          <li>
            <strong>Skeleton Screens:</strong> Show skeleton while loading. Better than
            spinner. Perceived performance.
          </li>
          <li>
            <strong>Result Caching:</strong> Cache results by query + page. Cache in
            localStorage for back navigation.
          </li>
          <li>
            <strong>Incremental Rendering:</strong> Render in chunks (10 results at a
            time). Prevents long main thread blocks.
          </li>
          <li>
            <strong>Prefetch:</strong> Prefetch next page when user views current page.
            Reduces perceived latency.
          </li>
        </ul>

        <h3 className="mt-6">Accessibility Considerations</h3>
        <ul className="space-y-3">
          <li>
            <strong>Semantic HTML:</strong> Use &lt;ol&gt; for results list (ordered by
            relevance). &lt;li&gt; for each result. &lt;article&gt; for result cards.
          </li>
          <li>
            <strong>ARIA Labels:</strong> aria-label for result count ("123 results").
            aria-current for current page. aria-live for dynamic updates.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Tab through results, Enter to open.
            Arrow keys for pagination.
          </li>
          <li>
            <strong>Screen Reader:</strong> Announce result count, current page, loading
            states. Skip links for pagination.
          </li>
          <li>
            <strong>Focus Management:</strong> Keep focus on results after load. Don't
            reset to top on pagination.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Search results UI design involves balancing usability, performance, and user
          preferences.
        </p>

        <h3>Pagination Strategy Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Strategy</th>
                <th className="text-left p-2 font-semibold">UX</th>
                <th className="text-left p-2 font-semibold">Performance</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Page Numbers</td>
                <td className="p-2">Clear position, bookmarkable</td>
                <td className="p-2">Good (fixed page size)</td>
                <td className="p-2">Known-item search</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Infinite Scroll</td>
                <td className="p-2">Seamless, mobile-friendly</td>
                <td className="p-2">Risk (memory bloat)</td>
                <td className="p-2">Exploration, feeds</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Load More</td>
                <td className="p-2">User control, clear</td>
                <td className="p-2">Best (explicit load)</td>
                <td className="p-2">Most use cases</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/search-results-ui/empty-states.svg"
          alt="Empty States"
          caption="Figure 3: Empty States — 0 results, few results, and did-you-mean suggestions with helpful actions"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">List vs Grid View</h3>
        <p>
          <strong>List View:</strong> More information per result (longer snippets, more
          metadata). Better for text-heavy content. Takes more vertical space. Best for:
          Documents, articles, emails.
        </p>
        <p>
          <strong>Grid View:</strong> More results visible at once. Visual content shines.
          Less info per result. Best for: Products, images, videos.
        </p>
        <p>
          <strong>Recommendation:</strong> Offer both views, let user choose. Remember
          preference. Default to list for text, grid for visual content.
        </p>

        <h3 className="mt-6">Snippet Length</h3>
        <p>
          <strong>Short (1-2 lines):</strong> More results visible. Quick scanning. Risk:
          Not enough context.
        </p>
        <p>
          <strong>Medium (2-3 lines):</strong> Balanced. Most common. Enough context
          without overwhelming.
        </p>
        <p>
          <strong>Long (4+ lines):</strong> More context. Risk: Fewer results visible,
          users read instead of scan.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Show Result Count:</strong> Always show number of results ("123
            results"). Users need to know scope.
          </li>
          <li>
            <strong>Highlight Matches:</strong> Bold matched terms in title and snippet.
            Users need to see why results match.
          </li>
          <li>
            <strong>Use Skeleton Loading:</strong> Show skeleton screens while loading.
            Better than spinners for perceived performance.
          </li>
          <li>
            <strong>Handle Empty States:</strong> Never show blank page for 0 results.
            Show message, suggestions, popular content.
          </li>
          <li>
            <strong>Preserve Scroll Position:</strong> Don't jump to top on pagination.
            Maintain user's place.
          </li>
          <li>
            <strong>Offer View Toggle:</strong> List and grid views. Remember user
            preference.
          </li>
          <li>
            <strong>Lazy Load Images:</strong> Don't block render on images. Use
            Intersection Observer.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Touch-friendly targets (44px min).
            Responsive layouts. Consider mobile-first.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Result Count:</strong> Users don't know how many results. Solution:
            Always show count.
          </li>
          <li>
            <strong>No Highlighting:</strong> Users don't see why results match. Solution:
            Bold matched terms.
          </li>
          <li>
            <strong>Scroll Jump:</strong> Page jumps to top on pagination. Solution:
            Preserve scroll position.
          </li>
          <li>
            <strong>Blank Empty State:</strong> 0 results shows nothing. Solution: Show
            helpful message, suggestions.
          </li>
          <li>
            <strong>Slow Render:</strong> Rendering 100+ results blocks main thread.
            Solution: Virtualize, incremental render.
          </li>
          <li>
            <strong>Inaccessible:</strong> Can't navigate with keyboard. Solution: Proper
            semantic HTML, ARIA labels, focus management.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Google Search Results</h3>
        <p>
          Google shows title, URL, snippet with highlighted terms. Rich snippets for
          special content (recipes, events). Related searches at bottom. Pagination
          with page numbers.
        </p>
        <p>
          <strong>Key Innovation:</strong> Sitelinks for top results—direct links to
          internal pages.
        </p>

        <h3 className="mt-6">Amazon Product Results</h3>
        <p>
          Amazon shows product grid with image, title, price, rating, Prime badge.
          Filters on left. Sort dropdown. "Load more" pagination.
        </p>
        <p>
          <strong>Key Innovation:</strong> "Sponsored" results clearly marked, blended
          with organic results.
        </p>

        <h3 className="mt-6">Gmail Search Results</h3>
        <p>
          Gmail shows sender, subject, snippet with highlighted terms. Date, labels.
          Checkbox for selection. Infinite scroll with "Load more" option.
        </p>
        <p>
          <strong>Key Innovation:</strong> Quick actions (archive, delete) directly in
          results.
        </p>

        <h3 className="mt-6">YouTube Search Results</h3>
        <p>
          YouTube shows video thumbnail, title, channel, views, upload date. Duration
          on thumbnail. Infinite scroll for continuous viewing.
        </p>
        <p>
          <strong>Key Innovation:</strong> Hover preview—video plays on hover without
          click.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Pagination vs infinite scroll?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Pagination: better for known-item search, bookmarking,
              clear position. Infinite scroll: better for exploration, mobile, continuous
              consumption. Load More button: best of both—user control with seamless
              experience. Choose based on use case: e-commerce → pagination, social feed
              → infinite scroll, most cases → Load More.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle empty search results?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Show clear message ("No results for X"). Suggest
              alternatives: remove filters, broaden search, check spelling. Show "Did
              you mean" suggestions. Display popular/trending content. Log zero-result
              queries for content gap analysis. Never show blank page.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize results rendering performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Virtualize list (render only visible items). Lazy load
              images. Use skeleton screens. Incremental rendering (render in chunks).
              Cache results for back navigation. Memoize result components. Prefetch
              next page. Target &lt;100ms time to interactive.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make search results accessible?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use semantic HTML (&lt;ol&gt; for results, &lt;li&gt;
              for items). ARIA labels for result count, current page. Keyboard navigation
              (Tab, Enter, Arrow keys). Screen reader announcements for loading, result
              count. Focus management (don't reset on pagination). Skip links for
              pagination. Minimum 44px touch targets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle result highlighting?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use &lt;mark&gt; tag or CSS class for highlighting.
              Highlight in title and snippet. Show most relevant passage, not just
              beginning. Escape HTML in snippets to prevent XSS. Handle multiple
              matches—show most relevant or expandable "more matches".
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide result snippet length?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Balance context vs visibility. 2-3 lines (150-200 chars)
              is standard. Show most relevant passage, not just beginning. Truncate with
              ellipsis. Consider content type—longer for documents, shorter for products.
              A/B test different lengths for optimal CTR.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/search-results-display/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Search Results Display Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/beginner/seo-starter-guide#structure_your_navigation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SEO Starter Guide — Search Results
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ARIA — Accessible UI Patterns
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/ecommerce-search-result-design"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Baymard Institute — E-commerce Search Result Design
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/tag/search-results/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Search Results Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

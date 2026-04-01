"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-trending-section",
  title: "Trending Section",
  description:
    "Comprehensive guide to trending section UI covering real-time trend display, velocity indicators, geographic filtering, category tabs, and engagement optimization for discovery.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "trending-section",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "trending",
    "real-time",
    "frontend",
    "ui-design",
  ],
  relatedTopics: ["trending-computation", "feed-display", "discovery", "real-time-updates"],
};

export default function TrendingSectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Trending Section</strong> is the UI component that displays currently
          popular or rapidly rising content to users. It is often the first thing users
          see when visiting a platform—Twitter's Trends sidebar, Reddit's Popular feed,
          YouTube's Trending tab. Trending sections drive 20-30% of content discovery and
          are critical for user engagement, especially for new users who haven't built a
          follow graph yet.
        </p>
        <p>
          Unlike the backend trending computation (which calculates scores), the trending
          section focuses on presentation: how to display trends clearly, indicate velocity
          (rising vs falling), enable geographic/category filtering, and update in real-time
          without disrupting the user experience. The challenge is balancing information
          density (showing enough context) with scannability (users should grasp trends in
          seconds).
        </p>
        <p>
          For staff-level engineers, trending section implementation involves real-time
          updates (WebSocket or polling), efficient re-rendering (only changed items),
          geographic/category filtering, accessibility (screen reader support), and
          performance (sub-100ms updates without layout shift).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Trend Display Elements</h3>
        <p>
          Key components of a trending item:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Rank:</strong> Position number (1, 2, 3...). Indicates relative
            popularity. Top 3 often highlighted (gold, silver, bronze styling).
          </li>
          <li>
            <strong>Topic/Title:</strong> The trending topic name. Truncated if long
            (max 50 chars). Clickable to view related content.
          </li>
          <li>
            <strong>Velocity Indicator:</strong> Arrow (↑ rising, ↓ falling, → stable)
            with percentage. Shows momentum, not just absolute position.
          </li>
          <li>
            <strong>Engagement Count:</strong> Posts, tweets, views associated with trend.
            Provides scale context (1K posts vs 100K posts).
          </li>
          <li>
            <strong>Category Tag:</strong> News, Sports, Entertainment, etc. Helps users
            scan for interests. Color-coded for quick recognition.
          </li>
          <li>
            <strong>Location:</strong> Geographic scope (Local, National, Global). Users
            can filter by location.
          </li>
        </ul>

        <h3 className="mt-6">Velocity Indicators</h3>
        <p>
          Showing trend momentum is critical:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Arrow + Percentage:</strong> ↑ 50% (rising fast), ↑ 10% (rising),
            → stable, ↓ 10% (falling). Most common approach.
          </li>
          <li>
            <strong>Color Coding:</strong> Green (rising), gray (stable), red (falling).
            Quick visual scan, but consider colorblind users.
          </li>
          <li>
            <strong>Sparkline:</strong> Mini chart showing trend over time (24h). Shows
            trajectory, not just current state. More space-intensive.
          </li>
          <li>
            <strong>Badge:</strong> "🔥 Hot", "⬆️ Rising", "🆕 New". Qualitative labels
            instead of numbers. More friendly, less precise.
          </li>
        </ul>

        <h3 className="mt-6">Geographic Filtering</h3>
        <p>
          Users should control which location's trends they see:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Current Location:</strong> Default to user's detected location (IP,
            GPS). Most relevant for local news, events.
          </li>
          <li>
            <strong>Home Location:</strong> User's saved home location. Useful for
            travelers wanting home news.
          </li>
          <li>
            <strong>Custom Location:</strong> Search and select any city/country. Useful
            for monitoring specific markets.
          </li>
          <li>
            <strong>Global:</strong> Worldwide trends. For viral content, international
            events.
          </li>
          <li>
            <strong>Location Picker UI:</strong> Dropdown or modal with search. Show
            country flags for quick recognition.
          </li>
        </ul>

        <h3 className="mt-6">Category Tabs</h3>
        <p>
          Organize trends by topic for easier scanning:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>All:</strong> Mixed trends from all categories. Default view.
          </li>
          <li>
            <strong>News:</strong> Current events, politics, breaking news.
          </li>
          <li>
            <strong>Sports:</strong> Games, scores, athlete news.
          </li>
          <li>
            <strong>Entertainment:</strong> Movies, TV, music, celebrities.
          </li>
          <li>
            <strong>Technology:</strong> Tech news, product launches, startups.
          </li>
          <li>
            <strong>Business:</strong> Markets, companies, economy.
          </li>
          <li>
            <strong>Scrollable Tabs:</strong> If many categories, horizontal scroll.
            Active tab highlighted.
          </li>
        </ul>

        <h3 className="mt-6">Update Strategies</h3>
        <p>
          How to keep trending section fresh:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Polling:</strong> Fetch trends every 5-15 minutes. Simple, reliable.
            Slight staleness (up to poll interval).
          </li>
          <li>
            <strong>WebSocket:</strong> Real-time push updates when trends change. Most
            fresh, more complex infrastructure.
          </li>
          <li>
            <strong>Hybrid:</strong> Poll every 10 minutes, WebSocket for breaking news
            spikes. Best of both worlds.
          </li>
          <li>
            <strong>Pull-to-Refresh:</strong> Manual refresh on mobile. User-controlled,
            expected pattern.
          </li>
          <li>
            <strong>Stale Indicator:</strong> Show "Updated 5m ago" timestamp. Users know
            how fresh data is.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production trending section involves real-time data flow and efficient rendering.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/trending-section/trending-section-ui.svg"
          alt="Trending Section UI Architecture"
          caption="Figure 1: Trending Section UI — Real-time data flow from API to display with filtering and updates"
          width={1000}
          height={500}
        />

        <h3>Component Structure</h3>
        <ul className="space-y-3">
          <li>
            <strong>Trending Container:</strong> Main wrapper component. Manages state
            (trends list, loading, error, filters). Fetches initial data on mount.
          </li>
          <li>
            <strong>Filter Bar:</strong> Location picker, category tabs. Updates query
            params, triggers refetch.
          </li>
          <li>
            <strong>Trend List:</strong> Virtualized list for performance (if 50+ trends).
            Renders TrendItem components.
          </li>
          <li>
            <strong>Trend Item:</strong> Individual trend display. Rank, title, velocity,
            engagement. Clickable to view details.
          </li>
          <li>
            <strong>Update Indicator:</strong> Shows last updated time, refresh button.
            Optional "X new trends" banner.
          </li>
        </ul>

        <h3 className="mt-6">Real-time Update Flow</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Initial Fetch:</strong> GET /trending?location=US&category=all on
            mount. Show skeleton loader.
          </li>
          <li>
            <strong>Render:</strong> Display trends with rank, velocity, engagement.
            Cache in state.
          </li>
          <li>
            <strong>Subscribe to Updates:</strong> Open WebSocket connection or start
            polling timer (every 10 min).
          </li>
          <li>
            <strong>Receive Update:</strong> New trends data arrives. Compare with cached
            data.
          </li>
          <li>
            <strong>Diff Changes:</strong> Identify new trends, rank changes, removed
            trends.
          </li>
          <li>
            <strong>Animate Changes:</strong> Smooth transitions for rank changes (slide
            up/down). Highlight new trends briefly.
          </li>
          <li>
            <strong>Update Timestamp:</strong> Update "last updated" indicator.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/trending-section/velocity-indicators.svg"
          alt="Velocity Indicators"
          caption="Figure 2: Velocity Indicators — Arrow + percentage, color coding, sparklines, and badges for trend momentum"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Performance Optimization</h3>
        <ul className="space-y-3">
          <li>
            <strong>Virtual Scrolling:</strong> If showing 50+ trends, render only visible
            items. Use react-window or tanstack/virtual.
          </li>
          <li>
            <strong>Memoization:</strong> React.memo on TrendItem components. Prevent
            re-render of unchanged items.
          </li>
          <li>
            <strong>Debounced Updates:</strong> Batch trend updates (every 30 sec) instead
            of re-rendering on every change.
          </li>
          <li>
            <strong>Optimistic Updates:</strong> Show new trends immediately, reconcile
            with server data when received.
          </li>
          <li>
            <strong>Image Lazy Loading:</strong> If trends have thumbnails, lazy load
            images. Don't block initial render.
          </li>
          <li>
            <strong>Cache Trends:</strong> Cache trends in localStorage. Show cached data
            while fetching fresh data.
          </li>
        </ul>

        <h3 className="mt-6">Accessibility Considerations</h3>
        <ul className="space-y-3">
          <li>
            <strong>Semantic HTML:</strong> Use &lt;ol&gt; for ranked list (screen readers
            announce position). &lt;li&gt; for each trend.
          </li>
          <li>
            <strong>ARIA Labels:</strong> aria-label for velocity ("Rising 50 percent"),
            category ("Category: Sports").
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Tab through trends, Enter to view
            details. Arrow keys for category tabs.
          </li>
          <li>
            <strong>Color Contrast:</strong> Ensure text meets WCAG AA (4.5:1 contrast).
            Don't rely solely on color for velocity.
          </li>
          <li>
            <strong>Screen Reader Announcements:</strong> aria-live region for real-time
            updates. Announce "3 new trends" when data updates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Trending section design involves balancing information density, freshness, and
          user experience.
        </p>

        <h3>Update Frequency Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Frequency</th>
                <th className="text-left p-2 font-semibold">Freshness</th>
                <th className="text-left p-2 font-semibold">Resource Cost</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Every 1-5 min</td>
                <td className="p-2">Very High</td>
                <td className="p-2">High (API calls, re-renders)</td>
                <td className="p-2">Breaking news, live events</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Every 10-15 min</td>
                <td className="p-2">High</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Most platforms (Twitter, Reddit)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Every 30-60 min</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Low</td>
                <td className="p-2">Evergreen content, blogs</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Manual Refresh</td>
                <td className="p-2">User-controlled</td>
                <td className="p-2">Lowest</td>
                <td className="p-2">Niche platforms, dashboards</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/trending-section/geographic-filtering.svg"
          alt="Geographic Filtering UI"
          caption="Figure 3: Geographic Filtering — Location picker with current, home, custom, and global options"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">List Length Trade-offs</h3>
        <p>
          <strong>Short (5-10 trends):</strong> Focused, scannable. Users see top trends
          quickly. Risk: Missing long-tail trends, less discovery.
        </p>
        <p>
          <strong>Medium (15-25 trends):</strong> Balanced. Most platforms use this.
          Enough variety without overwhelm.
        </p>
        <p>
          <strong>Long (50+ trends):</strong> Comprehensive, but requires scrolling/virtual-
          ization. Risk: Users don't scroll past first 10. Use "Show More" button instead.
        </p>

        <h3 className="mt-6">Velocity Display Trade-offs</h3>
        <p>
          <strong>Percentage Only:</strong> Precise (↑ 47%), but users may not grasp
          magnitude. Is 47% good or bad?
        </p>
        <p>
          <strong>Qualitative Labels:</strong> "🔥 Hot", "⬆️ Rising". Intuitive, but
          vague. What's the threshold for "Hot"?
        </p>
        <p>
          <strong>Hybrid (Recommended):</strong> Show both (↑ 47% Hot). Precise +
          intuitive. Takes more space but worth it.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Show Velocity:</strong> Always indicate rising/falling. Users want to
            know momentum, not just rank.
          </li>
          <li>
            <strong>Update Timestamp:</strong> Show "Updated 5m ago". Users know how fresh
            data is.
          </li>
          <li>
            <strong>Animate Changes:</strong> Smooth transitions for rank changes. Highlight
            new trends briefly (fade in).
          </li>
          <li>
            <strong>Enable Filtering:</strong> Location and category filters. Let users
            customize what they see.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Horizontal scroll for categories, large
            touch targets (44px min).
          </li>
          <li>
            <strong>Handle Empty States:</strong> If no trends for location/category, show
            message + suggest alternatives.
          </li>
          <li>
            <strong>Lazy Load Details:</strong> Don't fetch trend details until user
            clicks. Keep initial load fast.
          </li>
          <li>
            <strong>Track Engagement:</strong> Log clicks on trends. Use to improve
            ranking algorithm.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Velocity Indicator:</strong> Just showing rank is insufficient.
            Solution: Add arrow + percentage or badge.
          </li>
          <li>
            <strong>Stale Data:</strong> No update indicator, users think trends are
            current. Solution: Show timestamp, auto-refresh.
          </li>
          <li>
            <strong>Jarring Updates:</strong> Entire list re-renders on update. Solution:
            Diff changes, animate only changed items.
          </li>
          <li>
            <strong>No Location Context:</strong> Showing global trends to local users.
            Solution: Default to user's location, show location clearly.
          </li>
          <li>
            <strong>Inaccessible:</strong> Relying on color alone for velocity. Solution:
            Use arrows + text labels, not just color.
          </li>
          <li>
            <strong>Too Many Trends:</strong> Overwhelming list of 100+ trends. Solution:
            Show top 20, "Show More" button for rest.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Trends Sidebar</h3>
        <p>
          Twitter shows 10 trends in sidebar. Each trend has rank, topic, engagement
          count, category (News, Sports). Location picker at top. Updates every 5 minutes.
          Click to see related tweets.
        </p>
        <p>
          <strong>Key Innovation:</strong> "Why it's trending" explanation on hover.
          Provides context for trending topics.
        </p>

        <h3 className="mt-6">Reddit Popular/Rising</h3>
        <p>
          Reddit shows trending posts with upvote count, comment count, time posted.
          Separate tabs for Hot, New, Rising, Top. Subreddit filtering. Updates in
          real-time as posts gain traction.
        </p>
        <p>
          <strong>Key Innovation:</strong> Rising tab shows high-velocity posts before
          they hit Hot. Early discovery.
        </p>

        <h3 className="mt-6">YouTube Trending Tab</h3>
        <p>
          YouTube Trending shows video thumbnails, title, channel, view count, hours
          since upload. Category tabs (Now, Music, Gaming, Movies). Human curation for
          top trending.
        </p>
        <p>
          <strong>Key Innovation:</strong> Video preview on hover. Watch snippet without
          leaving trending page.
        </p>

        <h3 className="mt-6">Google Trends</h3>
        <p>
          Google Trends shows search query trends with sparklines, related queries,
          geographic breakdown. Interactive charts. Compare multiple trends.
        </p>
        <p>
          <strong>Key Innovation:</strong> Sparkline visualization shows trend trajectory
          over time, not just current state.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time trend updates?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use WebSocket for push updates or polling every 5-15
              minutes. On update, diff new trends with cached trends. Animate rank changes
              (slide up/down), highlight new trends briefly. Use React.memo to prevent
              re-render of unchanged items. Show "Updated Xm ago" timestamp.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle geographic filtering?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Location picker dropdown with search. Default to user's
              detected location (IP/GPS). Allow selection of home location, custom location,
              or global. Store preference in localStorage. On change, refetch trends with
              new location param. Show flag icon for quick country recognition.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize trend list performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use virtualized list if 50+ trends (react-window).
              React.memo on TrendItem components. Debounce updates (batch every 30 sec).
              Lazy load images. Cache trends in localStorage. Use CSS transforms for
              animations (GPU-accelerated). Target 60fps during updates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make trending accessible?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use &lt;ol&gt; for ranked list (announces position).
              ARIA labels for velocity ("Rising 50 percent"). Keyboard navigation (Tab,
              Enter, Arrow keys). Color contrast meets WCAG AA. Don't rely solely on
              color—use arrows + text. aria-live region for real-time announcements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle trend updates without jarring UX?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Diff new data with cached data. Only re-render changed
              items. Use FLIP animation (First, Last, Invert, Play) for smooth rank
              transitions. Fade in new trends. Batch updates (every 30 sec) instead of
              re-rendering on every change. Show "X new trends" banner for manual refresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure trending section success?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track CTR on trends (clicks / impressions), engagement
              rate (do users engage with trend content?), time spent on trending page,
              return rate (do users who view trending return?). A/B test UI changes
              (velocity display, list length, update frequency). Monitor for manipulation
              (sudden spikes in specific trends).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.twitter.com/en/docs/twitter-api/trends"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter API — Trends Endpoint Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.reddit.com/dev/api/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit API — Trending Posts
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/youtube/v3/docs/videos/list"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube API — Popular Videos
            </a>
          </li>
          <li>
            <a
              href="https://trends.google.com/trends/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Trends — Search Trend Data
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
        </ul>
      </section>
    </ArticleLayout>
  );
}

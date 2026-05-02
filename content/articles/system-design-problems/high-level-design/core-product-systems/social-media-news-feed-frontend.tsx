"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-social-media-news-feed-frontend",
  title: "Design the Frontend for a Social Media News Feed",
  description:
    "A deep dive into designing a scalable, high-performance frontend for a social media news feed, focusing on virtualization, state normalization, and real-time updates.",
  category: "system-design-problems",
  subcategory: "high-level-design",
  slug: "social-media-news-feed-frontend",
  wordCount: 5000,
  readingTime: 25,
  lastUpdated: "2024-05-20",
  tags: [
    "frontend",
    "system-design",
    "performance",
    "scalability",
    "news-feed",
  ],
  relatedTopics: [
    "rendering-strategies",
    "state-management",
    "performance-optimization",
  ],
};

export default function SocialMediaNewsFeedFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Context &amp; Scope Definition</h2>
        <h3>Problem Statement</h3>
        <p>
          Design a robust and highly performant frontend system for a social
          media news feed (e.g., Facebook, Twitter/X, LinkedIn). The system must
          efficiently handle a continuous stream of content, various media types
          (images, videos, ads), and complex user interactions while maintaining
          a fluid 60 FPS user experience across a global, heterogeneous device
          landscape.
        </p>

        <h3>Business Context</h3>
        <ul>
          <li>
            <strong>Users:</strong> 500M+ DAU, including users on low-end
            devices and flaky 3G networks.
          </li>
          <li>
            <strong>Business Goal:</strong> Maximize engagement (time spent) and
            revenue (ad impressions) through a frictionless, addictive
            experience.
          </li>
          <li>
            <strong>Core Value:</strong> The feed is the "heart" of the
            platform; any latency or friction directly impacts the bottom line.
          </li>
        </ul>

        <h3>Assumptions</h3>
        <ul>
          <li>
            <strong>Traffic:</strong> High read-to-write ratio (99:1). Users
            scroll through hundreds of items but interact (like/comment) on a
            few.
          </li>
          <li>
            <strong>Data Scale:</strong> Billions of total posts, with hundreds
            of new posts appearing every second globally.
          </li>
          <li>
            <strong>Client Environment:</strong> Modern browsers, but must
            support IE11-level capabilities via polyfills where necessary
            (though focus is on modern evergreen browsers).
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>⚙️ Functional Requirements (FRs)</h2>
        <h3>Core Features (Must-have)</h3>
        <ul>
          <li>
            <strong>Dynamic Feed Rendering:</strong> Display a mix of text,
            high-res images, and auto-playing videos.
          </li>
          <li>
            <strong>Infinite Scrolling:</strong> Seamlessly load subsequent
            "pages" of data based on user scroll position.
          </li>
          <li>
            <strong>Engagement Actions:</strong> Like, Comment, and Share
            functionality with zero-latency feedback (Optimistic UI).
          </li>
          <li>
            <strong>Real-time Presence:</strong> Notification of new content
            ("Show 5 new posts" pill) at the top of the feed.
          </li>
        </ul>

        <h3>Secondary Features (Nice-to-have)</h3>
        <ul>
          <li>
            <strong>Offline Mode:</strong> View previously fetched posts without
            a connection (PWA capability).
          </li>
          <li>
            <strong>Rich Composer:</strong> Media upload and URL unfurling
            support.
          </li>
          <li>
            <strong>Dark Mode:</strong> System-wide theme support.
          </li>
        </ul>

        <h3>Out of Scope</h3>
        <ul>
          <li>Ranking/Recommendation algorithms (Backend logic).</li>
          <li>Direct Messaging (DM) or complex Profile management.</li>
          <li>User authentication flows (Login/Signup).</li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Non-Functional Requirements (NFRs)</h2>
        <ul>
          <HighlightBlock as="li" tier="crucial">
            <strong>Scalability:</strong> The browser DOM must not grow linearly
            with scroll depth. Memory management is paramount to prevent crashes
            on mobile.
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Performance:</strong> Achieving 60 FPS (16.6ms frame budget)
            during scroll. LCP &lt; 2.5s and TTI &lt; 3.0s on a "Mid-tier"
            mobile device.
          </HighlightBlock>
          <li>
            <strong>Reliability:</strong> Graceful handling of network failures.
            The app should not feel "broken" if a secondary service (like likes)
            fails.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Accessibility:</strong> WCAG 2.1 AA compliance. Screen
            reader accessibility for complex post structures and aria-live
            regions for notifications.
          </HighlightBlock>
          <li>
            <strong>Consistency:</strong> Immediate UI updates (Optimistic)
            backed by eventual consistency with the server.
          </li>
          <li>
            <strong>Observability:</strong> Real-time logging of Client Side
            Errors (Sentry) and Core Web Vitals tracking.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>High-Level Architecture</h2>
        <h3>System Components</h3>
        <ul>
          <li>
            <strong>App Shell:</strong> Foundational UI (Navigation, Layout)
            that remains static.
          </li>
          <li>
            <strong>Feed Controller:</strong> Orchestrates data fetching,
            virtualization logic, and event handling.
          </li>
          <li>
            <strong>Normalized Store:</strong> A centralized entity-based store
            (Redux/Zustand/Signals).
          </li>
          <li>
            <strong>Virtualization Engine:</strong> Manages DOM recycling and
            windowing.
          </li>
          <li>
            <strong>Transport Layer:</strong> API Client (REST/GraphQL) +
            WebSocket Client (Real-time).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-problems/hld/news-feed-frontend-arch.svg"
          alt="High-level frontend architecture for a social media news feed"
          caption="News Feed Architecture — A modular approach separating rendering, state, and network concerns."
        />

        <ArticleImage
          src="/diagrams/system-design-problems/hld/news-feed-component-design.svg"
          alt="Post component design breakdown"
          caption="Component Hierarchy — Decomposing the Feed into highly optimized, reusable sub-components."
        />

        <h3>Key Design Decisions</h3>
        <HighlightBlock as="p" tier="important">
          <strong>Decision: Hybrid Rendering (SSR/Streaming + CSR):</strong>
          Use SSR for the initial 10 posts to ensure SEO and fast LCP. Use CSR
          for infinite scroll to minimize server CPU and provide a snappy
          experience.
          <em>Why:</em> Pure CSR has poor LCP; pure SSR is too heavy for
          infinite scrolling.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Decision: State Normalization:</strong>
          Store data as <code>{"{ entities: { users: {}, posts: {} } }"}</code>.
          <em>Why:</em> Prevents data desynchronization where the same user's
          avatar appears differently in two different posts.
        </HighlightBlock>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Core Workflows (Sequence Flows)</h2>
        <h3>Primary Flow: Content Ingestion</h3>
        <ol>
          <li>
            <strong>Trigger:</strong> User reaches the scroll sentinel.
          </li>
          <li>
            <strong>Fetch:</strong> Request <code>/v1/feed?cursor=XYZ</code>.
          </li>
          <li>
            <strong>Process:</strong> Response is normalized. Entities
            (Users/Media) are merged into the global store.
          </li>
          <li>
            <strong>Render:</strong> Virtual list updates the scroll height and
            renders the new window of posts.
          </li>
        </ol>

        <h3>Failure Flow: Resilient Interaction</h3>
        <ol>
          <li>User clicks "Like". UI toggles state optimistically.</li>
          <li>Request fails due to network timeout.</li>
          <li>
            <strong>Retry Logic:</strong> Client attempts 3 background retries
            with exponential backoff.
          </li>
          <li>
            <strong>Final Failure:</strong> UI rolls back, shows a "Connection
            error" toast, and allows manual retry.
          </li>
        </ol>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Data Modeling</h2>
        <h3>Entities</h3>
        <ArticleImage
          src="/diagrams/system-design-problems/hld/news-feed-data-flow.svg"
          alt="Data flow and normalization diagram"
          caption="Normalized Data Flow — Raw backend responses are decomposed into entities before hitting the UI."
        />
        <p>
          We use a relational structure in the client store. This is{" "}
          <strong>crucial</strong> for Staff-level designs as it solves the
          "Stale Identity" problem common in junior implementations.
        </p>

        <h3>Schema Design</h3>
        <pre className="bg-panel-soft p-4 rounded-md overflow-x-auto text-sm">
          {`interface Post {
  id: string;
  authorId: string; // Reference to User entity
  content: string;
  mediaIds: string[]; // Reference to Media entities
  stats: { likes: number; comments: number };
  viewerHasLiked: boolean;
}

interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isFollowing: boolean;
}`}
        </pre>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Scalability Deep Dive</h2>
        <h3>Read Scaling: Virtualization (Windowing)</h3>
        <p>
          Standard lists create <code>O(N)</code> DOM nodes. On mobile, 100
          posts &approx; 5000 nodes, which causes scroll lag and memory
          exhaustion.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/hld/news-feed-rendering-virtualization.svg"
          alt="Virtualization mechanism diagram"
          caption="Virtualization — Maintaining a constant DOM size regardless of list length."
        />
        <p>
          <strong>Implementation:</strong> We keep a fixed set of DOM nodes and
          update their content and <code>translateY</code> values as the user
          scrolls. We maintain a "Buffer" of 2-3 items above/below the viewport
          to handle fast scrolling.
        </p>

        <h3>Write Scaling: Event Debouncing</h3>
        <p>
          High-frequency interactions (rapid liking or typing comments) are
          debounced at the UI level. Multiple "Like" toggles within 500ms are
          collapsed into a single API call to save server RPS and battery.
        </p>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>⚡ Performance Optimization</h2>
        <ul>
          <li>
            <strong>Asset Preloading:</strong> Use{" "}
            <code>{"<link rel='preload'>"}</code> for the critical path JS and
            CSS.
          </li>
          <li>
            <strong>Image Optimization:</strong> Implement{" "}
            <strong>Lazy Loading</strong> via <code>loading="lazy"</code> and{" "}
            <code>srcset</code> for responsive resolutions.
          </li>
          <li>
            <strong>Main Thread Budgeting:</strong> Offload heavy data
            processing (normalization) to a <strong>Web Worker</strong> to keep
            the UI thread free for 60 FPS animations.
          </li>
          <li>
            <strong>Predictive Fetching:</strong> Trigger the next page fetch
            when the user is 80% through the current results.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Security Design</h2>
        <ul>
          <li>
            <strong>Content Security Policy (CSP):</strong> Restrict{" "}
            <code>script-src</code> and <code>img-src</code> to trusted domains
            to prevent XSS.
          </li>
          <li>
            <strong>Input Sanitization:</strong> Use library-level protection
            (e.g., DOMPurify) for any user-generated HTML, though preferring
            Markdown or plain text is safer.
          </li>
          <li>
            <strong>Token Safety:</strong> Store JWTs in{" "}
            <strong>HttpOnly, Secure</strong> cookies to mitigate token theft
            via XSS.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Reliability &amp; Fault Tolerance</h2>
        <ul>
          <li>
            <strong>Graceful Degradation:</strong> If the "Social Graph" service
            fails, the feed still renders but without the "Following"
            indicators.
          </li>
          <li>
            <strong>Offline Fallback:</strong> Service Workers intercept
            requests and serve from Cache API if the network is down.
          </li>
          <li>
            <strong>ErrorBoundary:</strong> Wrap individual <code>Post</code>{" "}
            components in Error Boundaries to prevent a single corrupted post
            from crashing the entire feed.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Observability &amp; Monitoring</h2>
        <ul>
          <li>
            <strong>RUM (Real User Monitoring):</strong> Measure LCP, FID, and
            CLS in the field across different geographies.
          </li>
          <li>
            <strong>Error Tracking:</strong> Capture stack traces and user
            metadata (anonymized) to reproduce client-side crashes.
          </li>
          <li>
            <strong>Business Metrics:</strong> Track "Scroll Depth" and "Time to
            first interaction" to validate UX changes.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Trade-offs &amp; Design Decisions (CRITICAL)</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3>Pagination Strategy: Cursor vs. Offset</h3>
          <p>
            <strong>Choice:</strong> Cursor-based (Stable pointers).
          </p>
          <p>
            <strong>Trade-off:</strong> Offset pagination is easier to implement
            but fails in dynamic feeds. If a new post is added at the top, an
            offset-based client will see the same post twice on the next page
            fetch. Cursors ensure uniqueness.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3>State Management: Global vs. Local</h3>
          <p>
            <strong>Choice:</strong> Centralized for Content; Local for UI
            State.
          </p>
          <p>
            <strong>Trade-off:</strong> Global state for everything is slow and
            boilerplate-heavy. We keep "Is this post expanded?" in the local
            component state, but "Has the user liked this post?" in the global
            store to ensure it reflects everywhere (e.g., in a separate "Liked
            Posts" list).
          </p>
        </div>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Capacity Estimation</h2>
        <ul>
          <li>
            <strong>JSON Payload:</strong> ~5KB per post (including metadata).
            20 posts/page = 100KB.
          </li>
          <li>
            <strong>Image Load:</strong> 500KB - 2MB per viewport.{" "}
            <strong>Critical Mitigation:</strong> Adaptive loading based on
            network speed.
          </li>
          <li>
            <strong>Memory:</strong> 100 posts &approx; 20-30MB of JS heap.
            Images can easily reach 100MB+. <strong>Action:</strong> Unload
            images from memory for posts far outside the viewport.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Bottlenecks &amp; Mitigations</h2>
        <ul>
          <li>
            <strong>Bottleneck:</strong> Layout Thrashing during infinite
            scroll.
          </li>
          <li>
            <strong>Mitigation:</strong> Use{" "}
            <strong>Intersection Observer</strong> instead of{" "}
            <code>scroll</code> listeners. Batch DOM updates using{" "}
            <code>requestAnimationFrame</code>.
          </li>
          <li>
            <strong>Bottleneck:</strong> Memory Leaks in Virtual Lists.
          </li>
          <li>
            <strong>Mitigation:</strong> Ensure proper cleanup of event
            listeners and video instances in <code>componentWillUnmount</code> /{" "}
            <code>useEffect</code> cleanup.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Advanced Topics</h2>
        <h3>Adaptive Loading</h3>
        <p>
          Using <code>navigator.connection.effectiveType</code> to detect 2G/3G
          speeds. On slow networks: (1) Disable auto-play video. (2) Load
          low-res placeholders only. (3) Fetch fewer items per page.
        </p>
        <h3>Micro-Frontends</h3>
        <p>
          If the feed is maintained by multiple teams (Ads team, Organic team,
          Video team), we use <strong>Module Federation</strong> to allow
          independent deployments of different post types within the same feed
          container.
        </p>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Evolution Path</h2>
        <ul>
          <li>
            <strong>MVP:</strong> Monolithic React app with simple{" "}
            <code>fetch</code> and basic list rendering.
          </li>
          <li>
            <strong>Scale:</strong> Introduction of virtualization, state
            normalization, and Redux/Zustand.
          </li>
          <li>
            <strong>Global:</strong> Service Workers for offline, Multi-CDN
            asset strategy, and Adaptive Loading logic.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Interview Tips</h2>
        <ul>
          <li>
            <strong>Focus on "Smoothness":</strong> In frontend HLD, the user's
            perception of speed is as important as the actual latency. Mention
            skeletons and optimistic UI.
          </li>
          <li>
            <strong>Memory is the Constraint:</strong> Unlike backend
            (CPU/Storage), the frontend constraint is browser memory and the
            main thread. Emphasize virtualization and web workers.
          </li>
          <li>
            <strong>Ask about Media:</strong> "Is this a text-heavy feed (X) or
            video-heavy (TikTok)?" The design shifts significantly based on the
            media mix.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-theme" />

      <section>
        <h2>Interview Q&amp;A</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle variable-height posts in virtualization?
            </p>
            <p className="mt-2 text-sm">
              A: We use "Estimated Heights" for the scrollbar. As posts render,
              we use a <code>ResizeObserver</code> to get the exact height,
              update the store, and adjust the scroll offset of all elements
              below it to prevent jumps.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the benefit of a "Sentinel" over a "Scroll Listener"?
            </p>
            <p className="mt-2 text-sm">
              A: Sentinels (Intersection Observer) run on the browser's
              compositor thread and are far more performant. Scroll listeners
              fire continuously on the main thread, causing jank (dropping
              frames).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent "Layout Shift" when new posts arrive at the
              top?
            </p>
            <p className="mt-2 text-sm">
              A: Never auto-inject posts. Show a "New Posts" floating button.
              When clicked, we scroll the user to the top and render the new
              items, or we prepended them and manually adjust the{" "}
              <code>scrollTop</code> to maintain current view.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-theme" />

      {/* <section>
        <h2>Diagram Suggestions</h2>
        <ul>
          <li>
            <strong>Architecture Diagram:</strong> Showing App Shell, Feed
            Orchestrator, Store, and Network Clients. (Included)
          </li>
          <li>
            <strong>Data Flow Diagram:</strong> Normalization of API response
            into entity maps. (Included)
          </li>
          <li>
            <strong>Rendering Diagram:</strong> Detailed view of the
            Virtualization Window. (Included)
          </li>
          <li>
            <strong>Component Diagram:</strong> Breakout of the Post component
            into its sub-parts. (Included)
          </li>
        </ul>
      </section> */}

      <hr className="my-8 border-theme" />

      <section>
        <h2>Summary</h2>
        <HighlightBlock tier="crucial">
          Designing a high-scale social feed frontend is an exercise in{" "}
          <strong>defensive engineering</strong>. We assume the network will
          fail, the DOM will bloat, and the user's device will be slow. By using{" "}
          <strong>Virtualization</strong>, <strong>Normalization</strong>, and{" "}
          <strong>Adaptive Loading</strong>, we create a resilient system that
          delivers a high-quality experience to everyone, everywhere.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

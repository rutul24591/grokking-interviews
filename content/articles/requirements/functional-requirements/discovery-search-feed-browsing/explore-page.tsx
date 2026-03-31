"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-explore-page",
  title: "Explore Page",
  description:
    "Comprehensive guide to explore pages covering discovery features, trending topics, curated collections, personalization, and topic following for content discovery.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "explore-page",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "explore",
    "browse",
    "frontend",
    "personalization",
  ],
  relatedTopics: ["trending-section", "category-navigation", "discovery", "recommendation-algorithms"],
};

export default function ExplorePageArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Explore Page</strong> is a dedicated discovery destination that helps
          users find new content, topics, and creators beyond their existing follow graph.
          Unlike the feed (which shows content from followed accounts), the explore page
          surfaces trending topics, curated collections, and personalized recommendations
          to expand user interests and drive engagement. It is a critical feature for
          user retention—users who discover relevant content are more likely to return.
        </p>
        <p>
          Explore pages balance multiple objectives: surfacing trending content (what's
          popular now), personalized recommendations (what you might like), and diverse
          content (expanding your horizons). Twitter's Explore tab drives 30% of
          engagement, Instagram's Explore is the primary discovery surface for younger
          users, and YouTube's Explore homepage drives billions of views monthly.
        </p>
        <p>
          For staff-level engineers, explore page implementation involves recommendation
          algorithms (collaborative filtering, content-based), diversity optimization
          (avoiding filter bubbles), real-time trending computation, curation tools for
          editors, and A/B testing frameworks for continuous improvement.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Explore vs Feed</h3>
        <p>
          Understanding the distinction between explore and feed is critical:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Feed:</strong> Content from accounts/topics you follow. Primarily
            chronological or ranked by engagement with followed accounts. Purpose: Keep
            up with existing interests.
          </li>
          <li>
            <strong>Explore:</strong> Content beyond your follow graph. Trending topics,
            personalized recommendations, curated collections. Purpose: Discover new
            interests, expand horizons.
          </li>
          <li>
            <strong>Overlap:</strong> Some content may appear in both (viral posts from
            followed accounts). Explore should prioritize novelty—show content you
            haven't seen.
          </li>
        </ul>

        <h3 className="mt-6">Explore Page Sections</h3>
        <p>
          Typical explore page components:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Trending Topics:</strong> What's popular platform-wide or in your
            region/interests. Hashtags, topics, events. Updated frequently (every 5-15
            minutes).
          </li>
          <li>
            <strong>Curated Collections:</strong> Editor-selected content around themes
            (e.g., "Best of Tech 2024", "Black History Month"). Human curation ensures
            quality and relevance.
          </li>
          <li>
            <strong>Topics to Follow:</strong> Personalized topic suggestions based on
            your interests, followed accounts, engagement history.
          </li>
          <li>
            <strong>New &amp; Noteworthy:</strong> Fresh content from emerging creators.
            Helps new creators get discovered, prevents rich-get-richer dynamics.
          </li>
          <li>
            <strong>Because You Followed:</strong> Recommendations based on recent follows.
            "You followed @TechCrunch, here are more tech accounts."
          </li>
          <li>
            <strong>For You:</strong> Algorithmic recommendations mixing trending,
            personalized, and diverse content.
          </li>
        </ul>

        <h3 className="mt-6">Personalization Strategies</h3>
        <p>
          How explore pages personalize content:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Interest-based:</strong> Topics you follow, accounts you engage with,
            content you've liked/shared. Build user interest profile.
          </li>
          <li>
            <strong>Collaborative Filtering:</strong> Users like you also followed/liked X.
            Find similar users, recommend what they engaged with.
          </li>
          <li>
            <strong>Content-based:</strong> Content similar to what you've engaged with.
            Use embeddings, tags, categories for similarity.
          </li>
          <li>
            <strong>Hybrid:</strong> Combine multiple signals. Weight by confidence,
            diversity requirements, freshness.
          </li>
        </ul>

        <h3 className="mt-6">Diversity Optimization</h3>
        <p>
          Avoiding filter bubbles in explore:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Topic Diversity:</strong> Ensure multiple topics represented, not
            just your primary interest. If you follow tech, also show science, business.
          </li>
          <li>
            <strong>Source Diversity:</strong> Don't show content from same creator
            repeatedly. Limit consecutive items from same source.
          </li>
          <li>
            <strong>Viewpoint Diversity:</strong> For news/topics, show multiple
            perspectives. Avoid echo chambers.
          </li>
          <li>
            <strong>Exploration Bandit:</strong> Allocate 10-20% of slots to exploration
            (content outside your typical interests). Gather data on new interests.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production explore page involves multiple components working together for
          personalized, diverse discovery.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/explore-page/explore-page-architecture.svg"
          alt="Explore Page Architecture"
          caption="Figure 1: Explore Page Architecture — Multiple content sources (trending, curated, personalized) merged and ranked for display"
          width={1000}
          height={500}
        />

        <h3>Content Sources</h3>
        <ul className="space-y-3">
          <li>
            <strong>Trending Service:</strong> Computes trending topics in real-time.
            Uses velocity (engagement/hour), volume (total engagement), time decay.
            Returns top 50 trending topics.
          </li>
          <li>
            <strong>Curation CMS:</strong> Editor-facing tool for creating collections.
            Stores collection metadata, selected content, display order.
          </li>
          <li>
            <strong>Recommendation Service:</strong> Generates personalized recommendations.
            Uses collaborative filtering, content-based, hybrid models.
          </li>
          <li>
            <strong>Topic Graph:</strong> Topic relationships, hierarchies, related topics.
            Used for "topics to follow" suggestions.
          </li>
        </ul>

        <h3 className="mt-6">Ranking Pipeline</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Candidate Generation:</strong> Fetch candidates from each source
            (trending, curated, personalized). ~500 candidates total.
          </li>
          <li>
            <strong>Scoring:</strong> Score each candidate using ML model. Features:
            relevance, freshness, engagement prediction, diversity contribution.
          </li>
          <li>
            <strong>Re-Ranking:</strong> Apply diversity constraints, business rules
            (promote certain topics), freshness guarantees.
          </li>
          <li>
            <strong>Section Assignment:</strong> Assign content to sections (trending,
            for you, new &amp; noteworthy). Each section has specific criteria.
          </li>
          <li>
            <strong>Display:</strong> Render sections in order. Lazy load below-fold
            sections for performance.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/explore-page/personalization-strategies.svg"
          alt="Personalization Strategies"
          caption="Figure 2: Personalization Strategies — Interest-based, collaborative filtering, and content-based recommendations combined"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Curation Tools</h3>
        <p>
          Editor-facing tools for content curation:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Feature</th>
                <th className="text-left p-2 font-semibold">Purpose</th>
                <th className="text-left p-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Collection Builder</td>
                <td className="p-2">Create themed collections</td>
                <td className="p-2">"Best of 2024", "Black History Month"</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Content Search</td>
                <td className="p-2">Find content to add</td>
                <td className="p-2">Search by keyword, creator, date</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Scheduling</td>
                <td className="p-2">Schedule collection launch</td>
                <td className="p-2">Launch at specific date/time</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Analytics</td>
                <td className="p-2">Track collection performance</td>
                <td className="p-2">Views, engagement, follows driven</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Real-time Updates</h3>
        <ul className="space-y-3">
          <li>
            <strong>Trending Refresh:</strong> Update trending topics every 5-15 minutes.
            Use streaming computation (Flink, Spark Streaming) for real-time velocity.
          </li>
          <li>
            <strong>Personalization Updates:</strong> Update recommendations as user
            engages (follows topics, likes content). Real-time feature updates.
          </li>
          <li>
            <strong>Breaking News:</strong> Prioritize breaking news in trending.
            Detect spikes in engagement, boost relevant topics.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Explore page design involves balancing discovery, relevance, and diversity.
        </p>

        <h3>Manual vs Algorithmic Curation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Quality</th>
                <th className="text-left p-2 font-semibold">Scale</th>
                <th className="text-left p-2 font-semibold">Freshness</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Manual Curation</td>
                <td className="p-2">High (human judgment)</td>
                <td className="p-2">Low (labor intensive)</td>
                <td className="p-2">Medium (editorial schedule)</td>
                <td className="p-2">Premium collections, events</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Algorithmic</td>
                <td className="p-2">Medium (model-dependent)</td>
                <td className="p-2">High (automated)</td>
                <td className="p-2">High (real-time)</td>
                <td className="p-2">Personalized recommendations</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hybrid</td>
                <td className="p-2">High (best of both)</td>
                <td className="p-2">Medium</td>
                <td className="p-2">High</td>
                <td className="p-2">Production systems</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/explore-page/explore-page-sections.svg"
          alt="Explore Page Sections"
          caption="Figure 3: Explore Page Sections — Trending, curated collections, topics to follow, new & noteworthy layout"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Personalization vs Discovery</h3>
        <p>
          <strong>High Personalization:</strong> Show content similar to past engagement.
          High relevance, low discovery. Risk: Filter bubble, user gets stuck in echo
          chamber.
        </p>
        <p>
          <strong>High Discovery:</strong> Show diverse, novel content. Low relevance
          initially, high discovery potential. Risk: User overwhelmed, low engagement.
        </p>
        <p>
          <strong>Production Approach:</strong> 70% personalized (relevant), 20%
          discovery (new topics), 10% trending (platform-wide). Adjust based on user
          segment (new users get more discovery, power users get more personalization).
        </p>

        <h3 className="mt-6">Section Ordering</h3>
        <p>
          <strong>Trending First:</strong> Surface what's popular now. Good for engagement,
          FOMO. Risk: Dominated by viral content, may not be relevant.
        </p>
        <p>
          <strong>Personalized First:</strong> Surface what you'll like. Good for
          relevance, satisfaction. Risk: Filter bubble, less discovery.
        </p>
        <p>
          <strong>Hybrid Ordering:</strong> Mix sections based on user intent. New users
          see trending first (learn platform norms), returning users see personalized
          first (relevant content).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Balance Sections:</strong> Mix trending, personalized, curated,
            discovery. Don't let one section dominate. Target: 30% trending, 40%
            personalized, 20% curated, 10% discovery.
          </li>
          <li>
            <strong>Fresh Content:</strong> Prioritize new content in explore. Users
            come to discover, not see old content. Boost content &lt;24 hours old.
          </li>
          <li>
            <strong>Diversity Constraints:</strong> Limit consecutive items from same
            topic/source. Ensure topic diversity (no more than 30% from one category).
          </li>
          <li>
            <strong>Editorial Oversight:</strong> Human curators for important events,
            sensitive topics. Algorithms can miss context, nuance.
          </li>
          <li>
            <strong>A/B Test Layouts:</strong> Test section ordering, section sizes,
            content density. Use engagement (time spent, follows driven) as metric.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Vertical scroll, large touch targets,
            lazy load images. Explore is heavily mobile (70%+ traffic).
          </li>
          <li>
            <strong>Accessibility:</strong> Semantic HTML, ARIA labels, keyboard
            navigation. Screen reader support for all sections.
          </li>
          <li>
            <strong>Performance:</strong> Lazy load below-fold sections, optimize
            images, cache recommendations. Target &lt;2s page load.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Echo Chamber:</strong> Only showing content similar to past engagement.
            Solution: Allocate exploration budget (10-20% for discovery).
          </li>
          <li>
            <strong>Stale Content:</strong> Old content dominates explore. Solution:
            Freshness boost, decay old content scores.
          </li>
          <li>
            <strong>Over-curation:</strong> Too many curated sections, not enough
            algorithmic. Solution: Balance manual and algorithmic (30/70 split).
          </li>
          <li>
            <strong>Ignoring New Users:</strong> Same explore for new and power users.
            Solution: Segment by user type, new users see more trending/onboarding.
          </li>
          <li>
            <strong>No Diversity:</strong> All content from same topic/source. Solution:
            Enforce diversity constraints in re-ranking.
          </li>
          <li>
            <strong>Slow Performance:</strong> Too many sections, heavy images. Solution:
            Lazy load, optimize images, cache recommendations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Explore</h3>
        <p>
          Twitter Explore shows trending topics, news, sports, entertainment. Personalized
          based on followed accounts, engaged topics. Includes "Because you followed"
          section for topic discovery.
        </p>
        <p>
          <strong>Key Innovation:</strong> Real-time trending computation—topics update
          every 5 minutes based on engagement velocity. Breaking news surfaces immediately.
        </p>

        <h3 className="mt-6">Instagram Explore</h3>
        <p>
          Instagram Explore is grid-based discovery surface. Shows photos/videos from
          accounts you don't follow. Personalized based on likes, saves, follows.
          Includes reels, shopping, IGTV sections.
        </p>
        <p>
          <strong>Key Innovation:</strong> Visual similarity—shows content visually
          similar to what you've engaged with (colors, composition, subject matter).
        </p>

        <h3 className="mt-6">YouTube Explore/Home</h3>
        <p>
          YouTube homepage is personalized explore. Shows recommended videos, trending,
          subscriptions mix. Uses two-tower neural network for recommendations.
        </p>
        <p>
          <strong>Key Innovation:</strong> Watch time optimization—ranks by predicted
          watch time, not just clicks. Prevents clickbait.
        </p>

        <h3 className="mt-6">Reddit Popular</h3>
        <p>
          Reddit Popular shows trending posts across all subreddits. Users can customize
          by subscribing to subreddits. Includes rising, new, top sections.
        </p>
        <p>
          <strong>Key Innovation:</strong> Community-driven curation—upvotes determine
          visibility. Moderators curate subreddit-specific content.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How is Explore different from Feed?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Feed shows content from accounts/topics you follow—
              primarily chronological or ranked by engagement with followed accounts.
              Explore shows content beyond your follow graph—trending topics, personalized
              recommendations, curated collections. Feed is for keeping up with existing
              interests; Explore is for discovering new interests. Some overlap (viral
              posts from followed accounts) but Explore should prioritize novelty.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you curate collections?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Hybrid approach: (1) Manual curation by editors for
              premium collections (events, holidays, important topics). Editors use CMS
              to select content, write descriptions, schedule launch. (2) Algorithmic
              collections based on themes (e.g., "Popular in Tech" computed automatically).
              (3) Track collection performance (views, engagement, follows driven) to
              improve curation. Update collections regularly (daily/weekly).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you personalize explore content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Build user interest profile from: followed topics/accounts,
              engagement history (likes, shares, comments), watch time, search queries.
              Use collaborative filtering (users like you also liked X), content-based
              (content similar to what you engaged with), and hybrid approaches. Update
              profile in real-time as user engages. Balance personalization (70%) with
              discovery (20%) and trending (10%).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure diversity in explore?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Enforce diversity constraints in re-ranking: (1) Topic
              diversity—no more than 30% from one category. (2) Source diversity—limit
              consecutive items from same creator. (3) Viewpoint diversity—for news,
              show multiple perspectives. (4) Exploration bandit—allocate 10-20% of
              slots to content outside user's typical interests. Monitor diversity
              metrics (topic entropy, source concentration).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle breaking news in explore?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect breaking news via engagement spikes (sudden
              increase in posts about topic). Boost relevant topics in trending section.
              Create special "Breaking News" section if warranted. Verify news quality
              (trusted sources, multiple confirmations) before promoting. Update
              frequently as story develops. Balance speed with accuracy—don't spread
              misinformation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure explore page success?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Primary metrics: Time spent on explore, follows driven
              (new topics/accounts followed), engagement rate (likes, shares, comments
              from explore traffic). Secondary metrics: Return rate (users who use
              explore return to app), diversity metrics (topic entropy, source diversity).
              Guardrail metrics: Page load time, scroll depth. A/B test changes with
              these metrics.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://blog.twitter.com/engineering/en_us/topics/insights/2019/designing-a-new-explore"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering — Designing a New Explore
            </a>
          </li>
          <li>
            <a
              href="https://instagram-engineering.com/tagged/explore"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram Engineering — Explore Articles
            </a>
          </li>
          <li>
            <a
              href="https://ai.google/research/pubs/pub45530/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Research — Deep Neural Networks for YouTube Recommendations
            </a>
          </li>
          <li>
            <a
              href="https://www.redditinc.com/blog"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit Blog — Engineering Articles
            </a>
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/tagged/recommendations"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Recommendation Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-empty-states-extensive",
  title: "Empty States",
  description:
    "Staff-level deep dive into empty state design patterns, first-use experiences, zero-data handling, contextual guidance, and systematic approaches to turning absence of content into engagement opportunities.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "empty-states",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "empty states",
    "UX patterns",
    "onboarding",
    "zero data",
    "first-use experience",
  ],
  relatedTopics: [
    "loading-states",
    "error-states",
    "skeleton-screens",
    "optimistic-ui-updates",
  ],
};

export default function EmptyStatesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Empty states</strong> are the UI conditions that occur when
          there is no content to display in a given view or component —
          whether because the user is new and has not created content yet, a
          search returned no results, a filter eliminated all items, data was
          deleted, or an error prevented content from loading. Empty states are
          among the most overlooked yet impactful UX patterns in application
          design. A well-designed empty state transforms a moment of potential
          confusion or disappointment into an opportunity for guidance,
          education, or engagement.
        </p>
        <p>
          Empty states occur in virtually every application feature: an inbox
          with no messages, a project management board with no tasks, a search
          with no matching results, a favorites list with no saved items, an
          analytics dashboard with no data yet, or a social feed with no posts.
          Each context requires a different empty state treatment because the
          reason for emptiness — and the appropriate next action — differs. A
          first-time user seeing an empty inbox needs onboarding guidance. A
          user whose search returned zero results needs refinement suggestions.
          A user whose filter eliminated all items needs a way to clear filters.
          A user whose data was deleted needs confirmation and an undo option.
        </p>
        <p>
          At the staff and principal engineer level, empty states require
          systematic treatment across the application. A design system should
          define standard empty state components with configurable elements
          (illustration, headline, description, primary action, secondary
          action), and every data-driven view should have a designed empty
          state — not a blank white space. The architecture should support
          empty state detection at the component level (checking data array
          length, query result count, or filter match count) and render the
          appropriate empty state variant based on the context. This systematic
          approach prevents the common failure mode where empty states are
          discovered in production as blank screens because no developer
          considered the zero-data case.
        </p>
        <p>
          Empty states intersect with onboarding, feature discovery, and
          retention strategy. A thoughtfully designed first-use empty state
          reduces time-to-value by guiding new users through their first
          interaction. An empty state that surfaces related features (a project
          board empty state suggesting templates) drives feature adoption. An
          empty state that acknowledges completion (&quot;all caught up&quot;
          in an inbox) provides positive reinforcement. Organizations that
          invest in empty state design see measurable improvements in
          activation rates, feature adoption, and user satisfaction — because
          empty states are often the first thing a new user sees.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>First-Use Empty State:</strong> The empty state displayed
            when a user encounters a feature for the first time with no
            existing data. This is the most important empty state type because
            it forms the user&apos;s first impression of the feature. It should
            explain what the feature does, show how to get started, and ideally
            provide a one-click path to creating the first piece of content.
            Effective first-use empty states include an illustration, a brief
            value proposition, and a prominent call-to-action.
          </li>
          <li>
            <strong>No Results Empty State:</strong> Displayed when a search
            query, filter, or category selection returns zero matching items.
            This state should acknowledge the search attempt, explain why there
            are no results (if possible), and provide actionable alternatives —
            broadening search terms, clearing filters, or trying a different
            category. The worst no-results empty state is a blank area with
            no explanation.
          </li>
          <li>
            <strong>Cleared/Completed Empty State:</strong> Shown when a user
            has processed all items — an inbox with all messages read, a task
            list with all tasks completed, a notification center with all
            notifications cleared. This is a positive empty state that should
            provide a sense of accomplishment. &quot;All caught up&quot;
            messages, celebratory illustrations, and suggestions for next
            actions are appropriate here.
          </li>
          <li>
            <strong>Error-Induced Empty State:</strong> When content fails to
            load due to a network error, server failure, or permission issue,
            the result is an empty view that should not be confused with a
            genuine empty data set. Error-induced empty states must be visually
            distinct from data-empty states, explain that an error occurred,
            and provide retry or refresh actions. Displaying a &quot;no items
            yet&quot; message when content failed to load is a common and
            confusing mistake.
          </li>
          <li>
            <strong>Permission-Based Empty State:</strong> Displayed when a
            user lacks permissions to view content that exists but is not
            accessible to them. This state should explain the access
            restriction without revealing sensitive information about the
            restricted content, and provide a path to request access if
            applicable.
          </li>
          <li>
            <strong>Empty State Components:</strong> Standardized UI elements
            that compose empty state displays: an illustration or icon
            (providing visual interest and context), a headline (concise,
            positive, action-oriented), a description (explaining the
            situation and its context), a primary action (the most important
            next step), and a secondary action (an alternative path). Design
            systems should define these components with consistent styling,
            sizing, and positioning guidelines.
          </li>
          <li>
            <strong>Contextual Empty State Detection:</strong> The logic that
            determines which type of empty state to display based on the
            context — did a search return no results, did a filter eliminate
            all items, is this the user&apos;s first visit, or did data fail
            to load? The detection must distinguish between these scenarios to
            display the appropriate message and actions. This requires
            tracking the cause of emptiness, not just the absence of data.
          </li>
          <li>
            <strong>Placeholder Content:</strong> Sample or template data
            displayed in place of an empty state to demonstrate what the
            feature looks like with real content. Placeholder content is
            particularly effective for complex features where the empty state
            cannot adequately convey the feature&apos;s value proposition.
            Example: a kanban board empty state that shows a pre-populated
            template project the user can adopt or discard.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Empty state architecture involves data state detection, context
          classification, and component rendering. The following diagrams
          illustrate the key patterns.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/empty-states-diagram-1.svg"
          alt="Empty state decision tree showing how data state, user context, and error state combine to select the appropriate empty state variant"
          caption="Figure 1: Empty state decision tree — how context determines which empty state variant to display."
        />
        <p>
          The decision tree evaluates multiple signals to select the appropriate
          empty state variant. First, it checks whether data loading completed
          successfully — if not, the error-induced empty state is displayed.
          If loading succeeded, it checks whether the user has any data in this
          feature at all (distinguishing first-use from no-results). If the
          user has data but the current view is empty, it checks whether the
          emptiness is due to active filters or search (no-results state) or
          whether the user has cleared all items (completed state). Each
          terminal node in the decision tree maps to a specific empty state
          component with appropriate messaging, illustration, and actions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/empty-states-diagram-2.svg"
          alt="Empty state component architecture showing composable elements: illustration, headline, description, primary action, and secondary action"
          caption="Figure 2: Empty state component architecture — composable elements that form consistent empty state displays."
        />
        <p>
          The empty state component is designed as a composable system with
          standardized sub-components. The illustration slot accepts SVG icons,
          illustrations, or Lottie animations appropriate to the context. The
          headline slot contains a concise, positive message (not an error
          message). The description slot provides additional context and
          guidance. The primary action slot contains the most important next
          step (create first item, clear filters, retry). The secondary action
          slot provides an alternative path (learn more, browse templates, go
          back). The component handles responsive layouts, theme adaptation, and
          consistent vertical spacing. Design tokens define sizing, alignment,
          and maximum width constraints to ensure empty states feel intentional
          and well-designed rather than afterthoughts.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/empty-states-diagram-3.svg"
          alt="Data state flow showing how components transition between loading, empty, populated, and error states"
          caption="Figure 3: Data state flow — the complete lifecycle of a data-driven component from loading through all possible states."
        />
        <p>
          The data state flow diagram models the complete lifecycle of a
          data-driven component. Initial render triggers a data fetch, which
          displays a loading state. The fetch resolves to either an error
          (error state displayed), empty data (empty state displayed), or
          populated data (content displayed). From the populated state, user
          actions like deleting all items or applying a filter can transition
          back to an empty state — which must be the correct empty state variant
          (completed or no-results, not first-use). A data refresh can
          transition from any display state back through loading. The diagram
          ensures that all state transitions are explicitly designed and that
          no transition results in a blank or ambiguous display.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-theme bg-panel p-2 text-left">Approach</th>
              <th className="border border-theme bg-panel p-2 text-left">Advantages</th>
              <th className="border border-theme bg-panel p-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2">Illustrated empty states</td>
              <td className="border border-theme p-2">
                Visually engaging, convey brand personality, make empty moments feel intentional, improve first impressions.
              </td>
              <td className="border border-theme p-2">
                Require design investment per feature, illustration maintenance as features evolve, larger asset sizes, potential accessibility concerns with decorative images.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Text-only empty states</td>
              <td className="border border-theme p-2">
                Simple to implement, easy to localize, minimal maintenance, lightweight assets.
              </td>
              <td className="border border-theme p-2">
                Feel sparse and undesigned, miss the opportunity for engagement, less memorable, can appear as a bug to users.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Placeholder content</td>
              <td className="border border-theme p-2">
                Shows the feature&apos;s full potential, provides an interactive demo, accelerates feature understanding.
              </td>
              <td className="border border-theme p-2">
                Users may confuse placeholder data with real data, harder to implement than static empty states, requires cleanup when user creates real data.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Contextual versus generic empty states</td>
              <td className="border border-theme p-2">
                Contextual states provide specific guidance for each empty scenario, improving actionability and reducing confusion.
              </td>
              <td className="border border-theme p-2">
                More variants to design, implement, and test. Generic states are simpler but provide less useful guidance.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Design every data-driven view&apos;s empty state explicitly:</strong>{" "}
            Audit every feature that displays data and ensure each has a designed empty state. No view should display a blank white space when there is no data. Include empty state design as a required artifact in feature specification templates. The audit should cover first-use, no-results, completed, and error-induced variants for each view.
          </li>
          <li>
            <strong>Distinguish between empty types with different messages and actions:</strong>{" "}
            A first-use empty state needs onboarding guidance. A no-results state needs search refinement suggestions. A completed state needs positive reinforcement. An error state needs retry options. Using a single generic &quot;Nothing here yet&quot; message for all contexts misses the opportunity to provide specific, actionable guidance.
          </li>
          <li>
            <strong>Make the primary action obvious and accessible:</strong>{" "}
            The primary action in an empty state should be the single most helpful next step for the user. Place it prominently — a filled button below the description — and make it immediately actionable. The best empty states require a single click to begin creating content.
          </li>
          <li>
            <strong>Use positive, action-oriented language:</strong>{" "}
            Empty state headlines should be positive and forward-looking, not negative or apologetic. &quot;Start your first project&quot; is better than &quot;No projects found.&quot; &quot;All caught up!&quot; is better than &quot;You have no notifications.&quot; The tone should encourage action, not highlight absence.
          </li>
          <li>
            <strong>Prevent confusion between empty and error states:</strong>{" "}
            Clearly distinguish data-empty from error-induced-empty visually and textually. If content failed to load, say so — do not display a &quot;no items yet&quot; message that implies the user has never created content. Use different illustrations, headlines, and actions for error scenarios.
          </li>
          <li>
            <strong>Include empty states in the design system:</strong>{" "}
            Create a standardized empty state component in the design system with configurable slots for illustration, headline, description, and actions. Define guidelines for when to use each variant. This ensures consistency across features and reduces the effort of designing empty states for new features.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Blank white space with no explanation:</strong>{" "}
            The most common empty state failure — a data list renders nothing because the array is empty, leaving a blank area. Users cannot tell whether the page is loading, broken, or genuinely empty. Always render an explicit empty state component when data arrays are empty.
          </li>
          <li>
            <strong>Generic messages that do not help the user act:</strong>{" "}
            &quot;No data available&quot; tells the user what they can see (nothing) but not what to do about it. Provide specific guidance: what they can create, where to look for content, or how to adjust their query. Empty states are guidance opportunities, not error messages.
          </li>
          <li>
            <strong>Displaying first-use messaging to returning users:</strong>{" "}
            When a returning user deletes all items or applies a filter that eliminates all results, showing the first-use onboarding message is confusing — they already know what the feature does. Track whether the user has previously had data and display the appropriate variant (completed or no-results) instead.
          </li>
          <li>
            <strong>Not testing empty states:</strong>{" "}
            Empty states are often discovered in production because automated tests seed data before running. Include explicit empty state tests: verify that components render the correct empty variant when data arrays are empty, when searches return no results, and when errors occur during loading.
          </li>
          <li>
            <strong>Confusing empty states with loading states:</strong>{" "}
            Before data has loaded, the view is in a loading state — not an empty state. Rendering an empty state before loading completes tells users there is no data when the data might simply not have arrived yet. Always wait for the loading state to resolve before evaluating whether to show an empty state.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Dropbox&apos;s first-use onboarding:</strong> Dropbox displays an illustrated empty state when a new user first opens their file browser, showing a welcoming illustration of a folder with files and a prominent &quot;Upload files&quot; button. The empty state includes a brief explanation of how Dropbox works and links to install the desktop client and mobile app. This treatment converts the potentially confusing moment of an empty file browser into a guided onboarding step.
        </p>
        <p>
          <strong>Gmail&apos;s inbox zero state:</strong> When a user achieves inbox zero, Gmail displays a sun-and-checkmark illustration with the message &quot;You&apos;re all done! Nothing in Primary.&quot; This positive completed empty state provides satisfaction and reinforcement rather than presenting an empty inbox as a problem. The treatment varies by inbox tab — Primary shows the celebratory state while Promotions shows a simpler &quot;No new mail&quot; message.
        </p>
        <p>
          <strong>Notion&apos;s template-driven empty states:</strong> Notion displays empty page states with an inline menu offering template options relevant to the page type — meeting notes, project tracker, knowledge base, and more. Rather than showing a blank page, the empty state becomes a feature discovery mechanism that accelerates time-to-value by connecting users with pre-built structures they can customize.
        </p>
        <p>
          <strong>Airbnb&apos;s no-results search:</strong> When an Airbnb search returns no results, the empty state provides specific suggestions: adjusting dates, expanding the geographic area, or removing filters. It also shows nearby listings that partially match the criteria, turning the no-results state into a discovery opportunity rather than a dead end.
        </p>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nngroup.com/articles/empty-state-interface-design/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Empty State Design
            </a>
          </li>
          <li>
            <a href="https://www.invisionapp.com/inside-design/empty-state-design-guidelines/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              InVision — Empty State Design Guidelines
            </a>
          </li>
          <li>
            <a href="https://emptystat.es/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              emptystat.es — Collection of Empty State Design Inspiration
            </a>
          </li>
          <li>
            <a href="https://material.io/design/communication/empty-states.html" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Material Design — Empty States Guidelines
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are the different types of empty states, and how should each be handled?</p>
            <p className="mt-2 text-sm">
              A: There are five primary types. First-use: the user has never created content in this feature — provide onboarding guidance and a clear creation path. No-results: a search or filter returned nothing — show refinement suggestions and related content. Completed: the user has processed all items — provide positive reinforcement and next-action suggestions. Error-induced: content failed to load — explain the error and provide retry options. Permission-based: content exists but is inaccessible — explain the restriction and provide access request path. Each type requires different messaging, illustrations, and actions. Using a generic empty state for all types misses the opportunity to provide contextually appropriate guidance.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent empty states from appearing broken to users?</p>
            <p className="mt-2 text-sm">
              A: Three key strategies. First, make empty states visually intentional — use illustrations, structured layouts, and styled components rather than blank space or plain text. An empty state that looks designed communicates that the application is working correctly. Second, provide clear explanations — tell users why the area is empty and what they can do about it. Third, distinguish empty from loading and error states — do not show an empty state before data loading completes (users think there is no data when it is still loading), and use distinct visual treatments for errors versus genuine emptiness.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do empty states contribute to user onboarding and activation?</p>
            <p className="mt-2 text-sm">
              A: Empty states are often the literal first screen a new user encounters — they are the onboarding moment. A well-designed first-use empty state reduces time-to-value by explaining what the feature does, showing how it looks with content (via illustrations or placeholder data), and providing a one-click path to creating the first piece of content. Measuring empty state effectiveness through activation metrics (percentage of users who create their first item after seeing the empty state) provides data for iterating on the design. The difference between a blank screen and a compelling empty state can materially impact activation rates.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you systematically ensure all views have designed empty states?</p>
            <p className="mt-2 text-sm">
              A: Implement a multi-layered approach. First, include empty state design as a required artifact in feature specification templates — every data-driven view must have empty state mockups before development begins. Second, add empty state rendering to the component architecture — data-fetching components should explicitly handle the empty data case through a required emptyState prop or a standardized empty detection pattern. Third, write tests that verify empty state rendering by testing components with empty data arrays. Fourth, conduct periodic empty state audits across the application to identify views that display blank space when empty.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use placeholder data or illustrations for empty states?</p>
            <p className="mt-2 text-sm">
              A: It depends on the feature complexity. For simple features (a list, a feed, a settings page), illustrated empty states with explanatory text and a creation button are sufficient — the feature is simple enough that users understand it from the description. For complex features (a kanban board, a workflow builder, a dashboard), placeholder data or interactive templates are more effective because the feature&apos;s value is not apparent from an illustration alone — users need to see it populated to understand its potential. The trade-off is implementation complexity: placeholder data requires cleanup logic when the user creates real data, and template data must be clearly marked as examples to prevent confusion.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

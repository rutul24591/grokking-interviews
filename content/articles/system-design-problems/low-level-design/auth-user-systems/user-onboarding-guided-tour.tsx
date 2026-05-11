"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-user-onboarding-guided-tour",
  title: "User Onboarding and Guided Tour System",
  description: "Designing interactive onboarding flows and guided tours with step tracking, hotspots, and role-based tour customization for new user activation.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "user-onboarding-guided-tour",
  wordCount: 5400,
  readingTime: 32,
  lastUpdated: "2026-05-05",
  tags: ["lld", "onboarding", "tutorial", "ux", "new-user", "guided-tour"],
  relatedTopics: ["login-session-management", "stepper-progress-tracker", "modal-dialog-state"],
};

export default function UserOnboardingGuidedTourArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A new user signs up for a project management app. They see a blank dashboard with confusing buttons. They don't know how to create a project, invite teammates, or set up workflows. Without guidance, they get lost, frustrated, and abandon the app (high churn). With a guided tour, they click through 5 steps: "Create your first project", "Invite teammates", "Set up workflow", "Configure notifications", "Start using". By the end, they're activated and confident.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Onboarding is critical for user activation. But it's also tricky: users hate being patronized with obvious tutorials, they want to explore independently, and forcing them through long walkthroughs causes rage-quits. The challenge is balancing guidance (new users need help) with autonomy (experienced users want freedom).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Key challenges: (1) engagement (tutorials are boring, make them interactive and in-context), (2) optionality (allow users to skip and explore), (3) progress tracking (user closes tab mid-tour, can they resume?), (4) role-based tours (onboarding differs for admin vs regular user), (5) mobile responsiveness (tour must work on phone), and (6) performance (tour overlay doesn't slow app).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Naive approach: static help pages or long video tutorials (rarely watched). Better: interactive guided tours highlighting features in real app context, allowing skip, and tracking progress. Users see the actual UI, understand how it works, and can immediately try it.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> App has multiple features (5-15 steps to explain). Users can skip or pause tour. Progress is tracked in user profile. Multiple tours exist (onboarding, advanced features). Mobile and desktop both supported. Tours are role-based (different for admin, editor, viewer).</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Multi-Step Guided Tours:</strong> Display sequenced tour steps (5-15 steps). Each step highlights a target UI element and shows instructions. Steps can be navigated forward/backward with Next/Previous buttons. Include step counter (e.g., "Step 3 of 7").</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Interactive Hotspots:</strong> Tour can include clickable hotspots. User clicks "Confirm" button in tooltip, or manually clicks the highlighted element, to advance. Optionally require user to perform action (create project) before allowing next step (enforced learning).</HighlightBlock>
          <li><strong>Skip and Exit Options:</strong> "Skip Tour" button allows user to dismiss tour immediately at any step. "Maybe Later" pauses tour and resumes on next visit. Don't force users through onboarding (high abandonment).</li>
          <li><strong>Progress Tracking and Persistence:</strong> Store which step user is on. If user closes browser mid-tour, next visit resumes from step N (not restart from beginning). Track completion: "User completed onboarding" flag prevents re-showing completed tours.</li>
          <HighlightBlock as="li" tier="important"><strong>Tour Replay:</strong> Add "Replay Tour" button in settings/help menu. User can revisit tour anytime. Useful for refreshing memory or showing colleagues.</HighlightBlock>
          <li><strong>Role-Based and Adaptive Tours:</strong> Different tours for different user roles. Admin sees tour on permissions, regular user sees tour on creating content. Display tour only if relevant (feature enabled, first time visiting page).</li>
          <li><strong>Multiple Tour Types:</strong> Support onboarding tour (first-time users), feature tours (new feature announcement), advanced tours (power user tips). Only show relevant tour to user.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Performance:</strong> Tour overlay and highlight rendering don't cause jank or frame drops. Tour doesn't slow page load. Lazy-load tour content only when needed.</HighlightBlock>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> Tour content readable with screen reader. Keyboard navigable (Tab through Next/Previous buttons, Escape to close). High contrast on overlays for visibility. Tooltips have sufficient padding and readability.</HighlightBlock>
          <li><strong>Mobile Responsiveness:</strong> Tour adapts to mobile screens. Tooltips reposition to fit small viewports. Highlighting elements works on touch devices. Tour is usable and non-obstructive on mobile.</li>
          <li><strong>Localization:</strong> Tour text is translated. Elements can be repositioned for RTL languages (Arabic, Hebrew).</li>
        </ul>
      </section>

        <section>
          <h2>High-Level Approach</h2>
          <HighlightBlock as="p" tier="important">The tour system has three components: tour definition (structured steps), runtime (render highlights and tooltips), and persistence (track progress).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Definition: Create a tour configuration (data, not markup). Each step specifies a target element selector, title, description, an action type (Next, Confirm, Action), and optional conditions for whether the step should appear. For example, a first step might target the create-project button, show a short title, and advance on Next.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Runtime: On app load, check if user should see tour (first time, not completed). If yes, render overlay (semi-transparent dark layer), highlight target element (spotlight or bright background), position tooltip near element, show navigation buttons. On "Next", advance to step 2. On "Skip", mark tour as dismissed. On "Previous", go back.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Persistence: Store tour progress in the user profile, including the tour identifier, the current step number, whether the tour is completed, and when it was dismissed. On the next visit, read this state to resume the tour or skip it entirely if already completed.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Mobile handling: On small screens, reposition tooltip to fit. Use full-screen overlay if needed. Ensure highlight and buttons are visible and clickable on touch devices.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/user-onboarding-guided-tour.svg"
          alt="User onboarding tour flow, smart tooltip positioning engine, step configuration schema, and tour state persistence"
          caption="User onboarding tour flow, smart tooltip positioning engine, step configuration schema, and tour state persistence"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Tour Configuration and Structure</h3>
        <p>Tours are defined as structured configs (JSON or code). Each tour has: id (unique, e.g., "onboarding-v1"), name ("Onboarding"), steps (array of step objects), conditions (show if first_time_user && user_role === "editor"), priority (1-10, higher shows first). Each step includes: target (CSS selector of element to highlight), title ("Create Your First Project"), description (longer explanation), action ("next" or "confirm"), optional conditions (show if feature_enabled), and optional callback (execute when step completes, e.g., log analytics).</p>
        <p>Multiple tours can exist: onboarding (first-time), feature tours (announce new features), power-user tours (advanced features). On app load, check which tours apply to user, rank by priority, show highest priority (only one active tour at a time).</p>
        <HighlightBlock as="p" tier="important"><strong>Tour Versioning and Updates:</strong> Tours evolve as the app changes. Use semantic versioning such as onboarding v1 and onboarding v2. When the UI changes materially, publish a new tour version rather than silently editing the old one. Track which tour version a user has completed in their profile. If a newer version is available, offer an opt-in prompt explaining that the experience has changed. During transitions, support selector aliasing so the runtime can map older step targets to newer DOM selectors without breaking in-flight rollouts.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial"><strong>Conditional Tour Display Logic:</strong> Tour visibility depends on multiple factors, such as whether the user is new, their role, whether the underlying feature is enabled, experimentation assignment, and whether the user dismissed the tour recently. Implement a single decision function in the product that evaluates these conditions consistently so the UI does not “randomly” show tours. Store dismissal state with an expiration window, so you can avoid re-showing a tour for a period such as 30 days while still allowing a re-prompt later if appropriate.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Role-Based Tour Customization:</strong> Different roles need different guidance. Admin tours might focus on permissions, billing, and team management. Editor tours might focus on creation workflows and collaboration. Viewer tours can be minimal. Model tours as role-scoped content bundles so onboarding selects the correct tour at signup. If a user’s role changes later, you can show a short “what changed” tour to teach new capabilities and reduce support load.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Element Highlighting and Spotlight</h3>
        <p>When a tour step shows, render an overlay: semi-transparent dark layer covering entire screen. Cut out a spotlight around the target element using CSS clip-path or SVG mask. The target element is fully visible inside the spotlight (bright), everything else is dimmed. Optional: add a rounded border around target, glow effect, or pulse animation to draw attention.</p>
        <p>If target element is off-screen, auto-scroll to it. Detect scroll position, smoothly scroll target into view, then show spotlight. Use getBoundingClientRect() to find element position, adjust spotlight accordingly.</p>
        <p>Z-index management: ensure overlay and spotlight are above all app content (z-index: 10000+).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Tooltip and Callout Positioning</h3>
        <p>Near the spotlighted element, show a tooltip with title, description, and buttons. Position tooltip relative to target: if target is near top of screen, position tooltip below. If target is near bottom, position above. If left side, position right. Calculate available space, auto-adjust. Include a small arrow pointing to the target element for clarity.</p>
        <p>Tooltip content: title (bold), description (normal text), and buttons (Next, Previous, Skip). Include step counter: "Step 2 of 7". For mobile, increase button size for touch targets (minimum 44x44 px).</p>
        <p>Animations: fade in tooltip smoothly (0.3s ease-in), fade out when transitioning to next step. Avoid jarring appearance.</p>
        <HighlightBlock as="p" tier="important"><strong>Smart Tooltip Positioning Algorithm:</strong> Computing tooltip position needs to be robust to edge cases and to layout shifts. A practical approach is: measure the target element and the tooltip size, pick a primary placement (typically below or to the right), and then validate whether that placement fits within the viewport. If it would overflow, fall back to the next best placement (above, left, or centered). Finally, clamp the tooltip position so it stays on-screen even if it must slightly overlap the spotlight. To avoid jitter, compute the position once per step transition and keep it stable while the step is active; only recompute when the viewport changes meaningfully (resize, orientation change) or when the target element moves.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Responsive Design for Mobile and Tablet:</strong> On small screens, the limiting factor is not just width but also vertical space once the on-screen keyboard appears. Prefer a simplified layout: a larger centered tooltip, a bottom sheet style callout, or a full-screen step panel with clear actions. Keep touch targets large, reduce visual chrome, and ensure the spotlight is still perceivable without forcing the user to scroll. On tablets, the standard anchored tooltip usually works, but you should still re-run placement after rotation and when safe areas change. Treat orientation as a signal to prefer vertical placement in portrait and side placement in landscape, but always prioritize keeping the message and primary action visible without overlap.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">User Interaction and Step Navigation</h3>
        <p>Next button: advance to next step (or finish if last step). Previous button: go back (hidden on first step). Skip button: exit tour immediately, mark as skipped. Close X button: exit tour. Optional: clicking the highlighted target element automatically advances (useful for "click this button" steps).</p>
        <p>Step transitions: store current_step in state, update UI, scroll to new target if needed. Validate step: if target element doesn't exist (feature disabled), skip to next valid step.</p>
        <p>Closing tour: on exit, trigger callback (analytics event), save progress to backend, show optional message ("Great! You've completed the tour!").</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progress Persistence and Resumption</h3>
        <p>Store tour progress in the user profile, including the tour identifier, current step, completion state, and timestamps for when the tour started or was skipped. Save to the backend so it syncs across devices. On app load, check whether the user has an active tour. If not completed, resume from the last step; if completed, do not show again unless the user explicitly replays the tour.</p>
        <p>Don't restart from step 1 on every visit—frustrating for users. Remember progress, continue from where they left off.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Role-Based and Adaptive Tours</h3>
        <p>Different user roles see different tours. Admin sees "Manage permissions" step, regular user doesn't (step has condition: user_role === "admin"). Support staff might see advanced troubleshooting tour.</p>
        <p>Adaptive tours: show steps only if relevant. If feature is disabled (feature_flags), skip those steps. If user is on mobile, simplify or shorten tour.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Mobile and Responsive Design</h3>
        <p>On mobile, viewport is small. Reposition tooltip to fit screen (avoid being cut off). Use full-screen overlay if needed. Increase button sizes for touch (minimum 44x44 px). Test on both portrait and landscape orientations.</p>
        <p>On small screens, consider shortening tours or breaking them into multiple shorter tours (users won't sit through 15-step tour on phone).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Analytics and Optimization</h3>
        <p>Track tour effectiveness: log when user starts tour, completes step, exits. Calculate completion_rate (% completing all steps), drop_off_per_step (where users abandon), average_time_per_step. Identify which steps cause exits—those steps might be unclear or contain bugs.</p>
        <p>Use data to iterate: if step 5 has high drop-off, rewrite it or check if target element is missing. A/B test different tour content ("Click here to create" vs "Start by clicking..."). Monitor over time to ensure tours remain effective.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important"><strong>Mandatory vs Optional Tours:</strong> Mandatory tours (can't skip, must complete) guarantee visibility and learning but frustrate power users (high abandonment). Optional tours (skip anytime) respect user autonomy but many skip and miss crucial info. Compromise: make tours optional, but show prominent "Help" link so users can access later. Alternatively, make only the critical onboarding mandatory (3-5 steps), optional advanced tours can be skipped.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial"><strong>Tour Length vs Completion Rate:</strong> Long comprehensive tours (15 steps) cover everything but have low completion (users drop off mid-tour). Short focused tours (5-7 steps) have high completion but might miss details. Solution: break into multiple shorter tours. First tour covers essentials (5 steps, high completion). Second tour covers advanced features (optional). Users complete the first, skip the second if not interested.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Pre-Built vs Contextual Tours:</strong> Pre-built tours explain features in a fixed order, independent of what user is doing. Contextual tours appear when user hovers over elements (more discoverable). Contextual tours have better UX but harder to implement. Compromise: use pre-built for onboarding, contextual tooltips for advanced features.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Tour Library vs Custom Implementation:</strong> Libraries (Joyride, Shepherd) are battle-tested, handle edge cases, mobile support. Custom is lightweight, fully customizable. For most apps, library is better (less development). Custom for complex scenarios (animated tours, embedded videos).</HighlightBlock>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Multi-Step Sequential Tour</h3>
        <HighlightBlock as="p" tier="crucial">Define 5-7 critical steps. Show step 1 immediately after signup. User navigates forward with Next button. Steps have progress counter ("Step 1 of 5"). Include optional Skip button to exit anytime. Resume from last step on revisit.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Role-Based Tour Variants</h3>
        <HighlightBlock as="p" tier="important">Create separate tour configs for each role (admin, editor, viewer). Load appropriate tour based on user role. Admin sees permissions step, editor doesn't. Allows targeted onboarding.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Contextual Help with Spotlight</h3>
        <HighlightBlock as="p" tier="important">Show interactive spotlight highlighting a UI element. Tooltip explains what it does. User can click element or Next button to advance. Spotlight moves with user as they scroll. Good for "learning by doing."</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 4: Feature Announcement Tours</h3>
        <HighlightBlock as="p" tier="important">When new feature launches, show optional tour announcing it. Different from onboarding (shorter, 2-3 steps). User can dismiss or complete. Track if user saw announcement (analytics).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 5: Analytics-Driven Tour Optimization</h3>
        <HighlightBlock as="p" tier="important">Track completion rate per step. If step 4 has 50% drop-off, rewrite or check element exists. A/B test different wording. Monitor over time, iterate.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Real-world systems (Slack, Figma, Notion) use tour libraries, track completion metrics, and iterate based on user behavior. For best results, keep initial onboarding</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">short (5-7 critical steps), allow skip (respect user autonomy), provide replay option, track analytics (identify where users drop off), A/B test content, and supplement with contextual help (tooltips on UI elements). Well-designed onboarding significantly improves user activation, reduces support tickets, and improves retention.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}

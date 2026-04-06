"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-avatar-component",
  title: "Design an Avatar Component",
  description:
    "Complete LLD solution for a production-grade avatar component with fallback handling, initials generation, lazy image loading, status indicators, grouped avatar stacks, and full accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "avatar-component",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "avatar",
    "fallback-handling",
    "lazy-loading",
    "initials-generation",
    "accessibility",
    "state-management",
    "image-optimization",
  ],
  relatedTopics: [
    "image-gallery-lightbox",
    "loading-skeleton",
    "theme-theming-system",
    "component-libraries-and-design-systems",
  ],
};

export default function AvatarComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable Avatar component for a large-scale React
          application. The avatar represents a user visually — typically as a profile
          photograph — and must gracefully handle scenarios where the image is
          unavailable, slow to load, or entirely absent. The component must support a
          deterministic fallback chain: attempt to load the image first, fall back to
          displaying the user&apos;s initials (derived from their name) if the image
          fails, and finally render a generic user icon if no name is available. The
          avatar must support multiple sizes, shapes, and an optional status indicator
          (online, offline, away, busy) rendered as a colored dot at the bottom-right
          edge. Image loading must be lazy — images should only begin downloading when
          the avatar enters or approaches the viewport — to avoid wasting bandwidth on
          off-screen avatars in large lists or grids. The component must also support
          grouped rendering (avatar stacks with overlap and an &ldquo;+N more&rdquo;
          overflow badge) and meet accessibility requirements including screen-reader
          announcements and keyboard navigation.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Avatars appear in many contexts: user profiles, comment threads, team
            directories, chat messages, and notification panels.
          </li>
          <li>
            A single page may render hundreds of avatars (e.g., a team directory or
            participant list), making lazy loading and performance critical.
          </li>
          <li>
            Image URLs may become stale (user deletes their photo, CDN link expires),
            requiring reliable error detection and fallback.
          </li>
          <li>
            The component must support international names, including CJK (Chinese,
            Japanese, Korean) characters and emoji.
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
          <li>
            Grouped avatars (stacks) show a maximum of 4 visible avatars with an
            overflow badge indicating the remainder.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Image Rendering:</strong> The avatar renders an <code>{"<img>"}</code>{" "}
            element with <code>src</code>, <code>alt</code>, and{" "}
            <code>loading=&quot;lazy&quot;</code> attributes.
          </li>
          <li>
            <strong>Fallback Chain:</strong> If the image fails to load, the component
            falls back to displaying the user&apos;s initials. If no name is provided, it
            falls back to a generic user icon SVG.
          </li>
          <li>
            <strong>Initials Generation:</strong> Extract the first letter of each word
            in the name, uppercase them, and cap at 2 characters. Support CJK names by
            detecting individual characters (each CJK character is one logical unit).
          </li>
          <li>
            <strong>Sizes:</strong> Support five sizes: xs (24px), sm (32px), md (40px),
            lg (48px), xl (64px).
          </li>
          <li>
            <strong>Shapes:</strong> Support three shapes: circle (fully rounded),
            square (no border radius), and rounded-square (moderate border radius).
          </li>
          <li>
            <strong>Status Indicator:</strong> An optional colored dot at the bottom-right
            edge indicating user status: online (green), offline (gray), away (yellow),
            busy (red).
          </li>
          <li>
            <strong>Image Error Handling:</strong> On <code>onError</code>, swap to
            fallback. Support retry on hover (re-attempt image load when user hovers
            over the fallback).
          </li>
          <li>
            <strong>Grouped Avatars:</strong> Support an avatar stack component where
            avatars overlap via negative margin, with a &ldquo;+N more&rdquo; overflow
            badge.
          </li>
          <li>
            <strong>Accessibility:</strong> Each avatar has an <code>aria-label</code>{" "}
            with the person&apos;s name, <code>role=&quot;img&quot;</code>, and status
            announced to screen readers.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Lazy loading via IntersectionObserver ensures
            images only download when near the viewport. Initial render must be under 1ms
            per avatar.
          </li>
          <li>
            <strong>Scalability:</strong> The component must handle 500+ avatars on a
            single page without memory leaks or jank.
          </li>
          <li>
            <strong>Reliability:</strong> Image errors are tracked in a Zustand store with
            retry counts and cache status. Failed images are not re-attempted infinitely.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support via discriminated unions
            for size, shape, and status types.
          </li>
          <li>
            <strong>Caching:</strong> Browser-native caching is leveraged. The store tracks
            per-URL error state to avoid redundant network requests.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Empty name string: fallback to generic icon immediately, skip initials step.
          </li>
          <li>
            Single-word name (e.g., &ldquo;Madonna&rdquo;): extract first letter only.
          </li>
          <li>
            Name with leading/trailing whitespace: trim before processing.
          </li>
          <li>
            Emoji in name (e.g., &ldquo;John &#128512;&rdquo;): emoji may render as 2
            grapheme clusters; use proper grapheme-aware slicing.
          </li>
          <li>
            CJK name (e.g., &#29579;&#23567;&#26126;): each character is semantically
            meaningful; take first 2 characters directly.
          </li>
          <li>
            Image URL is empty string or undefined: skip image render entirely, go
            directly to initials fallback.
          </li>
          <li>
            Image loads successfully but is corrupted (zero dimensions): treat as error,
            trigger fallback.
          </li>
          <li>
            Avatar rendered inside a hidden container (e.g., unmounted tab):
            IntersectionObserver must handle disconnected elements gracefully.
          </li>
          <li>
            SSR rendering: IntersectionObserver is a browser API; initial render must
            show fallback or placeholder, hydrate lazy loading on mount.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>avatar image lifecycle</strong> from
          the <strong>avatar rendering</strong> using a composable component architecture
          and a lightweight Zustand store for error tracking. The main Avatar component
          composes sub-components: AvatarImage handles lazy loading and error detection,
          AvatarFallback renders initials or a generic icon, AvatarStatus renders the
          status indicator dot, and AvatarGroup manages stacked rendering with overlap.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Single monolithic component:</strong> Viable for simple use cases but
            becomes unmaintainable as features accumulate (lazy loading, retry logic,
            status indicators, grouping). Separation into focused sub-components enables
            independent testing and reuse.
          </li>
          <li>
            <strong>React Context for error tracking:</strong> Would require wrapping
            every avatar in a provider, adding overhead for a feature that is inherently
            global (error state is keyed by URL, not by component tree). Zustand provides
            a simpler global lookup without provider nesting.
          </li>
          <li>
            <strong>Native loading=&quot;lazy&quot; only:</strong> The browser&apos;s
            native lazy loading is convenient but uses a fixed threshold (typically 1250px
            from viewport). IntersectionObserver gives us precise control over the
            loading trigger distance and allows us to show a skeleton placeholder until
            the image loads.
          </li>
        </ul>
        <p>
          <strong>Why composition + Zustand is optimal:</strong> The compound component
          pattern (Avatar, Avatar.Image, Avatar.Fallback, Avatar.Status, Avatar.Group)
          provides a clean public API while keeping implementation details encapsulated.
          Zustand tracks image errors globally by URL, so if the same image URL is used
          across multiple avatars, the error state is shared and retry logic is
          coordinated. This pattern is used by production component libraries like
          Radix UI and Chakra UI.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Avatar Types &amp; Interfaces (<code>avatar-types.ts</code>)</h4>
          <p>
            Defines the type system for the entire component. The <code>AvatarSize</code>{" "}
            union (<code>xs | sm | md | lg | xl</code>), <code>AvatarShape</code> union
            (<code>circle | square | rounded-square</code>), <code>UserStatus</code> union
            (<code>online | offline | away | busy</code>), and the <code>AvatarProps</code>{" "}
            interface combining src, alt, name, size, shape, status, and callbacks. See
            the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Initials Generator (<code>initials-generator.ts</code>)</h4>
          <p>
            Pure utility function that takes a name string and returns initials. Handles
            edge cases: empty strings (returns null), single-word names (first letter),
            multi-word names (first letter of first and last word), CJK characters (each
            character is one unit, take first 2), emoji (grapheme-aware slicing via
            <code>Intl.Segmenter</code>), and names with excessive whitespace. Output is
            always uppercase, maximum 2 characters.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Avatar Store (<code>avatar-store.ts</code>)</h4>
          <p>
            Zustand store tracking image error state per URL. State shape includes a Map
            of <code>src</code> to <code>ErrorEntry</code> objects, where each entry holds
            <code>errorCount</code>, <code>lastErrorAt</code>, and <code>cacheStatus</code>{" "}
            (<code>pending | loaded | error | retrying</code>). Exposes actions:
            <code>markError(src)</code>, <code>markLoaded(src)</code>,{" "}
            <code>requestRetry(src)</code>, <code>clearCache()</code>. Maximum retry
            count is 3 to prevent infinite loops on permanently broken URLs.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. useAvatarImage Hook (<code>use-avatar-image.ts</code>)</h4>
          <p>
            Custom hook encapsulating the image loading lifecycle. Uses IntersectionObserver
            to detect when the avatar enters the viewport (with a 50px rootMargin for
            preloading). Integrates with the avatar store for error tracking and retry
            logic. Returns <code>isInView</code>, <code>isLoading</code>,{" "}
            <code>hasError</code>, and <code>retry()</code>. Cleans up the observer on
            unmount.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useAvatarStatus Hook (<code>use-avatar-status.ts</code>)</h4>
          <p>
            Maps <code>UserStatus</code> values to color tokens (green, gray, yellow, red)
            and generates accessibility labels (e.g., &ldquo;John Doe — online&rdquo;).
            Returns the color class, the ARIA label suffix, and a <code>title</code> for
            tooltip text.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Avatar Component (<code>avatar.tsx</code>)</h4>
          <p>
            Main component composing the fallback chain. Renders AvatarImage as the
            primary content; on error, renders AvatarFallback. Computes size and shape
            classes from props. Applies <code>role=&quot;img&quot;</code> and{" "}
            <code>aria-label</code>. Optionally renders AvatarStatus as a child. Uses the
            compound component pattern: <code>Avatar.Image</code>,{" "}
            <code>Avatar.Fallback</code>, <code>Avatar.Status</code>,{" "}
            <code>Avatar.Group</code>.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. AvatarGroup Component (<code>avatar-group.tsx</code>)</h4>
          <p>
            Renders an array of avatar children with negative horizontal margin for overlap
            effect. Caps visible children at 4, renders an overflow badge
            (&ldquo;+N more&rdquo;) for the remainder. The badge inherits the avatar size
            for proportional scaling. Supports <code>max</code> prop to configure the
            visible limit.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth for image error state. It is
          keyed by image URL, not by component instance, so if the same URL appears in
          multiple avatars, the error state is shared. This prevents redundant retry
          attempts and ensures consistent behavior across the application. The store
          also exposes a <code>cacheStatus</code> field that the image hook reads to
          decide whether to attempt a load (skip if already cached as error with max
          retries reached).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Parent renders <code>{"<Avatar src=\"...\" name=\"John Doe\" />"}</code>.
          </li>
          <li>
            Avatar component calls <code>useAvatarImage(src)</code> hook.
          </li>
          <li>
            Hook sets up IntersectionObserver. Initially <code>isInView</code> is false.
          </li>
          <li>
            Avatar renders a skeleton placeholder (matching the target size and shape).
          </li>
          <li>
            User scrolls avatar into viewport. IntersectionObserver fires, sets{" "}
            <code>isInView</code> to true.
          </li>
          <li>
            Hook checks avatar store for this URL. If <code>cacheStatus === loaded</code>,
            renders <code>{"<img>"}</code> immediately. If <code>error</code> with max
            retries, renders fallback directly. Otherwise, attempts image load.
          </li>
          <li>
            On successful load: store calls <code>markLoaded(src)</code>, image renders.
          </li>
          <li>
            On error: store calls <code>markError(src)</code>, component renders
            AvatarFallback (initials or icon).
          </li>
          <li>
            User hovers over fallback: <code>retry()</code> is called, store sets{" "}
            <code>cacheStatus = retrying</code>, image load is re-attempted.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional pattern. Image state mutations
          flow through the Zustand store, and rendering flows from hook subscriptions
          to store state. The IntersectionObserver acts as the trigger for lazy loading,
          and the <code>onError</code> event on the <code>{"<img>"}</code> element
          drives the fallback transition.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Fallback Chain Execution</h3>
        <ol className="space-y-3 list-decimal list-inside">
          <li>
            <strong>Attempt image:</strong> If <code>src</code> is provided and store
            does not block loading, render <code>{"<img>"}</code> with
            <code>onError</code> handler.
          </li>
          <li>
            <strong>On error:</strong> <code>onError</code> fires, store records error
            with incremented <code>errorCount</code>, component re-renders showing
            AvatarFallback.
          </li>
          <li>
            <strong>Compute initials:</strong> Fallback calls{" "}
            <code>generateInitials(name)</code>. If name exists and yields initials,
            render initials in a colored container. If no name, render generic user icon
            SVG.
          </li>
          <li>
            <strong>Retry on hover:</strong> If user hovers over the fallback and
            <code>errorCount &lt; maxRetries</code>, call <code>retry()</code>, which
            resets <code>cacheStatus</code> to <code>pending</code> and re-attempts the
            image load.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Empty src:</strong> Skip image rendering entirely, go directly to
            initials or icon fallback. No network request is made.
          </li>
          <li>
            <strong>Image corrupted (zero dimensions):</strong> Add an <code>onLoad</code>{" "}
            handler that checks <code>event.currentTarget.naturalWidth</code>. If zero,
            treat as error and call the same <code>onError</code> handler.
          </li>
          <li>
            <strong>Avatar unmounts while loading:</strong> The IntersectionObserver is
            disconnected on unmount. The <code>onError</code> and <code>onLoad</code>{" "}
            callbacks are guarded by a <code>useRef</code> tracking mount status to
            prevent state updates on unmounted components.
          </li>
          <li>
            <strong>SSR hydration:</strong> During SSR, <code>isInView</code> defaults to
            false. The skeleton placeholder renders. On client hydration, the
            IntersectionObserver is set up in <code>useEffect</code>. No hydration
            mismatch occurs because the initial render is identical on server and client.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 10 files:
            TypeScript interfaces, initials generator with CJK and emoji support, Zustand
            store for error tracking, two custom hooks (image loading and status), four
            UI components (avatar, image, fallback, status, group), and a full
            EXPLANATION.md walkthrough. Click the <strong>Example</strong> toggle at the
            top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Avatar Types (avatar-types.ts)</h3>
        <p>
          Defines <code>AvatarSize</code> as a union of five literal types mapped to pixel
          values via a constant record. <code>AvatarShape</code> maps to Tailwind border-radius
          classes. <code>UserStatus</code> maps to semantic color tokens. The{" "}
          <code>AvatarProps</code> interface combines all options with sensible defaults
          (size: md, shape: circle, no status). See the Example tab for complete definitions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Initials Generator (initials-generator.ts)</h3>
        <p>
          Pure function <code>generateInitials(name: string): string | null</code>. Trims
          input, splits on whitespace, takes first character of first and last word,
          uppercases, and caps at 2 characters. Uses <code>Intl.Segmenter</code> for
          grapheme-aware slicing to handle emoji correctly. Detects CJK characters via
          Unicode range check (<code>{"\u4E00-\u9FFF"}</code>) and handles them as
          single-character units. Returns null for empty or whitespace-only input.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Avatar Store (avatar-store.ts)</h3>
        <p>
          Zustand store with state: <code>Map&lt;string, ErrorEntry&gt;</code> keyed by
          image URL. Actions: <code>markError(src)</code> increments error count and sets
          timestamp, <code>markLoaded(src)</code> sets cache status to loaded,
          <code>requestRetry(src)</code> sets status to retrying if error count is below
          max (3), <code>clearCache()</code> resets the entire map. The store uses
          <code>persist: false</code> — error state is session-scoped and does not survive
          page refreshes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: useAvatarImage Hook (use-avatar-image.ts)</h3>
        <p>
            Custom hook accepting <code>src</code> and optional <code>onError</code> callback.
            Creates an IntersectionObserver with <code>rootMargin: &apos;50px&apos;</code> to
            trigger loading when the avatar is within 50px of the viewport. Returns
            <code>isInView</code>, <code>isLoading</code>, <code>hasError</code>, and a
            <code>retry</code> function. On unmount, disconnects the observer and guards
            against state updates via a mounted ref.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useAvatarStatus Hook (use-avatar-status.ts)</h3>
        <p>
            Maps <code>UserStatus</code> to Tailwind color classes (bg-green-500 for online,
            bg-gray-400 for offline, bg-yellow-400 for away, bg-red-500 for busy). Generates
            accessibility labels (&ldquo;— online&rdquo;, &ldquo;— offline&rdquo;, etc.) and
            tooltip titles (&ldquo;Currently online&rdquo;, &ldquo;Last seen 5 minutes ago&rdquo;).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Avatar Component (avatar.tsx)</h3>
        <p>
            Main component that composes the fallback chain. Computes container classes from
            size and shape props. Renders AvatarImage when src is provided and not in error
            state; otherwise renders AvatarFallback. Applies <code>role=&quot;img&quot;</code>,
            <code>aria-label</code> (including status suffix), and <code>title</code> for
            tooltip. Attaches sub-components as static properties for the compound component API.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: AvatarFallback Component (avatar-fallback.tsx)</h3>
        <p>
            Renders either initials or a generic user icon SVG. Initials are displayed in a
            colored container with background color derived from a hash of the name string
            (ensuring consistent color for the same name). The hash function uses a simple
            DJB2 algorithm modulo a palette of 20 accessible color pairs (background + text
            color). The generic icon SVG is a simple silhouette matching the avatar shape.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: AvatarGroup Component (avatar-group.tsx)</h3>
        <p>
            Renders <code>React.Children.toArray(children)</code> with negative horizontal
            margin (<code>-ml-2</code>) for overlap. Caps at <code>max</code> visible (default:
            4). Renders an overflow badge with <code>+N more</code> text, styled to match the
            avatar size. The badge uses the same container classes as avatars for visual
            consistency.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">generateInitials</td>
                <td className="p-2">O(n) — string scan</td>
                <td className="p-2">O(1) — max 2 chars</td>
              </tr>
              <tr>
                <td className="p-2">Avatar render</td>
                <td className="p-2">O(1) — fixed DOM nodes</td>
                <td className="p-2">O(1) — no per-instance state</td>
              </tr>
              <tr>
                <td className="p-2">IntersectionObserver setup</td>
                <td className="p-2">O(1) — single observer</td>
                <td className="p-2">O(1) — per component</td>
              </tr>
              <tr>
                <td className="p-2">Store lookup (by URL)</td>
                <td className="p-2">O(1) — Map get</td>
                <td className="p-2">O(u) — u unique URLs</td>
              </tr>
              <tr>
                <td className="p-2">AvatarGroup render</td>
                <td className="p-2">O(min(n, max))</td>
                <td className="p-2">O(max) — capped children</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of avatars in the group, <code>max</code> is
          the visible limit (default 4), and <code>u</code> is the number of unique image
          URLs tracked. For 500 avatars on a page, each avatar performs O(1) work, and the
          IntersectionObserver triggers lazily as the user scrolls.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>IntersectionObserver per instance:</strong> Each avatar creates its own
            observer. For 500+ avatars, this creates 500 observer instances. Mitigation:
            share a single IntersectionObserver across all avatar instances using a module-level
            singleton pattern with a Set of callbacks. This reduces observer overhead from
            O(n) to O(1).
          </li>
          <li>
            <strong>Hash-based color derivation:</strong> The DJB2 hash runs on every render
            for initials fallback. Mitigation: memoize the color computation with{" "}
            <code>useMemo</code> keyed by name. Since the hash is deterministic, the same
            name always yields the same color without re-computation.
          </li>
          <li>
            <strong>Re-render cascades on store updates:</strong> When the avatar store
            updates (e.g., marking an image as errored), all components subscribed to that
            URL re-render. Mitigation: use Zustand selectors to subscribe only to the
            specific URL entry, so unrelated avatars are unaffected.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Shared IntersectionObserver:</strong> Create a module-level observer
            singleton. Each avatar registers its element and callback via a{" "}
            <code>useEffect</code>. The observer fires once per intersection event and
            dispatches to the appropriate callback via a Map. This avoids creating N
            observers for N avatars.
          </li>
          <li>
            <strong>object-fit: cover:</strong> Apply <code>object-fit: cover</code> to
            the <code>{"<img>"}</code> element to ensure the image fills the avatar
            container while maintaining aspect ratio. This prevents layout shifts from
            images with unexpected dimensions.
          </li>
          <li>
            <strong>Browser-native lazy loading:</strong> In addition to
            IntersectionObserver, set <code>loading=&quot;lazy&quot;</code> on the{" "}
            <code>{"<img>"}</code> element for browsers that support it. This provides a
            second layer of lazy loading for browsers without IntersectionObserver support.
          </li>
          <li>
            <strong>Skeleton placeholder:</strong> Render a skeleton div with the exact
            target dimensions before the image loads. This prevents layout shift (CLS) and
            provides visual feedback during the loading phase.
          </li>
          <li>
            <strong>Batch rapid loads:</strong> If many avatars enter the viewport
            simultaneously (e.g., scrolling quickly through a list), batch the image
            requests using <code>requestIdleCallback</code> to avoid saturating the network
            with concurrent image downloads.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Image URL Validation</h3>
        <p>
          Avatar image URLs may come from user-provided data (e.g., profile photo URLs
          uploaded by users). If the URL is not validated, it could be a malicious
          endpoint (e.g., <code>javascript:alert(1)</code> or a data URI containing
          script content). Always validate that the URL uses <code>https://</code> or
          a whitelisted CDN domain. Reject <code>javascript:</code>, <code>data:</code>,
          and <code>blob:</code> URLs at the prop validation level. The{" "}
          <code>{"<img>"}</code> element does not execute scripts, but data URIs can
          contain SVG with embedded scripts, which some browsers may execute.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Content Security Policy</h3>
        <p>
          Ensure the application&apos;s Content Security Policy (CSP) includes the
          avatar image CDN in the <code>img-src</code> directive. If avatars are loaded
          from external CDNs (e.g., Gravatar, Cloudinary), those domains must be
          explicitly whitelisted. A restrictive CSP without the CDN in <code>img-src</code>{" "}
          will block all avatar images silently, causing every avatar to fall back to
          initials — a subtle but impactful failure mode.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              Each avatar has <code>role=&quot;img&quot;</code> and an{" "}
              <code>aria-label</code> containing the person&apos;s name (e.g.,{" "}
              <code>aria-label=&quot;John Doe&quot;</code>).
            </li>
            <li>
              When a status indicator is present, the status is appended to the aria-label
              (e.g., <code>aria-label=&quot;John Doe, online&quot;</code>).
            </li>
            <li>
              For fallback initials, the aria-label still uses the full name — screen
              readers should announce the person&apos;s name, not their initials.
            </li>
            <li>
              The generic user icon fallback has <code>aria-label=&quot;Anonymous user&quot;</code>
              to indicate that no identifying information is available.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Avatars are not interactive by default (they are presentational). If the
              avatar is used as a clickable element (e.g., navigating to a profile), wrap
              it in a <code>{"<button>"}</code> or <code>{"<a>"}</code> element with an
              appropriate <code>aria-label</code>.
            </li>
            <li>
              The retry-on-hover feature does not require keyboard support since it is a
              convenience feature, not core functionality. However, adding a visible retry
              button on the fallback (shown on focus) would improve keyboard accessibility.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate-limited retries:</strong> Cap image retry attempts at 3 per URL
            per session. This prevents a broken URL from triggering infinite network
            requests if the user repeatedly hovers over the fallback.
          </li>
          <li>
            <strong>URL sanitization:</strong> Trim and validate the <code>src</code>{" "}
            prop before passing it to the <code>{"<img>"}</code> element. Strip leading
            and trailing whitespace, reject empty strings.
          </li>
          <li>
            <strong>Name sanitization:</strong> Trim the <code>name</code> prop before
            generating initials. Remove control characters (ASCII 0-31) that could cause
            rendering issues or be used for injection attacks.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Initials generator:</strong> Test with various inputs: &ldquo;John
            Doe&rdquo; yields &ldquo;JD&rdquo;, &ldquo;Madonna&rdquo; yields &ldquo;M&rdquo;,
            &ldquo; &#29579;&#23567;&#26126; &rdquo; (CJK) yields the first 2 characters,
            &ldquo;&rdquo; (empty) yields null, &ldquo;John &#128512; Doe&rdquo; handles
            emoji via grapheme-aware slicing, &ldquo;   &rdquo; (whitespace only) yields
            null.
          </li>
          <li>
            <strong>Avatar store:</strong> Test markError increments error count,
            markLoaded sets cache status to loaded, requestRetry increments retry count
            if below max, requestRetry returns false if at max retries, clearCache
            empties the map.
          </li>
          <li>
            <strong>Status hook:</strong> Test each UserStatus maps to the correct color
            class and accessibility label. Test undefined status returns defaults.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Fallback chain:</strong> Render Avatar with a broken src URL. Assert
            that the initials fallback renders with the correct text. Assert that
            <code>aria-label</code> contains the full name.
          </li>
          <li>
            <strong>Lazy loading:</strong> Render Avatar off-screen. Assert that no{" "}
            <code>{"<img>"}</code> element is in the DOM (skeleton renders instead).
            Scroll avatar into view (using <code>scrollIntoView()</code> in the test),
            assert that <code>{"<img>"}</code> renders with the correct src.
          </li>
          <li>
            <strong>Retry on hover:</strong> Render Avatar with broken src, wait for error.
            Fire mouseEnter on the fallback, assert that retry is attempted. If the mock
            server returns success on retry, assert that the image renders.
          </li>
          <li>
            <strong>AvatarGroup:</strong> Render AvatarGroup with 6 children and{" "}
            <code>max={4}</code>. Assert that 4 avatars render and the overflow badge
            shows &ldquo;+2 more&rdquo;.
          </li>
          <li>
            <strong>Status indicator:</strong> Render Avatar with status=&quot;online&quot;.
            Assert that a green dot renders at the bottom-right position. Assert that
            <code>aria-label</code> includes &ldquo;online&rdquo;.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify Avatar renders a skeleton placeholder during SSR and
            hydrates correctly on the client without mismatches.
          </li>
          <li>
            Avatar with empty name and empty src: verify generic user icon SVG renders
            with <code>aria-label=&quot;Anonymous user&quot;</code>.
          </li>
          <li>
            Avatar with src pointing to a non-image URL (e.g., HTML page): verify the
            <code>onError</code> handler fires and fallback renders.
          </li>
          <li>
            500 avatars on a page: verify no memory leaks after scrolling through all of
            them, all IntersectionObservers are cleaned up on unmount, and the store size
            does not exceed the number of unique URLs.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered avatars, verify
            <code>role=&quot;img&quot;</code>, <code>aria-label</code> presence, and that
            initials are not announced (the full name should be announced instead).
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>No fallback chain:</strong> Candidates often render the image and leave
            it broken if it fails to load. Interviewers expect candidates to implement at
            least a two-tier fallback (image → initials or icon). A production avatar must
            never show a broken image icon.
          </li>
          <li>
            <strong>Lazy loading only with native attribute:</strong> Setting{" "}
            <code>loading=&quot;lazy&quot;</code> is a good start but insufficient for
            large lists. Native lazy loading uses a fixed threshold and does not provide a
            hook for showing a skeleton. Interviewers expect candidates to discuss
            IntersectionObserver for precise control and skeleton placeholders.
          </li>
          <li>
            <strong>Naive initials extraction:</strong> Simply splitting on space and
            taking the first two characters breaks for CJK names, emoji, and names with
            irregular spacing. Interviewers look for candidates who discuss Unicode
            handling, <code>Intl.Segmenter</code>, and grapheme clusters.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Rendering an avatar without{" "}
            <code>aria-label</code> or <code>role=&quot;img&quot;</code> means screen
            readers either skip it or announce the image filename (which is meaningless).
            This is a critical oversight.
          </li>
          <li>
            <strong>No error retry limit:</strong> Re-attempting image load infinitely on
            hover creates a network storm if the URL is permanently broken. Interviewers
            expect candidates to discuss retry limits and circuit-breaker patterns.
          </li>
          <li>
            <strong>Not handling object-fit:</strong> Without <code>object-fit: cover</code>,
            images with unexpected aspect ratios stretch or distort within the avatar
            container. This is a common production bug that candidates often overlook.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">IntersectionObserver vs Native Lazy Loading</h4>
          <p>
            Native <code>loading=&quot;lazy&quot;</code> is zero-effort and works in all
            modern browsers. However, it uses a browser-controlled threshold (typically
            1250px from viewport) that cannot be tuned. IntersectionObserver allows precise
            control via <code>rootMargin</code> (e.g., 50px for aggressive preloading or
            200px for conservative loading on slow networks). IntersectionObserver also
            enables skeleton placeholders that match the final size, preventing layout
            shift. For small lists (under 50 avatars), native lazy loading is sufficient.
            For large lists or infinite scroll, IntersectionObserver is the right choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Hash-Based Color vs Pre-Assigned Colors</h4>
          <p>
            Hash-based color derivation (DJB2 modulo a palette) ensures that the same name
            always produces the same color, creating a consistent visual identity. The
            trade-off is computational cost (hash on every render) and the possibility of
            collisions (two different names producing the same color). Pre-assigned colors
            (e.g., from a user&apos;s profile settings) are more accurate but require
            server-side storage and an additional API call. For most applications, hash-based
            colors are a good default with the option to override via a <code>color</code>{" "}
            prop.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Zustand Store vs Local State for Error Tracking</h4>
          <p>
            Local state (useState per avatar) is simpler but means each avatar independently
            tracks its own error state. If the same URL appears in 10 avatars and fails, all
            10 independently retry on hover, creating 10 redundant network requests. A
            global store keyed by URL deduplicates error state: if one avatar marks a URL
            as errored, all avatars using that URL know about it. The trade-off is the
            added complexity of an external store for what seems like a simple feature. For
            small applications, local state is acceptable; for large-scale applications with
            repeated URLs, a global store is justified.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle avatar images that take a long time to load (slow
              network)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a loading skeleton with a shimmer animation that matches the avatar&apos;s
              size and shape. Set a timeout (e.g., 2 seconds) after which, if the image
              has not loaded, show the initials fallback alongside the still-loading image.
              This gives the user a readable avatar immediately while the image loads in
              the background. When the image eventually loads, it replaces the initials.
              This approach balances perceived performance with visual completeness.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support custom shapes beyond circle, square, and rounded-square?
            </p>
            <p className="mt-2 text-sm">
              A: Accept a <code>className</code> prop on the Avatar component that merges
              with the computed shape classes. This allows consumers to override the shape
              entirely (e.g., a hexagon via <code>clip-path</code>). The compound component
              pattern also allows consumers to replace the container entirely while keeping
              the fallback chain logic. Alternatively, accept a <code>borderRadius</code>{" "}
              prop as a CSS value string for fine-grained control.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement avatar caching to reduce network requests?
            </p>
            <p className="mt-2 text-sm">
              A: Use the Cache API (or IndexedDB) to store successfully loaded images as
              blob entries keyed by URL. On subsequent requests for the same URL, check the
              cache first. If found, create an object URL from the cached blob and use it as
              the <code>src</code>. If not found, fetch the image, store it in the cache,
              and render. This is especially effective for avatars that appear across
              multiple routes or sessions. The cache can have a TTL (e.g., 24 hours) after
              which entries are invalidated and re-fetched.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle avatars in a virtualized list (e.g., 10,000 users)?
            </p>
            <p className="mt-2 text-sm">
              A: Virtualization (via react-window or tanstack-virtual) ensures only the
              visible avatars are rendered in the DOM. The IntersectionObserver is still
              useful for preloading avatars that are about to enter the viewport. The key
              optimization is to unmount avatars that scroll out of view — their
              IntersectionObserver is disconnected, and their store entry can be garbage-collected
              if the URL is not used by any other mounted avatar. For 10,000 users with a
              virtualized window of 20, only 20 IntersectionObservers are active at any time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add animation to the fallback transition (image → initials)?
            </p>
            <p className="mt-2 text-sm">
              A: Use CSS transitions on opacity. When the image errors, fade it out over
              150ms while simultaneously fading in the initials fallback. Use{" "}
              <code>will-change: opacity</code> to promote both elements to their own
              compositor layers. Alternatively, use AnimatePresence from framer-motion for
              a more polished crossfade effect. The animation should be disabled if the
              user has <code>prefers-reduced-motion: reduce</code> set.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test avatar rendering with different image states in CI?
            </p>
            <p className="mt-2 text-sm">
              A: Use Playwright with a mock server that returns different responses based
              on the URL. Configure routes: a URL ending in &ldquo;/success&rdquo; returns
              a valid image, &ldquo;/error&rdquo; returns a 404, &ldquo;/slow&rdquo; delays
              for 5 seconds. Render avatars with each URL and assert the correct visual
              state (image renders, initials show, or skeleton persists). For visual
              regression testing, use Percy or Chromatic to capture pixel-perfect snapshots
              of each state.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Authoring Practices — Accessible Component Patterns
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Lazy Loading Images and Content
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://radix-ui.com/themes/docs/components/avatar"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI — Avatar Component Reference Implementation
            </a>
          </li>
          <li>
            <a
              href="https://ui.shadcn.com/docs/components/avatar"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              shadcn/ui — Avatar Component
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intl.Segmenter for Grapheme-Aware String Slicing
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/cls"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Cumulative Layout Shift (CLS) and Prevention Strategies
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

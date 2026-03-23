"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-dark-mode-implementation-extensive",
  title: "Dark Mode Implementation",
  description:
    "Staff-level deep dive into dark mode theming architecture, design token systems, color contrast compliance, theme switching strategies, persistence patterns, and systematic approaches to building accessible multi-theme interfaces.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "dark-mode-implementation",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "dark mode",
    "theming",
    "design tokens",
    "accessibility",
    "color systems",
  ],
  relatedTopics: [
    "accessibility",
    "design-systems",
    "performance-optimization",
    "css-custom-properties",
  ],
};

export default function DarkModeImplementationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Dark mode</strong> is an alternative color scheme that uses light-colored text, icons, and UI elements on dark backgrounds, inverting the traditional light-on-white design. Beyond aesthetic preference, dark mode serves functional purposes: reducing eye strain in low-light environments, decreasing power consumption on OLED and AMOLED screens (where dark pixels are literally turned off), improving readability for users with certain visual impairments, and respecting user system preferences through the <code>prefers-color-scheme</code> media query. Dark mode has evolved from a niche feature requested by developers to a mainstream expectation — major operating systems, browsers, and applications universally support it, and users increasingly expect every web application to offer a dark variant.
        </p>
        <p>
          Implementing dark mode correctly is significantly more complex than swapping background and text colors. Colors that work well in light mode rarely translate directly to dark mode — pure white text on a pure black background creates excessive contrast that causes halation (a glowing halo effect around text), dark surfaces need subtle elevation differentiation rather than shadows (which are invisible against dark backgrounds), semantic colors like red for errors and green for success need to be adjusted for legibility on dark backgrounds, and images, icons, and illustrations designed for light backgrounds may become illegible or visually harsh against dark surfaces. A proper dark mode implementation requires a comprehensive design token system that maps semantic color intentions to specific color values for each theme.
        </p>
        <p>
          At the staff and principal engineer level, dark mode is a design system architecture challenge. The theming infrastructure must support multiple color modes (at minimum light and dark, potentially high-contrast variants), switch themes without page reload or visible flash, persist the user&apos;s preference across sessions and devices, respect the operating system&apos;s preference while allowing user override, and work correctly with server-side rendering where the server does not know the user&apos;s preference before the first render. The token system must be organized at the semantic level (background-primary, text-secondary, border-subtle) rather than the literal level (white, gray-800, gray-200) so that tokens map naturally to different themes. And the implementation must handle third-party content (embedded iframes, user-generated content, ads) that may not support dark mode.
        </p>
        <p>
          The CSS architecture for dark mode centers on CSS custom properties (variables) that define color values at the document root and are overridden based on the active theme. The <code>prefers-color-scheme</code> media query enables automatic theme matching with the operating system, while a class-based toggle (typically <code>.dark</code> on the root element) enables user-driven theme switching. The combination of media query and class provides a three-state model: system preference (auto), explicit light, and explicit dark. Modern CSS frameworks like Tailwind CSS 4 provide built-in dark mode support through variant prefixes, and design token tools like Style Dictionary can generate theme-specific CSS custom property sets from a single token definition.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Design Tokens:</strong> Named, platform-agnostic values that represent design decisions — colors, spacing, typography, elevation, opacity. For dark mode, tokens are defined at the semantic level (<code>--color-bg-primary</code>, <code>--color-text-secondary</code>, <code>--color-border-subtle</code>) and mapped to different literal values for each theme. This indirection allows the entire theme to change by swapping token values rather than modifying individual component styles.
          </li>
          <li>
            <strong>prefers-color-scheme Media Query:</strong> A CSS media query that detects the user&apos;s operating system-level color scheme preference (light or dark). It enables automatic theme matching without user interaction — the website responds to the system setting. This should be the default behavior, with the option for users to override it. The query can be detected in JavaScript via <code>window.matchMedia(&quot;(prefers-color-scheme: dark)&quot;)</code> and monitored for changes with the <code>change</code> event.
          </li>
          <li>
            <strong>Color Inversion vs Semantic Theming:</strong> Naive dark mode implementations simply invert light colors (white becomes black, light gray becomes dark gray), producing a technically functional but visually harsh result. Semantic theming instead defines each color intentionally for its context — dark mode backgrounds are typically dark gray (not pure black) to allow subtle elevation differentiation, text is off-white (not pure white) to reduce contrast harshness, and accent colors are adjusted for legibility on dark surfaces. The difference between inversion and semantic theming is the difference between a quick hack and a professional implementation.
          </li>
          <li>
            <strong>Elevated Surfaces:</strong> In dark mode, traditional shadow-based elevation (light surfaces casting shadows on lighter backgrounds) does not work because shadows are invisible on dark backgrounds. Instead, dark mode uses progressively lighter surface colors to indicate elevation — a card on a dark background is slightly lighter than the background, and a dropdown on top of the card is lighter still. Material Design codifies this with overlay opacity increasing from 0% (base surface) to 16% (maximum elevation) of a white overlay.
          </li>
          <li>
            <strong>Flash of Incorrect Theme (FOIT):</strong> A rendering artifact that occurs when the initial HTML renders in the default theme (usually light) before JavaScript executes to apply the user&apos;s preferred theme (dark), causing a visible flash. This is analogous to the flash of unstyled content and is especially noticeable in dark mode because the white-to-dark transition is visually jarring. Preventing FOIT requires applying the theme class before the first paint — typically through an inline script in the HTML head that reads the preference from localStorage or a cookie before CSS is evaluated.
          </li>
          <li>
            <strong>Color Contrast Compliance:</strong> Both light and dark themes must meet WCAG color contrast requirements — at minimum 4.5:1 for normal text (Level AA) and 3:1 for large text. Dark mode introduces unique contrast challenges: text that met contrast ratios on white backgrounds may not meet them on dark gray backgrounds, and saturated colors that looked fine on light backgrounds can appear to glow or vibrate on dark backgrounds. Each semantic color must be verified for contrast compliance in every theme variant.
          </li>
          <li>
            <strong>Theme Persistence:</strong> The mechanism for remembering the user&apos;s theme preference across sessions. Common approaches include localStorage (simplest, but not available during SSR), cookies (accessible during SSR for server-side theme rendering but limited by cookie size), or user profile settings (requires authentication, but works across devices). The persistence layer must handle the initial state on first visit (default to system preference), user explicit selection, and the transition when a user who previously selected a theme visits on a new device.
          </li>
          <li>
            <strong>Theme Transition Animation:</strong> The visual effect applied when switching between themes — either an instant swap or a smooth color transition. CSS transitions on custom properties enable smooth theme switching where all colors animate from their light values to their dark values over 150-300ms. However, transitioning all colors simultaneously can cause performance issues if many elements are affected. An alternative is to use a view transition or a crossfade overlay that masks the theme change behind a smooth animation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The first diagram illustrates the dark mode architecture with CSS custom properties. Design tokens are defined at the semantic level in a token definition file — background colors, text colors, border colors, accent colors, surface colors, and shadow definitions. A token compiler generates two CSS custom property sets: one for light mode (applied at <code>:root</code>) and one for dark mode (applied at <code>:root.dark</code> or via <code>@media (prefers-color-scheme: dark)</code>). Components reference tokens through their semantic names (<code>var(--color-bg-primary)</code>) without knowing which theme is active. Theme switching changes which CSS custom property set is applied, and all components update simultaneously without any component re-rendering.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/dark-mode-implementation-diagram-1.svg"
          alt="Dark mode token architecture showing semantic token definitions, CSS custom property generation for light and dark themes, and component consumption"
          width={900}
          height={500}
        />
        <p>
          The second diagram shows the theme initialization and switching flow. On page load, an inline script in the HTML head reads the user&apos;s theme preference from localStorage (or a cookie) before the first paint. If a preference exists, the corresponding class (<code>dark</code> or <code>light</code>) is applied to the root element immediately. If no preference exists, the system preference is detected via <code>prefers-color-scheme</code> and applied. This pre-paint initialization prevents the Flash of Incorrect Theme. When the user toggles the theme through the UI, the theme manager updates the root element class, persists the new preference to localStorage, and optionally syncs to the server for cross-device consistency. The theme manager also listens for system preference changes to update the theme when the user changes their OS setting, unless they have explicitly set a preference override.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/dark-mode-implementation-diagram-2.svg"
          alt="Theme initialization flow showing pre-paint preference detection, Flash of Incorrect Theme prevention, and theme toggle with persistence"
          width={900}
          height={500}
        />
        <p>
          The third diagram depicts the color system hierarchy for multi-theme support. At the foundation, primitive color scales define the raw color palette — gray scales from gray-50 to gray-950, primary brand colors, and semantic colors at various lightness levels. The semantic token layer maps intentions to primitives — <code>bg-primary</code> maps to <code>gray-50</code> in light mode and <code>gray-900</code> in dark mode, <code>text-primary</code> maps to <code>gray-900</code> in light mode and <code>gray-50</code> in dark mode. The component token layer maps component-specific needs to semantic tokens — <code>card-bg</code> maps to <code>bg-primary</code>, <code>card-border</code> maps to <code>border-subtle</code>. This three-layer hierarchy enables theme variants (light, dark, high-contrast dark) without changing component styles, and adding a new theme only requires mapping semantic tokens to different primitives.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/dark-mode-implementation-diagram-3.svg"
          alt="Color system hierarchy showing primitive scales, semantic token mapping for multiple themes, and component token consumption"
          width={900}
          height={500}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-2 text-left">Aspect</th>
              <th className="px-4 py-2 text-left">Advantages</th>
              <th className="px-4 py-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">CSS Custom Properties</td>
              <td className="px-4 py-2">Theme switching without re-render, excellent performance, standard CSS with no build tool dependency, supports runtime changes, cascading allows component-level overrides</td>
              <td className="px-4 py-2">Cannot be used in media queries, computed value has no fallback chain, IE11 incompatible (no longer relevant for most projects), debugging requires inspecting computed values</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">CSS Class Toggle (.dark)</td>
              <td className="px-4 py-2">Works with server-side rendering, class can be set before first paint, simple to understand, compatible with Tailwind dark: prefix, allows user override of system preference</td>
              <td className="px-4 py-2">Requires JavaScript for toggle, FOIT risk if script loads late, class must be on root element for utility-based frameworks, localStorage access needed for preference</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">prefers-color-scheme Media Query</td>
              <td className="px-4 py-2">Zero JavaScript needed, automatic OS matching, works before JavaScript loads (no FOIT for system preference), SEO-friendly, progressive enhancement</td>
              <td className="px-4 py-2">No user override without JavaScript, cannot detect in SSR, media query alone limits to binary light/dark, no persistence of user preference</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Server-Side Theme (Cookie)</td>
              <td className="px-4 py-2">Correct theme on first render (no FOIT), works with SSR frameworks, consistent across page loads without JavaScript, can personalize cached pages</td>
              <td className="px-4 py-2">Requires server infrastructure, cookies have size limits, complicates CDN caching (vary by cookie), first visit defaults to system preference without client detection</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">CSS Filter Inversion</td>
              <td className="px-4 py-2">Instant implementation with minimal code, works on any existing site without color redesign, no design token system needed</td>
              <td className="px-4 py-2">Inverts images and media (must re-invert them), produces unnatural color mappings, accessibility issues with color contrast, looks unprofessional, no semantic control</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use semantic design tokens, not literal color values.</strong> Define tokens by their purpose (<code>--color-bg-primary</code>, <code>--color-text-muted</code>, <code>--color-border-strong</code>) rather than their appearance (<code>--color-white</code>, <code>--color-gray-400</code>). Semantic tokens map naturally to different themes — <code>bg-primary</code> is white in light mode and dark gray in dark mode. Literal tokens like <code>--color-white</code> break the abstraction because white is not appropriate as a primary background in dark mode. Every color reference in component styles should use a semantic token.
          </li>
          <li>
            <strong>Prevent the Flash of Incorrect Theme with a blocking inline script.</strong> Place a small inline script in the HTML <code>&lt;head&gt;</code> before any stylesheets that reads the theme preference from localStorage and applies the theme class to the document element. This script must execute before the browser&apos;s first paint to prevent the jarring white-to-dark flash. Keep the script minimal (under 500 bytes) to avoid blocking render unnecessarily. The script should also detect the system preference as a fallback when no stored preference exists.
          </li>
          <li>
            <strong>Support three preference states: system, light, and dark.</strong> Rather than a binary toggle, offer three options: follow system preference (the default), force light mode, and force dark mode. The system preference option uses the <code>prefers-color-scheme</code> media query and responds to OS-level changes in real time. Explicit light and dark options override the system preference. Store the user&apos;s selection (system/light/dark) in localStorage, not the resolved theme value, so that &ldquo;system&rdquo; continues to respond to OS changes.
          </li>
          <li>
            <strong>Avoid pure black backgrounds and pure white text.</strong> Pure black (#000000) backgrounds with pure white (#FFFFFF) text create maximum contrast that causes halation — a glowing halo effect around text that strains the eyes. Use slightly off-black backgrounds (#121212 or #1a1a2e) and slightly off-white text (#e0e0e0 or #f0f0f0). This reduces contrast to approximately 15.3:1 (still well above WCAG requirements) while being significantly more comfortable for extended reading.
          </li>
          <li>
            <strong>Use surface elevation through lightness rather than shadows.</strong> In dark mode, shadows are invisible because the surrounding area is already dark. Instead, indicate elevation by making higher-elevation surfaces progressively lighter. A base surface might be #121212, a card on that surface might be #1e1e1e, and a dropdown on that card might be #2c2c2c. Material Design&apos;s dark theme uses white overlays at increasing opacity (5%, 7%, 8%, 9%, 11%, 12%, 14%, 15%, 16%) to create this elevation hierarchy.
          </li>
          <li>
            <strong>Verify color contrast compliance for both themes independently.</strong> Colors that meet WCAG contrast requirements on a white background may not meet them on a dark gray background, and vice versa. Audit every color combination — text on backgrounds, icons on surfaces, borders against adjacent fills — for both light and dark themes. Automated tools like axe-core can check contrast ratios, but they must be run in both theme states.
          </li>
          <li>
            <strong>Handle images, illustrations, and third-party content thoughtfully.</strong> Bright images on dark backgrounds can be visually jarring. Consider reducing image brightness slightly in dark mode (CSS <code>filter: brightness(0.9)</code>), providing dark-mode-specific versions of illustrations and logos, and using transparent PNGs or SVGs that adapt to the background color. For user-generated content and third-party embeds that do not support dark mode, consider a subtle container that provides a light background island to maintain readability.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Hardcoding color values in component styles.</strong> When component styles reference literal colors (<code>background: white</code>, <code>color: #333</code>) instead of design tokens, they do not respond to theme changes. Every component must use semantic token references (<code>var(--color-bg-primary)</code>) so that theme switching affects the entire application consistently. A single hardcoded color can create a visually broken element in the alternate theme.
          </li>
          <li>
            <strong>Not testing dark mode during development.</strong> Developers who work exclusively in light mode discover dark mode issues late — missing token references, invisible text, unreadable icons, harsh contrast. Integrate dark mode testing into the development workflow by running visual regression tests in both themes, including dark mode screenshots in design review, and encouraging developers to work in dark mode periodically. Storybook and similar tools can render components side-by-side in both themes.
          </li>
          <li>
            <strong>Using saturated colors unchanged across themes.</strong> Saturated accent colors that look vibrant on white backgrounds can appear to glow or vibrate on dark backgrounds due to simultaneous contrast. Reduce saturation and increase lightness for accent colors in dark mode. A brand blue of #1a73e8 on white might need to become #8ab4f8 on dark gray — lighter and less saturated, maintaining the brand identity while being comfortable to view on dark surfaces.
          </li>
          <li>
            <strong>Forgetting to handle the initial load flash.</strong> Without the blocking inline script to apply the theme class before first paint, every page load in dark mode shows a white flash as the default light theme renders and then transitions to dark mode. This flash is visually jarring and makes the application feel unpolished. It is especially noticeable during page navigation in multi-page applications where each page load triggers a new flash.
          </li>
          <li>
            <strong>Not considering dark mode in emails and external content.</strong> Application-generated emails, PDF exports, print views, and embedded content often remain in light mode even when the application supports dark mode. Consider offering dark mode variants of email templates, adapting print stylesheets to respect the active theme, and handling embedded content (iframes, webviews) that may not support dark mode by providing appropriate containers or fallbacks.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Apple (macOS/iOS)</strong> set the modern standard for dark mode with their system-wide implementation. macOS Mojave introduced a comprehensive dark mode that affected every system application, with a semantic color system (dynamic colors that automatically adapt) that third-party developers could adopt. Apple&apos;s approach is notable for its attention to material design — dark mode surfaces use translucency and vibrancy effects to create depth and context rather than flat dark colors. Their developer guidelines specifically address avoiding pure black, using elevated surfaces with lighter tints, and adapting SF Symbols (system icons) for contrast on dark backgrounds.
        </p>
        <p>
          <strong>Slack</strong> implements dark mode with a comprehensive design token system that supports not only light and dark but also custom theme colors for sidebar branding. Their implementation handles the complexity of user-generated content — messages with code blocks, embedded images, custom emoji, and rich link previews must all remain readable in dark mode. Slack uses the prefers-color-scheme media query for initial theme detection and persists the user&apos;s explicit choice to their server-side profile for cross-device consistency. Their approach to inline code blocks is particularly thoughtful — code syntax highlighting colors are adjusted for each theme to maintain readability and aesthetic coherence.
        </p>
        <p>
          <strong>GitHub</strong> offers a sophisticated theme system with multiple variants — light default, light high-contrast, dark default, dark high-contrast, and dark dimmed. The high-contrast variants serve users with visual impairments who need more distinct color differentiation than standard themes provide. GitHub uses CSS custom properties with a Primer design system that defines hundreds of semantic color tokens. Their implementation handles particularly challenging dark mode scenarios: syntax-highlighted code (where dozens of colors must be theme-aware), contribution graphs (green squares on dark backgrounds), and markdown rendering (user-generated content with arbitrary HTML and images).
        </p>
        <p>
          <strong>YouTube</strong> was one of the first major web applications to offer dark mode, implementing it initially as a &ldquo;dark theme&rdquo; toggle in 2017. YouTube&apos;s dark mode is particularly effective for its use case — video content is displayed against a dark background that reduces visual distraction and creates a more immersive viewing experience. Their implementation handles the challenge of thumbnail images (which may be bright and colorful) on dark surfaces by using subtle elevation and border treatments to define card boundaries without harsh contrast. YouTube syncs theme preference through the Google account, providing consistency across devices.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you architect a dark mode implementation for a large
            web application?
          </p>
          <p className="mt-2">
            A: I would build a design token system with three layers: primitive color scales (raw palette values), semantic tokens (purpose-based mappings like <code>bg-primary</code>, <code>text-secondary</code>, <code>border-subtle</code>), and component tokens (component-specific mappings like <code>card-bg</code>, <code>input-border</code>). CSS custom properties would hold the semantic token values, defined at <code>:root</code> for light mode and <code>:root.dark</code> for dark mode. Theme initialization would use a blocking inline script in the HTML head that reads the preference from localStorage before first paint, preventing the Flash of Incorrect Theme. The user would have three options: system (auto), light, or dark. A theme manager would handle switching (toggling the class on the document element), persistence (localStorage), and system preference monitoring (matchMedia change listener). All component styles would reference semantic tokens exclusively — no hardcoded colors. I would verify WCAG contrast compliance for both themes using automated testing, and handle images with a slight brightness reduction in dark mode.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you prevent the Flash of Incorrect Theme when the page
            loads?
          </p>
          <p className="mt-2">
            A: The FOIT occurs because the browser renders the page with default light styles before JavaScript loads to apply the dark theme. The solution is an inline, render-blocking script in the HTML head that executes before the browser paints. This script reads the theme preference from localStorage, falls back to the <code>prefers-color-scheme</code> media query if no preference is stored, and sets the appropriate class on the <code>document.documentElement</code> before any stylesheets are evaluated. The script should be minimal — around 10 lines — to avoid blocking render unnecessarily. For SSR applications, an alternative approach is to read the theme from a cookie on the server and inject the correct class into the server-rendered HTML, eliminating the need for client-side detection entirely. The cookie approach also works with CDN caching if the CDN supports Vary-by-cookie or edge-side includes.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: Why should you avoid pure black (#000000) backgrounds in dark
            mode?
          </p>
          <p className="mt-2">
            A: Pure black backgrounds create several problems. First, halation — when bright text (especially white) is displayed on pure black, the perceived contrast is so high that text appears to glow or blur, especially for users with astigmatism (roughly 50% of the population). Off-black backgrounds (#121212 or similar) reduce this effect while maintaining comfortable readability. Second, elevation hierarchy — dark mode uses progressively lighter surfaces to indicate elevation, and pure black leaves no room for surfaces lighter than the background that still feel &ldquo;dark.&rdquo; Starting from #121212 provides headroom for elevated surfaces up to approximately #383838. Third, OLED considerations — while pure black does save the most power on OLED screens (pixels are completely off), the power savings compared to very dark gray are minimal (~1-3%), and the readability and design quality trade-offs are not worth the marginal power benefit. Material Design recommends #121212, Apple uses dynamic colors around #1c1c1e.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you handle images and user-generated content in dark mode?
          </p>
          <p className="mt-2">
            A: Images need several treatments in dark mode. For photographic content, apply a slight brightness reduction (<code>filter: brightness(0.85) contrast(1.1)</code>) to prevent bright images from being visually jarring on dark backgrounds. For transparent PNGs and SVGs (logos, icons, illustrations), either provide dark mode variants with adjusted colors or use CSS filters to invert or adjust colors. For decorative illustrations designed for light backgrounds, swapping to dark-mode-specific versions is the highest quality approach. For user-generated content that may contain arbitrary HTML, images, or embeds, I would apply a subtle containing treatment — a slightly lighter surface with rounded corners — that creates an acceptable viewing context regardless of the content&apos;s own color scheme. Embedded iframes (tweets, YouTube videos, code embeds) may have their own dark mode support — check for embed APIs that accept a theme parameter and pass the current theme through.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-medium">
            Q: How would you test dark mode comprehensively?
          </p>
          <p className="mt-2">
            A: Testing dark mode requires multiple approaches. First, visual regression testing — capture screenshots of all key pages and components in both themes and compare against approved baselines. Tools like Chromatic, Percy, or Playwright&apos;s screenshot testing can automate this. Second, automated contrast checking — run axe-core or similar accessibility tools in both themes to verify WCAG contrast compliance for all text-on-background and interactive-element-on-background combinations. Third, cross-browser verification — dark mode rendering can differ across browsers, especially for form elements (inputs, selects, checkboxes) that use browser-default styling. Test in Chrome, Firefox, Safari, and Edge in both themes. Fourth, system preference integration testing — verify that the application correctly responds to OS-level theme changes, both on initial load and during runtime switching. Fifth, persistence testing — verify that theme preference survives page refresh, tab closure, and new tab opening. Sixth, SSR verification — ensure the server-rendered HTML includes the correct theme class and no FOIT occurs. Finally, edge case testing — verify themes in modals, toasts, dropdowns, and other overlay elements that may have their own background surfaces.
          </p>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://material.io/design/color/dark-theme.html" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Material Design — Dark Theme Guidelines
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              MDN — prefers-color-scheme Media Query
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/prefers-color-scheme" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              web.dev — prefers-color-scheme: Hello Darkness, My Old Friend
            </a>
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/dark-mode/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Dark Mode vs Light Mode: Which Is Better?
            </a>
          </li>
          <li>
            <a href="https://developer.apple.com/design/human-interface-guidelines/dark-mode" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Apple Human Interface Guidelines — Dark Mode
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

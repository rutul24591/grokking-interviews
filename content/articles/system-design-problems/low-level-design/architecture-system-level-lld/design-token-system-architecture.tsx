"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-design-token-system-architecture",
  title: "Design Token System Architecture",
  description:
    "Production-grade design token architecture covering the three-tier token hierarchy, CSS custom property injection, SSR-safe theme switching without FOUC, multi-brand and white-label token overrides, Style Dictionary toolchain, and governance workflows.",
  category: "low-level-design",
  subcategory: "architecture-system-level-lld",
  slug: "design-token-system-architecture",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["design-tokens", "theming", "css-variables", "style-dictionary", "dark-mode", "lld"],
};

export default function DesignTokenSystemArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Design tokens are the single source of truth for every visual decision in a design system — color, spacing,
        typography, motion, border radius, shadow. Without a systematic token architecture, teams end up with hundreds
        of hardcoded hex values scattered across CSS files, components that ignore each other's color choices, and a
        dark mode implementation that requires touching every stylesheet manually. Staff-level engineers are expected
        to know how to structure tokens across three abstraction layers, how to implement FOUC-free theme switching
        in SSR applications, and how to architect multi-brand token systems.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/architecture-system-level-lld/design-token-system-architecture.svg"
        alt="Design token system architecture diagram"
        caption="Three-tier token hierarchy, CSS variable injection, multi-brand overrides, and tooling/governance"
      />

      <h2>The Three-Tier Token Hierarchy</h2>
      <p>
        The most important architectural decision in a token system is the three-tier hierarchy: primitive tokens,
        semantic tokens, and component tokens. Skipping any tier creates coupling that makes theme changes expensive.
      </p>

      <h3>Primitive Tokens</h3>
      <p>
        Primitive tokens are raw named values with no semantic meaning attached. They define the full palette of
        available values without implying where those values should be used:
      </p>
      <ul>
        <li><code>color-blue-100: #dbeafe</code></li>
        <li><code>color-blue-500: #3b82f6</code></li>
        <li><code>color-blue-900: #1e3a8a</code></li>
        <li><code>space-1: 4px</code></li>
        <li><code>space-4: 16px</code></li>
        <li><code>font-size-sm: 14px</code></li>
        <li><code>border-radius-md: 6px</code></li>
      </ul>
      <p>
        Primitive tokens should never be used directly in components. A component that uses <code>color-blue-500</code>
        directly is not themeable — you cannot change blue to teal without touching every component. Primitives
        exist only to be referenced by semantic tokens.
      </p>

      <h3>Semantic Tokens</h3>
      <p>
        Semantic tokens assign meaning to primitive values. They describe intent, not appearance:
      </p>
      <ul>
        <li><code>color-action-primary: {'{'}color-blue-500{'}'}</code> — the primary interactive color</li>
        <li><code>color-text-default: {'{'}color-gray-900{'}'}</code> — default body text</li>
        <li><code>color-text-disabled: {'{'}color-gray-400{'}'}</code> — text in disabled state</li>
        <li><code>color-surface-default: {'{'}color-white{'}'}</code> — default background surface</li>
        <li><code>color-surface-raised: {'{'}color-gray-50{'}'}</code> — elevated card/panel background</li>
        <li><code>space-component-padding-md: {'{'}space-4{'}'}</code> — standard internal padding</li>
      </ul>
      <p>
        Semantic tokens are the layer components reference. When implementing dark mode, you remap semantic tokens
        to different primitives — <code>color-text-default</code> points to <code>color-gray-100</code> instead of
        <code>color-gray-900</code>. Components are unaware of the change; they only reference
        <code>color-text-default</code>. This is the core power of the semantic layer.
      </p>

      <h3>Component Tokens</h3>
      <p>
        Component tokens are scoped to a specific component and reference semantic tokens:
      </p>
      <ul>
        <li><code>btn-primary-bg: {'{'}color-action-primary{'}'}</code></li>
        <li><code>btn-primary-bg-hover: {'{'}color-action-primary-hover{'}'}</code></li>
        <li><code>btn-primary-text: {'{'}color-text-on-dark{'}'}</code></li>
        <li><code>btn-border-radius: {'{'}border-radius-md{'}'}</code></li>
        <li><code>btn-padding-x: {'{'}space-component-padding-md{'}'}</code></li>
      </ul>
      <p>
        Component tokens allow tenants or brands to customize specific components without touching the global
        semantic layer. A tenant can set <code>btn-primary-bg</code> to their brand color without affecting
        other uses of <code>color-action-primary</code> (like links or focus rings).
      </p>

      <HighlightBlock as="p" tier="crucial">
        The discipline of the three-tier hierarchy is: components reference component tokens (or semantic tokens),
        never primitives. Semantic tokens reference primitives, never component tokens. This one-directional
        chain is what makes theming predictable and maintainable.
      </HighlightBlock>

      <h2>CSS Custom Properties as the Runtime Layer</h2>
      <p>
        CSS custom properties (CSS variables) are the browser's native mechanism for runtime token resolution.
        They cascade through the DOM, can be overridden at any scope, and require zero JavaScript for basic
        theme switching.
      </p>

      <h3>Token-to-CSS-Variable Mapping</h3>
      <p>
        Each semantic token becomes a CSS custom property defined on <code>:root</code>:
      </p>
      <p>
        The variable name convention mirrors the token name with a consistent prefix: token
        <code>color-action-primary</code> becomes <code>--color-action-primary</code>. Components use the
        variable, not the value:
      </p>
      <p>
        A button sets <code>background-color: var(--btn-primary-bg)</code>, which resolves to
        <code>var(--color-action-primary)</code>, which resolves to the current value of
        <code>--color-action-primary</code> on <code>:root</code>.
      </p>

      <h3>Dark Mode Implementation</h3>
      <p>
        Dark mode overrides semantic token values for a different context — the same component tree renders with
        a completely different visual result purely through CSS:
      </p>
      <p>
        When the document has <code>data-theme="dark"</code> on the <code>&lt;html&gt;</code> element, the
        overrides in <code>[data-theme="dark"]</code> take precedence over the <code>:root</code> defaults.
        Every component using <code>var(--color-surface-default)</code> automatically picks up the dark value
        without any JavaScript or re-render.
      </p>
      <p>
        An alternative to <code>data-theme</code> is using <code>@media (prefers-color-scheme: dark)</code>.
        However, this approach cannot be overridden by a user toggle — it only responds to the OS setting. The
        recommended pattern: use <code>prefers-color-scheme</code> as the default, but also support an explicit
        <code>data-theme</code> override for the user preference toggle.
      </p>

      <h3>Preventing FOUC in SSR Applications</h3>
      <p>
        Flash of Unstyled Content (FOUC) occurs when a page renders with the default (light) theme, then
        JavaScript executes and switches to the user's saved dark preference — causing a visible flash.
      </p>
      <p>
        The fix: add <code>data-theme</code> to the <code>&lt;html&gt;</code> element server-side based on the
        user's saved preference. The preference is stored in a cookie (accessible server-side) rather than
        localStorage (only accessible client-side after hydration).
      </p>
      <p>
        In Next.js App Router, read the cookie in the root layout server component:
      </p>
      <p>
        For the localStorage approach (common in client-rendered apps), inject an inline script in the
        <code>&lt;head&gt;</code> that reads localStorage and sets <code>data-theme</code> before the first
        paint. The inline script is synchronous and blocks rendering — it executes before any CSS is parsed,
        ensuring the correct theme is applied immediately.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Never read theme preference in a useEffect — by then the page has already painted with the wrong theme.
        For SSR: use a cookie + server-side data-theme attribute. For CSR: use an inline script in the head.
        Both approaches ensure the correct theme before first paint.
      </HighlightBlock>

      <h2>Token Naming Conventions</h2>
      <p>
        Consistent naming is what makes a token system maintainable across large teams. The convention:
      </p>
      <p>
        <code>[category]-[variant]-[property]-[state]</code>
      </p>
      <ul>
        <li><strong>category:</strong> color, space, font, border, shadow, motion, z</li>
        <li><strong>variant:</strong> action, text, surface, border, feedback (success/error/warning/info)</li>
        <li><strong>property:</strong> bg, fg, border, ring, shadow (when needed for specificity)</li>
        <li><strong>state:</strong> default (omitted), hover, active, disabled, focus</li>
      </ul>
      <p>
        Examples: <code>color-feedback-error-text</code>, <code>color-action-secondary-bg-hover</code>,
        <code>space-layout-section-gap</code>, <code>motion-duration-fast</code>.
      </p>
      <p>
        Naming anti-patterns to avoid:
      </p>
      <ul>
        <li><strong>Visual names in semantic tokens:</strong> <code>color-blue-primary</code> couples the token to
        the current visual choice. When the brand changes to teal, the token name is wrong. Use
        <code>color-action-primary</code> instead.</li>
        <li><strong>Component names in semantic tokens:</strong> <code>color-button-background</code> is a
        component token, not a semantic token. If another component needs the same color, it can't reference
        this token without looking wrong semantically.</li>
        <li><strong>Overly specific names:</strong> <code>color-header-nav-link-hover-background</code> is too
        granular for a semantic token. Use component tokens for this level of specificity.</li>
      </ul>

      <h2>Token Categories in Depth</h2>

      <h3>Color Tokens</h3>
      <p>
        The most complex category. A complete color token set includes:
      </p>
      <ul>
        <li><strong>Action colors:</strong> primary, secondary, tertiary — with hover, active, disabled variants</li>
        <li><strong>Text colors:</strong> default, subtle, disabled, inverse, on-color</li>
        <li><strong>Surface colors:</strong> page background, raised (cards), overlay (modals)</li>
        <li><strong>Border colors:</strong> default, strong, focus ring, error, disabled</li>
        <li><strong>Feedback colors:</strong> success, error, warning, info — each with bg, text, border variants</li>
        <li><strong>Brand colors:</strong> primary brand, secondary brand — used sparingly</li>
      </ul>

      <h3>Typography Tokens</h3>
      <p>
        Typography tokens cover the full typographic scale: font families (body, heading, mono), font sizes (xs
        through 5xl), font weights (regular, medium, semibold, bold), line heights, letter spacing, and text
        transform. Semantic typography tokens like <code>font-heading-1</code> bundle font-size + line-height +
        font-weight into a single token for use in Tailwind or utility-first systems.
      </p>

      <h3>Spacing Tokens</h3>
      <p>
        Spacing tokens use a 4px base unit: space-1 (4px), space-2 (8px), space-3 (12px), space-4 (16px), etc.
        Semantic spacing tokens distinguish layout spacing (section gaps, page margins) from component spacing
        (internal padding, gap between elements within a component). Keeping these separate allows global layout
        rescaling without affecting component internals.
      </p>

      <h3>Motion Tokens</h3>
      <p>
        Motion tokens cover duration (fast: 150ms, normal: 250ms, slow: 400ms) and easing curves (ease-in,
        ease-out, ease-in-out, spring). Semantic motion tokens like <code>motion-feedback</code> (fast, ease-out)
        for immediate feedback and <code>motion-transition</code> (normal, ease-in-out) for state changes ensure
        consistent animation feel across the product.
      </p>
      <p>
        An important semantic motion token: <code>motion-duration-reduced</code> maps to 0 when the user has
        <code>prefers-reduced-motion: reduce</code> enabled. Components use this token for all animation
        durations — animations are automatically disabled for motion-sensitive users without any component-level
        conditional logic.
      </p>

      <h2>Multi-Brand and White-Label Architecture</h2>
      <p>
        Many enterprise products serve multiple brands (Airbnb/Airbnb for Business) or white-label the product for
        enterprise customers. The token architecture determines how cleanly this can be done.
      </p>

      <h3>Brand Token Files</h3>
      <p>
        Each brand has its own primitive token file defining its specific color palette, font family, and brand
        radii. The semantic layer remains shared — <code>color-action-primary</code> points to the brand's
        primary color regardless of brand. Component tokens are also shared.
      </p>
      <p>
        At build time, Style Dictionary generates separate CSS files per brand:
        <code>brand-acme.css</code>, <code>brand-company.css</code>. Each file defines the same
        CSS custom property names but with brand-specific values. Load the correct file based on the brand
        context (detected from the domain, user preference, or route).
      </p>

      <h3>Runtime Brand Switching</h3>
      <p>
        For applications that need to switch brands at runtime (without a page reload): replace the CSS custom
        properties on <code>:root</code> programmatically using JavaScript. This avoids loading a new stylesheet
        and avoids the associated layout recalculation:
      </p>
      <p>
        The brand token object is fetched from a token API endpoint (<code>GET /api/tokens?brand=acme</code>)
        and applied in bulk. The token API returns the complete override set — only values that differ from
        defaults — keeping the payload small.
      </p>

      <h3>Tenant Customization</h3>
      <p>
        For SaaS products offering per-tenant customization (custom brand colors, fonts, logo), tenant-specific
        token overrides are applied on top of the base brand tokens. The fallback chain is:
        tenant component tokens → tenant semantic tokens → brand semantic tokens → brand primitive tokens.
      </p>
      <p>
        Scope customization to component tokens only — tenants should not be able to override primitive tokens
        (that would break the semantic mapping) or semantic tokens (unpredictable side effects). Exposing only
        a curated set of component tokens gives tenants control without breaking the system.
      </p>

      <h2>Style Dictionary Toolchain</h2>
      <p>
        Style Dictionary (by Amazon) is the industry standard for token transformation. It reads token definitions
        in JSON/YAML and transforms them into platform-specific outputs.
      </p>

      <h3>Input Format</h3>
      <p>
        Tokens are defined in JSON using a nested structure. The value can reference another token using the
        <code>{'{'}tokenName{'}'}</code> syntax — Style Dictionary resolves these references during transformation:
      </p>
      <p>
        Tokens can be organized in multiple files by category (color.json, spacing.json, typography.json) —
        Style Dictionary merges them before transformation.
      </p>

      <h3>Transform and Format Pipeline</h3>
      <p>
        The Style Dictionary config defines output platforms, transforms, and formats:
      </p>
      <ul>
        <li><strong>Transforms:</strong> Convert token names and values (e.g., camelCase to kebab-case for CSS,
        px to pt for iOS, hex to UIColor for iOS Swift).</li>
        <li><strong>Formats:</strong> Define the output file structure (CSS :root block, JavaScript ES module
        with typed exports, Swift enum, Kotlin object).</li>
        <li><strong>Actions:</strong> Custom post-processing (copy files, run Prettier on output).</li>
      </ul>
      <p>
        Run Style Dictionary in CI on every change to the token source files. Generated output is committed to the
        repository so consumers don't need to run the transformation locally. A lint check verifies that
        committed outputs are up to date with the source — fails CI if a token change was made without regenerating.
      </p>

      <h3>Tokens Studio (Figma Plugin)</h3>
      <p>
        Tokens Studio is a Figma plugin that allows designers to define and edit tokens directly in Figma and
        sync them to a Git repository. The workflow:
      </p>
      <ol>
        <li>Designer edits a token value in Figma (e.g., changes primary blue to a new brand color).</li>
        <li>Tokens Studio pushes a commit to a token branch in the Git repository.</li>
        <li>CI runs Style Dictionary to regenerate CSS/JS/native outputs.</li>
        <li>A PR is automatically opened for engineering review.</li>
        <li>After merge, the updated tokens are live.</li>
      </ol>
      <p>
        This workflow eliminates the translation step where a designer specifies a change in a document and an
        engineer manually updates the token file — a frequent source of errors and delays.
      </p>

      <h2>TypeScript Token Types</h2>
      <p>
        The JavaScript token exports should be fully typed. When using tokens in TypeScript code, type safety
        prevents referencing non-existent tokens and enables autocomplete:
      </p>
      <p>
        Style Dictionary can generate a TypeScript declaration file from the token structure. All token names
        become string literal union types — <code>type ColorToken = 'color-action-primary' | 'color-text-default' | ...</code>.
        Functions that accept token names are parameterized with this type, giving compile-time validation.
      </p>

      <h2>Governance and Maintenance</h2>

      <h3>Ownership Model</h3>
      <p>
        Token governance defines who can modify each layer:
      </p>
      <ul>
        <li><strong>Primitive tokens:</strong> Design team owns exclusively. Changes require design review and
        engineering sign-off on impact analysis.</li>
        <li><strong>Semantic tokens:</strong> Joint ownership between design and engineering leads. Changes affect
        every component and require careful review.</li>
        <li><strong>Component tokens:</strong> Engineering owns with design approval. Component teams can add
        new component tokens without design review if they reference existing semantic tokens.</li>
      </ul>

      <h3>Deprecation Process</h3>
      <p>
        When a token needs to be removed or renamed (typically after a design system major version):
      </p>
      <ol>
        <li>Mark the token as <code>@deprecated</code> in the JSON source with a <code>deprecated</code> field
        pointing to the replacement token.</li>
        <li>Style Dictionary generates a deprecation warning in the CSS output as a comment.</li>
        <li>A lint rule (<code>stylelint-no-deprecated-custom-property</code>) flags uses of deprecated tokens
        in CI.</li>
        <li>Write a codemod (jscodeshift) to replace deprecated token references in component code.</li>
        <li>After all references are migrated, remove the token in the next major version.</li>
      </ol>

      <h3>Token Linting</h3>
      <p>
        Enforce token usage discipline with automated linting:
      </p>
      <ul>
        <li><strong>stylelint-no-unknown-custom-property:</strong> Fails if a component uses a CSS custom
        property that isn't defined in the token output. Catches typos and references to removed tokens.</li>
        <li><strong>Custom ESLint rule:</strong> Forbid hardcoded color hex values in CSS-in-JS. Any
        <code>color: '#3b82f6'</code> must become <code>color: tokens['color-action-primary']</code>.</li>
        <li><strong>Figma token audit:</strong> Compare tokens used in Figma designs against published token
        definitions — flag designs that reference removed or deprecated tokens.</li>
      </ul>

      <h2>Interview Q&A</h2>

      <h3>Q: Why use three layers of tokens? Why not just semantic tokens?</h3>
      <p>
        Without primitive tokens, semantic tokens contain raw values: <code>color-action-primary: #3b82f6</code>.
        When the product needs to support a brand where the primary color is not in the blue family, you have to
        change every semantic token's raw value manually — there's no single place to update the palette.
      </p>
      <p>
        With primitives, you define <code>color-cobalt-500: #3b82f6</code> once. All semantic tokens reference
        <code>{'{'}color-cobalt-500{'}'}</code>. Changing the cobalt shade updates everything that uses it automatically.
        For dark mode, you remap semantic tokens to different primitives — not raw hex values. The three-tier
        system is what allows brand swapping, dark mode, and tenant customization without touching components.
      </p>

      <h3>Q: How do you implement theme switching without a flash of unstyled content in a Next.js app?</h3>
      <p>
        The FOUC problem: in a Next.js app with SSR, the server renders HTML without knowing the user's theme
        preference (stored in localStorage, which is client-only). The page arrives as light theme; JavaScript
        executes and switches to dark — causing a visible flash.
      </p>
      <p>
        Solution 1 (cookie-based, preferred): Store the theme preference in an httpOnly cookie. In the Next.js
        root layout, read the cookie from the request headers and set <code>data-theme</code> on the
        <code>&lt;html&gt;</code> element server-side. The rendered HTML already has the correct theme — no flash.
      </p>
      <p>
        Solution 2 (inline script): Add a blocking inline <code>&lt;script&gt;</code> tag in the document
        <code>&lt;head&gt;</code> that reads localStorage and sets <code>data-theme</code> before the browser
        parses any CSS. This script is synchronous and blocks the parser — it runs before the first paint.
        The downside: a small synchronous script in the head adds ~2 ms to TTFB.
      </p>

      <h3>Q: How do you design a token system for a SaaS product that needs to support 500 enterprise tenants with custom branding?</h3>
      <p>
        The key is limiting the surface area of customization while still providing meaningful flexibility.
      </p>
      <p>
        Expose only a curated set of component tokens to tenants: primary button color, secondary button color,
        brand logo URL, header background color, link color. These are the tokens tenants actually care about.
        Exposing all 500+ tokens is overwhelming and creates support nightmares.
      </p>
      <p>
        Architecture: the base product ships with a default token set (CSS custom properties on <code>:root</code>).
        When a tenant logs in, a tenant config API call returns their customization overrides — a small JSON object
        with maybe 10–20 token overrides. These are applied by setting the CSS properties directly on
        <code>document.documentElement</code> after initial load, or by injecting them into a
        <code>&lt;style&gt;</code> tag. The base token file is cached at CDN; the tenant overrides are small and
        tenant-specific.
      </p>

      <h3>Q: A designer wants to add a new "accent" color token. Walk me through the process.</h3>
      <p>
        First, determine which layer the new token belongs to. "Accent" sounds semantic — it implies a use,
        not a raw value. The process:
      </p>
      <ol>
        <li>Add a primitive: <code>color-teal-500: #14b8a6</code> to the color primitives JSON.</li>
        <li>Add a semantic token: <code>color-accent-primary: {'{'}color-teal-500{'}'}</code> to the semantic
        color JSON. Add state variants if needed: <code>color-accent-primary-hover</code>,
        <code>color-accent-primary-disabled</code>.</li>
        <li>Run Style Dictionary — generates the new CSS custom property in the output files.</li>
        <li>Publish a new version of the <code>@org/tokens</code> package (minor version bump — new tokens
        are backward compatible).</li>
        <li>Document the token's intended use in the design system documentation: "Use for secondary call-to-action
        elements. Do not use for primary actions (use color-action-primary instead)."</li>
        <li>Update Figma via Tokens Studio to expose the new token to designers.</li>
      </ol>

      <h3>Q: What's the difference between design tokens and Tailwind CSS utility classes?</h3>
      <p>
        They solve related but different problems. Tailwind generates a large set of utility classes
        (<code>bg-blue-500</code>, <code>text-sm</code>, <code>p-4</code>) from a configuration file. Design
        tokens are named design decisions that can generate multiple outputs (CSS variables, JavaScript constants,
        mobile platform formats).
      </p>
      <p>
        They work well together: define design tokens as the source of truth, then configure Tailwind to use those
        token values. Tailwind reads the token values as its theme configuration — <code>bg-action-primary</code>
        becomes a Tailwind class backed by the token value. Tailwind provides the utility class API; design tokens
        provide the values. This combination gives the convenience of Tailwind with the consistency of a token
        system.
      </p>
      <p>
        The key advantage of tokens over raw Tailwind config: tokens generate platform-agnostic outputs for mobile
        apps, have a named semantic meaning that can be documented and linted, and support runtime overrides (CSS
        custom properties) that Tailwind classes cannot do without dynamic class generation.
      </p>
    </ArticleLayout>
  );
}

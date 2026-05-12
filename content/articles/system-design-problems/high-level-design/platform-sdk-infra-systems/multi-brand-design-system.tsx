"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-brand-design-system",
  title: "Design a Multi-Brand Design System",
  description:
    "Architecture for a multi-brand design system: token layering, theme generation, brand-specific overrides, component versioning, and cross-team governance at scale.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "multi-brand-design-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-10",
  tags: ["hld", "design-system", "multi-brand", "tokens", "theming", "governance"],
  relatedTopics: ["frontend-sdk-for-third-party-developers", "multi-app-monorepo-management-dashboard"],
};

export default function MultiBrandDesignSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A multi-brand design system serves multiple product brands or white-label customers from a single component library. The challenge is maintaining a shared component codebase while allowing each brand to express a distinct visual identity—different colors, typography, spacing, border radius, icon sets, and even some layout variations—without forking the component library and creating independent maintenance burdens. The naive solution (duplicate the component library for each brand) creates N times the maintenance cost and eventually leads to divergence that makes cross-brand features impossible.</p>
        <p>The sophisticated solution uses a token-based theming architecture: components reference semantic design tokens (color.action.primary, spacing.component.padding.md) rather than literal values. Each brand provides its own token definitions that map to brand-specific values. Components render correctly for any brand without modification; only the token definitions change. This architecture works for visual variations but has limits: if two brands require different component behavior (brand A's button has a loading state, brand B's does not), the token system cannot express that difference and component branching is required.</p>
        <p><strong>Explicit assumptions:</strong> The system serves 3–10 brands, each with distinct visual identities but largely shared component requirements. Components are React-based. Token management uses a design-to-code pipeline (Figma tokens → Style Dictionary → CSS custom properties). Each brand may have brand-specific components in addition to the shared library. The system serves both web and React Native targets from the same token definitions. A platform team maintains the shared library; brand teams own brand tokens and brand-specific components.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Brand theming:</strong> Each brand has a distinct visual identity applied by switching token sets. Theme switching at runtime (for preview tools and white-label customers) is supported.</li>
          <li><strong>Shared component library:</strong> A core component set (buttons, inputs, cards, navigation) is shared across all brands. Components are brand-agnostic; they read from tokens only.</li>
          <li><strong>Brand-specific extensions:</strong> Individual brands can add brand-specific components (a brand-specific hero section, a brand-specific chart style) without modifying the shared library.</li>
          <li><strong>Token pipeline:</strong> Design tokens defined in Figma are automatically exported and transformed into CSS custom properties, TypeScript constants, and React Native StyleSheet values by an automated pipeline.</li>
          <li><strong>Version management:</strong> Breaking changes to the shared library are versioned. Brand teams are notified and given a migration window before breaking changes take effect.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Bundle efficiency:</strong> Only the active brand's tokens are included in the production bundle. Unused brand tokens do not increase bundle size.</li>
          <li><strong>Consistency:</strong> All components across all brands use the same semantic token names. A component built for one brand works correctly in all other brands without modification.</li>
          <li><strong>Design-to-code fidelity:</strong> Token values in production CSS must match Figma token values within a defined tolerance (exact match for colors and typography, ±1px for spacing).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The design system has three layers. The foundation layer: global tokens (literal values: color.blue.500 = #3b82f6, spacing.4 = 16px) that are brand-independent. The semantic layer: semantic tokens that map to global tokens with brand-specific mappings (color.action.primary maps to color.blue.500 for Brand A and color.indigo.600 for Brand B). The component layer: React components that reference semantic tokens only, with no awareness of which brand is active. Brand themes are CSS custom property files generated per brand by the token pipeline and loaded at runtime by wrapping the application in a theme provider that applies the brand's custom properties to the root element.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/multi-brand-design-system-token-layers.svg"
          alt="Multi-brand design system token layers showing three-tier architecture: global tokens (literal values, brand-independent), semantic tokens (per-brand mappings: Brand A color.action.primary → color.blue.500, Brand B → color.indigo.600), component tokens (component-specific aliases: button.background.primary → color.action.primary). Token pipeline: Figma Token Studio → JSON token files → Style Dictionary transform → CSS custom properties + TypeScript + React Native StyleSheet. Brand theme provider applies CSS custom properties to root element."
          caption="Three-tier token hierarchy: global (literals) → semantic (brand-specific mappings) → component (component aliases), processed by Style Dictionary into CSS custom properties"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Architecture and Pipeline</h3>
        <p>The token system has three tiers. Global tokens define the design vocabulary: all colors in all shades (color.blue.50 through color.blue.950), the full spacing scale (spacing.1 = 4px through spacing.16 = 64px), font sizes, font weights, border radii, and shadow definitions. Global tokens are brand-agnostic—they define what values exist, not what they mean. These are rarely changed and are not exposed directly to components.</p>
        <p>Semantic tokens map meaning to global values, with a separate mapping per brand. color.action.primary is the "primary action color"—it maps to color.blue.600 for Brand A, color.purple.600 for Brand B, color.teal.500 for Brand C. Semantic tokens define the design language's intent: color.feedback.error, color.surface.elevated, spacing.layout.sectionGap. Components use semantic tokens; they never reference global tokens directly. The semantic token file per brand is the primary artifact that brand designers own and modify.</p>
        <p>Component tokens are optional component-specific aliases of semantic tokens: button.background.primary → color.action.primary, button.text.primary → color.action.primaryForeground. Component tokens allow component-level customization (a brand wants their buttons to use a slightly different shade than the semantic action color) without modifying the component's source code. Not all systems need component tokens; they are valuable when fine-grained per-component customization is needed beyond what semantic tokens provide.</p>
        <p>The pipeline: designers export tokens from Figma using the Token Studio plugin as JSON files. A CI job (triggered by a GitHub webhook on Figma token export) runs Style Dictionary on the JSON files to generate: a CSS custom properties file per brand (brand-a-tokens.css), a TypeScript module with typed token constants (used for non-CSS contexts like chart color scales), and a React Native StyleSheet file. The generated files are published to an npm package (@design-system/tokens-brand-a) that brand applications install. The CI job also runs a validation step: it checks that all semantic token names referenced in component source code are defined in every brand's token file (missing tokens produce a build error, preventing a component from silently rendering with no value for a token).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Theme Provider and Runtime Switching</h3>
        <p>The theme is applied by a ThemeProvider component that wraps the application and sets CSS custom properties on the root element (or a scoped container). The ThemeProvider accepts a theme prop (a string brand identifier) and applies the corresponding brand's CSS custom properties. Because CSS custom properties cascade, all nested components automatically pick up the correct brand values without any prop drilling.</p>
        <p>Runtime theme switching (for white-label preview tools and demos) works by swapping the CSS custom properties on the root element. The ThemeProvider listens for theme prop changes and re-applies the new brand's custom properties. Switching themes does not require any JavaScript component re-renders beyond the ThemeProvider itself (CSS custom property changes are applied by the browser's CSS engine, not by React); the visual update is instant. For production applications where only one brand is active, the brand's CSS custom properties file is loaded as a static CSS file (not injected by JavaScript), which is preferable for performance (no JavaScript execution required to apply the theme).</p>
        <p>Dark mode: each brand defines two semantic token sets (light and dark), and the ThemeProvider applies the correct set based on the user's prefers-color-scheme media query or an explicit user preference stored in localStorage. The dark token set maps to different global token values (color.action.primary maps to color.blue.400 in dark mode rather than color.blue.600 in light mode, adjusted for contrast on dark backgrounds). Dark mode is handled entirely within the token system; component code has no awareness of light versus dark mode.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Shared Components and Brand-Specific Extensions</h3>
        <p>The shared component library exports fully token-referenced components. A Button component references button.background.primary, button.text.primary, button.border.radius, and button.padding.x as CSS custom properties. The component has no hard-coded colors, font sizes, or spacing values. This makes it trivially brand-agnostic: applying Brand A's tokens gives a blue button; Brand B's tokens give a purple button; the Button component source code is identical for both.</p>
        <p>Brand-specific components: Brand C might require a hero section with a unique layout that no other brand uses. This component lives in Brand C's own package (@design-system/components-brand-c), not in the shared library. Brand C's components can import shared library components (Button, Input, Card) and use brand semantic tokens. The brand-specific components are not subject to the shared library's versioning contract—they are owned entirely by Brand C's team. This separation is important: the shared library team must not be blocked on brand-specific requirements, and brand teams must not be blocked on the shared library team's release cadence for their brand-specific work.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Governance and Contribution Model</h3>
        <p>The multi-brand design system requires a clear governance model to prevent both over-centralization (all component decisions blocked on the platform team) and fragmentation (brands diverging uncontrollably). The governance model has three zones. Zone 1 (platform-owned): the global token vocabulary, the component library's core components, and the semantic token schema (the names of semantic tokens are shared across all brands—only the values differ). Changes to Zone 1 require platform team review and follow the RFC process. Zone 2 (brand-owned, constrained): each brand's semantic token values, dark mode tokens, and brand-specific components. Brand teams own these fully. Zone 3 (shared, brand-contributed): components that are brand-specific initially but candidates for the shared library (a brand-specific DatePicker that three brands end up wanting). Brand-contributed components enter a proposal process, are generalized to token references, and are promoted to Zone 1 after review.</p>
        <p>Breaking change process: when the shared library needs a breaking change (a component prop is renamed, a semantic token is removed), the platform team follows an expand-contract process. The new API is added alongside the old; the old is deprecated with a console warning in development mode; after a migration period (typically two minor versions), the old is removed in a major version. Brand teams receive automated migration codemods (AST-based transforms using jscodeshift) that update their usage of deprecated APIs. Codemods reduce the manual migration cost from days to minutes for most breaking changes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Visual Regression Testing Across Brands</h3>
        <p>Changes to shared components must be tested against all brand themes to catch visual regressions. The visual regression testing pipeline runs on every PR to the shared library: it renders a set of component stories (one per component variant) in each brand's theme and compares the rendered screenshots against baseline screenshots. A pixel diff above a configurable threshold (1% by default) flags the PR for review. This catches regressions like "the button's text color changed to an illegible shade in Brand C's theme after a semantic token rename."</p>
        <p>The visual regression tool (Chromatic, Percy, or a self-hosted Storybook with Playwright) runs in CI. The component stories are written once (in the shared library's Storybook) and rendered multiple times with different ThemeProvider wrappers (once per brand). This means the test count is (number of stories) × (number of brands), which grows as brands are added. The test count is managed by only running cross-brand visual regression on components that changed in the PR (using git diff to identify changed component files), not on every component for every PR.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/multi-brand-design-system-rollout.svg"
          alt="Multi-brand design system rollout showing governance zones (Zone 1: platform-owned shared components and token schema; Zone 2: brand-owned token values and brand-specific components; Zone 3: brand-contributed component proposals), breaking change process (expand-contract: add new API, deprecate old with console warning, remove in major version, automated jscodeshift codemod), and visual regression pipeline (component stories × brand themes rendered in Chromatic, pixel diff threshold, only changed components tested per PR)."
          caption="Governance zones (platform/brand/shared contribution), expand-contract breaking change process with automated codemods, and cross-brand visual regression per PR"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>CSS custom properties versus CSS-in-JS for theming: CSS custom properties (applied by the ThemeProvider) require no JavaScript at runtime to apply the theme—the browser's CSS engine handles the cascade. This is optimal for performance and SSR compatibility (the theme is applied before JavaScript runs, preventing a flash of un-themed content). CSS-in-JS theming (styled-components ThemeProvider, Emotion's ThemeProvider) requires JavaScript to inject styles, adding runtime overhead and complexity with SSR. For a design system serving multiple brands including SSR-heavy applications, CSS custom properties are the correct choice. The trade-off: CSS custom properties cannot be used in contexts where CSS is not available (React Native, email templates), requiring a separate TypeScript token export for those contexts.</p>
        <p>Token granularity: a token system with too few tokens (only 10 semantic tokens) forces brands to share values they want to differentiate. A token system with too many tokens (500 tokens) becomes unwieldy to maintain and understand. The right granularity depends on the variation space across brands: if brands vary only in primary color and border radius, 20 tokens are sufficient; if brands vary in typography, density, spacing, iconography, and motion, 100+ tokens may be needed. Starting with fewer tokens and expanding as specific brand requirements arise is generally better than starting with a comprehensive token taxonomy that most brands never use.</p>
        <p>Monorepo versus polyrepo for the design system: a monorepo (all brands' tokens and the shared library in one repository) simplifies cross-brand refactors (a single PR can update the shared library and all brands' token mappings simultaneously) but requires more CI infrastructure and creates a larger repository. A polyrepo (shared library in one repo, each brand's tokens in a separate repo) provides cleaner ownership boundaries but makes cross-cutting changes difficult. Most design system teams start with a monorepo and split out brand-specific packages only when team boundaries require it (brand teams want independent deployment cadence and access control).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A multi-brand design system uses a three-tier token architecture: global tokens (literal values, brand-independent), semantic tokens (per-brand mappings of meaning to values), and component tokens (optional component-specific aliases). The token pipeline (Figma Token Studio → Style Dictionary → CSS custom properties + TypeScript + React Native) automates the design-to-code flow. Components reference semantic CSS custom properties exclusively; brand themes are applied by the ThemeProvider setting custom properties on the root element, enabling runtime theme switching without React re-renders. Dark mode is handled within the token system (a dark semantic token set). Governance uses three zones: platform-owned core (RFC process, breaking changes via expand-contract with automated codemods), brand-owned tokens and brand-specific components (brand team autonomy), and brand-contributed component proposals (promotion to shared library after generalization). Visual regression testing runs component stories × brand themes in CI using a pixel-diff threshold on changed components. The defining design decision is token granularity: the number of semantic tokens determines the expression space for brand variation versus the maintenance overhead of the token vocabulary.</p>
      </section>
    </ArticleLayout>
  );
}

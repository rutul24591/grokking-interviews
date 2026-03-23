"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-accessibility-a11y-color-contrast-extensive",
  title: "Color Contrast",
  description:
    "Comprehensive guide to color contrast in accessible web design, covering WCAG contrast ratios, relative luminance calculation, color blindness considerations, accessible palette generation, and production-grade implementation strategies for staff and principal engineer interviews.",
  category: "frontend",
  subcategory: "accessibility-a11y",
  slug: "color-contrast",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-21",
  tags: [
    "accessibility",
    "color-contrast",
    "a11y",
    "wcag",
    "color-blindness",
    "relative-luminance",
    "design-systems",
  ],
  relatedTopics: ["wcag-guidelines", "accessible-forms", "aria-attributes"],
};

export default function ColorContrastArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ─── Section 1: Definition & Context ─── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Color contrast</strong> in web accessibility refers to the difference in perceived
          luminance between foreground content (text, icons, UI controls) and its background. The
          Web Content Accessibility Guidelines (WCAG) define specific contrast ratio thresholds that
          ensure content remains readable for users with low vision, color vision deficiencies, and
          those viewing screens in challenging lighting conditions.
        </p>
        <p>
          Approximately 1 in 12 men and 1 in 200 women have some form of color vision deficiency
          (commonly called &quot;color blindness&quot;). Low vision conditions affect millions more.
          Beyond permanent conditions, situational impairments — bright sunlight on a screen, aging
          eyes, screen glare — affect all users. Insufficient contrast is consistently among the
          top 5 accessibility failures found in web audits, with the WebAIM Million study reporting
          that 83.6% of home pages have at least one low-contrast text instance.
        </p>
        <p>
          WCAG addresses color contrast through three success criteria:
          <strong> 1.4.3 Contrast (Minimum)</strong> (Level AA) requires a 4.5:1 ratio for normal
          text and 3:1 for large text; <strong>1.4.6 Contrast (Enhanced)</strong> (Level AAA)
          requires 7:1 for normal text and 4.5:1 for large text; <strong>1.4.11 Non-text
          Contrast</strong> (Level AA, added in WCAG 2.1) requires 3:1 for UI components and
          graphical objects essential to understanding content.
        </p>
        <p>
          <strong>Why color contrast matters for staff/principal engineers:</strong> Contrast isn&apos;t
          just a design concern — it&apos;s an architectural one. Design system token definitions,
          theme switching (light/dark mode), dynamic theming, and user-generated content all
          require systematic approaches to contrast compliance. Technical leaders must build contrast
          checking into the design system pipeline, establish automated testing, and ensure that
          brand colors can achieve required ratios without compromising design intent.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Contrast Is About Luminance, Not Color Difference</h3>
          <p>
            A common misconception is that &quot;different colors&quot; means &quot;good
            contrast.&quot; Red text on green background has poor contrast despite being visually
            distinct colors. Contrast ratio measures the difference in <em>relative luminance</em>
            (perceived brightness), not hue or saturation. Two colors can look completely different
            yet have nearly identical luminance, resulting in unreadable text.
          </p>
        </div>
      </section>

      {/* ─── Section 2: Core Concepts ─── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Contrast Ratio:</strong> A value between 1:1 (identical colors) and 21:1
            (black on white). Calculated as <code>(L1 + 0.05) / (L2 + 0.05)</code> where L1 is the
            relative luminance of the lighter color and L2 of the darker. WCAG AA requires 4.5:1
            for normal text, 3:1 for large text (18pt/24px regular or 14pt/18.66px bold).
          </li>
          <li>
            <strong>Relative Luminance:</strong> A measure of perceived brightness on a 0 (darkest
            black) to 1 (lightest white) scale. Computed by linearizing each sRGB channel and
            applying the luminance formula: <code>L = 0.2126 * R + 0.7152 * G + 0.0722 * B</code>.
            The coefficients reflect the human eye&apos;s greater sensitivity to green light.
          </li>
          <li>
            <strong>Large Text:</strong> Defined by WCAG as at least 18pt (24px) regular weight or
            14pt (approximately 18.66px) bold weight. Large text requires only a 3:1 contrast ratio
            (AA) because larger characters are inherently more legible at lower contrast levels.
          </li>
          <li>
            <strong>Non-text Contrast (WCAG 1.4.11):</strong> UI components (buttons, form field
            borders, toggle switches) and graphical objects (icons, chart elements) require at least
            3:1 contrast against adjacent colors. This criterion, added in WCAG 2.1, catches issues
            like light gray form field borders on white backgrounds.
          </li>
          <li>
            <strong>Color Vision Deficiency Types:</strong> Protanopia (red-blind, ~1% of males),
            deuteranopia (green-blind, ~1% of males), and tritanopia (blue-yellow blind, very rare).
            Protanomaly and deuteranomaly (reduced sensitivity) are more common (~6% of males
            combined). Design must never rely on color alone to convey information (WCAG 1.4.1).
          </li>
          <li>
            <strong>APCA (Advanced Perceptual Contrast Algorithm):</strong> A modern alternative to
            WCAG&apos;s contrast ratio formula, being considered for WCAG 3.0. APCA accounts for
            font weight, polarity (light-on-dark vs. dark-on-light), and spatial frequency, providing
            more perceptually accurate contrast measurements. It uses a lookup table of minimum
            contrast values indexed by font size and weight.
          </li>
          <li>
            <strong>Color Independence:</strong> WCAG 1.4.1 (Use of Color) requires that color is
            not the sole means of conveying information. Error states should use text labels and
            icons alongside red color; links should be underlined (not just colored); chart data
            series should use patterns alongside colors.
          </li>
        </ul>
      </section>

      {/* ─── Section 3: Architecture & Flow ─── */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">WCAG Contrast Ratio Thresholds</h3>
        <p>
          WCAG defines two conformance levels for text contrast and a separate threshold for
          non-text elements. Understanding these thresholds is essential for audit compliance
          and design system token definitions.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/color-contrast-diagram-1.svg"
          alt="WCAG contrast ratio thresholds showing AA and AAA requirements for normal text, large text, and UI components"
          caption="WCAG contrast thresholds: AA requires 4.5:1 for normal text and 3:1 for large text; AAA requires 7:1 and 4.5:1 respectively. Non-text contrast requires 3:1 at AA level."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">WCAG Contrast Ratio Calculation</h3>
        <p>
          For contrast ratio calculation following WCAG 2.x algorithm, implement getRelativeLuminance function that takes r, g, b values, converts 0-255 sRGB to 0-1 linear values by dividing by 255, then applies the formula where values less than or equal to 0.04045 are divided by 12.92, otherwise apply power of 2.4 to the adjusted value. Apply luminance coefficients (0.2126 for red, 0.7152 for green, 0.0722 for blue) and sum. The getContrastRatio function takes two colors, calculates luminance for each, determines lighter and darker, and returns the ratio using the formula (lighter + 0.05) divided by (darker + 0.05). For example, white (255, 255, 255) on brand purple (109, 91, 208, hex 6d5bd0) produces approximately 4.56:1 ratio. For compliance checking, create a function that takes ratio, fontSize, and isBold, determines if large text (24px or above, or 18.66px bold), and returns aa compliance (4.5:1 for normal, 3:1 for large) and aaa compliance (7:1 for normal, 4.5:1 for large).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Color Blindness Simulation</h3>
        <p>
          Color vision deficiency affects how users perceive color combinations. Protanopia and
          deuteranopia (the most common types) make red-green distinctions difficult, while
          tritanopia affects blue-yellow perception. Designing for color independence means never
          relying on color alone.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/color-contrast-diagram-2.svg"
          alt="Color blindness simulation showing how UI colors appear under protanopia, deuteranopia, and tritanopia"
          caption="The same UI palette as perceived by users with different types of color vision deficiency. Red-green confusions are most common."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessible Color Palette Generation</h3>
        <p>
          Building an accessible design system requires generating color scales where every
          foreground/background combination in your palette meets contrast requirements. This is
          a systematic process, not a one-off audit.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/accessibility-a11y/color-contrast-diagram-3.svg"
          alt="Accessible color palette generation workflow showing base colors, contrast checking, adjustment, and final palette"
          caption="Accessible palette workflow: Start with brand colors, generate scales, check every combination against WCAG thresholds, adjust failing pairs, and document compliant pairings."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Design System Contrast Validation</h3>
        <p>
          For design system contrast validation, create a tokens object with text-primary, text-secondary, text-on-accent, bg-default, bg-surface, bg-accent, and border-default color values. Define requiredPairs array with foreground, background, and type for each combination to test (normal-text or ui-component). Create validatePalette function that maps over pairs, converts hex to RGB, calculates contrast ratio, determines minimum ratio (3:1 for ui-component, 4.5:1 for normal-text), and returns results with pair name, ratio, passes boolean, and required ratio. Filter failures and log any contrast failures for remediation.
        </p>
      </section>

      {/* ─── Section 4: Trade-offs & Comparisons ─── */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-accent/30">
                <th className="p-3 text-left font-semibold">Aspect</th>
                <th className="p-3 text-left font-semibold">Advantages</th>
                <th className="p-3 text-left font-semibold">Disadvantages</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">WCAG 2.x Contrast Ratio</td>
                <td className="p-3">Well-established standard, legally referenced, simple pass/fail thresholds, broad tool support</td>
                <td className="p-3">Doesn&apos;t account for font weight, polarity, or spatial frequency; can over/under-flag depending on context</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">APCA (WCAG 3.0 draft)</td>
                <td className="p-3">More perceptually accurate, accounts for font size/weight, better dark mode handling</td>
                <td className="p-3">Not yet a standard, limited legal precedent, fewer tools support it, more complex to implement</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">AA Compliance (4.5:1)</td>
                <td className="p-3">Legal minimum in most jurisdictions, achievable with most brand colors, good baseline</td>
                <td className="p-3">May be insufficient for users with moderate low vision, doesn&apos;t guarantee readability in all conditions</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">AAA Compliance (7:1)</td>
                <td className="p-3">Readable by users with moderate low vision, robust under poor viewing conditions</td>
                <td className="p-3">Severely limits color palette, many brand colors can&apos;t achieve 7:1, dark mode designs become very high contrast</td>
              </tr>
              <tr className="border-b border-accent/10">
                <td className="p-3 font-medium">High Contrast Mode</td>
                <td className="p-3">User-controlled, system-level support (Windows High Contrast), extreme readability</td>
                <td className="p-3">Limited design control, CSS must use forced-colors media query, can break visual hierarchy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Section 5: Best Practices ─── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-2">
          <li>
            <strong>Build contrast checking into your design system tokens:</strong> Define
            foreground/background pairs in your token system and validate them automatically.
            Don&apos;t rely on individual developers checking contrast manually.
          </li>
          <li>
            <strong>Never rely on color alone to convey information:</strong> Error states should
            combine red color with an icon and text label. Links should be underlined or otherwise
            distinguishable. Chart data series should use patterns or labels alongside colors.
          </li>
          <li>
            <strong>Test both light and dark mode palettes:</strong> A color that passes contrast in
            light mode may fail in dark mode (and vice versa). Generate separate token scales for
            each theme and validate all pairs in both contexts.
          </li>
          <li>
            <strong>Account for non-text contrast (WCAG 1.4.11):</strong> Form field borders, button
            boundaries, icon-only buttons, focus indicators, and chart elements all need 3:1 contrast.
            This is frequently overlooked and catches many teams during audits.
          </li>
          <li>
            <strong>Use tools in your CI pipeline:</strong> axe-core, Lighthouse, and pa11y can catch
            contrast failures automatically. Run these in CI to prevent regressions. For design tools,
            use Figma plugins like Stark or Contrast to check during design.
          </li>
          <li>
            <strong>Support Windows High Contrast Mode:</strong> Use the
            <code>forced-colors</code> media query and system color keywords
            (<code>CanvasText</code>, <code>Canvas</code>, <code>LinkText</code>) to ensure your
            UI remains functional in high contrast mode. Avoid background images for essential
            content.
          </li>
          <li>
            <strong>Document compliant color pairings:</strong> In your design system documentation,
            explicitly list which foreground colors can be used on which backgrounds. This prevents
            designers and developers from creating non-compliant combinations.
          </li>
        </ol>
      </section>

      {/* ─── Section 6: Common Pitfalls ─── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Placeholder text with insufficient contrast:</strong> Placeholder text in form
            fields is often light gray (#aaa or lighter) which fails contrast requirements.
            Placeholders are not labels — they should not contain essential information, but if
            visible, they should still meet 4.5:1 contrast.
          </li>
          <li>
            <strong>Disabled state ambiguity:</strong> WCAG exempts disabled controls from contrast
            requirements, but making them too faint means users can&apos;t tell they exist. Use a
            balance: clearly distinguish disabled from enabled, but keep disabled elements
            recognizable.
          </li>
          <li>
            <strong>Text over images or gradients:</strong> Text placed on background images or
            gradients may pass contrast in some areas but fail in others as the background varies.
            Use semi-transparent overlays or text shadows to ensure consistent contrast.
          </li>
          <li>
            <strong>Ignoring non-text contrast:</strong> Light gray borders on white input fields,
            subtle toggle switches, low-contrast icons — these all fail WCAG 1.4.11. Teams often
            focus on text contrast and miss UI component contrast entirely.
          </li>
          <li>
            <strong>Using brand colors that can&apos;t achieve 4.5:1:</strong> Some brand colors
            (particularly yellows, light greens, oranges) cannot achieve 4.5:1 contrast against white.
            Use them for decorative purposes but not for text. Provide accessible alternatives in
            the design system.
          </li>
          <li>
            <strong>Focus indicators that fail contrast:</strong> Focus rings must have 3:1 contrast
            against adjacent colors (WCAG 2.4.11). A thin blue outline on a blue button or on a
            dark background may be invisible. Double-ring patterns solve this.
          </li>
        </ul>
      </section>

      {/* ─── Section 7: Real-World Use Cases ─── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-2">
          <li>
            <strong>Material Design (Google):</strong> Material Design&apos;s color system generates
            tonal palettes with 13 tones per color, specifically designed so that text/background
            combinations at specific tone distances meet WCAG AA. The Material Color Utilities
            library automates compliant palette generation.
          </li>
          <li>
            <strong>Apple Human Interface Guidelines:</strong> Apple&apos;s dynamic system colors
            automatically adjust contrast across light mode, dark mode, and increased contrast
            settings. Developers using system colors get contrast compliance for free.
          </li>
          <li>
            <strong>GOV.UK Design System:</strong> The UK government design system limits its palette
            to colors that achieve 4.5:1 on white and provides explicit guidance on which color
            combinations are approved for text use.
          </li>
          <li>
            <strong>Stripe:</strong> Stripe&apos;s documentation and dashboard use high-contrast
            text with careful attention to code block contrast, error message visibility, and form
            field border contrast. Their checkout flow meets contrast requirements across all themes.
          </li>
          <li>
            <strong>Figma (Design Tool):</strong> Figma&apos;s color contrast checking plugins
            (Stark, A11y - Color Contrast Checker) allow designers to validate contrast during the
            design phase, preventing contrast failures before code is written.
          </li>
        </ul>
      </section>

      {/* ─── Section 8: Common Interview Questions ─── */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What are the WCAG contrast ratio requirements for text?</h3>
          <p>
            WCAG AA requires a minimum 4.5:1 contrast ratio for normal text (under 18pt/24px regular
            or under 14pt/18.66px bold) and 3:1 for large text. WCAG AAA increases these to 7:1 and
            4.5:1 respectively. Additionally, WCAG 1.4.11 requires 3:1 contrast for non-text UI
            components (form field borders, button boundaries, icons) and graphical objects. The
            contrast ratio is calculated using relative luminance: <code>(L1 + 0.05) / (L2 + 0.05)</code>
            where L1 is the lighter color&apos;s luminance.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How do you handle color contrast in dark mode?</h3>
          <p>
            Dark mode requires its own contrast validation because the polarity is reversed — light
            text on dark backgrounds behaves differently perceptually than dark text on light
            backgrounds. Key considerations: (1) Generate separate token scales for dark mode with
            validated contrast ratios. (2) Be aware that some colors that pass in light mode fail in
            dark mode. (3) APCA accounts for polarity differences better than WCAG 2.x. (4) Test
            in both modes with automated tools. (5) Avoid pure white (#fff) text on pure black
            (#000) backgrounds — the extreme contrast causes halation (glowing effect) for users
            with astigmatism. Use slightly off-white (#e0e0e0) on dark gray (#1a1a1a).
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is WCAG 1.4.1 (Use of Color) and how does it differ from contrast?</h3>
          <p>
            WCAG 1.4.1 states that color must not be the <em>only</em> visual means of conveying
            information, indicating an action, prompting a response, or distinguishing a visual
            element. This is separate from contrast ratios. Examples: form errors shown only in red
            without text, links distinguishable from body text only by color without underline,
            required fields indicated only by red asterisks without text labels, and chart data
            series differentiated only by color without patterns. The fix is always to provide
            a second visual channel: text labels, icons, underlines, patterns, or shape differences.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: How would you build contrast checking into a design system?</h3>
          <p>
            Systematic approach: (1) Define all foreground/background token pairs in the design
            system specification. (2) Write automated tests that calculate contrast for every
            defined pair and assert WCAG AA compliance. (3) Run these tests in CI so contrast
            regressions block deployment. (4) Provide Figma/design tool plugins that flag contrast
            issues during design. (5) Document approved color pairings in the component library.
            (6) For dynamic content (user-selected colors, themes), provide runtime contrast
            checking utilities and fallback mechanisms. (7) Generate contrast matrices showing
            which token combinations pass/fail at each level.
          </p>
        </div>

        <div className="my-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-2 font-semibold">Q: What is APCA and how does it improve on WCAG 2.x contrast?</h3>
          <p>
            APCA (Advanced Perceptual Contrast Algorithm) is the proposed replacement for WCAG 2.x
            contrast calculation in WCAG 3.0. Key improvements: (1) It accounts for font size and
            weight — larger, bolder text can use lower contrast. (2) It handles polarity — the
            required contrast differs for light-on-dark vs. dark-on-light. (3) It better models
            human spatial vision, reducing false positives (colors that pass WCAG 2.x but look
            bad) and false negatives (colors that fail WCAG 2.x but are actually readable).
            (4) Instead of a single threshold, APCA uses a lookup table indexed by font
            size/weight. It&apos;s not yet a standard, so current legal compliance still requires
            WCAG 2.x ratios.
          </p>
        </div>
      </section>

      {/* ─── Section 9: References & Further Reading ─── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 1.4.3: Contrast (Minimum)
            </a>{" "}
            — Official guidance on text contrast requirements.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Understanding WCAG 1.4.11: Non-text Contrast
            </a>{" "}
            — Requirements for UI component and graphical object contrast.
          </li>
          <li>
            <a href="https://git.apcacontrast.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              APCA Contrast Calculator
            </a>{" "}
            — Advanced Perceptual Contrast Algorithm, the proposed WCAG 3.0 method.
          </li>
          <li>
            <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              WebAIM Contrast Checker
            </a>{" "}
            — Simple tool for checking WCAG contrast compliance.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              MDN: forced-colors Media Query
            </a>{" "}
            — CSS support for Windows High Contrast Mode.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

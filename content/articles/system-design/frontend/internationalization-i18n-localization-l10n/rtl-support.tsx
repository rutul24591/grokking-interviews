"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-rtl-support",
  title: "RTL (Right-to-Left) Support",
  description:
    "Comprehensive guide to RTL Support covering layout mirroring, CSS logical properties, bidirectional text, and production-scale RTL implementation patterns.",
  category: "frontend",
  subcategory: "internationalization-i18n-localization-l10n",
  slug: "rtl-support",
  wordCount: 5400,
  readingTime: 21,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "i18n",
    "RTL",
    "right-to-left",
    "CSS logical properties",
    "bidirectional",
  ],
  relatedTopics: [
    "multi-language-support",
    "date-time-number-formatting",
    "locale-detection",
  ],
};

export default function RTLSupportArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>RTL (Right-to-Left) support</strong> enables applications to
          display content correctly for languages that read right-to-left,
          primarily Arabic, Hebrew, Persian (Farsi), and Urdu. RTL is not just
          about text alignment — it requires mirroring the entire layout:
          navigation moves from right to left, icons flip direction, animations
          reverse, and the visual hierarchy reflects RTL reading patterns. Over
          600 million people worldwide use RTL languages, making RTL support a
          significant accessibility and market requirement.
        </p>
        <p>
          For staff-level engineers, RTL implementation involves architectural
          decisions about CSS strategy (logical properties vs. directional
          classes), component design (building direction-agnostic components),
          and testing (ensuring layouts work in both LTR and RTL). The key
          insight: RTL is not a &quot;theme&quot; to apply — it&apos;s a
          fundamental layout direction that affects every component. Building
          RTL support after launch requires extensive refactoring; planning for
          bidirectional support from the start is significantly more efficient.
        </p>
        <p>
          RTL support involves several technical challenges. <strong>Layout
          mirroring</strong> — flipping horizontal positioning (left becomes
          right, margin-left becomes margin-right). <strong>CSS logical
          properties</strong> — using <code>margin-inline-start</code> instead
          of <code>margin-left</code> for automatic direction handling.{" "}
          <strong>Bidirectional text</strong> — handling mixed LTR/RTL content
          (English words in Arabic text, numbers, URLs). <strong>Icon
          flipping</strong> — directional icons (arrows, chevrons) need to
          mirror, but non-directional icons (close, search) should not.
        </p>
        <p>
          The business case for RTL support is clear: Middle Eastern markets
          (Saudi Arabia, UAE, Israel) represent significant revenue
          opportunities. Government and enterprise customers in RTL regions
          often require RTL support for procurement. Additionally, RTL support
          improves accessibility for all users — logical properties and
          bidirectional handling benefit screen readers and assistive
          technologies regardless of language.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Direction (dir attribute):</strong> HTML{" "}
            <code>dir</code> attribute sets base direction:{" "}
            <code>dir=&quot;ltr&quot;</code> (default) or{" "}
            <code>dir=&quot;rtl&quot;</code>. This affects text alignment,
            scrollbar position, and CSS logical property resolution. Set on{" "}
            <code>&lt;html&gt;</code> for page-level, or on any element for
            section-level direction.
          </li>
          <li>
            <strong>CSS Logical Properties:</strong> Direction-aware CSS
            properties that automatically adapt to LTR/RTL. Examples:{" "}
            <code>margin-inline-start</code> (left in LTR, right in RTL),{" "}
            <code>padding-inline-end</code>, <code>inset-inline-start</code>,{" "}
            <code>border-block-start</code>. Modern browsers have excellent
            support; use with autoprefixer for older browser fallbacks.
          </li>
          <li>
            <strong>Bidirectional Algorithm (Unicode Bidi):</strong> Unicode
            defines how mixed LTR/RTL text is displayed. Numbers and Latin text
            embedded in Arabic are displayed LTR within the RTL flow. The
            algorithm handles complex cases like nested directions. CSS{" "}
            <code>unicode-bidi</code> and <code>direction</code> properties
            control this behavior.
          </li>
          <li>
            <strong>Icon Flipping:</strong> Directional icons (arrows,
            chevrons, back buttons) should mirror in RTL. Non-directional icons
            (close X, search magnifier, home) should not flip. Implement via CSS
            <code>transform: scaleX(-1)</code> for RTL, or use separate icon
            assets.
          </li>
          <li>
            <strong>Scrollbar Position:</strong> In RTL, scrollbars appear on
            the left side (browser-dependent). This affects layout calculations
            and fixed-position elements. Test across browsers — Chrome,
            Firefox, and Safari handle RTL scrollbars differently.
          </li>
          <li>
            <strong>Text Alignment:</strong> RTL text is right-aligned by
            default when <code>dir=&quot;rtl&quot;</code>. Avoid explicit{" "}
            <code>text-align: left</code> or <code>text-align: right</code> —
            use <code>text-align: start</code> and{" "}
            <code>text-align: end</code> for logical alignment.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/rtl-layout-mirroring.svg"
          alt="RTL Layout Mirroring showing LTR vs RTL layout comparison"
          caption="RTL layout mirroring — navigation, margins, padding, and icons flip horizontally while content structure remains the same"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          RTL architecture consists of a direction detection mechanism (from
          locale or user preference), CSS strategy (logical properties or
          directional classes), component patterns (direction-agnostic design),
          and testing infrastructure (visual regression for both directions).
          The architecture must handle dynamic direction switching and ensure
          consistent behavior across all components.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/css-logical-properties.svg"
          alt="CSS Logical Properties showing physical vs logical property mapping"
          caption="CSS logical properties — physical properties (left, right) map to logical properties (inline-start, inline-end) that adapt to direction"
          width={900}
          height={500}
        />

        <h3>CSS Strategy Comparison</h3>
        <p>
          <strong>Logical Properties (Recommended):</strong> Use{" "}
          <code>margin-inline-start</code>, <code>padding-inline-end</code>,{" "}
          <code>inset-inline-start</code>. Advantages: automatic RTL handling,
          cleaner CSS, future-proof. Limitations: requires PostCSS autoprefixer
          for older browsers, learning curve for team.
        </p>
        <p>
          <strong>Directional Classes:</strong> Use{" "}
          <code>.ltr .ml-4</code> and <code>.rtl .mr-4</code> patterns.
          Advantages: explicit control, works everywhere. Limitations: doubles
          CSS rules, error-prone, harder to maintain.
        </p>
        <p>
          <strong>CSS-in-JS Solutions:</strong> Libraries like styled-components
          with RTL plugins. Advantages: automatic mirroring, collocated styles.
          Limitations: runtime overhead, library-specific.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/rtl-implementation-strategies.svg"
          alt="RTL Implementation Strategies comparing logical properties, directional classes, and CSS-in-JS approaches"
          caption="RTL implementation strategies — logical properties (recommended, automatic), directional classes (explicit, verbose), CSS-in-JS (automatic, runtime)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          RTL implementation involves trade-offs between automation, control,
          and browser support.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/internationalization-i18n-localization-l10n/bidirectional-text-handling.svg"
          alt="Bidirectional Text Handling showing mixed LTR/RTL content rendering"
          caption="Bidirectional text — Unicode Bidi algorithm handles mixed content (Arabic with English words, numbers, URLs) correctly"
          width={900}
          height={550}
        />

        <h3>Icon Flipping Strategies</h3>
        <p>
          <strong>CSS Transform:</strong>{" "}
          <code>[dir=&quot;rtl&quot;] .arrow {`{ transform: scaleX(-1); }`}</code>.
          Advantages: simple, no asset duplication. Limitations: affects all
          children, may break complex icons.
        </p>
        <p>
          <strong>Separate Assets:</strong> Different icon files for LTR/RTL.
          Advantages: precise control, optimized icons. Limitations: doubles
          asset count, harder to maintain.
        </p>
        <p>
          <strong>Icon Library Support:</strong> Libraries like Lucide, Heroicons
          with RTL-aware components. Advantages: built-in handling, consistent.
          Limitations: limited to library icons.
        </p>

        <h3>Testing Approaches</h3>
        <p>
          <strong>Visual Regression:</strong> Screenshot comparison for LTR/RTL.
          Tools: Percy, Chromatic, Playwright screenshots. Catch layout breaks
          automatically.
        </p>
        <p>
          <strong>Manual RTL Testing:</strong> Switch browser to RTL language
          (Arabic, Hebrew), verify all pages. Time-consuming but catches edge
          cases automated tools miss.
        </p>
        <p>
          <strong>Automated RTL Tests:</strong> Jest/Cypress tests that verify
          direction-specific behavior (icon flipping, text alignment). Ensure
          programmatic correctness.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Logical Properties from Start:</strong>{" "}
            <code>margin-inline-start</code> not <code>margin-left</code>,{" "}
            <code>padding-inline-end</code> not <code>padding-right</code>. This
            makes RTL support automatic — just change <code>dir</code> attribute.
            Use PostCSS autoprefixer for browser fallbacks.
          </li>
          <li>
            <strong>Set HTML Direction Attribute:</strong>{" "}
            <code>&lt;html lang=&quot;ar&quot; dir=&quot;rtl&quot;&gt;</code>.
            This sets base direction for entire page. For mixed-direction
            pages, set <code>dir</code> on section-level containers.
          </li>
          <li>
            <strong>Flip Directional Icons Only:</strong> Arrows, chevrons, and
            navigation icons should flip. Close buttons, search icons, and
            decorative icons should not. Create a list of &quot;flip&quot; vs
            &quot;no-flip&quot; icons for consistency.
          </li>
          <li>
            <strong>Test with Real RTL Content:</strong> Don&apos;t test with
            &quot;Lorem ipsum&quot; in RTL mode — use actual Arabic or Hebrew
            text. Real content reveals issues with line height, word breaks,
            and font rendering.
          </li>
          <li>
            <strong>Handle Numbers Carefully:</strong> Numbers are LTR even in
            RTL text. Use <code>unicode-bidi</code> CSS property for complex
            cases. Test phone numbers, dates, and currency in RTL context.
          </li>
          <li>
            <strong>Consider RTL in Component Design:</strong> Design components
            that work in both directions. Avoid assumptions about &quot;left is
            start&quot;. Use flexbox and grid with logical properties for
            automatic adaptation.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Forgetting to Flip Icons:</strong> Back arrows pointing
            wrong direction confuse RTL users. Audit all icons — create a
            checklist of directional vs. non-directional icons.
          </li>
          <li>
            <strong>Hardcoded Left/Right Values:</strong>{" "}
            <code>left: 0</code>, <code>right: 16px</code> break in RTL. Use
            logical properties (<code>inset-inline-start</code>) or CSS
            variables that flip based on direction.
          </li>
          <li>
            <strong>Ignoring Scrollbar Position:</strong> RTL scrollbars are on
            the left, affecting fixed elements and layout calculations. Test
            fixed headers, sidebars, and modals in RTL.
          </li>
          <li>
            <strong>Mixed Direction Content Issues:</strong> English words in
            Arabic text can display incorrectly. Use{" "}
            <code>&lt;span lang=&quot;en&quot; dir=&quot;ltr&quot;&gt;</code>{" "}
            for embedded LTR content.
          </li>
          <li>
            <strong>Not Testing RTL During Development:</strong> RTL bugs
            compound over time. Set up RTL testing early — add Arabic/Hebrew to
            your locale switcher and test every PR.
          </li>
          <li>
            <strong>Forgetting Animations:</strong> Slide-in animations,
            progress indicators, and carousels should reverse direction in RTL.
            Animate from right to left, not left to right.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce for Middle Eastern Markets</h3>
        <p>
          E-commerce sites targeting Saudi Arabia, UAE, and Egypt require full
          RTL support. Product pages, checkout flow, and account management must
          all mirror correctly. Critical: payment forms, address fields, and
          order confirmations must handle Arabic text and RTL formatting.
          Currency displays (SAR, AED, EGP) must align correctly with RTL text.
        </p>

        <h3>Government and Enterprise Applications</h3>
        <p>
          Government portals in Israel, Arab nations, and Pakistan require RTL
          for citizen services. Enterprise applications for multinational
          companies need RTL for regional offices. Compliance requirements often
          mandate RTL support for procurement eligibility.
        </p>

        <h3>News and Media Websites</h3>
        <p>
          News sites like Al Jazeera, Haaretz, and Dawn serve RTL audiences.
          Articles mix RTL text with LTR elements (quotes, embedded tweets,
          video players). Complex layouts with sidebars, related articles, and
          comments must all mirror correctly.
        </p>

        <h3>Social Media Platforms</h3>
        <p>
          Social platforms (Twitter, Facebook, Instagram) handle user-generated
          content in mixed directions. A single post might contain Arabic text,
          English hashtags, and URLs. Bidirectional text handling is critical
          for correct display and editing.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement RTL support in a React application?
            </p>
            <p className="mt-2 text-sm">
              A: Set up direction at the root level: detect locale, map to
              direction (ar, he, fa → rtl), set{" "}
              <code>&lt;html dir=&quot;rtl&quot; lang=&quot;ar&quot;&gt;</code>.
              Use CSS logical properties throughout (margin-inline-start,
              padding-inline-end). For existing codebases, use PostCSS plugins
              like postcss-rtl to auto-convert. Test with real RTL content, not
              just mirrored LTR. Handle icon flipping via CSS or component
              props.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are CSS logical properties and why should you use them?
            </p>
            <p className="mt-2 text-sm">
              A: Logical properties replace physical directions (left/right)
              with flow-relative terms (inline-start/inline-end,
              block-start/block-end). <code>margin-inline-start</code> is
              left in LTR, right in RTL. <code>padding-block-start</code> is
              top in both. Benefits: automatic RTL support, cleaner CSS,
              future-proof. Browser support is excellent; use autoprefixer for
              older browsers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle bidirectional text (mixed LTR/RTL)?
            </p>
            <p className="mt-2 text-sm">
              A: Unicode Bidi algorithm handles most cases automatically. For
              embedded LTR content in RTL (English words in Arabic), use{" "}
              <code>&lt;span lang=&quot;en&quot;
              dir=&quot;ltr&quot;&gt;</code>. CSS{" "}
              <code>unicode-bidi: isolate</code> prevents bleed. For numbers,
              use <code>dir=&quot;auto&quot;</code> to let browser decide. Test
              edge cases: URLs in Arabic text, phone numbers, mixed
              punctuation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Which icons should flip in RTL and which should not?
            </p>
            <p className="mt-2 text-sm">
              A: Flip directional icons: back/forward arrows, chevrons
              (left/right), navigation indicators, progress arrows. Don&apos;t
              flip: close (X), search (magnifier), home, settings, user icons,
              decorative icons. Rule of thumb: if the icon implies horizontal
              direction, flip it. If it&apos;s symmetrical or abstract,
              don&apos;t. Document your icon flipping rules for consistency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you test RTL implementation effectively?
            </p>
            <p className="mt-2 text-sm">
              A: Multi-layered approach: (1) Visual regression testing with
              Percy/Chromatic for LTR/RTL comparison. (2) Manual testing in
              Arabic/Hebrew — switch browser language, navigate all flows. (3)
              Automated tests for direction-specific behavior (icon flipping,
              alignment). (4) Real device testing — RTL scrollbar behavior
              varies by browser/OS. (5) Accessibility testing — screen readers
              handle RTL differently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle RTL in CSS-in-JS or utility frameworks like
              Tailwind?
            </p>
            <p className="mt-2 text-sm">
              A: For Tailwind: use logical property plugins
              (tailwindcss-rtl) or custom utilities (ml-rtl, mr-rtl). For
              CSS-in-JS: styled-components has rtl plugin, Emotion supports
              logical properties natively. Alternative: use CSS variables for
              directional values ({`--spacing-start: 1rem`}) and flip via
              direction-aware stylesheets. Key: pick one strategy and apply
              consistently.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/International/questions/qa-html-dir"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — HTML Direction Attribute
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — CSS Logical Properties
            </a>
          </li>
          <li>
            <a
              href="https://rtlstyling.com/posts/rtl-styling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              RTL Styling — Complete Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/International/articles/inline-bidi-markup/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Bidirectional Text Handling
            </a>
          </li>
          <li>
            <a
              href="https://postcss.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              PostCSS RTL Plugins
            </a>
          </li>
          <li>
            <a
              href="https://tailwindcss.com/docs/rtl-support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Tailwind CSS — RTL Support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

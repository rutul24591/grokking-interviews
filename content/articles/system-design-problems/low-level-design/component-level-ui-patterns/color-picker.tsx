"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-color-picker",
  title: "Design a Color Picker Component",
  description:
    "Color picker with alpha support, saved palettes, accessible contrast preview, and keyboard navigation.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "color-picker",
  wordCount: 3200,
  readingTime: 17,
  lastUpdated: "2026-04-03",
  tags: ["lld", "color-picker", "alpha", "palettes", "contrast", "accessibility", "keyboard"],
  relatedTopics: ["theme-theming-system", "avatar-component", "rating-stars-component"],
};

export default function ColorPickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">We need to design a color picker component — a UI control for selecting colors
          via visual interaction (hue-saturation area, alpha slider) or manual input
          (hex, RGB, HSL).</HighlightBlock>
<HighlightBlock as="p" tier="important">The picker supports saved palettes, real-time contrast
          checking against a background color for accessibility compliance, and full
          keyboard navigation.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Assumptions:</strong> The picker supports HSV color space for the
          visual area, with conversion to/from hex, RGB, and HSL. Alpha channel is
          supported via a separate slider. Saved palettes persist to localStorage.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Hue-Saturation Area:</strong> 2D color area — X axis = saturation, Y axis = value (brightness). Draggable selector.</HighlightBlock>
          <li><strong>Hue Slider:</strong> Horizontal rainbow gradient slider for hue selection.</li>
          <li><strong>Alpha Slider:</strong> Transparency slider with checkerboard background.</li>
          <li><strong>Manual Input:</strong> Hex input field, RGB sliders (R, G, B), HSL sliders (H, S, L).</li>
          <li><strong>Saved Palettes:</strong> Save current color to palette, load from palette, delete from palette.</li>
          <HighlightBlock as="li" tier="important"><strong>Contrast Checker:</strong> Real-time WCAG contrast ratio against a background color. Shows AA/AAA pass/fail.</HighlightBlock>
          <li><strong>Color Formats:</strong> Display and convert between hex, RGB, HSL, and HSV.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Performance:</strong> HSV area renders as a canvas element for smooth gradient. Pointer drag at 60fps.</HighlightBlock>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> Keyboard navigation through all controls. Screen reader announces color value in hex.</HighlightBlock>
          <li><strong>Precision:</strong> Hex input validates 3- or 6-character hex codes.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Invalid hex input (e.g., &quot;ZZZZZZ&quot;) — show error, revert to last valid value.</li>
          <li>Alpha = 0 — fully transparent, checkerboard pattern shows through.</li>
          <li>Contrast check against transparent background — show &quot;N/A&quot; instead of a ratio.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The core idea is an <Highlight tier="important"><strong>HSV color model</strong></Highlight> as the internal
          representation (easiest for visual manipulation), with bidirectional conversion
          to hex, RGB, and HSL for display and input.</HighlightBlock>
<HighlightBlock as="p" tier="crucial">The hue-saturation area renders as
          a canvas with a 2D gradient. Pointer drag updates HSV values. Sliders for hue
          and alpha update the color. A <strong>Zustand store</strong> manages the
          current color, saved palettes, and contrast background color.</HighlightBlock>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Color Conversion Library</h4>
          <HighlightBlock as="p" tier="important">Pure functions: HSV ↔ RGB, RGB ↔ HSL, RGB ↔ Hex. All conversions are lossless (except 3-digit hex shorthand).</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Contrast Checker</h4>
          <HighlightBlock as="p" tier="important">WCAG 2.1 relative luminance calculation, contrast ratio formula, AA/AAA compliance check for normal and large text.</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Color Picker Store</h4>
          <HighlightBlock as="p" tier="important">Zustand store: current HSV color, alpha value, saved palettes (array of hex strings), contrast background color.</HighlightBlock>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. HSV Area Renderer</h4>
          <HighlightBlock as="p" tier="crucial">Canvas element with 2D gradient: horizontal = saturation (left=gray, right=full), vertical = value (top=white, bottom=full). Draggable selector.</HighlightBlock>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/color-picker-architecture.svg"
          alt="Color picker architecture showing HSV color model, format conversion, and contrast checking"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>User clicks on HSV area → pointer position maps to S and V values → hue from hue slider.</li>
          <li>Store updates HSV → converts to hex, RGB, HSL → all displays update.</li>
          <li>User drags hue slider → hue value changes → HSV area re-renders with new hue gradient.</li>
          <li>Contrast checker computes ratio against background color → updates AA/AAA badges.</li>
          <li>User clicks &quot;Save to palette&quot; — current hex added to saved palette array.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          User interaction → HSV update → conversion to hex/RGB/HSL → all displays
          update → contrast check → UI update. Palette save → localStorage write.
        </HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important"><strong>Invalid hex:</strong> Hex input validates on blur. If invalid, reverts to last valid hex and shows error message.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Canvas rendering:</strong> On high-DPI displays, canvas is rendered at 2x resolution and scaled down via CSS for crisp rendering.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <HighlightBlock as="p" tier="crucial">The full production implementation is available in the <strong>Example tab</strong>.
          Key</HighlightBlock>
<HighlightBlock as="p" tier="important">approach: HSV as internal color model, canvas-based HSV area rendering,
          WCAG contrast ratio</HighlightBlock>
<HighlightBlock as="p" tier="important">computation, localStorage palette persistence, and full
          keyboard navigation with arrow key control.</HighlightBlock>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <HighlightBlock as="div" tier="crucial" className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <HighlightBlock as="tr" tier="important"><td className="p-2">Color conversion</td><td className="p-2">O(1) — arithmetic</td><td className="p-2">O(1)</td></HighlightBlock>
              <HighlightBlock as="tr" tier="important"><td className="p-2">Contrast ratio</td><td className="p-2">O(1) — luminance calculation</td><td className="p-2">O(1)</td></HighlightBlock>
              <HighlightBlock as="tr" tier="important"><td className="p-2">Canvas render</td><td className="p-2">O(w × h) — pixel fill</td><td className="p-2">O(w × h) — canvas buffer</td></HighlightBlock>
            </tbody>
          </table>
        </HighlightBlock>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Hex input is validated before processing — no injection risk. For accessibility,
          each slider has an associated</HighlightBlock>
<HighlightBlock as="p" tier="important">label, arrow keys adjust values (1 unit per press,
          10 with Shift), and the current color is announced to screen</HighlightBlock>
<HighlightBlock as="p" tier="important">readers as a hex
          value. The contrast checker uses <code>aria-live</code> to announce AA/AAA
          status changes.</HighlightBlock>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Unit:</strong> Color conversions — test round-trip HSV→RGB→Hex→HSV with known values. Contrast ratio — test against WCAG test cases.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Integration:</strong> Drag HSV area, verify hex updates. Change hue slider, verify HSV area re-renders. Save to palette, verify persistence.</HighlightBlock>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> Keyboard navigation through all controls, screen reader announces color value, contrast status announced.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="important"><strong>Using RGB for visual manipulation:</strong> RGB is not intuitive for users. HSV (hue, saturation, value) maps directly to the visual color area.</HighlightBlock>
          <li><strong>No alpha support:</strong> Modern designs require transparency. Alpha slider with checkerboard preview is essential.</li>
          <li><strong>No contrast checking:</strong> Selecting a color that fails WCAG contrast is a common design mistake. Built-in contrast checker prevents this.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement an eyedropper (color picker from screen)?</p>
            <HighlightBlock as="p" tier="crucial" className="mt-2 text-sm">
              A: Use the EyeDropper API (Chrome 95+). <code>new EyeDropper().open()</code>
              returns a promise with the selected hex color. Fallback for unsupported
              browsers: instruct user to use OS-level color picker.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you support colorblind-friendly palettes?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Offer a &quot;colorblind-safe&quot; mode that restricts the palette to
              colors distinguishable by common types of color blindness (deuteranopia,
              protanopia, tritanopia). Use simulation matrices to filter out
              indistinguishable color pairs.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement a gradient picker (for CSS gradients)?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Extend the color picker to support multiple color stops. Each stop has
              a color (selected via the color picker) and a position (0-100%). The
              gradient preview renders a linear gradient with all stops. Users can add,
              remove, and reposition stops via drag.
            </HighlightBlock>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you sync color selection across multiple users in real-time?</p>
            <HighlightBlock as="p" tier="important" className="mt-2 text-sm">
              A: Broadcast the current HSV color via WebSocket. Each user&apos;s selection
              is shown as a colored dot with their name on the HSV area. Use last-write-wins
              for the shared color, or maintain per-user colors for collaborative design
              tools.
            </HighlightBlock>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WCAG 2.1 — Contrast Ratio Requirements
            </a>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/HSL_and_HSV" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Wikipedia — HSL and HSV Color Spaces
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — EyeDropper API
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}

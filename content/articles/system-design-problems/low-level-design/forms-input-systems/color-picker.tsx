"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-color-picker",
  title: "Design a Color Picker",
  description:
    "LLD for an accessible Color Picker with HSV/HSL/RGB/HEX, alpha, eyedropper, saved palettes, and contrast preview against a reference background.",
  category: "low-level-design",
  subcategory: "forms-input-systems",
  slug: "color-picker",
  wordCount: 5700,
  readingTime: 30,
  lastUpdated: "2026-04-28",
  tags: ["lld", "color-picker", "accessibility", "wcag", "react"],
  relatedTopics: ["form-builder", "theme-theming-system"],
};

export default function ColorPickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a Color Picker — a control that lets
          users select a color via a 2D saturation/value area, a
          hue slider, an alpha slider, numeric inputs across
          formats (HEX, RGB, HSL, HSV), saved palettes, an
          optional eyedropper, and a contrast preview that helps
          meet WCAG against a reference background. The control
          integrates into form runtimes as a custom field type
          and into theming editors as a primary editing surface.
        </p>
        <p>
          The hard problems are conversion precision across color
          models without flicker or drift; making a 2D area
          accessible (the WAI-ARIA &ldquo;2D slider&rdquo; pattern is
          subtle); handling pointer drag across boundaries; gating
          eyedropper feature-detection without leaving disabled
          buttons that confuse users; and computing WCAG contrast
          live without freezing the UI on each pixel of drag.
        </p>

        <h3>User Context</h3>
        <p>
          Designers and end users customize themes, brand colors,
          annotation colors, and visualization palettes. Power
          users want quick keyboard input, alpha control, and
          accurate contrast feedback; casual users want presets
          and a simple visual pick. Engineers consume the control
          through the form runtime as a field type or directly
          in theme editors.
        </p>

        <h3>Assumptions</h3>
        <p>
          Color values are stored canonically as RGBA in the
          [0..1] range to preserve precision across format
          conversions. Display values are derived per the
          user-selected format (HEX, RGB, HSL, HSV). Modern
          browsers, with the EyeDropper API available where
          supported (Chromium-based at the time of writing).
          Wide-gamut display support is best-effort; we clamp
          to sRGB by default and surface gamut warnings only when
          explicitly enabled.
        </p>

        <h3>Non-Goals</h3>
        <p>
          Image-based palette extraction (an image-color
          extraction utility), gradient or multi-stop editing,
          and color blindness simulation overlays are separate
          tools. Full ICC color management is out of scope; we
          assume sRGB for display.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          2D SV area, 1D hue slider (0–360°), 1D alpha slider
          (0–1) with checkerboard background to communicate
          transparency. Numeric inputs with format toggle (HEX,
          RGB, HSL, HSV); each format is editable and the others
          update live. Eyedropper button when supported. Saved
          palette persisted per user. Recent colors per session.
          Contrast preview against a configurable reference color
          (foreground vs background) with WCAG AA/AAA badges.
          Full keyboard support on all sliders and the SV area.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          OKLCH/OKLab perceptual mode for designers who care about
          perceptual uniformity. CSS Color Module Level 4 syntax
          parsing (<code>rgb(R G B / A)</code>, <code>oklch(...)</code>).
          Image-based palette extraction (drop an image, get its
          dominant colors). Color name suggestions (CSS named
          colors, Pantone-style suggestions where licensed).
        </p>

        <h3>Out of Scope</h3>
        <p>
          Gradient editing, color management with ICC profiles,
          and pixel-perfect color matching against a reference
          image are not concerns of this control.
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Pointer drag updates must stay under 16 ms per frame.
          Format conversions are pure functions; they run on each
          drag move but are cheap (microseconds). The SV area
          uses CSS gradients for the background, so no canvas
          repaint is needed during drag — the only thing that
          moves is the cursor handle.
        </p>

        <h3>Reliability</h3>
        <p>
          Numeric inputs round-trip without precision loss when
          the canonical value is held internally as floats.
          Switching formats and back must not drift the value.
          Pointer drag that goes outside the SV area boundary
          must clamp gracefully without losing the drag.
        </p>

        <h3>Security</h3>
        <p>
          Strict parsers reject unparseable strings rather than
          guessing. CSS color names that map to host
          environments (<code>currentColor</code>) are not
          accepted unless explicitly enabled. The
          EyeDropper API is gated behind a feature detection
          and a permission prompt; we never assume it&rsquo;s
          available.
        </p>

        <h3>Accessibility</h3>
        <p>
          Full keyboard support on every interactive surface,
          including the 2D SV area. Sliders use ARIA value
          semantics; the SV area implements the 2D slider
          pattern with
          <code> aria-valuetext</code> describing both axes.
          Numeric inputs are properly labeled. Format toggle is
          a radio group. Contrast badges have text equivalents
          for screen readers.
        </p>

        <h3>Maintainability</h3>
        <p>
          Color models are isolated in a <code>colorMath</code>
          module with pure functions for every conversion.
          UI components consume canonical RGBA only; conversions
          happen at the boundary. Adding a new format (e.g.
          OKLCH) is a one-file addition: implement the
          conversion, register in the format toggle.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The picker is built on three architectural decisions
          that reinforce each other: <strong>canonical RGBA
          storage with derived everything</strong>,
          <strong> CSS-gradient SV area</strong> for cheap drag,
          and <strong>headless core hook</strong> exposing state
          and handlers to any visual layer.
        </p>
        <p>
          <strong>Canonical RGBA storage</strong> is the
          foundation. Internally, the picker stores
          <code> {`{ r, g, b, a }`}</code> in [0..1] floats.
          Every other format (HEX, HSL, HSV) is derived on
          demand. This eliminates the &ldquo;HSL ↔ RGB conversion
          drift&rdquo; bug class: if you store HSL and convert to
          RGB on display, then the user types into the RGB input
          and you convert back to HSL, the value drifts due to
          rounding. Storing RGB as the canonical and deriving
          HSL only for display avoids this entirely. HEX is
          another derivation; numeric inputs across all formats
          edit by parsing into RGBA and writing the canonical
          value.
        </p>
        <p>
          The <strong>SV area</strong> renders its background as
          two stacked CSS gradients: a horizontal saturation
          gradient (white to fully saturated hue) over a vertical
          value gradient (hue overlay to black). The overlay
          algebra is fixed and renders entirely in CSS, so the
          area is essentially free to draw and never repaints
          during interaction. Only the cursor handle moves
          during drag, which is a single transform on a small
          element. We change the hue gradient&rsquo;s color when
          the hue slider changes, but the SV area itself is
          static for a given hue.
        </p>
        <p>
          On <strong>pointer down</strong> on the SV area, we
          capture the pointer (<code>setPointerCapture</code>),
          compute the position relative to the area&rsquo;s
          bounding rect, and translate to (S, V). On
          <strong> pointer move</strong>, we throttle via
          <code> requestAnimationFrame</code> and update (S, V)
          → derive RGBA via HSV→RGB → emit via
          <code> onChange</code>. The cursor handle
          updates via <code>transform: translate(...)</code>.
          On <strong>pointer up</strong>, we release capture
          and commit the value (which may trigger a debounced
          parent <code>onChange</code> if the parent
          requested debounced commits).
        </p>
        <p>
          On <strong>keyboard interaction</strong> on the SV
          area, arrow keys move the (S, V) point by a configurable
          step (default 0.01); Shift+arrow moves by a larger step
          (0.1); Page Up/Down jumps to extremes. We expose this
          through <code>aria-valuetext</code>: &ldquo;Saturation
          82%, value 67%&rdquo;, formatted via
          <code> Intl.NumberFormat</code> for locale-correct
          numbers.
        </p>
        <p>
          The <strong>hue slider</strong> and{" "}
          <strong>alpha slider</strong> are implemented either as
          native <code>{`<input type="range">`}</code> visually
          customized via CSS, or as custom sliders with proper
          ARIA. We prefer the native input where possible
          because it gets keyboard, screen reader, and
          high-contrast-mode handling for free.
        </p>
        <p>
          <strong>Numeric inputs</strong> across formats are
          editable. Each format input parses on blur (or on
          Enter), updates the canonical RGBA, and other formats
          re-derive. We display values rounded to display
          precision (HEX is exact; RGB shows integers; HSL/HSV
          show one decimal) but keep full precision internally.
          This is what avoids the round-trip drift bug — display
          rounds; canonical doesn&rsquo;t.
        </p>
        <p>
          The <strong>eyedropper</strong> is feature-detected.
          When <code>window.EyeDropper</code> exists, we render
          the eyedropper button; otherwise we hide it (rather
          than showing a disabled button, which would confuse
          users). On click, we call
          <code> new EyeDropper().open()</code>, which returns a
          color in HEX; we convert to canonical RGBA. The user
          must grant permission in some browsers; we handle
          rejection by simply not updating, with no error UI
          unless the user explicitly tried to act.
        </p>
        <p>
          <strong>Contrast preview</strong> computes WCAG 2.x
          contrast ratio between the canonical color and a
          configurable reference color. The math (relative
          luminance of each color, ratio = (L1+0.05)/(L2+0.05))
          runs in microseconds; we update on every value change
          with no perf concern. We render a badge with the
          ratio (&ldquo;4.6 : 1&rdquo;) and pass/fail state for
          AA-normal, AA-large, and AAA. Where the API supports
          it, we offer APCA (the upcoming standard) as a
          secondary option, since WCAG 2.x has known limitations.
        </p>
        <p>
          The <strong>palette and recents</strong> persist
          locally. Recents are session-only (localStorage,
          most-recent-N). Saved palettes are user-scoped (server
          if authenticated, localStorage as fallback). We expose
          add-to-palette and remove-from-palette actions in the
          UI; the palette is a registered field on the user
          profile in authenticated apps.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/color-picker-architecture.svg"
        alt="Color Picker Architecture"
        caption="Canonical RGBA float storage; HSV / HSL / HEX derived on demand. SV area + hue + alpha + format inputs all bind to the same canonical value through pure converters, with EyeDropper feature-detected and ContrastPreview computed live."
      />

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>ColorPicker</strong> is the container; owns
          canonical RGBA state, exposes
          <code> value</code>/<code>onChange</code>, mounts
          subcomponents.
        </p>
        <p>
          <strong>SVArea</strong> is the 2D slider for saturation
          and value. Implements pointer capture, keyboard
          movement, ARIA 2D slider pattern.
        </p>
        <p>
          <strong>HueSlider</strong> and{" "}
          <strong>AlphaSlider</strong> are 1D sliders. The alpha
          slider renders on a checkerboard background to
          communicate transparency. Both use native range inputs
          where possible.
        </p>
        <p>
          <strong>FormatToggle + FormatInputs</strong>: a radio
          group selecting HEX/RGB/HSL/HSV; the corresponding
          input(s) are editable. Inputs use strict validation
          and round-trip through canonical RGBA.
        </p>
        <p>
          <strong>Palette</strong> shows saved and recent colors
          as a grid of swatches. Each swatch is a button;
          activation selects that color.
        </p>
        <p>
          <strong>EyeDropper</strong> is a feature-detected
          button. Renders only when the API is available.
        </p>
        <p>
          <strong>ContrastPreview</strong> computes and displays
          the WCAG ratio against a reference color, with
          pass/fail badges.
        </p>
        <p>
          The architectural patterns are <strong>headless core
          hook</strong> (<code>useColorPicker</code>) returning
          state and helpers, <strong>single source of
          truth</strong> (canonical RGBA),
          <strong> derived state via pure converters</strong>{" "}
          (formats), and <strong>feature-detected
          subcomponents</strong> (eyedropper).
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Canonical state:{" "}
          <code>{`{ r, g, b, a }`}</code> in [0..1] floats.
          Derived state: HSV (computed from RGB on demand),
          HSL (same), HEX (same), each cached when inputs are
          referentially equal. UI-only state: active format,
          eyedropper status, palette open. The
          ColorPicker keeps a separate &ldquo;display
          string&rdquo; per format that the user can edit; on
          commit, the display string is parsed and the
          canonical value updates.
        </p>
        <p>
          Why separate display strings from canonical values?
          Because while the user is typing
          <code> #FF</code> they haven&rsquo;t finished a HEX
          string yet, and we don&rsquo;t want to interpret
          <code> #FF</code> as <code>#FFFFFF</code> mid-typing.
          The display string holds the in-progress text;
          parsing happens on blur or Enter.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>value</code>, <code>onChange</code>,
          <code> defaultValue</code>, <code>format</code>,
          <code> showAlpha</code>, <code>palette</code>,
          <code> referenceColor</code>,
          <code> contrastStandard</code> (WCAG2 or APCA).
          Output: canonical
          <code> rgba()</code> string by default, or a
          structured RGBA object via
          <code> onChange(value, formats)</code> where
          <code> formats</code> is the precomputed bag for
          consumers that want to skip re-converting.
        </p>
      </section>

      <section>
        <h2>⚡ Performance Strategy</h2>
        <p>
          The SV area background is a static CSS gradient for a
          given hue; only the handle moves during drag. Pointer
          move is throttled via
          <code> requestAnimationFrame</code> so updates align
          with frame boundaries. Format converters are pure and
          cheap; we run them on every change without concern.
          Memoized
          <code> Intl.NumberFormat</code> instances per locale
          for displaying numeric values. Persistence (recents,
          saved palettes) writes are debounced; we don&rsquo;t
          write on every drag, only on pointer up.
        </p>
      </section>

      <section>
        <h2>🎨 UI/UX Considerations</h2>
        <p>
          Hover preview lets users see a candidate color before
          committing; commit happens on pointer up to avoid
          performance-sensitive parents (theme editors that
          repaint the entire app on every change) from chugging
          on drag. Numeric values display rounded to display
          precision; full precision is held internally so
          repeated format switches don&rsquo;t drift the value.
          Contrast badge updates live but doesn&rsquo;t flash
          obnoxiously — we transition the color and ratio text
          smoothly. The alpha slider&rsquo;s checkerboard makes
          transparency visible at a glance, much clearer than a
          numeric value alone.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          The SV area implements the 2D slider pattern with
          <code> role=&quot;slider&quot;</code>,
          <code> aria-valuemin / max / now</code> on each axis
          (saturation and value), and
          <code> aria-valuetext</code> describing both axes
          combined (&ldquo;Saturation 82%, value 67%&rdquo;).
          Arrow keys move; Shift+arrow moves by larger steps;
          Page Up/Down jumps to extremes. The hue and alpha
          sliders use native range inputs where possible —
          they get keyboard, screen reader, and high-contrast
          mode for free. Numeric inputs are labeled with the
          format and channel (&ldquo;Red&rdquo;, &ldquo;Hue&rdquo;).
          The format toggle is a real radio group with proper
          labels. Contrast preview reports both the numeric
          ratio and a textual conclusion (&ldquo;Passes AA for
          normal text&rdquo;) so screen reader users get the
          same information visual users see in the badge.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Strict parsers reject unparseable strings rather than
          guessing. CSS color names that map to host
          environments (<code>currentColor</code>,
          <code> inherit</code>) are not accepted unless
          explicitly enabled — they would be confusing in a
          theming context where they have no defined value. Saved
          palettes are scoped per user and stored alongside user
          profile data; we never leak palettes across accounts.
          The eyedropper requires user consent; we never call it
          without an explicit user gesture.
        </p>
      </section>

      <section>
        <h2>🧪 Testing Strategy</h2>
        <p>
          Unit tests cover format conversions across the corner
          cases (R=G=B=0 has undefined hue; alpha=0 should not
          mutate RGB; HSV vs HSL boundary cases), contrast ratio
          math against the WCAG 2.x reference vectors, and
          parser correctness for HEX, RGB, HSL, HSV, and modern
          CSS Color Module Level 4 syntaxes. Integration tests
          drive keyboard interaction on the SV area, format
          toggle round-trips (RGB → HSL → HSV → RGB without
          drift), and persistence of palette and recents.
          Accessibility tests verify <code>aria-valuetext</code>
          on the SV area, label associations, and high-contrast
          mode rendering.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases &amp; Failure Handling</h2>
        <p>
          HSL ↔ RGB rounding loses precision: keep canonical RGB
          float; convert on demand; never convert HSL back to
          HSL via RGB. Alpha=0 with arbitrary RGB: we preserve
          the RGB even when alpha goes to 0 (so users can
          adjust transparency without losing their hue). Wide-
          gamut display: clamp to sRGB by default; flag when
          user explicitly enables P3 mode and input would
          exceed sRGB. Eyedropper unsupported: hide the button
          rather than disabling it. Pasted colors with whitespace
          and modern syntax (<code>rgb(R G B / A)</code>): the
          parser handles current CSS Color Module Level 4 syntax.
          Numeric input values out of range: clamp on commit
          with a brief inline note explaining the clamp. SV area
          drag that goes outside the bounding rect: pointer
          capture + clamp ensures the drag continues smoothly
          and the value stays within bounds.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability &amp; Extensibility</h2>
        <p>
          The headless core hook can power inline editors,
          popovers, modal dialogs, or completely custom UIs. The
          color model registry supports adding new formats (OKLCH,
          OKLab, Display P3) by implementing the
          conversion functions. Theming via design tokens; each
          subcomponent accepts <code>className</code> overrides.
          Persistence is pluggable: localStorage by default,
          server-side via an injectable adapter for authenticated
          apps.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Format labels, channel names, and badges resolve through
          the host&rsquo;s i18n function. Numeric inputs honor
          locale decimal separators (<code>0,5</code> in many
          European locales vs <code>0.5</code> in en-US). Contrast
          conclusion text (&ldquo;Passes AA&rdquo;) is localized.
          Color names (when offered) map per locale via a
          translated dictionary.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs &amp; Design Decisions</h2>

        <h3>Canonical RGB vs HSL</h3>
        <p>
          RGB is unambiguous and round-trip safe. HSL is more
          intuitive for editing hue and is what designers often
          think in, but storing HSL canonically and deriving RGB
          drifts on conversion. We chose RGB canonical and
          derive HSL on demand; the cost is that HSL editing
          requires re-deriving on every change, but that&rsquo;s
          microseconds.
        </p>

        <h3>CSS-gradient SV area vs canvas</h3>
        <p>
          CSS gradients are essentially free to render and don&rsquo;t
          repaint during drag. Canvas gives more flexibility (custom
          shapes, special effects) but adds repaint cost and
          accessibility complexity. We chose CSS gradients as
          the default; canvas is available for highly custom
          variants.
        </p>

        <h3>Precision vs UI rounding</h3>
        <p>
          Display values round (HEX exact, RGB integers, HSL/HSV
          one decimal); canonical values are floats. This
          separation prevents repeated format switches from
          drifting the value. Users see clean numbers; the engine
          maintains precision.
        </p>

        <h3>Inline vs popover</h3>
        <p>
          Inline takes more space but gives constant access; popover
          saves space but requires a portal and focus management.
          We support both via the same headless hook; consumers
          choose based on context. For form fields, popover is
          usually right; for theme editors, inline.
        </p>

        <h3>Native range input vs custom slider</h3>
        <p>
          Native range inputs get keyboard, screen reader, and
          high-contrast mode for free. They&rsquo;re harder to
          style consistently across browsers. We use native where
          we can match the design and a custom slider with proper
          ARIA when we can&rsquo;t. The trade-off is between
          implementation cost and styling flexibility; we pay
          the implementation cost only when needed.
        </p>

        <h3>WCAG 2.x vs APCA contrast</h3>
        <p>
          WCAG 2.x is the standard but has known limitations
          (it doesn&rsquo;t model how humans actually perceive
          contrast across hues). APCA is the proposed
          replacement and is more accurate, but not yet a
          formal standard. We default to WCAG 2.x for
          compatibility and offer APCA as an opt-in for
          design-conscious users.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Wide-gamut support (Display P3, Rec.2020) with explicit
          warnings when sRGB clamping would lose information.
          Color blindness simulation overlay so designers can
          preview their palette through deuteranopia or
          protanopia. Server-shared palettes for team theming
          tools. Image-based palette extraction. APCA as the
          default contrast standard once it&rsquo;s formalized.
          Native EyeDropper polyfill via screen capture API
          for browsers without EyeDropper support.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why store RGBA canonically and derive HSV?</strong>
          Storing one model and deriving others avoids round-trip
          drift on format switches. Storing HSL and converting to
          RGB and back loses precision via rounding; storing RGB
          and deriving HSL doesn&rsquo;t. RGB is also the model
          that matches display directly, so no extra conversion
          for rendering.
        </p>

        <p>
          <strong>2. How do you make the SV area accessible?</strong>{" "}
          Implement the WAI-ARIA 2D slider pattern: render as
          <code> role=&quot;slider&quot;</code> with
          <code> aria-valuemin/max/now</code> on each axis and
          <code> aria-valuetext</code> describing both axes
          combined. Arrow keys move; Shift+arrow moves larger
          steps; Page Up/Down to extremes. Pointer capture for
          drag.
        </p>

        <p>
          <strong>3. How do you avoid hue jitter when alpha
          changes?</strong> Preserve RGB values when alpha hits 0;
          don&rsquo;t snap RGB to a default. The user might still
          want to adjust other channels with alpha at 0; the
          intuitive behavior is that alpha is independent of
          hue.
        </p>

        <p>
          <strong>4. How is the contrast ratio computed?</strong>{" "}
          WCAG 2.x: compute relative luminance for each color
          (gamma-corrected linear weighting of R, G, B), then
          ratio = (L1 + 0.05) / (L2 + 0.05) with the lighter as
          L1. AA passes at 4.5:1 for normal text, 3:1 for large
          text; AAA passes at 7:1 normal, 4.5:1 large.
        </p>

        <p>
          <strong>5. How do you handle keyboard step sizes?</strong>{" "}
          Default arrow step is small (0.01 in [0..1] units) for
          fine adjustments; Shift+arrow is larger (0.1); Page
          Up/Down jumps to extremes. We expose step
          configuration so consumers can tune for their
          context.
        </p>

        <p>
          <strong>6. How do you support the EyeDropper API with
          graceful fallback?</strong> Feature-detect
          <code> window.EyeDropper</code>; render the button only
          when present. Don&rsquo;t show a disabled button — that
          confuses users into thinking the feature is broken
          rather than absent. On call, handle permission
          rejection silently (no error UI unless user
          explicitly tried to act).
        </p>

        <p>
          <strong>7. What happens to precision under repeated format
          switches?</strong> Canonical RGBA is held as floats;
          format conversions derive on demand. Switching HSL →
          HSV → HSL doesn&rsquo;t go through RGB and back; the
          canonical RGB doesn&rsquo;t change. Display values round
          for readability but don&rsquo;t affect the canonical
          state. So no drift.
        </p>

        <p>
          <strong>8. How would you add P3 support without breaking
          existing forms?</strong> Add a wide-gamut canonical
          mode opt-in via a prop or schema flag. By default,
          values stay sRGB and clamp on input; in wide-gamut
          mode, the canonical value can extend beyond sRGB and
          we surface a gamut warning when displays can&rsquo;t
          render. Form values still serialize to standard CSS
          syntax (now including <code>color()</code> notation
          for wide-gamut).
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A great Color Picker uses a{" "}
          <strong>single canonical color model (RGBA floats)</strong>,
          derives every format on demand, and exposes accessible
          1D and 2D sliders via the WAI-ARIA slider patterns.
          CSS-gradient backgrounds keep drag cheap, eyedropper
          and contrast preview turn the picker from a toy into a
          real design tool, and a headless core hook keeps it
          composable into theming editors, form fields, and
          annotation tools alike. The non-negotiables are
          canonical storage, separated focus and selection on
          2D slidesr, and feature-detection for optional
          surfaces. Get those right and the rest is presentation
          polish.
        </p>
      </section>
    </ArticleLayout>
  );
}

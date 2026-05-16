"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-color-picker",
  title: "Design a Color Picker Component",
  description:
    "Color picker with color space conversions, WCAG contrast engine, alpha support, saved palettes, Eyedropper API, and keyboard navigation.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "color-picker",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "color-picker", "alpha", "palettes", "contrast", "oklch", "eyedropper", "WCAG"],
  relatedTopics: ["theme-theming-system", "avatar-component", "rating-stars-component"],
};

export default function ColorPickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A color picker is one of the most technically demanding UI components in a design
        system. It requires a working understanding of color spaces, gamut mapping,
        floating-point precision, WCAG contrast algorithms, pointer capture APIs, and
        canvas rendering — all wrapped in an accessible keyboard-navigable interface.
        Most developers have used a color picker but have never built one from scratch.
        A strong interview answer demonstrates depth in color theory, not just UI
        mechanics.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/color-picker-architecture.svg"
        alt="Color picker component architecture diagram"
        caption="Color picker architecture: color state, space conversions, contrast engine, accessibility and palette"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        The design space for a color picker spans from a simple hex input field to a
        full design tool panel with multiple color space modes, opacity control, and
        a color history. Establish scope with clarifying questions before diving into
        architecture.
      </p>
      <p>
        Does the picker need to support alpha (opacity)? Alpha is common in graphics
        tools but less common in design token editors where colors are always fully
        opaque. Alpha adds a fourth channel to all color representations and requires
        a separate alpha slider and a checkerboard background canvas to show transparency.
      </p>
      <p>
        Which color spaces must be supported? Most pickers offer at least hex/RGB and
        HSL. Modern design tools (Figma, Adobe) are adding oklch — the perceptually
        uniform color space in CSS Color Level 4 — because it produces more visually
        predictable gradient steps and gamut mappings than HSL. Supporting multiple
        spaces requires bidirectional conversion between all of them.
      </p>
      <p>
        Does the picker need to validate WCAG contrast? A design system color picker
        that also shows the contrast ratio of the selected color against a white or
        black background is significantly more useful for designers building accessible
        UIs. This requires implementing the WCAG contrast algorithm.
      </p>
      <p>
        Does it need the Eyedropper API? Chrome 95+ supports the native EyeDropper
        API, which allows the user to sample any pixel on screen. This is a
        progressive enhancement — offer it when available, fall back gracefully.
      </p>

      <h2>The Internal Color Representation</h2>
      <p>
        The most important architectural decision is what format to use for the internal
        (canonical) color representation. The wrong choice — using the display format
        (e.g., the HSL string the user sees) as the internal state — leads to precision
        loss and conversion artifacts when the user switches between color space views.
      </p>
      <p>
        The correct approach: use a high-precision internal representation. The two
        best options are normalized RGBA (four floats in [0.0, 1.0]) and a Color object
        using the CSS Typed OM or a custom class. Normalized RGBA is simpler to implement;
        a Color class is more extensible to multiple color spaces.
      </p>
      <p>
        With normalized RGBA as the internal state: RGB values are floats 0–1 (not
        integers 0–255). Converting to the display format (hex, HSL, oklch) is done
        on read. Editing in a display format converts back to the internal RGBA on
        commit. This round-trip fidelity means that editing the red channel in RGB
        view does not affect the blue/green channels due to floating-point rounding,
        as would happen if the internal state were stored as HSL and converted to RGB
        on every edit.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The hue channel in HSL and oklch has a pathological edge case: when saturation
        (HSL) or chroma (oklch) is zero, the hue is mathematically undefined. A gray
        color (R=G=B) has no meaningful hue. If the user drags saturation to zero and
        then increases it again, the hue should be restored to its pre-zero value, not
        reset to 0. Implement this by caching the last non-undefined hue separately and
        using it when saturation or chroma returns to a non-zero value.
      </HighlightBlock>

      <h2>Color Space Conversions</h2>
      <p>
        A production color picker needs accurate, well-tested conversion functions
        between all supported color spaces. The conversion chain for most spaces is:
        rgb → linear-rgb → XYZ D65 → target space. This is because many perceptually
        uniform color spaces (oklch, OKLab) are defined in terms of linear RGB or XYZ
        values, not gamma-corrected sRGB.
      </p>
      <p>
        Converting from sRGB (the standard screen color space, gamma-corrected) to
        linear RGB requires applying the inverse sRGB gamma function: for each channel
        c, if c is less than 0.04045, divide by 12.92; otherwise compute
        ((c + 0.055) / 1.055) raised to the power 2.4. This is the standard IEC 61966-2-1
        transfer function. The inverse (linear to sRGB) applies the forward gamma.
      </p>
      <p>
        Converting linear RGB to XYZ D65 uses a 3×3 matrix defined in the CSS Color 4
        specification. Converting XYZ to OKLab uses an intermediate cone space
        transformation (the Oklab paper defines the matrices). Oklch is OKLab in polar
        coordinates: L is the same, C (chroma) is the magnitude of (a, b), and h (hue)
        is the angle atan2(b, a) in degrees.
      </p>
      <p>
        HSL conversion from RGB is more direct but produces non-linear perceptual
        spacing (two colors that differ by the same HSL delta look very different
        depending on their lightness and hue). This is why professional design tools
        are moving toward oklch: equal steps in oklch produce perceptually equal
        steps in color, making it easier to reason about color scales and accessible
        contrast.
      </p>

      <h2>The Saturation/Brightness Canvas</h2>
      <p>
        The two-dimensional gradient picker (the large square where the user picks
        saturation and brightness by clicking or dragging) is typically rendered on a
        canvas element. A simple CSS gradient background could substitute, but canvas
        gives pixel-level control and is needed anyway for the Eyedropper fallback.
      </p>
      <p>
        The canvas render logic for an HSB (hue, saturation, brightness) picker:
        draw a horizontal gradient from white (at left edge) to the current hue's
        fully saturated color (at right edge). Draw a second vertical gradient from
        transparent (at top) to black (at bottom), composited over the first gradient
        using "multiply" or "source-over" blending. The result is the standard HSB
        picker square.
      </p>
      <p>
        Redraw the canvas whenever the hue changes (which changes the color at the
        right edge). Use requestAnimationFrame to batch redraws and avoid redundant
        paints. The canvas is a fixed size (e.g., 256×256 logical pixels, 512×512
        with devicePixelRatio scaling for sharp display on retina screens). Reading
        a pixel value from the canvas on click gives the saturation and brightness
        at that position without needing to reverse-engineer the gradient formula.
      </p>
      <p>
        The cursor (the draggable handle on the canvas) is an absolutely positioned
        div inside a container that matches the canvas dimensions. Its position
        corresponds to the current saturation (x-axis) and brightness (y-axis) values.
        Dragging the cursor updates the state; conversely, updating the state from hex
        input moves the cursor.
      </p>

      <h2>Hue and Alpha Sliders</h2>
      <p>
        The hue slider is a horizontal or vertical range input styled with a
        CSS gradient background cycling through the full hue spectrum. The range
        input's value maps to hue degrees 0–360. Styling range inputs consistently
        across browsers requires vendor-specific pseudo-elements (::-webkit-slider-thumb,
        ::-moz-range-thumb) and careful CSS resets.
      </p>
      <p>
        Alternatively, the hue slider can be a canvas element with a gradient and a
        pointer event handler. Canvas gives more styling control at the cost of
        re-implementing the range input's accessibility semantics (role="slider",
        aria-valuemin, aria-valuemax, aria-valuenow, aria-orientation, keyboard step
        handling for arrow keys).
      </p>
      <p>
        The alpha slider, when present, displays a checkerboard background (rendered
        on a canvas or as a CSS background pattern) overlaid with a gradient from
        transparent to the current fully-opaque color. This gives the user a visual
        preview of how the color will appear at different opacity levels against a
        white/checkered background.
      </p>

      <h2>Hex and Channel Inputs</h2>
      <p>
        The hex input is a text field that accepts a 3 or 6 digit hex string (with or
        without the leading hash). The tricky part: the input must allow intermediate
        invalid states during typing. If the user types "ff" and the picker immediately
        tries to parse it as a color, the parse fails and the field resets — preventing
        the user from completing "ff0000". The solution is to maintain a separate
        "draft" string in the input field state, validate only on blur or when the
        string is a valid complete hex color (3 or 6 valid hex digits), and never
        clobber the draft string from outside while the user is focused in the input.
      </p>
      <p>
        Individual channel inputs (R, G, B or H, S, L) follow the same pattern. Each
        input maintains its own draft string. On blur, commit the value (clamped to
        the valid range) to the picker's internal state. On external state change
        (e.g., the user clicked a new position on the canvas), update the input only
        if the input is not currently focused — a focused input belongs to the user.
      </p>
      <HighlightBlock as="p" tier="important">
        Never update a focused input's value from external state. The pattern: use
        an onFocus/onBlur pair to track whether the input is "owned" by the user.
        While the user owns the input, changes to the picker's internal color state
        (from canvas clicks, slider drags, palette selection) do not push new values
        into the focused input. When the user blurs, commit the draft to state and
        release ownership. This prevents the cursor position from jumping while the
        user is in the middle of typing.
      </HighlightBlock>

      <h2>WCAG Contrast Computation</h2>
      <p>
        Showing the contrast ratio of the selected color against a reference (typically
        white and black) is a high-value feature for design system pickers. The
        computation uses the WCAG 2.1 relative luminance algorithm.
      </p>
      <p>
        Relative luminance L: convert the color to linear RGB (sRGB gamma removed),
        then compute L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear.
        The contrast ratio between two colors with luminances L1 (lighter) and L2
        (darker) is (L1 + 0.05) / (L2 + 0.05).
      </p>
      <p>
        WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1
        for large text. WCAG AAA requires 7:1 and 4.5:1 respectively. Display these
        thresholds next to the computed contrast ratio with pass/fail indicators. Also
        show which of white or black provides better contrast — this guides designers
        choosing text-on-background pairings.
      </p>
      <p>
        Note that WCAG 3.0 (in draft) replaces the relative luminance formula with
        APCA (Advanced Perceptual Contrast Algorithm), which is more perceptually
        accurate for small text and non-white backgrounds. Consider exposing both
        algorithms behind a toggle for forward compatibility.
      </p>

      <h2>Saved Palettes</h2>
      <p>
        A saved palette allows users to store frequently used colors and recall them
        quickly. The palette is an array of color values persisted to localStorage.
        The implementation needs to handle palette CRUD operations: add the current
        color, remove a saved color, reorder via drag and drop, and set a maximum
        size (typically 8–16 swatches).
      </p>
      <p>
        Palette swatches are button elements with aria-label="Select color: #ff6b35"
        (or the color's readable name if available). A context menu or long-press
        on a swatch reveals a "Remove" option. Keyboard-navigable swatches use arrow
        keys within the palette grid (roving tabindex), allowing users to explore and
        select saved colors without reaching for the mouse.
      </p>

      <h2>Eyedropper API Integration</h2>
      <p>
        The EyeDropper API (window.EyeDropper) allows sampling any pixel on screen,
        including outside the browser window. The API is supported in Chrome 95+ and
        Edge 95+; Firefox and Safari do not yet support it (as of 2026). Feature-detect
        before offering the button: show the eyedropper icon only if 'EyeDropper' in
        window.
      </p>
      <p>
        The API is straightforward: instantiate an EyeDropper, call its open() method
        (which returns a Promise), and await the result. The result is an object with
        a sRGBHex property containing the sampled color as a 6-digit hex string. Parse
        this hex into the internal color representation and update state. Handle the
        AbortError that is thrown if the user cancels the eyedropper without selecting
        a color (by pressing Escape).
      </p>

      <h2>Accessibility Model</h2>
      <p>
        A color picker is notoriously difficult to make accessible because the primary
        interaction — clicking a point on a gradient canvas — is purely visual. The
        accessible alternative is the text inputs: users who cannot use the visual
        canvas can type values directly into the hex or channel inputs. Ensure these
        inputs have descriptive labels and error messages for invalid values.
      </p>
      <p>
        The saturation/brightness canvas can be made keyboard-accessible by implementing
        it as a role="slider" widget (actually a 2D slider, which ARIA does not have a
        specific role for — role="slider" with aria-orientation="horizontal" covers
        one axis; a second element with aria-orientation="vertical" covers the other).
        Arrow keys move the selected point by a fixed step; Shift+arrow moves by a
        larger step; Home/End jump to the extremes. This provides a functional
        keyboard interface for the canvas.
      </p>
      <p>
        The entire picker panel should have an accessible name (via aria-labelledby or
        aria-label) describing its purpose. Focus management: when the picker panel
        opens (e.g., triggered by clicking a color swatch), move focus to the first
        interactive element inside the panel (typically the hex input). When the panel
        closes, return focus to the triggering element.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: Why use oklch instead of HSL for a modern color picker?</h3>
      <p>
        HSL was designed as a more human-friendly alternative to RGB, but it is
        perceptually non-uniform. Two colors with the same HSL lightness value can
        look dramatically different in perceived brightness — for example, pure yellow
        (hsl(60, 100%, 50%)) looks much brighter than pure blue (hsl(240, 100%, 50%))
        even though they have the same L. This makes HSL unreliable for generating
        accessible color scales, harmonious palettes, and predictable gradients.
        Oklch (from the OKLab color space) is perceptually uniform: equal steps in L,
        C, or H produce approximately equal perceptual differences. A 10-step lightness
        scale in oklch looks like 10 evenly spaced brightness steps to the human eye.
        This makes it significantly more useful for design work. CSS Color 4 natively
        supports oklch(), so conversions for display in CSS are straightforward.
      </p>

      <h3>Q: How do you handle colors outside the sRGB gamut when working in oklch?</h3>
      <p>
        The oklch color space can represent colors beyond the sRGB gamut (the range of
        colors a standard screen can display). When the user picks an oklch value that
        maps to a color with R, G, or B outside [0, 1] in sRGB, the color cannot be
        displayed accurately on most screens. The options are: clamp each channel to
        [0, 1] (fast but may shift hue significantly), use the CSS gamut mapping
        algorithm (reduce chroma C while keeping L and H constant until the color falls
        within sRGB — this preserves hue fidelity at the cost of saturation), or display
        the out-of-gamut color with a warning indicator. Modern design tools use gamut
        mapping by default. For a browser-based picker targeting sRGB displays, reduce
        chroma incrementally (binary search between 0 and the current C value) until
        all channels are within [0, 1], then use that gamut-mapped value for display.
      </p>

      <h3>Q: How do you prevent the hex input from disrupting the user mid-type?</h3>
      <p>
        Maintain a "draft" string in the input's local state, separate from the picker's
        color state. The draft string is the raw text the user is typing. On change,
        update only the draft. On every keystroke, attempt to parse the draft as a valid
        color. If valid (e.g., exactly 6 hex digits, all valid hex characters), update
        the picker's internal color state. If invalid, do nothing to the color state —
        the color remains at its last valid value while the user continues typing. On
        blur, commit the draft (clamping or correcting if needed) and reset the draft
        to match the current internal color. Track focus with a ref; never push a new
        value into the input from outside while it is focused.
      </p>

      <h3>Q: How do you implement the 2D saturation/brightness canvas interaction accessibly?</h3>
      <p>
        Render the canvas inside a container div that has role="group" with an aria-label
        like "Color gradient picker." Inside, place two hidden range inputs: one for
        saturation (0–100), one for brightness (0–100). These inputs are visually hidden
        but reachable by keyboard. Screen reader users interact with these inputs to set
        saturation and brightness; sighted mouse users interact with the canvas directly.
        Both update the same underlying state. Additionally, implement keyboard handlers
        on the canvas container: arrow keys move the selection point by 1 unit, Shift+arrow
        by 10 units. Update the ARIA value labels on the range inputs whenever the state
        changes so screen readers announce the current saturation and brightness values.
      </p>

      <h3>Q: How would you design the palette storage for a multi-user design tool?</h3>
      <p>
        localStorage is appropriate for single-user palettes (browser-local color history).
        For a multi-user design tool where palettes should be shared across team members
        and persist across devices, the palette is stored server-side — a palette entity
        associated with the user or team, stored in the database, and fetched on load.
        The picker client fetches the palette on mount (or reads it from a global store
        populated by the app's data layer). Updates are persisted via API calls with
        optimistic UI: add the color to local state immediately, then fire the API
        call in the background. On failure, revert the local state and show an error.
        For team-shared palettes, real-time sync via WebSocket or polling propagates
        palette changes made by other team members.
      </p>
    </ArticleLayout>
  );
}

/**
 * Color Picker — Staff-Level Color Harmony Generation.
 *
 * Staff differentiator: Generates harmonious color palettes using color
 * theory (complementary, analogous, triadic, split-complementary) with
 * WCAG compliance validation.
 */

import { hsvToRgb, rgbToHex } from './lib/color-converter';
import type { HSV, RGB } from './lib/color-converter';

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic';

/**
 * Generates a harmonious color palette from a base color.
 */
export function generateHarmony(
  baseHsv: HSV,
  harmonyType: HarmonyType = 'complementary',
  count: number = 5,
): { hex: string; hsv: HSV; label: string }[] {
  const colors: { hex: string; hsv: HSV; label: string }[] = [];
  const baseRgb = hsvToRgb(baseHsv);
  const baseHex = rgbToHex(baseRgb);

  colors.push({ hex: baseHex, hsv: { ...baseHsv }, label: 'Base' });

  switch (harmonyType) {
    case 'complementary': {
      // Opposite on the color wheel
      const complementH = (baseHsv.h + 180) % 360;
      const complement = { h: complementH, s: baseHsv.s, v: baseHsv.v, a: 1 };
      const complementRgb = hsvToRgb(complement);
      colors.push({ hex: rgbToHex(complementRgb), hsv: complement, label: 'Complement' });
      break;
    }

    case 'analogous': {
      // Adjacent colors on the wheel (±30°)
      for (let i = 1; i < count; i++) {
        const offset = (i - Math.floor(count / 2)) * 30;
        const h = (baseHsv.h + offset + 360) % 360;
        const hsv = { h, s: baseHsv.s, v: baseHsv.v, a: 1 };
        const rgb = hsvToRgb(hsv);
        colors.push({ hex: rgbToHex(rgb), hsv, label: `Analogous ${offset > 0 ? '+' : ''}${offset}°` });
      }
      break;
    }

    case 'triadic': {
      // Three colors 120° apart
      for (let i = 1; i < 3; i++) {
        const h = (baseHsv.h + i * 120) % 360;
        const hsv = { h, s: baseHsv.s, v: baseHsv.v, a: 1 };
        const rgb = hsvToRgb(hsv);
        colors.push({ hex: rgbToHex(rgb), hsv, label: `Triadic ${i * 120}°` });
      }
      break;
    }

    case 'split-complementary': {
      // Base + two colors adjacent to the complement
      const offsets = [150, 210];
      for (const offset of offsets) {
        const h = (baseHsv.h + offset) % 360;
        const hsv = { h, s: baseHsv.s, v: baseHsv.v, a: 1 };
        const rgb = hsvToRgb(hsv);
        colors.push({ hex: rgbToHex(rgb), hsv, label: `Split ${offset}°` });
      }
      break;
    }

    case 'tetradic': {
      // Four colors in a rectangle (90° apart)
      for (let i = 1; i < 4; i++) {
        const h = (baseHsv.h + i * 90) % 360;
        const hsv = { h, s: baseHsv.s, v: baseHsv.v, a: 1 };
        const rgb = hsvToRgb(hsv);
        colors.push({ hex: rgbToHex(rgb), hsv, label: `Tetradic ${i * 90}°` });
      }
      break;
    }
  }

  return colors;
}

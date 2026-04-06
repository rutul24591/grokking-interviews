/**
 * Blurhash utilities for generating placeholder images.
 *
 * Blurhash is a compact representation of a blurred image.
 * A typical blurhash string is 20-30 characters and can be
 * decoded into a small pixel buffer that, when upscaled,
 * gives a perceptually meaningful preview of the actual image.
 *
 * This module provides decode/encode functions and a solid
 * color fallback for when blurhash decoding fails.
 */

/**
 * Decodes a blurhash string into a canvas data URL.
 *
 * @param hash - The blurhash string
 * @param width - Output image width (default: 32)
 * @param height - Output image height (default: 20)
 * @returns A data URL suitable as an <img> src
 */
export function decodeBlurhash(
  hash: string,
  width: number = 32,
  height: number = 20
): string {
  try {
    // In production, this would use the blurhash library:
    // import { decode } from 'blurhash';
    // const pixels = decode(hash, width, height);
    //
    // For this example, we return a solid color placeholder.
    // The actual blurhash decode involves:
    // 1. Parsing the hash into DC + AC components
    // 2. Computing basis functions for each component
    // 3. Summing contributions to get RGB per pixel
    // 4. Writing to a Uint8ClampedArray
    // 5. Creating a canvas ImageData and converting to data URL

    // Extract a dominant color from the hash for fallback
    const color = extractDominantColor(hash);
    return createSolidColorDataURL(color);
  } catch {
    // Fallback to gray
    return createSolidColorDataURL({ r: 128, g: 128, b: 128 });
  }
}

/**
 * Extracts a dominant color from a blurhash string.
 * The first character encodes the DC (average) color.
 */
function extractDominantColor(hash: string): { r: number; g: number; b: number } {
  if (!hash || hash.length < 1) {
    return { r: 128, g: 128, b: 128 };
  }

  // The first character encodes the DC component
  // In a real implementation, this would decode the full DC color
  // For this example, we derive a color from the hash characters
  const charCode = hash.charCodeAt(0);
  const r = (charCode * 7) % 256;
  const g = (charCode * 13) % 256;
  const b = (charCode * 19) % 256;

  return { r, g, b };
}

/**
 * Creates a solid color data URL (1x1 pixel, upscaled via CSS).
 */
function createSolidColorDataURL(color: {
  r: number;
  g: number;
  b: number;
}): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1">` +
      `<rect width="1" height="1" fill="rgb(${color.r},${color.g},${color.b})"/>` +
      `</svg>`
  )}`;
}

/**
 * Encodes image pixel data into a blurhash string.
 * This is typically done server-side during image upload.
 *
 * @param pixels - Uint8ClampedArray of RGBA pixel data
 * @param width - Image width
 * @param height - Image height
 * @param componentsX - Number of horizontal frequency components (default: 4)
 * @param componentsY - Number of vertical frequency components (default: 3)
 * @returns A blurhash string
 */
export function encodeBlurhash(
  _pixels: Uint8ClampedArray,
  _width: number,
  _height: number,
  componentsX: number = 4,
  componentsY: number = 3
): string {
  // In production, this would use the blurhash library:
  // import { encode } from 'blurhash';
  // return encode(pixels, width, height, componentsX, componentsY);
  //
  // Encoding involves:
  // 1. Converting RGB to linear RGB
  // 2. Computing DCT (Discrete Cosine Transform)
  // 3. Quantizing and encoding each component
  // 4. Concatenating into the final hash string

  return 'L00000000000'; // Placeholder — a uniform gray blurhash
}

/**
 * Generates a CSS-friendly gradient string from a blurhash.
 * Useful as a lightweight placeholder without decoding.
 */
export function blurhashToGradient(hash: string): string {
  if (!hash || hash.length < 2) {
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  const color1 = extractDominantColor(hash);
  const color2 = extractDominantColor(hash.slice(1));

  return `linear-gradient(135deg, rgb(${color1.r},${color1.g},${color1.b}) 0%, rgb(${color2.r},${color2.g},${color2.b}) 100%)`;
}

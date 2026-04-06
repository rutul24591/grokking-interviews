/**
 * Generates initials from a person's name.
 *
 * Handles:
 * - Empty or whitespace-only names (returns null)
 * - Single-word names (first letter only)
 * - Multi-word names (first letter of first and last word)
 * - CJK characters (each character is one unit, take first 2)
 * - Emoji (grapheme-aware slicing via Intl.Segmenter)
 * - Names with leading/trailing/excess whitespace
 *
 * Returns uppercase string, maximum 2 characters, or null.
 */
export function generateInitials(name: string | undefined | null): string | null {
  if (!name || name.trim().length === 0) {
    return null;
  }

  const trimmed = name.trim();

  // Check if the name is entirely CJK characters
  // CJK Unified Ideographs: U+4E00 to U+9FFF
  // CJK extensions and compatibility ranges are also covered
  const cjkRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;

  // If the first character is CJK, treat the whole name as potentially CJK
  // Take first 2 characters directly (each CJK char is semantically one unit)
  if (cjkRegex.test(trimmed.charAt(0))) {
    return extractCJKInitials(trimmed);
  }

  // For Latin-script names, split on whitespace
  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return null;
  }

  if (words.length === 1) {
    // Single word: take first character
    return safeFirstChar(words[0]).toUpperCase();
  }

  // Multiple words: first char of first word + first char of last word
  const first = safeFirstChar(words[0]);
  const last = safeFirstChar(words[words.length - 1]);

  return (first + last).toUpperCase();
}

/**
 * Extract initials from a CJK name.
 * Each CJK character is one logical unit. Take first 2 characters.
 */
function extractCJKInitials(name: string): string {
  // Use Intl.Segmenter for grapheme-aware slicing if available
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(name));
    const initials = segments
      .slice(0, 2)
      .map((seg) => seg.segment)
      .join('');
    return initials.toUpperCase();
  }

  // Fallback: take first 2 characters directly
  // This works for most CJK characters (they are single code units or surrogate pairs)
  return name.slice(0, 2).toUpperCase();
}

/**
 * Safely extract the first grapheme cluster from a string.
 * Uses Intl.Segmenter for emoji and surrogate-pair awareness.
 */
function safeFirstChar(str: string): string {
  if (!str || str.length === 0) {
    return '';
  }

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const first = segmenter.segment(str)[Symbol.iterator]().next();
    if (!first.done) {
      return first.value.segment;
    }
  }

  return str.charAt(0);
}

/**
 * Strips control characters (ASCII 0-31) from a name string.
 * Used for sanitization before processing.
 */
export function sanitizeName(name: string): string {
  return name.replace(/[\x00-\x1F]/g, '').trim();
}
